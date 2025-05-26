import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client directly
const supabase = createClient(
  'https://pizabgpzaleciuicvptc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpemFiZ3B6YWxlY2l1aWN2cHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNjEyMzEsImV4cCI6MjA2MzYzNzIzMX0.g4QbiDX9ewARQM2z3h156gdMe1uA19UJFjopKVU7vH0'
);

async function createDoctorsTable() {
  try {
    // Create the doctors table
    const { error } = await supabase.rpc('create_doctors_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS doctors (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          full_name TEXT NOT NULL,
          specialty TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
      `
    });

    if (error) {
      console.error('Error creating doctors table:', error);
      return;
    }

    console.log('Successfully created doctors table');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the table creation
createDoctorsTable();
