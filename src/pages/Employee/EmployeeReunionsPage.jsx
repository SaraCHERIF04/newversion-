
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye } from 'lucide-react';

const EmployeeReunionsPage = () => {
  const [reunions, setReunions] = useState([]);
  const [filteredReunions, setFilteredReunions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load meetings from localStorage
    const reunionsString = localStorage.getItem('meetings');
    if (reunionsString) {
      try {
        const parsedReunions = JSON.parse(reunionsString);
        // Sort by date (newest first)
        const sortedReunions = [...parsedReunions].sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          if (a.date && b.date) {
            return new Date(b.date) - new Date(a.date);
          }
          return 0;
        });
        setReunions(sortedReunions);
        setFilteredReunions(sortedReunions);
      } catch (error) {
        console.error('Error loading meetings:', error);
      }
    }
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredReunions(reunions);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = reunions.filter(reunion => 
        reunion.title.toLowerCase().includes(term) ||
        reunion.location.toLowerCase().includes(term) ||
        reunion.description.toLowerCase().includes(term)
      );
      setFilteredReunions(filtered);
    }
  }, [searchTerm, reunions]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    return timeString || '-';
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Réunions</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-80">
          <Input
            type="text"
            placeholder="Rechercher une réunion..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Heure</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReunions.length > 0 ? (
              filteredReunions.map((reunion) => (
                <TableRow key={reunion.id}>
                  <TableCell className="font-medium">{reunion.title}</TableCell>
                  <TableCell>{formatDate(reunion.date)}</TableCell>
                  <TableCell>{formatTime(reunion.time)}</TableCell>
                  <TableCell>{reunion.location}</TableCell>
                  <TableCell>
                    {reunion.participants ? 
                      <div className="flex -space-x-2">
                        {reunion.participants.slice(0, 3).map((participant, index) => (
                          <img 
                            key={`${participant.id}-${index}`}
                            src={participant.avatar || 'https://via.placeholder.com/40'} 
                            alt={participant.name} 
                            className="h-6 w-6 rounded-full border border-white"
                            title={participant.name}
                          />
                        ))}
                        {reunion.participants.length > 3 && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-gray-200 text-xs">
                            +{reunion.participants.length - 3}
                          </div>
                        )}
                      </div>
                    : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/employee/reunions/${reunion.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aucune réunion trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeReunionsPage;
