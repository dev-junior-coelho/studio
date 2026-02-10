"use client";
import { useAuth } from "@/contexts/auth-context";
import { BottomNavigation } from "@/components/bottom-navigation";
import { OfferSummaryBar } from "@/components/offer-summary-bar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { SupervisorGuard } from "@/components/supervisor-guard";

import { DesktopNavbar } from "@/components/desktop-navbar";

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
    <SupervisorGuard>
      <div className="flex w-full min-h-screen bg-background flex-col">
        {/* Navbar for Desktop (Sticky Top) */}
        <DesktopNavbar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative w-full min-w-0">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="lg:hidden">
            <OfferSummaryBar />
          </div>

          <main className="flex-1 pb-20 lg:pb-8 lg:px-0">
            {children}
          </main>

          {/* Mobile Bottom Nav */}
          <div className="lg:hidden">
            <BottomNavigation />
          </div>
        </div>
      </div>
    </SupervisorGuard>
  );
}
