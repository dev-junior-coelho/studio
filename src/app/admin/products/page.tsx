"use client";

import { useState } from "react";
import { mockProdutos } from "@/lib/mock-data";
import type { Produto, ProductType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const productTypes: ProductType[] = ["Móvel", "Banda Larga", "TV", "Fixo"];

function ProductForm({ product, onSave, onDone }: { product?: Produto, onSave: (product: Produto) => void, onDone: () => void }) {
  const [formData, setFormData] = useState<Produto>(product || { id: '', nome: '', tipo: 'Móvel', preco_mensal: 0, beneficios: [], fidelidade: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do Produto</Label>
        <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo</Label>
          <Select name="tipo" value={formData.tipo} onValueChange={(value: ProductType) => setFormData(p => ({...p, tipo: value}))}>
            <SelectTrigger id="tipo">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {productTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="preco_mensal">Preço Mensal</Label>
          <Input id="preco_mensal" name="preco_mensal" type="number" value={formData.preco_mensal} onChange={handleChange} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="beneficios">Benefícios (separados por vírgula)</Label>
        <Input id="beneficios" name="beneficios" value={Array.isArray(formData.beneficios) ? formData.beneficios.join(', ') : ''} onChange={(e) => setFormData(p => ({...p, beneficios: e.target.value.split(',').map(b => b.trim())}))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fidelidade">Fidelidade</Label>
        <Input id="fidelidade" name="fidelidade" value={formData.fidelidade} onChange={handleChange} />
      </div>
       <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">Cancelar</Button>
        </DialogClose>
        <Button type="submit">Salvar</Button>
      </DialogFooter>
    </form>
  )
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Produto[]>(mockProdutos);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | undefined>(undefined);
  const { toast } = useToast();

  const handleSave = (product: Produto) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === product.id ? product : p));
      toast({ title: "Produto atualizado!", description: `${product.nome} foi atualizado com sucesso.` });
    } else {
      const newProduct = { ...product, id: `prod${Date.now()}`};
      setProducts([...products, newProduct]);
      toast({ title: "Produto criado!", description: `${product.nome} foi adicionado com sucesso.` });
    }
    setEditingProduct(undefined);
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({ title: "Produto removido!", variant: "destructive" });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
         <div>
          <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
          <Link href="/admin" className="text-sm text-primary hover:underline">&larr; Voltar ao Painel</Link>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(undefined)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            </DialogHeader>
            <ProductForm product={editingProduct} onSave={handleSave} onDone={() => setFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.nome}</TableCell>
                <TableCell>{product.tipo}</TableCell>
                <TableCell>{product.preco_mensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" onClick={() => { setEditingProduct(product); setFormOpen(true);}}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso irá deletar permanentemente o produto.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(product.id)}>Deletar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
