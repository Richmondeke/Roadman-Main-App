
import { User } from '../types';

const STORAGE_KEY = 'roadman_user_session';

export const login = async (email: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock User
    const user: User = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        email,
        firstName: 'John', // Mock data
        lastName: 'Doe'
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
};

export const signup = async (email: string, firstName: string, lastName: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user: User = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        email,
        firstName,
        lastName
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
};

export const logout = async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY);
};

export const getSession = (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return null;
        }
    }
    return null;
};
