
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EmployeeProjectDashboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [subProjects, setSubProjects] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch project
        const projectsString = localStorage.getItem('projects');
        if (projectsString) {
          const projects = JSON.parse(projectsString);
          const projectData = projects.find(p => p.id === id);
          if (projectData) {
            setProject(projectData);
          }
        }
        
        // Fetch subprojects
        const subProjectsString = localStorage.getItem('subProjects');
        if (subProjectsString) {
          const allSubProjects = JSON.parse(subProjectsString);
          const filteredSubProjects = allSubProjects.filter(sp => sp.projectId === id);
          setSubProjects(filteredSubProjects);
        }
        
        // Fetch incidents
        const incidentsString = localStorage.getItem('incidents');
        if (incidentsString) {
          const allIncidents = JSON.parse(incidentsString);
          const filteredIncidents = allIncidents.filter(incident => incident.projectId === id);
          setIncidents(filteredIncidents);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const getBudgetData = () => {
    return [
      { name: 'Completed', value: 32, fill: '#008080' },
      { name: 'On Hold', value: 25, fill: '#1E90FF' },
      { name: 'On Progress', value: 25, fill: '#6495ED' },
      { name: 'Pending', value: 18, fill: '#87CEEB' },
    ];
  };
  
  const getProjectProgressData = () => {
    return [
      { name: 'Oct 2021', projet: 4, budget: 8 },
      { name: 'Nov 2021', projet: 3, budget: 6 },
      { name: 'Dec 2021', projet: 5, budget: 4 },
      { name: 'Jan 2022', projet: 7, budget: 8 },
      { name: 'Feb 2022', projet: 6, budget: 9 },
      { name: 'Mar 2022', projet: 5, budget: 7 },
    ];
  };
  
  const getSubProjectsProgressData = () => {
    return [
      { name: 'Oct 2021', 'Projet A': 5, 'Projet B': 3 },
      { name: 'Nov 2021', 'Projet A': 4, 'Projet B': 2 },
      { name: 'Dec 2021', 'Projet A': 6, 'Projet B': 4 },
      { name: 'Jan 2022', 'Projet A': 8, 'Projet B': 6 },
      { name: 'Feb 2022', 'Projet A': 7, 'Projet B': 5 },
      { name: 'Mar 2022', 'Projet A': 9, 'Projet B': 7 },
    ];
  };
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Chargement...</div>;
  }
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg text-gray-600 mb-4">Projet non trouvé</p>
        <Button onClick={() => navigate('/employee/projects')}>
          Retour aux projets
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/employee/projects/${id}`)}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour au projet</span>
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Tableaux de bord</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Budget Chart */}
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Budget</h3>
            <Badge className="bg-blue-50 text-blue-700">This Week</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getBudgetData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Project Progress */}
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">État d'avancement de projet</h3>
            <Badge className="bg-blue-50 text-blue-700">This Week</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getProjectProgressData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="projet" stroke="#FF6B6B" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="budget" stroke="#4D4DFF" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Subprojects Progress */}
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">État d'avancement des sous projets</h3>
            <Badge className="bg-blue-50 text-blue-700">This Week</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getSubProjectsProgressData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Projet A" stroke="#FF6B6B" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Projet B" stroke="#4D4DFF" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Project Stats */}
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row justify-between">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-gray-500 text-sm">Temps réel du projet</h3>
                <p className="text-lg font-semibold text-blue-600">12 mois</p>
              </div>
              <div className="mb-4 sm:mb-0">
                <h3 className="text-gray-500 text-sm">Temps supposé du projet</h3>
                <p className="text-lg font-semibold text-blue-600">12 mois</p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">différence</h3>
                <p className="text-lg font-semibold text-blue-600">0 mois</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row justify-between">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-gray-500 text-sm">Budget réel du projet</h3>
                <p className="text-lg font-semibold text-blue-600">{project.budget || "N/A"}</p>
              </div>
              <div className="mb-4 sm:mb-0">
                <h3 className="text-gray-500 text-sm">Budget supposé du projet</h3>
                <p className="text-lg font-semibold text-blue-600">{project.budget || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">différence</h3>
                <p className="text-lg font-semibold text-blue-600">0 Da</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="text-gray-500 text-sm mb-2">Incidents</h3>
              <p className="text-xl font-semibold text-center text-blue-600 bg-blue-50 p-3 rounded-md">
                {incidents.length} incident{incidents.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProjectDashboardPage;
