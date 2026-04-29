import type { TherapistReport } from '../types';
import { supabase } from '../lib/supabase';

export const saveReports = async (reports: TherapistReport[]): Promise<void> => {
  try {
    const { error } = await supabase
      .from('reports')
      .upsert(reports);
    
    if (error) throw error;
  } catch (error) {
    console.error("Could not save therapist reports to Supabase", error);
  }
};

export const saveReport = async (report: TherapistReport): Promise<void> => {
    try {
        const { error } = await supabase
            .from('reports')
            .upsert(report);
        if (error) throw error;
    } catch (error) {
        console.error("Error saving single report:", error);
    }
};

export const loadReports = async (): Promise<TherapistReport[]> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Could not load therapist reports from Supabase", error);
    const reportsJson = localStorage.getItem('syllableAdventureTherapistReports');
    return reportsJson ? JSON.parse(reportsJson) : [];
  }
};
