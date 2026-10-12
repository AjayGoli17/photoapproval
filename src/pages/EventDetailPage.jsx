import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  MapPin,
  Users,
  Calendar,
  IndianRupee,
  Clock,
  ArrowLeft,
  FolderKanban,
  Edit2,
  Trash2,
  Plus,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ShieldAlert,
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EventModal } from '../components/modals/EventModal';
import { RecordPaymentModal } from '../components/modals/RecordPaymentModal';
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/formatters';

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    getEvent,
    getClient,
    getTeamMember,
    projects,
    getEventFinancials,
    deleteEvent,
    createProjectForEvent,
    getTasksByProject,
    toggleTaskComplete,
    activityLog,
  } = useStudioData();

  const event = getEvent(id);
  const client = event ? getClient(event.clientId) : null;
  const leadPhotographer = event ? getTeamMember(event.leadPhotographerId) : null;
  const linkedProject = event ? projects.find((p) => p.eventId === event.id) : null;
  const eventTasks = linkedProject ? getTasksByProject(linkedProject.id) : [];
  const financials = id ? getEventFinancials(id) : null;

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!event) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Events', to: '/events' }, { label: 'Not Found' }]} />
        <EmptyState
          icon={CalendarDays}
          title="Event booking not found"
          description={`No event booking exists with ID "${id}". It may have been removed or cancelled.`}
          action={
            <Button variant="primary" onClick={() => navigate('/events')}>
              Return to Events
            </Button>
          }
        />
      </div>
    );
  }

  const handleDelete = () => {
    deleteEvent(event.id);
    toast.success('Event Deleted', `Cancelled and deleted ${event.title}`);
    navigate('/events');
  };

  const handleCreateWorkspace = () => {
    try {
      const proj = createProjectForEvent(event.id);
      toast.success('Workspace Created', `Initiated digital darkroom workspace for ${event.title}`);
      navigate(`/projects/${proj.id}`);
    } catch (err) {
      toast.error('Workspace Creation Failed', err.message);
    }
  };

  // Activity entries for this event
  const eventActivities = activityLog.filter(
    (act) => act.targetId === event.id || act.details?.toLowerCase().includes(event.title.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Breadcrumbs & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Breadcrumbs items={[{ label: 'Events', to: '/events' }, { label: event.title }]} />
        <div className="flex items-center gap-2 flex-wrap">
          {linkedProject ? (
            <Button
              size="sm"
              variant="primary"
              leftIcon={<FolderKanban className="w-4 h-4" />}
              onClick={() => navigate(`/projects/${linkedProject.id}`)}
            >
              Open Workspace
            </Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleCreateWorkspace}
            >
              Create Workspace
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            leftIcon={<CreditCard className="w-4 h-4" />}
            onClick={() => setIsPaymentModalOpen(true)}
          >
            Record Payment
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Edit2 className="w-4 h-4" />}
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Event
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="bg-rose/10 hover:bg-rose/20 text-rose border border-rose/20"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => setIsDeleteConfirmOpen(true)}
          >
            Cancel Booking
          </Button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-surface border border-border rounded-card p-4 sm:p-6 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="terracotta">{event.eventType}</Badge>
            <Badge size="md">{event.status}</Badge>
            <Badge
              size="md"
              variant={
                financials?.paymentStatus === 'Paid'
                  ? 'sage'
                  : financials?.paymentStatus === 'Partially Paid'
                  ? 'amber'
                  : 'default'
              }
            >
              {financials?.paymentStatus}
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-charcoal break-words">{event.title}</h1>
          <p className="text-sm text-charcoal-500 max-w-2xl leading-relaxed">
            {event.description || 'Custom photography studio booking coverage.'}
          </p>
        </div>

        {/* Pricing Card in Header */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 bg-ivory-100 rounded-xl border border-border/80 text-center w-full md:w-auto min-w-0 sm:min-w-[280px] shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Agreed Price</span>
            <span className="text-xs sm:text-sm font-bold text-charcoal mt-0.5 block truncate">
              {formatCurrency(financials?.agreedPrice)}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-sage block">Received</span>
            <span className="text-xs sm:text-sm font-bold text-sage mt-0.5 block truncate">
              {formatCurrency(financials?.amountReceived)}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-rose block">Balance</span>
            <span className="text-xs sm:text-sm font-bold text-rose mt-0.5 block truncate">
              {formatCurrency(financials?.outstandingBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* 3-Column Info Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Logistics & Schedule */}
        <Card className="p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
            Logistics & Schedule
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-charcoal-400 block">Venue / Location</span>
              <span className="font-semibold text-charcoal flex items-start gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                <span>{event.venue}</span>
              </span>
            </div>

            <div>
              <span className="text-xs text-charcoal-400 block">Dates & Timing</span>
              <span className="font-medium text-charcoal flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-4 h-4 text-sage flex-shrink-0" />
                <span>
                  {formatDate(event.startDate)}
                  {event.endDate !== event.startDate && ` to ${formatDate(event.endDate)}`}
                </span>
              </span>
              {event.startTime && (
                <span className="text-xs text-charcoal-500 flex items-center gap-1.5 mt-1 ml-5">
                  <Clock className="w-3.5 h-3.5 text-charcoal-400" />
                  Call Time: {event.startTime}
                </span>
              )}
            </div>

            {event.guestCount && (
              <div>
                <span className="text-xs text-charcoal-400 block">Guest Estimate</span>
                <span className="font-medium text-charcoal mt-0.5 block">
                  ~{event.guestCount} Attendees / Guests
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Card 2: Client Profile */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
              Client Profile
            </h3>
            {client && (
              <Link to={`/clients/${client.id}`} className="text-xs text-terracotta hover:underline font-medium">
                Open Profile →
              </Link>
            )}
          </div>

          {client ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar src={client.avatar} name={client.name} size="md" />
                <div className="min-w-0">
                  <Link to={`/clients/${client.id}`} className="font-semibold text-charcoal hover:text-terracotta truncate block">
                    {client.name}
                  </Link>
                  <span className="text-xs text-charcoal-400">{client.category}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-charcoal-600 pt-2 border-t border-border/60">
                {client.phone && (
                  <div>
                    Phone:{' '}
                    <a href={`tel:${client.phone}`} className="font-medium text-charcoal hover:text-terracotta hover:underline">
                      {client.phone}
                    </a>
                  </div>
                )}
                {client.email && (
                  <div>
                    Email:{' '}
                    <a href={`mailto:${client.email}`} className="font-medium text-charcoal hover:text-terracotta hover:underline truncate">
                      {client.email}
                    </a>
                  </div>
                )}
                {client.location && <div>Base: <span className="font-medium text-charcoal">{client.location}</span></div>}
              </div>
            </div>
          ) : (
            <p className="text-xs text-charcoal-400 italic">No client assigned to this booking.</p>
          )}
        </Card>

        {/* Card 3: Crew Assignment */}
        <Card className="p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
            Crew Lead & Assignment
          </h3>
          {leadPhotographer ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar src={leadPhotographer.avatar} name={leadPhotographer.name} size="md" />
                <div className="min-w-0">
                  <span className="font-semibold text-charcoal block">{leadPhotographer.name}</span>
                  <span className="text-xs text-terracotta font-medium">{leadPhotographer.role}</span>
                </div>
              </div>
              <p className="text-xs text-charcoal-500 pt-2 border-t border-border/60">
                Specialty: {leadPhotographer.specialty}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-charcoal-400 italic mb-3">No lead photographer assigned yet.</p>
              <Button size="xs" variant="outline" onClick={() => setIsEditModalOpen(true)}>
                Assign Lead
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Production Workspace Linkage & Internal Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Linked Project Workspace */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-500">
                Digital Darkroom & Production Workspace
              </h3>
              {linkedProject && <Badge size="sm">{linkedProject.status}</Badge>}
            </div>

            {linkedProject ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-ivory-200 flex-shrink-0">
                    <img src={linkedProject.coverImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <Link to={`/projects/${linkedProject.id}`} className="font-semibold text-charcoal hover:text-terracotta block">
                      {linkedProject.title}
                    </Link>
                    <span className="text-xs text-charcoal-400">
                      Delivery Target: {formatDate(linkedProject.deliveryDeadline)}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-xs text-charcoal-500 mb-1">
                    <span>Workflow Progress</span>
                    <span className="font-semibold text-charcoal">{linkedProject.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-ivory-200 rounded-full overflow-hidden">
                    <div className="h-full bg-terracotta" style={{ width: `${linkedProject.progressPercent}%` }} />
                  </div>
                </div>

                {/* Event Workspace Preparation Tasks */}
                {eventTasks.length > 0 && (
                  <div className="pt-3 border-t border-border/60">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400 block mb-2">
                      Preparation Tasks ({eventTasks.filter((t) => t.status === 'Done' || t.status === 'Completed').length}/{eventTasks.length})
                    </span>
                    <div className="space-y-1.5">
                      {eventTasks.slice(0, 3).map((task) => {
                        const isDone = task.status === 'Done' || task.status === 'Completed';
                        return (
                          <div key={task.id} className="flex items-center gap-2 text-xs bg-surface p-2 rounded-lg border border-border">
                            <button
                              type="button"
                              onClick={() => toggleTaskComplete(task.id)}
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                isDone ? 'bg-sage border-sage text-white' : 'border-border hover:border-terracotta bg-surface'
                              }`}
                              title={isDone ? 'Mark incomplete' : 'Mark done'}
                            >
                              {isDone && <CheckCircle2 className="w-3 h-3" />}
                            </button>
                            <span className={`truncate flex-1 ${isDone ? 'line-through text-charcoal-400' : 'text-charcoal font-medium'}`}>
                              {task.title}
                            </span>
                            <span className="text-[10px] text-charcoal-400 shrink-0">Due {formatDate(task.dueDate)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-2 text-xs text-charcoal-500">
                No production workspace has been created for this event yet. Create a workspace to track culling, color grading, and client proof approvals.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-border/60">
            {linkedProject ? (
              <Link to={`/projects/${linkedProject.id}`}>
                <Button size="sm" variant="outline" leftIcon={<FolderKanban className="w-4 h-4" />}>
                  Open Production Workspace
                </Button>
              </Link>
            ) : (
              <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={handleCreateWorkspace}>
                Create Production Workspace
              </Button>
            )}
          </div>
        </Card>

        {/* Requirements & Notes */}
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-500">
            Special Requirements & Notes
          </h3>
          {event.notes ? (
            <p className="text-xs text-charcoal-700 leading-relaxed bg-ivory-50 p-3.5 rounded-xl border border-border/60 whitespace-pre-wrap">
              {event.notes}
            </p>
          ) : (
            <p className="text-xs text-charcoal-400 italic">
              No special requirements or shot list instructions specified.
            </p>
          )}

          {event.packageName && (
            <div className="pt-2 text-xs text-charcoal-600">
              <span className="font-semibold text-charcoal">Package Collection: </span>
              {event.packageName}
            </div>
          )}
        </Card>
      </div>

      {/* Financial Records for this Event */}
      <Card>
        <CardHeader
          title="Recorded Payments & Invoices"
          subtitle={`All payments received and pending invoices for ${event.title}`}
          action={
            <Button size="sm" variant="outline" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsPaymentModalOpen(true)}>
              Record Advance / Payment
            </Button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[620px]">
            <thead className="bg-ivory-50 border-b border-border text-xs uppercase tracking-wider text-charcoal-500 font-semibold">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {financials?.payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-xs text-charcoal-500">
                    No payments have been recorded for this event. Click "Record Advance / Payment" above.
                  </td>
                </tr>
              ) : (
                financials?.payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-ivory-50/60">
                    <td className="p-4 font-mono font-medium text-xs text-charcoal">
                      <Link to={`/invoices/${pay.id}`} className="hover:text-terracotta underline">
                        {pay.invoiceNumber}
                      </Link>
                    </td>
                    <td className="p-4 text-xs text-charcoal-700 font-medium">{pay.type}</td>
                    <td className="p-4 font-bold text-charcoal">{formatCurrency(pay.amount)}</td>
                    <td className="p-4 text-xs text-charcoal-500">{pay.paymentMethod}</td>
                    <td className="p-4 text-xs text-charcoal-500">
                      {pay.paidDate ? formatDate(pay.paidDate) : formatDate(pay.dueDate)}
                    </td>
                    <td className="p-4">
                      <Badge size="sm">{pay.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Link to={`/invoices/${pay.id}`}>
                        <Button variant="ghost" size="xs">
                          Invoice
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Event Modal */}
      <EventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        event={event}
      />

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        eventId={event.id}
        defaultAmount={financials?.outstandingBalance}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Cancel & Delete Event Booking?"
        message={`Are you sure you want to delete ${event.title}? This will permanently remove the booking schedule and remove it from the calendar.`}
        confirmLabel="Delete Booking"
        cancelLabel="Keep Booking"
        isDestructive={true}
      />
    </div>
  );
}
