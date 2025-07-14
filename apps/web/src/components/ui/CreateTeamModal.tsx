import { useState } from 'react';
import { X, User } from 'lucide-react';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (teamData: any) => void;
}

const CreateTeamModal = ({ isOpen, onClose, onCreateTeam }: CreateTeamModalProps) => {
  const [teamName, setTeamName] = useState('');
  const [allowJoinWithoutApproval, setAllowJoinWithoutApproval] = useState(false);
  const [members, setMembers] = useState([
    { id: '1', name: 'Eldo Macuácua', avatar: 'E' }
  ]);

  const handleCreate = () => {
    if (!teamName.trim()) return;
    
    onCreateTeam({
      name: teamName,
      members,
      allowJoinWithoutApproval
    });
    
    setTeamName('');
    setAllowJoinWithoutApproval(false);
    onClose();
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Team</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info Note */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Required fields are marked with an asterisk *
          </p>

          {/* Team Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Name <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select team name...</option>
            </select>
          </div>

          {/* Add Team Members */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Add team members <span className="text-red-500">*</span>
            </label>
            
            {/* Current Members */}
            <div className="flex flex-wrap gap-2 mb-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {member.avatar}
                  </div>
                  <span className="text-sm font-medium">{member.name}</span>
                  <button
                    onClick={() => removeMember(member.id)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Member Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Type to add members..."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Membership Controls */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Membership controls
            </label>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowJoinWithoutApproval}
                onChange={(e) => setAllowJoinWithoutApproval(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Anyone can join this team without approval
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!teamName.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;