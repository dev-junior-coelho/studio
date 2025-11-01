import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Painel do Supervisor</h2>
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Package /> Gerenciar Produtos</CardTitle>
                    <CardDescription>Adicione, edite ou remova produtos do portfólio de ofertas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/admin/products" passHref>
                        <Button className="w-full">
                            Acessar Produtos <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText /> Gerenciar Procedimentos</CardTitle>
                    <CardDescription>Crie, atualize ou delete procedimentos do Guia Rápido.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/admin/procedures" passHref>
                        <Button className="w-full">
                            Acessar Procedimentos <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
