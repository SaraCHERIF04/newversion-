import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainLayout from '@/components/Layout/MainLayout';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailsPage from '@/pages/ProjectDetailsPage';
import NewProjectPage from '@/pages/NewProjectPage';
import SubProjectsPage from '@/pages/SubProjectsPage';
import SubProjectDetailsPage from '@/pages/SubProjectDetailsPage';
import NewSubProjectPage from '@/pages/NewSubProjectPage';
import IncidentsPage from '@/pages/IncidentsPage';
import IncidentDetailsPage from '@/pages/IncidentDetailsPage';
import NewIncidentPage from '@/pages/NewIncidentPage';
import LoginPage from '@/pages/LoginPage';
import ResponsableDashboardPage from '@/pages/Responsable/ResponsableDashboardPage';
import EmployeeProjectsPage from '@/pages/Employee/EmployeeProjectsPage';
import EmployeeProjectDetailsPage from '@/pages/Employee/EmployeeProjectDetailsPage';
import EmployeeProjectDashboardPage from '@/pages/Employee/EmployeeProjectDashboardPage';
import ProjectDashboardPage from './pages/ProjectDashboardPage';
import SubProjectDashboardPage from './pages/SubProjectDashboardPage';
import DashboardPage from './pages/DashboardPage';
import ChefDashboardPage from './pages/Dashboard/ChefDashboardPage';

function App() {
  return (
    <div className="min-h-screen">
      <RouterProvider 
        router={
          createBrowserRouter([
            {
              path: "/",
              element: <LoginPage />,
            },
            {
              path: "responsable",
              element: <MainLayout />,
              children: [
                {
                  path: "dashboard",
                  element: <ResponsableDashboardPage />,
                },
                {
                  path: "projects",
                  element: <ProjectsPage />,
                },
                 {
                  path: "projects/:id",
                  element: <ProjectDetailsPage />,
                },
                {
                  path: "incidents",
                  element: <IncidentsPage />,
                },
                {
                  path: "incidents/:id",
                  element: <IncidentDetailsPage />,
                },
              ]
            },
            {
              path: "project",
              element: <MainLayout />,
              children: [
                {
                  path: "",
                  element: <ProjectsPage />,
                },
                {
                  path: "new",
                  element: <NewProjectPage />,
                },
                {
                  path: ":id",
                  element: <ProjectDetailsPage />,
                },
                {
                  path: "details/:id",
                  element: <ProjectDetailsPage />,
                },
                {
                 path: "dashboard/:id",
                 element: <ProjectDashboardPage />,
                }
              ]
            },
            {
              path: "sous-projet",
              element: <MainLayout />,
              children: [
                {
                  path: "",
                  element: <SubProjectsPage />,
                },
                {
                  path: "new",
                  element: <NewSubProjectPage />,
                },
                {
                  path: ":id",
                  element: <SubProjectDetailsPage />,
                },
                 {
                  path: "details/:id",
                  element: <SubProjectDetailsPage />,
                },
                {
                 path: "dashboard/:id",
                 element: <SubProjectDashboardPage />,
                }
              ]
            },
            {
              path: "incident",
              element: <MainLayout />,
              children: [
                {
                  path: "",
                  element: <IncidentsPage />,
                },
                {
                  path: "new",
                  element: <NewIncidentPage />,
                },
                {
                  path: ":id",
                  element: <IncidentDetailsPage />,
                },
              ]
            },
            {
              path: "employee",
              element: <MainLayout />,
              children: [
                {
                  path: "projects",
                  element: <EmployeeProjectsPage />,
                },
                {
                  path: "projects/:id",
                  element: <EmployeeProjectDetailsPage />,
                },
                {
                 path: "projects/dashboard/:id",
                 element: <EmployeeProjectDashboardPage />,
                }
              ]
            },
            {
              path: "dashboard",
              element: <DashboardPage />
            },
            {
              path: "chef/dashboard",
              element: <ChefDashboardPage />
            },
          ])
        } 
      />
    </div>
  );
}

export default App;
