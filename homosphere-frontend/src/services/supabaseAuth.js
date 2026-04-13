import supabase from '../utils/supabase';
import ROUTES from '../constants/routes';
import {authApi} from '../services/api/authApi';
import {saveAuthSession} from "../services/authSession";

export async function signUpWithSupabase(signUpData) {
    const { email, phone, password, role, firstName, lastName } = signUpData;
    const { data, error } = await supabase.auth.signUp({
        email: email,
        phone: phone,
        password: password,
        options: {
            emailRedirectTo: `${window.location.origin}${ROUTES.SUBSCRIPTION}`,
            data: {
                role: role,
                first_name: firstName,
                last_name: lastName
            }
        }
    })

    console.log(data);

    if (error) {
        console.error('Signup error:', error.message)
    }

    const accessToken = data.session.access_token;
    const response  = await authApi.signup(accessToken, signUpData);
    console.log(await response.json());

    return {
        accessToken: accessToken,
        user: data.user,
    }
}

export async function signInWithSupabase({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;

    // Get the session token
    const session = data.session;
    const supabaseUser = data.user;
    if (!(session && session.access_token)) return;

    console.log(`Login complete onto Sync${data}`);

    // Sync with backend for additional data
    const response  = await authApi.login(session.access_token);

    console.log(await response.json());

    saveAuthSession(session.access_token, supabaseUser);

    return { success: true, message: 'Signed in successfully!' };
}