"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type Descricao = {
  id: string;
  nome: string;
};

export function DescricoesTab() {
  const [descricoes, setDescricoes] = useState<Descricao[]>([]);
  const [novaDescricao, setNovaDescricao] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    carregarDescricoes();
  }, []);

  async function carregarDescricoes() {
    const { data } = await supabase
      .from('descricoes')
      .select('*')
      .order('nome');
    if (data) setDescricoes(data);
  }

  async function adicionarDescricao() {
    if (!novaDescricao.trim()) return;
    
    setIsLoading(true);
    const { error } = await supabase
      .from('descricoes')
      .insert({ nome: novaDescricao.trim() });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a descrição",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Descrição adicionada com sucesso"
      });
      setNovaDescricao("");
      carregarDescricoes();
    }
    setIsLoading(false);
  }

  async function removerDescricao(id: string) {
    const { error } = await supabase
      .from('descricoes')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover a descrição",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Descrição removida com sucesso"
      });
      carregarDescricoes();
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova Descrição</h3>
      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Ex: Descrição do produto"
          value={novaDescricao}
          onChange={(e) => setNovaDescricao(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && adicionarDescricao()}
          className="flex-1 h-11"
        />
        <Button onClick={adicionarDescricao} disabled={isLoading} className="gap-2 h-11 px-6">
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Nome</h3>
        {descricoes.map((descricao) => (
          <div key={descricao.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <span className="font-medium text-gray-900">{descricao.nome}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removerDescricao(descricao.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {descricoes.length === 0 && (
          <p className="text-center text-gray-400 py-8">Nenhuma descrição cadastrada</p>
        )}
      </div>
    </div>
  );
}
