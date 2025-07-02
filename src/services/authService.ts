import { User } from '../../shared/types';

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

// Mock user storage using localStorage
const USERS_KEY = 'lab_analyzer_users';
const CURRENT_USER_KEY = 'lab_analyzer_current_user';

function getStoredUsers(): any[] {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: any[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const authService = {
  async signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const users = getStoredUsers();
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return { user: null, error: 'User already exists with this email' };
      }

      // Create new user
      const newUser = {
        id: generateId(),
        email,
        name,
        password, // In real app, this would be hashed
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      saveUsers(users);

      // Set as current user
      const user: User = {
        _id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: new Date(newUser.createdAt),
      };

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const users = getStoredUsers();
      
      // Find user
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        return { user: null, error: 'Invalid email or password' };
      }

      // Set as current user
      const currentUser: User = {
        _id: user.id,
        email: user.email,
        name: user.name,
        createdAt: new Date(user.createdAt),
      };

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

      return { user: currentUser, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signOut(): Promise<{ error: string | null }> {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const userStr = localStorage.getItem(CURRENT_USER_KEY);
      if (!userStr) return null;

      const userData = JSON.parse(userStr);
      return {
        _id: userData._id,
        email: userData.email,
        name: userData.name,
        createdAt: new Date(userData.createdAt),
      };
    } catch {
      return null;
    }
  },
};