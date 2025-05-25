"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileEdit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { factureService } from "@/services/factureService"
import type { FactureInterface } from "@/interfaces/FactureInterface"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const FactureDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [facture, setFacture] = useState<FactureInterface | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchFactureDetails = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)
        console.log("Récupération des détails de la facture avec ID:", id)

        const response = await factureService.getFactureById(id)
        console.log("Réponse API détails facture:", response)

        if (response && response.success) {
          // Extraire les données de facture, en tenant compte des différentes structures possibles
          let factureData = null

          if (response.data && response.data.success) {
            // Cas où data contient un autre objet de réponse
            factureData = response.data.data
          } else {
            // Cas standard
            factureData = response.data
          }

          // Si factureData est un objet avec results, utiliser results
          const factureDetails = factureData?.results || factureData

          console.log("Données de facture extraites:", factureDetails)
          setFacture(factureDetails)
        } else {
          console.error("Erreur dans la réponse API:", response)
          setError("Impossible de récupérer les détails de la facture")
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la facture:", error)
        setError("Une erreur est survenue lors du chargement des détails de la facture")
      } finally {
        setLoading(false)
      }
    }

    fetchFactureDetails()
  }, [id])

  const handleDelete = async () => {
    if (!id) return

    try {
      setLoading(true)
      await factureService.deleteFacture(id)

      toast({
        title: "Facture supprimée",
        description: "La facture a été supprimée avec succès",
      })

      navigate("/factures")
    } catch (error) {
      console.error("Erreur lors de la suppression de la facture:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la facture",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setShowDeleteDialog(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (e) {
      return dateString
    }
  }

  const formatMontant = (montant: number | null) => {
    if (montant === null) return "-"
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 2,
    }).format(montant)
  }

  if (loading) {
    return (
      <div className="p-6">
        <Button variant="ghost" className="flex items-center gap-2 mb-4" onClick={() => navigate("/factures")}>
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (error || !facture) {
    return (
      <div className="p-6">
        <Button variant="ghost" className="flex items-center gap-2 mb-4" onClick={() => navigate("/factures")}>
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <div className="text-center py-10 text-red-600">{error || "Facture non trouvée"}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" className="flex items-center gap-2" onClick={() => navigate("/factures")}>
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" /> Supprimer
          </Button>

          <Button onClick={() => navigate(`/factures/edit/${facture.id_facture}`)} className="flex items-center gap-2">
            <FileEdit className="h-4 w-4" /> Modifier
          </Button>
        </div>
      </div>

      <h1 className="text-2xl font-bold">Facture {facture.numero_facture || `#${facture.id_facture}`}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Détails de la facture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Désignation</p>
              <p>{facture.designation || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Numéro de marché</p>
              <p>{facture.id_marche || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Projet</p>
              <p>{facture.id_projet || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sous-projet</p>
              <p>{facture.id_sous_projet || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dates</p>
              <p>Facturation: {formatDate(facture.date_facturation)}</p>
              <p>Réception: {formatDate(facture.date_reception)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Montants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Montant brut HT</p>
              <p>{formatMontant(facture.brut_ht)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Montant net HT</p>
              <p>{formatMontant(facture.montant_net_ht)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">TVA</p>
              <p>{formatMontant(facture.montant_tva)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Montant total TTC</p>
              <p className="text-lg font-bold">{formatMontant(facture.montant_ttc)}</p>
            </div>
            {facture.date_ordre_virement && (
              <div>
                <p className="text-sm text-gray-500">Ordre de virement</p>
                <p>N° {facture.numero_ordre_virement || "-"}</p>
                <p>Date: {formatDate(facture.date_ordre_virement)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette facture ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La facture sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default FactureDetailsPage
