"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TiposTab } from "@/components/cadastro/tipos-tab";
import { AquisicoesTab } from "@/components/cadastro/aquisicoes-tab";
import { PagamentosTab } from "@/components/cadastro/pagamentos-tab";
import { FazendasTab } from "@/components/cadastro/fazendas-tab";
import { ProdutosTab } from "@/components/cadastro/produtos-tab";
import { DescricoesTab } from "@/components/cadastro/descricoes-tab";

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#10b981] rounded-xl p-2">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Cadastro Mestre</h1>
          </div>
          <p className="text-gray-600">Base de dados para produtos, categorias e configurações</p>
        </div>

        <Tabs defaultValue="tipos" className="w-full">
          <TabsList className="grid w-full grid-cols-6 h-auto bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
            <TabsTrigger value="tipos" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white rounded-lg">
              Tipos
            </TabsTrigger>
            <TabsTrigger value="aquisicoes" className="data-[state=active]:bg-[#5b7ef7] data-[state=active]:text-white rounded-lg">
              Aquisições
            </TabsTrigger>
            <TabsTrigger value="pagamentos" className="data-[state=active]:bg-[#b855f7] data-[state=active]:text-white rounded-lg">
              Pagamentos
            </TabsTrigger>
            <TabsTrigger value="fazendas" className="data-[state=active]:bg-[#ff8a00] data-[state=active]:text-white rounded-lg">
              Fazendas
            </TabsTrigger>
            <TabsTrigger value="produtos" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white rounded-lg">
              Produtos
            </TabsTrigger>
            <TabsTrigger value="descricoes" className="data-[state=active]:bg-[#5b7ef7] data-[state=active]:text-white rounded-lg">
              Descrições
            </TabsTrigger>
          </TabsList>

          <Card className="mt-6 border-0 shadow-md bg-white">
            <CardContent className="p-6">
              <TabsContent value="tipos" className="mt-0">
                <TiposTab />
              </TabsContent>
              <TabsContent value="aquisicoes" className="mt-0">
                <AquisicoesTab />
              </TabsContent>
              <TabsContent value="pagamentos" className="mt-0">
                <PagamentosTab />
              </TabsContent>
              <TabsContent value="fazendas" className="mt-0">
                <FazendasTab />
              </TabsContent>
              <TabsContent value="produtos" className="mt-0">
                <ProdutosTab />
              </TabsContent>
              <TabsContent value="descricoes" className="mt-0">
                <DescricoesTab />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
