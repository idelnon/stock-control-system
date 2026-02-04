"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

export function RelatorioResult({ data }: { data: any }) {
  const { transacoes, totalEntradas, totalSaidas, saldo } = data;

  function handleExport() {
    const csvContent = [
      ["Data", "Tipo", "Fazenda", "Produto", "Descrição", "Aquisição", "Pagamento", "Quantidade", "Valor Unit.", "Valor Total", "Vencimento"],
      ...transacoes.map((t: any) => [
        new Date(t.data).toLocaleDateString("pt-BR"),
        t.tipos.nome,
        t.fazendas.nome,
        t.produtos.nome,
        t.descricoes.nome,
        t.aquisicoes.nome,
        t.pagamentos.nome,
        t.quantidade,
        t.valor_unitario,
        t.valor_total,
        t.vencimento ? new Date(t.vencimento).toLocaleDateString("pt-BR") : "",
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Entradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalEntradas.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Saídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalSaidas.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {saldo.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Transações ({transacoes.length})
        </h3>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fazenda</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transacoes.map((transacao: any) => (
              <TableRow key={transacao.id}>
                <TableCell>{new Date(transacao.data).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>{transacao.tipos.nome}</TableCell>
                <TableCell>{transacao.fazendas.nome}</TableCell>
                <TableCell>{transacao.produtos.nome}</TableCell>
                <TableCell>{transacao.descricoes.nome}</TableCell>
                <TableCell>{transacao.quantidade}</TableCell>
                <TableCell className={transacao.tipos.nome === "Entrada" ? "text-green-600" : "text-red-600"}>
                  R$ {transacao.valor_total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
