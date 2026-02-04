"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from 'lucide-react';

type Pagamento = {
  id: string;
  nome: string;
  created_at: string;
};

export function PagamentosTab() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [novoPagamento, setNovoPagamento] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    loadPagamentos();
  }, []);

  async function loadPagamentos() {
    const { data, error } = await supabase
      .from("pagamentos")
      .select("*")
      .order("nome");

    if (error) {
      toast({
        title: "Erro ao carregar pagamentos",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPagamentos(data || []);
    }
  }

  async function handleAdd() {
    if (!novoPagamento.trim()) {
      toast({
        title: "Campo vazio",
        description: "Digite um nome para o pagamento",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("pagamentos")
      .insert({ nome: novoPagamento.trim() });

    if (error) {
      toast({
        title: "Erro ao adicionar pagamento",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Pagamento adicionado",
        description: "Pagamento adicionado com sucesso",
      });
      setNovoPagamento("");
      loadPagamentos();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    const { error } = await supabase
      .from("pagamentos")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao deletar pagamento",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Pagamento deletado",
        description: "Pagamento deletado com sucesso",
      });
      loadPagamentos();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4 py-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="pagamento">Novo Pagamento</Label>
          <Input
            id="pagamento"
            value={novoPagamento}
            onChange={(e) => setNovoPagamento(e.target.value)}
            placeholder="Ex: Boleto, Pix, Cartão"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleAdd} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagamentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  Nenhum pagamento cadastrado
                </TableCell>
              </TableRow>
            ) : (
              pagamentos.map((pagamento) => (
                <TableRow key={pagamento.id}>
                  <TableCell className="font-medium">{pagamento.nome}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(pagamento.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
