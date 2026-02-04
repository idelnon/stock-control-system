"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText } from 'lucide-react';

type Option = {
  id: string;
  nome: string;
};

export function RelatorioForm({ onGenerate }: { onGenerate: (data: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [fazendas, setFazendas] = useState<Option[]>([]);
  const [produtos, setProdutos] = useState<Option[]>([]);
  const { toast } = useToast();
  const supabase = createClient();

  const [filters, setFilters] = useState({
    dataInicio: "",
    dataFim: "",
    fazenda_id: "todos",
    produto_id: "todos",
  });

  useEffect(() => {
    loadOptions();
  }, []);

  async function loadOptions() {
    const [fazendasRes, produtosRes] = await Promise.all([
      supabase.from("fazendas").select("id, nome").order("nome"),
      supabase.from("produtos").select("id, nome").order("nome"),
    ]);

    setFazendas(fazendasRes.data || []);
    setProdutos(produtosRes.data || []);
  }

  async function handleGenerate() {
    setLoading(true);

    let query = supabase
      .from("transacoes")
      .select(`
        *,
        tipos(nome),
        aquisicoes(nome),
        pagamentos(nome),
        fazendas(nome),
        produtos(nome),
        descricoes(nome)
      `);

    if (filters.dataInicio) {
      query = query.gte("data", filters.dataInicio);
    }
    if (filters.dataFim) {
      query = query.lte("data", filters.dataFim);
    }
    if (filters.fazenda_id !== "todos") {
      query = query.eq("fazenda_id", filters.fazenda_id);
    }
    if (filters.produto_id !== "todos") {
      query = query.eq("produto_id", filters.produto_id);
    }

    const { data, error } = await query.order("data", { ascending: false });

    if (error) {
      toast({
        title: "Erro ao gerar relatório",
        description: error.message,
        variant: "destructive",
      });
    } else {
      const totalEntradas = data
        ?.filter((t: any) => t.tipos.nome === "Entrada")
        .reduce((sum, t) => sum + parseFloat(t.valor_total.toString()), 0) || 0;

      const totalSaidas = data
        ?.filter((t: any) => t.tipos.nome === "Saída")
        .reduce((sum, t) => sum + parseFloat(t.valor_total.toString()), 0) || 0;

      onGenerate({
        transacoes: data || [],
        totalEntradas,
        totalSaidas,
        saldo: totalEntradas - totalSaidas,
        filters,
      });

      toast({
        title: "Relatório gerado",
        description: `${data?.length || 0} transações encontradas`,
      });
    }

    setLoading(false);
  }

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      <h3 className="font-semibold text-lg">Filtros do Relatório</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="dataInicio">Data Início</Label>
          <Input
            id="dataInicio"
            type="date"
            value={filters.dataInicio}
            onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="dataFim">Data Fim</Label>
          <Input
            id="dataFim"
            type="date"
            value={filters.dataFim}
            onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="fazenda">Fazenda</Label>
          <Select 
            value={filters.fazenda_id} 
            onValueChange={(value) => setFilters({ ...filters, fazenda_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas</SelectItem>
              {fazendas.map((fazenda) => (
                <SelectItem key={fazenda.id} value={fazenda.id}>{fazenda.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="produto">Produto</Label>
          <Select 
            value={filters.produto_id} 
            onValueChange={(value) => setFilters({ ...filters, produto_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {produtos.map((produto) => (
                <SelectItem key={produto.id} value={produto.id}>{produto.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleGenerate} disabled={loading} className="gap-2">
          <FileText className="h-4 w-4" />
          {loading ? "Gerando..." : "Gerar Relatório"}
        </Button>
      </div>
    </div>
  );
}
