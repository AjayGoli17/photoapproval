import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  CalendarDays,
  FolderKanban,
  CheckSquare,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  Camera,
  IndianRupee,
  ChevronRight,
  Plus,
  AlertCircle,
  Calendar,
  MapPin,
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Badge, PriorityBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
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
    activityLog,
    clients,
    team,
    settings,
    getEventFinancials,
  } = useStudioData();

  const navigate = useNavigate();

  // Modals state
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Filter upcoming events (not completed or cancelled) sorted chronologically
  const upcomingEvents = [...events]
    .filter((e) => e.status !== 'Completed' && e.status !== 'Cancelled')
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 4);

  // Active production projects
  const activeProjects = [...projects]
    .filter((p) => p.status !== 'Completed')
    .slice(0, 3);

  // Group pending tasks: Overdue, Due Today, Upcoming
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed' && t.status !== 'Done');

  const overdueTasks = pendingTasks.filter((t) => t.dueDate < todayStr);
  const dueTodayTasks = pendingTasks.filter((t) => t.dueDate === todayStr);
  const futureTasks = pendingTasks.filter((t) => t.dueDate > todayStr).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Studio Greeting Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-surface to-ivory-200 border border-border rounded-card p-6 sm:p-8 relative overflow-hidden shadow-subtle">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-terracotta-light text-terracotta text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Production Desk</span>
          </div>
          <h1 className="editorial-heading text-2xl sm:text-3xl lg:text-4xl font-normal text-charcoal tracking-tight">
            {settings.studioName}
          </h1>
          <p className="text-sm sm:text-base text-charcoal-600 mt-2 leading-relaxed">
            Managing fine-art weddings, editorial lookbooks, and client proof approvals. You have{' '}
            <span className="font-semibold text-terracotta">{metrics.upcomingEventsCount} upcoming events</span> and{' '}
            <span className="font-semibold text-charcoal-800">{metrics.pendingTasksCount} tasks pending</span>.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
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
              Create Event
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

        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-terracotta/20 items-center justify-center bg-terracotta/5">
          <Camera className="w-12 h-12 text-terracotta/40 stroke-[1.5]" />
        </div>
      </div>

      {/* KPI Cards — Dynamic derived values from context */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Total Clients */}
        <Card
          hover
          onClick={() => navigate('/clients')}
          className="p-5 cursor-pointer group hover:border-terracotta/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
              Total Clients
            </span>
            <div className="w-8 h-8 rounded-lg bg-charcoal-100 text-charcoal flex items-center justify-center group-hover:bg-terracotta group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-charcoal tracking-tight">
              {metrics.totalClientsCount}
            </div>
            <div className="text-xs text-charcoal-500 mt-1 flex items-center gap-1">
              <span>View client directory</span>
              <ChevronRight className="w-3 h-3 text-terracotta group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Card>

        {/* KPI 2: Upcoming Events */}
        <Card
          hover
          onClick={() => navigate('/events')}
          className="p-5 cursor-pointer group hover:border-sage/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
              Upcoming Events
            </span>
            <div className="w-8 h-8 rounded-lg bg-sage-light text-sage flex items-center justify-center group-hover:bg-sage group-hover:text-white transition-colors">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-charcoal tracking-tight">
              {metrics.upcomingEventsCount}
            </div>
            <div className="text-xs text-charcoal-500 mt-1 flex items-center gap-1">
              <span>Confirmed & active shoots</span>
              <ChevronRight className="w-3 h-3 text-sage group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Card>

        {/* KPI 3: Active Projects */}
        <Card
          hover
          onClick={() => navigate('/projects')}
          className="p-5 cursor-pointer group hover:border-amber/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
              Active Projects
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-light text-amber flex items-center justify-center group-hover:bg-amber group-hover:text-white transition-colors">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-charcoal tracking-tight">
              {metrics.activeProjectsCount}
            </div>
            <div className="text-xs text-charcoal-500 mt-1 flex items-center gap-1">
              <span>In digital darkroom & culling</span>
              <ChevronRight className="w-3 h-3 text-amber group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Card>

        {/* KPI 4: Outstanding Payments */}
        <Card
          hover
          onClick={() => navigate('/payments')}
          className="p-5 cursor-pointer group hover:border-rose/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
              Outstanding Payments
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-light text-rose flex items-center justify-center group-hover:bg-rose group-hover:text-white transition-colors">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-charcoal tracking-tight">
              {formatCurrency(metrics.totalOutstanding)}
            </div>
            <div className="text-xs text-charcoal-500 mt-1 flex items-center gap-1">
              <span className="text-sage font-medium">{formatCurrency(metrics.totalRevenue)} paid</span>
              <span>• view invoices</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid: Upcoming Schedule & Task Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Upcoming Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-charcoal">Upcoming Schedule</h2>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Confirmed shoots, venue itineraries, and booking milestones
              </p>
            </div>
            <Link
              to="/events"
              className="text-xs font-medium text-terracotta hover:text-terracotta-hover flex items-center gap-1"
            >
              <span>View all bookings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {upcomingEvents.length === 0 ? (
              <Card className="p-8 text-center text-xs text-charcoal-500">
                No upcoming events scheduled. Click "Create Event" to book a shoot.
              </Card>
            ) : (
              upcomingEvents.map((evt) => {
                const client = clients.find((c) => c.id === evt.clientId);
                const leadPhotographer = team.find((tm) => tm.id === evt.leadPhotographerId);
                const fin = getEventFinancials(evt.id);

                return (
                  <Card
                    key={evt.id}
                    hover
                    onClick={() => navigate(`/events/${evt.id}`)}
                    className="p-4 sm:p-5 cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2.5">
                          <Badge variant="terracotta" size="sm">{evt.eventType}</Badge>
                          <Badge size="sm">{evt.status}</Badge>
                          <Badge
                            size="sm"
                            variant={fin.paymentStatus === 'Paid' ? 'sage' : fin.paymentStatus === 'Partially Paid' ? 'amber' : 'default'}
                          >
                            {fin.paymentStatus}
                          </Badge>
                        </div>

                        <h3 className="text-base font-semibold text-charcoal group-hover:text-terracotta transition-colors truncate">
                          {evt.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-500">
                          <span className="font-medium text-charcoal-700">Client: {client?.name || 'Unassigned'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                            {formatDate(evt.startDate)} {evt.startTime && `at ${evt.startTime}`}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 truncate max-w-xs">
                            <MapPin className="w-3.5 h-3.5 text-charcoal-400 flex-shrink-0" />
                            <span className="truncate">{evt.venue}</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right sm:self-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                        <span className="text-[10px] text-charcoal-400 uppercase font-medium block">Package</span>
                        <span className="text-base font-bold text-charcoal block">{formatCurrency(evt.packageValue)}</span>
                        {leadPhotographer && (
                          <span className="text-[11px] text-terracotta block mt-0.5">Lead: {leadPhotographer.name}</span>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          {/* Active Projects Preview */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-charcoal">Projects in Production</h3>
                <p className="text-xs text-charcoal-500 mt-0.5">Workspaces currently progressing through post-production</p>
              </div>
              <Link to="/projects" className="text-xs font-medium text-terracotta hover:text-terracotta-hover flex items-center gap-1">
                <span>View all projects</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activeProjects.map((p) => {
                const client = clients.find((c) => c.id === p.clientId);
                return (
                  <Card
                    key={p.id}
                    hover
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="p-4 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-28 w-full rounded-lg overflow-hidden bg-ivory-200 mb-3 relative">
                        <img src={p.coverImage} alt="" className="w-full h-full object-cover" />
                        <div className="absolute top-1.5 right-1.5">
                          <Badge size="sm" className="bg-surface/90 text-[10px]">{p.status}</Badge>
                        </div>
                      </div>
                      <h4 className="text-sm font-semibold text-charcoal truncate">{p.title}</h4>
                      <p className="text-xs text-charcoal-500 mt-0.5 truncate">{client?.name}</p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-border/60">
                      <div className="flex justify-between text-[11px] text-charcoal-500 mb-1">
                        <span>Progress</span>
                        <span className="font-semibold text-charcoal">{p.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1 bg-ivory-200 rounded-full overflow-hidden">
                        <div className="h-full bg-terracotta" style={{ width: `${p.progressPercent}%` }} />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Task Overview & Recent Activity */}
        <div className="space-y-6">
          {/* Task Overview */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h3 className="text-base font-semibold text-charcoal">Task Overview</h3>
                <p className="text-xs text-charcoal-500">Categorized by urgency</p>
              </div>
              <Link to="/tasks" className="text-xs font-medium text-terracotta hover:text-terracotta-hover">
                Task Board
              </Link>
            </div>

            <Card className="divide-y divide-border/60">
              {/* Overdue tasks */}
              {overdueTasks.length > 0 && (
                <div className="p-3.5 bg-rose-light/30">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose mb-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Overdue ({overdueTasks.length})</span>
                  </div>
                  <div className="space-y-2">
                    {overdueTasks.slice(0, 2).map((t) => (
                      <Link
                        key={t.id}
                        to="/tasks"
                        className="block text-xs text-charcoal hover:text-rose transition-colors font-medium truncate"
                      >
                        • {t.title} <span className="text-charcoal-400 text-[10px]">({formatDate(t.dueDate)})</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks due today */}
              {dueTodayTasks.length > 0 && (
                <div className="p-3.5 bg-amber-light/30">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-dark mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Due Today ({dueTodayTasks.length})</span>
                  </div>
                  <div className="space-y-2">
                    {dueTodayTasks.slice(0, 2).map((t) => (
                      <Link
                        key={t.id}
                        to="/tasks"
                        className="block text-xs text-charcoal hover:text-amber-dark transition-colors font-medium truncate"
                      >
                        • {t.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming tasks */}
              <div className="p-3.5 space-y-2.5">
                <div className="text-xs font-semibold text-charcoal-600 mb-1">
                  Upcoming Priority Tasks
                </div>
                {futureTasks.slice(0, 3).map((t) => {
                  const assigned = team.find((tm) => tm.id === t.assignedTo);
                  return (
                    <div key={t.id} className="flex items-center justify-between gap-2 text-xs">
                      <Link to="/tasks" className="text-charcoal hover:text-terracotta truncate font-medium">
                        {t.title}
                      </Link>
                      <span className="text-[10px] text-charcoal-400 flex-shrink-0">
                        {formatDate(t.dueDate)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Recent Activity Log */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-base font-semibold text-charcoal">Recent Activity</h3>
            </div>

            <Card className="p-4 divide-y divide-border/60">
              {activityLog.slice(0, 5).map((act) => (
                <div key={act.id} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-charcoal truncate">{act.action}</span>
                    <span className="text-[10px] text-charcoal-400 flex-shrink-0">
                      {formatRelativeTime(act.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-600 mt-0.5 leading-snug">{act.details}</p>
                  <div className="text-[10px] text-terracotta font-medium mt-1">
                    {act.userName}
                  </div>
                </div>
              ))}
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
