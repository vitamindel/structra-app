import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jthtmtfuexerylijgdik.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0aHRtdGZ1ZXhlcnlsaWpnZGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MTAzOTEsImV4cCI6MjA2Njk4NjM5MX0.h-QNAzYhFjo2dudHA1u1dtNM0JmI86QZk8zCjBiOYkM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      proteins: {
        Row: {
          id: string;
          name: string;
          pdb_id: string;
          file_url: string;
          uploaded_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          pdb_id: string;
          file_url: string;
          uploaded_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          pdb_id?: string;
          file_url?: string;
          uploaded_by?: string;
          created_at?: string;
        };
      };
      annotations: {
        Row: {
          id: string;
          protein_id: string;
          user_id: string;
          residue_id: string;
          coordinates: { x: number; y: number; z: number };
          comment: string;
          measurement_data: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          protein_id: string;
          user_id: string;
          residue_id: string;
          coordinates: { x: number; y: number; z: number };
          comment: string;
          measurement_data?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          protein_id?: string;
          user_id?: string;
          residue_id?: string;
          coordinates?: { x: number; y: number; z: number };
          comment?: string;
          measurement_data?: any;
          created_at?: string;
        };
      };
    };
  };
};