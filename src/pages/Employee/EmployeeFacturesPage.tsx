
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { Invoice } from '@/types/Invoice';

const EmployeeFacturesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const invoices: Invoice[] = JSON.parse(localStorage.getItem('invoices') || '[]');

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.marche.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Factures</h1>

      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Rechercher une facture"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro facture</TableHead>
              <TableHead>Numéro marché</TableHead>
              <TableHead>Montant Net</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Sous projet</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.marche}</TableCell>
                <TableCell>{invoice.netAmount}</TableCell>
                <TableCell>{invoice.projectId}</TableCell>
                <TableCell>{invoice.subProjectId || '-'}</TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => window.location.href = `/employee/factures/${invoice.id}`}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeFacturesPage;
