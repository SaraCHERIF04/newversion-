import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Invoice } from '@/types/Invoice';
import { v4 as uuidv4 } from 'uuid';
import MemberSearch from '@/components/MemberSearch';
import { User } from '@/types/User';

const FinancierFactureFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    contractName: '',
    contractNumber: '',
    projectId: '',
    subProjectId: '',
    supplier: '',
    invoiceDate: '',
    receptionDate: '',
    grossAmount: '',
    netAmount: '',
    tvaAmount: '',
    totalAmount: '',
    paymentOrderDate: '',
    paymentOrderNumber: '',
    marche: '',
    designation: '',
    maitreOeuvre: '',
    maitreOuvrage: ''
  });

  const [selectedChef, setSelectedChef] = useState<User[]>([]);

  useEffect(() => {
    if (isEditing) {
      const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      const invoice = invoices.find((i: Invoice) => i.id === id);
      if (invoice) {
        setFormData({
          ...invoice,
          grossAmount: String(invoice.grossAmount),
          netAmount: String(invoice.netAmount),
          tvaAmount: String(invoice.tvaAmount),
          totalAmount: String(invoice.totalAmount),
        });
      }
    }
  }, [id, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const invoiceNumber = isEditing ? id! : `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
    
    const invoiceData: Invoice = {
      id: isEditing ? id! : uuidv4(),
      ...formData,
      grossAmount: Number(formData.grossAmount),
      netAmount: Number(formData.netAmount),
      tvaAmount: Number(formData.tvaAmount),
      totalAmount: Number(formData.totalAmount),
      createdAt: new Date().toISOString(),
      invoiceNumber
    };

    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    
    if (isEditing) {
      const index = invoices.findIndex((i: Invoice) => i.id === id);
      invoices[index] = invoiceData;
    } else {
      invoices.unshift(invoiceData);
    }

    localStorage.setItem('invoices', JSON.stringify(invoices));
    
    toast({
      title: isEditing ? "Facture modifiée" : "Facture créée",
      description: isEditing ? "La facture a été modifiée avec succès" : "La facture a été créée avec succès"
    });

    navigate(-1);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleChefSelect = (member: User) => {
    if (selectedChef.length === 0 || selectedChef[0].id !== member.id) {
      setSelectedChef([member]);
    } else {
      setSelectedChef([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Modifier la facture' : 'Créer une nouvelle facture'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="contractName">Nom de contrat</Label>
              <Input
                id="contractName"
                value={formData.contractName}
                onChange={(e) => setFormData(prev => ({ ...prev, contractName: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="contractNumber">Numéro de contrat</Label>
              <Input
                id="contractNumber"
                value={formData.contractNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, contractNumber: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Chef de projet</Label>
              <MemberSearch
                onSelect={handleChefSelect}
                selectedMembers={selectedChef}
              />
            </div>
            <div>
              <Label>Maître d'ouvrage</Label>
              <Input
                value={formData.maitreOuvrage}
                onChange={(e) => setFormData(prev => ({ ...prev, maitreOuvrage: e.target.value }))}
                placeholder="Rechercher ou saisir..."
                className="mb-2"
              />
            </div>
            <div>
              <Label>Maître d'œuvre</Label>
              <Input
                value={formData.maitreOeuvre}
                onChange={(e) => setFormData(prev => ({ ...prev, maitreOeuvre: e.target.value }))}
                placeholder="Rechercher ou saisir..."
                className="mb-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="invoiceDate">Date de factorisation</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="receptionDate">Date réception</Label>
              <Input
                id="receptionDate"
                type="date"
                value={formData.receptionDate}
                onChange={(e) => setFormData(prev => ({ ...prev, receptionDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="grossAmount">Brut H.T</Label>
              <Input
                id="grossAmount"
                type="number"
                value={formData.grossAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, grossAmount: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="netAmount">Montant Net H.T</Label>
              <Input
                id="netAmount"
                type="number"
                value={formData.netAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, netAmount: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="tvaAmount">Montant TVA</Label>
              <Input
                id="tvaAmount"
                type="number"
                value={formData.tvaAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, tvaAmount: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="totalAmount">Montant T.T.C</Label>
              <Input
                id="totalAmount"
                type="number"
                value={formData.totalAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, totalAmount: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="designation">Désignation de facture</Label>
            <Textarea
              id="designation"
              value={formData.designation}
              onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {isEditing ? 'Mettre à jour' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinancierFactureFormPage;
