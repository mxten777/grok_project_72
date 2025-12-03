import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import type { User as AppUser } from '../types';

export type AuthUser = (FirebaseUser & AppUser) | null;

interface AuthContextType {
  user: AuthUser;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser>(null);

  useEffect(() => {
    console.log('AuthContext: Initializing Firebase auth listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('AuthContext: Auth state changed', firebaseUser?.email, firebaseUser?.uid);
      if (firebaseUser) {
        console.log('AuthContext: User is authenticated, fetching user document...');
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            console.log('AuthContext: User document found', userDocSnap.data());
            const userData = { ...firebaseUser, ...userDocSnap.data() } as AuthUser;
            console.log('AuthContext: Setting user data', userData);
            setUser(userData);
          } else {
            console.log('AuthContext: User document not found, using Firebase user only');
            setUser(firebaseUser as AuthUser);
          }
        } catch (error) {
          console.error('AuthContext: Error fetching user document', error);
          setUser(firebaseUser as AuthUser);
        }
      } else {
        console.log('AuthContext: No user logged in, setting user to null');
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};