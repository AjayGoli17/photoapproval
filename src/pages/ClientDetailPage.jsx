import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  FolderKanban,
  Receipt,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  IndianRupee,
  CalendarDays,
  FileText,
  Package,
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Card, CardHeader, CardContent, MetricCard } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Tabs } from '../components/common/Tabs';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ClientModal } from '../components/modals/ClientModal';
import { EventModal } from '../components/modals/EventModal';
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/formatters';

export function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const {
    getClient,
    getEventsByClient,
    getProjectsByClient,
    getPaymentsByClient,
    getClientFinancials,
    deleteClient,
    createProjectForEvent,
    deliverables,
    activityLog,
  } = useStudioData();

  const client = getClient(id);
  const clientEvents = getEventsByClient(id);
  const clientProjects = getProjectsByClient(id);
  const clientPayments = getPaymentsByClient(id);
  const financials = id ? getClientFinancials(id) : null;

  // Active tab state
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'events' | 'projects' | 'deliverables' | 'payments'

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Deliverables linked to this client's projects or events
  const clientDeliverables = useMemo(() => {
    if (!client) return [];
    const projIds = new Set(clientProjects.map((p) => p.id));
    const evtIds = new Set(clientEvents.map((e) => e.id));
    return deliverables.filter((d) => projIds.has(d.projectId) || evtIds.has(d.eventId));
  }, [deliverables, clientProjects, clientEvents, client]);

  if (!client) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Clients', to: '/clients' }, { label: 'Not Found' }]} />
        <EmptyState
          icon={Users}
          title="Client profile not found"
          description={`No client profile exists with ID "${id}". It may have been removed or never created.`}
          action={
            <Button variant="primary" onClick={() => navigate('/clients')}>
              Return to Clients
            </Button>
          }
        />
      </div>
    );
  }

  const handleDeleteClient = () => {
    if (clientEvents.length > 0) {
      toast.error('Deletion Blocked', `Cannot delete client with ${clientEvents.length} active event bookings.`);
      setIsDeleteConfirmOpen(false);
      return;
    }
    try {
      deleteClient(client.id);
      toast.success('Client Removed', `Deleted profile for ${client.name}`);
      navigate('/clients');
    } catch (err) {
      toast.error('Deletion Failed', err.message);
    }
  };

  const handleCreateWorkspace = (eventId) => {
    try {
      const proj = createProjectForEvent(eventId);
      toast.success('Workspace Created', 'Generated project workspace for event');
      navigate(`/projects/${proj.id}`);
    } catch (err) {
      toast.error('Creation Failed', err.message);
    }
  };

  // Filter client-specific activities
  const clientActivities = activityLog.filter(
    (act) => act.targetId === client.id || act.details?.toLowerCase().includes(client.name.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Breadcrumbs items={[{ label: 'Clients', to: '/clients' }, { label: client.name }]} />
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Edit2 className="w-4 h-4" />}
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Client
          </Button>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsEventModalOpen(true)}
          >
            Book New Event
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="bg-rose/10 hover:bg-rose/20 text-rose border border-rose/20"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => setIsDeleteConfirmOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-surface border border-border rounded-card p-4 sm:p-6 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <Avatar src={client.avatar} name={client.name} size="xl" status={client.status} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-charcoal break-words">{client.name}</h1>
              <Badge size="md">{client.status}</Badge>
            </div>
            <p className="text-sm text-charcoal-500 mt-1">
              {client.category}
              {client.contactPerson && client.contactPerson !== client.name && (
                <> • Contact Person: <span className="text-charcoal font-medium">{client.contactPerson}</span></>
              )}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-charcoal-600">
              {client.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                  <span>{client.location}</span>
                </span>
              )}
              {client.email && (
                <a
                  href={`mailto:${client.email}`}
                  className="flex items-center gap-1.5 hover:text-terracotta hover:underline transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                  <span className="truncate">{client.email}</span>
                </a>
              )}
              {client.phone && (
                <a
                  href={`tel:${client.phone}`}
                  className="flex items-center gap-1.5 hover:text-terracotta hover:underline transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                  <span>{client.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Financial Summary Card */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-3.5 bg-ivory-100 rounded-xl border border-border/80 w-full md:w-auto text-center shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Agreed Value</span>
            <span className="text-xs sm:text-sm font-bold text-charcoal mt-0.5 block truncate">
              {formatCurrency(financials.totalAgreed)}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-sage block">Received</span>
            <span className="text-xs sm:text-sm font-bold text-sage mt-0.5 block truncate">
              {formatCurrency(financials.totalReceived)}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-rose block">Balance</span>
            <span className="text-xs sm:text-sm font-bold text-rose mt-0.5 block truncate">
              {formatCurrency(financials.outstandingBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { key: 'overview', label: 'Overview' },
          { key: 'events', label: 'Booked Events', count: clientEvents.length },
          { key: 'projects', label: 'Projects', count: clientProjects.length },
          { key: 'deliverables', label: 'Deliverables', count: clientDeliverables.length },
          { key: 'payments', label: 'Invoices & Payments', count: clientPayments.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="underline"
      />

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notes / Preferences */}
            <Card className="lg:col-span-2 p-5 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-500">
                Client Notes & Production Requirements
              </h3>
              {client.notes ? (
                <p className="text-sm text-charcoal-700 leading-relaxed bg-ivory-50 p-4 rounded-xl border border-border/60">
                  {client.notes}
                </p>
              ) : (
                <p className="text-xs text-charcoal-400 italic">
                  No internal notes recorded yet. Click "Edit Client" to record preferences.
                </p>
              )}
            </Card>

            {/* Account Quick Stats */}
            <Card className="p-5 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-500">
                Account Summary
              </h3>
              <div className="divide-y divide-border/60 text-xs text-charcoal-600">
                <div className="py-2 flex justify-between">
                  <span>Client Since</span>
                  <span className="font-semibold text-charcoal">{formatDate(client.createdAt)}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Total Bookings</span>
                  <span className="font-semibold text-charcoal">{clientEvents.length}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Production Projects</span>
                  <span className="font-semibold text-charcoal">{clientProjects.length}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Deliverables</span>
                  <span className="font-semibold text-charcoal">{clientDeliverables.length}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Settlement Status</span>
                  <span className={`font-semibold ${financials.outstandingBalance === 0 ? 'text-sage' : 'text-amber-dark'}`}>
                    {financials.outstandingBalance === 0 ? 'Settled in full' : `${formatCurrency(financials.outstandingBalance)} due`}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Deliverables Quick Summary */}
          {clientDeliverables.length > 0 && (
            <Card>
              <CardHeader
                title="Client Deliverables"
                subtitle="Production deliverables and handover status"
                action={
                  <Button size="xs" variant="ghost" onClick={() => setActiveTab('deliverables')} rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                    View All ({clientDeliverables.length})
                  </Button>
                }
              />
              <div className="divide-y divide-border/60">
                {clientDeliverables.slice(0, 3).map((deliv) => {
                  return (
                    <div key={deliv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-ivory-50/70">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-charcoal">{deliv.title}</h4>
                          <Badge
                            size="xs"
                            variant={
                              deliv.deliveryStage === 'Delivered'
                                ? 'sage'
                                : deliv.deliveryStage === 'Ready for Delivery'
                                ? 'amber'
                                : 'default'
                            }
                          >
                            {deliv.deliveryStage}
                          </Badge>
                        </div>
                        <p className="text-xs text-charcoal-400 mt-0.5">
                          Type: {deliv.deliverableType} &bull; Deadline: {formatDate(deliv.deadline)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => setActiveTab('deliverables')}
                          rightIcon={<ChevronRight className="w-3 h-3" />}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Linked Events Snapshot */}
          <Card>
            <CardHeader
              title="Booked Events"
              subtitle="Scheduled shoot dates and packages"
              action={
                <Button size="xs" variant="outline" onClick={() => setIsEventModalOpen(true)}>
                  + Book Event
                </Button>
              }
            />
            <div className="divide-y divide-border/60">
              {clientEvents.length === 0 ? (
                <div className="p-6 text-center text-xs text-charcoal-500">
                  No events booked for this client yet. Click "Book New Event" above to create one.
                </div>
              ) : (
                clientEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => navigate(`/events/${evt.id}`)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-ivory-50/70 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="terracotta" size="sm">{evt.eventType}</Badge>
                        <Badge size="sm">{evt.status}</Badge>
                      </div>
                      <h4 className="text-sm font-semibold text-charcoal hover:text-terracotta mt-1">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-charcoal-400 mt-0.5">
                        {formatDate(evt.startDate)} • {evt.venue}
                      </p>
                    </div>

                    <div className="text-right sm:self-center">
                      <span className="text-sm font-bold text-charcoal block">
                        {formatCurrency(evt.packageValue)}
                      </span>
                      <span className="text-xs text-terracotta font-medium flex items-center justify-end gap-1 mt-0.5">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Events */}
      {activeTab === 'events' && (
        <Card className="divide-y divide-border/60">
          <CardHeader
            title="All Booked Events & Shoots"
            subtitle={`${clientEvents.length} events booked by ${client.name}`}
            action={
              <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsEventModalOpen(true)}>
                Book New Event
              </Button>
            }
          />
          {clientEvents.length === 0 ? (
            <div className="p-8 text-center text-sm text-charcoal-500">
              No events booked for this client.
            </div>
          ) : (
            clientEvents.map((evt) => {
              const linkedProj = clientProjects.find((p) => p.eventId === evt.id);
              return (
                <div
                  key={evt.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-ivory-50/70"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="terracotta" size="sm">{evt.eventType}</Badge>
                      <Badge size="sm">{evt.status}</Badge>
                      {linkedProj && (
                        <Badge size="xs" variant="sage">
                          Workspace: {linkedProj.status}
                        </Badge>
                      )}
                    </div>
                    <h4
                      onClick={() => navigate(`/events/${evt.id}`)}
                      className="text-base font-semibold text-charcoal hover:text-terracotta cursor-pointer"
                    >
                      {evt.title}
                    </h4>
                    <p className="text-xs text-charcoal-500 mt-1">{evt.venue} • {formatDate(evt.startDate)}</p>
                    {evt.description && <p className="text-xs text-charcoal-600 mt-1">{evt.description}</p>}
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 shrink-0">
                    <span className="text-base font-bold text-charcoal block">{formatCurrency(evt.packageValue)}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => navigate(`/events/${evt.id}`)}
                      >
                        Event Details
                      </Button>
                      {linkedProj ? (
                        <Button
                          size="xs"
                          variant="primary"
                          leftIcon={<FolderKanban className="w-3.5 h-3.5" />}
                          onClick={() => navigate(`/projects/${linkedProj.id}`)}
                        >
                          Open Workspace
                        </Button>
                      ) : (
                        <Button
                          size="xs"
                          variant="primary"
                          leftIcon={<Plus className="w-3.5 h-3.5" />}
                          onClick={() => handleCreateWorkspace(evt.id)}
                        >
                          Create Workspace
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </Card>
      )}

      {/* Tab: Projects */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {clientProjects.length === 0 ? (
            <div className="col-span-2 p-8 text-center text-sm text-charcoal-500 bg-surface rounded-card border border-border">
              No production projects currently created for this client. Projects can be generated when booking events.
            </div>
          ) : (
            clientProjects.map((p) => (
              <Card
                key={p.id}
                hover
                onClick={() => navigate(`/projects/${p.id}`)}
                className="p-5 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="terracotta" size="sm">{p.category}</Badge>
                    <Badge size="sm">{p.status}</Badge>
                  </div>
                  <h4 className="text-base font-semibold text-charcoal mt-2 hover:text-terracotta">{p.title}</h4>
                  <p className="text-xs text-charcoal-400 mt-1">Delivery: {formatDate(p.deliveryDeadline)}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60">
                  <div className="flex justify-between text-xs text-charcoal-500 mb-1">
                    <span>Progress</span>
                    <span className="font-semibold text-charcoal">{p.progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-ivory-200 rounded-full overflow-hidden">
                    <div className="h-full bg-terracotta" style={{ width: `${p.progressPercent}%` }} />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Tab: Deliverables */}
      {activeTab === 'deliverables' && (
        <Card className="divide-y divide-border/60">
          <CardHeader
            title="Client Deliverables"
            subtitle={`All deliverables and digital handovers for ${client.name}`}
          />
          {clientDeliverables.length === 0 ? (
            <div className="p-8 text-center text-sm text-charcoal-500">
              <Package className="w-10 h-10 text-charcoal-300 mx-auto mb-2" />
              <h4 className="font-semibold text-charcoal font-serif">No Deliverables Recorded</h4>
              <p className="text-xs text-charcoal-400 mt-1">
                Deliverables created in this client's project workspaces will appear here.
              </p>
            </div>
          ) : (
            clientDeliverables.map((deliv) => {
              return (
                <div key={deliv.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-ivory-50/60">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-charcoal font-serif">{deliv.title}</h4>
                      <Badge
                        size="sm"
                        variant={
                          deliv.deliveryStage === 'Delivered'
                            ? 'sage'
                            : deliv.deliveryStage === 'Ready for Delivery'
                            ? 'amber'
                            : 'default'
                        }
                      >
                        {deliv.deliveryStage}
                      </Badge>
                    </div>
                    <p className="text-xs text-charcoal-500">
                      Type: <span className="font-medium text-charcoal">{deliv.deliverableType}</span> &bull; Due: {formatDate(deliv.deadline)}
                    </p>
                    {deliv.description && (
                      <p className="text-xs text-charcoal-600 pt-1 leading-relaxed">
                        {deliv.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {deliv.projectId && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/projects/${deliv.projectId}`)}
                      >
                        Workspace
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </Card>
      )}

      {/* Tab: Payments */}
      {activeTab === 'payments' && (
        <Card>
          <CardHeader
            title="Invoices & Transactions"
            subtitle={`All invoices and deposit records for ${client.name}`}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="bg-ivory-50 border-b border-border text-xs uppercase tracking-wider text-charcoal-500 font-semibold">
                <tr>
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {clientPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-xs text-charcoal-500">
                      No invoices or payments logged for this client.
                    </td>
                  </tr>
                ) : (
                  clientPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-ivory-50/60">
                      <td className="p-4 font-mono font-medium text-xs text-charcoal">
                        {pay.invoiceNumber}
                      </td>
                      <td className="p-4 font-medium text-charcoal">{pay.description}</td>
                      <td className="p-4 font-semibold text-charcoal">{formatCurrency(pay.amount)}</td>
                      <td className="p-4 text-xs text-charcoal-500">{formatDate(pay.dueDate)}</td>
                      <td className="p-4">
                        <Badge size="sm">{pay.status}</Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Link to={`/invoices/${pay.id}`}>
                          <Button variant="ghost" size="xs" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                            View Invoice
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
      )}

      {/* Edit Client Modal */}
      <ClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        client={client}
      />

      {/* Create Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        preselectedClientId={client.id}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteClient}
        title={`Delete Profile for ${client.name}?`}
        message={`Are you sure you want to permanently delete this client record? This action cannot be undone.`}
        confirmLabel="Delete Client"
        cancelLabel="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
