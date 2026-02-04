import { Card, CardContent } from "@/components/ui/card";
import { Package, TrendingUp, AlertTriangle, Warehouse } from 'lucide-react';
import { createClient } from "@/lib/supabase/server";
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: produtos } = await supabase.from('produtos').select('*');
  const { data: fazendas } = await supabase.from('fazendas').select('*');
  const { data: transacoes } = await supabase
    .from('transacoes')
    .select('*, produtos(nome, saldo_minimo), fazendas(nome), tipos(nome)')
    .order('created_at', { ascending: false })
    .limit(10);

  const fazendaBarro = fazendas?.find(f => f.nome === 'Barro');
  const fazendaBarroca = fazendas?.find(f => f.nome === 'Barroca');

  const { data: transacoesBarro } = await supabase
    .from('transacoes')
    .select('quantidade, tipos(nome)')
    .eq('fazenda_id', fazendaBarro?.id || '');

  const { data: transacoesBarroca } = await supabase
    .from('transacoes')
    .select('quantidade, tipos(nome)')
    .eq('fazenda_id', fazendaBarroca?.id || '');

  const totalBarro = transacoesBarro?.reduce((acc, t) => {
    const quantidade = parseFloat(t.quantidade?.toString() || '0');
    return acc + (t.tipos?.nome === 'Entrada' ? quantidade : -quantidade);
  }, 0) || 0;

  const totalBarroca = transacoesBarroca?.reduce((acc, t) => {
    const quantidade = parseFloat(t.quantidade?.toString() || '0');
    return acc + (t.tipos?.nome === 'Entrada' ? quantidade : -quantidade);
  }, 0) || 0;

  const produtoStocks = new Map<string, number>();
  
  transacoes?.forEach(t => {
    const produtoId = t.produtos?.id;
    const quantidade = parseFloat(t.quantidade?.toString() || '0');
    const tipoNome = t.tipos?.nome;
    
    if (!produtoStocks.has(produtoId)) {
      produtoStocks.set(produtoId, 0);
    }
    
    const currentStock = produtoStocks.get(produtoId) || 0;
    produtoStocks.set(
      produtoId,
      currentStock + (tipoNome === 'Entrada' ? quantidade : -quantidade)
    );
  });

  let produtosAbaixoMinimo = 0;
  produtos?.forEach(p => {
    const estoque = produtoStocks.get(p.id) || 0;
    if (estoque < p.saldo_minimo) {
      produtosAbaixoMinimo++;
    }
  });

  const totalProdutos = produtos?.length || 0;

  const stats = [
    {
      title: "Total de Produtos",
      value: totalProdutos.toString(),
      description: "Produtos cadastrados",
      icon: Package,
      iconBg: "bg-[#10b981]",
      cardBg: "bg-[#d1fae5]",
      href: "/produtos"
    },
    {
      title: "Estoque Barro",
      value: Math.round(Math.max(0, totalBarro)).toString(),
      description: "Unidades totais",
      icon: TrendingUp,
      iconBg: "bg-[#5b7ef7]",
      cardBg: "bg-[#dbeafe]",
      href: "/relatorios"
    },
    {
      title: "Estoque Barroca",
      value: Math.round(Math.max(0, totalBarroca)).toString(),
      description: "Unidades totais",
      icon: TrendingUp,
      iconBg: "bg-[#b855f7]",
      cardBg: "bg-[#f3e8ff]",
      href: "/relatorios"
    },
    {
      title: "Estoque Baixo",
      value: produtosAbaixoMinimo.toString(),
      description: "Produtos em alerta",
      icon: AlertTriangle,
      iconBg: "bg-[#ff8a00]",
      cardBg: "bg-[#ffedd5]",
      href: "/produtos"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Visão geral do estoque das fazendas</p>
            </div>
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
              Sistema Ativo
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={index} href={stat.href}>
                <Card className={`border-0 shadow-md ${stat.cardBg} hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                      </div>
                      <div className={`${stat.iconBg} rounded-xl p-3 shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Link href="/produtos">
            <Card className="border-0 shadow-md bg-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#10b981] rounded-xl p-2">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Produtos em Estoque</h3>
                </div>
                {produtos && produtos.length > 0 ? (
                  <div className="space-y-3">
                    {produtos.slice(0, 5).map((produto) => (
                      <div key={produto.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{produto.nome}</span>
                        <span className="text-sm text-gray-500">Mín: {produto.saldo_minimo}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 text-gray-400">
                    <div className="text-center">
                      <Warehouse className="h-16 w-16 mx-auto mb-2 opacity-20" />
                      <p>Nenhum produto cadastrado</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </Link>

          <Link href="/transacoes">
            <Card className="border-0 shadow-md bg-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#5b7ef7] rounded-xl p-2">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Transações Recentes</h3>
                </div>
                {transacoes && transacoes.length > 0 ? (
                  <div className="space-y-3">
                    {transacoes.slice(0, 5).map((transacao) => (
                      <div key={transacao.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{transacao.produtos?.nome}</p>
                          <p className="text-xs text-gray-500">{transacao.fazendas?.nome} - {transacao.tipos?.nome}</p>
                        </div>
                        <span className="text-sm font-medium text-gray-600">{transacao.quantidade}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 text-gray-400">
                    <div className="text-center">
                      <Package className="h-16 w-16 mx-auto mb-2 opacity-20" />
                      <p>Nenhuma transação registrada</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
