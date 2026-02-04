"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type Pagamento = {
  id: string;
  nome: string;
};

export function PagamentosTab() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [novoPagamento, setNovoPagamento] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    carregarPagamentos();
  }, []);

  async function carregarPagamentos() {
    const { data } = await supabase
      .from('pagamentos')
      .select('*')
      .order('nome');
    if (data) setPagamentos(data);
  }

  async function adicionarPagamento() {
    if (!novoPagamento.trim()) return;
    
    setIsLoading(true);
    const { error } = await supabase
      .from('pagamentos')
      .insert({ nome: novoPagamento.trim() });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o pagamento",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Pagamento adicionado com sucesso"
      });
      setNovoPagamento("");
      carregarPagamentos();
    }
    setIsLoading(false);
  }

  async function removerPagamento(id: string) {
    const { error } = await supabase
      .from('pagamentos')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o pagamento",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Pagamento removido com sucesso"
      });
      carregarPagamentos();
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Pagamento</h3>
      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Ex: Boleto, Pix, Cartão"
          value={novoPagamento}
          onChange={(e) => setNovoPagamento(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && adicionarPagamento()}
          className="flex-1 h-11"
        />
        <Button onClick={adicionarPagamento} disabled={isLoading} className="gap-2 h-11 px-6">
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Nome</h3>
        {pagamentos.map((pagamento) => (
          <div key={pagamento.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <span className="font-medium text-gray-900">{pagamento.nome}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removerPagamento(pagamento.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {pagamentos.length === 0 && (
          <p className="text-center text-gray-400 py-8">Nenhum pagamento cadastrado</p>
        )}
      </div>
    </div>
  );
}
