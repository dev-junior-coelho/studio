"use client";

import { useState } from "react";
import { mockProcedimentos } from "@/lib/mock-data";
import type { Procedimento, ProcedureCategory } from "@/lib/types";
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

const procedureCategories: ProcedureCategory[] = ["Financeiro", "Técnico", "Cadastro"];

function ProcedureForm({ procedure, onSave, onDone }: { procedure?: Procedimento, onSave: (procedure: Procedimento) => void, onDone: () => void }) {
  const [formData, setFormData] = useState<Procedimento>(procedure || { id: '', titulo: '', categoria: 'Financeiro', tags: [], conteudo: '' });

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
        <Label htmlFor="titulo">Título</Label>
        <Input id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="categoria">Categoria</Label>
        <Select name="categoria" value={formData.categoria} onValueChange={(value: ProcedureCategory) => setFormData(p => ({...p, categoria: value}))}>
          <SelectTrigger id="categoria">
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {procedureCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
        <Input id="tags" name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onChange={(e) => setFormData(p => ({...p, tags: e.target.value.split(',').map(b => b.trim())}))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="conteudo">Conteúdo (Passo-a-passo)</Label>
        <Textarea id="conteudo" name="conteudo" value={formData.conteudo} onChange={handleChange} required rows={6}/>
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

export default function AdminProceduresPage() {
  const [procedures, setProcedures] = useState<Procedimento[]>(mockProcedimentos);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<Procedimento | undefined>(undefined);
  const { toast } = useToast();

  const handleSave = (procedure: Procedimento) => {
    if (editingProcedure) {
      setProcedures(procedures.map(p => p.id === procedure.id ? procedure : p));
      toast({ title: "Procedimento atualizado!", description: `"${procedure.titulo}" foi atualizado.` });
    } else {
      const newProcedure = { ...procedure, id: `proc${Date.now()}`};
      setProcedures([...procedures, newProcedure]);
      toast({ title: "Procedimento criado!", description: `"${procedure.titulo}" foi adicionado.` });
    }
    setEditingProcedure(undefined);
  };

  const handleDelete = (procedureId: string) => {
    setProcedures(procedures.filter(p => p.id !== procedureId));
    toast({ title: "Procedimento removido!", variant: "destructive" });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Procedimentos</h2>
          <Link href="/admin" className="text-sm text-primary hover:underline">&larr; Voltar ao Painel</Link>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProcedure(undefined)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Procedimento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProcedure ? "Editar Procedimento" : "Novo Procedimento"}</DialogTitle>
            </DialogHeader>
            <ProcedureForm procedure={editingProcedure} onSave={handleSave} onDone={() => setFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {procedures.map((procedure) => (
              <TableRow key={procedure.id}>
                <TableCell className="font-medium">{procedure.titulo}</TableCell>
                <TableCell>{procedure.categoria}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" onClick={() => { setEditingProcedure(procedure); setFormOpen(true);}}>
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
                          Esta ação não pode ser desfeita. Isso irá deletar permanentemente o procedimento.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(procedure.id)}>Deletar</AlertDialogAction>
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
