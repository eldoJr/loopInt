import { useState, useEffect } from 'react';
import { 
  Settings, 
  Briefcase, 
  Building, 
  MapPin, 
  Mail, 
  Plus, 
  ExternalLink,
  Bookmark,
  Camera
} from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CreateTeamModal from '../../components/ui/CreateTeamModal';

interface ProfileProps {
  onNavigateBack?: () => void;
}

interface User {
  id?: string;
  name?: string;
  email?: string;
}

interface TeamData {
  name: string;
  description?: string;
}

const Profile = ({ onNavigateBack }: ProfileProps) => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Profile' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <LoadingSpinner />
      </div>
    );
  }

  const handleCoverUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCoverImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAvatarUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSave = () => {
    console.log('Saving profile changes...');
  };

  const handleCancel = () => {
    setCoverImage(null);
    setAvatarImage(null);
    console.log('Changes cancelled');
  };

  const handleCreateTeam = (teamData: TeamData) => {
    console.log('Creating team:', teamData);
  };

  return (
    <div className={`space-y-6 transition-all duration-500 ${
      showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto">
        {/* Cover Photo */}
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-xl group overflow-hidden">
          {coverImage && (
            <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={handleCoverUpload}
              className="px-4 py-2 bg-white/90 text-gray-800 rounded-lg hover:bg-white transition-colors font-medium flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Upload cover photo</span>
            </button>
          </div>
        </div>
        
        {/* Profile Photo positioned outside cover */}
        <div className="relative -mt-12 ml-6">
          <div className="relative group inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-gray-50 shadow-lg overflow-hidden">
              {avatarImage ? (
                <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={handleAvatarUpload}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
        {/* Left Column - Profile Info (no background/borders) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Header */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {user?.name || user?.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {user?.email || 'email@example.com'}
            </p>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
              <Settings className="w-4 h-4" />
              <span>Manage Account</span>
            </button>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Briefcase className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Your job title"
                  className="flex-1 text-sm bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Your department"
                  className="flex-1 text-sm bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Your organization"
                  className="flex-1 text-sm bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Your location"
                  className="flex-1 text-sm bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white">{user?.email || 'email@example.com'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Phone number"
                  className="flex-1 text-sm bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <input 
                  type="text" 
                  placeholder="LinkedIn profile"
                  className="flex-1 text-sm bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Teams Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Teams</h3>
            <button 
              onClick={() => setShowCreateTeamModal(true)}
              className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Create a team</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Save changes
            </button>
            <button 
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>

          {/* Privacy Policy */}
          <div>
            <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-sm">
              <span>View privacy policy</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Column - Activity Cards */}
        <div className="lg:col-span-3 space-y-6">
          {/* Worked On Section */}
          <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Worked on</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    Others will only see what they can access.
                  </p>
                </div>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm font-medium">
                  View all
                </button>
              </div>
            </div>

            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="flex space-x-1">
                  <Bookmark className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No recent activity
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 max-w-md mx-auto">
                Your completed tasks, saved items, and project contributions will appear here as you work on them.
              </p>
              <button className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-sm font-medium">
                Show more
              </button>
            </div>
          </div>

          {/* Places You Work In Section */}
          <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Places you work in</h3>
            </div>

            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No workspaces yet
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
                Your workspaces and projects will appear here when you start collaborating.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      <CreateTeamModal
        isOpen={showCreateTeamModal}
        onClose={() => setShowCreateTeamModal(false)}
        onCreateTeam={handleCreateTeam}
      />
    </div>
  );
}

export default Profile;