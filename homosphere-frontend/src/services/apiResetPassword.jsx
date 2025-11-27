import { supabase } from '@utils/supabase';
import { ROUTES } from '@constants/routes';


export async function getPasswordResetTokenForEmail(email) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}${ROUTES.AUTH}?redirectTo=${ROUTES.FORGET_PASSWORD}`,
        });
        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function sendResetPasswordForEmail (newPassword) {
    try {
        const result = await supabase.auth.updateUser({
      password: newPassword
    });
        return { success: true, error: result.error ? result.error.message : null };
    } catch (error) {
        console.error('Reset password error:', error);
        return { success: false, error: error.message };
    }
}