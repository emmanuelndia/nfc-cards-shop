"use client";

import AppSidebar from "@/components/layout/AppSidebar"; // CHANGÉ: Supprimez les accolades
import AppHeader from "@/components/layout/AppHeader";   // CHANGÉ: Supprimez les accolades et renommez
import Backdrop from "@/components/layout/Backdrop";
import { useSidebar } from "@/context/SidebarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />
      <div 
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader /> {/* CHANGÉ: Renommé de Header à AppHeader */}
        <main className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}