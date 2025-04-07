
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import React from "react";

// Create a new query client instance inside the component
function App() {
  // Create the client inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
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
              <Route path="dashboard" element={<div>Dashboard Page</div>} />
              <Route path="incidents" element={<div>Incidents Page</div>} />
              <Route path="parametres" element={<div>Paramètres Page</div>} />
              <Route path="about" element={<div>About Us Page</div>} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
