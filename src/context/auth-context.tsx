import { createContext, useContext, useEffect, useState } from 'react';
import { onUserStateChange, logout } from '../api/firebase';
import { User as FirebaseUser } from 'firebase/auth';

type authContext = {
  user: FirebaseUser | null;
  logout: () => void;
};

const AuthContext = createContext<authContext>({
  user: null,
  logout,
});

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => onUserStateChange(setUser), []);

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
