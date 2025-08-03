import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Loader,
  CheckCircle,
  AlertCircle,
  Github,
  Chrome,
  Dna
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
  onAuthSuccess: (user: any) => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  institution: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  general?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode,
  onModeChange,
  onAuthSuccess
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    institution: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (mode === 'signup') {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock authentication logic
      if (mode === 'signin') {
        // Check if user exists (mock)
        const mockUsers = JSON.parse(localStorage.getItem('drugapp_users') || '[]');
        const user = mockUsers.find((u: any) => u.email === formData.email);
        
        if (!user || user.password !== formData.password) {
          setErrors({ general: 'Invalid email or password' });
          setIsLoading(false);
          return;
        }

        // Successful login
        const userData = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          institution: user.institution,
          avatar: user.avatar,
          joinDate: user.joinDate,
          lastLogin: new Date().toISOString()
        };

        localStorage.setItem('drugapp_current_user', JSON.stringify(userData));
        onAuthSuccess(userData);
      } else {
        // Sign up
        const mockUsers = JSON.parse(localStorage.getItem('drugapp_users') || '[]');
        
        // Check if user already exists
        if (mockUsers.some((u: any) => u.email === formData.email)) {
          setErrors({ general: 'An account with this email already exists' });
          setIsLoading(false);
          return;
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          email: formData.email,
          password: formData.password, // In real app, this would be hashed
          firstName: formData.firstName,
          lastName: formData.lastName,
          institution: formData.institution,
          avatar: `${formData.firstName[0]}${formData.lastName[0]}`,
          joinDate: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          preferences: {
            theme: 'dark',
            notifications: true,
            autoSave: true
          },
          savedProteins: [],
          measurements: [],
          annotations: []
        };

        mockUsers.push(newUser);
        localStorage.setItem('drugapp_users', JSON.stringify(mockUsers));
        localStorage.setItem('drugapp_current_user', JSON.stringify(newUser));
        
        onAuthSuccess(newUser);
      }
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    
    try {
      // Simulate social auth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser = {
        id: Date.now().toString(),
        email: `user@${provider}.com`,
        firstName: 'Demo',
        lastName: 'User',
        institution: 'Demo Institution',
        avatar: 'DU',
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        provider,
        preferences: {
          theme: 'dark',
          notifications: true,
          autoSave: true
        },
        savedProteins: [],
        measurements: [],
        annotations: []
      };

      localStorage.setItem('drugapp_current_user', JSON.stringify(mockUser));
      onAuthSuccess(mockUser);
    } catch (error) {
      setErrors({ general: `Failed to sign in with ${provider}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[30000] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Dna className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {mode === 'signin' ? 'Welcome Back' : 'Join Structra'}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {mode === 'signin' 
                      ? 'Sign in to access your protein structures' 
                      : 'Create your account to get started'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Social Auth Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialAuth('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 p-3 bg-white hover:bg-gray-50 text-gray-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Chrome className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>
              <button
                onClick={() => handleSocialAuth('github')}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Github className="w-5 h-5" />
                <span>Continue with GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error */}
              {errors.general && (
                <motion.div
                  className="p-3 bg-red-600/20 border border-red-600/30 rounded-lg flex items-center space-x-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-300 text-sm">{errors.general}</span>
                </motion.div>
              )}

              {/* Name Fields (Sign Up Only) */}
              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none transition-colors ${
                          errors.firstName 
                            ? 'border-red-500 focus:border-red-400' 
                            : 'border-slate-600 focus:border-cyan-500'
                        }`}
                        placeholder="John"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none transition-colors ${
                          errors.lastName 
                            ? 'border-red-500 focus:border-red-400' 
                            : 'border-slate-600 focus:border-cyan-500'
                        }`}
                        placeholder="Doe"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none transition-colors ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-slate-600 focus:border-cyan-500'
                    }`}
                    placeholder="john@example.com"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Institution (Sign Up Only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Institution (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => handleInputChange('institution', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="University or Company"
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none transition-colors ${
                      errors.password 
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-slate-600 focus:border-cyan-500'
                    }`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                )}
                {mode === 'signup' && (
                  <p className="mt-1 text-xs text-slate-500">
                    Password must be at least 8 characters long
                  </p>
                )}
              </div>

              {/* Confirm Password (Sign Up Only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full pl-10 pr-12 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none transition-colors ${
                        errors.confirmPassword 
                          ? 'border-red-500 focus:border-red-400' 
                          : 'border-slate-600 focus:border-cyan-500'
                      }`}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>{mode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Mode Switch */}
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                {' '}
                <button
                  onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  disabled={isLoading}
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Terms (Sign Up Only) */}
            {mode === 'signup' && (
              <div className="mt-4 text-center">
                <p className="text-xs text-slate-500">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</a>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;