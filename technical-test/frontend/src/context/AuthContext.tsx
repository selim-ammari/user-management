import React, { createContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { User } from '../types/User';
import { getUsers } from '../services/api';

type AuthContextValue = {
  user: User | null;
  login: (user: Pick<User, 'lastname' | 'firstname'> & { role?: 'user' | 'admin' }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('auth_user');
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user));
    else localStorage.removeItem('auth_user');
  }, [user]);

  const login = async (payload: Pick<User, 'lastname' | 'firstname'>) => {
    try {
      const users = await getUsers();
      const existing = users.find(
        (u) => u.firstname === payload.firstname && u.lastname === payload.lastname
      );
      if (existing) {
        setUser(existing);
      } else {
        setUser({...payload});
      }
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  const logout = () => setUser(null);

  const value = useMemo<AuthContextValue>(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;


