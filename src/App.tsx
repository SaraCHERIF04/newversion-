import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import ResponsableLayout from './components/Layout/ResponsableLayout';
import AdminLayout from './components/Layout/AdminLayout';
import EmployeeLayout from './components/Layout/EmployeeLayout';
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';

// Admin pages import
import AdminIndex from './pages/Admin/AdminIndex';
import AdminUsersPage from './pages/Admin/AdminUsersPage';
import AdminUserFormPage from './pages/Admin/AdminUserFormPage';
import AdminProjectsPage from './pages/Admin/AdminProjectsPage';
import AdminProjectFormPage from './pages/Admin/AdminProjectFormPage';
import AdminSubProjectsPage from './pages/Admin/AdminSubProjectsPage';
import AdminSubProjectFormPage from './pages/Admin/AdminSubProjectFormPage';
import AdminDocumentsPage from './pages/Admin/AdminDocumentsPage';
import AdminDocumentFormPage from './pages/Admin/AdminDocumentFormPage';
import AdminIncidentsPage from './pages/Admin/AdminIncidentsPage';
import AdminIncidentFormPage from './pages/Admin/AdminIncidentFormPage';
import AdminReunionsPage from './pages/Admin/AdminReunionsPage';
import AdminReunionFormPage from './pages/Admin/AdminReunionFormPage';
import AdminMarcheAndMaitreOuvragePage from './pages/Admin/AdminMarcheAndMaitreOuvragePage';
import AdminMarchePage from './pages/Admin/AdminMarchePage';
import AdminMarcheFormPage from './pages/Admin/AdminMarcheFormPage';
import AdminProfilePage from './pages/Admin/AdminProfilePage';
import AdminParametresPage from './pages/Admin/AdminParametresPage';

// Responsable pages import
import ResponsableIndex from './pages/Responsable/ResponsableIndex';
import ResponsableProjectsPage from './pages/Responsable/ResponsableProjectsPage';
import ResponsableProjectDetailsPage from './pages/Responsable/ResponsableProjectDetailsPage';
import ResponsableSubProjectsPage from './pages/Responsable/ResponsableSubProjectsPage';
import ResponsableSubProjectDetailsPage from './pages/Responsable/ResponsableSubProjectDetailsPage';
import ResponsableDocumentsPage from './pages/Responsable/ResponsableDocumentsPage';
import ResponsableDocumentDetailsPage from './pages/Responsable/ResponsableDocumentDetailsPage';
import ResponsableDocumentFormPage from './pages/Responsable/ResponsableDocumentFormPage';
import ResponsableIncidentsPage from './pages/Responsable/ResponsableIncidentsPage';
import ResponsableIncidentDetailsPage from './pages/Responsable/ResponsableIncidentDetailsPage';
import ResponsableReunionsPage from './pages/Responsable/ResponsableReunionsPage';
import ResponsableReunionDetailsPage from './pages/Responsable/ResponsableReunionDetailsPage';
import ResponsableMarcheAndMaitreOuvragePage from './pages/Responsable/ResponsableMarcheAndMaitreOuvragePage';
import ResponsableMarchePage from './pages/Responsable/ResponsableMarchePage';
import ResponsableMarcheDetailsPage from './pages/Responsable/ResponsableMarcheDetailsPage';
import ResponsableProfilePage from './pages/Responsable/ResponsableProfilePage';
import ResponsableParametresPage from './pages/Responsable/ResponsableParametresPage';
import ResponsableDashboardPage from './pages/Responsable/ResponsableDashboardPage';

// Employee pages import
import EmployeeIndex from './pages/Employee/EmployeeIndex';
import EmployeeProjectsPage from './pages/Employee/EmployeeProjectsPage';
import EmployeeSubProjectsPage from './pages/Employee/EmployeeSubProjectsPage';
import EmployeeProjectDetailsPage from './pages/Employee/EmployeeProjectDetailsPage';
import EmployeeSubProjectDetailsPage from './pages/Employee/EmployeeSubProjectDetailsPage';
import EmployeeDocumentsPage from './pages/Employee/EmployeeDocumentsPage';
import EmployeeDocumentDetailsPage from './pages/Employee/EmployeeDocumentDetailsPage';
import EmployeeDocumentFormPage from './pages/Employee/EmployeeDocumentFormPage';
import EmployeeIncidentsPage from './pages/Employee/EmployeeIncidentsPage';
import EmployeeIncidentDetailsPage from './pages/Employee/EmployeeIncidentDetailsPage';
import EmployeeReunionsPage from './pages/Employee/EmployeeReunionsPage';
import EmployeeReunionDetailsPage from './pages/Employee/EmployeeReunionDetailsPage';
import EmployeeMarcheAndMaitreOuvragePage from './pages/Employee/EmployeeMarcheAndMaitreOuvragePage';
import EmployeeMarchePage from './pages/Employee/EmployeeMarchePage';
import EmployeeMarcheDetailsPage from './pages/Employee/EmployeeMarcheDetailsPage';
import EmployeeProfilePage from './pages/Employee/EmployeeProfilePage';
import EmployeeParametresPage from './pages/Employee/EmployeeParametresPage';
import EmployeeProjectDashboardPage from './pages/Employee/EmployeeProjectDashboardPage';
import EmployeeSubProjectDashboardPage from './pages/Employee/EmployeeSubProjectDashboardPage';
import EmployeeDashboardPage from './pages/Employee/EmployeeDashboardPage';

// Document pages import
import DocumentsPage from './pages/DocumentsPage';
import DocumentDetailsPage from './pages/DocumentDetailsPage';
import DocumentFormPage from './pages/DocumentFormPage';

// Other pages import
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ProjectFormPage from './pages/ProjectFormPage';
import SubProjectsPage from './pages/SubProjectsPage';
import SubProjectDetailsPage from './pages/SubProjectDetailsPage';
import SubProjectFormPage from './pages/SubProjectFormPage';
import IncidentsPage from './pages/IncidentsPage';
import IncidentDetailsPage from './pages/IncidentDetailsPage';
import IncidentFormPage from './pages/IncidentFormPage';
import ReunionsPage from './pages/ReunionsPage';
import ReunionDetailsPage from './pages/ReunionDetailsPage';
import ReunionFormPage from './pages/ReunionFormPage';
import MarcheAndMaitreOuvragePage from './pages/MarcheAndMaitreOuvragePage';
import MarchePage from './pages/MarchePage';
import MarcheDetailsPage from './pages/MarcheDetailsPage';
import MarcheFormPage from './pages/MarcheFormPage';
import ProfilePage from './pages/ProfilePage';
import ParametresPage from './pages/ParametresPage';
import ProjectDashboardPage from './pages/ProjectDashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Index />} />
        <Route path="login" element={<LoginPage />} />
        
        {/* Admin routes */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminIndex />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="users/new" element={<AdminUserFormPage />} />
          <Route path="users/edit/:id" element={<AdminUserFormPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="projects/new" element={<AdminProjectFormPage />} />
          <Route path="projects/edit/:id" element={<AdminProjectFormPage />} />
          <Route path="sous-projets" element={<AdminSubProjectsPage />} />
          <Route path="sous-projets/new" element={<AdminSubProjectFormPage />} />
          <Route path="sous-projets/edit/:id" element={<AdminSubProjectFormPage />} />
          <Route path="documents" element={<AdminDocumentsPage />} />
          <Route path="documents/new" element={<AdminDocumentFormPage />} />
          <Route path="documents/edit/:id" element={<AdminDocumentFormPage />} />
          <Route path="incidents" element={<AdminIncidentsPage />} />
          <Route path="incidents/new" element={<AdminIncidentFormPage />} />
          <Route path="incidents/edit/:id" element={<AdminIncidentFormPage />} />
          <Route path="reunions" element={<AdminReunionsPage />} />
          <Route path="reunions/new" element={<AdminReunionFormPage />} />
          <Route path="reunions/edit/:id" element={<AdminReunionFormPage />} />
          <Route path="maitre-ouvrage" element={<AdminMarcheAndMaitreOuvragePage />} />
          <Route path="marche" element={<AdminMarchePage />} />
          <Route path="marche/new" element={<AdminMarcheFormPage />} />
          <Route path="marche/edit/:id" element={<AdminMarcheFormPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="parametres" element={<AdminParametresPage />} />
        </Route>
        
        {/* Responsable routes */}
        <Route path="responsable" element={<ResponsableLayout />}>
          <Route index element={<ResponsableIndex />} />
          <Route path="dashboard" element={<ResponsableDashboardPage />} />
          <Route path="projects" element={<ResponsableProjectsPage />} />
          <Route path="projects/:id" element={<ResponsableProjectDetailsPage />} />
          <Route path="sous-projets" element={<ResponsableSubProjectsPage />} />
          <Route path="sous-projets/:id" element={<ResponsableSubProjectDetailsPage />} />
          <Route path="documents" element={<ResponsableDocumentsPage />} />
          <Route path="documents/:id" element={<ResponsableDocumentDetailsPage />} />
          <Route path="documents/new" element={<ResponsableDocumentFormPage />} />
          <Route path="documents/edit/:id" element={<ResponsableDocumentFormPage />} />
          <Route path="incidents" element={<ResponsableIncidentsPage />} />
          <Route path="incidents/:id" element={<ResponsableIncidentDetailsPage />} />
          <Route path="reunions" element={<ResponsableReunionsPage />} />
          <Route path="reunions/:id" element={<ResponsableReunionDetailsPage />} />
          <Route path="maitre-ouvrage" element={<ResponsableMarcheAndMaitreOuvragePage />} />
          <Route path="marche" element={<ResponsableMarchePage />} />
          <Route path="marche/:id" element={<ResponsableMarcheDetailsPage />} />
          <Route path="profile" element={<ResponsableProfilePage />} />
          <Route path="parametres" element={<ResponsableParametresPage />} />
        </Route>
        
        {/* Employee routes */}
        <Route path="employee" element={<EmployeeLayout />}>
          <Route index element={<EmployeeIndex />} />
          <Route path="projects" element={<EmployeeProjectsPage />} />
          <Route path="projects/:id" element={<EmployeeProjectDetailsPage />} />
          <Route path="projects/dashboard/:id" element={<EmployeeProjectDashboardPage />} />
          <Route path="dashboard" element={<EmployeeDashboardPage />} />
          <Route path="sous-projets" element={<EmployeeSubProjectsPage />} />
          <Route path="sous-projets/:id" element={<EmployeeSubProjectDetailsPage />} />
          <Route path="sous-projets/dashboard/:id" element={<EmployeeSubProjectDashboardPage />} />
          <Route path="documents" element={<EmployeeDocumentsPage />} />
          <Route path="documents/:id" element={<EmployeeDocumentDetailsPage />} />
          <Route path="documents/new" element={<EmployeeDocumentFormPage />} />
          <Route path="documents/edit/:id" element={<EmployeeDocumentFormPage />} />
          <Route path="incidents" element={<EmployeeIncidentsPage />} />
          <Route path="incidents/:id" element={<EmployeeIncidentDetailsPage />} />
          <Route path="reunions" element={<EmployeeReunionsPage />} />
          <Route path="reunions/:id" element={<EmployeeReunionDetailsPage />} />
          <Route path="maitre-ouvrage" element={<EmployeeMarcheAndMaitreOuvragePage />} />
          <Route path="marche" element={<EmployeeMarchePage />} />
          <Route path="marche/:id" element={<EmployeeMarcheDetailsPage />} />
          <Route path="profile" element={<EmployeeProfilePage />} />
          <Route path="parametres" element={<EmployeeParametresPage />} />
        </Route>
        
        {/* Public routes */}
        <Route path="project" element={<ProjectsPage />} />
        <Route path="project/details/:id" element={<ProjectDetailsPage />} />
        <Route path="project/new" element={<ProjectFormPage />} />
        <Route path="project/edit/:id" element={<ProjectFormPage />} />
        <Route path="project/dashboard/:id" element={<ProjectDashboardPage />} />
        <Route path="sous-projet" element={<SubProjectsPage />} />
        <Route path="sous-projet/:id" element={<SubProjectDetailsPage />} />
        <Route path="sous-projet/new" element={<SubProjectFormPage />} />
        <Route path="sous-projet/edit/:id" element={<SubProjectFormPage />} />
        <Route path="document" element={<DocumentsPage />} />
        <Route path="document/:id" element={<DocumentDetailsPage />} />
        <Route path="document/new" element={<DocumentFormPage />} />
        <Route path="document/edit/:id" element={<DocumentFormPage />} />
        <Route path="incident" element={<IncidentsPage />} />
        <Route path="incident/:id" element={<IncidentDetailsPage />} />
        <Route path="incident/new" element={<IncidentFormPage />} />
        <Route path="incident/edit/:id" element={<IncidentFormPage />} />
        <Route path="reunion" element={<ReunionsPage />} />
        <Route path="reunion/:id" element={<ReunionDetailsPage />} />
        <Route path="reunion/new" element={<ReunionFormPage />} />
        <Route path="reunion/edit/:id" element={<ReunionFormPage />} />
        <Route path="maitre-ouvrage" element={<MarcheAndMaitreOuvragePage />} />
        <Route path="marche" element={<MarchePage />} />
        <Route path="marche/:id" element={<MarcheDetailsPage />} />
        <Route path="marche/new" element={<MarcheFormPage />} />
        <Route path="marche/edit/:id" element={<MarcheFormPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="parametres" element={<ParametresPage />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
