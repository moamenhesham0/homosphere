import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import supabase from '../utils/supabase';

const SupabaseContext = createContext(null);

function getAuthStateFromSession(session) {
  const normalizedSession = session || null;

  return {
	session: normalizedSession,
	user: normalizedSession?.user || null,
	accessToken: normalizedSession?.access_token || '',
	isAuthenticated: Boolean(normalizedSession?.user),
  };
}

export function SupabaseProvider({ children }) {
  const [authState, setAuthState] = useState(() => getAuthStateFromSession(null));
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((session) => {
	setAuthState(getAuthStateFromSession(session));
  }, []);

  const syncAuthState = useCallback(({ session, user, accessToken } = {}) => {
	if (session) {
	  applySession(session);
	  return;
	}

	if (!user && !accessToken) {
	  applySession(null);
	  return;
	}

	applySession({
	  access_token: accessToken || '',
	  user: user || null,
	});
  }, [applySession]);

  useEffect(() => {
	let isMounted = true;

	async function bootstrapSession() {
	  const { data, error } = await supabase.auth.getSession();

	  if (!isMounted) {
		return;
	  }

	  if (error) {
		applySession(null);
	  } else {
		applySession(data?.session || null);
	  }

	  setIsLoading(false);
	}

	bootstrapSession();

	const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
	  applySession(session || null);
	  if (isMounted) {
		setIsLoading(false);
	  }
	});

	return () => {
	  isMounted = false;
	  authListener?.subscription?.unsubscribe();
	};
  }, [applySession]);

  const signOut = useCallback(async () => {
	const { error } = await supabase.auth.signOut();
	if (error) {
	  throw error;
	}
  }, []);

  const value = useMemo(
	() => ({
	  ...authState,
	  isLoading,
	  syncAuthState,
	  signOut,
	}),
	[authState, isLoading, syncAuthState, signOut],
  );

  return createElement(SupabaseContext.Provider, { value }, children);
}

export function useSupabaseUser() {
  const context = useContext(SupabaseContext);

  if (!context) {
	throw new Error('useSupabaseUser must be used within a SupabaseProvider.');
  }

  return context;
}


