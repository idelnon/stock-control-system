"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeftRight } from 'lucide-react';
import { TransacoesTable } from "@/components/transacoes/transacoes-table";
import { TransacaoForm } from "@/components/transacoes/transacao-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TransacoesPage() {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl p-3 shadow-md">
                  <ArrowLeftRight className="h-7 w-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-900">Entrada / Saída</CardTitle>
                  <CardDescription className="text-base text-gray-600 mt-1">
                    Registrar e gerenciar transações de estoque
                  </CardDescription>
                </div>
              </div>
              
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] shadow-md">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Transação
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Nova Transação</DialogTitle>
                  </DialogHeader>
                  <TransacaoForm onSuccess={handleSuccess} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <TransacoesTable key={refreshKey} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
