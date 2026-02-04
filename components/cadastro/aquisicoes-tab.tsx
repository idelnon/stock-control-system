"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type Aquisicao = {
  id: string;
  nome: string;
};

export function AquisicoesTab() {
  const [aquisicoes, setAquisicoes] = useState<Aquisicao[]>([]);
  const [novaAquisicao, setNovaAquisicao] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    carregarAquisicoes();
  }, []);

  async function carregarAquisicoes() {
    const { data } = await supabase
      .from('aquisicoes')
      .select('*')
      .order('nome');
    if (data) setAquisicoes(data);
  }

  async function adicionarAquisicao() {
    if (!novaAquisicao.trim()) return;
    
    setIsLoading(true);
    const { error } = await supabase
      .from('aquisicoes')
      .insert({ nome: novaAquisicao.trim() });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a aquisição",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Aquisição adicionada com sucesso"
      });
      setNovaAquisicao("");
      carregarAquisicoes();
    }
    setIsLoading(false);
  }

  async function removerAquisicao(id: string) {
    const { error } = await supabase
      .from('aquisicoes')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover a aquisição",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Aquisição removida com sucesso"
      });
      carregarAquisicoes();
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova Aquisição</h3>
      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Ex: Compra, Industria"
          value={novaAquisicao}
          onChange={(e) => setNovaAquisicao(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && adicionarAquisicao()}
          className="flex-1 h-11"
        />
        <Button onClick={adicionarAquisicao} disabled={isLoading} className="gap-2 h-11 px-6">
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Nome</h3>
        {aquisicoes.map((aquisicao) => (
          <div key={aquisicao.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <span className="font-medium text-gray-900">{aquisicao.nome}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removerAquisicao(aquisicao.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {aquisicoes.length === 0 && (
          <p className="text-center text-gray-400 py-8">Nenhuma aquisição cadastrada</p>
        )}
      </div>
    </div>
  );
}
