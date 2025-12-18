"use client";
import { useAuth } from "@/contexts/auth-context";
import { BottomNavigation } from "@/components/bottom-navigation";
import { OfferSummaryBar } from "@/components/offer-summary-bar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role === 'supervisor') {
        router.push('/admin');
      }
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="flex h-screen w-full items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="relative mx-auto flex w-full max-w-lg flex-col bg-background min-h-screen">
      <OfferSummaryBar />
      <main className="flex-1 pb-20">
        {children}
      </main>
      <BottomNavigation />
    </div>

  );
}
