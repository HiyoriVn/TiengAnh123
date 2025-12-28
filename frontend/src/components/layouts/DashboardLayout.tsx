"use client";

import { ReactNode } from "react";
import DashboardSidebar from "@/components/navigation/DashboardSidebar";
import DashboardTopBar from "@/components/navigation/DashboardTopBar";

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * DashboardLayout - Wrapper layout cho tất cả dashboard pages
 * Bao gồm Sidebar + TopBar + Content area
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark font-display h-screen flex overflow-hidden transition-colors duration-200">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Top Bar */}
        <DashboardTopBar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth bg-background-light dark:bg-background-dark">
          {children}
        </main>
      </div>
    </div>
  );
}
