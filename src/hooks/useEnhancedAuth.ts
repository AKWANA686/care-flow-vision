
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  profile_picture_url: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  gender: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  medical_license_number: string | null;
  specialization: string | null;
  department: string | null;
}

export const useEnhancedAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine !== false);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          await fetchUserProfile(initialSession.user.id);
          await trackConnection(initialSession.user.id);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Defer profile fetch to avoid blocking auth state updates
          setTimeout(() => {
            fetchUserProfile(session.user.id);
            trackConnection(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
          await disconnectUser();
        }

        setLoading(false);
      }
    );

    // Set up real-time profile updates
    const profileChannel = supabase
      .channel('profile-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_profiles',
        filter: user ? `user_id=eq.${user.id}` : undefined
      }, (payload) => {
        if (payload.eventType === 'UPDATE' && payload.new) {
          setUserProfile(payload.new as UserProfile);
          toast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully"
          });
        }
      })
      .subscribe();

    // Network status monitoring
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(profileChannel);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user?.id]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const trackConnection = async (userId: string) => {
    try {
      // Generate a unique socket ID for this session
      const socketId = `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await supabase
        .from('socket_connections')
        .insert({
          user_id: userId,
          socket_id: socketId,
          user_agent: navigator.userAgent,
          is_active: true
        });
    } catch (error) {
      console.error('Error tracking connection:', error);
    }
  };

  const disconnectUser = async () => {
    if (!user) return;
    
    try {
      await supabase
        .from('socket_connections')
        .update({ is_active: false })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error updating connection status:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Sign-in Error",
        description: "Failed to sign in with Google",
        variant: "destructive"
      });
    }
  };

  const signOut = async () => {
    try {
      await disconnectUser();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setUserProfile(null);
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out"
      });
    } catch (error) {
      console.error('Sign-out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setUserProfile(data);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });

      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
      throw error;
    }
  };

  const uploadProfilePicture = async (file: File) => {
    if (!user) throw new Error('Not authenticated');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      await updateProfile({ profile_picture_url: data.publicUrl });

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  };

  return {
    user,
    session,
    userProfile,
    loading,
    isOnline,
    signInWithGoogle,
    signOut,
    updateProfile,
    uploadProfilePicture,
    refetchProfile: () => user && fetchUserProfile(user.id)
  };
};
