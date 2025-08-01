import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import React, { createContext, useMemo, useState } from 'react';
import type { User } from '@/types/user.types';

interface AuthProviderPropType {
	children: React.ReactNode;
}

interface AuthState {
	accessToken?: string;
	session?: string;
	user: User;
	isInitialized: boolean;
}

export interface AuthContextType extends AuthState {
	setToken: (token: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const AuthContext: React.Context<AuthContextType | {}> = createContext<AuthContextType | {}>({});

const AuthProvider = (props: AuthProviderPropType): JSX.Element => {
	const [auth, setAuth] = useState<AuthState>({ 
		user: {} as User,
		isInitialized: false 
	});

	const setToken = (token: string) => {
		if (token && typeof token === 'string') {
			try {
				const authorizationTok = Cookies.get('authorizationToken');
				const authorizationTokenData = jwtDecode(authorizationTok as string);
				const user = {
					...(typeof authorizationTokenData === 'object' && authorizationTokenData !== null ? authorizationTokenData : {}),
				} as User;
				setAuth((prev) => ({ ...prev, user, accessToken: token }));
			} catch (error) {
				console.error('Error decoding the token:', error);
				setAuth((prev) => ({ ...prev, user: {} as User, accessToken: '' }));
			}
		} else {
			setAuth((prev) => ({ ...prev, user: {} as User, accessToken: '' }));
		}
	};

	const value = useMemo(
		() => ({
			user: auth.user,
			accessToken: auth.accessToken,
			isInitialized: auth.isInitialized,
			setToken,
		}),
		[auth]
	);

	return <AuthContext.Provider value={value} {...props} />;
};

export { AuthProvider, AuthContext };
