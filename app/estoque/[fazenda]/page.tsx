import { redirect } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { EstoqueTable } from "@/components/estoque/estoque-table";

export default async function EstoquePage({
  params,
}: {
  params: Promise<{ fazenda: string }>;
}) {
  const { fazenda } = await params;
  
  if (fazenda !== "barro" && fazenda !== "barroca") {
    redirect("/");
  }

  const fazendaNome = fazenda.charAt(0).toUpperCase() + fazenda.slice(1);

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

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Estoque Fazenda {fazendaNome}</CardTitle>
            <CardDescription>
              Visualização consolidada do estoque da fazenda {fazendaNome}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EstoqueTable fazenda={fazenda} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
