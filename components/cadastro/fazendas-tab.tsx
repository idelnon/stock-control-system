"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type Fazenda = {
  id: string;
  nome: string;
};

export function FazendasTab() {
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [novaFazenda, setNovaFazenda] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    carregarFazendas();
  }, []);

  async function carregarFazendas() {
    const { data } = await supabase
      .from('fazendas')
      .select('*')
      .order('nome');
    if (data) setFazendas(data);
  }

  async function adicionarFazenda() {
    if (!novaFazenda.trim()) return;
    
    setIsLoading(true);
    const { error } = await supabase
      .from('fazendas')
      .insert({ nome: novaFazenda.trim() });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a fazenda",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Fazenda adicionada com sucesso"
      });
      setNovaFazenda("");
      carregarFazendas();
    }
    setIsLoading(false);
  }

  async function removerFazenda(id: string) {
    const { error } = await supabase
      .from('fazendas')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover a fazenda",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Fazenda removida com sucesso"
      });
      carregarFazendas();
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova Fazenda</h3>
      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Ex: Fazenda Barro, Fazenda Barroca"
          value={novaFazenda}
          onChange={(e) => setNovaFazenda(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && adicionarFazenda()}
          className="flex-1 h-11"
        />
        <Button onClick={adicionarFazenda} disabled={isLoading} className="gap-2 h-11 px-6">
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Nome</h3>
        {fazendas.map((fazenda) => (
          <div key={fazenda.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <span className="font-medium text-gray-900">{fazenda.nome}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removerFazenda(fazenda.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {fazendas.length === 0 && (
          <p className="text-center text-gray-400 py-8">Nenhuma fazenda cadastrada</p>
        )}
      </div>
    </div>
  );
}
