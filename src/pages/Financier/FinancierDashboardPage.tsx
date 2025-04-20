
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Receipt, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinancierDashboardPage = () => {
  const navigate = useNavigate();
  
  const stats = [
    {
      title: "Total Marchés",
      value: "12",
      icon: Building2,
      description: "Marchés actifs",
      route: "/financier/marche"
    },
    {
      title: "Factures",
      value: "32",
      icon: Receipt,
      description: "Factures en attente",
      route: "/financier/factures"
    },
    {
      title: "Documents",
      value: "45",
      icon: FileText,
      description: "Documents totaux",
      route: "/financier/documents"
    },
    {
      title: "Projets",
      value: "8",
      icon: Users,
      description: "Projets en cours",
      route: "/financier/projects"
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(stat.route)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FinancierDashboardPage;
