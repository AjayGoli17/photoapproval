import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Plus,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  Edit2,
  Trash2,
  IndianRupee,
  Users,
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { SearchInput } from '../components/common/SearchInput';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EventModal } from '../components/modals/EventModal';
import { formatCurrency, formatDate } from '../utils/formatters';

export function EventsPage() {
  const { events, clients, team, getEventFinancials, deleteEvent, deleteAllEvents } = useStudioData();
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

  const statuses = ['All', 'Confirmed', 'In Progress', 'Inquiry', 'Quoted', 'Completed', 'Cancelled'];

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
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Events & Shoot Bookings"
        subtitle="Manage royal weddings, destination ceremonies, fashion editorial days, and commercial campaigns."
        badge={<Badge variant="sage">{events.length} Total Bookings</Badge>}
        actions={
          <div className="flex items-center gap-2">
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
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
          placeholder="Search by event title, client, venue, or type..."
          className="w-full lg:w-80"
        />

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border overflow-x-auto">
            {['All', 'Confirmed', 'In Progress', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-terracotta text-white shadow-2xs'
                    : 'text-charcoal-600 hover:text-charcoal hover:bg-ivory-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Event Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium bg-surface border border-border rounded-xl text-charcoal focus:outline-none focus:ring-2 focus:ring-terracotta/25"
          >
            {eventTypes.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All Event Types' : t}
              </option>
            ))}
          </select>

          {/* Timeline filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium bg-surface border border-border rounded-xl text-charcoal focus:outline-none focus:ring-2 focus:ring-terracotta/25"
          >
            <option value="All">All Dates</option>
            <option value="Upcoming">Upcoming Shoots</option>
            <option value="Past">Past / Archived</option>
          </select>
        </div>
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[750px]">
              <thead className="bg-ivory-50 border-b border-border text-xs uppercase tracking-wider text-charcoal-500 font-semibold">
                <tr>
                  <th className="p-4">Event & Type</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Shoot Date & Time</th>
                  <th className="p-4">Venue</th>
                  <th className="p-4 text-right">Agreed Price</th>
                  <th className="p-4 text-center">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredEvents.map((evt) => {
                  const client = clients.find((c) => c.id === evt.clientId);
                  const fin = getEventFinancials(evt.id);

                  return (
                    <tr
                      key={evt.id}
                      onClick={() => navigate(`/events/${evt.id}`)}
                      className="hover:bg-ivory-50/70 transition-colors cursor-pointer group"
                    >
                      {/* Event Title & Type */}
                      <td className="p-4">
                        <div className="min-w-0">
                          <span className="font-semibold text-charcoal group-hover:text-terracotta transition-colors block truncate max-w-xs">
                            {evt.title}
                          </span>
                          <span className="text-xs text-charcoal-400 block mt-0.5">
                            {evt.eventType} {evt.packageName ? `• ${evt.packageName}` : ''}
                          </span>
                        </div>
                      </td>

                      {/* Client */}
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        {client ? (
                          <Link
                            to={`/clients/${client.id}`}
                            className="font-medium text-charcoal hover:text-terracotta transition-colors text-xs inline-flex items-center gap-1.5"
                          >
                            <Avatar src={client.avatar} name={client.name} size="xs" />
                            <span className="truncate max-w-[140px]">{client.name}</span>
                          </Link>
                        ) : (
                          <span className="text-xs text-charcoal-400">Unassigned</span>
                        )}
                      </td>

                      {/* Shoot Date & Time */}
                      <td className="p-4 text-xs text-charcoal-600">
                        <div className="space-y-0.5">
                          <span className="font-medium text-charcoal block">
                            {formatDate(evt.startDate)}
                            {evt.endDate !== evt.startDate && ` to ${formatDate(evt.endDate)}`}
                          </span>
                          {evt.startTime && (
                            <span className="text-[11px] text-charcoal-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {evt.startTime}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Venue */}
                      <td className="p-4 text-xs text-charcoal-600">
                        <div className="flex items-center gap-1.5 truncate max-w-[180px]">
                          <MapPin className="w-3.5 h-3.5 text-charcoal-400 flex-shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                      </td>

                      {/* Agreed Price */}
                      <td className="p-4 text-right">
                        <span className="font-bold text-charcoal block">
                          {formatCurrency(evt.packageValue)}
                        </span>
                        {fin.outstandingBalance > 0 && (
                          <span className="text-[10px] text-rose block">
                            Bal: {formatCurrency(fin.outstandingBalance)}
                          </span>
                        )}
                      </td>

                      {/* Payment Status */}
                      <td className="p-4 text-center">
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
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <Badge size="sm">{evt.status}</Badge>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleOpenEdit(evt, e)}
                            className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal hover:bg-ivory-200 transition-colors"
                            title="Edit Event"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleInitiateDelete(evt, e)}
                            className="p-1.5 rounded-lg text-charcoal-400 hover:text-rose hover:bg-rose-light transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
