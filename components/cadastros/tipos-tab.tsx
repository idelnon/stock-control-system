"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from 'lucide-react';

type Tipo = {
  id: string;
  nome: string;
  created_at: string;
};

export function TiposTab() {
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [novoTipo, setNovoTipo] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    loadTipos();
  }, []);

  async function loadTipos() {
    const { data, error } = await supabase
      .from("tipos")
      .select("*")
      .order("nome");

    if (error) {
      toast({
        title: "Erro ao carregar tipos",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTipos(data || []);
    }
  }

  async function handleAdd() {
    if (!novoTipo.trim()) {
      toast({
        title: "Campo vazio",
        description: "Digite um nome para o tipo",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("tipos")
      .insert({ nome: novoTipo.trim() });

    if (error) {
      toast({
        title: "Erro ao adicionar tipo",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Tipo adicionado",
        description: "Tipo adicionado com sucesso",
      });
      setNovoTipo("");
      loadTipos();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    const { error } = await supabase
      .from("tipos")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao deletar tipo",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Tipo deletado",
        description: "Tipo deletado com sucesso",
      });
      loadTipos();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4 py-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="tipo">Novo Tipo</Label>
          <Input
            id="tipo"
            value={novoTipo}
            onChange={(e) => setNovoTipo(e.target.value)}
            placeholder="Ex: Entrada, Saída"
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
            {tipos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  Nenhum tipo cadastrado
                </TableCell>
              </TableRow>
            ) : (
              tipos.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell className="font-medium">{tipo.nome}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(tipo.id)}
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
