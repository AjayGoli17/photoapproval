import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Search,
  Edit2,
  Trash2,
  Calendar,
  AlertTriangle,
  ExternalLink,
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
import { ClientModal } from '../components/modals/ClientModal';
import { formatCurrency, formatDate } from '../utils/formatters';

export function ClientsPage() {
  const { clients, events, getClientFinancials, deleteClient } = useStudioData();
  const toast = useToast();
  const navigate = useNavigate();

  // Filter & search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals state
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // Delete confirmation state
  const [clientToDelete, setClientToDelete] = useState(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');

  const categories = [
    'All',
    'Wedding Couple',
    'Pre-Wedding',
    'Celebrity & Fashion',
    'Commercial Campaign',
  ];

  const statuses = ['All', 'Active', 'Lead', 'Completed'];

  // Filter logic
  const filteredClients = clients.filter((c) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      c.name.toLowerCase().includes(term) ||
      (c.phone && c.phone.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.location && c.location.toLowerCase().includes(term));

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditingClient(null);
    setIsClientModalOpen(true);
  };

  const handleOpenEdit = (client, e) => {
    e.stopPropagation();
    setEditingClient(client);
    setIsClientModalOpen(true);
  };

  const handleInitiateDelete = (client, e) => {
    e.stopPropagation();
    const linkedEvents = events.filter((ev) => ev.clientId === client.id);
    if (linkedEvents.length > 0) {
      setDeleteErrorMessage(
        `This client has ${linkedEvents.length} active event booking(s) associated with them. To protect financial and schedule integrity, please reassign or delete their events before removing this client.`
      );
    } else {
      setDeleteErrorMessage('');
    }
    setClientToDelete(client);
  };

  const handleConfirmDelete = () => {
    if (!clientToDelete) return;
    try {
      deleteClient(clientToDelete.id);
      toast.success('Client Removed', `Successfully deleted client record for ${clientToDelete.name}`);
      setClientToDelete(null);
    } catch (err) {
      toast.error('Deletion Blocked', err.message);
      setClientToDelete(null);
    }
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setCategoryFilter('All');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Client Directory"
        subtitle="Manage client relationships, wedding couples, luxury commercial brands, and booking contracts."
        badge={<Badge variant="terracotta">{clients.length} Total Profiles</Badge>}
        actions={
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleOpenCreate}
          >
            Add Client
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
          placeholder="Search by client name, phone, email, or city..."
          className="w-full lg:w-80"
        />

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  statusFilter === st
                    ? 'bg-terracotta text-white shadow-2xs'
                    : 'text-charcoal-600 hover:text-charcoal hover:bg-ivory-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Category Dropdown Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium bg-surface border border-border rounded-xl text-charcoal focus:outline-none focus:ring-2 focus:ring-terracotta/25"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clients Table / List */}
      {filteredClients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No clients found"
          description={
            searchTerm || statusFilter !== 'All' || categoryFilter !== 'All'
              ? 'No client profiles match your current search and filter settings.'
              : 'Your client directory is currently empty. Add your first couple or commercial brand profile.'
          }
          action={
            searchTerm || statusFilter !== 'All' || categoryFilter !== 'All' ? (
              <Button variant="outline" size="sm" onClick={resetAllFilters}>
                Reset Filters
              </Button>
            ) : (
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenCreate}>
                Add First Client
              </Button>
            )
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-ivory-50 border-b border-border text-xs uppercase tracking-wider text-charcoal-500 font-semibold">
                <tr>
                  <th className="p-4">Client</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4 text-center">Events</th>
                  <th className="p-4">Relevant Date</th>
                  <th className="p-4 text-right">Balance Due</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredClients.map((client) => {
                  const clientEvents = events.filter((e) => e.clientId === client.id);
                  const fin = getClientFinancials(client.id);

                  // Next upcoming shoot date or latest event date
                  const relevantEvent = clientEvents
                    .filter((e) => e.status !== 'Cancelled')
                    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];

                  return (
                    <tr
                      key={client.id}
                      onClick={() => navigate(`/clients/${client.id}`)}
                      className="hover:bg-ivory-50/70 transition-colors cursor-pointer group"
                    >
                      {/* Client Name & Category */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={client.avatar} name={client.name} size="md" status={client.status} />
                          <div className="min-w-0">
                            <span className="font-semibold text-charcoal group-hover:text-terracotta transition-colors block truncate">
                              {client.name}
                            </span>
                            <span className="text-xs text-charcoal-400 block truncate">
                              {client.category} {client.location ? `• ${client.location}` : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone & Email */}
                      <td className="p-4 text-xs text-charcoal-600">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-medium text-charcoal">
                            <Phone className="w-3.5 h-3.5 text-charcoal-400" />
                            <span>{client.phone}</span>
                          </div>
                          {client.email && (
                            <div className="flex items-center gap-1.5 text-charcoal-400 truncate max-w-[180px]">
                              <Mail className="w-3.5 h-3.5 text-charcoal-400 flex-shrink-0" />
                              <span className="truncate">{client.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Linked Events Count */}
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-ivory-200 text-charcoal-700">
                          {clientEvents.length}
                        </span>
                      </td>

                      {/* Relevant Date */}
                      <td className="p-4 text-xs text-charcoal-600">
                        {relevantEvent ? (
                          <div>
                            <span className="font-medium text-charcoal block">
                              {formatDate(relevantEvent.startDate)}
                            </span>
                            <span className="text-[11px] text-charcoal-400 truncate max-w-[140px] block">
                              {relevantEvent.title}
                            </span>
                          </div>
                        ) : (
                          <span className="text-charcoal-400">No bookings</span>
                        )}
                      </td>

                      {/* Balance Due */}
                      <td className="p-4 text-right">
                        {fin.outstandingBalance > 0 ? (
                          <div>
                            <span className="font-semibold text-rose block text-sm">
                              {formatCurrency(fin.outstandingBalance)}
                            </span>
                            <span className="text-[10px] text-charcoal-400 block">
                              of {formatCurrency(fin.totalAgreed)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-sage">Paid in full</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <Badge size="sm">{client.status}</Badge>
                      </td>

                      {/* Row Actions */}
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleOpenEdit(client, e)}
                            className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal hover:bg-ivory-200 transition-colors"
                            title="Edit Client"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleInitiateDelete(client, e)}
                            className="p-1.5 rounded-lg text-charcoal-400 hover:text-rose hover:bg-rose-light transition-colors"
                            title="Delete Client"
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

      {/* Add / Edit Client Modal */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        client={editingClient}
      />

      {/* Delete Client Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={deleteErrorMessage ? 'Deletion Blocked' : 'Delete Client Record?'}
        message={
          deleteErrorMessage ||
          `Are you sure you want to delete ${clientToDelete?.name}? This record will be removed from your browser's demo storage.`
        }
        confirmLabel={deleteErrorMessage ? 'Understood' : 'Delete Client'}
        cancelLabel={deleteErrorMessage ? 'Close' : 'Cancel'}
        isDestructive={!deleteErrorMessage}
      />
    </div>
  );
}
