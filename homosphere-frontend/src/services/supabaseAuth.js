import supabase from '../utils/supabase';
import ROUTES from '../constants/routes';
import {authApi} from '../services/api/authApi';
import { saveAuthSession } from './authSession';
import {SUPABASE_ERROR} from "@/src/constants/supabaseErrors.js";

export async function signUpWithSupabase(signUpData) {
    let payload = {
        accessToken: null,
        user: null,
        errorMsg: null,
    }
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
        const errorMsg = SUPABASE_ERROR[error.message] || error.message;
        payload = {
            ...payload,
            errorMsg: errorMsg
        };
    } else {
        const accessToken = data.session.access_token;
        const user = data.user
        await authApi.signup(accessToken, signUpData);
        payload = {
            ...payload,
            user : user,
            accessToken: accessToken
        }
    }

    return payload;
}

export async function signInWithSupabase({ email, password }) {
    const payload = {
        accessToken: null,
        user: null,
        errorMsg: null,
    }
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

    await saveAuthSession(session.access_token, supabaseUser);

    return { accessToken: session.access_token, user: supabaseUser };
}