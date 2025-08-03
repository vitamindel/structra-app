import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  LogOut, 
  Edit3, 
  Save, 
  X, 
  Mail, 
  Building, 
  Calendar, 
  Clock,
  Database,
  Ruler,
  MessageSquare,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

interface UserProfileProps {
  user: any;
  onUserUpdate: (user: any) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onUserUpdate,
  onLogout,
  isOpen,
  onClose
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    institution: user?.institution || '',
    email: user?.email || ''
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'settings'>('profile');

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...editData,
      avatar: `${editData.firstName[0]}${editData.lastName[0]}`
    };
    
    onUserUpdate(updatedUser);
    localStorage.setItem('drugapp_current_user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      institution: user?.institution || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const mockStats = {
    proteinsViewed: 47,
    measurementsMade: 156,
    annotationsCreated: 23,
    collaborations: 8,
    timeSpent: '24h 32m'
  };

  const mockRecentActivity = [
    { id: 1, type: 'protein', action: 'Viewed', target: '8R9U - SARS-CoV-2 Spike', time: '2 hours ago' },
    { id: 2, type: 'measurement', action: 'Created', target: 'Distance measurement: 3.2Å', time: '4 hours ago' },
    { id: 3, type: 'annotation', action: 'Added', target: 'Binding site annotation', time: '1 day ago' },
    { id: 4, type: 'collaboration', action: 'Joined', target: 'COVID-19 Research Team', time: '2 days ago' },
    { id: 5, type: 'protein', action: 'Bookmarked', target: '1HTM - HIV-1 Protease', time: '3 days ago' }
  ];

  if (!isOpen || !user) return null;

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
          className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-slate-400">{user.email}</p>
                  {user.institution && (
                    <p className="text-sm text-slate-500">{user.institution}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title="Edit Profile"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mt-4 bg-slate-700/30 rounded-lg p-1">
              {[
                { key: 'profile', label: 'Profile', icon: User },
                { key: 'activity', label: 'Activity', icon: Clock },
                { key: 'settings', label: 'Settings', icon: Settings }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded text-sm transition-all ${
                    activeTab === key
                      ? 'bg-cyan-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={editData.firstName}
                            onChange={(e) => setEditData(prev => ({ ...prev, firstName: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={editData.lastName}
                            onChange={(e) => setEditData(prev => ({ ...prev, lastName: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Institution
                        </label>
                        <input
                          type="text"
                          value={editData.institution}
                          onChange={(e) => setEditData(prev => ({ ...prev, institution: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                          placeholder="University or Company"
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSave}
                          className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                          <User className="w-5 h-5 text-slate-400" />
                          <div>
                            <div className="text-sm text-slate-400">Full Name</div>
                            <div className="text-white">{user.firstName} {user.lastName}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                          <Mail className="w-5 h-5 text-slate-400" />
                          <div>
                            <div className="text-sm text-slate-400">Email</div>
                            <div className="text-white">{user.email}</div>
                          </div>
                        </div>
                        
                        {user.institution && (
                          <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                            <Building className="w-5 h-5 text-slate-400" />
                            <div>
                              <div className="text-sm text-slate-400">Institution</div>
                              <div className="text-white">{user.institution}</div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                          <Calendar className="w-5 h-5 text-slate-400" />
                          <div>
                            <div className="text-sm text-slate-400">Member Since</div>
                            <div className="text-white">{formatDate(user.joinDate)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Statistics */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Usage Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-600/30 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Database className="w-5 h-5 text-cyan-400" />
                        <span className="text-sm text-slate-400">Proteins Viewed</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{mockStats.proteinsViewed}</div>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-600/30 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Ruler className="w-5 h-5 text-orange-400" />
                        <span className="text-sm text-slate-400">Measurements</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{mockStats.measurementsMade}</div>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-br from-green-600/20 to-teal-600/20 border border-green-600/30 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageSquare className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-slate-400">Annotations</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{mockStats.annotationsCreated}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {mockRecentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'protein' ? 'bg-cyan-600/20 text-cyan-400' :
                          activity.type === 'measurement' ? 'bg-orange-600/20 text-orange-400' :
                          activity.type === 'annotation' ? 'bg-green-600/20 text-green-400' :
                          'bg-purple-600/20 text-purple-400'
                        }`}>
                          {activity.type === 'protein' && <Database className="w-4 h-4" />}
                          {activity.type === 'measurement' && <Ruler className="w-4 h-4" />}
                          {activity.type === 'annotation' && <MessageSquare className="w-4 h-4" />}
                          {activity.type === 'collaboration' && <User className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-sm">
                            <span className="font-medium">{activity.action}</span> {activity.target}
                          </div>
                          <div className="text-xs text-slate-400">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
                  
                  <div className="space-y-4">
                    {/* Data Export */}
                    <div className="p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">Export Data</h4>
                          <p className="text-sm text-slate-400">Download all your measurements and annotations</p>
                        </div>
                        <button className="flex items-center space-x-2 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                          <span>Export</span>
                        </button>
                      </div>
                    </div>

                    {/* Data Import */}
                    <div className="p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">Import Data</h4>
                          <p className="text-sm text-slate-400">Import measurements from other tools</p>
                        </div>
                        <button className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                          <Upload className="w-4 h-4" />
                          <span>Import</span>
                        </button>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="p-4 bg-slate-700/30 rounded-lg">
                      <h4 className="text-white font-medium mb-3">Privacy Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Make profile public</span>
                          <button className="w-12 h-6 bg-slate-600 rounded-full relative">
                            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Allow collaboration invites</span>
                          <button className="w-12 h-6 bg-cyan-600 rounded-full relative">
                            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="p-4 bg-red-600/20 border border-red-600/30 rounded-lg">
                      <h4 className="text-red-300 font-medium mb-3">Danger Zone</h4>
                      <div className="space-y-3">
                        <button className="flex items-center space-x-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                          <span>Delete All Data</span>
                        </button>
                        <button className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                          <X className="w-4 h-4" />
                          <span>Delete Account</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700 bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Last login: {formatDate(user.lastLogin)}
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserProfile;