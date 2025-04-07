
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Marche } from '@/types/Marche';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';

interface Project {
  id: string;
  name: string;
}

const MarcheFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [nom, setNom] = useState('');
  const [numeroMarche, setNumeroMarche] = useState('');
  const [type, setType] = useState('');
  const [dateSignature, setDateSignature] = useState('');
  const [dateDebutProjet, setDateDebutProjet] = useState('');
  const [dateVisaCME, setDateVisaCME] = useState('');
  const [numeroAppelOffre, setNumeroAppelOffre] = useState('');
  const [prixDinar, setPrixDinar] = useState('');
  const [prixDevise, setPrixDevise] = useState('');
  const [fournisseur, setFournisseur] = useState('');
  const [projetId, setProjetId] = useState('');
  const [description, setDescription] = useState('');
  
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Load projects for the dropdown
    const projectsString = localStorage.getItem('projects');
    if (projectsString) {
      try {
        const projectsData = JSON.parse(projectsString);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }

    if (isEditing) {
      // Load existing marché data
      const marchesString = localStorage.getItem('marches');
      if (marchesString) {
        try {
          const marches = JSON.parse(marchesString);
          const marche = marches.find((m: Marche) => m.id === id);
          if (marche) {
            setNom(marche.nom);
            setNumeroMarche(marche.numeroMarche);
            setType(marche.type);
            setDateSignature(marche.dateSignature);
            setDateDebutProjet(marche.dateDebutProjet);
            setDateVisaCME(marche.dateVisaCME);
            setNumeroAppelOffre(marche.numeroAppelOffre);
            setPrixDinar(marche.prixDinar);
            setPrixDevise(marche.prixDevise);
            setFournisseur(marche.fournisseur);
            setProjetId(marche.projetId || '');
            setDescription(marche.description);
          }
        } catch (error) {
          console.error('Error loading marché data:', error);
        }
      }
    }
  }, [id, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!nom.trim() || !numeroMarche.trim()) {
      alert("Le nom et le numéro du marché sont obligatoires");
      return;
    }

    // Prepare the marché data
    const marcheData: Marche = {
      id: isEditing ? id! : uuidv4(),
      nom,
      numeroMarche,
      type,
      dateSignature,
      dateDebutProjet,
      dateVisaCME,
      numeroAppelOffre,
      prixDinar,
      prixDevise,
      fournisseur,
      projetId: projetId || undefined,
      description
    };

    // Save to localStorage
    const marchesString = localStorage.getItem('marches');
    let marches: Marche[] = [];

    try {
      if (marchesString) {
        marches = JSON.parse(marchesString);
      }

      if (isEditing) {
        // Update existing marché
        marches = marches.map(m => m.id === id ? marcheData : m);
      } else {
        // Add new marché to the beginning of the array
        marches.unshift(marcheData);
      }

      localStorage.setItem('marches', JSON.stringify(marches));
      navigate('/marche');
    } catch (error) {
      console.error('Error saving marché:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/marche')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Modifier' : 'Créer'} marché
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="nom" className="mb-2 block">Nom du marché</Label>
              <Input
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Entrez le nom"
                required
              />
            </div>

            <div>
              <Label htmlFor="numeroMarche" className="mb-2 block">Numéro du marché</Label>
              <Input
                id="numeroMarche"
                value={numeroMarche}
                onChange={(e) => setNumeroMarche(e.target.value)}
                placeholder="Entrez le numéro"
                required
              />
            </div>

            <div>
              <Label htmlFor="type" className="mb-2 block">Type du marché</Label>
              <Input
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Entrez le type"
              />
            </div>

            <div>
              <Label htmlFor="projet" className="mb-2 block">Projet associé</Label>
              <Select value={projetId} onValueChange={setProjetId}>
                <SelectTrigger id="projet">
                  <SelectValue placeholder="sélectionnez un projet" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="numeroAppelOffre" className="mb-2 block">Numéro d'Appel d'Offre</Label>
              <Input
                id="numeroAppelOffre"
                value={numeroAppelOffre}
                onChange={(e) => setNumeroAppelOffre(e.target.value)}
                placeholder="Entrez le numéro"
              />
            </div>

            <div>
              <Label htmlFor="fournisseur" className="mb-2 block">Nom du fournisseur</Label>
              <Input
                id="fournisseur"
                value={fournisseur}
                onChange={(e) => setFournisseur(e.target.value)}
                placeholder="Entrez le nom du fournisseur"
              />
            </div>

            <div>
              <Label htmlFor="prixDinar" className="mb-2 block">Prix (Dinar)</Label>
              <Input
                id="prixDinar"
                value={prixDinar}
                onChange={(e) => setPrixDinar(e.target.value)}
                placeholder="Entrez le prix en dinar"
              />
            </div>

            <div>
              <Label htmlFor="prixDevise" className="mb-2 block">Prix (Devise)</Label>
              <Input
                id="prixDevise"
                value={prixDevise}
                onChange={(e) => setPrixDevise(e.target.value)}
                placeholder="Entrez le prix en devise"
              />
            </div>

            <div>
              <Label htmlFor="dateVisaCME" className="mb-2 block">Date Visa CME</Label>
              <Input
                id="dateVisaCME"
                type="date"
                value={dateVisaCME}
                onChange={(e) => setDateVisaCME(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="dateDebutProjet" className="mb-2 block">Date début projet</Label>
              <Input
                id="dateDebutProjet"
                type="date"
                value={dateDebutProjet}
                onChange={(e) => setDateDebutProjet(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="dateSignature" className="mb-2 block">Date de signature</Label>
              <Input
                id="dateSignature"
                type="date"
                value={dateSignature}
                onChange={(e) => setDateSignature(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="mb-2 block">Description du marché</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Entrez la description"
              rows={6}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarcheFormPage;
