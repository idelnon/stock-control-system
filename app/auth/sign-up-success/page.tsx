import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Tractor } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg">
              <Tractor className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Fazendas</h1>
            <p className="text-sm text-gray-600">Barro & Barroca</p>
          </div>
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-center">
                Conta criada com sucesso!
              </CardTitle>
              <CardDescription className="text-center">
                Verifique seu email para confirmar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center mb-6">
                Enviamos um email de confirmação. Por favor, verifique sua caixa
                de entrada e confirme sua conta antes de fazer login.
              </p>
              <Button asChild className="w-full h-11">
                <Link href="/auth/login">Ir para Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
