"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from 'lucide-react';

type Aquisicao = {
  id: string;
  nome: string;
  created_at: string;
};

export function AquisicoesTab() {
  const [aquisicoes, setAquisicoes] = useState<Aquisicao[]>([]);
  const [novaAquisicao, setNovaAquisicao] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    loadAquisicoes();
  }, []);

  async function loadAquisicoes() {
    const { data, error } = await supabase
      .from("aquisicoes")
      .select("*")
      .order("nome");

    if (error) {
      toast({
        title: "Erro ao carregar aquisições",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setAquisicoes(data || []);
    }
  }

  async function handleAdd() {
    if (!novaAquisicao.trim()) {
      toast({
        title: "Campo vazio",
        description: "Digite um nome para a aquisição",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("aquisicoes")
      .insert({ nome: novaAquisicao.trim() });

    if (error) {
      toast({
        title: "Erro ao adicionar aquisição",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Aquisição adicionada",
        description: "Aquisição adicionada com sucesso",
      });
      setNovaAquisicao("");
      loadAquisicoes();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    const { error } = await supabase
      .from("aquisicoes")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao deletar aquisição",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Aquisição deletada",
        description: "Aquisição deletada com sucesso",
      });
      loadAquisicoes();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4 py-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="aquisicao">Nova Aquisição</Label>
          <Input
            id="aquisicao"
            value={novaAquisicao}
            onChange={(e) => setNovaAquisicao(e.target.value)}
            placeholder="Ex: Compra, Indústria"
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
            {aquisicoes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  Nenhuma aquisição cadastrada
                </TableCell>
              </TableRow>
            ) : (
              aquisicoes.map((aquisicao) => (
                <TableRow key={aquisicao.id}>
                  <TableCell className="font-medium">{aquisicao.nome}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(aquisicao.id)}
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
