
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExtendedProject } from '@/pages/ProjectDetailsPage';
import { SubProject } from '@/components/SubProjectCard';
import { ArrowLeft, BarChart } from 'lucide-react';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Incident = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  projectId?: string;
};

const ProjectDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ExtendedProject | null>(null);
  const [subProjects, setSubProjects] = useState<SubProject[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch project
        const projectsString = localStorage.getItem('projects');
        if (projectsString && id) {
          const projects = JSON.parse(projectsString);
          const projectData = projects.find((p: ExtendedProject) => p.id === id);
          if (projectData) {
            setProject(projectData);
          }
        }
        
        // Fetch subprojects
        const subProjectsString = localStorage.getItem('subProjects');
        if (subProjectsString && id) {
          const allSubProjects = JSON.parse(subProjectsString);
          const filteredSubProjects = allSubProjects.filter((sp: SubProject) => sp.projectId === id);
          setSubProjects(filteredSubProjects);
        }
        
        // Fetch incidents
        const incidentsString = localStorage.getItem('incidents');
        if (incidentsString && id) {
          const allIncidents = JSON.parse(incidentsString);
          const filteredIncidents = allIncidents.filter((incident: Incident) => incident.projectId === id);
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
      { name: 'Complété', value: 32, fill: '#008080' },
      { name: 'En attente', value: 25, fill: '#1E90FF' },
      { name: 'En cours', value: 25, fill: '#6495ED' },
      { name: 'En planification', value: 18, fill: '#87CEEB' },
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
        <button 
          onClick={() => navigate('/project')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Retour aux projets
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(`/project/details/${id}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Retour au projet</span>
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-8">Tableaux de bord</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Budget Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Budget</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">Cette semaine</Badge>
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
            <CardTitle className="text-lg">État d'avancement de projet</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">Cette semaine</Badge>
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
            <CardTitle className="text-lg">État d'avancement des sous projets</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">Cette semaine</Badge>
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
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-gray-500 text-sm">Temps réel du projet</h3>
                  <p className="text-lg font-semibold text-blue-600 text-center bg-blue-50 p-2 mt-2 rounded-md">12 mois</p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Temps supposé du projet</h3>
                  <p className="text-lg font-semibold text-blue-600 text-center bg-blue-50 p-2 mt-2 rounded-md">12 mois</p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">différence</h3>
                  <p className="text-lg font-semibold text-blue-600 text-center bg-blue-50 p-2 mt-2 rounded-md">0 mois</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-gray-500 text-sm">Budget réel du projet</h3>
                  <p className="text-lg font-semibold text-blue-600 text-center bg-blue-50 p-2 mt-2 rounded-md">
                    {project.budget || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Budget supposé du projet</h3>
                  <p className="text-lg font-semibold text-blue-600 text-center bg-blue-50 p-2 mt-2 rounded-md">
                    {project.budget || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">différence</h3>
                  <p className="text-lg font-semibold text-blue-600 text-center bg-blue-50 p-2 mt-2 rounded-md">0 Da</p>
                </div>
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

export default ProjectDashboardPage;
