import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";

// Chef Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/Layout/MainLayout";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectNewPage from "./pages/ProjectNewPage";
import ProjectEditPage from "./pages/ProjectEditPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import ProjectDashboardPage from "./pages/ProjectDashboardPage";
import SubProjectsPage from "./pages/SubProjectsPage";
import SubProjectNewPage from "./pages/SubProjectNewPage";
import SubProjectEditPage from "./pages/SubProjectEditPage";
import SubProjectDetailsPage from "./pages/SubProjectDetailsPage";
import SubProjectDashboardPage from "./pages/SubProjectDashboardPage";
import ChefDashboardPage from "./pages/ChefDashboardPage";
import DocumentsPage from "./pages/DocumentsPage";
import DocumentFormPage from "./pages/DocumentFormPage";
import DocumentDetailsPage from "./pages/DocumentDetailsPage";
import MeetingsPage from "./pages/MeetingsPage";
import MeetingFormPage from "./pages/MeetingFormPage";
import MeetingDetailsPage from "./pages/MeetingDetailsPage";
import MaitreOuvragePage from "./pages/MaitreOuvragePage";
import MaitreOuvrageFormPage from "./pages/MaitreOuvrageFormPage";
import MaitreOuvrageDetailsPage from "./pages/MaitreOuvrageDetailsPage";
import MarchePage from "./pages/MarchePage";
import MarcheFormPage from "./pages/MarcheFormPage";
import MarcheDetailsPage from "./pages/MarcheDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import IncidentsPage from "./pages/IncidentsPage";
import IncidentFormPage from "./pages/IncidentFormPage";
import IncidentDetailsPage from "./pages/IncidentDetailsPage";
import IncidentFollowUpsPage from "./pages/IncidentFollowUpsPage";
import IncidentFollowUpFormPage from "./pages/IncidentFollowUpFormPage";
import IncidentFollowUpDetailsPage from "./pages/IncidentFollowUpDetailsPage";
import ParametresPage from "./pages/ParametresPage";

// Employee Pages Imports
import EmployeeLayout from "./components/Layout/EmployeeLayout";
import EmployeeIndex from "./pages/Employee/EmployeeIndex";
import EmployeeDashboardPage from "./pages/Employee/EmployeeDashboardPage";
import EmployeeProjectsPage from "./pages/Employee/EmployeeProjectsPage";
import EmployeeProjectDetailsPage from "./pages/Employee/EmployeeProjectDetailsPage";
import EmployeeDocumentsPage from "./pages/Employee/EmployeeDocumentsPage";
import EmployeeDocumentFormPage from "./pages/Employee/EmployeeDocumentFormPage";
import EmployeeDocumentDetailsPage from "./pages/Employee/EmployeeDocumentDetailsPage";
import EmployeeProfilePage from "./pages/Employee/EmployeeProfilePage";
import EmployeeSubProjectsPage from "./pages/Employee/EmployeeSubProjectsPage";
import EmployeeSubProjectDetailsPage from "./pages/Employee/EmployeeSubProjectDetailsPage";
import EmployeeMarcheAndMaitreOuvragePage from "./pages/Employee/EmployeeMarcheAndMaitreOuvragePage";
import EmployeeReunionsPage from "./pages/Employee/EmployeeReunionsPage";
import EmployeeReunionDetailsPage from "./pages/Employee/EmployeeReunionDetailsPage";
import EmployeeIncidentsPage from "./pages/Employee/EmployeeIncidentsPage";
import EmployeeIncidentDetailsPage from "./pages/Employee/EmployeeIncidentDetailsPage";
import EmployeeMarchePage from "./pages/Employee/EmployeeMarchePage";
import EmployeMarcheDetailsPage from "./pages/Employee/EmployeMarcheDetailsPage";
import EmployeeProjectDashboardPage from "./pages/Employee/EmployeeProjectDashboardPage";
import EmployeeSubProjectDashboardPage from "./pages/Employee/EmployeeSubProjectDashboardPage";
import EmployeeParametresPage from "./pages/Employee/EmployeeParametresPage";
import EmployeeAboutPage from "./pages/Employee/EmployeeAboutPage";

// Responsable Pages Imports
import ResponsableLayout from "./components/Layout/ResponsableLayout";
import ResponsableDashboardPage from "./pages/Responsable/ResponsableDashboardPage";
import ResponsableIncidentsPage from "./pages/Responsable/ResponsableIncidentsPage";
import ResponsableIncidentDetailsPage from "./pages/Responsable/ResponsableIncidentDetailsPage";
import ResponsableIncidentFollowUpsPage from "./pages/Responsable/ResponsableIncidentFollowUpsPage";
import ResponsableIncidentFollowUpDetailsPage from "./pages/Responsable/ResponsableIncidentFollowUpDetailsPage";
import ResponsableProfilePage from "./pages/Responsable/ResponsableProfilePage";
import ResponsableParametresPage from "./pages/Responsable/ResponsableParametresPage";

// Admin Pages Imports
import AdminLayout from "./components/Layout/AdminLayout";
import AdminUsersPage from "./pages/Admin/AdminUsersPage";
import AdminProfilePage from "./pages/Admin/AdminProfilePage";
import AdminProfileDetailsPage from "./pages/Admin/AdminProfileDetailsPage";
import AdminUserFormPage from "./pages/Admin/AdminUserFormPage";
import AdminUserDetailsPage from "./pages/Admin/AdminUserDetailsPage";
import AdminParametresPage from "./pages/Admin/AdminParametresPage";

// Financier Pages Imports
import FinancierLayout from "./components/Layout/FinancierLayout";
import FinancierDashboardPage from "./pages/Financier/FinancierDashboardPage";
import FinancierFacturesPage from "./pages/Financier/FinancierFacturesPage";
import FinancierFactureFormPage from "./pages/Financier/FinancierFactureFormPage";
import FinancierMarchePage from "./pages/Financier/FinancierMarchePage";
import FinancierProjectDetailsPage from "./pages/Financier/FinancierProjectDetailsPage";
import FinancierSubProjectDetailsPage from "./pages/Financier/FinancierSubProjectDetailsPage";
import FinancierReunionDetailsPage from "./pages/Financier/FinancierReunionDetailsPage";
import FinancierFactureDetailsPage from "./pages/Financier/FinancierFactureDetailsPage";

// Add new imports
import EmployeeFacturesPage from "./pages/Employee/EmployeeFacturesPage";

// Route protection component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const userRole = localStorage.getItem('userRole');
  
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={
      userRole === 'chef' ? "/dashboard" : 
      userRole === 'employee' ? "/employee" :
      userRole === 'responsable' ? "/responsable/dashboard" :
      userRole === 'admin' ? "/admin/users" : "/login"
    } replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const queryClient = new QueryClient();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                {localStorage.getItem('userRole') === 'chef' ? 
                  <Navigate to="/dashboard" replace /> : 
                  localStorage.getItem('userRole') === 'employee' ?
                  <Navigate to="/employee/dashboard" replace /> :
                  localStorage.getItem('userRole') === 'responsable' ?
                  <Navigate to="/responsable/dashboard" replace /> :
                  <Navigate to="/admin/users" replace />}
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute allowedRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/users" replace />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="users/new" element={<AdminUserFormPage />} />
              <Route path="users/edit/:id" element={<AdminUserFormPage />} />
              <Route path="users/:id" element={<AdminUserDetailsPage />} />
              <Route path="profile" element={<AdminProfileDetailsPage />} />
              <Route path="profile/edit" element={<AdminProfilePage />} />
              <Route path="parametres" element={<AdminParametresPage />} />
              <Route path="about" element={<div>About Us Page</div>} />
            </Route>
            
            <Route path="/responsable" element={
              <ProtectedRoute allowedRole="responsable">
                <ResponsableLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/responsable/dashboard" replace />} />
              <Route path="dashboard" element={<ResponsableDashboardPage />} />
              <Route path="incidents" element={<ResponsableIncidentsPage />} />
              <Route path="incidents/:id" element={<ResponsableIncidentDetailsPage />} />
              <Route path="incidents/suivis/:id" element={<ResponsableIncidentFollowUpsPage />} />
              <Route path="incidents/suivis/:incidentId/:followUpId" element={<ResponsableIncidentFollowUpDetailsPage />} />
              <Route path="profile" element={<ResponsableProfilePage />} />
              <Route path="parametres" element={<ResponsableParametresPage />} />
              <Route path="about" element={<div>About Us Page</div>} />
            </Route>
            
            <Route path="/" element={
              <ProtectedRoute allowedRole="chef">
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<ChefDashboardPage />} />
              <Route path="project" element={<ProjectsPage />} />
              <Route path="project/new" element={<ProjectNewPage />} />
              <Route path="project/edit/:id" element={<ProjectEditPage />} />
              <Route path="project/:id" element={<ProjectDetailsPage />} />
              <Route path="project/dashboard/:id" element={<ProjectDashboardPage />} />
              <Route path="sous-projet" element={<SubProjectsPage />} />
              <Route path="sous-projet/new" element={<SubProjectNewPage />} />
              <Route path="sous-projet/edit/:id" element={<SubProjectEditPage />} />
              <Route path="sous-projet/:id" element={<SubProjectDetailsPage />} />
              <Route path="sous-projet/dashboard/:id" element={<SubProjectDashboardPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="documents/new" element={<DocumentFormPage />} />
              <Route path="documents/edit/:id" element={<DocumentFormPage />} />
              <Route path="documents/:id" element={<DocumentDetailsPage />} />
              <Route path="reunion" element={<MeetingsPage />} />
              <Route path="reunion/new" element={<MeetingFormPage />} />
              <Route path="reunion/edit/:id" element={<MeetingFormPage />} />
              <Route path="reunion/:id" element={<MeetingDetailsPage />} />
              <Route path="maitre-ouvrage" element={<MaitreOuvragePage />} />
              <Route path="maitre-ouvrage/new" element={<MaitreOuvrageFormPage />} />
              <Route path="maitre-ouvrage/edit/:id" element={<MaitreOuvrageFormPage />} />
              <Route path="maitre-ouvrage/:id" element={<MaitreOuvrageDetailsPage />} />
              <Route path="marche" element={<MarchePage />} />
              <Route path="marche/new" element={<MarcheFormPage />} />
              <Route path="marche/edit/:id" element={<MarcheFormPage />} />
              <Route path="marche/:id" element={<MarcheDetailsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              
              <Route path="incidents" element={<IncidentsPage />} />
              <Route path="incidents/new" element={<IncidentFormPage />} />
              <Route path="incidents/edit/:id" element={<IncidentFormPage />} />
              <Route path="incidents/:id" element={<IncidentDetailsPage />} />
              <Route path="incidents/suivis/:id" element={<IncidentFollowUpsPage />} />
              <Route path="incidents/suivis/new/:incidentId" element={<IncidentFollowUpFormPage />} />
              <Route path="incidents/suivis/edit/:incidentId/:followUpId" element={<IncidentFollowUpFormPage />} />
              <Route path="incidents/suivis/:incidentId/:followUpId" element={<IncidentFollowUpDetailsPage />} />
              
              <Route path="parametres" element={<ParametresPage />} />
              <Route path="about" element={<div>About Us Page</div>} />
            </Route>
            
            <Route path="/employee" element={
              <ProtectedRoute allowedRole="employee">
                <EmployeeLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/employee/dashboard" replace />} />
              <Route path="dashboard" element={<EmployeeDashboardPage />} />
              <Route path="projects" element={<EmployeeProjectsPage />} />
              <Route path="projects/:id" element={<EmployeeProjectDetailsPage />} />
              <Route path="projects/dashboard/:id" element={<EmployeeProjectDashboardPage />} />
              <Route path="sous-projets" element={<EmployeeSubProjectsPage />} />
              <Route path="sous-projets/:id" element={<EmployeeSubProjectDetailsPage />} />
              <Route path="sous-projets/dashboard/:id" element={<EmployeeSubProjectDashboardPage />} />
              <Route path="documents" element={<EmployeeDocumentsPage />} />
              <Route path="documents/new" element={<EmployeeDocumentFormPage />} />
              <Route path="documents/:id" element={<EmployeeDocumentDetailsPage />} />
              <Route path="reunions" element={<EmployeeReunionsPage />} />
              <Route path="reunions/:id" element={<EmployeeReunionDetailsPage />} />
              <Route path="incidents" element={<EmployeeIncidentsPage />} />
              <Route path="incidents/:id" element={<EmployeeIncidentDetailsPage />} />
              <Route path="marche" element={<EmployeeMarchePage />} />
              <Route path="marche/:id" element={<EmployeMarcheDetailsPage />} />
              <Route path="maitre-ouvrage" element={<EmployeeMarcheAndMaitreOuvragePage />} />
              <Route path="factures" element={<EmployeeFacturesPage />} />
              <Route path="factures/:id" element={<FinancierFactureDetailsPage />} />
              <Route path="profile" element={<EmployeeProfilePage />} />
              <Route path="parametres" element={<EmployeeParametresPage />} />
              <Route path="about" element={<EmployeeAboutPage />} />
            </Route>
            
            <Route path="/financier" element={
              <ProtectedRoute allowedRole="financier">
                <FinancierLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/financier/dashboard" replace />} />
              <Route path="dashboard" element={<FinancierDashboardPage />} />
              <Route path="projects" element={<EmployeeProjectsPage />} />
              <Route path="projects/:id" element={<FinancierProjectDetailsPage />} />
              <Route path="sous-projets" element={<EmployeeSubProjectsPage />} />
              <Route path="sous-projets/:id" element={<FinancierSubProjectDetailsPage />} />
              <Route path="documents" element={<EmployeeDocumentsPage />} />
              <Route path="factures" element={<FinancierFacturesPage />} />
              <Route path="factures/new" element={<FinancierFactureFormPage />} />
              <Route path="factures/edit/:id" element={<FinancierFactureFormPage />} />
              <Route path="factures/:id" element={<FinancierFactureDetailsPage />} />
              <Route path="marche" element={<FinancierMarchePage />} />
              <Route path="marche/:id" element={<MarcheDetailsPage />} />
              <Route path="reunions" element={<EmployeeReunionsPage />} />
              <Route path="reunions/:id" element={<FinancierReunionDetailsPage />} />
              <Route path="parametres" element={<EmployeeParametresPage />} />
              <Route path="about" element={<EmployeeAboutPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
