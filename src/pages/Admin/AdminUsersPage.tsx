import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search, UserCog, UserPlus, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearchQuery } from '@/components/Layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { User } from '@/types/User';
import { userService } from '@/services/userService';
import { UserInterface } from '@/interfaces/UserInterface';

interface PaginatedData {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserInterface[];
}

const AdminUsersPage: React.FC = () => {
  const { searchQuery } = useSearchQuery();
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  
  // Effect for handling global search query from context
  useEffect(() => {
    if (searchQuery) {
      setLocalSearchQuery(searchQuery);
    }
  }, [searchQuery]);
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(localSearchQuery);
    }, 400); // 400ms delay before processing the search

    return () => clearTimeout(timer);
  }, [localSearchQuery]);
  
  // Main data fetching effect - now uses debounced query
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const query = debouncedSearchQuery.trim();
        
        if (query) {
          // If searching, use the search service
          setIsSearching(true);
          const searchResults = await userService.searchUsers(query);
          setUsers(searchResults.data.results);
          setFilteredUsers(searchResults.data.results);
          setTotalCount(searchResults.data.count);
          setTotalPages(1); // For search results, we typically show all on one page
        } else {
          // If not searching, get paginated users
          setIsSearching(false);
          const response = await userService.getAllUsers(currentPage);
          // console.log(response);
          if (response.success && response.data) {
            setUsers(response.data.results);
            setFilteredUsers(response.data.results);
            setTotalCount(response.data.count);
            setTotalPages(Math.ceil(response.data.count / itemsPerPage));
          } else {
            throw new Error('Failed to fetch users');
          }
        }
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, debouncedSearchQuery]); // Using debouncedSearchQuery instead of localSearchQuery
  
  const handleLocalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    // We'll reset page in the data fetching effect instead
  };
  
  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);
  
  // Focus preservation using a better approach
  const [wasFocused, setWasFocused] = useState(false);
  
  // Track when the input gets and loses focus
  const handleInputFocus = () => {
    setWasFocused(true);
  };
  
  const handleInputBlur = () => {
    // Short delay to check if we should really mark as unfocused
    // This helps with the case where the input loses focus due to re-render
    setTimeout(() => {
      if (document.activeElement !== searchInputRef.current) {
        setWasFocused(false);
      }
    }, 100);
  };
  
  // Restore focus when data changes if it was previously focused
  useEffect(() => {
    if (wasFocused && searchInputRef.current && document.activeElement !== searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [filteredUsers, wasFocused]);
  
  // Function to get a color class based on the role
  const getRoleColorClass = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'chef': return 'bg-blue-100 text-blue-800';
      case 'employee': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get availability color
  const getStatusColorClass = (status: string) => {
    if (status === 'En poste' || status === 'Disponible') return 'bg-green-100 text-green-800';
    if (status === 'En congé') return 'bg-yellow-100 text-yellow-800';
    if (status === 'Maladie') return 'bg-red-100 text-red-800';
    if (status === 'Mission' || status === 'Formation') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/admin')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">Listes des utilisateurs</h2>
          </div>
          <Button 
            onClick={() => navigate('/admin/users/new')}
            className="ml-auto"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter compte
          </Button>
        </div>
        
        <CardContent className="p-6">
          <div className="mb-6 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                ref={searchInputRef}
                placeholder="Rechercher un utilisateur..."
                className="pl-10"
                value={localSearchQuery}
                onChange={handleLocalSearch}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map(user => (
              <Link 
                key={user.id_utilisateur} 
                to={`/admin/users/${user.id_utilisateur}`}
                className="block"
              >
                <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="p-6 flex flex-col items-center">
                    <div className="h-20 w-20 rounded-full overflow-hidden mb-4">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.nom + (user.prenom ? ' ' + user.prenom : ''))}&background=random`} 
                        alt={user.nom} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg text-center">
                      {user.nom} {user.prenom}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 text-center">{user.email}</p>
                    
                    <div className="flex flex-wrap justify-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${getRoleColorClass(user.role_de_utilisateur)}`}>
                        {user.role_de_utilisateur === 'chef' ? 'Chef de projet' : 
                         user.role_de_utilisateur === 'admin' ? 'Administrateur' : 'Employé'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UserCog className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun utilisateur trouvé</h3>
              <p className="mt-2 text-sm text-gray-500">
                Essayez avec une autre recherche ou ajoutez un nouveau compte.
              </p>
              <Button 
                onClick={() => navigate('/admin/users/new')} 
                className="mt-6"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Ajouter un compte
              </Button>
            </div>
          )}
          
          {/* Pagination - only show when not searching and there are results */}
          {filteredUsers.length > 0 && !isSearching && totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
                // Show at most 5 page buttons centered around current page
                let pageNumber: number;
                if (totalPages <= 5) {
                  pageNumber = idx + 1;
                } else if (currentPage <= 3) {
                  pageNumber = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + idx;
                } else {
                  pageNumber = currentPage - 2 + idx;
                }
                
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className="w-10 h-10"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-gray-500 ml-4">
                Page {currentPage} sur {totalPages} ({totalCount} utilisateurs)
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
