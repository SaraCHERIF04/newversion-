
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initializeServiceWorker, setupMessageListener } from "@/services/firebase";
import { remoteConfigService } from "@/services/remoteConfigService";
import MaintenanceMode from "@/components/MaintenanceMode";

// Layouts
import MainLayout from "./components/Layout/MainLayout";
import EmployeeLayout from "./components/Layout/EmployeeLayout";
import ResponsableLayout from "./components/Layout/ResponsableLayout";
import AdminLayout from "./components/Layout/AdminLayout";
import FinancierLayout from "./components/Layout/FinancierLayout";

// Public Pages
import LoginPage from "./pages/LoginPage";
import MakePassword from "./pages/MakePassword";
import NotFound from "./pages/NotFound";

// Chef Pages
import Index from "./pages/Index";
import ChefDashboardPage from "./pages/ChefDashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectNewPage from "./pages/ProjectNewPage";
import ProjectEditPage from "./pages/ProjectEditPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import ProjectDashboardPage from "./pages/ProjectDashboardPage";
import BudgetIntelligencePage from "./pages/BudgetIntelligencePage";
import SubProjectsPage from "./pages/SubProjectsPage";
import SubProjectNewPage from "./pages/SubProjectNewPage";
import SubProjectEditPage from "./pages/SubProjectEditPage";
import SubProjectDetailsPage from "./pages/SubProjectDetailsPage";
import SubProjectDashboardPage from "./pages/SubProjectDashboardPage";
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
import FacturesPage from "./pages/FacturesPage";
import FactureDetailsPage from "./pages/FactureDetailsPage";

// Employee Pages
import EmployeeDashboardPage from "./pages/Employee/EmployeeDashboardPage";
import EmployeeProjectsPage from "./pages/Employee/EmployeeProjectsPage";
import EmployeeProjectDetailsPage from "./pages/Employee/EmployeeProjectDetailsPage";
import EmployeeProjectDashboardPage from "./pages/Employee/EmployeeProjectDashboardPage";
import EmployeeSubProjectsPage from "./pages/Employee/EmployeeSubProjectsPage";
import EmployeeSubProjectDetailsPage from "./pages/Employee/EmployeeSubProjectDetailsPage";
import EmployeeSubProjectDashboardPage from "./pages/Employee/EmployeeSubProjectDashboardPage";
import EmployeeDocumentsPage from "./pages/Employee/EmployeeDocumentsPage";
import EmployeeDocumentFormPage from "./pages/Employee/EmployeeDocumentFormPage";
import EmployeeDocumentDetailsPage from "./pages/Employee/EmployeeDocumentDetailsPage";
import EmployeeReunionsPage from "./pages/Employee/EmployeeReunionsPage";
import EmployeeReunionDetailsPage from "./pages/Employee/EmployeeReunionDetailsPage";
import EmployeeIncidentsPage from "./pages/Employee/EmployeeIncidentsPage";
import EmployeeIncidentDetailsPage from "./pages/Employee/EmployeeIncidentDetailsPage";
import EmployeeMarchePage from "./pages/Employee/EmployeeMarchePage";
import EmployeMarcheDetailsPage from "./pages/Employee/EmployeMarcheDetailsPage";
import EmployeeProfilePage from "./pages/Employee/EmployeeProfilePage";
import EmployeeParametresPage from "./pages/Employee/EmployeeParametresPage";
import EmployeeAboutPage from "./pages/Employee/EmployeeAboutPage";
import EmployeeFacturesPage from "./pages/Employee/EmployeeFacturesPage";
// Removed import of EmployeeFactureDetailsPage → file did not exist

// Responsable Pages
import ResponsableDashboardPage from "./pages/Responsable/ResponsableDashboardPage";
import ResponsableIncidentsPage from "./pages/Responsable/ResponsableIncidentsPage";
import ResponsableIncidentDetailsPage from "./pages/Responsable/ResponsableIncidentDetailsPage";
import ResponsableIncidentFollowUpsPage from "./pages/Responsable/ResponsableIncidentFollowUpsPage";
import ResponsableIncidentFollowUpDetailsPage from "./pages/Responsable/ResponsableIncidentFollowUpDetailsPage";
import ResponsableProfilePage from "./pages/Responsable/ResponsableProfilePage";
import ResponsableParametresPage from "./pages/Responsable/ResponsableParametresPage";

// Admin Pages
import AdminUsersPage from "./pages/Admin/AdminUsersPage";
import AdminUserFormPage from "./pages/Admin/AdminUserFormPage";
import AdminUserDetailsPage from "./pages/Admin/AdminUserDetailsPage";
import AdminProfileDetailsPage from "./pages/Admin/AdminProfileDetailsPage";
import AdminProfilePage from "./pages/Admin/AdminProfilePage";
import AdminParametresPage from "./pages/Admin/AdminParametresPage";

// Financier Pages
import FinancierDashboardPage from "./pages/Financier/FinancierDashboardPage";
import FinancierFacturesPage from "./pages/Financier/FinancierFacturesPage";
import FinancierFactureFormPage from "./pages/Financier/FinancierFactureFormPage";
import FinancierProjectDetailsPage from "./pages/Financier/FinancierProjectDetailsPage";
import FinancierSubProjectDetailsPage from "./pages/Financier/FinancierSubProjectDetailsPage";
import FinancierFactureDetailsPage from "./pages/Financier/FinancierFactureDetailsPage";
import FinancierMarchePage from "./pages/Financier/FinancierMarchePage";
import FinancierReunionDetailsPage from "./pages/Financier/FinancierReunionDetailsPage";

// ProtectedRoute component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: string;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const userRole = localStorage.getItem("userRole");
  if (!userRole) return <Navigate to="/login" replace />;
  if (allowedRole && userRole !== allowedRole) {
    switch (userRole) {
      case "Chef de projet":
        return <Navigate to="/dashboard" replace />;
      case "employee":
        return <Navigate to="/employee/dashboard" replace />;
      case "responsable":
        return <Navigate to="/responsable/dashboard" replace />;
      case "admin":
        return <Navigate to="/admin/users" replace />;
      case "financier":
        return <Navigate to="/financier/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }
  return <>{children}</>;
};

function App() {
  const queryClient = new QueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await initializeServiceWorker();
        setupMessageListener();
        await remoteConfigService.initialize();
        setIsMaintenanceMode(
          remoteConfigService.isMaintenanceModeEnabled()
        );
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  if (isLoading)
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  if (isMaintenanceMode)
    return <MaintenanceMode onRetry={() => window.location.reload()} />;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/set-password/:token" element={<MakePassword />} />

            {/* Chef */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRole="Chef de projet">
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ChefDashboardPage />} />
              <Route path="project" element={<ProjectsPage />} />
              <Route path="project/new" element={<ProjectNewPage />} />
              <Route path="users/new" element={<AdminUserFormPage />} />
              <Route path="project/edit/:id" element={<ProjectEditPage />} />
              <Route
                path="project/:id"
                element={<ProjectDetailsPage />}
              />
              <Route
                path="project/dashboard/:id"
                element={<ProjectDashboardPage />}
              />
              <Route
                path="project/budget/:id"
                element={<BudgetIntelligencePage />}
              />
              <Route
                path="sous-projet"
                element={<SubProjectsPage />}
              /> 
              <Route
                path="sous-projet/new"
                element={<SubProjectNewPage />}
              />
              <Route
                path="sous-projet/dashboard"
                element={<SubProjectDashboardPage />}
              />
              <Route
                path="sous-projet/edit/:id"
                element={<SubProjectEditPage />}
              />
              <Route
                path="sous-projet/:id"
                element={<SubProjectDetailsPage />}
              />
              <Route
                path="sous-projet/dashboard/:id"
                element={<SubProjectDashboardPage />}
              />
              <Route
                path="sous-projet/budget/:id"
                element={<BudgetIntelligencePage />}
              />
              <Route path="documents" element={<DocumentsPage />} />
              <Route
                path="documents/new"
                element={<DocumentFormPage />}
              />
              <Route
                path="documents/edit/:id"
                element={<DocumentFormPage />}
              />
              <Route
                path="documents/:id"
                element={<DocumentDetailsPage />}
              />
              <Route path="reunion" element={<MeetingsPage />} />
              <Route
                path="reunion/new"
                element={<MeetingFormPage />}
              />
              <Route
                path="reunion/edit/:id"
                element={<MeetingFormPage />}
              />
              <Route
                path="reunion/:id"
                element={<MeetingDetailsPage />}
              />
              <Route
                path="maitre-ouvrage"
                element={<MaitreOuvragePage />}
              />
              <Route
                path="maitre-ouvrage/new"
                element={<MaitreOuvrageFormPage />}
              />
              <Route
                path="maitre-ouvrage/edit/:id"
                element={<MaitreOuvrageFormPage />}
              />
              <Route
                path="maitre-ouvrage/:id"
                element={<MaitreOuvrageDetailsPage />}
              />
              <Route path="marche" element={<MarchePage />} />
              <Route
                path="marche/new"
                element={<MarcheFormPage />}
              />
              <Route
                path="marche/edit/:id"
                element={<MarcheFormPage />}
              />
              <Route
                path="marche/:id"
                element={<MarcheDetailsPage />}
              />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="incidents" element={<IncidentsPage />} />
              <Route
                path="incidents/new"
                element={<IncidentFormPage />}
              />
              <Route
                path="incidents/edit/:id"
                element={<IncidentFormPage />}
              />
              <Route
                path="incidents/:id"
                element={<IncidentDetailsPage />}
              />
              <Route
                path="incidents/suivis/:id"
                element={<IncidentFollowUpsPage />}
              />
              <Route
                path="incidents/suivis/new/:incidentId"
                element={<IncidentFollowUpFormPage />}
              />
              <Route
                path="incidents/suivis/edit/:incidentId/:followUpId"
                element={<IncidentFollowUpFormPage />}
              />
              <Route
                path="incidents/suivis/:incidentId/:followUpId"
                element={<IncidentFollowUpDetailsPage />}
              />
              <Route path="factures" element={<FacturesPage />} />
              <Route
                path="factures/:id"
                element={<FactureDetailsPage />}
              />
              <Route
                path="parametres"
                element={<ParametresPage />}
              />
              <Route path="about" element={<Index />} />
            </Route>

            {/* Employee */}
            <Route
              path="/employee"
              element={
                <ProtectedRoute allowedRole="employee">
                  <EmployeeLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<EmployeeDashboardPage />} />
              <Route path="projects" element={<EmployeeProjectsPage />} />
              <Route
                path="projects/:id"
                element={<EmployeeProjectDetailsPage />}
              />
              <Route
                path="projects/dashboard/:id"
                element={<EmployeeProjectDashboardPage />}
              />
              <Route
                path="sous-projets"
                element={<EmployeeSubProjectsPage />}
              />
              <Route
                path="sous-projets/:id"
                element={<EmployeeSubProjectDetailsPage />}
              />
              <Route
                path="sous-projets/dashboard/:id"
                element={<EmployeeSubProjectDashboardPage />}
              />
              <Route
                path="documents"
                element={<EmployeeDocumentsPage />}
              />
              <Route
                path="documents/new"
                element={<EmployeeDocumentFormPage />}
              />
              <Route
                path="documents/:id"
                element={<EmployeeDocumentDetailsPage />}
              />
              <Route
                path="reunions"
                element={<EmployeeReunionsPage />}
              />
              <Route
                path="reunions/:id"
                element={<EmployeeReunionDetailsPage />}
              />
              <Route
                path="incidents"
                element={<EmployeeIncidentsPage />}
              />
              <Route
                path="incidents/:id"
                element={<EmployeeIncidentDetailsPage />}
              />
              <Route path="marche" element={<EmployeeMarchePage />} />
              <Route
                path="marche/:id"
                element={<EmployeMarcheDetailsPage />}
              />
              <Route
                path="profile"
                element={<EmployeeProfilePage />}
              />
              <Route
                path="parametres"
                element={<EmployeeParametresPage />}
              />
              <Route path="about" element={<EmployeeAboutPage />} />
              <Route
                path="factures"
                element={<EmployeeFacturesPage />}
              />
            </Route>

            {/* Responsable */}
            <Route
              path="/responsable"
              element={
                <ProtectedRoute allowedRole="responsable">
                  <ResponsableLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route
                path="dashboard"
                element={<ResponsableDashboardPage />}
              />
              <Route path="incidents" element={<ResponsableIncidentsPage />} />
              <Route
                path="incidents/:id"
                element={<ResponsableIncidentDetailsPage />}
              />
              <Route
                path="incidents/suivis/:id"
                element={<ResponsableIncidentFollowUpsPage />}
              />
              <Route
                path="incidents/suivis/:incidentId/:followUpId"
                element={<ResponsableIncidentFollowUpDetailsPage />}
              />
              <Route
                path="profile"
                element={<ResponsableProfilePage />}
              />
              <Route
                path="parametres"
                element={<ResponsableParametresPage />}
              />
            </Route>

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="users" replace />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="users/new" element={<AdminUserFormPage />} />
              <Route
                path="users/:id"
                element={<AdminUserDetailsPage />}
              />
              <Route
                path="profile"
                element={<AdminProfileDetailsPage />}
              />
              <Route path="profile/edit" element={<AdminProfilePage />} />
              <Route
                path="parametres"
                element={<AdminParametresPage />}
              />
            </Route>

            {/* Financier */}
            <Route
              path="/financier"
              element={
                <ProtectedRoute allowedRole="financier">
                  <FinancierLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route
                path="dashboard"
                element={<FinancierDashboardPage />}
              />
              <Route
                path="factures"
                element={<FinancierFacturesPage />}
              />
              <Route
                path="factures/new"
                element={<FinancierFactureFormPage />}
              />
              <Route
                path="projects/:id"
                element={<FinancierProjectDetailsPage />}
              />
              <Route
                path="sous-projets/:id"
                element={<FinancierSubProjectDetailsPage />}
              />
              <Route
                path="factures/:id"
                element={<FinancierFactureDetailsPage />}
              />
              <Route path="marche" element={<FinancierMarchePage />} />
              <Route
                path="reunions/:id"
                element={<FinancierReunionDetailsPage />}
              />
              <Route
                path="parametres"
                element={<EmployeeParametresPage />}
              />
              <Route
                path="about"
                element={<EmployeeAboutPage />}
              />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

