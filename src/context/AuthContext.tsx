import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { UserProfile } from '../types';
import {
  subscribeToAuth,
  loginUser,
  registerStudent,
  logoutUser,
  getUserProfile,
  updateStudentClassAndDivision,
  RegisterStudentData,
} from '../services/authService';
import { auth, isFirebaseConfigured } from '../lib/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  login: (email: string, pass: string) => Promise<UserProfile>;
  register: (data: RegisterStudentData) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateStudentClass: (classGrade: string, division: string) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToAuth((firebaseUser, userProfile) => {
      setUser(firebaseUser);
      setProfile(userProfile);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [configured]);

  const login = async (email: string, pass: string) => {
    const userProfile = await loginUser(email, pass);
    if (auth?.currentUser) {
      setUser(auth.currentUser);
    }
    setProfile(userProfile);
    return userProfile;
  };

  const register = async (data: RegisterStudentData) => {
    const studentProfile = await registerStudent(data);
    if (auth?.currentUser) {
      setUser(auth.currentUser);
    }
    setProfile(studentProfile);
    return studentProfile;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await getUserProfile(user.uid);
      setProfile(p);
    }
  };

  const updateStudentClass = async (classGrade: string, division: string) => {
    if (!user) {
      throw new Error('You must be signed in to update your profile.');
    }
    const updated = await updateStudentClassAndDivision(user.uid, classGrade, division);
    setProfile(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isConfigured: configured,
        login,
        register,
        logout,
        refreshProfile,
        updateStudentClass,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
