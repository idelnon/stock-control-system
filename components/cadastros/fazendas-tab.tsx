"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from 'lucide-react';

type Fazenda = {
  id: string;
  nome: string;
  created_at: string;
};

export function FazendasTab() {
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [novaFazenda, setNovaFazenda] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    loadFazendas();
  }, []);

  async function loadFazendas() {
    const { data, error } = await supabase
      .from("fazendas")
      .select("*")
      .order("nome");

    if (error) {
      toast({
        title: "Erro ao carregar fazendas",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setFazendas(data || []);
    }
  }

  async function handleAdd() {
    if (!novaFazenda.trim()) {
      toast({
        title: "Campo vazio",
        description: "Digite um nome para a fazenda",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("fazendas")
      .insert({ nome: novaFazenda.trim() });

    if (error) {
      toast({
        title: "Erro ao adicionar fazenda",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Fazenda adicionada",
        description: "Fazenda adicionada com sucesso",
      });
      setNovaFazenda("");
      loadFazendas();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    const { error } = await supabase
      .from("fazendas")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao deletar fazenda",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Fazenda deletada",
        description: "Fazenda deletada com sucesso",
      });
      loadFazendas();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4 py-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="fazenda">Nova Fazenda</Label>
          <Input
            id="fazenda"
            value={novaFazenda}
            onChange={(e) => setNovaFazenda(e.target.value)}
            placeholder="Ex: Barro, Barroca"
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
            {fazendas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  Nenhuma fazenda cadastrada
                </TableCell>
              </TableRow>
            ) : (
              fazendas.map((fazenda) => (
                <TableRow key={fazenda.id}>
                  <TableCell className="font-medium">{fazenda.nome}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(fazenda.id)}
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
