import { supabase } from '@/integrations/supabase/client';
import type { Voter } from './types';

// Voter data operations
export async function fetchVotersByName(name: string): Promise<Voter[]> {
  try {
    if (!name) return [];

    console.log('Searching for:', name);

    // Search by name, father's/husband's name, or voter ID
    const { data, error } = await supabase
      .from('voters')
      .select('*')
      .or(`name.ilike.%${name}%,father_husband_name.ilike.%${name}%,voter_id.ilike.%${name}%`)
      .limit(100);

    console.log('Search query executed for:', name);
    console.log('Search results:', data);
    console.log('Search error:', error);

    if (error) {
      console.error('Error fetching voters:', error);
      return [];
    }

    // If no data returned, return empty array
    if (!data) return [];

    // Transform snake_case from DB to camelCase for frontend
    return data.map(voter => ({
      id: voter.id,
      serialNumber: voter.serial_number,
      voterId: voter.voter_id,
      name: voter.name,
      fatherHusbandName: voter.father_husband_name,
      houseNumber: voter.house_number,
      age: voter.age,
      gender: (voter.gender as 'Male' | 'Female' | 'Other') || 'Other'
    }));
  } catch (error) {
    console.error('Error in fetchVotersByName:', error);
    return [];
  }
}

// Fetch a single voter by ID
export async function fetchVoterById(id: string): Promise<Voter | null> {
  try {
    console.log('Fetching voter by ID:', id);

    const { data, error } = await supabase
      .from('voters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching voter:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    console.log('Voter data:', data);

    return {
      id: data.id,
      serialNumber: data.serial_number,
      voterId: data.voter_id,
      name: data.name,
      fatherHusbandName: data.father_husband_name,
      houseNumber: data.house_number,
      age: data.age,
      gender: (data.gender as 'Male' | 'Female' | 'Other') || 'Other'
    };
  } catch (error) {
    console.error('Error in fetchVoterById:', error);
    return null;
  }
}

// Add a function to test database connection
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('voters')
      .select('count', { count: 'exact', head: true });

    console.log('Database connection test:', { data, error });
    return !error;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}