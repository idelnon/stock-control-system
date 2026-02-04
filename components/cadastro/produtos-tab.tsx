"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type Produto = {
  id: string;
  nome: string;
  saldo_minimo: number;
};

export function ProdutosTab() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [novoProduto, setNovoProduto] = useState("");
  const [saldoMinimo, setSaldoMinimo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    const { data } = await supabase
      .from('produtos')
      .select('*')
      .order('nome');
    if (data) setProdutos(data);
  }

  async function adicionarProduto() {
    if (!novoProduto.trim()) return;
    
    setIsLoading(true);
    const { error } = await supabase
      .from('produtos')
      .insert({ 
        nome: novoProduto.trim(),
        saldo_minimo: parseInt(saldoMinimo) || 0
      });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Produto adicionado com sucesso"
      });
      setNovoProduto("");
      setSaldoMinimo("");
      carregarProdutos();
    }
    setIsLoading(false);
  }

  async function removerProduto(id: string) {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o produto",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso"
      });
      carregarProdutos();
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Produto</h3>
      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Nome do produto"
          value={novoProduto}
          onChange={(e) => setNovoProduto(e.target.value)}
          className="flex-1 h-11"
        />
        <Input
          type="number"
          placeholder="Saldo mínimo"
          value={saldoMinimo}
          onChange={(e) => setSaldoMinimo(e.target.value)}
          className="w-32 h-11"
        />
        <Button onClick={adicionarProduto} disabled={isLoading} className="gap-2 h-11 px-6">
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Nome</h3>
          <h3 className="text-sm font-semibold text-gray-700">Saldo Mínimo</h3>
        </div>
        {produtos.map((produto) => (
          <div key={produto.id} className="grid grid-cols-2 gap-4 items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <span className="font-medium text-gray-900">{produto.nome}</span>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{produto.saldo_minimo}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removerProduto(produto.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {produtos.length === 0 && (
          <p className="text-center text-gray-400 py-8">Nenhum produto cadastrado</p>
        )}
      </div>
    </div>
  );
}
