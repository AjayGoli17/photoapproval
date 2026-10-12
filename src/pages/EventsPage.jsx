import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { SearchInput } from '../components/common/SearchInput';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EventModal } from '../components/modals/EventModal';
import { formatCurrency, formatDateRange, cn } from '../utils/formatters';

// Column layout: fixed table with percentage widths so all nine columns fit
// the content area without horizontal scrolling on desktop.
const COL_WIDTHS = ['w-[20%]', 'w-[12%]', 'w-[13%]', 'w-[11%]', 'w-[7%]', 'w-[10%]', 'w-[10.5%]', 'w-[10.5%]', 'w-[6%]'];

// Group-start cells get a thin vertical separator (Booking | Shoot | Billing | Status)
const GROUP_START =
  "relative pl-4 before:absolute before:left-0 before:inset-y-3.5 before:w-px before:bg-border-muted";

const STATUS_VARIANT = {
  Confirmed: 'charcoal',
  'In Progress': 'terracotta',
  Completed: 'sage',
  Cancelled: 'rose',
};

const PAYMENT_TONE = {
  Paid: { text: 'text-sage-dark', dot: 'bg-sage' },
  'Partially Paid': { text: 'text-amber-dark', dot: 'bg-amber' },
  Unpaid: { text: 'text-rose-dark', dot: 'bg-rose' },
};

function SegmentedFilter({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-0.5 bg-ivory-200 p-[3px] rounded-[9px]">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          aria-pressed={value === opt.id}
          onClick={() => onChange(opt.id)}
          className={cn(
            'h-[30px] px-3 text-[13px] rounded-md whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40',
            value === opt.id
              ? 'bg-white text-terracotta-dark font-semibold ring-1 ring-border'
              : 'text-charcoal-500 hover:text-charcoal'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function EventsPage() {
  const { events, clients, team, projects, getEventFinancials, deleteEvent, deleteAllEvents, createProjectForEvent } = useStudioData();
  const toast = useToast();
  const navigate = useNavigate();

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All'); // 'All' | 'Upcoming' | 'Past'

  // Modals
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Delete confirmation
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

  const statuses = ['All', 'Confirmed', 'In Progress', 'Completed'];

  const eventTypes = [
    'All',
    'Destination Wedding',
    'Wedding',
    'Pre-Wedding',
    'Fashion Editorial',
    'Commercial Campaign',
    'Portrait',
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingCount = events.filter((e) => e.startDate >= todayStr && e.status !== 'Cancelled').length;

  const filteredEvents = events.filter((e) => {
    const term = searchTerm.toLowerCase().trim();
    const client = clients.find((c) => c.id === e.clientId);
    const clientName = client ? client.name.toLowerCase() : '';

    const matchesSearch =
      !term ||
      e.title.toLowerCase().includes(term) ||
      e.venue.toLowerCase().includes(term) ||
      e.eventType.toLowerCase().includes(term) ||
      clientName.includes(term);

    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const matchesType = typeFilter === 'All' || e.eventType === typeFilter;

    let matchesDate = true;
    if (dateFilter === 'Upcoming') {
      matchesDate = e.startDate >= todayStr;
    } else if (dateFilter === 'Past') {
      matchesDate = e.startDate < todayStr;
    }

    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const handleOpenEdit = (evt, e) => {
    e.stopPropagation();
    setEditingEvent(evt);
    setIsEventModalOpen(true);
  };

  const handleInitiateDelete = (evt, e) => {
    e.stopPropagation();
    setEventToDelete(evt);
  };

  const handleConfirmDelete = () => {
    if (!eventToDelete) return;
    deleteEvent(eventToDelete.id);
    toast.success('Event Removed', `Deleted booking record for ${eventToDelete.title}`);
    setEventToDelete(null);
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setTypeFilter('All');
    setDateFilter('All');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <PageHeader
        title="Events & Bookings"
        className="mb-0 sm:mb-0"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4 text-rose" />}
              onClick={() => setIsDeleteAllOpen(true)}
              disabled={events.length === 0}
              className="text-rose hover:bg-rose-light hover:border-rose/30"
            >
              Delete All ({events.length})
            </Button>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleOpenCreate}
            >
              Book New Event
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
          placeholder="Search by event title, client, venue..."
          className="w-full lg:w-[340px]"
        />

        <SegmentedFilter
          label="Date filter"
          value={dateFilter}
          onChange={setDateFilter}
          options={[
            { id: 'All', label: 'All Dates' },
            { id: 'Upcoming', label: `Upcoming (${upcomingCount})` },
            { id: 'Past', label: 'Past / Done' },
          ]}
        />

        <SegmentedFilter
          label="Booking status filter"
          value={statusFilter}
          onChange={setStatusFilter}
          options={statuses.map((st) => ({ id: st, label: st }))}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label="Event type"
          className="h-[38px] px-3 text-[13px] font-medium bg-surface border border-border-strong rounded-lg text-charcoal focus:outline-none focus:ring-2 focus:ring-terracotta/25 w-full sm:w-auto lg:ml-auto"
        >
          {eventTypes.map((t) => (
            <option key={t} value={t}>
              {t === 'All' ? 'All Event Types' : t}
            </option>
          ))}
        </select>
      </div>

      {/* Events Table / List */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No events found"
          description={
            searchTerm || statusFilter !== 'All' || typeFilter !== 'All' || dateFilter !== 'All'
              ? 'No bookings match your current filter selection.'
              : 'You have not scheduled any events yet. Click below to book your first shoot.'
          }
          action={
            searchTerm || statusFilter !== 'All' || typeFilter !== 'All' || dateFilter !== 'All' ? (
              <Button variant="outline" size="sm" onClick={resetAllFilters}>
                Reset Filters
              </Button>
            ) : (
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenCreate}>
                Book First Event
              </Button>
            )
          }
        />
      ) : (
        <Card className="overflow-hidden">
          {/* Only scrolls inside the card on narrow viewports; the page itself never scrolls sideways */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[1120px] table-fixed text-left border-collapse">
              <colgroup>
                {COL_WIDTHS.map((w) => (
                  <col key={w} className={w} />
                ))}
              </colgroup>
              <thead className="select-none border-b border-border">
                {/* Column groups */}
                <tr className="border-b border-border-muted">
                  <th colSpan={2} className="h-[34px] pl-6 pr-2.5 pb-2 align-bottom text-xs font-semibold text-terracotta-dark whitespace-nowrap">Booking</th>
                  <th colSpan={3} className="h-[34px] px-2.5 pb-2 align-bottom text-xs font-semibold text-terracotta-dark whitespace-nowrap">Shoot</th>
                  <th colSpan={2} className="h-[34px] px-2.5 pb-2 align-bottom text-xs font-semibold text-terracotta-dark whitespace-nowrap">Billing</th>
                  <th colSpan={2} className="h-[34px] px-2.5 pb-2 align-bottom text-xs font-semibold text-terracotta-dark whitespace-nowrap">Status</th>
                </tr>
                <tr className="text-[12.5px] font-medium text-charcoal-400">
                  <th scope="col" className="h-[38px] pl-6 pr-2.5 whitespace-nowrap">Event & Type</th>
                  <th scope="col" className="h-[38px] px-2.5 whitespace-nowrap">Client</th>
                  <th scope="col" className={cn('h-[38px] pr-2.5 whitespace-nowrap', GROUP_START)}>Shoot Date & Time</th>
                  <th scope="col" className="h-[38px] px-2.5 whitespace-nowrap">Venue</th>
                  <th scope="col" className="h-[38px] px-2.5 whitespace-nowrap">Workspace</th>
                  <th scope="col" className={cn('h-[38px] pr-2.5 text-right whitespace-nowrap', GROUP_START)}>Agreed Price</th>
                  <th scope="col" className="h-[38px] px-2.5 whitespace-nowrap">Payment</th>
                  <th scope="col" className={cn('h-[38px] pr-2.5 whitespace-nowrap', GROUP_START)}>Status</th>
                  <th scope="col" className="h-[38px] pl-2.5 pr-3 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((evt) => {
                  const client = clients.find((c) => c.id === evt.clientId);
                  const fin = getEventFinancials(evt.id);
                  const linkedProject = projects.find((p) => p.eventId === evt.id);
                  const payTone = PAYMENT_TONE[fin.paymentStatus] || PAYMENT_TONE.Unpaid;
                  const eventSub = [evt.eventType, evt.packageName].filter(Boolean).join(' • ');

                  return (
                    <tr
                      key={evt.id}
                      onClick={() => navigate(`/events/${evt.id}`)}
                      onKeyDown={(e) => {
                        if (e.target !== e.currentTarget) return;
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/events/${evt.id}`);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      className="h-[62px] border-b border-border-muted hover:bg-ivory-50/70 transition-colors cursor-pointer group focus:outline-none focus-visible:bg-ivory-100 focus-visible:ring-1 focus-visible:ring-terracotta/40"
                    >
                      {/* Event Title & Type */}
                      <td className="pl-6 pr-2.5 align-middle">
                        <span
                          title={evt.title}
                          className="block truncate text-[14.5px] font-semibold tracking-tight text-charcoal group-hover:text-terracotta-dark transition-colors"
                        >
                          {evt.title}
                        </span>
                        <span title={eventSub} className="block truncate mt-0.5 text-xs text-charcoal-400">
                          {eventSub}
                        </span>
                      </td>

                      {/* Client */}
                      <td className="px-2.5 align-middle" onClick={(e) => e.stopPropagation()}>
                        {client ? (
                          <Link
                            to={`/clients/${client.id}`}
                            title={client.name}
                            className="block truncate text-[13.5px] font-medium text-charcoal hover:text-terracotta-dark transition-colors"
                          >
                            {client.name}
                          </Link>
                        ) : (
                          <span className="text-[13.5px] text-charcoal-400">Unassigned</span>
                        )}
                      </td>

                      {/* Shoot Date & Time: date on one line, time directly below */}
                      <td className={cn('pr-2.5 align-middle', GROUP_START)}>
                        <span className="block whitespace-nowrap text-[13.5px] font-medium tabular-nums text-charcoal">
                          {formatDateRange(evt.startDate, evt.endDate)}
                        </span>
                        <span className="block whitespace-nowrap mt-0.5 text-xs tabular-nums text-charcoal-400">
                          {evt.startTime || 'Time TBD'}
                        </span>
                      </td>

                      {/* Venue */}
                      <td className="px-2.5 align-middle">
                        <span title={evt.venue} className="block truncate text-[13.5px] text-charcoal-600">
                          {evt.venue}
                        </span>
                      </td>

                      {/* Production Workspace */}
                      <td className="px-2.5 align-middle" onClick={(e) => e.stopPropagation()}>
                        {linkedProject ? (
                          <Link
                            to={`/projects/${linkedProject.id}`}
                            className="block truncate text-[13px] text-charcoal-600 hover:text-terracotta-dark hover:underline underline-offset-2 transition-colors"
                            title={`Open workspace for ${evt.title}`}
                          >
                            {linkedProject.status}
                          </Link>
                        ) : (
                          <Button
                            size="xs"
                            variant="outline"
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              try {
                                const proj = createProjectForEvent(evt.id);
                                toast.success('Workspace Created', `Created workspace for ${evt.title}`);
                                navigate(`/projects/${proj.id}`);
                              } catch (err) {
                                toast.error('Workspace Setup Failed', err.message);
                              }
                            }}
                          >
                            Setup
                          </Button>
                        )}
                      </td>

                      {/* Agreed Price */}
                      <td className={cn('pr-2.5 text-right align-middle', GROUP_START)}>
                        <span className="block whitespace-nowrap text-sm font-semibold tabular-nums text-charcoal">
                          {formatCurrency(evt.packageValue)}
                        </span>
                      </td>

                      {/* Payment: status with outstanding balance underneath */}
                      <td className="px-2.5 align-middle">
                        <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-medium', payTone.text)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', payTone.dot)} aria-hidden="true" />
                          {fin.paymentStatus}
                        </span>
                        <span className="block whitespace-nowrap mt-0.5 text-xs tabular-nums text-charcoal-400">
                          {fin.outstandingBalance > 0 ? `${formatCurrency(fin.outstandingBalance)} due` : 'Settled'}
                        </span>
                      </td>

                      {/* Booking Status */}
                      <td className={cn('pr-2.5 align-middle', GROUP_START)}>
                        <Badge
                          size="sm"
                          variant={STATUS_VARIANT[evt.status] || 'default'}
                          className="text-xs px-2 py-1 whitespace-nowrap"
                        >
                          {evt.status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="pl-2.5 pr-3 align-middle" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-0.5">
                          <button
                            type="button"
                            onClick={(e) => handleOpenEdit(evt, e)}
                            className="p-1.5 rounded-md text-charcoal-400 hover:text-terracotta-dark hover:bg-ivory-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40"
                            title="Edit Event"
                            aria-label={`Edit ${evt.title}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleInitiateDelete(evt, e)}
                            className="p-1.5 rounded-md text-charcoal-400 hover:text-rose hover:bg-rose-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/40"
                            title="Delete Event"
                            aria-label={`Delete ${evt.title}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-border-muted text-[12.5px] text-charcoal-400">
            Showing {filteredEvents.length} of {events.length} bookings
          </div>
        </Card>
      )}

      {/* Add / Edit Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={editingEvent}
      />

      {/* Delete Event Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!eventToDelete}
        onClose={() => setEventToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Cancel & Delete Event Booking?"
        message={`Are you sure you want to delete ${eventToDelete?.title}? This will cancel the booking from the calendar and studio overview.`}
        confirmLabel="Delete Booking"
        cancelLabel="Cancel"
        isDestructive={true}
      />

      {/* Delete All Events Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDeleteAllOpen}
        onClose={() => setIsDeleteAllOpen(false)}
        onConfirm={() => {
          const count = deleteAllEvents();
          setIsDeleteAllOpen(false);
          toast.success('Events Deleted', `Successfully deleted all ${count} event bookings.`);
        }}
        title="Delete All Events?"
        message={`Are you sure you want to delete all ${events.length} event bookings? Associated workspaces, deliverables, and invoices will be safely unlinked. This action cannot be undone.`}
        confirmLabel={`Delete All (${events.length})`}
        cancelLabel="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
