
import type { Activity, UserProfile, SessionActivityRecord } from '../types';
import { SyllabicLevel, ActivityType, LevelId, Difficulty } from '../types';

export const checkConnection = async (): Promise<boolean> => {
    try {
        const response = await fetch('/api/health');
        return response.ok;
    } catch (e) {
        return false;
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    });
    
    if (response.ok) {
        // Since we don't have a real image gen model, we return a nice placeholder based on prompt
        return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/400/400`;
    }
    return '';
  } catch (error) {
    console.error("Error generating image:", error);
    return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/400/400`;
  }
};

const FALLBACK_ACTIVITIES: Record<Difficulty, Activity[]> = {
    [Difficulty.EASY]: [
        {
            id: 'f1',
            type: ActivityType.CHOOSE_WORD,
            instruction: 'Elige la palabra correcta para la imagen.',
            options: ['Pato', 'Gato', 'Perro', 'Oso'],
            correctAnswer: 'Pato',
            word: 'Pato',
            levelId: LevelId.EASY,
            imageUrl: 'https://picsum.photos/seed/duck/400/400'
        },
        {
            id: 'f2',
            type: ActivityType.SAY_NAME,
            instruction: '¿Cómo se llama lo que ves en la imagen?',
            correctAnswer: 'Manzana',
            word: 'Manzana',
            levelId: LevelId.EASY,
            imageUrl: 'https://picsum.photos/seed/apple/400/400'
        }
    ],
    [Difficulty.MEDIUM]: [
        {
            id: 'm1',
            type: ActivityType.REPEAT_WORD,
            instruction: 'Escucha con atención y repite la palabra.',
            correctAnswer: 'Mariposa',
            word: 'Mariposa',
            levelId: LevelId.MEDIUM,
            imageUrl: 'https://picsum.photos/seed/butterfly/400/400'
        },
        {
            id: 'm2',
            type: ActivityType.REPEAT_SYLLABLES,
            instruction: 'Vamos a decir esta palabra por trocitos. Repite las sílabas.',
            correctAnswer: 'ca-sa',
            word: 'Casa',
            syllables: ['ca', 'sa'],
            levelId: LevelId.MEDIUM,
            imageUrl: 'https://picsum.photos/seed/house/400/400'
        }
    ],
    [Difficulty.HARD]: [
        {
            id: 'h1',
            type: ActivityType.COMPLETE_WORD,
            instruction: 'A esta palabra le falta un trocito. ¿Puedes completarla?',
            correctAnswer: 'ri',
            word: 'ma-po-sa',
            fullWord: 'mariposa',
            levelId: LevelId.HARD,
            imageUrl: 'https://picsum.photos/seed/butterfly/400/400'
        },
        {
            id: 'h2',
            type: ActivityType.MISSING_LETTER,
            instruction: '¿Qué letra falta en esta palabra?',
            options: ['r', 'l', 's'],
            correctAnswer: 'r',
            word: 'pe_ro',
            fullWord: 'perro',
            levelId: LevelId.HARD,
            imageUrl: 'https://picsum.photos/seed/dog/400/400'
        }
    ]
};

export const generateActivity = async (difficulty: Difficulty, profile: UserProfile, sessionHistory?: SessionActivityRecord[]): Promise<Activity> => {
    const { nickname, name } = profile;
    const displayName = nickname || name;
    
    let levelId = LevelId.EASY;
    if (difficulty === Difficulty.MEDIUM) levelId = LevelId.MEDIUM;
    if (difficulty === Difficulty.HARD) levelId = LevelId.HARD;

    try {
        const easyGames = [ActivityType.CHOOSE_WORD, ActivityType.SAY_NAME, ActivityType.FIND_OPTION];
        const mediumGames = [ActivityType.REPEAT_WORD, ActivityType.LISTEN_SAY, ActivityType.REPEAT_SYLLABLES];
        const hardGames = [ActivityType.COMPLETE_WORD, ActivityType.MISSING_LETTER, ActivityType.BUILD_FROM_IMAGE];

        let activityType: ActivityType;
        let specificPrompt = '';
        let customInstruction = '';

        if (levelId === LevelId.EASY) {
            activityType = easyGames[Math.floor(Math.random() * easyGames.length)];
            if (activityType === ActivityType.CHOOSE_WORD) {
                customInstruction = `¡Hola ${displayName}! Elige la palabra correcta para la imagen.`;
                specificPrompt = "Juego: Elige la palabra correcta. Proporciona 4 opciones simples.";
            } else if (activityType === ActivityType.SAY_NAME) {
                customInstruction = `¡Hola ${displayName}! ¿Cómo se llama lo que ves en la imagen?`;
                specificPrompt = "Juego: Di el nombre de la imagen. El niño debe decir el nombre del objeto.";
            } else {
                customInstruction = `¡Hola ${displayName}! Encuentra la opción que corresponde a la imagen.`;
                specificPrompt = "Juego: Encuentra la opción correcta. Similar a elegir palabra pero con distractores fonológicos (ej: 'pato' vs 'gato').";
            }
        } else if (levelId === LevelId.MEDIUM) {
            activityType = mediumGames[Math.floor(Math.random() * mediumGames.length)];
            if (activityType === ActivityType.REPEAT_WORD) {
                customInstruction = `¡Hola ${displayName}! Escucha con atención y repite la palabra.`;
                specificPrompt = "Juego: Repite la palabra. El niño debe escuchar y repetir una palabra clara.";
            } else if (activityType === ActivityType.LISTEN_SAY) {
                customInstruction = `¡Hola ${displayName}! Escucha el sonido y dime qué es.`;
                specificPrompt = "Juego: Escucha y di. Describe un objeto por su sonido o función y el niño dice el nombre.";
            } else {
                customInstruction = `¡Hola ${displayName}! Vamos a decir esta palabra por trocitos. Repite las sílabas.`;
                specificPrompt = "Juego: Repite sílabas. Divide una palabra en sílabas (ej: 'ca-sa').";
            }
        } else {
            activityType = hardGames[Math.floor(Math.random() * hardGames.length)];
            if (activityType === ActivityType.COMPLETE_WORD) {
                customInstruction = `¡Hola ${displayName}! A esta palabra le falta un trocito. ¿Puedes completarla?`;
                specificPrompt = "Juego: Completa la palabra. Falta una sílaba (ej: 'ma-po-sa' falta 'ri').";
            } else if (activityType === ActivityType.MISSING_LETTER) {
                customInstruction = `¡Hola ${displayName}! ¿Qué letra falta en esta palabra?`;
                specificPrompt = "Juego: Di la letra faltante. Falta una sola letra (ej: 'pe_ro' falta 'r'). Proporciona 3 opciones de letras.";
            } else {
                customInstruction = `¡Hola ${displayName}! Construye la palabra completa usando la imagen.`;
                specificPrompt = "Juego: Construye la palabra desde la imagen. El niño debe decir o formar la palabra completa viendo la imagen.";
            }
        }

        const prompt = `
            Eres un experto en terapia de lenguaje infantil. Crea una actividad para un niño de nivel '${difficulty}'.
            
            ${specificPrompt}
            
            REGLAS:
            1. La instrucción DEBE ser exactamente: "${customInstruction}"
            2. El tipo DEBE ser: "${activityType}"
            3. Usa palabras que sean fáciles de ilustrar y comunes para niños.
            4. Para 'repeat_syllables', incluye el array 'syllables'.
            5. Para 'missing_letter', incluye 'options' con 3 letras.
            
            Responde solo JSON.
        `;

        const response = await fetch('/api/ai/activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, difficulty })
        });

        if (!response.ok) throw new Error("Server failed to generate activity");

        const activityData = await response.json();
        
        // Generar imagen para la palabra
        const imageUrl = await generateImage(activityData.word || activityData.fullWord || activityData.correctAnswer);
        
        return {
            ...activityData,
            id: Math.random().toString(36).substr(2, 9),
            levelId,
            imageUrl,
            type: activityType
        };
    } catch (error) {
        console.error("Error generating activity, using fallback:", error);
        const fallbacks = FALLBACK_ACTIVITIES[difficulty];
        const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        return {
            ...fallback,
            id: Math.random().toString(36).substr(2, 9),
            levelId
        };
    }
};

export const generateFeedback = async (isCorrect: boolean, displayName: string, activity: Activity, userAnswer: string): Promise<string> => {
    try {
        const { instruction, correctAnswer } = activity;
        const prompt = isCorrect
            ? `Genera un mensaje muy corto, positivo y de celebración para ${displayName}. Una sola oración simple.`
            : `Genera un feedback gentil y educativo para ${displayName}. La instrucción fue "${instruction}", respondió "${userAnswer}" y era "${correctAnswer}". Explica la regla sin usar palabras negativas.`;

        const response = await fetch('/api/ai/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) throw new Error("Server failed to generate feedback");

        const data = await response.json();
        return data.text.trim();
    } catch (error) {
        console.error("Error generating feedback, using fallback:", error);
        if (isCorrect) {
            return `¡Excelente trabajo, ${displayName}!`;
        } else {
            return `¡Buen intento, ${displayName}! La respuesta era ${activity.correctAnswer}. ¡Sigue practicando!`;
        }
    }
};

export const generateSupportStrategies = async (profileData: Omit<UserProfile, 'id' | 'supportStrategies' | 'score' | 'correctAnswersStreak' | 'history'>): Promise<string[]> => {
    try {
        const { age, learningStyle, specialNeedType, focusAreas } = profileData;
        const prompt = `Genera 2 o 3 estrategias de apoyo para un niño de ${age} años, estilo ${learningStyle}, necesidad ${specialNeedType}, áreas ${focusAreas.join(', ')}. Responde solo un array JSON de strings.`;

        const response = await fetch('/api/ai/strategies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) throw new Error("Server failed to generate strategies");

        return await response.json();
    } catch (error) {
        console.error("Error generating support strategies, using fallback:", error);
        return [
            "Usar apoyos visuales constantes durante las actividades.",
            "Realizar sesiones cortas de 10-15 minutos para mantener el enfoque.",
            "Reforzar positivamente cada intento de comunicación oral."
        ];
    }
};

export const generateSessionSummary = async (displayName: string, sessionHistory: SessionActivityRecord[]): Promise<string> => {
    try {
        const activitiesCompleted = sessionHistory.length;
        const correctAnswers = sessionHistory.filter((a: any) => a.isCorrect).length;
        const prompt = `Genera un mensaje de felicitación entusiasta para ${displayName} por completar ${activitiesCompleted} actividades con ${correctAnswers} aciertos. Enfócate en el esfuerzo.`;

        const response = await fetch('/api/ai/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) throw new Error("Server failed to generate summary");

        const data = await response.json();
        return data.text.trim();
    } catch (error) {
        console.error("Error generating session summary, using fallback:", error);
        return `¡Increíble trabajo hoy, ${displayName}! Completaste tu sesión de práctica con mucho esfuerzo. ¡Nos vemos en la próxima aventura!`;
    }
};
