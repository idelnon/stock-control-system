"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransacaoForm } from "./transacao-form";

type Transacao = {
  id: string;
  data: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  vencimento: string | null;
  tipos: { nome: string };
  aquisicoes: { nome: string };
  pagamentos: { nome: string };
  fazendas: { nome: string };
  produtos: { nome: string };
  descricoes: { nome: string };
};

export function TransacoesTable() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    loadTransacoes();
  }, []);

  async function loadTransacoes() {
    setLoading(true);
    const { data, error } = await supabase
      .from("transacoes")
      .select(`
        *,
        tipos(nome),
        aquisicoes(nome),
        pagamentos(nome),
        fazendas(nome),
        produtos(nome),
        descricoes(nome)
      `)
      .order("data", { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar transações",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTransacoes(data || []);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja deletar esta transação?")) return;

    const { error } = await supabase
      .from("transacoes")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao deletar transação",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Transação deletada",
        description: "Transação deletada com sucesso",
      });
      loadTransacoes();
    }
  }

  function handleEdit(transacao: any) {
    setEditData(transacao);
    setEditOpen(true);
  }

  function handleEditSuccess() {
    setEditOpen(false);
    setEditData(null);
    loadTransacoes();
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Data</TableHead>
              <TableHead className="font-semibold">Tipo</TableHead>
              <TableHead className="font-semibold">Fazenda</TableHead>
              <TableHead className="font-semibold">Produto</TableHead>
              <TableHead className="font-semibold">Descrição</TableHead>
              <TableHead className="font-semibold">Quantidade</TableHead>
              <TableHead className="font-semibold">Valor Unit.</TableHead>
              <TableHead className="font-semibold">Valor Total</TableHead>
              <TableHead className="font-semibold">Vencimento</TableHead>
              <TableHead className="font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transacoes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-gray-500 py-8">
                  Nenhuma transação registrada
                </TableCell>
              </TableRow>
            ) : (
              transacoes.map((transacao) => (
                <TableRow key={transacao.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {new Date(transacao.data).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transacao.tipos.nome === 'Entrada' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {transacao.tipos.nome}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-700">{transacao.fazendas.nome}</TableCell>
                  <TableCell className="font-medium text-gray-900">{transacao.produtos.nome}</TableCell>
                  <TableCell className="text-gray-600">{transacao.descricoes.nome}</TableCell>
                  <TableCell className="font-semibold">{transacao.quantidade}</TableCell>
                  <TableCell className="text-gray-700">R$ {transacao.valor_unitario.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold text-gray-900">
                    R$ {transacao.valor_total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {transacao.vencimento ? new Date(transacao.vencimento).toLocaleDateString("pt-BR") : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(transacao)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(transacao.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Transação</DialogTitle>
          </DialogHeader>
          <TransacaoForm onSuccess={handleEditSuccess} editData={editData} />
        </DialogContent>
      </Dialog>
    </>
  );
}
