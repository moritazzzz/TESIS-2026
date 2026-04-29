import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';

export const saveProfile = async (profile: UserProfile): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert(profile);
    
    if (error) throw error;
  } catch (error) {
    console.error("Could not save profile to Supabase", error);
    // Fallback: save single profile to localStorage as individual item if needed, 
    // but here we prefer to just log error if Supabase fails.
  }
};

export const saveProfiles = async (profiles: UserProfile[]): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert(profiles);
    
    if (error) throw error;
  } catch (error) {
    console.error("Could not save profiles to Supabase", error);
  }
};

export const loadProfiles = async (): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Could not load profiles from Supabase", error);
    // Fallback to localStorage for existing data
    const profilesJson = localStorage.getItem('syllableAdventureUserProfiles');
    return profilesJson ? JSON.parse(profilesJson) : [];
  }
};

export const deleteProfile = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting profile:", error);
  }
};
