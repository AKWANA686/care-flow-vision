import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client directly
const supabase = createClient(
  'https://pizabgpzaleciuicvptc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpemFiZ3B6YWxlY2l1aWN2cHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNjEyMzEsImV4cCI6MjA2MzYzNzIzMX0.g4QbiDX9ewARQM2z3h156gdMe1uA19UJFjopKVU7vH0'
);

const doctors = [
  {
    full_name: 'Dr. Amina Mwangi',
    specialty: 'General Medicine',
    email: 'amina.mwangi@example.com',
    phone: '0712345678',
    created_at: new Date().toISOString()
  },
  {
    full_name: 'Dr. John Otieno',
    specialty: 'Cardiology',
    email: 'john.otieno@example.com',
    phone: '0723456789',
    created_at: new Date().toISOString()
  },
  {
    full_name: 'Dr. Grace Wanjiku',
    specialty: 'Pediatrics',
    email: 'grace.wanjiku@example.com',
    phone: '0734567890',
    created_at: new Date().toISOString()
  },
  {
    full_name: 'Dr. Peter Kiptoo',
    specialty: 'Dermatology',
    email: 'peter.kiptoo@example.com',
    phone: '0745678901',
    created_at: new Date().toISOString()
  },
  {
    full_name: 'Dr. Mary Njeri',
    specialty: 'Obstetrics & Gynecology',
    email: 'mary.njeri@example.com',
    phone: '0756789012',
    created_at: new Date().toISOString()
  },
  {
    full_name: 'Dr. Samuel Mutua',
    specialty: 'Orthopedics',
    email: 'samuel.mutua@example.com',
    phone: '0767890123',
    created_at: new Date().toISOString()
  },
  {
    full_name: 'Dr. Lucy Chebet',
    specialty: 'Neurology',
    email: 'lucy.chebet@example.com',
    phone: '0778901234',
    created_at: new Date().toISOString()
  },
  {
    full_name: 'Dr. David Kamau',
    specialty: 'ENT',
    email: 'david.kamau@example.com',
    phone: '0789012345',
    created_at: new Date().toISOString()
  }
];

async function insertDoctors() {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .insert(doctors)
      .select();

    if (error) {
      console.error('Error inserting doctors:', error);
      return;
    }

    console.log('Successfully inserted doctors:', data);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the insertion
insertDoctors();
