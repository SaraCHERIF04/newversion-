
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { User } from '@/types/User';

interface MemberSearchProps {
  onSelect: (member: User) => void;
  selectedMembers: User[];
}

const MemberSearch: React.FC<MemberSearchProps> = ({ onSelect, selectedMembers }) => {
  const [searchMember, setSearchMember] = useState('');
  const [availableMembers, setAvailableMembers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = () => {
      try {
        const usersString = localStorage.getItem('users');
        if (usersString) {
          const users = JSON.parse(usersString);
          if (Array.isArray(users)) {
            const selectedMemberIds = new Set(selectedMembers.map(m => m.id));
            const availableUsers = users.filter(user => !selectedMemberIds.has(user.id));
            setAvailableMembers(availableUsers);
          }
        }
      } catch (error) {
        console.error('Error loading users:', error);
        setAvailableMembers([]);
      }
    };

    loadUsers();
  }, [selectedMembers]);

  const handleSelectMember = (member: User) => {
    onSelect(member);
  };

  const filteredMembers = availableMembers.filter(member =>
    member.name.toLowerCase().includes(searchMember.toLowerCase()) ||
    (member.prenom && member.prenom.toLowerCase().includes(searchMember.toLowerCase()))
  );

  return (
    <div className="w-full space-y-4">
      <div>
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher membres..."
            value={searchMember}
            onChange={(e) => setSearchMember(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Membre de projet
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.length > 0 ? (
              filteredMembers.map(member => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img 
                          src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                          alt="" 
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.name} {member.prenom}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      onClick={() => handleSelectMember(member)}
                      variant="ghost"
                      className="text-[#192759] hover:text-blue-700"
                    >
                      Ajouter
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucun membre disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedMembers.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Membres sélectionnés</h3>
          <div className="flex flex-wrap gap-2">
            {selectedMembers.map(member => (
              <div
                key={member.id}
                className="flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1"
              >
                <img
                  src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                  alt={member.name}
                  className="h-6 w-6 rounded-full mr-2"
                />
                <span className="text-sm">{member.name} {member.prenom}</span>
                <button
                  type="button"
                  onClick={() => onSelect(member)}
                  className="ml-2 text-blue-400 hover:text-blue-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberSearch;
