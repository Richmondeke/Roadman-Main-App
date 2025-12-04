
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoadmanButton, RoadmanInput, RoadmanCard } from './TronComponents';
import { login, signup } from '../services/authService';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
      email: '',
      password: '',
      firstName: '',
      lastName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
          let user: User;
          if (mode === 'LOGIN') {
              user = await login(formData.email);
          } else {
              user = await signup(formData.email, formData.firstName, formData.lastName);
          }
          onSuccess(user);
      } catch (err) {
          setError('Authentication failed. Please try again.');
      } finally {
          setLoading(false);
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md z-10"
        >
            <RoadmanCard className="border-t-4 border-t-brand-500 shadow-[0_0_50px_rgba(14,165,233,0.15)]">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-display font-bold text-white mb-2">
                        {mode === 'LOGIN' ? 'Welcome Back' : 'Join Roadman'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {mode === 'LOGIN' ? 'Sign in to complete your booking.' : 'Create an account to start your journey.'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-900/50 p-1 rounded-lg mb-6 border border-slate-700">
                    <button 
                        onClick={() => setMode('LOGIN')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'LOGIN' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Sign In
                    </button>
                    <button 
                        onClick={() => setMode('SIGNUP')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'SIGNUP' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'SIGNUP' && (
                        <div className="grid grid-cols-2 gap-4">
                             <RoadmanInput 
                                label="First Name" 
                                required 
                                value={formData.firstName}
                                onChange={e => setFormData({...formData, firstName: e.target.value})}
                                placeholder="John"
                             />
                             <RoadmanInput 
                                label="Last Name" 
                                required 
                                value={formData.lastName}
                                onChange={e => setFormData({...formData, lastName: e.target.value})}
                                placeholder="Doe"
                             />
                        </div>
                    )}
                    
                    <RoadmanInput 
                        label="Email Address" 
                        type="email"
                        required 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="name@example.com"
                    />

                    <RoadmanInput 
                        label="Password" 
                        type="password"
                        required 
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        placeholder="••••••••"
                    />

                    {error && (
                        <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-xs text-center">
                            {error}
                        </div>
                    )}

                    <RoadmanButton 
                        type="submit" 
                        isLoading={loading}
                        className="w-full mt-4"
                    >
                        {mode === 'LOGIN' ? 'Sign In' : 'Create Account'}
                    </RoadmanButton>
                </form>

                <div className="mt-6 text-center">
                    <button onClick={onClose} className="text-gray-500 text-xs hover:text-white transition-colors">
                        Cancel and go back
                    </button>
                </div>
            </RoadmanCard>
        </motion.div>
    </div>
  );
};
