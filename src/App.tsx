import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FactureForm from './pages/FactureForm';
import FactureList from './pages/FactureList';
import FactureDetail from './pages/FactureDetail';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeList from './pages/EmployeeList';
import ParametresPage from './pages/ParametresPage';
import { Toaster } from '@/components/ui/toaster';
import MaitreOuvrageForm from './pages/MaitreOuvrageForm';
import MaitreOuvrageList from './pages/MaitreOuvrageList';
import MaitreOeuvreForm from './pages/MaitreOeuvreForm';
import MaitreOeuvreList from './pages/MaitreOeuvreList';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<FactureList />} />
          <Route path="/facture/new" element={<FactureForm />} />
          <Route path="/facture/:id" element={<FactureDetail />} />
          <Route path="/facture/edit/:id" element={<FactureForm />} />
          <Route path="/employee/new" element={<EmployeeForm />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/maitre-ouvrage" element={<MaitreOuvrageForm />} />
          <Route path="/maitre-ouvrage/list" element={<MaitreOuvrageList />} />
          <Route path="/maitre-oeuvre" element={<MaitreOeuvreForm />} />
          <Route path="/maitre-oeuvre/list" element={<MaitreOeuvreList />} />
          <Route path="/parametres" element={<ParametresPage />} />
        </Routes>
        <Toaster />
      </Router>
    </LanguageProvider>
  );
}

export default App;
