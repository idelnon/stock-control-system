"use client"

import { Home, Settings, Package, ArrowLeftRight, LogOut, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Cadastro",
      icon: Settings,
      href: "/cadastro",
    },
    {
      title: "Produtos",
      icon: Package,
      href: "/produtos",
    },
    {
      title: "Transações",
      icon: ArrowLeftRight,
      href: "/transacoes",
    },
    {
      title: "Relatórios",
      icon: FileText,
      href: "/relatorios",
    },
  ]

  return (
    <div className="flex h-screen w-64 flex-col bg-gradient-to-b from-green-700 to-green-800 text-white shadow-xl">
      <div className="flex items-center gap-3 p-6 border-b border-green-600">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 p-2">
          <img src="/logo-nova-vida.png" alt="Pecuária Nova Vida" className="w-full h-full object-contain rounded-lg" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Pecuária</h2>
          <p className="text-sm text-green-100">Nova Vida</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                isActive ? "bg-white/20 text-white shadow-lg" : "text-green-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-green-600 p-4 space-y-3">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-green-100 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Button>
        <div className="text-center text-xs text-green-200 pt-2 border-t border-green-600">
          <p className="font-medium">Desenvolvido pela</p>
          <p className="font-bold">Equipe de TI Itabio</p>
        </div>
      </div>
    </div>
  )
}
