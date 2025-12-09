import { supabase } from '../utils/supabase.js';
import { ROUTES } from '../constants/routes.js';

export async function signUpWithEmail(email, password, firstname, lastname, role) {
  try {
    // Sign up the user with email and password
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${ROUTES.SUBSCRIPTION}`,
        data: {
          first_name: firstname,
          last_name: lastname,
          role: role,
        },//make email redirect to tier selection page from supabase settings console
      }
    });

    if (error) {
      console.error('Sign up error:', error);
      throw error;
    } else if (data.user?.identities?.length === 0) {
        return { success: false, error: 'Email already used' };
    }

    
    return { success: true, data, message: 'Check your email for the confirmation link!' };
    
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message };
  }
}


