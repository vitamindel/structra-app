import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  Users,
  Bell,
  Search,
  Settings,
  Maximize2,
  Minimize2,
  Database,
  UserPlus,
  MessageSquare,
  Share2,
  Download,
  Bookmark,
  X,
  User,
  LogOut
} from 'lucide-react';
import NGLProteinViewer from '../components/NGLProteinViewer';
import AdvancedMeasurementPanel from '../components/AdvancedMeasurementPanel';
import EnhancedToolbar from '../components/EnhancedToolbar';
import SettingsPanel from '../components/SettingsPanel';
import UserProfile from '../components/UserProfile';
import { useAuth } from '../hooks/useAuth';

interface AtomInfo {
  id: string;
  element: string;
  residue: string;
  residueNumber: number;
  chain: string;
  x: number;
  y: number;
  z: number;
  atomName: string;
}

interface MeasurementData {
  id: number;
  type: 'distance' | 'angle' | 'torsion';
  atoms: AtomInfo[];
  value: number;
  timestamp: Date;
  highlighted: boolean;
}

interface Notification {
  id: number;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

const EnhancedViewerPage: React.FC = () => {
  const { proteinId, annotationId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  
  // UI State
  const [measurementPanelCollapsed, setMeasurementPanelCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Interaction State
  const [activeMode, setActiveMode] = useState<'select' | 'measure-distance' | 'measure-angle' | 'measure-torsion'>('select');
  const [selectedAtoms, setSelectedAtoms] = useState<AtomInfo[]>([]);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
  const [viewMode, setViewMode] = useState<'cartoon' | 'ball-stick' | 'surface' | 'ribbon'>('cartoon');

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: 'New measurement added', time: '2m ago', type: 'info', read: false },
    { id: 2, message: 'Structure analysis complete', time: '5m ago', type: 'success', read: false },
    { id: 3, message: 'Collaboration invite received', time: '10m ago', type: 'info', read: false },
    { id: 4, message: 'Export completed successfully', time: '15m ago', type: 'success', read: true },
    { id: 5, message: 'Connection restored', time: '1h ago', type: 'success', read: true }
  ]);

  // Settings State with localStorage persistence
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('proteinViewerSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return {
      backgroundColor: '#0a0e1a',
      ambientLighting: 0.4,
      quality: 'high' as 'low' | 'medium' | 'high',
      antialiasing: true,
      shadows: true,
      autoRotate: false,
      rotationSpeed: 0.01,
      atomScale: 1.0,
      bondScale: 0.3,
      showHydrogens: false,
      showWater: false,
      colorScheme: 'chainid' as 'chainid' | 'element' | 'residue' | 'bfactor',
      transparency: 0,
      soundEnabled: true,
      theme: 'dark' as 'dark' | 'light'
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('proteinViewerSettings', JSON.stringify(settings));
  }, [settings]);

  // Apply settings to the page background and body
  useEffect(() => {
    // Apply background color to body
    document.body.style.backgroundColor = settings.backgroundColor;
    
    // Apply theme class to root
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    } else {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    }

    // Cleanup on unmount
    return () => {
      document.body.style.backgroundColor = '';
      root.classList.remove('light-theme', 'dark-theme');
    };
  }, [settings.backgroundColor, settings.theme]);

  // Mock collaborators
  const collaborators = [
    { id: '1', name: 'John Doe', status: 'online' as const, color: '#3b82f6', avatar: 'JD' },
    { id: '2', name: 'Jane Smith', status: 'online' as const, color: '#10b981', avatar: 'JS' },
    { id: '3', name: 'Mike Jones', status: 'away' as const, color: '#f59e0b', avatar: 'MJ' },
    { id: '4', name: 'Sarah Wilson', status: 'offline' as const, color: '#ef4444', avatar: 'SW' }
  ];

  // Get unread notification count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setShowNotifications(false);
        setShowCollaborators(false);
        setShowSearch(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save protein to user's history when viewing
  useEffect(() => {
    if (proteinId && isAuthenticated && user) {
      const savedProteins = user.savedProteins || [];
      if (!savedProteins.includes(proteinId)) {
        const updatedProteins = [proteinId, ...savedProteins.slice(0, 9)]; // Keep last 10
        updateUser({ savedProteins: updatedProteins });
      }
    }
  }, [proteinId, isAuthenticated, user, updateUser]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'k') {
          e.preventDefault();
          setShowSearch(true);
        }
        return;
      }
      
      switch (e.key.toLowerCase()) {
        case 's':
          setActiveMode('select');
          break;
        case 'd':
          setActiveMode('measure-distance');
          break;
        case 'a':
          setActiveMode('measure-angle');
          break;
        case 't':
          setActiveMode('measure-torsion');
          break;
        case 'escape':
          setSelectedAtoms([]);
          setShowNotifications(false);
          setShowCollaborators(false);
          setShowSearch(false);
          setShowUserMenu(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleAtomSelect = useCallback((atom: AtomInfo) => {
    if (activeMode === 'select') {
      setSelectedAtoms([atom]);
    } else {
      const requiredAtoms = {
        'measure-distance': 2,
        'measure-angle': 3,
        'measure-torsion': 4
      };

      const required = requiredAtoms[activeMode];
      const newSelection = [...selectedAtoms, atom];

      if (newSelection.length === required) {
        // Create measurement
        const measurement: MeasurementData = {
          id: Date.now(),
          type: activeMode.replace('measure-', '') as any,
          atoms: newSelection,
          value: calculateMeasurement(newSelection, activeMode),
          timestamp: new Date(),
          highlighted: false
        };

        setMeasurements(prev => [...prev, measurement]);
        setSelectedAtoms([]);
        
        // Add notification
        addNotification(`New ${measurement.type} measurement: ${formatMeasurementValue(measurement)}`, 'success');
        
        // Save measurement to user profile if authenticated
        if (isAuthenticated && user) {
          const userMeasurements = user.measurements || [];
          updateUser({ 
            measurements: [...userMeasurements, { 
              ...measurement, 
              proteinId,
              createdAt: new Date().toISOString()
            }]
          });
        }
      } else if (newSelection.length < required) {
        setSelectedAtoms(newSelection);
      } else {
        // Too many atoms, restart
        setSelectedAtoms([atom]);
      }
    }
  }, [activeMode, selectedAtoms, isAuthenticated, user, proteinId, updateUser]);

  const calculateMeasurement = (atoms: AtomInfo[], type: string): number => {
    switch (type) {
      case 'measure-distance':
        if (atoms.length === 2) {
          const dx = atoms[0].x - atoms[1].x;
          const dy = atoms[0].y - atoms[1].y;
          const dz = atoms[0].z - atoms[1].z;
          return Math.sqrt(dx * dx + dy * dy + dz * dz);
        }
        break;
      case 'measure-angle':
        if (atoms.length === 3) {
          // Calculate angle between three atoms
          const v1 = { x: atoms[0].x - atoms[1].x, y: atoms[0].y - atoms[1].y, z: atoms[0].z - atoms[1].z };
          const v2 = { x: atoms[2].x - atoms[1].x, y: atoms[2].y - atoms[1].y, z: atoms[2].z - atoms[1].z };
          
          const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
          const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
          const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
          
          return Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI);
        }
        break;
      case 'measure-torsion':
        if (atoms.length === 4) {
          // Simplified torsion angle calculation
          return Math.random() * 360 - 180; // Mock calculation
        }
        break;
    }
    return 0;
  };

  const formatMeasurementValue = (measurement: MeasurementData): string => {
    switch (measurement.type) {
      case 'distance':
        return `${measurement.value.toFixed(2)} Å`;
      case 'angle':
      case 'torsion':
        return `${measurement.value.toFixed(1)}°`;
      default:
        return measurement.value.toFixed(2);
    }
  };

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      time: 'just now',
      type,
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/viewer/${proteinId}${selectedAtoms.length > 0 ? `?atoms=${selectedAtoms.map(a => a.id).join(',')}` : ''}`;
    await navigator.clipboard.writeText(url);
    addNotification('Share link copied to clipboard!', 'success');
  };

  const handleExportView = () => {
    // Implementation for exporting current view as image
    addNotification('Exporting view as image...', 'info');
    setTimeout(() => {
      addNotification('View exported successfully!', 'success');
    }, 2000);
  };

  const handleBookmarkView = () => {
    // Implementation for bookmarking current view state
    if (isAuthenticated && proteinId) {
      addNotification('View bookmarked successfully!', 'success');
    } else {
      addNotification('Please sign in to bookmark views', 'warning');
    }
  };

  const clearMeasurements = () => {
    setMeasurements([]);
    setSelectedAtoms([]);
    addNotification('All measurements cleared', 'info');
  };

  const handleHighlightMeasurement = (id: number) => {
    setMeasurements(prev => prev.map(m => 
      m.id === id ? { ...m, highlighted: !m.highlighted } : m
    ));
  };

  const handleExportMeasurements = () => {
    const data = measurements.map(m => ({
      type: m.type,
      value: m.value,
      atoms: m.atoms.map(a => `${a.residue}${a.residueNumber}`).join(' → '),
      timestamp: m.timestamp.toISOString()
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${proteinId}_measurements.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    addNotification('Measurements exported successfully!', 'success');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Mock search functionality
      addNotification(`Searching for "${query}"...`, 'info');
      setTimeout(() => {
        addNotification(`Found 3 results for "${query}"`, 'success');
      }, 1000);
    }
  };

  const inviteCollaborator = () => {
    if (isAuthenticated) {
      addNotification('Collaboration invite sent!', 'success');
    } else {
      addNotification('Please sign in to invite collaborators', 'warning');
    }
  };

  const handleSettingsChange = (newSettings: any) => {
    setSettings(newSettings);
    addNotification('Settings updated successfully!', 'success');
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <div 
      className="h-screen flex overflow-hidden transition-colors duration-300"
      style={{ 
        background: settings.theme === 'light' 
          ? `linear-gradient(to bottom right, ${settings.backgroundColor}, #f1f5f9)` 
          : `linear-gradient(to bottom right, ${settings.backgroundColor}, #0f172a)`
      }}
    >
      {/* Dropdown Portal Container - Highest z-index for all dropdowns */}
      {(showNotifications || showCollaborators || showSearch || showUserMenu) && (
        <div className="fixed inset-0 z-[10000] pointer-events-none">
          {/* User Menu Dropdown */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                className="absolute bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl min-w-64 pointer-events-auto dropdown-container"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  right: '1rem',
                  top: '4rem',
                }}
              >
                <div className="p-4 border-b border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.avatar}
                    </div>
                    <div>
                      <div className="text-white font-medium">{user?.firstName} {user?.lastName}</div>
                      <div className="text-xs text-slate-400">{user?.email}</div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setProfileOpen(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setSettingsOpen(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-slate-700 my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-600/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className="absolute bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl min-w-96 max-w-md pointer-events-auto dropdown-container"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  right: isAuthenticated ? '5rem' : '1rem',
                  top: '4rem',
                }}
              >
                <div className="p-4 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <div className="flex items-center space-x-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-cyan-400 hover:text-cyan-300"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-slate-700/50 last:border-b-0 hover:bg-slate-700/30 transition-colors ${
                          !notification.read ? 'bg-slate-700/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className={`w-2 h-2 rounded-full ${
                                notification.type === 'success' ? 'bg-green-400' :
                                notification.type === 'error' ? 'bg-red-400' :
                                notification.type === 'warning' ? 'bg-yellow-400' :
                                'bg-blue-400'
                              }`} />
                              <span className="text-sm text-slate-300">{notification.message}</span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                              )}
                            </div>
                            <div className="text-xs text-slate-500">{notification.time}</div>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <button
                                onClick={() => markNotificationAsRead(notification.id)}
                                className="text-xs text-cyan-400 hover:text-cyan-300"
                              >
                                Mark read
                              </button>
                            )}
                            <button
                              onClick={() => clearNotification(notification.id)}
                              className="text-slate-400 hover:text-red-400"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collaborators Dropdown */}
          <AnimatePresence>
            {showCollaborators && (
              <motion.div
                className="absolute bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl min-w-80 pointer-events-auto dropdown-container"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  right: isAuthenticated ? '9rem' : '5rem',
                  top: '4rem',
                }}
              >
                <div className="p-4 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Collaborators</h3>
                    <button
                      onClick={() => setShowCollaborators(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <button
                    onClick={inviteCollaborator}
                    className="w-full flex items-center space-x-3 p-3 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-600/30 rounded-lg text-cyan-300 hover:text-cyan-200 transition-all mb-4"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Invite Collaborator</span>
                  </button>
                  <div className="space-y-2">
                    {collaborators.map((collaborator) => (
                      <div key={collaborator.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700/30">
                        <div className="relative">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                            style={{ backgroundColor: collaborator.color }}
                          >
                            {collaborator.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-slate-800 rounded-full ${
                            collaborator.status === 'online' ? 'bg-green-400' :
                            collaborator.status === 'away' ? 'bg-yellow-400' :
                            'bg-slate-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{collaborator.name}</div>
                          <div className="text-xs text-slate-400 capitalize">{collaborator.status}</div>
                        </div>
                        <button className="p-1 text-slate-400 hover:text-white">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Dropdown */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                className="absolute bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl min-w-96 pointer-events-auto dropdown-container"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  left: '50%',
                  top: '4rem',
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch(searchQuery);
                          setShowSearch(false);
                        }
                        if (e.key === 'Escape') {
                          setShowSearch(false);
                        }
                      }}
                      placeholder="Search structures, measurements, annotations..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => setShowSearch(false)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    Press Enter to search, Esc to close
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Header Bar */}
      <motion.div 
        className="absolute top-0 left-0 right-0 z-30 bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Structra</span>
            </button>
            
            <div className="h-6 w-px bg-slate-600" />
            
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-cyan-400" />
              <div className="text-white font-mono font-bold text-lg">
                {proteinId?.toUpperCase() || 'Loading...'}
              </div>
              <div className="px-2 py-1 bg-cyan-600/20 text-cyan-300 text-xs rounded-full">
                {viewMode}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <button
              onClick={() => setShowSearch(true)}
              className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50 dropdown-container"
              title="Search (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50 dropdown-container"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Collaborators Button */}
            <button
              onClick={() => setShowCollaborators(!showCollaborators)}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50 dropdown-container"
              title="Collaborators"
            >
              <Users className="w-5 h-5" />
            </button>

            {/* User Menu or Auth Buttons */}
            {isAuthenticated ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50 dropdown-container"
                title="User Menu"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user?.avatar}
                </div>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate('/')}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-3 py-1 rounded-lg transition-all text-sm"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Settings Button */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area - Now Full Width */}
      <div className="flex-1 relative pt-16">
        {/* Enhanced Toolbar */}
        <EnhancedToolbar
          activeMode={activeMode}
          onModeChange={setActiveMode}
          onShare={handleShare}
          onClearMeasurements={clearMeasurements}
          onExportView={handleExportView}
          onBookmarkView={handleBookmarkView}
          selectedAtomsCount={selectedAtoms.length}
          measurementCount={measurements.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        {/* NGL 3D Viewer - Now Full Width */}
        <NGLProteinViewer
          proteinId={proteinId}
          onAtomSelect={handleAtomSelect}
          selectedAtoms={selectedAtoms}
          measurements={measurements}
          annotations={annotations}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Atom Info Panel - positioned above measurements */}
        {selectedAtoms.length > 0 && (
          <motion.div
            className="absolute bottom-4 right-4 z-25 bg-slate-800/90 backdrop-blur-md border border-slate-600/50 rounded-xl p-4 max-w-xs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: '#06b6d4' }}
              />
              Selected Atom
            </h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-slate-400">Element:</div>
                <div className="text-white font-mono">{selectedAtoms[0].element}</div>
                <div className="text-slate-400">Residue:</div>
                <div className="text-white font-mono">{selectedAtoms[0].residue}{selectedAtoms[0].residueNumber}</div>
                <div className="text-slate-400">Chain:</div>
                <div className="text-white font-mono">{selectedAtoms[0].chain}</div>
                <div className="text-slate-400">Atom Name:</div>
                <div className="text-white font-mono">{selectedAtoms[0].atomName}</div>
              </div>
              <div className="pt-2 border-t border-slate-600/50">
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Coordinates: ({selectedAtoms[0].x.toFixed(2)}, {selectedAtoms[0].y.toFixed(2)}, {selectedAtoms[0].z.toFixed(2)})</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Advanced Measurements Panel */}
      <AnimatePresence>
        {measurements.length > 0 && (
          <AdvancedMeasurementPanel
            measurements={measurements}
            onClear={clearMeasurements}
            onRemoveMeasurement={(id) => 
              setMeasurements(prev => prev.filter(m => m.id !== id))
            }
            onHighlightMeasurement={handleHighlightMeasurement}
            onExportMeasurements={handleExportMeasurements}
            isCollapsed={measurementPanelCollapsed}
            onToggleCollapse={() => setMeasurementPanelCollapsed(!measurementPanelCollapsed)}
          />
        )}
      </AnimatePresence>

      {/* Settings Panel - Now with highest z-index */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
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

      {/* Loading Overlay for page transitions */}
      <AnimatePresence>
        {!proteinId && (
          <motion.div
            className="absolute inset-0 bg-slate-900/90 flex items-center justify-center z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <motion.div
                className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <h3 className="text-xl font-semibold text-white mb-2">Loading Protein Data</h3>
              <p className="text-slate-400">Preparing molecular visualization...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedViewerPage;