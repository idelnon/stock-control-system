"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Calendar, Filter, BarChart3, TrendingUp } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function RelatoriosPage() {
  const [loading, setLoading] = useState(false);
  const [fazendas, setFazendas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [relatorioData, setRelatorioData] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    dataInicio: "",
    dataFim: "",
    fazenda: "all",
    produto: "all",
  });
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    loadOptions();
  }, []);

  async function loadOptions() {
    const [fazendasRes, produtosRes] = await Promise.all([
      supabase.from("fazendas").select("*").order("nome"),
      supabase.from("produtos").select("*").order("nome"),
    ]);
    setFazendas(fazendasRes.data || []);
    setProdutos(produtosRes.data || []);
  }

  async function gerarRelatorio() {
    setLoading(true);
    
    let query = supabase
      .from("transacoes")
      .select("*, tipos(nome), fazendas(nome), produtos(nome), descricoes(nome)");

    if (filters.dataInicio) {
      query = query.gte("data", filters.dataInicio);
    }
    if (filters.dataFim) {
      query = query.lte("data", filters.dataFim);
    }
    if (filters.fazenda !== "all") {
      query = query.eq("fazenda_id", filters.fazenda);
    }
    if (filters.produto !== "all") {
      query = query.eq("produto_id", filters.produto);
    }

    const { data, error } = await query.order("data", { ascending: false });

    if (error) {
      toast({
        title: "Erro ao gerar relatório",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setRelatorioData(data || []);
      toast({
        title: "Relatório gerado",
        description: `${data?.length || 0} transações encontradas`,
      });
    }
    setLoading(false);
  }

  function exportarCSV() {
    if (relatorioData.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Gere um relatório primeiro",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Data", "Tipo", "Fazenda", "Produto", "Descrição", "Quantidade", "Valor Unit.", "Valor Total"];
    const rows = relatorioData.map(t => [
      new Date(t.data).toLocaleDateString("pt-BR"),
      t.tipos?.nome || "-",
      t.fazendas?.nome || "-",
      t.produtos?.nome || "-",
      t.descricoes?.nome || "-",
      t.quantidade,
      `R$ ${parseFloat(t.valor_unitario).toFixed(2)}`,
      `R$ ${parseFloat(t.valor_total).toFixed(2)}`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportado com sucesso",
      description: "O relatório foi baixado em formato CSV",
    });
  }

  const chartDataByFazenda = relatorioData.reduce((acc: any, t) => {
    const fazenda = t.fazendas?.nome || 'Outros';
    if (!acc[fazenda]) {
      acc[fazenda] = { name: fazenda, Entradas: 0, Saidas: 0 };
    }
    const quantidade = parseFloat(t.quantidade || 0);
    if (t.tipos?.nome === 'Entrada') {
      acc[fazenda].Entradas += quantidade;
    } else {
      acc[fazenda].Saidas += quantidade;
    }
    return acc;
  }, {});

  const barChartData = Object.values(chartDataByFazenda);

  const pieChartData = relatorioData.reduce((acc: any, t) => {
    const tipo = t.tipos?.nome || 'Outros';
    const existing = acc.find((item: any) => item.name === tipo);
    const quantidade = parseFloat(t.quantidade || 0);
    if (existing) {
      existing.value += quantidade;
    } else {
      acc.push({ name: tipo, value: quantidade });
    }
    return acc;
  }, []);

  const lineChartData = relatorioData.reduce((acc: any, t) => {
    const date = new Date(t.data).toLocaleDateString('pt-BR');
    const existing = acc.find((item: any) => item.date === date);
    const valorTotal = parseFloat(t.valor_total || 0);
    if (existing) {
      existing.valor += valorTotal;
    } else {
      acc.push({ date, valor: valorTotal });
    }
    return acc;
  }, []).slice(0, 10).reverse();

  const COLORS = ['#10b981', '#ef4444', '#5b7ef7', '#ff8a00'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <Card className="border-0 shadow-md bg-white mb-6">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[#b855f7] to-[#9333ea] rounded-xl p-3 shadow-md">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-gray-900">Relatórios de Estoque</CardTitle>
                <CardDescription className="text-base text-gray-600 mt-1">
                  Visualização detalhada do inventário das fazendas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Filtros do Relatório</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label htmlFor="dataInicio" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data Início
                  </Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={filters.dataInicio}
                    onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="dataFim" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data Fim
                  </Label>
                  <Input
                    id="dataFim"
                    type="date"
                    value={filters.dataFim}
                    onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="fazenda">Fazenda</Label>
                  <Select value={filters.fazenda} onValueChange={(value) => setFilters({ ...filters, fazenda: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {fazendas.map((f) => (
                        <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="produto">Produto</Label>
                  <Select value={filters.produto} onValueChange={(value) => setFilters({ ...filters, produto: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {produtos.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={gerarRelatorio} 
                  disabled={loading}
                  className="bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857]"
                >
                  {loading ? "Gerando..." : "Gerar Relatório"}
                </Button>
                {relatorioData.length > 0 && (
                  <Button 
                    onClick={exportarCSV}
                    variant="outline"
                    className="border-green-600 text-green-700 hover:bg-green-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                )}
              </div>
            </div>

            {relatorioData.length > 0 && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <Card className="border-0 shadow-md">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Movimentação por Fazenda</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="Entradas" fill="#10b981" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="Saidas" fill="#ef4444" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <CardTitle className="text-lg">Distribuição por Tipo</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieChartData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-0 shadow-md mb-6">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-lg">Evolução de Valores</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={lineChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => `R$ ${value.toFixed(2)}`} />
                        <Legend />
                        <Line type="monotone" dataKey="valor" stroke="#10b981" strokeWidth={3} name="Valor Total" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Data</TableHead>
                        <TableHead className="font-semibold">Tipo</TableHead>
                        <TableHead className="font-semibold">Fazenda</TableHead>
                        <TableHead className="font-semibold">Produto</TableHead>
                        <TableHead className="font-semibold">Descrição</TableHead>
                        <TableHead className="font-semibold">Quantidade</TableHead>
                        <TableHead className="font-semibold">Valor Unit.</TableHead>
                        <TableHead className="font-semibold">Valor Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatorioData.map((transacao) => (
                        <TableRow key={transacao.id}>
                          <TableCell>{new Date(transacao.data).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transacao.tipos?.nome === 'Entrada' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {transacao.tipos?.nome}
                            </span>
                          </TableCell>
                          <TableCell>{transacao.fazendas?.nome}</TableCell>
                          <TableCell className="font-medium">{transacao.produtos?.nome}</TableCell>
                          <TableCell className="text-gray-600">{transacao.descricoes?.nome}</TableCell>
                          <TableCell className="font-semibold">{transacao.quantidade}</TableCell>
                          <TableCell>R$ {parseFloat(transacao.valor_unitario).toFixed(2)}</TableCell>
                          <TableCell className="font-semibold">R$ {parseFloat(transacao.valor_total).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
