import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  CalendarDays,
  FolderKanban,
  CheckSquare,
  Clock,
  Sparkles,
  Camera,
  IndianRupee,
  ChevronRight,
  Plus,
  AlertCircle,
  AlertTriangle,
  Calendar,
  MapPin,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { Card, CardHeader, CardContent, MetricCard } from '../components/common/Card';
import { Badge, PriorityBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Alert } from '../components/common/Alert';
import { ClientModal } from '../components/modals/ClientModal';
import { EventModal } from '../components/modals/EventModal';
import { TaskModal } from '../components/modals/TaskModal';
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/formatters';

export function DashboardPage() {
  const {
    metrics,
    projects,
    events,
    tasks,
    activityLog = [],
    clients = [],
    team = [],
    settings = {},
    getEventFinancials,
    toggleTaskComplete,
    getProjectProgress,
  } = useStudioData();

  const navigate = useNavigate();

  // Modals state
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Today reference for date math
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // =========================================================
  // 1. ACTION REQUIRED CALCULATIONS (High Priority Operational Items)
  // =========================================================

  // Pending tasks split by urgency
  const pendingTasks = useMemo(() => {
    return tasks.filter((t) => t.status !== 'Completed' && t.status !== 'Done');
  }, [tasks]);

  const overdueTasks = useMemo(() => {
    return pendingTasks
      .filter((t) => t.dueDate && t.dueDate < todayStr)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [pendingTasks, todayStr]);

  const dueTodayTasks = useMemo(() => {
    return pendingTasks.filter((t) => t.dueDate === todayStr);
  }, [pendingTasks, todayStr]);

  const upcomingHighPriorityTasks = useMemo(() => {
    return pendingTasks
      .filter((t) => t.dueDate && t.dueDate > todayStr && (t.priority === 'High' || t.priority === 'Urgent'))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 4);
  }, [pendingTasks, todayStr]);

  // Total urgent count
  const totalUrgentCount = overdueTasks.length + dueTodayTasks.length;

  // =========================================================
  // 2. UPCOMING SHOOTS & EVENTS (Chronological next 4)
  // =========================================================
  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter((e) => e.status !== 'Completed' && e.status !== 'Cancelled')
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 4);
  }, [events]);

  // =========================================================
  // 3. ACTIVE PROJECTS IN PRODUCTION (With progress & deadlines)
  // =========================================================
  const activeProjects = useMemo(() => {
    return [...projects]
      .filter((p) => p.status !== 'Completed')
      .map((p) => {
        const progress = getProjectProgress ? getProjectProgress(p.id) : p.progressPercent || 0;
        const client = clients.find((c) => c.id === p.clientId);
        const event = events.find((e) => e.id === p.eventId);

        return {
          ...p,
          progress,
          clientName: client?.name || 'Unassigned Client',
          eventName: event?.title || null,
        };
      })
      .slice(0, 3);
  }, [projects, getProjectProgress, clients, events]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Studio Greeting Banner & Action Affordances */}
      <div className="bg-gradient-to-r from-surface via-surface to-ivory-200 border border-border rounded-card p-4 sm:p-6 lg:p-8 relative overflow-hidden shadow-subtle">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-terracotta-light text-terracotta text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Production Desk</span>
          </div>

          <h1 className="editorial-heading text-2xl sm:text-3xl lg:text-4xl font-normal text-charcoal tracking-tight">
            {settings.studioName || 'StudioFlow Photography'}
          </h1>

          <p className="text-xs sm:text-sm text-charcoal-600 mt-1.5 sm:mt-2 leading-relaxed">
            Managing fine-art wedding commissions, editorial lookbooks, and studio productions.{' '}
            {totalUrgentCount > 0 ? (
              <span className="font-semibold text-rose">
                {totalUrgentCount} operational item{totalUrgentCount > 1 ? 's' : ''} require immediate attention.
              </span>
            ) : (
              <span className="font-semibold text-sage-dark">
                All darkroom queues and studio tasks are currently on schedule.
              </span>
            )}
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-5">
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsClientModalOpen(true)}
            >
              Add Client
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Camera className="w-4 h-4" />}
              onClick={() => setIsEventModalOpen(true)}
            >
              Book Shoot / Event
            </Button>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<CheckSquare className="w-4 h-4" />}
              onClick={() => setIsTaskModalOpen(true)}
            >
              Create Task
            </Button>
          </div>
        </div>

        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-terracotta/20 items-center justify-center bg-terracotta/5">
          <Camera className="w-12 h-12 text-terracotta/40 stroke-[1.5]" />
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: WHAT NEEDS ATTENTION NOW (Priority Operations) */}
      {/* ========================================================= */}
      {totalUrgentCount > 0 && (
        <section aria-labelledby="urgent-operations-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose animate-pulse" />
              <h2 id="urgent-operations-heading" className="text-sm sm:text-base font-bold text-charcoal uppercase tracking-wider">
                Needs Studio Attention Now
              </h2>
            </div>
            <span className="text-xs font-semibold text-rose bg-rose-light px-2.5 py-0.5 rounded-pill border border-rose-border">
              {totalUrgentCount} Urgent Action{totalUrgentCount > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">

            {/* 1B: Overdue Tasks */}
            {overdueTasks.slice(0, 2).map((t) => {
              const project = projects.find((p) => p.id === t.projectId);
              const assigned = team.find((tm) => tm.id === t.assignedTo);
              return (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border border-rose-border bg-rose-light/30 flex flex-col justify-between gap-3 shadow-subtle"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Task Overdue
                      </span>
                      <span className="text-[11px] font-semibold text-rose">
                        Due {formatDate(t.dueDate)}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-charcoal line-clamp-1">
                      {t.title}
                    </h3>
                    <p className="text-xs text-charcoal-500 line-clamp-1">
                      {project ? `Workspace: ${project.title}` : 'General Studio Operation'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-rose-border/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-charcoal-600">
                      {assigned && (
                        <>
                          <Avatar name={assigned.name} src={assigned.avatar} size="xs" />
                          <span className="text-[11px] truncate max-w-[100px]">{assigned.name}</span>
                        </>
                      )}
                    </div>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => {
                        toggleTaskComplete(t.id);
                      }}
                      className="text-sage-dark border-sage-border hover:bg-sage-light"
                      leftIcon={<CheckCircle2 className="w-3 h-3" />}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* 1C: Tasks Due Today */}
            {dueTodayTasks.slice(0, 1).map((t) => {
              const project = projects.find((p) => p.id === t.projectId);
              return (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border border-amber-border bg-amber-light/40 flex flex-col justify-between gap-3 shadow-subtle"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-dark">
                        <Clock className="w-3.5 h-3.5" />
                        Due Today
                      </span>
                      <PriorityBadge priority={t.priority || 'Medium'} />
                    </div>

                    <h3 className="text-sm font-semibold text-charcoal line-clamp-1">
                      {t.title}
                    </h3>
                    <p className="text-xs text-charcoal-500 line-clamp-1">
                      {project?.title || 'Production milestone due by end of day.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-amber-border/60 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-amber-dark font-medium">Due by 6:00 PM</span>
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => toggleTaskComplete(t.id)}
                      leftIcon={<CheckCircle2 className="w-3 h-3 text-sage" />}
                    >
                      Mark Done
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: STREAMLINED OPERATIONS KPI SUMMARY TILES       */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="Active Projects"
          value={activeProjects.length}
          subtitle="Workspaces in production"
          icon={FolderKanban}
          variant="amber"
          onClick={() => navigate('/projects')}
        />
        <MetricCard
          title="Upcoming Shoots"
          value={upcomingEvents.length}
          subtitle="Confirmed on schedule"
          icon={CalendarDays}
          variant="sage"
          onClick={() => navigate('/events')}
        />
        <MetricCard
          title="Active Clients"
          value={clients.length}
          subtitle="Client accounts on record"
          icon={Users}
          variant="terracotta"
          onClick={() => navigate('/clients')}
        />
        <MetricCard
          title="Tasks Outstanding"
          value={pendingTasks.length}
          subtitle={overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : 'All tasks on track'}
          icon={CheckSquare}
          variant={overdueTasks.length > 0 ? 'rose' : 'default'}
          onClick={() => navigate('/tasks')}
        />
      </div>

      {/* ========================================================= */}
      {/* SECTION 3: CORE OPERATIONS SPLIT GRID                      */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column (2 cols): Upcoming Schedule & Active Workspaces */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* 3A: Upcoming Schedule & Shoot Itineraries */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-charcoal tracking-tight">
                  Upcoming Shoots & Event Itineraries
                </h2>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Confirmed ceremonies, commercial campaigns, and darkroom booking dates
                </p>
              </div>
              <Link
                to="/events"
                className="text-xs font-semibold text-terracotta hover:text-terracotta-hover flex items-center gap-1 group"
              >
                <span>All Bookings</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  title="No Upcoming Events"
                  description="Your shoot calendar is open. Book a new wedding, portrait, or commercial campaign."
                  action={
                    <Button size="sm" variant="outline" onClick={() => setIsEventModalOpen(true)}>
                      Book First Shoot
                    </Button>
                  }
                />
              ) : (
                upcomingEvents.map((evt) => {
                  const client = clients.find((c) => c.id === evt.clientId);
                  const leadPhotographer = team.find((tm) => tm.id === evt.leadPhotographerId);
                  const fin = getEventFinancials ? getEventFinancials(evt.id) : null;

                  return (
                    <Card
                      key={evt.id}
                      hover
                      onClick={() => navigate(`/events/${evt.id}`)}
                      className="p-4 sm:p-5 cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="terracotta" size="sm">
                              {evt.eventType}
                            </Badge>
                            <Badge size="sm">{evt.status}</Badge>
                            {fin && (
                              <Badge
                                size="sm"
                                variant={
                                  fin.paymentStatus === 'Paid'
                                    ? 'sage'
                                    : fin.paymentStatus === 'Partially Paid'
                                    ? 'amber'
                                    : 'default'
                                }
                              >
                                {fin.paymentStatus}
                              </Badge>
                            )}
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-charcoal hover:text-terracotta transition-colors truncate">
                            {evt.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-500">
                            {client && (
                              <span className="font-medium text-charcoal-700">
                                Client:{' '}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/clients/${client.id}`);
                                  }}
                                  className="text-terracotta hover:underline font-semibold"
                                >
                                  {client.name}
                                </button>
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                              {formatDate(evt.startDate)} {evt.startTime && `at ${evt.startTime}`}
                            </span>
                            {evt.venue && (
                              <span className="flex items-center gap-1 truncate max-w-full sm:max-w-xs">
                                <MapPin className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                                <span className="truncate">{evt.venue}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-left sm:text-right sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                          <span className="text-[10px] text-charcoal-400 uppercase font-bold block">Agreed Package</span>
                          <span className="text-sm sm:text-base font-bold text-charcoal block font-serif">
                            {formatCurrency(evt.packageValue)}
                          </span>
                          {leadPhotographer && (
                            <span className="text-[11px] text-terracotta font-medium block mt-0.5">
                              Lead: {leadPhotographer.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* 3B: Active Project Workspaces in Production */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-charcoal tracking-tight">
                  Workspaces in Digital Darkroom
                </h2>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Post-production culling, color grading, and final retouches
                </p>
              </div>
              <Link
                to="/projects"
                className="text-xs font-semibold text-terracotta hover:text-terracotta-hover flex items-center gap-1 group"
              >
                <span>All Projects</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {activeProjects.map((p) => {
                return (
                  <Card
                    key={p.id}
                    hover
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="p-4 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-32 w-full rounded-xl overflow-hidden bg-ivory-200 mb-3 relative">
                        <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2">
                          <Badge size="sm" className="bg-surface/90 shadow-xs backdrop-blur-xs font-semibold">
                            {p.status}
                          </Badge>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-charcoal hover:text-terracotta transition-colors truncate">
                        {p.title}
                      </h3>
                      <p className="text-xs text-charcoal-500 mt-0.5 truncate">{p.clientName}</p>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-border/70 space-y-1.5">
                      <div className="flex justify-between items-center text-xs text-charcoal-500">
                        <span>Workflow Progress</span>
                        <span className="font-bold text-charcoal">{p.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-ivory-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-terracotta transition-all duration-300"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-charcoal-400 pt-1 flex items-center justify-between">
                        <span>Deadline: {formatDate(p.deliveryDeadline)}</span>
                        <span className="text-terracotta font-medium group-hover:underline">Open &rarr;</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Operational Priorities & Studio Activity */}
        <div className="space-y-6 sm:space-y-8">
          {/* 3D: Daily Task Priorities */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-charcoal tracking-tight">
                  Task Priorities
                </h2>
                <p className="text-xs text-charcoal-500">Click checkmark to resolve immediately</p>
              </div>
              <Link to="/tasks" className="text-xs font-semibold text-terracotta hover:text-terracotta-hover">
                Task Board
              </Link>
            </div>

            <Card className="divide-y divide-border/60">
              {/* Overdue tasks */}
              {overdueTasks.length > 0 && (
                <div className="p-3.5 bg-rose-light/20">
                  <div className="flex items-center justify-between text-xs font-bold text-rose mb-2.5">
                    <span className="flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Overdue ({overdueTasks.length})
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {overdueTasks.slice(0, 3).map((t) => (
                      <div key={t.id} className="flex items-start gap-2 text-xs group">
                        <button
                          type="button"
                          onClick={() => toggleTaskComplete(t.id)}
                          className="mt-0.5 text-rose hover:text-sage transition-colors shrink-0"
                          title="Mark complete"
                          aria-label={`Mark task ${t.title} complete`}
                        >
                          <div className="w-4 h-4 rounded border border-rose flex items-center justify-center hover:bg-sage-light hover:border-sage">
                            <CheckCircle2 className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                          </div>
                        </button>
                        <div className="min-w-0 flex-1">
                          <Link
                            to="/tasks"
                            className="text-xs text-charcoal hover:text-rose transition-colors font-medium block truncate"
                          >
                            {t.title}
                          </Link>
                          <span className="text-[10px] text-rose font-medium block">
                            Past due: {formatDate(t.dueDate)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks due today */}
              {dueTodayTasks.length > 0 && (
                <div className="p-3.5 bg-amber-light/25">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-dark mb-2.5">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Due Today ({dueTodayTasks.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {dueTodayTasks.map((t) => (
                      <div key={t.id} className="flex items-start gap-2 text-xs group">
                        <button
                          type="button"
                          onClick={() => toggleTaskComplete(t.id)}
                          className="mt-0.5 text-amber-dark hover:text-sage transition-colors shrink-0"
                          title="Mark complete"
                          aria-label={`Mark task ${t.title} complete`}
                        >
                          <div className="w-4 h-4 rounded border border-amber-border flex items-center justify-center hover:bg-sage-light hover:border-sage">
                            <CheckCircle2 className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                          </div>
                        </button>
                        <div className="min-w-0 flex-1">
                          <Link
                            to="/tasks"
                            className="text-xs text-charcoal hover:text-amber-dark transition-colors font-medium block truncate"
                          >
                            {t.title}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming priority tasks */}
              <div className="p-3.5 space-y-2.5">
                <div className="text-xs font-bold text-charcoal-600 uppercase tracking-wider mb-2">
                  Upcoming High Priority
                </div>
                {upcomingHighPriorityTasks.length === 0 ? (
                  <p className="text-xs text-charcoal-400 italic">No upcoming high priority tasks.</p>
                ) : (
                  upcomingHighPriorityTasks.map((t) => {
                    const assigned = team.find((tm) => tm.id === t.assignedTo);
                    return (
                      <div key={t.id} className="flex items-center justify-between gap-2 text-xs py-1">
                        <div className="min-w-0 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleTaskComplete(t.id)}
                            className="text-charcoal-400 hover:text-sage transition-colors shrink-0"
                            title="Mark complete"
                            aria-label={`Mark task ${t.title} complete`}
                          >
                            <div className="w-3.5 h-3.5 rounded border border-charcoal-300 hover:border-sage" />
                          </button>
                          <Link to="/tasks" className="text-charcoal hover:text-terracotta truncate font-medium">
                            {t.title}
                          </Link>
                        </div>
                        <span className="text-[10px] text-charcoal-400 shrink-0 font-medium">
                          {formatDate(t.dueDate)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {/* 3E: Recent Studio Activity Log */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-charcoal tracking-tight">
                  Recent Studio Activity
                </h2>
                <p className="text-xs text-charcoal-500">Audit trail of latest operations</p>
              </div>
            </div>

            <Card className="p-4 divide-y divide-border/60">
              {activityLog.length === 0 ? (
                <div className="p-6 text-center text-xs text-charcoal-400">
                  No recent activity logged.
                </div>
              ) : (
                activityLog.slice(0, 6).map((act) => (
                  <div key={act.id} className="py-2.5 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-charcoal truncate">{act.action}</span>
                      <span className="text-[10px] text-charcoal-400 shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(act.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-600 mt-0.5 leading-snug">{act.details}</p>
                    <div className="text-[10px] text-terracotta font-medium mt-1">
                      By {act.userName}
                    </div>
                  </div>
                ))
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Reusable Modals for Quick Actions */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSaved={(newClient) => {
          navigate(`/clients/${newClient.id}`);
        }}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSaved={(newEvent) => {
          navigate(`/events/${newEvent.id}`);
        }}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaved={() => {
          // Toast will notify and context state will refresh
        }}
      />
    </div>
  );
}
