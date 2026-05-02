"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, ShieldCheck, LayoutDashboard, Activity, Database, BookOpen, Menu, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentSection =
    pathname === "/admin"
      ? "Visão geral"
      : pathname === "/admin/history"
        ? "Histórico"
        : pathname === "/admin/agents"
          ? "Equipe"
          : pathname === "/admin/products"
            ? "Produtos"
            : pathname === "/admin/procedures"
              ? "Procedimentos"
              : "Admin";

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "supervisor") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "supervisor") {
    return <div className="flex h-screen items-center justify-center">Acesso restrito. Redirecionando...</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card shadow-sm sticky top-0 h-screen">
        <SidebarContent user={user} logout={logout} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 border-none shadow-2xl" onOpenAutoFocus={(e) => e.preventDefault()}>
                  <SidebarContent user={user} logout={logout} isMobile onLinkClick={() => setIsMenuOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-400">
              <span>Páginas</span>
              <span>/</span>
              <span className="text-foreground font-semibold">{currentSection}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-bold text-primary hover:underline px-3 py-1 bg-primary/5 rounded-full">
              Ir para o App
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Sistema online</span>
            </div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ user, logout, isMobile, onLinkClick }: { user: any; logout: any; isMobile?: boolean; onLinkClick?: () => void }) {
  return (
    <>
      <div className="p-6 border-b flex items-center gap-3">
        <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
          <ShieldCheck className="text-white h-5 w-5" />
        </div>
        <span className="font-bold text-lg tracking-tight text-slate-800">Admin Studio</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2 mb-2">Principal</div>
        <SidebarLink href="/admin" icon={LayoutDashboard} label="Dashboard" onClick={onLinkClick} />
        <SidebarLink href="/admin/history" icon={Activity} label="Vendas em Tempo Real" onClick={onLinkClick} />
        <SidebarLink href="/admin/agents" icon={Users} label="Gestão de Equipe" onClick={onLinkClick} />

        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2 mt-6 mb-2">Dados</div>
        <SidebarLink href="/admin/products" icon={Database} label="Produtos" onClick={onLinkClick} />
        <SidebarLink href="/admin/procedures" icon={BookOpen} label="Procedimentos" onClick={onLinkClick} />
      </nav>

      <div className="p-4 border-t bg-muted/30">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
            {user.nome?.substring(0, 1) || "S"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-slate-800 truncate">{user.nome || "Supervisor"}</p>
            <p className="text-[10px] text-slate-500 font-medium">Conta Master</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => { logout(); onLinkClick?.(); }} className="w-full text-xs h-8 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all font-semibold">
          <LogOut className="h-3 w-3 mr-2" />
          Encerrar Sessão
        </Button>
      </div>
    </>
  );
}

function SidebarLink({ href, icon: Icon, label, onClick }: { href: string; icon: any; label: string; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary border border-primary/20"
          : "text-slate-600 hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-slate-400")} />
      {label}
    </Link>
  );
}
