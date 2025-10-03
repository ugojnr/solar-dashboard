import React, { createContext, useContext, useEffect, useState } from "react";
import { getAccessToken, setAccessToken } from "../api";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  signIn: (t: string) => void;
  signOut: () => void;
};
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<any> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getAccessToken());

  useEffect(() => setAccessToken(token), [token]);

  const signIn = (t: string) => setToken(t);
  const signOut = () => setToken(null);

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
