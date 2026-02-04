"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type Tipo = {
  id: string;
  nome: string;
};

export function TiposTab() {
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [novoTipo, setNovoTipo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    carregarTipos();
  }, []);

  async function carregarTipos() {
    const { data } = await supabase
      .from('tipos')
      .select('*')
      .order('nome');
    if (data) setTipos(data);
  }

  async function adicionarTipo() {
    if (!novoTipo.trim()) return;
    
    setIsLoading(true);
    const { error } = await supabase
      .from('tipos')
      .insert({ nome: novoTipo.trim() });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o tipo",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Tipo adicionado com sucesso"
      });
      setNovoTipo("");
      carregarTipos();
    }
    setIsLoading(false);
  }

  async function removerTipo(id: string) {
    const { error } = await supabase
      .from('tipos')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o tipo",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Tipo removido com sucesso"
      });
      carregarTipos();
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Tipo</h3>
      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Ex: Entrada, Saída"
          value={novoTipo}
          onChange={(e) => setNovoTipo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && adicionarTipo()}
          className="flex-1 h-11"
        />
        <Button onClick={adicionarTipo} disabled={isLoading} className="gap-2 h-11 px-6">
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Nome</h3>
        {tipos.map((tipo) => (
          <div key={tipo.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <span className="font-medium text-gray-900">{tipo.nome}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removerTipo(tipo.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {tipos.length === 0 && (
          <p className="text-center text-gray-400 py-8">Nenhum tipo cadastrado</p>
        )}
      </div>
    </div>
  );
}
