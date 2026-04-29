import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';

interface Todo {
  id: number;
  name: string;
}

export const SupabaseExample: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const { data, error } = await supabase
          .from('todos')
          .select('*');

        if (error) throw error;
        setTodos(data || []);
      } catch (err: any) {
        console.error('Error fetching todos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (loading) return <div className="p-4 text-sky-600">Conectando con Supabase...</div>;
  if (error) return <div className="p-4 text-rose-600">Error de Supabase: {error} (Asegúrate de que la tabla 'todos' existe)</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white rounded-2xl shadow-xl max-w-md mx-auto my-8 border border-sky-100"
    >
      <h2 className="text-2xl font-bold text-sky-700 mb-4 flex items-center gap-2">
        <span>Prueba de Supabase</span>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </h2>
      <ul className="space-y-2">
        {todos.length === 0 ? (
          <li className="text-gray-500 italic">No se encontraron tareas en la tabla 'todos'.</li>
        ) : (
          todos.map((todo) => (
            <li 
              key={todo.id}
              className="p-3 bg-sky-50 rounded-lg text-sky-800 border border-sky-100 font-medium"
            >
              {todo.name}
            </li>
          ))
        )}
      </ul>
      <p className="mt-4 text-xs text-gray-400">
        Conectado a: {import.meta.env.VITE_SUPABASE_URL}
      </p>
    </motion.div>
  );
};
