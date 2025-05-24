
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// For the pie chart - colors from the image
const COLORS = ['#008080', '#1e40af', '#3b82f6', '#93c5fd'];

// For the line chart - example data, you can replace with your actual data
const projectData = [
  { month: 'Oct 2021', 'Projet A': 4, 'Projet B': 3 },
  { month: 'Nov 2021', 'Projet A': 3, 'Projet B': 2 },
  { month: 'Dec 2021', 'Projet A': 5, 'Projet B': 4 },
  { month: 'Jan 2022', 'Projet A': 7, 'Projet B': 6 },
  { month: 'Feb 2022', 'Projet A': 5, 'Projet B': 4 },
  { month: 'Mar 2022', 'Projet A': 8, 'Projet B': 5 }
];

interface Incident {
  id: string | number;
  type: string;
  projectName: string;
  date: string;
  location: string;
  status?: string;
}

const ResponsableDashboardPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  interface Project {
    id: string | number;
    name: string;
    status: string;
    // Add other fields as needed
  }

  interface SubProject {
    id: string | number;
    name: string;
    status: string;
    // Add other fields as needed
  }
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [subProjects, setSubProjects] = useState<SubProject[]>([]);
  const [budgetData, setBudgetData] = useState([
    { name: 'Completed', value: 32 },
    { name: 'On Hold', value: 25 },
    { name: 'On Progress', value: 25 },
    { name: 'Pending', value: 18 }
  ]);

  useEffect(() => {
    // Load incidents
    const storedIncidents = localStorage.getItem('incidents');
    if (storedIncidents) {
      try {
        setIncidents(JSON.parse(storedIncidents));
      } catch (error) {
        console.error("Error loading incidents:", error);
      }
    }

    // Load projects
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      try {
        setProjects(JSON.parse(storedProjects));
      } catch (error) {
        console.error("Error loading projects:", error);
      }
    }

    // Load subprojects
    const storedSubProjects = localStorage.getItem('subProjects');
    if (storedSubProjects) {
      try {
        setSubProjects(JSON.parse(storedSubProjects));
      } catch (error) {
        console.error("Error loading subprojects:", error);
      }
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tableaux de bord</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Budget Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Budget</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 absolute top-4 right-4">This Week</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
                  />
                  <Legend 
                    align="right" 
                    verticalAlign="middle" 
                    layout="vertical"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Project Progress Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">État d'avancement des projets</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 absolute top-4 right-4">This Week</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={projectData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Projet A" stroke="#FF6B6B" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Projet B" stroke="#6F75F9" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incidents and Other Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Incidents */}
        <Card className="col-span-3 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-blue-600">{incidents.length}</div>
              <div className="text-sm text-gray-500 mt-1">Total des incidents</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <div className="text-xl font-semibold text-yellow-600">
                  {incidents.filter(i => i.status === 'En cours').length}
                </div>
                <div className="text-xs text-gray-500">En cours</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-xl font-semibold text-green-600">
                  {incidents.filter(i => i.status === 'Résolu').length}
                </div>
                <div className="text-xs text-gray-500">Résolus</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="col-span-3 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Projets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-blue-600">{projects.length}</div>
              <div className="text-sm text-gray-500 mt-1">Total des projets</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-xl font-semibold text-blue-600">
                  {projects.filter(p => p.status === 'En cours').length}
                </div>
                <div className="text-xs text-gray-500">En cours</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-xl font-semibold text-green-600">
                  {projects.filter(p => p.status === 'Terminé').length}
                </div>
                <div className="text-xs text-gray-500">Terminés</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sous-projets */}
        <Card className="col-span-3 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Sous-projets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-blue-600">{subProjects.length}</div>
              <div className="text-sm text-gray-500 mt-1">Total des sous-projets</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-xl font-semibold text-blue-600">
                  {subProjects.filter(sp => sp.status === 'En cours').length}
                </div>
                <div className="text-xs text-gray-500">En cours</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-xl font-semibold text-green-600">
                  {subProjects.filter(sp => sp.status === 'Terminé').length}
                </div>
                <div className="text-xs text-gray-500">Terminés</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Incidents */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Incidents récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Projet</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Lieu</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {incidents.slice(0, 5).map((incident, index) => (
                  <tr 
                    key={incident.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${index !== incidents.length - 1 ? 'border-b' : ''}`}
                  >
                    <td className="p-2">{incident.type}</td>
                    <td className="p-2">{incident.projectName}</td>
                    <td className="p-2">{incident.date}</td>
                    <td className="p-2">{incident.location}</td>
                    <td className="p-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {incident.status || 'En cours'}
                      </span>
                    </td>
                  </tr>
                ))}
                {incidents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center">Aucun incident récent</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsableDashboardPage;
