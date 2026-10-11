import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GlobalSearchModal } from '../search/GlobalSearchModal';
import { cn } from '../../utils/formatters';

export function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global keyboard shortcut to toggle search modal (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-ivory text-charcoal flex flex-col md:flex-row antialiased selection:bg-terracotta-subtle selection:text-terracotta-dark">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-200">
        <Header
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 w-full max-w-[1600px]">
          <Outlet />
        </main>
      </div>

      {/* Global Search Command Palette */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
