import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Search, Atom, Users, MessageSquare, Share2, Zap, Database, Microscope, Dna, User, LogOut, Star, ArrowRight, ChevronDown, Play, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import PDBInput from '../components/PDBInput';
import ParticleBackground from '../components/ParticleBackground';
import AuthModal from '../components/AuthModal';
import UserProfile from '../components/UserProfile';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pdb' | 'upload'>('pdb');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout, updateUser } = useAuth();

  const handleProteinLoaded = (proteinId: string) => {
    navigate(`/viewer/${proteinId}`);
  };

  const handleAuthSuccess = (userData: any) => {
    login(userData);
    setAuthModalOpen(false);
  };

  const handleSignInClick = () => {
    setAuthMode('signin');
    setAuthModalOpen(true);
  };

  const handleGetStartedClick = () => {
    if (isAuthenticated) {
      // If user is already signed in, scroll to the main input section
      document.querySelector('.main-input-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setAuthMode('signup');
      setAuthModalOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  const features = [
    {
      icon: Microscope,
      title: 'Real PDB Structures',
      description: 'Load authentic protein structures directly from RCSB Protein Data Bank with accurate 3D coordinates'
    },
    {
      icon: Atom,
      title: 'Beautiful Ribbon Visualization',
      description: 'High-fidelity cartoon and ribbon representations with smooth secondary structure rendering'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Real-time annotation sharing and discussion threads for collaborative structural analysis'
    },
    {
      icon: MessageSquare,
      title: 'Smart Measurements',
      description: 'Precise distance, angle, and torsion measurements with publication-ready export capabilities'
    }
  ];

  const showcaseProteins = [
    {
      id: '8R9U',
      name: 'SARS-CoV-2 Spike Protein',
      description: 'Viral entry mechanism',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: '1BNA',
      name: 'Barnase',
      description: 'Ribonuclease enzyme',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '2GBP',
      name: 'Glucose Binding Protein',
      description: 'Sugar transport mechanism',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: '1HTM',
      name: 'HIV-1 Protease',
      description: 'Drug target enzyme',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 backdrop-blur-sm bg-slate-900/20 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="relative">
                <Dna className="h-10 w-10 text-cyan-400 drop-shadow-lg" />
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
              </div>
              <motion.div
                className="absolute inset-0 opacity-60"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Atom className="h-10 w-10 text-blue-400 opacity-40" />
              </motion.div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-white tracking-tight">Structra</h1>
              <span className="text-xs text-cyan-400/80 font-medium">Molecular Visualization</span>
            </div>
            <span className="text-xs bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-cyan-300 px-3 py-1.5 rounded-full border border-cyan-500/30 backdrop-blur-sm">
              PDB Viewer
            </span>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-200 font-medium">Welcome, {user?.firstName}!</span>
                </div>
                <button
                  onClick={() => setProfileOpen(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25 hover:scale-105"
                >
                  <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-xs font-bold backdrop-blur-sm">
                    {user?.avatar}
                  </div>
                  <span>Profile</span>
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={handleSignInClick}
                  className="text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-slate-800/50"
                >
                  Sign In
                </button>
                <button 
                  onClick={handleGetStartedClick}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25 hover:scale-105 flex items-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center">
          <motion.h1 
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="relative">
              Visualize Proteins.
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8"
                animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </motion.div>
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 drop-shadow-2xl">
              Discover Biology.
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-slate-300 mb-16 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="text-slate-200 font-medium">Professional-grade protein structure visualization</span> powered by real PDB data. 
            Load any protein structure with a simple 4-letter ID and explore it in <span className="text-cyan-400 font-semibold">stunning 3D ribbon representation</span>.
            {isAuthenticated && (
              <span className="block mt-4 text-cyan-300 bg-cyan-900/20 px-4 py-2 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
                <Star className="w-4 h-4 inline mr-2" />
                Welcome back, {user?.firstName}! Your saved structures and measurements are ready.
              </span>
            )}
          </motion.p>

          {/* Main Input Section */}
          <motion.div 
            className="main-input-section max-w-2xl mx-auto bg-slate-800/60 backdrop-blur-md rounded-3xl border border-slate-700/60 p-10 mb-20 shadow-2xl shadow-slate-900/50"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {!isAuthenticated && (
              <motion.div 
                className="mb-8 p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/40 rounded-2xl backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-cyan-500/30 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-cyan-300" />
                  </div>
                  <p className="text-cyan-200 font-semibold">Unlock Premium Features</p>
                </div>
                <p className="text-cyan-300/90 text-sm leading-relaxed">
                  <strong>Sign up for free</strong> to save your work, collaborate with others, and access advanced features!
                </p>
                <button
                  onClick={handleGetStartedClick}
                  className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center space-x-1 hover:space-x-2 transition-all"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            <div className="flex justify-center mb-8">
              <div className="flex bg-slate-700/60 rounded-xl p-1.5 backdrop-blur-sm border border-slate-600/50">
                <button
                  onClick={() => setActiveTab('pdb')}
                  className={`px-8 py-3.5 rounded-lg transition-all flex items-center space-x-2 font-medium ${
                    activeTab === 'pdb'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>PDB ID</span>
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-8 py-3.5 rounded-lg transition-all flex items-center space-x-2 font-medium ${
                    activeTab === 'upload'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload File</span>
                </button>
              </div>
            </div>

            {activeTab === 'pdb' ? (
              <PDBInput onProteinLoaded={handleProteinLoaded} />
            ) : (
              <FileUpload onProteinLoaded={handleProteinLoaded} />
            )}
          </motion.div>

          {/* User's Recent Activity (if authenticated) */}
          {isAuthenticated && user?.savedProteins && user.savedProteins.length > 0 && (
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-center justify-center space-x-3 mb-10">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent flex-1" />
                <h3 className="text-3xl font-bold text-white flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Database className="w-4 h-4 text-white" />
                  </div>
                  <span>Your Recent Structures</span>
                </h3>
                <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent flex-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user.savedProteins.slice(0, 3).map((proteinId, index) => (
                  <motion.button
                    key={proteinId}
                    onClick={() => handleProteinLoaded(proteinId)}
                    className="group relative p-8 bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/40 hover:border-cyan-500/50 transition-all duration-300 text-left overflow-hidden"
                    whileHover={{ y: -8, scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Database className="w-7 h-7 text-white" />
                      </div>
                      <div className="font-mono font-bold text-cyan-400 text-xl mb-2 group-hover:text-cyan-300 transition-colors">
                        {proteinId.toUpperCase()}
                      </div>
                      <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors flex items-center space-x-2">
                        <span>Recently viewed</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Showcase Proteins */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-12">
              <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent flex-1" />
              <h3 className="text-3xl font-bold text-white flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <span>Featured Structures</span>
              </h3>
              <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent flex-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {showcaseProteins.map((protein, index) => (
                <motion.button
                  key={protein.id}
                  onClick={() => handleProteinLoaded(protein.id)}
                  className="group relative p-8 bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 text-left overflow-hidden"
                  whileHover={{ y: -8, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${protein.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${protein.color} mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <Atom className="w-7 h-7 text-white" />
                    </div>
                    <div className="font-mono font-bold text-cyan-400 text-xl mb-2 group-hover:text-cyan-300 transition-colors">
                      {protein.id}
                    </div>
                    <h4 className="font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors text-lg">
                      {protein.name}
                    </h4>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors flex items-center space-x-2">
                      <span>{protein.description}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-center space-x-3 mb-16">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent flex-1" />
          <h2 className="text-4xl font-bold text-white flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span>Powerful Features</span>
          </h2>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent flex-1" />
        </div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/40 p-8 hover:bg-slate-800/60 hover:border-slate-600/60 transition-all duration-300 group overflow-hidden relative"
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-slate-700/60 bg-slate-800/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-slate-400">
              <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Powered by RCSB Protein Data Bank</span>
            </div>
            <div className="text-sm text-slate-500 font-medium">
              Built for structural biology research
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* User Profile Modal */}
      {isAuthenticated && (
        <UserProfile
          user={user}
          onUserUpdate={updateUser}
          onLogout={handleLogout}
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
        />
      )}
    </div>
  );
};

export default HomePage;