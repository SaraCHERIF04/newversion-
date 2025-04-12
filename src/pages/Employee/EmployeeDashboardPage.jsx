
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Progress } from '@/components/ui/progress';

// For the pie chart
const COLORS = ['#008080', '#1e40af', '#3b82f6', '#93c5fd'];

// For the line chart
const progressData = [
  { month: 'Oct 2021', Progress: 20 },
  { month: 'Nov 2021', Progress: 35 },
  { month: 'Dec 2021', Progress: 45 },
  { month: 'Jan 2022', Progress: 60 },
  { month: 'Feb 2022', Progress: 75 },
  { month: 'Mar 2022', Progress: 85 }
];

const EmployeeDashboardPage = () => {
  const [subProjects, setSubProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState([
    { name: 'Terminé', value: 0 },
    { name: 'En cours', value: 0 },
    { name: 'En attente', value: 0 }
  ]);

  useEffect(() => {
    setLoading(true);
    
    // Récupération des sous-projets
    const fetchSubProjects = () => {
      const storedSubProjects = localStorage.getItem('subProjects');
      if (storedSubProjects) {
        try {
          const subProjectsData = JSON.parse(storedSubProjects);
          setSubProjects(subProjectsData);
          
          // Calcul des statistiques par statut
          const statusCount = {
            'Terminé': 0,
            'En cours': 0,
            'En attente': 0
          };
          
          subProjectsData.forEach(subProject => {
            const status = subProject.status || 'En attente';
            statusCount[status] = (statusCount[status] || 0) + 1;
          });
          
          setStatusData([
            { name: 'Terminé', value: statusCount['Terminé'] || 0 },
            { name: 'En cours', value: statusCount['En cours'] || 0 },
            { name: 'En attente', value: statusCount['En attente'] || 0 }
          ]);
        } catch (error) {
          console.error('Erreur lors du chargement des sous-projets:', error);
        }
      }
    };
    
    // Récupération des projets
    const fetchProjects = () => {
      const storedProjects = localStorage.getItem('projects');
      if (storedProjects) {
        try {
          setProjects(JSON.parse(storedProjects));
        } catch (error) {
          console.error('Erreur lors du chargement des projets:', error);
        }
      }
    };
    
    fetchSubProjects();
    fetchProjects();
    setLoading(false);
  }, []);

  // Génération des données de progression pour chaque sous-projet
  const getSubProjectProgressData = () => {
    if (!subProjects || subProjects.length === 0) {
      return [];
    }

    return subProjects.map(subProject => {
      // Génération d'une valeur de progression aléatoire entre 0-100 pour la démonstration
      const progress = Math.floor(Math.random() * 100);
      return {
        id: subProject.id,
        name: subProject.name,
        progress: progress,
        status: subProject.status || 'En attente',
        projectId: subProject.projectId
      };
    });
  };

  // Trouver le nom du projet parent pour un sous-projet
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Projet inconnu';
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord des sous-projets</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Statut des sous-projets */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Statut des sous-projets</CardTitle>
            <Badge className="bg-blue-50 text-blue-700">Vue d'ensemble</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Évolution de la progression */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Évolution de la progression</CardTitle>
            <Badge className="bg-blue-50 text-blue-700">6 derniers mois</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Progress" stroke="#4D4DFF" activeDot={{ r: 8 }} name="Progression" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Progression des sous-projets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progression des sous-projets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {getSubProjectProgressData().map((subProject) => (
              <div key={subProject.id} className="space-y-2 border-b pb-4 last:border-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{subProject.name}</h3>
                    <p className="text-xs text-gray-500">Projet: {getProjectName(subProject.projectId)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    subProject.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                    subProject.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {subProject.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progression</span>
                    <span className="text-sm text-gray-500">{subProject.progress}%</span>
                  </div>
                  <Progress value={subProject.progress} className="h-2" />
                </div>
              </div>
            ))}
            {subProjects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun sous-projet trouvé
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-gray-500 text-sm mb-1">Total des sous-projets</h3>
            <p className="text-xl font-semibold text-blue-600">{subProjects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-gray-500 text-sm mb-1">Sous-projets terminés</h3>
            <p className="text-xl font-semibold text-green-600">
              {subProjects.filter(sp => sp.status === 'Terminé').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-gray-500 text-sm mb-1">Sous-projets en cours</h3>
            <p className="text-xl font-semibold text-blue-600">
              {subProjects.filter(sp => sp.status === 'En cours').length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboardPage;
