
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
              <Route path="sous-projet" element={<div>Sous Projet Page</div>} />
              <Route path="dashboard" element={<div>Dashboard Page</div>} />
              <Route path="incidents" element={<div>Incidents Page</div>} />
              <Route path="documents" element={<div>Documents Page</div>} />
              <Route path="maitre-ouvrage" element={<div>Maitre Ouvrage Page</div>} />
              <Route path="marche" element={<div>Marché Page</div>} />
              <Route path="reunion" element={<div>Réunion Page</div>} />
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
