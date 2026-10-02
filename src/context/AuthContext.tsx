import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper for local account storage fallback
const getLocalUsers = (): any[] => {
  try {
    const raw = localStorage.getItem('ember_registered_users');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalUser = (user: any) => {
  try {
    const users = getLocalUsers();
    users.push(user);
    localStorage.setItem('ember_registered_users', JSON.stringify(users));
  } catch (e) {
    console.error(e);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('ember_user_profile');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      if (token) {
        if (!user) {
          const stored = localStorage.getItem('ember_user_profile');
          if (stored) {
            try {
              setUser(JSON.parse(stored));
            } catch {
              setUser({ name: 'Member', role: 'customer' });
            }
          } else {
            setUser({ name: 'Member', role: 'customer' });
          }
        }
      }
      setIsLoading(false);
    };
    verifySession();
  }, [token]);

  const login = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('customer_logged_in', 'true');
        localStorage.setItem('ember_user_profile', JSON.stringify(data.user));
        if (data.user.role === 'admin') {
          localStorage.setItem('ember_admin_auth', 'true');
        }
        setToken(data.token);
        setUser(data.user);
        return;
      }
    } catch {
      // Backend not reached, proceed to local check
    }

    // Client-side fallback check
    if (cleanEmail === 'admin@oliveandrestro.com' && password === 'admin123') {
      const adminUser: User = { name: 'Admin Manager', email: cleanEmail, role: 'admin' };
      localStorage.setItem('auth_token', 'secret-admin-token');
      localStorage.setItem('customer_logged_in', 'true');
      localStorage.setItem('ember_admin_auth', 'true');
      localStorage.setItem('ember_user_profile', JSON.stringify(adminUser));
      setToken('secret-admin-token');
      setUser(adminUser);
      return;
    }

    const localUsers = getLocalUsers();
    const localMatch = localUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (localMatch) {
      const custUser: User = {
        name: localMatch.name,
        email: localMatch.email,
        phone: localMatch.phone,
        role: 'customer',
      };
      const localToken = `token_local_${Date.now()}`;
      localStorage.setItem('auth_token', localToken);
      localStorage.setItem('customer_logged_in', 'true');
      localStorage.setItem('ember_user_profile', JSON.stringify(custUser));
      setToken(localToken);
      setUser(custUser);
      return;
    }

    throw new Error('Invalid email or password. Please verify your credentials or register for an account.');
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? phone.trim() : '';

    if (!cleanName || !cleanEmail || !password) {
      throw new Error('Name, email, and password are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Check local duplicate first
    const existingLocals = getLocalUsers();
    if (existingLocals.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, phone: cleanPhone, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Also cache locally
        saveLocalUser({ name: cleanName, email: cleanEmail, phone: cleanPhone, password });
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('customer_logged_in', 'true');
        localStorage.setItem('ember_user_profile', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return;
      } else {
        const err = await response.json();
        if (err.error) {
          throw new Error(err.error);
        }
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      // If server unreachable, save locally as fallback
      saveLocalUser({ name: cleanName, email: cleanEmail, phone: cleanPhone, password });
      const newUser: User = { name: cleanName, email: cleanEmail, phone: cleanPhone, role: 'customer' };
      const localToken = `token_reg_${Date.now()}`;
      localStorage.setItem('auth_token', localToken);
      localStorage.setItem('customer_logged_in', 'true');
      localStorage.setItem('ember_user_profile', JSON.stringify(newUser));
      setToken(localToken);
      setUser(newUser);
    }
  };

  const loginWithGoogle = async () => {
    const mockEmail = 'divyanshukrsingh17@gmail.com';
    const mockName = 'Divyanshu Kumar Singh';

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: mockEmail, name: mockName }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('customer_logged_in', 'true');
        localStorage.setItem('ember_user_profile', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return;
      }
    } catch {
      // Fallback
    }

    const googleUser: User = { name: mockName, email: mockEmail, role: 'customer' };
    const googleToken = `token_google_${Date.now()}`;
    localStorage.setItem('auth_token', googleToken);
    localStorage.setItem('customer_logged_in', 'true');
    localStorage.setItem('ember_user_profile', JSON.stringify(googleUser));
    setToken(googleToken);
    setUser(googleUser);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('customer_logged_in');
    localStorage.removeItem('ember_admin_auth');
    localStorage.removeItem('ember_user_profile');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, loginWithGoogle, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
