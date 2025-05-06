
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Receipt, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '@/services/dashboardService';
import { FinanceDashboard } from '@/interfaces/FinanceDashboard';
const FinancierDashboardPage = () => {
  const [stats, setStats] = useState<FinanceDashboard | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const response = await dashboardService.getDashboard('financier');

      setStats(response.data);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
       
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
           
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Projets en cours
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projetsEnCours}</div>
              <p className="text-xs text-muted-foreground">
                sdsd
              </p>
            </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default FinancierDashboardPage;
