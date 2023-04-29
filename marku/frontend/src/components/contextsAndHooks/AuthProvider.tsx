import { createContext, type FC, useContext, useEffect, useState } from "react";
import { type ReactNode } from 'react';
import decodeJwt from 'jwt-decode';

import { env } from '../../environment/client.mjs';
import { type Error, makeError } from "../../util/apiTypes";
import { SignupSchema } from "../../pages/signup.jsx";

type UserType = {
  token: string | null;
  permissions: string | null;
} | {}

export type AuthType = {
  user: UserType;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<Error | null>;
  signUp: (email: string, password: string) => Promise<Error | null>;
  logout: () => void;
}

export const AuthContext = createContext<AuthType>({} as AuthType)

export const useAuth = () => {
  return useContext(AuthContext)
}

const isAuthenticated = async () => {
  const permissions = localStorage.getItem('permissions');
  if (!permissions) {
    return false;
  }
  const meInformation = await fetch(`${env.NEXT_PUBLIC_BACKEND_URI}/v1/users/me`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (meInformation.status !== 200) {
    return false;
  }
  return permissions === 'user' || permissions === 'admin' ? true : false;
};

const getStoredCredentials = () => {
  const token = localStorage.getItem('token');
  const permissions = localStorage.getItem('permissions');

  return { token, permissions }
}

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [userCredentials, setUserCredentials] = useState<{ token: string | null, permissions: string | null } | {}>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const handleAuthResponse = async (response: Response) => {
    if (response.status === 500) {
      return makeError("An unexpected error occurred")
    }
    const data = await response.json();
    if (response.status > 400 && response.status < 500) {
      if (data.detail) {
        return makeError(data.detail);
      }
      return makeError("An unexpected error occurred")
    }

    if ('access_token' in data) {
      const decodedToken: any = decodeJwt(data['access_token']);
      localStorage.setItem('token', data['access_token']);
      localStorage.setItem('permissions', decodedToken.permissions);
      setUserCredentials({
        token: decodedToken['access_token'],
        permissions: data.permissions,
      })
    }

    return null;
  }

  // Initial check
  useEffect(() => {
    const func = async () => {

      if (await isAuthenticated()) {
        const credentials = getStoredCredentials();
        setUserCredentials(credentials)
      }
      setIsLoading(false);
    }
    func();

  }, [])


  const login = async (email: string, password: string): Promise<Error | null> => {
    const formData = new FormData();
    // OAuth2 expects form data, not JSON data
    formData.append('username', email);
    formData.append('password', password);

    const request = new Request(`${env.NEXT_PUBLIC_BACKEND_URI}/token`, {
      method: 'POST',
      body: formData,
    });

    const response = await fetch(request);
    return handleAuthResponse(response)
  };

  const signUp = async (
    signUpData: SignupSchema,
  ): Promise<Error | null> => {
    const formData = new FormData();
    // OAuth2 expects form data, not JSON data
    formData.append('first_name', signUpData.first_name);
    formData.append('last_name', signUpData.last_name);
    formData.append('username', signUpData.email);
    formData.append('password', signUpData.password);

    const request = new Request(`${env.NEXT_PUBLIC_BACKEND_URI}/signup`, {
      method: 'POST',
      body: formData,
    });

    const response = await fetch(request);
    return handleAuthResponse(response)
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
    setUserCredentials({})
  }

  const contextValue = {
    user: userCredentials,
    isAuthenticated: Object.keys(userCredentials).length !== 0,
    isLoading,
    login,
    logout,
    signUp,
  }



  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}
