
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Pour le pie chart
const COLORS = ['#008080', '#1e40af', '#3b82f6', '#93c5fd'];

const EmployeeDashboardPage = () => {
  const [subProjects, setSubProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get the current user ID (would come from authentication in a real app)
        const userRole = localStorage.getItem('userRole');
        const userId = localStorage.getItem('userId') || '1'; // Fallback to '1' if not set
        
        // Fetch subprojects
        const subProjectsString = localStorage.getItem('subProjects');
        if (subProjectsString) {
          let allSubProjects = JSON.parse(subProjectsString);
          
          // Filter subprojects this employee is working on
          // In a real app, this would filter based on actual user assignments
          // Here we're just showing all subprojects for demo purposes
          setSubProjects(allSubProjects);
        }

        // Fetch projects
        const projectsString = localStorage.getItem('projects');
        if (projectsString) {
          let allProjects = JSON.parse(projectsString);
          setProjects(allProjects);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate subproject status counts for pie chart
  const getSubProjectStatusData = () => {
    const statusCounts = {
      'Terminé': 0,
      'En cours': 0,
      'En attente': 0,
      'Suspendu': 0
    };
    
    subProjects.forEach(subProject => {
      const status = subProject.status || 'En cours';
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      } else {
        statusCounts['En cours']++;
      }
    });
    
    return [
      { name: 'Terminé', value: statusCounts['Terminé'] || 0 },
      { name: 'En cours', value: statusCounts['En cours'] || 0 },
      { name: 'En attente', value: statusCounts['En attente'] || 0 },
      { name: 'Suspendu', value: statusCounts['Suspendu'] || 0 }
    ].filter(item => item.value > 0); // Only include statuses with values
  };
  
  // Generate progress data for line chart
  const getProgressData = () => {
    return [
      { month: 'Jan', progress: 30 },
      { month: 'Feb', progress: 45 },
      { month: 'Mar', progress: 55 },
      { month: 'Apr', progress: 70 },
      { month: 'May', progress: 85 },
      { month: 'Jun', progress: 88 }
    ];
  };

  // Calculer la progression par projet
  const getProjectsProgress = () => {
    if (!projects.length || !subProjects.length) return [];
    
    const projectProgress = {};
    
    // Initialiser tous les projets avec 0%
    projects.forEach(project => {
      projectProgress[project.id] = {
        id: project.id,
        name: project.name,
        totalSubProjects: 0,
        completedSubProjects: 0,
        progress: 0
      };
    });
    
    // Calculer le nombre de sous-projets par projet et le nombre de sous-projets terminés
    subProjects.forEach(subProject => {
      if (subProject.projectId && projectProgress[subProject.projectId]) {
        projectProgress[subProject.projectId].totalSubProjects++;
        
        if (subProject.status === 'Terminé') {
          projectProgress[subProject.projectId].completedSubProjects++;
        }
      }
    });
    
    // Calculer le pourcentage de progression
    Object.values(projectProgress).forEach(project => {
      if (project.totalSubProjects > 0) {
        project.progress = Math.round((project.completedSubProjects / project.totalSubProjects) * 100);
      }
    });
    
    return Object.values(projectProgress)
      .filter(project => project.totalSubProjects > 0)
      .sort((a, b) => b.progress - a.progress);
  };
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-gray-500 text-sm mb-1">Sous-projets</h3>
            <p className="text-xl font-semibold text-blue-600">{subProjects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-gray-500 text-sm mb-1">En cours</h3>
            <p className="text-xl font-semibold text-blue-600">
              {subProjects.filter(sp => sp.status === 'En cours').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-gray-500 text-sm mb-1">Terminés</h3>
            <p className="text-xl font-semibold text-green-600">
              {subProjects.filter(sp => sp.status === 'Terminé').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-gray-500 text-sm mb-1">En attente</h3>
            <p className="text-xl font-semibold text-yellow-600">
              {subProjects.filter(sp => sp.status === 'En attente').length}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Statut des sous-projets */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Statut des sous-projets</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 absolute top-4 right-4">Vue d'ensemble</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getSubProjectStatusData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {getSubProjectStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Progression au fil du temps */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Progression au fil du temps</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 absolute top-4 right-4">6 derniers mois</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getProgressData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="progress" stroke="#3b82f6" activeDot={{ r: 8 }} name="Progression (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* État d'avancement des projets */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">État d'avancement des projets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {getProjectsProgress().length > 0 ? (
              getProjectsProgress().map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-md font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-500">
                        {project.completedSubProjects} sur {project.totalSubProjects} sous-projets terminés
                      </p>
                    </div>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                Aucun projet trouvé ou aucun sous-projet associé.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Liste des sous-projets avec progression */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progression des sous-projets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {subProjects.length > 0 ? (
              subProjects.map((subProject) => {
                // Generate a random progress value between 0-100 for demonstration
                const progress = subProject.progress || Math.floor(Math.random() * 100);
                
                return (
                  <div key={subProject.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-md font-medium">{subProject.name}</h3>
                        <p className="text-sm text-gray-500 truncate">
                          {subProject.projectName ? `Projet: ${subProject.projectName}` : 'Projet non spécifié'}
                        </p>
                      </div>
                      <Badge 
                        className={`${
                          subProject.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                          subProject.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                          subProject.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {subProject.status || 'En cours'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Progression</span>
                        <span className="text-sm font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    {subProject.deadline && (
                      <div className="text-xs text-gray-500">
                        Échéance: {subProject.deadline}
                      </div>
                    )}
                    <div className="border-b border-gray-200 pt-2"></div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-gray-500">
                Aucun sous-projet trouvé.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboardPage;
