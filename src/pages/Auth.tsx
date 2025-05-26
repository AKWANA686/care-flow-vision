
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import EnhancedAuthForm from '@/components/EnhancedAuthForm';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Redirect based on user role
        const userRole = session.user.user_metadata?.role || 'patient';
        navigate(userRole === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
      }
    };

    checkUser();
  }, [navigate]);

  const handleAuthSuccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const userRole = session.user.user_metadata?.role || 'patient';
      navigate(userRole === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
    }
  };

  return (
    <EnhancedAuthForm
      mode={mode}
      onModeChange={setMode}
      onSuccess={handleAuthSuccess}
    />
  );
};

export default Auth;
