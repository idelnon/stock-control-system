"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle } from 'lucide-react';

type EstoqueItem = {
  produto_id: string;
  produto_nome: string;
  saldo_minimo: number;
  entrada: number;
  saida: number;
  saldo: number;
  dias_vencimento: number | null;
  descricoes: string[];
  valor_compra: number;
  valor_industria: number;
  valor_estoque: number;
  valor_gasto: number;
};

export function EstoqueTable({ fazenda }: { fazenda: string }) {
  const [items, setItems] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    loadEstoque();
  }, [fazenda]);

  async function loadEstoque() {
    setLoading(true);

    // Buscar o ID da fazenda
    const { data: fazendaData } = await supabase
      .from("fazendas")
      .select("id")
      .eq("nome", fazenda.charAt(0).toUpperCase() + fazenda.slice(1))
      .single();

    if (!fazendaData) {
      toast({
        title: "Erro",
        description: "Fazenda não encontrada",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Buscar todos os produtos
    const { data: produtos } = await supabase
      .from("produtos")
      .select("id, nome, saldo_minimo")
      .order("nome");

    if (!produtos) {
      setLoading(false);
      return;
    }

    // Buscar IDs de tipos
    const { data: tipoEntrada } = await supabase
      .from("tipos")
      .select("id")
      .eq("nome", "Entrada")
      .single();

    const { data: tipoSaida } = await supabase
      .from("tipos")
      .select("id")
      .eq("nome", "Saída")
      .single();

    const { data: aquisicaoCompra } = await supabase
      .from("aquisicoes")
      .select("id")
      .eq("nome", "Compra")
      .single();

    const { data: aquisicaoIndustria } = await supabase
      .from("aquisicoes")
      .select("id")
      .eq("nome", "Indústria")
      .single();

    const estoque: EstoqueItem[] = [];

    for (const produto of produtos) {
      // Entradas
      const { data: entradas } = await supabase
        .from("transacoes")
        .select("quantidade, valor_total, aquisicao_id, vencimento")
        .eq("fazenda_id", fazendaData.id)
        .eq("produto_id", produto.id)
        .eq("tipo_id", tipoEntrada?.id);

      // Saídas
      const { data: saidas } = await supabase
        .from("transacoes")
        .select("quantidade, valor_total")
        .eq("fazenda_id", fazendaData.id)
        .eq("produto_id", produto.id)
        .eq("tipo_id", tipoSaida?.id);

      // Descrições
      const { data: descricoesData } = await supabase
        .from("transacoes")
        .select("descricoes(nome)")
        .eq("fazenda_id", fazendaData.id)
        .eq("produto_id", produto.id);

      const totalEntrada = entradas?.reduce((sum, e) => sum + parseFloat(e.quantidade.toString()), 0) || 0;
      const totalSaida = saidas?.reduce((sum, s) => sum + parseFloat(s.quantidade.toString()), 0) || 0;
      const saldo = totalEntrada - totalSaida;

      // Calcular valores
      const valorCompra = entradas?.filter(e => e.aquisicao_id === aquisicaoCompra?.id)
        .reduce((sum, e) => sum + parseFloat(e.valor_total.toString()), 0) || 0;

      const valorIndustria = entradas?.filter(e => e.aquisicao_id === aquisicaoIndustria?.id)
        .reduce((sum, e) => sum + parseFloat(e.valor_total.toString()), 0) || 0;

      const valorEstoque = entradas?.reduce((sum, e) => sum + parseFloat(e.valor_total.toString()), 0) || 0;
      const valorGasto = saidas?.reduce((sum, s) => sum + parseFloat(s.valor_total.toString()), 0) || 0;

      // Calcular dias para vencimento
      let diasVencimento: number | null = null;
      if (entradas && entradas.length > 0) {
        const vencimentos = entradas
          .filter(e => e.vencimento)
          .map(e => new Date(e.vencimento!).getTime());
        
        if (vencimentos.length > 0) {
          const proximoVencimento = Math.min(...vencimentos);
          diasVencimento = Math.floor((proximoVencimento - Date.now()) / (1000 * 60 * 60 * 24));
        }
      }

      const descricoesUnicas = [...new Set(
        descricoesData?.map((d: any) => d.descricoes?.nome).filter(Boolean) || []
      )];

      estoque.push({
        produto_id: produto.id,
        produto_nome: produto.nome,
        saldo_minimo: produto.saldo_minimo,
        entrada: totalEntrada,
        saida: totalSaida,
        saldo,
        dias_vencimento: diasVencimento,
        descricoes: descricoesUnicas,
        valor_compra: valorCompra,
        valor_industria: valorIndustria,
        valor_estoque: valorEstoque,
        valor_gasto: valorGasto,
      });
    }

    setItems(estoque);
    setLoading(false);
  }

  function getSituacao(saldo: number, minimo: number) {
    if (saldo === 0) {
      return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> Sem estoque</Badge>;
    } else if (saldo < minimo) {
      return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> Abaixo do mínimo</Badge>;
    }
    return <Badge variant="default" className="gap-1 bg-green-600"><CheckCircle className="h-3 w-3" /> OK</Badge>;
  }

  function getVencimentoBadge(dias: number | null) {
    if (dias === null) return "-";
    if (dias < 0) return <Badge variant="destructive">Vencido</Badge>;
    if (dias <= 30) return <Badge variant="destructive">{dias} dias</Badge>;
    if (dias <= 90) return <Badge className="bg-amber-500">{dias} dias</Badge>;
    return <Badge variant="default" className="bg-green-600">{dias} dias</Badge>;
  }

  if (loading) {
    return <div className="text-center py-8">Carregando estoque...</div>;
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Entrada</TableHead>
            <TableHead>Saída</TableHead>
            <TableHead>Saldo</TableHead>
            <TableHead>Situação</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Descrições</TableHead>
            <TableHead>Compra</TableHead>
            <TableHead>Indústria</TableHead>
            <TableHead>Valor Estoque</TableHead>
            <TableHead>Valor Gasto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center text-muted-foreground">
                Nenhum item no estoque
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.produto_id}>
                <TableCell className="font-medium">{item.produto_nome}</TableCell>
                <TableCell>{item.entrada.toFixed(2)}</TableCell>
                <TableCell>{item.saida.toFixed(2)}</TableCell>
                <TableCell className="font-bold">{item.saldo.toFixed(2)}</TableCell>
                <TableCell>{getSituacao(item.saldo, item.saldo_minimo)}</TableCell>
                <TableCell>{getVencimentoBadge(item.dias_vencimento)}</TableCell>
                <TableCell>
                  <div className="max-w-xs text-xs">
                    {item.descricoes.join(", ") || "-"}
                  </div>
                </TableCell>
                <TableCell>R$ {item.valor_compra.toFixed(2)}</TableCell>
                <TableCell>R$ {item.valor_industria.toFixed(2)}</TableCell>
                <TableCell>R$ {item.valor_estoque.toFixed(2)}</TableCell>
                <TableCell>R$ {item.valor_gasto.toFixed(2)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
