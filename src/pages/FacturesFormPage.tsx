"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { factureService } from "@/services/factureService"
import type { FactureInterface } from "@/interfaces/FactureInterface"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

// Interface pour les fournisseurs
interface Supplier {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
}

const FactureFormPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isEditing = Boolean(id)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [openSupplierDialog, setOpenSupplierDialog] = useState(false)
  const [newSupplier, setNewSupplier] = useState<Supplier>({
    id: crypto.randomUUID(),
    name: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    contractName: "",
    contractNumber: "",
    projectId: "",
    subProjectId: "",
    supplier: "",
    invoiceDate: "",
    receptionDate: "",
    grossAmount: "",
    netAmount: "",
    tvaAmount: "",
    totalAmount: "",
    paymentOrderDate: "",
    paymentOrderNumber: "",
    marche: "",
    designation: "",
  })

  // Charger les fournisseurs depuis localStorage
  useEffect(() => {
    const savedSuppliers = localStorage.getItem("suppliers")
    if (savedSuppliers) {
      setSuppliers(JSON.parse(savedSuppliers))
    }
  }, [])

  // Charger les détails de la facture en mode édition
  useEffect(() => {
    if (isEditing && id) {
      setLoading(true)
      setError(null)

      const fetchFactureDetails = async () => {
        try {
          const response = await factureService.getFactureById(id)
          console.log("Facture details:", response)

          if (response && response.success && response.data) {
            // Extraire les données de facture, en tenant compte des différentes structures possibles
            const facture = response.data.results || response.data

            setFormData({
              contractName: facture.designation || "",
              contractNumber: facture.numero_facture?.toString() || "",
              projectId: facture.id_projet?.toString() || "",
              subProjectId: facture.id_sous_projet?.toString() || "",
              supplier: "", // À adapter selon votre modèle de données
              invoiceDate: facture.date_facturation || "",
              receptionDate: facture.date_reception || "",
              grossAmount: facture.brut_ht?.toString() || "",
              netAmount: facture.montant_net_ht?.toString() || "",
              tvaAmount: facture.montant_tva?.toString() || "",
              totalAmount: facture.montant_ttc?.toString() || "",
              paymentOrderDate: facture.date_ordre_virement || "",
              paymentOrderNumber: facture.numero_ordre_virement?.toString() || "",
              marche: facture.id_marche?.toString() || "",
              designation: facture.designation || "",
            })
          } else {
            setError("Facture non trouvée ou format de données incorrect")
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de la facture:", error)
          setError("Erreur lors du chargement de la facture")
        } finally {
          setLoading(false)
        }
      }

      fetchFactureDetails()
    }
  }, [id, isEditing])

  // Calculer automatiquement le montant total
  useEffect(() => {
    if (formData.netAmount && formData.tvaAmount) {
      const net = Number.parseFloat(formData.netAmount) || 0
      const tva = Number.parseFloat(formData.tvaAmount) || 0
      setFormData((prev) => ({ ...prev, totalAmount: (net + tva).toString() }))
    }
  }, [formData.netAmount, formData.tvaAmount])

  const handleBack = () => {
    navigate(-1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Convertir les données du formulaire au format attendu par l'API
      const factureData: Partial<FactureInterface> = {
        designation: formData.designation,
        numero_facture: formData.contractNumber ? Number.parseInt(formData.contractNumber) : null,
        date_facturation: formData.invoiceDate,
        date_reception: formData.receptionDate,
        brut_ht: formData.grossAmount ? Number.parseFloat(formData.grossAmount) : null,
        montant_net_ht: formData.netAmount ? Number.parseFloat(formData.netAmount) : null,
        montant_tva: formData.tvaAmount ? Number.parseFloat(formData.tvaAmount) : null,
        montant_ttc: formData.totalAmount ? Number.parseFloat(formData.totalAmount) : null,
        date_ordre_virement: formData.paymentOrderDate,
        numero_ordre_virement: formData.paymentOrderNumber ? Number.parseInt(formData.paymentOrderNumber) : null,
        id_projet: formData.projectId ? Number.parseInt(formData.projectId) : null,
        id_sous_projet: formData.subProjectId ? Number.parseInt(formData.subProjectId) : null,
        id_marche: formData.marche ? Number.parseInt(formData.marche) : null,
      }

      console.log("Données à envoyer:", factureData)

      let response
      if (isEditing && id) {
        response = await factureService.updateFacture(id, factureData)
      } else {
        // Assurez-vous que tous les champs requis sont présents pour Omit<FactureInterface, "id_facture">
        const completeFactureData: Omit<FactureInterface, "id_facture"> = {
          designation: formData.designation,
          numero_facture: formData.contractNumber ? Number.parseInt(formData.contractNumber) : 0,
          date_facturation: formData.invoiceDate,
          date_reception: formData.receptionDate,
          brut_ht: formData.grossAmount ? Number.parseFloat(formData.grossAmount) : 0,
          montant_net_ht: formData.netAmount ? Number.parseFloat(formData.netAmount) : 0,
          montant_tva: formData.tvaAmount ? Number.parseFloat(formData.tvaAmount) : 0,
          montant_ttc: formData.totalAmount ? Number.parseFloat(formData.totalAmount) : 0,
          date_ordre_virement: formData.paymentOrderDate,
          numero_ordre_virement: formData.paymentOrderNumber ? Number.parseInt(formData.paymentOrderNumber) : 0,
          id_projet: formData.projectId ? Number.parseInt(formData.projectId) : 0,
          id_sous_projet: formData.subProjectId ? Number.parseInt(formData.subProjectId) : 0,
          id_marche: formData.marche ? Number.parseInt(formData.marche) : 0,
          id_ap: 0,
          id_md: 0
        }
        response = await factureService.createFacture(completeFactureData)
      }

      console.log("Réponse API:", response)

      if (response && response.success) {
        toast({
          title: isEditing ? "Facture modifiée" : "Facture créée",
          description: isEditing ? "La facture a été modifiée avec succès" : "La facture a été créée avec succès",
        })
        navigate("/factures")
      } else {
        throw new Error(response?.message || "Erreur lors de l'opération")
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la facture:", error)
      setError("Une erreur est survenue lors de l'enregistrement de la facture")
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la facture",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddSupplier = () => {
    if (!newSupplier.name.trim()) return

    const updatedSuppliers = [...suppliers, newSupplier]
    setSuppliers(updatedSuppliers)
    localStorage.setItem("suppliers", JSON.stringify(updatedSuppliers))

    // Reset form
    setNewSupplier({
      id: crypto.randomUUID(),
      name: "",
    })
    setOpenSupplierDialog(false)
  }

  if (loading && isEditing) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-gray-900 font-medium">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Retour aux factures</span>
          </button>
        </div>
        <h1 className="text-2xl font-bold">{isEditing ? "Modifier la facture" : "Créer une nouvelle facture"}</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Contrat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contractName">Nom du marché</Label>
              <Input
                id="contractName"
                value={formData.contractName}
                onChange={(e) => setFormData((prev) => ({ ...prev, contractName: e.target.value }))}
                placeholder="Entrez le nom du marché"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractNumber">Numéro du marché</Label>
              <Input
                id="contractNumber"
                value={formData.contractNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, contractNumber: e.target.value }))}
                placeholder="Entrez le numéro du marché"
              />
            </div>
          </div>

          {/* Section Fournisseur */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="supplier">Fournisseur</Label>
              <Dialog open={openSupplierDialog} onOpenChange={setOpenSupplierDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Ajouter un fournisseur
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter un fournisseur</DialogTitle>
                    <DialogDescription>Ajoutez un nouveau fournisseur pour vos factures.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="supplierName">Nom du fournisseur</Label>
                      <Input
                        id="supplierName"
                        value={newSupplier.name}
                        onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                        placeholder="Entrez le nom du fournisseur"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={handleAddSupplier}>
                      Ajouter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Select
              value={formData.supplier}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, supplier: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un fournisseur" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.name}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Section Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Date de facturation</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, invoiceDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receptionDate">Date de réception</Label>
              <Input
                id="receptionDate"
                type="date"
                value={formData.receptionDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, receptionDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Section Montants */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Montants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="grossAmount">Montant brut HT</Label>
                <Input
                  id="grossAmount"
                  type="number"
                  step="0.01"
                  value={formData.grossAmount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, grossAmount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="netAmount">Montant net HT</Label>
                <Input
                  id="netAmount"
                  type="number"
                  step="0.01"
                  value={formData.netAmount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, netAmount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tvaAmount">Montant TVA</Label>
                <Input
                  id="tvaAmount"
                  type="number"
                  step="0.01"
                  value={formData.tvaAmount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tvaAmount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Montant total TTC</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  step="0.01"
                  value={formData.totalAmount}
                  readOnly
                  className="bg-gray-50"
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500">Calculé automatiquement (Net HT + TVA)</p>
              </div>
            </div>
          </div>

          {/* Section Désignation */}
          <div>
            <Label htmlFor="designation">Désignation de facture</Label>
            <Textarea
              id="designation"
              value={formData.designation}
              onChange={(e) => setFormData((prev) => ({ ...prev, designation: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FactureFormPage