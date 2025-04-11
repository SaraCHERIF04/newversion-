
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Pour le graphique circulaire
const COLORS = ['#008080', '#1e40af', '#3b82f6', '#93c5fd'];

// Pour le graphique linéaire
const projectData = [
  { month: 'Oct 2021', projet1: 3, projet2: 4 },
  { month: 'Nov 2021', projet1: 4, projet2: 3 },
  { month: 'Dec 2021', projet1: 5, projet2: 2 },
  { month: 'Jan 2022', projet1: 6, projet2: 3 },
  { month: 'Feb 2022', projet1: 5, projet2: 5 },
  { month: 'Mar 2022', projet1: 7, projet2: 4 }
];

const budgetData = [
  { name: 'Completed', value: 32 },
  { name: 'On Hold', value: 25 },
  { name: 'On Progress', value: 25 },
  { name: 'Pending', value: 18 }
];

const ChefDashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [subProjects, setSubProjects] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    // Charger les projets
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      try {
        setProjects(JSON.parse(storedProjects));
      } catch (error) {
        console.error("Erreur lors du chargement des projets:", error);
      }
    }

    // Charger les sous-projets
    const storedSubProjects = localStorage.getItem('subProjects');
    if (storedSubProjects) {
      try {
        setSubProjects(JSON.parse(storedSubProjects));
      } catch (error) {
        console.error("Erreur lors du chargement des sous-projets:", error);
      }
    }

    // Charger les incidents
    const storedIncidents = localStorage.getItem('incidents');
    if (storedIncidents) {
      try {
        setIncidents(JSON.parse(storedIncidents));
      } catch (error) {
        console.error("Erreur lors du chargement des incidents:", error);
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
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
                  />
                  <Legend align="center" verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* État d'avancement des projets Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">État d'avancement des projets</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 absolute top-4 right-4">This Week</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[240px]">
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
                  <Line type="monotone" dataKey="projet1" stroke="#FF6B6B" activeDot={{ r: 8 }} name="Projet A" />
                  <Line type="monotone" dataKey="projet2" stroke="#4D4DFF" name="Projet B" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-gray-500 text-sm mb-1">Projets</h3>
            <p className="text-xl font-semibold text-blue-600">{projects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-gray-500 text-sm mb-1">Sous-projets</h3>
            <p className="text-xl font-semibold text-blue-600">{subProjects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-gray-500 text-sm mb-1">Incidents</h3>
            <p className="text-xl font-semibold text-blue-600">{incidents.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-gray-500 text-sm mb-1">Budget Total</h3>
            <p className="text-xl font-semibold text-blue-600">100M Da</p>
          </CardContent>
        </Card>
      </div>

      {/* Incidents récents */}
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
                    className={`hover:bg-gray-50 cursor-pointer ${index !== incidents.slice(0, 5).length - 1 ? 'border-b' : ''}`}
                  >
                    <td className="p-2">{incident.type || 'Général'}</td>
                    <td className="p-2">{incident.projectName || 'N/A'}</td>
                    <td className="p-2">{incident.createdAt || incident.date || 'N/A'}</td>
                    <td className="p-2">{incident.location || 'N/A'}</td>
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

export default ChefDashboardPage;
