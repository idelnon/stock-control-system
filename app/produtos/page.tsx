"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Package, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Produto = {
  id: string
  nome: string
  descricao: string | null
  saldo_minimo: number
  created_at: string
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState<Produto | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    saldo_minimo: "5",
  })
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadProdutos()
  }, [])

  async function loadProdutos() {
    setLoading(true)
    const { data, error } = await supabase.from("produtos").select("*").order("nome")

    if (error) {
      toast({
        title: "Erro ao carregar produtos",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setProdutos(data || [])
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const payload = {
      ...formData,
      saldo_minimo: Number.parseInt(formData.saldo_minimo),
    }

    let error
    if (editData) {
      ;({ error } = await supabase.from("produtos").update(payload).eq("id", editData.id))
    } else {
      ;({ error } = await supabase.from("produtos").insert([payload]))
    }

    if (error) {
      toast({
        title: "Erro ao salvar produto",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: editData ? "Produto atualizado" : "Produto criado",
        description: editData ? "Produto atualizado com sucesso" : "Novo produto adicionado",
      })
      setOpen(false)
      resetForm()
      loadProdutos()
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return

    const { error } = await supabase.from("produtos").delete().eq("id", id)

    if (error) {
      toast({
        title: "Erro ao deletar produto",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Produto deletado",
        description: "Produto deletado com sucesso",
      })
      loadProdutos()
    }
  }

  function handleEdit(produto: Produto) {
    setEditData(produto)
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao || "",
      saldo_minimo: produto.saldo_minimo.toString(),
    })
    setOpen(true)
  }

  function resetForm() {
    setFormData({
      nome: "",
      descricao: "",
      saldo_minimo: "5",
    })
    setEditData(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <Card className="border-0 shadow-md bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#10b981] rounded-xl p-2.5">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl">Produtos</CardTitle>
                  <CardDescription className="text-base">Gerencie o catálogo de produtos das fazendas</CardDescription>
                </div>
              </div>
              <Dialog
                open={open}
                onOpenChange={(o) => {
                  setOpen(o)
                  if (!o) resetForm()
                }}
              >
                <DialogTrigger asChild>
                  <Button className="bg-[#10b981] hover:bg-[#059669]">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editData ? "Editar Produto" : "Novo Produto"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome do Produto</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Ex: Ração para equinos, Diesel S10, etc."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        placeholder="Detalhes adicionais sobre o produto..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="saldo_minimo">Estoque Mínimo</Label>
                      <Input
                        id="saldo_minimo"
                        type="number"
                        value={formData.saldo_minimo}
                        onChange={(e) => setFormData({ ...formData, saldo_minimo: e.target.value })}
                        placeholder="Quantidade mínima em estoque"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-[#10b981] hover:bg-[#059669]">
                      {editData ? "Atualizar" : "Criar"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Nome</TableHead>
                      <TableHead className="font-semibold">Descrição</TableHead>
                      <TableHead className="font-semibold">Estoque Mínimo</TableHead>
                      <TableHead className="font-semibold text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                          Nenhum produto cadastrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      produtos.map((produto) => (
                        <TableRow key={produto.id}>
                          <TableCell className="font-medium">{produto.nome}</TableCell>
                          <TableCell className="text-gray-600 max-w-xs truncate">
                            {produto.descricao || <span className="text-gray-400 italic">Sem descrição</span>}
                          </TableCell>
                          <TableCell>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              {produto.saldo_minimo} unidades
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(produto)}>
                                <Pencil className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(produto.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
