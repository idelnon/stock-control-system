"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from 'lucide-react';

type Descricao = {
  id: string;
  nome: string;
  created_at: string;
};

export function DescricoesTab() {
  const [descricoes, setDescricoes] = useState<Descricao[]>([]);
  const [novaDescricao, setNovaDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    loadDescricoes();
  }, []);

  async function loadDescricoes() {
    const { data, error } = await supabase
      .from("descricoes")
      .select("*")
      .order("nome");

    if (error) {
      toast({
        title: "Erro ao carregar descrições",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setDescricoes(data || []);
    }
  }

  async function handleAdd() {
    if (!novaDescricao.trim()) {
      toast({
        title: "Campo vazio",
        description: "Digite uma descrição",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("descricoes")
      .insert({ nome: novaDescricao.trim() });

    if (error) {
      toast({
        title: "Erro ao adicionar descrição",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Descrição adicionada",
        description: "Descrição adicionada com sucesso",
      });
      setNovaDescricao("");
      loadDescricoes();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    const { error } = await supabase
      .from("descricoes")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao deletar descrição",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Descrição deletada",
        description: "Descrição deletada com sucesso",
      });
      loadDescricoes();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4 py-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="descricao">Nova Descrição</Label>
          <Input
            id="descricao"
            value={novaDescricao}
            onChange={(e) => setNovaDescricao(e.target.value)}
            placeholder="Ex: nutrição equinos, sanidade bovinos"
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
            {descricoes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  Nenhuma descrição cadastrada
                </TableCell>
              </TableRow>
            ) : (
              descricoes.map((descricao) => (
                <TableRow key={descricao.id}>
                  <TableCell className="font-medium">{descricao.nome}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(descricao.id)}
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
