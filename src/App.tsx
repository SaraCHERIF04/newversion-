
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

// Layouts
import MainLayout from './components/Layout/MainLayout';
import AdminLayout from './components/Layout/AdminLayout';
import EmployeeLayout from './components/Layout/EmployeeLayout';
import ResponsableLayout from './components/Layout/ResponsableLayout';

// Main Pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';

// Admin Pages
import AdminProfilePage from './pages/Admin/AdminProfilePage';
import AdminParametresPage from './pages/Admin/AdminParametresPage';
import AdminUsersPage from './pages/Admin/AdminUsersPage';
import AdminUserDetailsPage from './pages/Admin/AdminUserDetailsPage';
import AdminUserFormPage from './pages/Admin/AdminUserFormPage';
import AdminProfileDetailsPage from './pages/Admin/AdminProfileDetailsPage';

// Employee Pages
import EmployeeIndex from './pages/Employee/EmployeeIndex';
import EmployeeProfilePage from './pages/Employee/EmployeeProfilePage';
import EmployeeProjectsPage from './pages/Employee/EmployeeProjectsPage';
import EmployeeProjectDetailsPage from './pages/Employee/EmployeeProjectDetailsPage';
import EmployeeSubProjectsPage from './pages/Employee/EmployeeSubProjectsPage';
import EmployeeSubProjectDetailsPage from './pages/Employee/EmployeeSubProjectDetailsPage';
import EmployeeDocumentsPage from './pages/Employee/EmployeeDocumentsPage';
import EmployeeDocumentDetailsPage from './pages/Employee/EmployeeDocumentDetailsPage';
import EmployeeDocumentFormPage from './pages/Employee/EmployeeDocumentFormPage';
import EmployeeReunionsPage from './pages/Employee/EmployeeReunionsPage';
import EmployeeReunionDetailsPage from './pages/Employee/EmployeeReunionDetailsPage';
import EmployeeIncidentsPage from './pages/Employee/EmployeeIncidentsPage';
import EmployeeIncidentDetailsPage from './pages/Employee/EmployeeIncidentDetailsPage';
import EmployeeMarcheAndMaitreOuvragePage from './pages/Employee/EmployeeMarcheAndMaitreOuvragePage';
import EmployeeMarchePage from './pages/Employee/EmployeeMarchePage';
import EmployeMarcheDetailsPage from './pages/Employee/EmployeMarcheDetailsPage';
import EmployeeParametresPage from './pages/Employee/EmployeeParametresPage';
import EmployeeDashboardPage from './pages/Employee/EmployeeDashboardPage';
import EmployeeProjectDashboardPage from './pages/Employee/EmployeeProjectDashboardPage';
import EmployeeSubProjectDashboardPage from './pages/Employee/EmployeeSubProjectDashboardPage';
import EmployeeAboutPage from './pages/Employee/EmployeeAboutPage';

// Responsable Pages
import ResponsableDashboardPage from './pages/Responsable/ResponsableDashboardPage';
import ResponsableProfilePage from './pages/Responsable/ResponsableProfilePage';
import ResponsableParametresPage from './pages/Responsable/ResponsableParametresPage';
import ResponsableIncidentsPage from './pages/Responsable/ResponsableIncidentsPage';
import ResponsableIncidentDetailsPage from './pages/Responsable/ResponsableIncidentDetailsPage';
import ResponsableIncidentFollowUpsPage from './pages/Responsable/ResponsableIncidentFollowUpsPage';
import ResponsableIncidentFollowUpDetailsPage from './pages/Responsable/ResponsableIncidentFollowUpDetailsPage';

// Shared About Page
import AboutUsPage from './pages/AboutUsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/users" />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="profile/:id" element={<AdminProfileDetailsPage />} />
          <Route path="parametres" element={<AdminParametresPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="users/:id" element={<AdminUserDetailsPage />} />
          <Route path="users/new" element={<AdminUserFormPage />} />
          <Route path="users/edit/:id" element={<AdminUserFormPage />} />
          <Route path="about" element={<AboutUsPage userRole="admin" />} />
        </Route>
        
        {/* Employee Routes */}
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<EmployeeIndex />} />
          <Route path="dashboard" element={<EmployeeDashboardPage />} />
          <Route path="profile" element={<EmployeeProfilePage />} />
          <Route path="parametres" element={<EmployeeParametresPage />} />
          <Route path="projects" element={<EmployeeProjectsPage />} />
          <Route path="projects/:id" element={<EmployeeProjectDetailsPage />} />
          <Route path="projects/dashboard/:id" element={<EmployeeProjectDashboardPage />} />
          <Route path="sous-projets" element={<EmployeeSubProjectsPage />} />
          <Route path="sous-projets/:id" element={<EmployeeSubProjectDetailsPage />} />
          <Route path="sous-projets/dashboard/:id" element={<EmployeeSubProjectDashboardPage />} />
          <Route path="documents" element={<EmployeeDocumentsPage />} />
          <Route path="documents/:id" element={<EmployeeDocumentDetailsPage />} />
          <Route path="documents/new" element={<EmployeeDocumentFormPage />} />
          <Route path="documents/edit/:id" element={<EmployeeDocumentFormPage />} />
          <Route path="reunions" element={<EmployeeReunionsPage />} />
          <Route path="reunions/:id" element={<EmployeeReunionDetailsPage />} />
          <Route path="incidents" element={<EmployeeIncidentsPage />} />
          <Route path="incidents/:id" element={<EmployeeIncidentDetailsPage />} />
          <Route path="maitre-ouvrage" element={<EmployeeMarcheAndMaitreOuvragePage />} />
          <Route path="marche" element={<EmployeeMarchePage />} />
          <Route path="marche/:id" element={<EmployeMarcheDetailsPage />} />
          <Route path="about" element={<EmployeeAboutPage />} />
        </Route>
        
        {/* Responsable Routes */}
        <Route path="/responsable" element={<ResponsableLayout />}>
          <Route index element={<ResponsableDashboardPage />} />
          <Route path="profile" element={<ResponsableProfilePage />} />
          <Route path="parametres" element={<ResponsableParametresPage />} />
          <Route path="incidents" element={<ResponsableIncidentsPage />} />
          <Route path="incidents/:id" element={<ResponsableIncidentDetailsPage />} />
          <Route path="incidents/:incidentId/follow-ups" element={<ResponsableIncidentFollowUpsPage />} />
          <Route path="incidents/:incidentId/follow-ups/:id" element={<ResponsableIncidentFollowUpDetailsPage />} />
          <Route path="about" element={<AboutUsPage userRole="responsable" />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
