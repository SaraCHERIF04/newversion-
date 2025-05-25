
import React from 'react';

type Member = {
  id: string;
  name: string;
  role?: string;
  avatar: string;
};

type SubProjectMembersListProps = {
  members: Member[];
};

const SubProjectMembersList: React.FC<SubProjectMembersListProps> = ({ members }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6">
      {members.length > 0 ? (
        members.map(member => (
          <div key={member.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
            <img 
               src={ 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI='} 
              alt={member.name} 
              className="h-20 w-20 rounded-full mb-4 object-cover"
            /> 
            <h3 className="text-lg font-medium">{member.name}</h3>
            <p className="text-sm text-gray-500">{member.role || 'Membre'}</p>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-gray-500">
          Aucun membre sélectionné pour ce sous-projet
        </div>
      )}
    </div>
  );
};

export default SubProjectMembersList;
