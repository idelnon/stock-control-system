"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type FormData = {
  data: string;
  tipo_id: string;
  aquisicao_id: string;
  pagamento_id: string;
  fazenda_id: string;
  produto_id: string;
  descricao_id: string;
  quantidade: string;
  valor_unitario: string;
  vencimento: string;
};

type Option = {
  id: string;
  nome: string;
};

export function TransacaoForm({ onSuccess, editData }: { onSuccess: () => void; editData?: any }) {
  const [loading, setLoading] = useState(false);
  const [tipos, setTipos] = useState<Option[]>([]);
  const [aquisicoes, setAquisicoes] = useState<Option[]>([]);
  const [pagamentos, setPagamentos] = useState<Option[]>([]);
  const [fazendas, setFazendas] = useState<Option[]>([]);
  const [produtos, setProdutos] = useState<Option[]>([]);
  const [descricoes, setDescricoes] = useState<Option[]>([]);
  const { toast } = useToast();
  const supabase = createClient();

  const [formData, setFormData] = useState<FormData>({
    data: new Date().toISOString().split("T")[0],
    tipo_id: "",
    aquisicao_id: "",
    pagamento_id: "",
    fazenda_id: "",
    produto_id: "",
    descricao_id: "",
    quantidade: "",
    valor_unitario: "",
    vencimento: "",
  });

  useEffect(() => {
    loadOptions();
    if (editData) {
      setFormData({
        data: editData.data,
        tipo_id: editData.tipo_id,
        aquisicao_id: editData.aquisicao_id,
        pagamento_id: editData.pagamento_id,
        fazenda_id: editData.fazenda_id,
        produto_id: editData.produto_id,
        descricao_id: editData.descricao_id,
        quantidade: editData.quantidade.toString(),
        valor_unitario: editData.valor_unitario.toString(),
        vencimento: editData.vencimento || "",
      });
    }
  }, [editData]);

  async function loadOptions() {
    const [tiposRes, aquisicoesRes, pagamentosRes, fazendasRes, produtosRes, descricoesRes] = 
      await Promise.all([
        supabase.from("tipos").select("id, nome").order("nome"),
        supabase.from("aquisicoes").select("id, nome").order("nome"),
        supabase.from("pagamentos").select("id, nome").order("nome"),
        supabase.from("fazendas").select("id, nome").order("nome"),
        supabase.from("produtos").select("id, nome").order("nome"),
        supabase.from("descricoes").select("id, nome").order("nome"),
      ]);

    setTipos(tiposRes.data || []);
    setAquisicoes(aquisicoesRes.data || []);
    setPagamentos(pagamentosRes.data || []);
    setFazendas(fazendasRes.data || []);
    setProdutos(produtosRes.data || []);
    setDescricoes(descricoesRes.data || []);
  }

  const valorTotal = parseFloat(formData.quantidade || "0") * parseFloat(formData.valor_unitario || "0");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const dataToSave = {
      ...formData,
      quantidade: parseFloat(formData.quantidade),
      valor_unitario: parseFloat(formData.valor_unitario),
      valor_total: valorTotal,
      vencimento: formData.vencimento || null,
    };

    let error;
    if (editData) {
      const result = await supabase
        .from("transacoes")
        .update(dataToSave)
        .eq("id", editData.id);
      error = result.error;
    } else {
      const result = await supabase
        .from("transacoes")
        .insert(dataToSave);
      error = result.error;
    }

    if (error) {
      toast({
        title: "Erro ao salvar transação",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: editData ? "Transação atualizada" : "Transação criada",
        description: editData ? "Transação atualizada com sucesso" : "Transação criada com sucesso",
      });
      onSuccess();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="data">Data</Label>
          <Input
            id="data"
            type="date"
            value={formData.data}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="tipo">Tipo</Label>
          <Select value={formData.tipo_id} onValueChange={(value) => setFormData({ ...formData, tipo_id: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {tipos.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id}>{tipo.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="aquisicao">Aquisição</Label>
          <Select value={formData.aquisicao_id} onValueChange={(value) => setFormData({ ...formData, aquisicao_id: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {aquisicoes.map((aquisicao) => (
                <SelectItem key={aquisicao.id} value={aquisicao.id}>{aquisicao.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="pagamento">Pagamento</Label>
          <Select value={formData.pagamento_id} onValueChange={(value) => setFormData({ ...formData, pagamento_id: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {pagamentos.map((pagamento) => (
                <SelectItem key={pagamento.id} value={pagamento.id}>{pagamento.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fazenda">Fazenda</Label>
          <Select value={formData.fazenda_id} onValueChange={(value) => setFormData({ ...formData, fazenda_id: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {fazendas.map((fazenda) => (
                <SelectItem key={fazenda.id} value={fazenda.id}>{fazenda.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="produto">Produto</Label>
          <Select value={formData.produto_id} onValueChange={(value) => setFormData({ ...formData, produto_id: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {produtos.map((produto) => (
                <SelectItem key={produto.id} value={produto.id}>{produto.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Select value={formData.descricao_id} onValueChange={(value) => setFormData({ ...formData, descricao_id: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {descricoes.map((descricao) => (
                <SelectItem key={descricao.id} value={descricao.id}>{descricao.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="quantidade">Quantidade</Label>
          <Input
            id="quantidade"
            type="number"
            step="0.01"
            value={formData.quantidade}
            onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="valor_unitario">Valor Unitário (R$)</Label>
          <Input
            id="valor_unitario"
            type="number"
            step="0.01"
            value={formData.valor_unitario}
            onChange={(e) => setFormData({ ...formData, valor_unitario: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="valor_total">Valor Total (R$)</Label>
          <Input
            id="valor_total"
            type="text"
            value={valorTotal.toFixed(2)}
            disabled
            className="bg-muted"
          />
        </div>

        <div>
          <Label htmlFor="vencimento">Vencimento</Label>
          <Input
            id="vencimento"
            type="date"
            value={formData.vencimento}
            onChange={(e) => setFormData({ ...formData, vencimento: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : editData ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  );
}
