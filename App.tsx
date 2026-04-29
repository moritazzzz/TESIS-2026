
import React, { useState, useCallback, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, GameState, Activity, AvatarExpression, ThemeColor, Difficulty, SessionActivityRecord, SessionRecord, AssistantVoice, FontSize, Badge, SyllabicLevel, MapNode, NodeType } from './types';
import { generateActivity, generateFeedback, generateSupportStrategies, generateSessionSummary } from './services/geminiService';
import { loadProfiles, saveProfiles } from './services/profileService';
import { loadReports, saveReports } from './services/reportService';
import ProfileSetupScreen from './components/ProfileSetupScreen';
import ProfileSelectionScreen from './components/ProfileSelectionScreen';
import ActivityScreen from './components/ActivityScreen';
import LoadingSpinner from './components/LoadingSpinner';
import { LEVEL_UP_SCORE, AVAILABLE_BADGES } from './constants';
import SwitchProfileIcon from './components/icons/SwitchProfileIcon';
import ManageProfilesScreen from './components/ManageProfilesScreen';
import WelcomeScreen from './components/WelcomeScreen';
import WorldSelectionScreen from './components/WorldSelectionScreen';
import NodeMapScreen from './components/NodeMapScreen';
import SessionEndScreen from './components/SessionEndScreen';
import PreferencesScreen from './components/PreferencesScreen';
import { SoundProvider, SoundContext } from './contexts/SoundContext';
import SparkleCelebration from './components/SparkleCelebration';
import FullscreenButton from './components/FullscreenButton';
import Avatar from './components/Avatar';
import MuteButton from './components/MuteButton';
import VolumeControl from './components/VolumeControl';
import CreditsScreen from './components/CreditsScreen';
import SessionHistoryScreen from './components/SessionHistoryScreen';
import BackgroundMusic from './components/BackgroundMusic';
import MusicNoteIcon from './components/icons/MusicNoteIcon';
import MusicOffIcon from './components/icons/MusicOffIcon';
import HomeIcon from './components/icons/HomeIcon';
import BadgeNotification from './components/BadgeNotification';
import TherapistDashboard from './components/TherapistDashboard';
import { TherapistReport } from './types';


const THEME_CLASSES: Record<ThemeColor, { bg: string; text: string; button: string }> = {
  [ThemeColor.SKY]: { bg: 'bg-sky-100', text: 'text-sky-600', button: 'bg-sky-500 hover:bg-sky-600' },
  [ThemeColor.MINT]: { bg: 'bg-emerald-50', text: 'text-emerald-600', button: 'bg-emerald-500 hover:bg-emerald-600' },
  [ThemeColor.LAVENDER]: { bg: 'bg-violet-100', text: 'text-violet-600', button: 'bg-violet-500 hover:bg-violet-600' },
  [ThemeColor.PEACH]: { bg: 'bg-orange-100', text: 'text-orange-600', button: 'bg-orange-500 hover:bg-orange-600' },
  [ThemeColor.ROSE]: { bg: 'bg-rose-100', text: 'text-rose-600', button: 'bg-rose-500 hover:bg-rose-600' },
  [ThemeColor.AMBER]: { bg: 'bg-amber-100', text: 'text-amber-600', button: 'bg-amber-500 hover:bg-amber-600' },
  [ThemeColor.CYAN]: { bg: 'bg-cyan-100', text: 'text-cyan-600', button: 'bg-cyan-500 hover:bg-cyan-600' },
  [ThemeColor.FUCHSIA]: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-600', button: 'bg-fuchsia-500 hover:bg-fuchsia-600' },
};

const FONT_SIZE_CLASSES: Record<FontSize, string> = {
  [FontSize.NORMAL]: 'font-size-normal',
  [FontSize.MEDIUM]: 'font-size-medium',
  [FontSize.LARGE]: 'font-size-large',
};

// Wrapper component to consume context within App logic
const MusicToggle: React.FC<{ theme: { button: string } }> = ({ theme }) => {
    const { isMusicEnabled, toggleMusic } = useContext(SoundContext);
    
    return (
        <button
            onClick={toggleMusic}
            className={`p-2 md:p-3 rounded-full shadow-lg transition-colors z-10 ${theme.button} text-white transform hover:scale-105`}
            aria-label={isMusicEnabled ? 'Desactivar música de fondo' : 'Activar música de fondo'}
        >
            {isMusicEnabled ? <MusicNoteIcon /> : <MusicOffIcon />}
        </button>
    );
};


import ConnectionStatus from './components/ConnectionStatus';

import { speak, enableAudio } from './services/voiceService';

function AppContent() {
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>([]);
  const [allReports, setAllReports] = useState<TherapistReport[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [editingPreferencesForProfile, setEditingPreferencesForProfile] = useState<UserProfile | null>(null);
  const [viewingHistoryForProfile, setViewingHistoryForProfile] = useState<UserProfile | null>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [selectedWorld, setSelectedWorld] = useState<Difficulty | null>(null);
  const [currentNodes, setCurrentNodes] = useState<MapNode[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [avatarSpeech, setAvatarSpeech] = useState<string>('');
  const [avatarExpression, setAvatarExpression] = useState<AvatarExpression>(AvatarExpression.NEUTRAL);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [sessionActivityCount, setSessionActivityCount] = useState(0);
  const [currentSessionHistory, setCurrentSessionHistory] = useState<SessionActivityRecord[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isWaitingForContinue, setIsWaitingForContinue] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [newlyEarnedBadge, setNewlyEarnedBadge] = useState<Badge | null>(null);
  const [nextActivity, setNextActivity] = useState<Activity | null>(null);
  const [sessionDurationLimit, setSessionDurationLimit] = useState(15);

  useEffect(() => {
    const handleFirstInteraction = () => {
      enableAudio();
      // Trigger speech if there's pending speech
      if (avatarSpeech) {
        const avatarVoice = currentUserProfile?.assistantVoice ?? AssistantVoice.FEMALE;
        speak(avatarSpeech, avatarVoice);
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [avatarSpeech, currentUserProfile]);

  useEffect(() => {
    const initData = async () => {
      const profiles = await loadProfiles();
      const reports = await loadReports();
      setAllProfiles(profiles);
      setAllReports(reports);
      setGameState(GameState.WELCOME);
      setIsLoading(false);
    };
    initData();
  }, []);
  
  useEffect(() => {
    switch (gameState) {
      case GameState.WELCOME:
        setAvatarSpeech("¡Bienvenido a HABLA, JUEGA Y APRENDE! ¿Estás listo para jugar?");
        setAvatarExpression(AvatarExpression.HAPPY);
        break;
      case GameState.PROFILE_SELECTION:
        setAvatarSpeech("¡Hola de nuevo! Elige tu perfil para empezar a jugar o crea uno nuevo.");
        setAvatarExpression(AvatarExpression.HAPPY);
        break;
      case GameState.PROFILE_SETUP:
        if (editingProfile) {
          setAvatarSpeech(`¡Vamos a actualizar el perfil de ${editingProfile.name}! ¿Qué te gustaría cambiar?`);
        } else {
          setAvatarSpeech("¡Genial, un nuevo aventurero! Completa tu perfil para que pueda conocerte mejor.");
        }
        setAvatarExpression(AvatarExpression.NEUTRAL);
        break;
      case GameState.MANAGE_PROFILES:
        setAvatarSpeech("Aquí puedes editar los detalles, preferencias e historial de cada aventurero.");
        setAvatarExpression(AvatarExpression.NEUTRAL);
        break;
      case GameState.WORLD_SELECTION:
        setAvatarSpeech("¡Elige tu mundo de aventuras! Cada uno tiene retos diferentes.");
        setAvatarExpression(AvatarExpression.HAPPY);
        break;
      case GameState.LEVEL_MAP:
        setAvatarSpeech("¡Mira tu mapa de aventuras! Elige un nivel para empezar.");
        setAvatarExpression(AvatarExpression.HAPPY);
        break;
      case GameState.PREFERENCES:
        if (editingPreferencesForProfile) {
            setAvatarSpeech(`¡Perfecto! Ajustemos las preferencias de ${editingPreferencesForProfile.name} para que la aventura sea aún mejor.`);
        }
        setAvatarExpression(AvatarExpression.NEUTRAL);
        break;
      case GameState.SESSION_END:
        setAvatarSpeech("¡Lo hiciste increíble! Mira todo lo que has logrado hoy.");
        setAvatarExpression(AvatarExpression.HAPPY);
        break;
      case GameState.THERAPIST_DASHBOARD:
        setAvatarSpeech("Bienvenido al panel de administración. Aquí puedes gestionar los perfiles y revisar el progreso de los niños.");
        setAvatarExpression(AvatarExpression.NEUTRAL);
        break;
    }
  }, [gameState, editingProfile, editingPreferencesForProfile]);


  useEffect(() => {
    const persistData = async () => {
      if (!isLoading) {
        await saveProfiles(allProfiles);
        await saveReports(allReports);
      }
    };
    persistData();
  }, [allProfiles, allReports, isLoading]);

  const handleAvatarHelp = (text: string) => {
      setAvatarSpeech(text);
      setAvatarExpression(AvatarExpression.ENCOURAGING);
  };

  const handleSaveProfile = async (profileData: Omit<UserProfile, 'id' | 'supportStrategies' | 'score' | 'correctAnswersStreak' | 'history'>) => {
    setGameState(GameState.LOADING);
    
    if (editingProfile) {
        const updatedProfile = { ...editingProfile, ...profileData };
        setAllProfiles(allProfiles.map(p => p.id === editingProfile.id ? updatedProfile : p));
        setEditingProfile(null);
        setGameState(GameState.MANAGE_PROFILES);
    } else {
        setAvatarSpeech(`¡Hola ${profileData.nickname}! Estoy preparando todo para ti...`);
        try {
          const strategies = await generateSupportStrategies(profileData);
          const newProfile: UserProfile = {
            id: crypto.randomUUID(),
            ...profileData,
            supportStrategies: strategies,
            score: 0,
            correctAnswersStreak: 0,
            currentLevel: 1, // Initialize to 1
            unlockedLevels: [1], // Initialize with level 1 unlocked
            worldProgress: {
              [Difficulty.EASY]: { worldId: Difficulty.EASY, completedNodes: [], unlockedNodes: ['node_0'], currentScore: 0 },
              [Difficulty.MEDIUM]: { worldId: Difficulty.MEDIUM, completedNodes: [], unlockedNodes: ['node_0'], currentScore: 0 },
              [Difficulty.HARD]: { worldId: Difficulty.HARD, completedNodes: [], unlockedNodes: ['node_0'], currentScore: 0 },
            },
            history: [],
            badges: [], // Init empty badges
          };
          setAllProfiles(prevProfiles => [...prevProfiles, newProfile]);
        } catch (error) {
          console.error("Error setting up profile:", error);
          setAvatarSpeech("Oh, oh. Hubo un problema. Por favor, intenta de nuevo.");
          setGameState(GameState.PROFILE_SETUP);
          return;
        }
        setGameState(GameState.PROFILE_SELECTION);
    }
  };

  const handleStartEdit = (profileId: string) => {
    const profileToEdit = allProfiles.find(p => p.id === profileId);
    if (profileToEdit) {
        setEditingProfile(profileToEdit);
        setGameState(GameState.PROFILE_SETUP);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingProfile(null);
    setGameState(GameState.MANAGE_PROFILES)
  }

  const handleProfileSelect = (profileId: string) => {
    const selectedProfile = allProfiles.find(p => p.id === profileId);
    if (selectedProfile) {
      // Ensure badges field exists for older profiles
      if (!selectedProfile.badges) selectedProfile.badges = [];
      
      setCurrentUserProfile(selectedProfile);
      setSessionDurationLimit(selectedProfile.dailySessionDuration || 15);
      setSessionActivityCount(0);
      setCurrentSessionHistory([]);
      setSessionStartTime(new Date().toISOString());
      setGameState(GameState.WORLD_SELECTION);
    }
  };

  const handleSelectWorld = (world: Difficulty) => {
    if (!currentUserProfile) return;
    setSelectedWorld(world);
    // Generate nodes for this world
    const nodes = generateNodesForWorld(world, currentUserProfile);
    setCurrentNodes(nodes);
    setGameState(GameState.LEVEL_MAP);
  };

  const generateNodesForWorld = (world: Difficulty, profile: UserProfile | null): MapNode[] => {
    const progress = profile?.worldProgress?.[world] || { worldId: world, completedNodes: [], unlockedNodes: ['node_0'], currentScore: 0 };
    
    // Create a path: Activity -> Activity -> Chest -> Activity -> Final
    const nodeTypes = [NodeType.ACTIVITY, NodeType.ACTIVITY, NodeType.CHEST, NodeType.ACTIVITY, NodeType.FINAL];
    
    return nodeTypes.map((type, i) => {
      const id = `node_${i}`;
      return {
        id,
        type,
        isUnlocked: progress.unlockedNodes.includes(id),
        isCompleted: progress.completedNodes.includes(id),
        position: { x: 0, y: i * 150 },
      };
    });
  };

  const handleSelectNode = async (node: MapNode) => {
    if (!node.isUnlocked || node.isCompleted) return;
    
    if (node.type === NodeType.ACTIVITY) {
      if (nextActivity) {
        setCurrentActivity(nextActivity);
        setNextActivity(null);
        setGameState(GameState.ACTIVITY);
        // Prefetch the next one
        fetchNewActivity(true);
      } else {
        setGameState(GameState.LOADING);
        try {
          const activity = await generateActivity(currentUserProfile!.preferredDifficulty || Difficulty.EASY, currentUserProfile!);
          setCurrentActivity(activity);
          setGameState(GameState.ACTIVITY);
        } catch (error) {
          console.error("Error generating activity:", error);
          setGameState(GameState.LEVEL_MAP);
        }
      }
    } else if (node.type === NodeType.CHEST || node.type === NodeType.FINAL) {
      // Simulate reward
      handleNodeCompletion(node.id);
    }
  };

  const handleNodeCompletion = (nodeId: string) => {
    if (!currentUserProfile || !selectedWorld) return;

    const currentWorldProgress = currentUserProfile.worldProgress[selectedWorld] || { worldId: selectedWorld, completedNodes: [], unlockedNodes: ['node_0'], currentScore: 0 };
    const completedNodes = [...currentWorldProgress.completedNodes];
    if (!completedNodes.includes(nodeId)) {
      completedNodes.push(nodeId);
    }

    // Unlock next node
    const nodeIndex = parseInt(nodeId.split('_')[1]);
    const nextNodeId = `node_${nodeIndex + 1}`;
    const unlockedNodes = [...currentWorldProgress.unlockedNodes];
    if (!unlockedNodes.includes(nextNodeId)) {
      unlockedNodes.push(nextNodeId);
    }

    const updatedProfile = {
      ...currentUserProfile,
      worldProgress: {
        ...currentUserProfile.worldProgress,
        [selectedWorld]: {
          ...currentWorldProgress,
          completedNodes,
          unlockedNodes,
        }
      }
    };

    setCurrentUserProfile(updatedProfile);
    setAllProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    
    // If final node, show celebration
    if (nodeId === 'node_4') {
        setShowCelebration(true);
        setTimeout(() => {
            setShowCelebration(false);
            setGameState(GameState.SESSION_END);
        }, 3000);
    } else {
        setGameState(GameState.LEVEL_MAP);
        // Refresh nodes
        setCurrentNodes(generateNodesForWorld(selectedWorld, updatedProfile));
    }
  };
  
  const handleProfileDelete = (profileId: string) => {
      setAllProfiles(prev => prev.filter(p => p.id !== profileId));
  }

  const saveSessionData = () => {
    if (!currentUserProfile || !sessionStartTime || currentSessionHistory.length === 0) return;

    const endTime = new Date().toISOString();
    const durationSeconds = Math.floor((new Date(endTime).getTime() - new Date(sessionStartTime).getTime()) / 1000);

    const sessionRecord: SessionRecord = {
        startTime: sessionStartTime,
        endTime,
        durationSeconds,
        activities: currentSessionHistory,
    };

    // Check if we need to update an existing session entry (same start time) or add new
    // This logic is redundant if handleAnswer saves every time, but good as a fallback safety.
    const history = currentUserProfile.history || [];
    const existingIndex = history.findIndex(h => h.startTime === sessionStartTime);
    
    let updatedHistory;
    if (existingIndex !== -1) {
        updatedHistory = [...history];
        updatedHistory[existingIndex] = sessionRecord;
    } else {
        updatedHistory = [...history, sessionRecord];
    }

    const updatedProfile = {
        ...currentUserProfile,
        history: updatedHistory,
    };
    
    updateProfile(updatedProfile);
  };

  const handleReturnToSelection = () => {
    saveSessionData();
    setCurrentUserProfile(null);
    setCurrentActivity(null);
    setGameState(GameState.PROFILE_SELECTION);
  }

  const handleGoHome = () => {
    saveSessionData();
    setCurrentUserProfile(null);
    setCurrentActivity(null);
    setGameState(GameState.WELCOME);
  };
  
  const handleGoToCredits = () => {
    setGameState(GameState.CREDITS);
  };

  const handleEditPreferences = (profileId: string) => {
    const profileToEdit = allProfiles.find(p => p.id === profileId);
    if (profileToEdit) {
      setEditingPreferencesForProfile(profileToEdit);
      setGameState(GameState.PREFERENCES);
    }
  };

  const handleSavePreferences = (updatedData: { preferredDifficulty: Difficulty, dailySessionDuration: number, favoriteGameTypes: string, fontSize: FontSize, themeColor: ThemeColor }) => {
    if (!editingPreferencesForProfile) return;
    const updatedProfile = { ...editingPreferencesForProfile, ...updatedData };
    setAllProfiles(allProfiles.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    if (currentUserProfile && currentUserProfile.id === updatedProfile.id) {
      setCurrentUserProfile(updatedProfile);
    }
    setEditingPreferencesForProfile(null);
    setGameState(GameState.MANAGE_PROFILES);
  };

  const handleCancelPreferences = () => {
    setEditingPreferencesForProfile(null);
    setGameState(GameState.MANAGE_PROFILES);
  };

    const handleViewHistory = (profileId: string) => {
        const profile = allProfiles.find(p => p.id === profileId);
        if (profile) {
            // Ensure badges is safe to read
            if (!profile.badges) profile.badges = [];
            setViewingHistoryForProfile(profile);
            setGameState(GameState.SESSION_HISTORY);
        }
    };

    const handleReturnToManageProfiles = () => {
        setViewingHistoryForProfile(null);
        setGameState(GameState.MANAGE_PROFILES);
    };

  useEffect(() => {
    if (gameState === GameState.LEVEL_MAP && selectedWorld && currentUserProfile) {
      // Prefetch activity for the next unlocked but not completed node
      const nextNode = currentNodes.find(n => n.isUnlocked && !n.isCompleted && n.type === NodeType.ACTIVITY);
      if (nextNode && !nextActivity) {
        fetchNewActivity(true);
      }
    }
  }, [gameState, selectedWorld, currentUserProfile, currentNodes, nextActivity]);

  const fetchNewActivity = useCallback(async (isBackground: boolean = false, activityToAvoid?: Activity) => {
    if (!currentUserProfile) return;
    if (isBackground && nextActivity) return; // Already have one pre-fetched

    if (!isBackground) {
        setGameState(GameState.LOADING);
        setSelectedAnswer(null);
        setAvatarExpression(AvatarExpression.NEUTRAL);
        setAvatarSpeech(`¡Listo, ${currentUserProfile.nickname}! Vamos a buscar una nueva actividad para ti.`);
    }

    try {
      // Create an effective history list for the prompt that includes the current or just-completed activity
      // to prevent duplicates, even if it hasn't been fully saved to state yet.
      const historyForPrompt = [...currentSessionHistory];
      
      // Identify the activity we want to ensure we don't repeat (either passed explicitly or the current one)
      const activityToExclude = activityToAvoid || currentActivity;

      if (activityToExclude) {
           // Check if it's already in history to avoid double adding
           const alreadyInHistory = historyForPrompt.some(h => h.instruction === activityToExclude.instruction);
           if (!alreadyInHistory) {
               historyForPrompt.push({
                   instruction: activityToExclude.instruction,
                   userAnswer: "", 
                   correctAnswer: activityToExclude.correctAnswer,
                   isCorrect: false
               });
           }
      }

      const activity = await generateActivity(selectedWorld || Difficulty.EASY, currentUserProfile, historyForPrompt);
      
      if (isBackground) {
          setNextActivity(activity);
      } else {
          setCurrentActivity(activity);
          setAvatarSpeech(activity.instruction);
          setGameState(GameState.ACTIVITY);
          
          // Reset state for new activity
          setSelectedAnswer(null);
          setAvatarExpression(AvatarExpression.NEUTRAL);
          setIsWaitingForContinue(false);
          setNextActivity(null); // Clear any previous prefetch
          
          // Prefetch the NEXT one immediately, avoiding the one we just set
          fetchNewActivity(true, activity);
      }

    } catch (error) {
      console.error("Error generating activity:", error);
      // Retry logic
      if (!isBackground) {
          setAvatarSpeech("Oh, oh. Tuve un problema para crear la actividad. Intentemos de nuevo.");
          setTimeout(() => fetchNewActivity(false, activityToAvoid), 3000);
      } else {
          setTimeout(() => fetchNewActivity(true, activityToAvoid), 2000);
      }
    }
  }, [currentUserProfile, currentSessionHistory, currentActivity]);
  
  const updateProfile = (updatedProfile: UserProfile) => {
    setCurrentUserProfile(updatedProfile);
    setAllProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
  };

  useEffect(() => {
    if (gameState === GameState.LOADING && currentUserProfile) {
      fetchNewActivity();
    }
  }, [gameState, currentUserProfile, fetchNewActivity]);

  const handleContinue = async () => {
    if (!sessionStartTime || !currentUserProfile) return;

    // Calculate elapsed time in minutes
    const startTime = new Date(sessionStartTime).getTime();
    const currentTime = new Date().getTime();
    const elapsedMinutes = (currentTime - startTime) / (1000 * 60);
    
    // Get user preference duration or use the limit set on profile selection
    const durationLimit = sessionDurationLimit;

    // Only end session if the time limit has been reached
    if (elapsedMinutes >= durationLimit) {
        setIsWaitingForContinue(false); // Hide button for report generation
        
        // The history is already saved in handleAnswer, but we ensure the final session record is precise
        saveSessionData();

        setGameState(GameState.LOADING);
        setAvatarSpeech("¡Un momento! Estoy preparando tu resumen de la sesión...");
        const summary = await generateSessionSummary(currentUserProfile.nickname, currentSessionHistory);
        setAvatarSpeech(summary);
        setGameState(GameState.SESSION_END);
    } else {
        // Continue playing if time is not up yet
        setIsWaitingForContinue(false);
        setSelectedAnswer(null);
        setAvatarSpeech('');
        
        // After an activity, we go back to the map to see progress
        if (currentActivity) {
            const currentNode = currentNodes.find(n => n.isUnlocked && !n.isCompleted);
            if (currentNode) {
                handleNodeCompletion(currentNode.id);
            } else {
                setGameState(GameState.LEVEL_MAP);
            }
        } else {
            setGameState(GameState.LEVEL_MAP);
        }
    }
  };

  const checkAndAwardBadges = async (profile: UserProfile): Promise<{ updatedProfile: UserProfile, newBadges: Badge[] }> => {
      const earnedBadges: Badge[] = [];
      const currentBadges = profile.badges || [];
      let nextProfile = { ...profile };

      // Logic definitions for each badge
      const checkMap: Record<string, (p: UserProfile) => boolean> = {
          'first_steps': (p) => p.score >= 1,
          'high_five': (p) => p.correctAnswersStreak >= 5,
          'super_star': (p) => p.score >= 20,
          'syllabic_explorer': (p) => p.level === SyllabicLevel.SILABICO || p.level === SyllabicLevel.ALFABETICO,
          'alphabet_master': (p) => p.level === SyllabicLevel.ALFABETICO,
          'streak_fire': (p) => p.correctAnswersStreak >= 10
      };

      AVAILABLE_BADGES.forEach(badge => {
          if (!currentBadges.includes(badge.id)) {
              const checkFunc = checkMap[badge.id];
              if (checkFunc && checkFunc(nextProfile)) {
                  earnedBadges.push(badge);
              }
          }
      });

      if (earnedBadges.length > 0) {
           nextProfile = {
               ...nextProfile,
               badges: [...currentBadges, ...earnedBadges.map(b => b.id)]
           };
      }

      return { updatedProfile: nextProfile, newBadges: earnedBadges };
  };

  const handleAnswer = async (answer: string) => {
    if (!currentActivity || !currentUserProfile || !sessionStartTime) return;

    setIsWaitingForContinue(false);
    setGameState(GameState.FEEDBACK);
    setSelectedAnswer(answer);
    const isCorrect = answer === currentActivity.correctAnswer;

    // 1. Create Activity Record
    const activityRecord: SessionActivityRecord = {
        instruction: currentActivity.instruction,
        userAnswer: answer,
        correctAnswer: currentActivity.correctAnswer,
        isCorrect: isCorrect,
        difficulty: currentUserProfile.preferredDifficulty,
    };

    // 2. Update Local Session History State
    const newSessionHistory = [...currentSessionHistory, activityRecord];
    setCurrentSessionHistory(newSessionHistory);
    
    // 3. Prepare Profile Update
    let updatedProfile = { ...currentUserProfile };
    let leveledUp = false;
    let nextLevelName = "";

    if (isCorrect) {
      setAvatarExpression(AvatarExpression.HAPPY);
      setShowCelebration(true);
      
      // Start pre-fetching immediately during celebration for zero-latency transition
      fetchNewActivity(true);
      
      setTimeout(() => setShowCelebration(false), 2000);
      updatedProfile = {
        ...updatedProfile,
        score: updatedProfile.score + 1,
        correctAnswersStreak: updatedProfile.correctAnswersStreak + 1,
      };

      // CHECK LEVEL UP
      if (updatedProfile.correctAnswersStreak >= LEVEL_UP_SCORE) {
        const levels = Object.values(SyllabicLevel);
        const currentLevelIndex = levels.indexOf(updatedProfile.level as SyllabicLevel);
        
        if (currentLevelIndex < levels.length - 1) {
            const nextLevel = levels[currentLevelIndex + 1];
            updatedProfile.level = nextLevel;
            updatedProfile.correctAnswersStreak = 0; 
            leveledUp = true;
            nextLevelName = nextLevel;
            
            // Unlock next block
            const nextBlockId = currentLevelIndex + 2; // +1 for next index, +1 for 1-based ID
            if (!updatedProfile.unlockedLevels.includes(nextBlockId)) {
                updatedProfile.unlockedLevels = [...updatedProfile.unlockedLevels, nextBlockId];
            }
        } else {
             updatedProfile.correctAnswersStreak = 0;
             leveledUp = true;
             nextLevelName = "MAESTRÍA";
        }
      }
    } else {
      setAvatarExpression(AvatarExpression.ENCOURAGING);
      updatedProfile.correctAnswersStreak = 0;
      // NO BLOCKING HERE. We will auto-advance in the timeout below.
    }

    // 4. IMMEDIATE HISTORY SAVING (Real-time persistence)
    const currentEndTime = new Date().toISOString();
    const currentDurationSeconds = Math.floor((new Date(currentEndTime).getTime() - new Date(sessionStartTime).getTime()) / 1000);

    const currentSessionRecord: SessionRecord = {
        startTime: sessionStartTime,
        endTime: currentEndTime,
        durationSeconds: currentDurationSeconds,
        activities: newSessionHistory
    };

    const profileHistory = [...(updatedProfile.history || [])];
    const existingSessionIndex = profileHistory.findIndex(h => h.startTime === sessionStartTime);

    if (existingSessionIndex !== -1) {
        profileHistory[existingSessionIndex] = currentSessionRecord;
    } else {
        profileHistory.push(currentSessionRecord);
    }
    updatedProfile.history = profileHistory;

    // 5. CHECK BADGES
    // Badges will now properly check against the updatedProfile which contains the NEW level if leveledUp occurred.
    const { updatedProfile: profileWithBadges, newBadges } = await checkAndAwardBadges(updatedProfile);
    updatedProfile = profileWithBadges;
    
    // 6. Persist Profile to State/Storage
    updateProfile(updatedProfile);
    setSessionActivityCount(prev => prev + 1);

    // 7. Handle Special Events (Badges or Level Up)
    let delayBeforeNext = 1200;

    if (newBadges.length > 0) {
        // Trigger visual toast notification for the first new badge
        setNewlyEarnedBadge(newBadges[0]);
        
        // Prioritize Badge Celebration in speech as well
        setAvatarSpeech(`¡Felicidades! ¡Has ganado la medalla: ${newBadges[0].name}!`);
        setShowCelebration(true);
        await new Promise(resolve => setTimeout(resolve, 3500));
        delayBeforeNext = 500; // Short delay after speech checks
    }
    
    if (leveledUp) {
        if (nextLevelName === "MAESTRÍA") {
             setAvatarSpeech(`¡ASOMBROSO! ¡Ya eres un maestro del nivel Alfabético! ¡Sigue así para romper tu récord!`);
        } else {
             setAvatarSpeech(`¡INCREÍBLE! ¡Has completado la racha y subido al nivel ${nextLevelName}!`);
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // 8. Generate Feedback (Non-blocking for speed) if no major event overrode speech
    if (newBadges.length === 0 && !leveledUp) {
        generateFeedback(isCorrect, currentUserProfile.nickname, currentActivity, answer)
            .then(feedback => {
                setAvatarSpeech(feedback); 
            })
            .catch(error => {
                console.error("Error generating feedback:", error);
                setAvatarSpeech(isCorrect ? "¡Muy bien!" : "No te preocupes, ¡inténtalo de nuevo!");
            });
    }
    
    // 8.5 Start fetching NEXT activity if not already done (e.g., for incorrect answers)
    // This ensures zero-latency for the next step.
    if (!isCorrect) {
        fetchNewActivity(true);
    }

    // 9. Auto-advance Logic
    if (isCorrect) {
        setTimeout(handleContinue, delayBeforeNext);
    } else {
        // For incorrect answers, advance automatically after a longer delay (to hear feedback)
        // instead of staying there waiting for user input.
        setTimeout(handleContinue, 4000); 
    }
  };

  const handlePlayAgain = () => {
    setSessionActivityCount(0);
    setCurrentSessionHistory([]);
    setSessionStartTime(new Date().toISOString());
    setGameState(GameState.LOADING);
  };
  
  const theme = currentUserProfile ? THEME_CLASSES[currentUserProfile.themeColor] : THEME_CLASSES[ThemeColor.SKY];
  const fontSizeClass = currentUserProfile?.fontSize ? FONT_SIZE_CLASSES[currentUserProfile.fontSize] : FONT_SIZE_CLASSES[FontSize.NORMAL];

  const handleStart = () => {
    if (allProfiles.length > 0) {
        setGameState(GameState.PROFILE_SELECTION);
    } else {
        setGameState(GameState.PROFILE_SETUP);
    }
  };

  const handleSaveReport = (reportData: Omit<TherapistReport, 'id'>) => {
    const newReport: TherapistReport = {
      id: crypto.randomUUID(),
      ...reportData
    };
    setAllReports(prev => [...prev, newReport]);
  };

  const renderMainContent = () => {
    switch (gameState) {
      case GameState.WELCOME:
        return <WelcomeScreen 
                  onStart={handleStart} 
                  onTherapistLogin={() => setGameState(GameState.THERAPIST_DASHBOARD)}
               />;
      case GameState.LOADING:
        return <LoadingSpinner text={avatarSpeech} />;
      case GameState.PROFILE_SELECTION:
        return <ProfileSelectionScreen 
                    profiles={allProfiles} 
                    onSelectProfile={handleProfileSelect} 
                    onAddNewProfile={() => { setEditingProfile(null); setGameState(GameState.PROFILE_SETUP); }}
                    onManageProfiles={() => setGameState(GameState.MANAGE_PROFILES)}
                    onGoHome={handleGoHome}
                />;
      case GameState.PROFILE_SETUP:
        return <ProfileSetupScreen 
                    onSetupComplete={handleSaveProfile} 
                    onCancel={handleCancelEdit}
                    profileToEdit={editingProfile}
                    onHelpTrigger={handleAvatarHelp}
                />;
      case GameState.MANAGE_PROFILES:
        return <ManageProfilesScreen
                    profiles={allProfiles}
                    onEditProfile={handleStartEdit}
                    onDeleteProfile={handleProfileDelete}
                    onDone={() => setGameState(GameState.PROFILE_SELECTION)}
                    onAddNewProfile={() => { setEditingProfile(null); setGameState(GameState.PROFILE_SETUP); }}
                    onGoHome={handleGoHome}
                    onEditPreferences={handleEditPreferences}
                    onViewHistory={handleViewHistory}
               />;
      case GameState.WORLD_SELECTION:
        return <WorldSelectionScreen 
                    onSelectWorld={handleSelectWorld} 
                    onGoBack={() => setGameState(GameState.PROFILE_SELECTION)} 
                    theme={theme} 
                />;
      case GameState.LEVEL_MAP:
        return <NodeMapScreen 
                    worldId={selectedWorld || Difficulty.EASY}
                    nodes={currentNodes}
                    onSelectNode={handleSelectNode}
                    onGoBack={() => setGameState(GameState.WORLD_SELECTION)}
                    theme={theme}
                />;
      case GameState.PREFERENCES:
        if(editingPreferencesForProfile){
          return <PreferencesScreen 
            profile={editingPreferencesForProfile}
            onSave={handleSavePreferences}
            onCancel={handleCancelPreferences}
            theme={THEME_CLASSES[editingPreferencesForProfile.themeColor]}
            onHelpTrigger={handleAvatarHelp}
          />
        }
        return <LoadingSpinner />;
      case GameState.ACTIVITY:
      case GameState.FEEDBACK:
        if (currentActivity && currentUserProfile) {
          return (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentActivity.id}-${gameState}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="w-full"
              >
                <ActivityScreen
                    activity={currentActivity}
                    userProfile={currentUserProfile}
                    onAnswer={handleAnswer}
                    isFeedbackState={gameState === GameState.FEEDBACK}
                    selectedAnswer={selectedAnswer}
                    theme={theme}
                    isWaitingForContinue={isWaitingForContinue}
                    onContinue={handleContinue}
                    isTransitioning={isTransitioning}
                />
              </motion.div>
            </AnimatePresence>
          );
        }
        return <LoadingSpinner />;
      case GameState.SESSION_END:
        if(currentUserProfile && sessionStartTime) {
            return <SessionEndScreen 
                userProfile={currentUserProfile}
                sessionHistory={currentSessionHistory}
                startTime={sessionStartTime}
                onPlayAgain={handlePlayAgain}
                onSwitchProfile={handleReturnToSelection}
                onGoHome={handleGoHome}
                theme={theme}
            />
        }
        return <LoadingSpinner />;
      case GameState.THERAPIST_DASHBOARD:
        return <TherapistDashboard 
                  profiles={allProfiles}
                  reports={allReports}
                  onAddProfile={() => { setEditingProfile(null); setGameState(GameState.PROFILE_SETUP); }}
                  onEditProfile={handleStartEdit}
                  onDeleteProfile={handleProfileDelete}
                  onSaveReport={handleSaveReport}
                  onGoBack={handleGoHome}
               />;
      default:
        return <p>Estado desconocido</p>;
    }
  };

  const shouldHideHeaderAndAvatar = gameState === GameState.CREDITS || gameState === GameState.SESSION_HISTORY;

  return (
        <main className={`min-h-screen w-full flex flex-col items-center justify-center p-2 md:p-4 font-sans transition-colors duration-500 ${theme.bg} ${fontSizeClass}`}>
          <BackgroundMusic />
          <ConnectionStatus />
          {showCelebration && <SparkleCelebration />}
          {newlyEarnedBadge && (
              <BadgeNotification 
                  badge={newlyEarnedBadge} 
                  onClose={() => setNewlyEarnedBadge(null)} 
              />
          )}
          <div className="w-full max-w-6xl mx-auto relative">
            <div className="absolute top-2 right-2 z-20 flex items-center gap-2">
                {currentUserProfile && gameState !== GameState.SESSION_END && (
                    <>
                        <button
                            onClick={handleGoHome}
                            className={`flex items-center justify-center p-2 md:px-3 md:py-2 rounded-full shadow-lg transition-colors ${theme.button} text-white font-semibold text-sm md:text-lg transform hover:scale-105`}
                            aria-label="Ir al inicio"
                        >
                            <HomeIcon />
                            <span className="hidden md:inline ml-2">Inicio</span>
                        </button>
                        <button
                            onClick={handleReturnToSelection}
                            className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-full shadow-lg transition-colors ${theme.button} text-white font-semibold text-sm md:text-lg transform hover:scale-105`}
                            aria-label="Volver a la selección de perfiles"
                        >
                            <SwitchProfileIcon />
                            <span>Perfiles</span>
                        </button>
                    </>
                )}
                <MusicToggle theme={theme} />
                <MuteButton theme={theme} />
                {!shouldHideHeaderAndAvatar && <FullscreenButton theme={theme} />}
            </div>
            {!shouldHideHeaderAndAvatar && (
                <h1 className={`text-3xl md:text-5xl font-bold text-center mb-4 md:mb-6 drop-shadow-md mt-12 md:mt-0 ${theme.text}`}>HABLA, JUEGA Y APRENDE</h1>
            )}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 md:p-8 min-h-[80vh] md:min-h-[600px] flex items-center justify-center relative overflow-hidden">
              {(() => {
                  if (isLoading) {
                    return <LoadingSpinner text="Cargando perfiles..." />
                  }

                  if (gameState === GameState.CREDITS) {
                    return <CreditsScreen onBack={handleGoHome} />;
                  }
                  
                  if (gameState === GameState.SESSION_HISTORY) {
                      if(viewingHistoryForProfile) {
                          return <SessionHistoryScreen
                              profile={viewingHistoryForProfile}
                              onBack={handleReturnToManageProfiles}
                          />;
                      }
                      return <LoadingSpinner />;
                  }

                  if (gameState === GameState.LOADING && !currentUserProfile) {
                      return <LoadingSpinner text={avatarSpeech} />;
                  }

                  const avatarVoice = currentUserProfile?.assistantVoice ?? editingPreferencesForProfile?.assistantVoice ?? editingProfile?.assistantVoice ?? AssistantVoice.FEMALE;
                  const avatarTheme = currentUserProfile?.themeColor ?? editingPreferencesForProfile?.themeColor ?? editingProfile?.themeColor ?? ThemeColor.SKY;

                  return (
                      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 w-full h-full">
                          <div className="w-full lg:w-1/3 flex-shrink-0 flex items-center justify-center lg:sticky lg:top-8">
                              <Avatar
                                  speech={avatarSpeech}
                                  expression={avatarExpression}
                                  voice={avatarVoice}
                                  themeColor={avatarTheme}
                              />
                          </div>
                          <div className="w-full lg:w-2/3 flex flex-col items-center justify-center flex-grow">
                              {renderMainContent()}
                          </div>
                      </div>
                  )
              })()}
            </div>
          </div>
        </main>
  );
}

function App() {
    return (
        <SoundProvider>
            <AppContent />
        </SoundProvider>
    )
}

export default App;
