
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Invoice } from '@/types/Invoice';
import { v4 as uuidv4 } from 'uuid';

const FinancierFactureFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    designation: ''
  });

  useEffect(() => {
    if (isEditing) {
      const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      const invoice = invoices.find((i: Invoice) => i.id === id);
      if (invoice) {
        setFormData({
          contractName: invoice.contractName,
          contractNumber: invoice.contractNumber,
          projectId: invoice.projectId,
          subProjectId: invoice.subProjectId || '',
          supplier: invoice.supplier,
          invoiceDate: invoice.invoiceDate,
          receptionDate: invoice.receptionDate,
          grossAmount: String(invoice.grossAmount),
          netAmount: String(invoice.netAmount),
          tvaAmount: String(invoice.tvaAmount),
          totalAmount: String(invoice.totalAmount),
          paymentOrderDate: invoice.paymentOrderDate,
          paymentOrderNumber: invoice.paymentOrderNumber,
          marche: invoice.marche,
          designation: invoice.designation
        });
      }
    }
  }, [id, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const invoiceData: Invoice = {
      id: isEditing ? id! : uuidv4(),
      ...formData,
      grossAmount: Number(formData.grossAmount),
      netAmount: Number(formData.netAmount),
      tvaAmount: Number(formData.tvaAmount),
      totalAmount: Number(formData.totalAmount),
      createdAt: new Date().toISOString(),
      invoiceNumber: isEditing ? id! : uuidv4().substring(0, 8).toUpperCase()
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

    navigate('/financier/factures');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/financier/factures')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Modifier' : 'Créer'} Facture
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
              <Label htmlFor="projectId">Projet associé</Label>
              <Select 
                value={formData.projectId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, projectId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project1">Projet 1</SelectItem>
                  <SelectItem value="project2">Projet 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subProjectId">Sous projet associé</Label>
              <Select 
                value={formData.subProjectId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, subProjectId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un sous-projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subproject1">Sous-projet 1</SelectItem>
                  <SelectItem value="subproject2">Sous-projet 2</SelectItem>
                </SelectContent>
              </Select>
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
