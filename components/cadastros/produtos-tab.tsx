"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from 'lucide-react';

type Produto = {
  id: string;
  nome: string;
  saldo_minimo: number;
  created_at: string;
};

export function ProdutosTab() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [novoProduto, setNovoProduto] = useState("");
  const [saldoMinimo, setSaldoMinimo] = useState("5");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    loadProdutos();
  }, []);

  async function loadProdutos() {
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .order("nome");

    if (error) {
      toast({
        title: "Erro ao carregar produtos",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setProdutos(data || []);
    }
  }

  async function handleAdd() {
    if (!novoProduto.trim()) {
      toast({
        title: "Campo vazio",
        description: "Digite um nome para o produto",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("produtos")
      .insert({ 
        nome: novoProduto.trim(),
        saldo_minimo: parseInt(saldoMinimo) || 5
      });

    if (error) {
      toast({
        title: "Erro ao adicionar produto",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Produto adicionado",
        description: "Produto adicionado com sucesso",
      });
      setNovoProduto("");
      setSaldoMinimo("5");
      loadProdutos();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    const { error } = await supabase
      .from("produtos")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao deletar produto",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Produto deletado",
        description: "Produto deletado com sucesso",
      });
      loadProdutos();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4 py-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="produto">Novo Produto</Label>
          <Input
            id="produto"
            value={novoProduto}
            onChange={(e) => setNovoProduto(e.target.value)}
            placeholder="Ex: Ração, Vermífugo"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
        </div>
        <div className="w-32">
          <Label htmlFor="saldo-minimo">Saldo Mínimo</Label>
          <Input
            id="saldo-minimo"
            type="number"
            value={saldoMinimo}
            onChange={(e) => setSaldoMinimo(e.target.value)}
            placeholder="5"
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
              <TableHead>Saldo Mínimo</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Nenhum produto cadastrado
                </TableCell>
              </TableRow>
            ) : (
              produtos.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell className="font-medium">{produto.nome}</TableCell>
                  <TableCell>{produto.saldo_minimo}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(produto.id)}
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
