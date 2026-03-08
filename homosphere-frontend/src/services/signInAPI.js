import { supabase } from '../utils/supabase.js';

export async function signInWithEmail(email, password) {
    try {
      // First, check if the email exists by trying to sign up with a dummy password
      const { data: checkData, error: checkError } = await supabase.auth.signUp({
        email,
        password: 'dummy-check-' + Math.random(), // Random password to check email
        options: {
          data: { check_only: true }
        }
      });
      
      // If identities array is empty, email already exists(suoabase hack)
      const emailExists = checkData?.user?.identities?.length === 0;
      
      //  actual sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        console.log(data);
        console.error('Sign in error:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          if (emailExists) {
            return { success: false, error: 'Wrong password' };
          } else {
            return { success: false, error: 'No such account exists' };
          }
        }
        
        if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Please verify your email before signing in' };
        }
        
        throw error;
      }
  
      console.log('Sign in success:', data);
      return { success: true, data, message: 'Signed in successfully!' };
      
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  }
  
  
  
  