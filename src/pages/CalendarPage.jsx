import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Camera,
  CheckSquare,
  Package,
  User,
  Filter,
  Eye,
  CalendarDays,
  CalendarRange,
  List,
  ExternalLink,
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import { useStudioData } from '../context/StudioDataContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/common/Card';
import { Badge, PriorityBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { Modal } from '../components/common/Modal';
import { formatDate } from '../utils/formatters';

export function CalendarPage() {
  const { events, tasks, projects, clients, team } = useStudioData();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week' | 'agenda'

  // Category filters
  const [showEvents, setShowEvents] = useState(true);
  const [showTasks, setShowTasks] = useState(true);
  const [showDeadlines, setShowDeadlines] = useState(true);
  const [selectedTeamMember, setSelectedTeamMember] = useState('All');

  // Selected item modal
  const [selectedItem, setSelectedItem] = useState(null);

  // Aggregate all calendar items
  const allCalendarItems = useMemo(() => {
    const items = [];

    // 1. Events
    if (showEvents) {
      events.forEach((ev) => {
        const client = clients.find((c) => c.id === ev.clientId);
        items.push({
          id: `ev-${ev.id}`,
          originalId: ev.id,
          type: 'event',
          typeLabel: 'Shoot Event',
          title: ev.title,
          dateStr: ev.startDate ? ev.startDate.split('T')[0] : '',
          time: ev.startTime || '10:00 AM',
          venue: ev.venue || 'On Location',
          clientName: client?.name || 'Client',
          status: ev.status,
          link: `/events/${ev.id}`,
          colorClass: 'bg-terracotta text-white border-terracotta',
          badgeVariant: 'terracotta',
          assignedMembers: team.filter((m) => ev.teamAssigned?.includes(m.id)),
        });
      });
    }

    // 2. Tasks
    if (showTasks) {
      tasks.forEach((t) => {
        const assigned = team.find((m) => m.id === t.assignedTo);
        const project = projects.find((p) => p.id === t.projectId);
        const isDone = t.status === 'Done' || t.status === 'Completed';

        // Filter by team member if selected
        if (selectedTeamMember !== 'All' && t.assignedTo !== selectedTeamMember) {
          return;
        }

        items.push({
          id: `task-${t.id}`,
          originalId: t.id,
          type: 'task',
          typeLabel: 'Task Deadline',
          title: t.title,
          dateStr: t.dueDate ? t.dueDate.split('T')[0] : '',
          time: 'Due 18:00',
          venue: project ? project.title : 'Studio Office',
          projectName: project?.title,
          clientName: null,
          status: t.status,
          priority: t.priority,
          assignedMember: assigned,
          link: t.projectId ? `/projects/${t.projectId}` : '/tasks',
          colorClass: isDone
            ? 'bg-sage text-white border-sage'
            : 'bg-amber-600 text-white border-amber-600',
          badgeVariant: isDone ? 'sage' : 'amber',
        });
      });
    }

    // 3. Project Delivery Deadlines
    if (showDeadlines) {
      projects.forEach((p) => {
        const client = clients.find((c) => c.id === p.clientId);
        items.push({
          id: `proj-${p.id}`,
          originalId: p.id,
          type: 'deadline',
          typeLabel: 'Delivery Handover',
          title: `Delivery: ${p.title}`,
          dateStr: p.deliveryDeadline ? p.deliveryDeadline.split('T')[0] : '',
          time: 'End of Day',
          venue: 'Digital Delivery',
          projectName: p.title,
          clientName: client?.name,
          status: p.status,
          link: `/projects/${p.id}`,
          colorClass: 'bg-charcoal text-white border-charcoal',
          badgeVariant: 'default',
        });
      });
    }

    return items.filter((item) => Boolean(item.dateStr));
  }, [events, tasks, projects, clients, team, showEvents, showTasks, showDeadlines, selectedTeamMember]);

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate((prev) => subMonths(prev, 1));
    } else {
      setCurrentDate((prev) => subWeeks(prev, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate((prev) => addMonths(prev, 1));
    } else {
      setCurrentDate((prev) => addWeeks(prev, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Month grid days
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  // Week days
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(weekStart);
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  // Items lookup helper
  const getItemsForDay = (day) => {
    const dateFormatted = format(day, 'yyyy-MM-dd');
    return allCalendarItems.filter((item) => item.dateStr === dateFormatted);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Production Calendar & Scheduling"
        subtitle="Track shooting itineraries, client delivery deadlines, and daily darkroom tasks."
        badge={<Badge variant="terracotta">{allCalendarItems.length} Scheduled Items</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
            <div className="flex items-center border border-border rounded-lg bg-surface">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 text-charcoal hover:bg-ivory-100 rounded-l transition-colors"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 text-charcoal hover:bg-ivory-100 rounded-r transition-colors"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        }
      />

      {/* Control Bar: View Switcher & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 bg-surface rounded-xl border border-border">
        {/* Current Date Display */}
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-terracotta shrink-0" />
          <h2 className="text-lg font-bold text-charcoal font-serif">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          {viewMode === 'week' && (
            <span className="text-xs text-charcoal-400">
              ({format(weekDays[0], 'MMM d')} – {format(weekDays[6], 'MMM d')})
            </span>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Category Toggles */}
          <div className="flex flex-wrap items-center gap-2 bg-ivory-50 px-2.5 py-1.5 rounded-lg border border-border text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-charcoal font-medium select-none">
              <input
                type="checkbox"
                checked={showEvents}
                onChange={(e) => setShowEvents(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-terracotta focus:ring-terracotta/20 border-border"
              />
              <span className="inline-block w-2 h-2 rounded-full bg-terracotta" />
              Events
            </label>

            <span className="text-charcoal-300">|</span>

            <label className="flex items-center gap-1.5 cursor-pointer text-charcoal font-medium select-none">
              <input
                type="checkbox"
                checked={showTasks}
                onChange={(e) => setShowTasks(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber/20 border-border"
              />
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
              Tasks
            </label>

            <span className="text-charcoal-300">|</span>

            <label className="flex items-center gap-1.5 cursor-pointer text-charcoal font-medium select-none">
              <input
                type="checkbox"
                checked={showDeadlines}
                onChange={(e) => setShowDeadlines(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-charcoal focus:ring-charcoal/20 border-border"
              />
              <span className="inline-block w-2 h-2 rounded-full bg-charcoal" />
              Deadlines
            </label>
          </div>

          {/* Team Member Filter */}
          <select
            value={selectedTeamMember}
            onChange={(e) => setSelectedTeamMember(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-ivory-50 text-charcoal hover:bg-surface focus:outline-none focus:ring-1 focus:ring-terracotta"
          >
            <option value="All">All Crew Members</option>
            {team.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-ivory-50">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 ${
                viewMode === 'month'
                  ? 'bg-surface text-terracotta shadow-xs font-semibold'
                  : 'text-charcoal-400 hover:text-charcoal'
              }`}
              title="Month View"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Month</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 ${
                viewMode === 'week'
                  ? 'bg-surface text-terracotta shadow-xs font-semibold'
                  : 'text-charcoal-400 hover:text-charcoal'
              }`}
              title="Week View"
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Week</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('agenda')}
              className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 ${
                viewMode === 'agenda'
                  ? 'bg-surface text-terracotta shadow-xs font-semibold'
                  : 'text-charcoal-400 hover:text-charcoal'
              }`}
              title="Schedule Agenda View"
            >
              <List className="w-3.5 h-3.5" />
              <span>Agenda</span>
            </button>
          </div>
        </div>
      </div>

      {/* Month View */}
      {viewMode === 'month' && (
        <Card className="overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <div className="min-w-[650px]">
              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 border-b border-border bg-ivory-50 text-center py-2.5 text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              {/* Month Days Grid */}
              <div className="grid grid-cols-7 divide-x divide-y divide-border/60">
            {monthDays.map((day) => {
              const dayItems = getItemsForDay(day);
              const inMonth = isSameMonth(day, currentDate);
              const today = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                    !inMonth ? 'bg-ivory-100/40 opacity-50' : 'bg-surface hover:bg-ivory-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                        today
                          ? 'bg-terracotta text-white font-bold'
                          : inMonth
                          ? 'text-charcoal'
                          : 'text-charcoal-400'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                    {dayItems.length > 0 && (
                      <span className="text-[10px] font-semibold text-charcoal-400">
                        {dayItems.length}
                      </span>
                    )}
                  </div>

                  {/* Day Items List */}
                  <div className="space-y-1 mt-1.5 flex-1 overflow-y-auto max-h-[85px]">
                    {dayItems.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate block transition-opacity hover:opacity-85 ${item.colorClass}`}
                        title={`${item.typeLabel}: ${item.title}`}
                      >
                        {item.title}
                      </button>
                    ))}
                    {dayItems.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setSelectedItem(dayItems[3])}
                        className="text-[10px] text-terracotta font-semibold hover:underline block text-left pl-1"
                      >
                        +{dayItems.length - 3} more
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <Card className="overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 divide-x divide-border min-w-[650px]">
            {weekDays.map((day) => {
              const dayItems = getItemsForDay(day);
              const today = isToday(day);

              return (
                <div key={day.toISOString()} className="min-h-[450px] flex flex-col bg-surface">
                  {/* Column Header */}
                  <div
                    className={`p-3 text-center border-b border-border ${
                      today ? 'bg-terracotta/10 text-terracotta' : 'bg-ivory-50 text-charcoal'
                    }`}
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-wider">
                      {format(day, 'EEE')}
                    </div>
                    <div className="text-lg font-bold mt-0.5 font-serif">
                      {format(day, 'd')}
                    </div>
                  </div>

                  {/* Column Events */}
                  <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                    {dayItems.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-[11px] text-charcoal-300 italic">
                        Empty
                      </div>
                    ) : (
                      dayItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`p-2 rounded-lg border text-xs cursor-pointer shadow-xs hover:shadow transition-all ${item.colorClass}`}
                        >
                          <div className="text-[10px] uppercase font-bold opacity-90 block">
                            {item.typeLabel}
                          </div>
                          <div className="font-semibold leading-snug mt-0.5 truncate">
                            {item.title}
                          </div>
                          <div className="text-[10px] opacity-80 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </Card>
      )}

      {/* Agenda / Schedule View */}
      {viewMode === 'agenda' && (
        <div className="space-y-4">
          {allCalendarItems.length === 0 ? (
            <Card className="p-8 text-center text-xs text-charcoal-400 italic">
              No items scheduled under the selected filter criteria.
            </Card>
          ) : (
            <div className="space-y-3">
              {allCalendarItems
                .slice()
                .sort((a, b) => new Date(a.dateStr) - new Date(b.dateStr))
                .map((item) => (
                  <Card
                    key={item.id}
                    hover
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Date Block */}
                      <div className="flex flex-col items-center justify-center bg-ivory-200 border border-border rounded-xl p-2.5 w-16 h-16 shrink-0 text-center">
                        <span className="text-[10px] font-bold uppercase text-terracotta">
                          {new Date(item.dateStr).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-xl font-bold text-charcoal leading-none mt-0.5 font-serif">
                          {new Date(item.dateStr).getDate()}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge size="xs" variant={item.badgeVariant}>
                            {item.typeLabel}
                          </Badge>
                          <span className="text-xs text-charcoal-400">{item.time}</span>
                        </div>
                        <h4 className="text-sm font-bold text-charcoal font-serif">{item.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-charcoal-500">
                          {item.venue && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-charcoal-400" />
                              {item.venue}
                            </span>
                          )}
                          {item.clientName && <span>Client: {item.clientName}</span>}
                          {item.assignedMember && <span>Crew: {item.assignedMember.name}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <Badge size="sm">{item.status}</Badge>
                      <Link to={item.link} onClick={(e) => e.stopPropagation()}>
                        <Button size="xs" variant="ghost" rightIcon={<ExternalLink className="w-3 h-3" />}>
                          Open
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Item Detail Interactive Modal */}
      {selectedItem && (
        <Modal
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.title}
          subtitle={`${selectedItem.typeLabel} scheduled for ${formatDate(selectedItem.dateStr)}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-ivory-50 rounded-lg border border-border text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-charcoal-400">Date & Time:</span>
                <span className="font-semibold text-charcoal">
                  {formatDate(selectedItem.dateStr)} ({selectedItem.time})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-400">Location / Venue:</span>
                <span className="font-semibold text-charcoal">{selectedItem.venue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-400">Status:</span>
                <Badge size="xs">{selectedItem.status}</Badge>
              </div>
              {selectedItem.clientName && (
                <div className="flex justify-between">
                  <span className="text-charcoal-400">Linked Client:</span>
                  <span className="font-semibold text-charcoal">{selectedItem.clientName}</span>
                </div>
              )}
              {selectedItem.assignedMember && (
                <div className="flex justify-between">
                  <span className="text-charcoal-400">Assigned Artist:</span>
                  <span className="font-semibold text-charcoal">{selectedItem.assignedMember.name}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
              <Link to={selectedItem.link}>
                <Button variant="primary" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Navigate to Workspace
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
