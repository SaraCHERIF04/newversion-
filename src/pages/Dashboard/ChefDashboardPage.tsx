
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// For the pie chart
const BUDGET_DATA = [
  { name: 'Completed', value: 32, color: '#008080' },  // Teal
  { name: 'On Hold', value: 25, color: '#1E90FF' },    // Dodger Blue
  { name: 'On Progress', value: 25, color: '#6495ED' }, // Cornflower Blue  
  { name: 'Pending', value: 18, color: '#87CEEB' }     // Sky Blue
];

// For the line chart
const PROJECT_PROGRESS_DATA = [
  { name: 'Oct 2021', 'Projet A': 3, 'Projet B': 4 },
  { name: 'Nov 2021', 'Projet A': 2, 'Projet B': 3 },
  { name: 'Dec 2021', 'Projet A': 3, 'Projet B': 5 },
  { name: 'Jan 2022', 'Projet A': 6, 'Projet B': 4 },
  { name: 'Feb 2022', 'Projet A': 3, 'Projet B': 5 },
  { name: 'Mar 2022', 'Projet A': 6, 'Projet B': 3 }
];

const ChefDashboardPage: React.FC = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [subProjects, setSubProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Load incidents
        const storedIncidents = localStorage.getItem('incidents');
        if (storedIncidents) {
          setIncidents(JSON.parse(storedIncidents));
        }
        
        // Load projects
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
          setProjects(JSON.parse(storedProjects));
        }
        
        // Load subprojects
        const storedSubProjects = localStorage.getItem('subProjects');
        if (storedSubProjects) {
          setSubProjects(JSON.parse(storedSubProjects));
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tableaux de bord</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Budget Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Budget</CardTitle>
            <div className="flex justify-end">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                This Week
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={BUDGET_DATA}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {BUDGET_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, '']}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Progress Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">État d'avancement des projets</CardTitle>
            <div className="flex justify-end">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                This Week
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={PROJECT_PROGRESS_DATA}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="Projet A" stroke="#FF6B6B" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Projet B" stroke="#4D4DFF" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Incidents Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-md font-medium">Incidents</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="text-center py-8 px-4 bg-blue-100 rounded-lg w-full">
            <p className="text-xl font-semibold text-blue-600">
              {incidents.length} incident{incidents.length !== 1 ? 's' : ''}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-md font-medium">Statistiques des projets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500 mb-2">Total des projets</h3>
                <p className="text-xl font-semibold text-blue-700">{projects.length}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500 mb-2">Projets en cours</h3>
                <p className="text-xl font-semibold text-blue-700">
                  {projects.filter(p => p.status === 'En cours').length}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500 mb-2">Projets terminés</h3>
                <p className="text-xl font-semibold text-blue-700">
                  {projects.filter(p => p.status === 'Terminé').length}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500 mb-2">Projets en attente</h3>
                <p className="text-xl font-semibold text-blue-700">
                  {projects.filter(p => p.status === 'En attente').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-md font-medium">Statistiques des sous-projets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500 mb-2">Total des sous-projets</h3>
                <p className="text-xl font-semibold text-blue-700">{subProjects.length}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500 mb-2">Sous-projets en cours</h3>
                <p className="text-xl font-semibold text-blue-700">
                  {subProjects.filter(sp => sp.status === 'En cours').length}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500 mb-2">Sous-projets terminés</h3>
                <p className="text-xl font-semibold text-blue-700">
                  {subProjects.filter(sp => sp.status === 'Terminé').length}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500 mb-2">Sous-projets en attente</h3>
                <p className="text-xl font-semibold text-blue-700">
                  {subProjects.filter(sp => sp.status === 'En attente').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChefDashboardPage;
