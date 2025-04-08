
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/Layout/MainLayout";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectNewPage from "./pages/ProjectNewPage";
import ProjectEditPage from "./pages/ProjectEditPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import SubProjectsPage from "./pages/SubProjectsPage";
import SubProjectNewPage from "./pages/SubProjectNewPage";
import SubProjectEditPage from "./pages/SubProjectEditPage";
import SubProjectDetailsPage from "./pages/SubProjectDetailsPage";
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
import React, { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";

// Employee Pages Imports
import EmployeeLayout from "./components/Layout/EmployeeLayout";
import EmployeeIndex from "./pages/Employee/EmployeeIndex";
import EmployeeProjectsPage from "./pages/Employee/EmployeeProjectsPage";
import EmployeeProjectDetailsPage from "./pages/Employee/EmployeeProjectDetailsPage";
import EmployeeDocumentsPage from "./pages/Employee/EmployeeDocumentsPage";
import EmployeeDocumentFormPage from "./pages/Employee/EmployeeDocumentFormPage";
import EmployeeDocumentDetailsPage from "./pages/Employee/EmployeeDocumentDetailsPage";
import EmployeeProfilePage from "./pages/Employee/EmployeeProfilePage";
import EmployeeSubProjectsPage from "./pages/Employee/EmployeeSubProjectsPage";
import EmployeeMarcheAndMaitreOuvragePage from "./pages/Employee/EmployeeMarcheAndMaitreOuvragePage";
import EmployeeReunionsPage from "./pages/Employee/EmployeeReunionsPage";
import EmployeeReunionDetailsPage from "./pages/Employee/EmployeeReunionDetailsPage";

// Route protection components
const ProtectedRoute = ({ children, userRole, requiredRole }) => {
  if (userRole !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Create a new query client instance inside the component
function App() {
  // Create the client inside the component
  const queryClient = new QueryClient();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check user authentication status
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Admin/Chef Routes */}
            <Route path="/" element={
              userRole === 'chef' ? <MainLayout /> : <Navigate to="/login" replace />
            }>
              <Route index element={<Index />} />
              <Route path="project" element={<ProjectsPage />} />
              <Route path="project/new" element={<ProjectNewPage />} />
              <Route path="project/edit/:id" element={<ProjectEditPage />} />
              <Route path="project/:id" element={<ProjectDetailsPage />} />
              <Route path="sous-projet" element={<SubProjectsPage />} />
              <Route path="sous-projet/new" element={<SubProjectNewPage />} />
              <Route path="sous-projet/edit/:id" element={<SubProjectEditPage />} />
              <Route path="sous-projet/:id" element={<SubProjectDetailsPage />} />
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
              <Route path="dashboard" element={<div>Dashboard Page</div>} />
              <Route path="incidents" element={<div>Incidents Page</div>} />
              <Route path="parametres" element={<div>Paramètres Page</div>} />
              <Route path="about" element={<div>About Us Page</div>} />
            </Route>
            
            {/* Employee Routes */}
            <Route path="/employee" element={
              userRole === 'employee' ? <EmployeeLayout /> : <Navigate to="/login" replace />
            }>
              <Route index element={<EmployeeIndex />} />
              <Route path="projects" element={<EmployeeProjectsPage />} />
              <Route path="projects/:id" element={<EmployeeProjectDetailsPage />} />
              <Route path="sous-projets" element={<EmployeeSubProjectsPage />} />
              <Route path="documents" element={<EmployeeDocumentsPage />} />
              <Route path="documents/new" element={<EmployeeDocumentFormPage />} />
              <Route path="documents/:id" element={<EmployeeDocumentDetailsPage />} />
              <Route path="reunions" element={<EmployeeReunionsPage />} />
              <Route path="reunions/:id" element={<EmployeeReunionDetailsPage />} />
              <Route path="marche" element={<EmployeeMarcheAndMaitreOuvragePage />} />
              <Route path="maitre-ouvrage" element={<EmployeeMarcheAndMaitreOuvragePage />} />
              <Route path="profile" element={<EmployeeProfilePage />} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
