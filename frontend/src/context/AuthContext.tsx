import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Student } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  student: Student | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateStudent: (student: Student) => void;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  college?: string;
  degree?: string;
  branch?: string;
  year?: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_TOKEN_KEY = 'stats_token';
const AUTH_USER_KEY = 'stats_user';
const AUTH_STUDENT_KEY = 'stats_student';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    const storedStudent = localStorage.getItem(AUTH_STUDENT_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      if (storedStudent) setStudent(JSON.parse(storedStudent));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login({ email, password });

    const liveUser: User = {
      id: res.id,
      email: res.email,
      firstName: res.firstName,
      lastName: res.lastName,
      role: res.role as any,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
    };

    const liveStudent: Student | null = res.studentId
      ? {
          id: res.id,
          studentId: res.studentId,
          user: liveUser,
          college: '',
          degree: '',
          branch: '',
          year: 1,
          createdAt: new Date().toISOString(),
        }
      : null;

    setToken(res.token);
    setUser(liveUser);
    if (liveStudent) setStudent(liveStudent);

    localStorage.setItem(AUTH_TOKEN_KEY, res.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(liveUser));
    if (liveStudent) {
      localStorage.setItem(AUTH_STUDENT_KEY, JSON.stringify(liveStudent));
    }
    return liveUser;
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const res = await authService.register({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      college: data.college,
      degree: data.degree,
      branch: data.branch,
      graduationYear: data.year ? Number(data.year) : undefined,
    });

    const liveUser: User = {
      id: res.id,
      email: res.email,
      firstName: res.firstName,
      lastName: res.lastName,
      phone: data.phone,
      role: (res.role as any) || 'STUDENT',
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
    };

    const liveStudent: Student = {
      id: res.id,
      studentId: res.studentId || 'SI' + Date.now().toString().slice(-6),
      user: liveUser,
      college: data.college,
      degree: data.degree,
      branch: data.branch,
      year: data.year,
      createdAt: new Date().toISOString(),
    };

    setToken(res.token);
    setUser(liveUser);
    setStudent(liveStudent);

    localStorage.setItem(AUTH_TOKEN_KEY, res.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(liveUser));
    localStorage.setItem(AUTH_STUDENT_KEY, JSON.stringify(liveStudent));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setStudent(null);
    setToken(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_STUDENT_KEY);
  }, []);

  const updateStudent = useCallback((updatedStudent: Student) => {
    setStudent(updatedStudent);
    localStorage.setItem(AUTH_STUDENT_KEY, JSON.stringify(updatedStudent));
  }, []);

  const value: AuthContextType = {
    user,
    student,
    token,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
    isStudent: user?.role === 'STUDENT',
    isLoading,
    login,
    register,
    logout,
    updateStudent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
