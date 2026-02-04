"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings } from 'lucide-react';
import { TiposTab } from "@/components/cadastros/tipos-tab";
import { AquisicoesTab } from "@/components/cadastros/aquisicoes-tab";
import { PagamentosTab } from "@/components/cadastros/pagamentos-tab";
import { FazendasTab } from "@/components/cadastros/fazendas-tab";
import { ProdutosTab } from "@/components/cadastros/produtos-tab";
import { DescricoesTab } from "@/components/cadastros/descricoes-tab";

export default function CadastrosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Menu Principal
            </Button>
          </Link>
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-[#5b7ef7] rounded-xl p-2.5">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl">Cadastro Mestre</CardTitle>
                <CardDescription className="text-base">
                  Base de dados para produtos, categorias e configurações
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tipos" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="tipos">Tipos</TabsTrigger>
                <TabsTrigger value="aquisicoes">Aquisições</TabsTrigger>
                <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
                <TabsTrigger value="fazendas">Fazendas</TabsTrigger>
                <TabsTrigger value="produtos">Produtos</TabsTrigger>
                <TabsTrigger value="descricoes">Descrições</TabsTrigger>
              </TabsList>

              <TabsContent value="tipos">
                <TiposTab />
              </TabsContent>

              <TabsContent value="aquisicoes">
                <AquisicoesTab />
              </TabsContent>

              <TabsContent value="pagamentos">
                <PagamentosTab />
              </TabsContent>

              <TabsContent value="fazendas">
                <FazendasTab />
              </TabsContent>

              <TabsContent value="produtos">
                <ProdutosTab />
              </TabsContent>

              <TabsContent value="descricoes">
                <DescricoesTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
