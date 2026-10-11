import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FolderKanban,
  CheckSquare,
  Calendar,
  UserCheck,
  CheckCircle2,
  Receipt,
  BarChart3,
  Settings,
  Camera,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../utils/formatters';
import { lockBodyScroll, unlockBodyScroll } from '../common/Modal';

const WORKSPACE_NAV = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients', path: '/clients', icon: Users },
  { name: 'Events & Bookings', path: '/events', icon: CalendarDays },
  { name: 'Projects & Workspace', path: '/projects', icon: FolderKanban },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
];

const OPERATIONS_NAV = [
  { name: 'Team', path: '/team', icon: UserCheck },
  { name: 'Deliverables & Approvals', path: '/deliverables', icon: CheckCircle2 },
  { name: 'Payments & Invoices', path: '/payments', icon: Receipt },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) {
  const location = useLocation();

  // Manage mobile drawer scroll lock & Escape listener
  useEffect(() => {
    if (!isMobileOpen) return;
    lockBodyScroll();

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onCloseMobile();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      unlockBodyScroll();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileOpen, onCloseMobile]);

  const renderNavGroup = (title, items) => (
    <div className="py-2">
      {!isCollapsed && (
        <div className="px-4 mb-2 text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
          {title}
        </div>
      )}
      <ul className="space-y-1 px-2.5">
        {items.map((item) => {
          const Icon = item.icon;
          // check if path matches current route or sub-route
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onCloseMobile}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive: navActive }) => {
                  const active = isActive || navActive;
                  return cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                    active
                      ? 'bg-terracotta text-white shadow-sm'
                      : 'text-charcoal-700 hover:text-charcoal hover:bg-ivory-200/90'
                  );
                }}
              >
                {({ isActive: navActive }) => {
                  const active = isActive || navActive;
                  return (
                    <>
                      <Icon
                        className={cn(
                          'w-4 h-4 flex-shrink-0 transition-colors',
                          active ? 'text-white' : 'text-charcoal-500 group-hover:text-charcoal'
                        )}
                      />
                      {!isCollapsed && (
                        <span className="truncate flex-1">{item.name}</span>
                      )}
                      {/* Sub-indicator if collapsed */}
                      {isCollapsed && active && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-terracotta rounded-r-full" />
                      )}
                    </>
                  );
                }}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface border-r border-border select-none">
      {/* Studio Brand Header */}
      <div className="p-4 border-b border-border flex items-center justify-between min-h-[64px]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-terracotta flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Camera className="w-5 h-5 stroke-[2]" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 truncate">
              <span className="editorial-heading text-lg font-bold text-charcoal tracking-tight block leading-tight">
                StudioFlow
              </span>
              <span className="text-[11px] font-medium text-terracotta uppercase tracking-wider block">
                Photography Studio OS
              </span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal hover:bg-ivory-200"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3">
        {renderNavGroup('Workspace', WORKSPACE_NAV)}
        <div className="mx-4 border-t border-border/70" />
        {renderNavGroup('Studio Operations', OPERATIONS_NAV)}
      </div>

      {/* Bottom Collapsible Toggle (Desktop) */}
      <div className="p-3 border-t border-border hidden md:flex items-center justify-between">
        {!isCollapsed && (
          <div className="px-2 text-xs text-charcoal-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sage inline-block" />
            <span>Interactive Demo</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className={cn(
            'p-2 rounded-lg text-charcoal-500 hover:text-charcoal hover:bg-ivory-200 transition-colors',
            isCollapsed && 'w-full flex justify-center'
          )}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          'hidden md:block flex-shrink-0 transition-all duration-200 z-30',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className={cn('fixed top-0 bottom-0 left-0 transition-all duration-200', isCollapsed ? 'w-20' : 'w-64')}>
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Studio navigation menu"
          className="fixed inset-0 z-50 md:hidden"
        >
          <div
            className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-surface shadow-modal z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
