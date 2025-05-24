<<<<<<< HEAD
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Pencil, Trash2, Plus } from "lucide-react"
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

const FacturesPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [factures, setFactures] = useState<FactureInterface[]>([])
  const [filteredFactures, setFilteredFactures] = useState<FactureInterface[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [factureToDelete, setFactureToDelete] = useState<number | null>(null)

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        console.log("Début de la récupération des factures...")
        const response = await factureService.getAllFactures(1)
        console.log("Réponse API reçue:", response)

        if (response && response.success && response.data) {
          console.log("Structure complète de la réponse:", response)

          // Gérer le cas où data contient lui-même un objet avec success/message/data
          let facturesData: FactureInterface[] = []

          if (response.data.success && response.data.data) {
            // Cas où data contient un autre objet de réponse
            console.log("Données imbriquées détectées")

            if (Array.isArray(response.data.data)) {
              facturesData = response.data.data
            } else if (response.data.data.results) {
              facturesData = response.data.data.results
            } else {
              // Si aucun format reconnu dans la structure imbriquée
              facturesData = response.data.data
            }
          } else if (Array.isArray(response.data)) {
            facturesData = response.data
          } else if (response.data.results) {
            facturesData = response.data.results
          } else {
            // Si aucun format reconnu, utiliser data directement
            facturesData = response.data
          }

          console.log("Nombre de factures récupérées:", facturesData.length)
          setFactures(facturesData)
          setFilteredFactures(facturesData)
        } else {
          console.error("La réponse API ne contient pas de données valides:", response)
          setError("Format de données incorrect reçu de l'API")
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des factures:", error)
        setError("Erreur lors de la récupération des factures")
      } finally {
        setLoading(false)
      }
    }

    fetchFactures()
  }, [])

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFactures(factures)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = factures.filter(
        (facture) =>
          facture.numero_facture?.toString().includes(term) ||
          facture.designation?.toLowerCase().includes(term) ||
          facture.id_marche?.toString().includes(term),
      )
      setFilteredFactures(filtered)
    }
  }, [searchTerm, factures])

  const confirmDelete = (id: number) => {
    setFactureToDelete(id)
  }

  const handleDelete = async () => {
    if (factureToDelete === null) return

    try {
      setLoading(true)
      await factureService.deleteFacture(factureToDelete.toString())

      // Mettre à jour la liste des factures après suppression
      setFactures(factures.filter((facture) => facture.id_facture !== factureToDelete))
      setFilteredFactures(filteredFactures.filter((facture) => facture.id_facture !== factureToDelete))

      toast({
        title: "Succès",
        description: "La facture a été supprimée avec succès",
      })
    } catch (error) {
      console.error("Erreur lors de la suppression de la facture:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la facture",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setFactureToDelete(null)
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
    return <div className="flex justify-center items-center h-64">Chargement des factures...</div>
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>
        <Button onClick={() => window.location.reload()}>Réessayer</Button>
      </div>
    )
  }
=======

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Invoice } from '@/types/Invoice';

const FacturesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get invoices from localStorage
  const invoices: Invoice[] = JSON.parse(localStorage.getItem('invoices') || '[]');

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.marche.toLowerCase().includes(searchTerm.toLowerCase())
  );
>>>>>>> upstream/main

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factures</h1>
<<<<<<< HEAD
        <Button onClick={() => navigate("/factures/new")}>
          <Plus className="h-4 w-4 mr-2" />
=======
        <Button onClick={() => navigate('/factures/new')}>
>>>>>>> upstream/main
          Créer nouveau
        </Button>
      </div>

      <div className="flex justify-between items-center gap-4">
<<<<<<< HEAD
        <div className="relative w-80">
          <Input
            placeholder="Rechercher une facture"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
=======
        <Input
          placeholder="Rechercher une facture"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
>>>>>>> upstream/main
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro facture</TableHead>
<<<<<<< HEAD
              <TableHead>Désignation</TableHead>
              <TableHead>Date facturation</TableHead>
              <TableHead>Montant Net HT</TableHead>
              <TableHead>Montant TTC</TableHead>
=======
              <TableHead>Numéro marché</TableHead>
              <TableHead>Montant Net</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Sous projet</TableHead>
>>>>>>> upstream/main
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
<<<<<<< HEAD
            {filteredFactures.length > 0 ? (
              filteredFactures.map((facture) => (
                <TableRow key={facture.id_facture}>
                  <TableCell>{facture.numero_facture || "-"}</TableCell>
                  <TableCell>{facture.designation || "-"}</TableCell>
                  <TableCell>{formatDate(facture.date_facturation)}</TableCell>
                  <TableCell>{formatMontant(facture.montant_net_ht)}</TableCell>
                  <TableCell>{formatMontant(facture.montant_ttc)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/factures/${facture.id_facture}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/factures/edit/${facture.id_facture}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => confirmDelete(facture.id_facture)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aucune facture trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={factureToDelete !== null} onOpenChange={(open) => !open && setFactureToDelete(null)}>
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

export default FacturesPage
=======
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.marche}</TableCell>
                <TableCell>{invoice.netAmount}</TableCell>
                <TableCell>{invoice.projectId}</TableCell>
                <TableCell>{invoice.subProjectId || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/factures/${invoice.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/factures/edit/${invoice.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
                          const newInvoices = invoices.filter(i => i.id !== invoice.id);
                          localStorage.setItem('invoices', JSON.stringify(newInvoices));
                          window.location.reload();
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FacturesPage;
>>>>>>> upstream/main
