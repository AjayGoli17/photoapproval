import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Plus,
  RefreshCw,
  User,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Camera,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  Trash2,
} from 'lucide-react';
import { useStudioData } from '../../context/StudioDataContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ClientModal } from '../modals/ClientModal';
import { EventModal } from '../modals/EventModal';
import { TaskModal } from '../modals/TaskModal';
import { formatRelativeTime } from '../../utils/formatters';

export function Header({ onOpenMobileNav, onOpenSearch }) {
  const { activityLog, resetDemoData, settings, clearActivityLog } = useStudioData();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isClearActivityOpen, setIsClearActivityOpen] = useState(false);

  // Quick Action Modal states
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const activityRef = useRef(null);
  const profileRef = useRef(null);
  const actionsRef = useRef(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (activityRef.current && !activityRef.current.contains(event.target)) {
        setIsActivityOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setIsActionsOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsActivityOpen(false);
        setIsProfileOpen(false);
        setIsActionsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleResetData = () => {
    setIsResetting(true);
    setTimeout(() => {
      resetDemoData();
      setIsResetting(false);
      setIsResetConfirmOpen(false);
      setIsProfileOpen(false);
      toast.success('Demo Data Reset', 'Sample studio records have been restored to default state.');
      navigate('/dashboard');
    }, 400);
  };

  // Determine page title context
  const getHeaderContext = () => {
    const path = location.pathname;
    if (path.startsWith('/clients/')) return 'Client Profile';
    if (path === '/clients') return 'Client Directory';
    if (path.startsWith('/events/')) return 'Event Booking Details';
    if (path === '/events') return 'Events & Bookings';
    if (path.startsWith('/projects/')) return 'Project Production';
    if (path === '/projects') return 'Projects & Workspace';
    if (path === '/tasks') return 'Studio Task Board';
    if (path === '/calendar') return 'Studio Production Calendar';
    if (path === '/team') return 'Studio Creative Team';
    if (path.startsWith('/invoices/')) return 'Invoice Details';
    if (path === '/deliverables') return 'Deliverables & Client Approvals';
    if (path === '/payments') return 'Payments & Invoicing';
    if (path === '/reports') return 'Studio Performance & Revenue';
    if (path === '/settings') return 'Studio Preferences';
    return 'Studio Overview';
  };

  return (
    <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-border h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left section: mobile hamburger & contextual title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileNav}
          className="md:hidden p-2 rounded-xl text-charcoal-500 hover:text-charcoal hover:bg-ivory-200 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block min-w-0">
          <span className="text-sm font-semibold text-charcoal truncate block">
            {getHeaderContext()}
          </span>
        </div>
      </div>

      {/* Center section: Global Search affordance */}
      <div className="flex-1 max-w-md mx-2">
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Open global search palette (Command+K)"
          className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs sm:text-sm bg-ivory-100/80 hover:bg-ivory-200/80 border border-border rounded-xl text-charcoal-400 hover:text-charcoal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/30 transition-colors shadow-subtle group"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 text-charcoal-400 group-hover:text-terracotta transition-colors flex-shrink-0" />
            <span className="truncate">Search clients, shoots, tasks...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-charcoal-400 bg-surface border border-border rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right section: Contextual Action, Activity Bell, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Quick Create Action Dropdown */}
        <div className="relative" ref={actionsRef}>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            aria-haspopup="menu"
            aria-expanded={isActionsOpen}
            className="hidden sm:inline-flex"
          >
            New Record
          </Button>
          <Button
            size="iconSm"
            variant="primary"
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            className="sm:hidden"
            aria-label="Create new record"
            aria-haspopup="menu"
            aria-expanded={isActionsOpen}
          >
            <Plus className="w-4 h-4" />
          </Button>

          {isActionsOpen && (
            <div
              role="menu"
              aria-label="Quick creation actions"
              className="absolute right-0 mt-2 w-56 bg-surface rounded-xl border border-border shadow-modal py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
                Quick Actions
              </div>
              <button
                role="menuitem"
                onClick={() => {
                  setIsActionsOpen(false);
                  setIsClientModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-charcoal hover:bg-ivory-100 transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-md bg-terracotta-light text-terracotta flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>New Client Profile</span>
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  setIsActionsOpen(false);
                  setIsEventModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-charcoal hover:bg-ivory-100 transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-md bg-sage-light text-sage flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5" />
                </div>
                <span>Book Shoot / Event</span>
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  setIsActionsOpen(false);
                  setIsTaskModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-charcoal hover:bg-ivory-100 transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-md bg-amber-light text-amber flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Create Production Task</span>
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  setIsActionsOpen(false);
                  navigate('/payments');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-charcoal hover:bg-ivory-100 transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-md bg-charcoal-100 text-charcoal flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span>View Invoices & Payments</span>
              </button>
            </div>
          )}
        </div>

        {/* Demo Activity Bell */}
        <div className="relative" ref={activityRef}>
          <button
            onClick={() => setIsActivityOpen(!isActivityOpen)}
            className="p-2 rounded-xl text-charcoal-500 hover:text-charcoal hover:bg-ivory-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/30 transition-colors relative"
            title="Studio Activity Feed"
            aria-label="Studio Activity Feed"
            aria-haspopup="dialog"
            aria-expanded={isActivityOpen}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-terracotta rounded-full ring-2 ring-surface" />
          </button>

          {isActivityOpen && (
            <div
              role="dialog"
              aria-label="Studio Activity Feed"
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface rounded-2xl border border-border shadow-modal py-3 z-40 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-4 pb-2.5 border-b border-border flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-charcoal">Studio Activity</h4>
                  <p className="text-[11px] text-charcoal-400">Recent actions in demo workspace</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-ivory-200 text-charcoal-600 px-2 py-0.5 rounded-pill font-medium">
                    {activityLog.length} events
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsClearActivityOpen(true)}
                    disabled={activityLog.length === 0}
                    className="text-[11px] text-rose hover:text-rose-dark disabled:opacity-40 disabled:hover:text-rose flex items-center gap-1 font-medium px-2 py-0.5 rounded hover:bg-rose-light/50 transition-colors"
                    title="Delete all activity records"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
                {activityLog.length === 0 ? (
                  <div className="p-6 text-center text-xs text-charcoal-400">
                    No recent activity recorded.
                  </div>
                ) : (
                  activityLog.slice(0, 10).map((act) => (
                    <div key={act.id} className="p-3 hover:bg-ivory-50 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-charcoal truncate">
                          {act.action}
                        </span>
                        <span className="text-[10px] text-charcoal-400 flex items-center gap-1 flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(act.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-600 mt-0.5 leading-snug">{act.details}</p>
                      <div className="mt-1 text-[11px] text-terracotta font-medium">
                        By {act.userName}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Demo Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-ivory-200 border border-transparent hover:border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/30 transition-colors"
            aria-label="Demo Studio Profile"
            aria-haspopup="menu"
            aria-expanded={isProfileOpen}
          >
            <Avatar
              name="Arjun Mehta"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80"
              size="sm"
            />
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 hidden sm:block mr-1" />
          </button>

          {isProfileOpen && (
            <div
              role="menu"
              aria-label="Studio Director Profile"
              className="absolute right-0 mt-2 w-72 bg-surface rounded-2xl border border-border shadow-modal p-2 z-40 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="p-3 border-b border-border/80">
                <div className="flex items-center gap-3">
                  <Avatar
                    name="Arjun Mehta"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80"
                    size="md"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-charcoal truncate">Arjun Mehta</h4>
                    <p className="text-xs text-charcoal-500">Studio Director (Demo)</p>
                  </div>
                </div>
                <div className="mt-2.5 p-2 rounded-xl bg-ivory-100 border border-border/80 text-[11px] text-charcoal-600 leading-relaxed">
                  <span className="font-semibold text-charcoal">{settings.studioName}</span>
                  <div>{settings.city}</div>
                </div>
              </div>

              <div className="py-1">
                <button
                  role="menuitem"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-charcoal-700 hover:text-charcoal hover:bg-ivory-100 rounded-lg transition-colors"
                >
                  <span>Studio Settings & Branding</span>
                </button>
              </div>

              <div className="pt-1 border-t border-border/80">
                <button
                  role="menuitem"
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose hover:bg-rose-light/50 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data to Seed</span>
                </button>
                <div className="px-3 py-1.5 text-[10px] text-charcoal-400">
                  Data stored in browser localStorage.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog for Resetting Demo Data */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetData}
        isLoading={isResetting}
        title="Reset Demo Data?"
        message="This will reset all clients, events, projects, tasks, deliverables, and payments back to their original seeded sample state in your browser's localStorage."
        confirmLabel="Reset to Seed Data"
        cancelLabel="Cancel"
        isDestructive={true}
      />

      {/* Quick Action Modals */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSaved={(newClient) => navigate(`/clients/${newClient.id}`)}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSaved={(newEvent) => navigate(`/events/${newEvent.id}`)}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />

      {/* Clear Activity Log Dialog */}
      <ConfirmDialog
        isOpen={isClearActivityOpen}
        onClose={() => setIsClearActivityOpen(false)}
        onConfirm={() => {
          clearActivityLog();
          setIsClearActivityOpen(false);
          toast.success('Activity Log Cleared', 'All activity entries have been deleted.');
        }}
        title="Delete All Activity History?"
        message={`Are you sure you want to delete all ${activityLog.length} activity feed records? This action cannot be undone.`}
        confirmLabel={`Clear All (${activityLog.length})`}
        isDestructive={true}
      />
    </header>
  );
}
