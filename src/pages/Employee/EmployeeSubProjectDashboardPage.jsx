
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Progress } from '@/components/ui/progress';

const EmployeeSubProjectDashboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subProject, setSubProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch subproject
        const subProjectsString = localStorage.getItem('subProjects');
        if (subProjectsString) {
          const subProjects = JSON.parse(subProjectsString);
          const subProjectData = subProjects.find(sp => sp.id === id);
          if (subProjectData) {
            setSubProject(subProjectData);
            
            // Get parent project if needed
            const projectsString = localStorage.getItem('projects');
            if (projectsString && subProjectData.projectId) {
              const projects = JSON.parse(projectsString);
              const parentProject = projects.find(p => p.id === subProjectData.projectId);
              if (parentProject) {
                subProjectData.parentProjectName = parentProject.name;
                setSubProject({...subProjectData});
              }
            }
          }
        }
        
        // Mock tasks data for the subproject
        // In a real app, this would be fetched from localStorage or an API
        setTasks([
          { id: 1, name: 'Tâche 1', progress: 70, status: 'En cours' },
          { id: 2, name: 'Tâche 2', progress: 100, status: 'Terminé' },
          { id: 3, name: 'Tâche 3', progress: 30, status: 'En cours' },
          { id: 4, name: 'Tâche 4', progress: 0, status: 'En attente' }
        ]);
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
      { name: 'Dépensé', value: 35, fill: '#FF6B6B' },
      { name: 'Restant', value: 65, fill: '#4D4DFF' }
    ];
  };
  
  const getProgressData = () => {
    return [
      { name: 'Semaine 1', progress: 10 },
      { name: 'Semaine 2', progress: 25 },
      { name: 'Semaine 3', progress: 40 },
      { name: 'Semaine 4', progress: 55 },
      { name: 'Semaine 5', progress: 70 },
      { name: 'Semaine 6', progress: 85 }
    ];
  };
  
  const getResourcesData = () => {
    return [
      { name: 'Ressource 1', allocation: 40 },
      { name: 'Ressource 2', allocation: 30 },
      { name: 'Ressource 3', allocation: 20 },
      { name: 'Ressource 4', allocation: 10 }
    ];
  };
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Chargement...</div>;
  }
  
  if (!subProject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg text-gray-600 mb-4">Sous-projet non trouvé</p>
        <Button onClick={() => navigate('/employee/sous-projets')}>
          Retour aux sous-projets
        </Button>
      </div>
    );
  }
  
  // Calculate overall progress based on tasks
  const calculateOverallProgress = () => {
    if (tasks.length === 0) return 0;
    const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
    return Math.round(totalProgress / tasks.length);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/employee/sous-projets/${id}`)}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour au sous-projet</span>
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{subProject.name} - Tableau de bord</h1>
        <Badge 
          className={`${
            subProject.status === 'Terminé' ? 'bg-green-100 text-green-800' :
            subProject.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
            subProject.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}
        >
          {subProject.status || 'Non défini'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-4">Progression globale</h3>
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      {calculateOverallProgress()}%
                    </span>
                  </div>
                </div>
                <Progress value={calculateOverallProgress()} className="h-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Budget</h3>
              <p className="text-2xl font-bold text-blue-600">{subProject.budget || 'Non défini'}</p>
              <p className="text-sm text-gray-500">Budget alloué</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Échéance</h3>
              <p className="text-2xl font-bold text-blue-600">{subProject.deadline || 'Non définie'}</p>
              <p className="text-sm text-gray-500">Date limite</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Budget Allocation */}
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Allocation du budget</h3>
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
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Progress Timeline */}
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Évolution de la progression</h3>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getProgressData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="progress" stroke="#4D4DFF" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-medium">Progression des tâches</h3>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{task.name}</span>
                  <span className="text-sm text-gray-500">{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="h-2" />
                <div className="flex justify-end">
                  <Badge 
                    className={`${
                      task.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                      task.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                      task.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {task.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-medium">Allocation des ressources</h3>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {getResourcesData().map((resource, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{resource.name}</span>
                  <span className="text-sm text-gray-500">{resource.allocation}%</span>
                </div>
                <Progress value={resource.allocation} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeSubProjectDashboardPage;
