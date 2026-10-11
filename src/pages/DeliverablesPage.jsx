import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ThumbsUp,
  XCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  Image as ImageIcon,
  Edit2,
  Trash2,
  Sparkles,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { SearchInput } from '../components/common/SearchInput';
import { ProofingReviewModal } from '../components/modals/ProofingReviewModal';
import { DeliverableModal } from '../components/modals/DeliverableModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { formatDate } from '../utils/formatters';

export function DeliverablesPage() {
  const { deliverables, projects, clients, events, deleteDeliverable, deleteAllDeliverables } = useStudioData();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Modal states
  const [activeProofingDeliv, setActiveProofingDeliv] = useState(null);
  const [isDeliverableModalOpen, setIsDeliverableModalOpen] = useState(false);
  const [editingDeliverable, setEditingDeliverable] = useState(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [deliverableToDelete, setDeliverableToDelete] = useState(null);

  // Enriched deliverables
  const enrichedDeliverables = useMemo(() => {
    return deliverables.map((deliv) => {
      const project = projects.find((p) => p.id === deliv.projectId);
      const client = project ? clients.find((c) => c.id === project.clientId) : null;
      const event = project ? events.find((e) => e.id === project.eventId) : null;

      const total = deliv.totalPhotos || (deliv.items ? deliv.items.length : 0);
      const approved = deliv.approvedPhotos || (deliv.items ? deliv.items.filter((i) => i.status === 'Approved').length : 0);
      const rejected = deliv.rejectedPhotos || (deliv.items ? deliv.items.filter((i) => i.status === 'Revision Requested').length : 0);
      const pending = deliv.pendingPhotos !== undefined ? deliv.pendingPhotos : Math.max(0, total - approved - rejected);
      const approvalPercent = total > 0 ? Math.round((approved / total) * 100) : 0;

      return {
        ...deliv,
        projectTitle: project?.title || 'Standalone Project',
        clientName: client?.name || 'Valued Client',
        eventType: event?.eventType || 'Photography Shoot',
        totalPhotos: total,
        approvedPhotos: approved,
        rejectedPhotos: rejected,
        pendingPhotos: pending,
        approvalPercent,
      };
    });
  }, [deliverables, projects, clients, events]);

  // Metrics
  const summaryMetrics = useMemo(() => {
    const projectsWithDeliverables = new Set(deliverables.map((d) => d.projectId).filter(Boolean)).size;
    const awaitingApproval = deliverables.filter(
      (d) => d.clientApprovalStatus === 'Pending' || d.clientApprovalStatus === 'Pending Review' || d.clientApprovalStatus === 'In Review' || d.clientApprovalStatus === 'Partially Approved'
    ).length;
    const approvedCount = deliverables.filter((d) => d.clientApprovalStatus === 'Approved').length;
    const revisionsRequested = deliverables.filter((d) => d.clientApprovalStatus === 'Revisions Requested').length;

    return {
      projectsWithDeliverables,
      awaitingApproval,
      approvedCount,
      revisionsRequested,
    };
  }, [deliverables]);

  // Filtered deliverables
  const filteredDeliverables = useMemo(() => {
    return enrichedDeliverables.filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.clientName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' ||
        d.clientApprovalStatus.toLowerCase().includes(statusFilter.toLowerCase());

      const matchesStage = stageFilter === 'All' || d.deliveryStage === stageFilter;
      const matchesType = typeFilter === 'All' || d.deliverableType === typeFilter;

      return matchesSearch && matchesStatus && matchesStage && matchesType;
    });
  }, [enrichedDeliverables, searchTerm, statusFilter, stageFilter, typeFilter]);

  const handleDelete = (deliv) => {
    setDeliverableToDelete(deliv);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deliverables & Client Approvals"
        subtitle="Manage client photo selection galleries, album proof signoffs, digital master archives, and revision directives."
        badge={<Badge variant="sage">{deliverables.length} Deliverable Collections</Badge>}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4 text-rose" />}
              onClick={() => setIsDeleteAllOpen(true)}
              disabled={deliverables.length === 0}
              className="text-rose hover:bg-rose-light hover:border-rose/30"
            >
              Delete All ({deliverables.length})
            </Button>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingDeliverable(null);
                setIsDeliverableModalOpen(true);
              }}
            >
              Publish Deliverable
            </Button>
          </div>
        }
      />

      {/* Summary Metrics Cards (Req 3A) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 bg-surface">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400 block">
            Workspaces with Proofs
          </span>
          <div className="text-2xl font-bold text-charcoal mt-2 font-serif">
            {summaryMetrics.projectsWithDeliverables}
          </div>
          <span className="text-xs text-charcoal-500 mt-0.5 block">Active client delivery pipelines</span>
        </Card>

        <Card className="p-4 bg-surface">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber block">
            Awaiting Client Approval
          </span>
          <div className="text-2xl font-bold text-amber font-serif mt-2">
            {summaryMetrics.awaitingApproval}
          </div>
          <span className="text-xs text-amber-dark mt-0.5 block">Proofs in review or pending</span>
        </Card>

        <Card className="p-4 bg-surface">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-sage block">
            Approved Deliverables
          </span>
          <div className="text-2xl font-bold text-sage font-serif mt-2">
            {summaryMetrics.approvedCount}
          </div>
          <span className="text-xs text-sage-dark mt-0.5 block">Client signed-off & completed</span>
        </Card>

        <Card className="p-4 bg-surface">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose block">
            Revisions Requested
          </span>
          <div className="text-2xl font-bold text-rose-dark font-serif mt-2">
            {summaryMetrics.revisionsRequested}
          </div>
          <span className="text-xs text-rose-dark mt-0.5 block">Requires darkroom retouching loop</span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-surface rounded-xl border border-border">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search by collection, project, or client..."
            className="w-full sm:w-64"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-ivory-50 text-charcoal hover:bg-surface focus:outline-none focus:ring-1 focus:ring-terracotta"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="In Review">In Review</option>
            <option value="Approved">Approved</option>
            <option value="Revisions">Revisions Requested</option>
          </select>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-ivory-50 text-charcoal hover:bg-surface focus:outline-none focus:ring-1 focus:ring-terracotta"
          >
            <option value="All">All Delivery Stages</option>
            <option value="Culling">Culling</option>
            <option value="First Proofs">First Proofs</option>
            <option value="Client Selection">Client Selection</option>
            <option value="Final Handover">Final Handover</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-ivory-50 text-charcoal hover:bg-surface focus:outline-none focus:ring-1 focus:ring-terracotta"
          >
            <option value="All">All Types</option>
            <option value="Preview Gallery">Preview Gallery</option>
            <option value="Edited Proofs">Edited Proofs</option>
            <option value="Wedding Album Layout">Wedding Album Layout</option>
            <option value="Print Master TIFFs">Print Master TIFFs</option>
            <option value="High-Res Digital Delivery">High-Res Digital Delivery</option>
          </select>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-ivory-50 shrink-0 self-end md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded text-xs transition-colors ${
              viewMode === 'cards'
                ? 'bg-surface text-terracotta shadow-xs font-semibold'
                : 'text-charcoal-400 hover:text-charcoal'
            }`}
            title="Card View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded text-xs transition-colors ${
              viewMode === 'table'
                ? 'bg-surface text-terracotta shadow-xs font-semibold'
                : 'text-charcoal-400 hover:text-charcoal'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Deliverables Display */}
      {filteredDeliverables.length === 0 ? (
        <Card className="p-12 text-center bg-surface border-dashed">
          <Package className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-charcoal font-serif">No Deliverables Found</h3>
          <p className="text-xs text-charcoal-500 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'All'
              ? 'No collections match your filter parameters. Try clearing your search.'
              : 'Publish your first photography proofing package to start collecting client selections.'}
          </p>
          <div className="mt-4">
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingDeliverable(null);
                setIsDeliverableModalOpen(true);
              }}
            >
              Publish Deliverable
            </Button>
          </div>
        </Card>
      ) : viewMode === 'cards' ? (
        /* Cards View */
        <div className="space-y-4">
          {filteredDeliverables.map((deliv) => {
            const isApproved = deliv.clientApprovalStatus === 'Approved';
            const isRevision = deliv.clientApprovalStatus === 'Revisions Requested';

            return (
              <Card key={deliv.id} className="p-4 sm:p-6 transition-all hover:border-charcoal/30">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Info */}
                  <div className="space-y-2 min-w-0 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        size="sm"
                        variant={
                          isApproved
                            ? 'sage'
                            : isRevision
                            ? 'destructive'
                            : deliv.clientApprovalStatus.includes('Review') || deliv.clientApprovalStatus.includes('Progress')
                            ? 'terracotta'
                            : 'amber'
                        }
                      >
                        {deliv.clientApprovalStatus}
                      </Badge>
                      <span className="text-xs text-charcoal-500 font-medium">
                        Stage: {deliv.deliveryStage || 'Client Selection'}
                      </span>
                      <span className="text-xs text-charcoal-400">
                        &bull; Due: {formatDate(deliv.deadline)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-charcoal font-serif">{deliv.title}</h3>

                    <p className="text-xs text-charcoal-600">
                      Project:{' '}
                      <Link to={`/projects/${deliv.projectId}`} className="text-terracotta hover:underline font-medium">
                        {deliv.projectTitle}
                      </Link>{' '}
                      &bull; Client: <span className="font-semibold text-charcoal">{deliv.clientName}</span>
                    </p>

                    <p className="text-xs text-charcoal-500 line-clamp-2 leading-relaxed">
                      {deliv.description}
                    </p>

                    <div className="pt-1 flex items-center gap-2 text-xs font-mono text-charcoal-400">
                      <ExternalLink className="w-3.5 h-3.5 text-terracotta shrink-0" />
                      <span className="text-terracotta truncate">{deliv.shareLink}</span>
                    </div>
                  </div>

                  {/* Middle Stats */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:self-center">
                    <div className="flex items-center gap-2.5 p-2.5 bg-ivory-100 rounded-xl border border-border/60">
                      <div className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center text-charcoal-500 shadow-2xs">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-charcoal-400 block font-semibold uppercase">Total</span>
                        <span className="text-sm font-bold text-charcoal font-serif">{deliv.totalPhotos}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-2.5 bg-sage-light rounded-xl border border-sage-border/60">
                      <div className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center text-sage shadow-2xs">
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-sage-dark block font-semibold uppercase">Approved</span>
                        <span className="text-sm font-bold text-sage-dark font-serif">{deliv.approvedPhotos}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-2.5 bg-amber-light rounded-xl border border-amber-border/60">
                      <div className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center text-amber shadow-2xs">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-dark block font-semibold uppercase">Pending</span>
                        <span className="text-sm font-bold text-amber-dark font-serif">{deliv.pendingPhotos}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-2.5 bg-rose-light rounded-xl border border-rose-border/60">
                      <div className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center text-rose shadow-2xs">
                        <XCircle className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-rose-dark block font-semibold uppercase">Revisions</span>
                        <span className="text-sm font-bold text-rose-dark font-serif">{deliv.rejectedPhotos}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2 shrink-0">
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-terracotta hover:bg-terracotta-hover"
                      leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                      onClick={() => setActiveProofingDeliv(deliv)}
                    >
                      Review Proofs
                    </Button>

                    <div className="flex items-center gap-1.5 self-center lg:self-end">
                      <Button
                        variant="outline"
                        size="xs"
                        leftIcon={<Edit2 className="w-3 h-3" />}
                        onClick={() => {
                          setEditingDeliverable(deliv);
                          setIsDeliverableModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDelete(deliv)}
                        className="p-1.5 text-charcoal-400 hover:text-red-600 rounded transition-colors"
                        title="Delete Deliverable"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-border/60">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-charcoal-500 text-[11px]">
                      Client Approval Progress &bull; Last updated {formatDate(deliv.lastUpdated)}
                    </span>
                    <span className="font-bold text-charcoal text-[11px] font-serif">
                      {deliv.approvalPercent}% Complete
                    </span>
                  </div>
                  <div className="w-full h-2 bg-ivory-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sage rounded-full transition-all duration-300"
                      style={{ width: `${deliv.approvalPercent}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <Card className="overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-ivory-50 text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Deliverable Package</th>
                  <th className="py-3 px-4">Project & Client</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4 text-center">Approved</th>
                  <th className="py-3 px-4 text-center">Pending</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredDeliverables.map((deliv) => (
                  <tr key={deliv.id} className="hover:bg-ivory-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-charcoal font-serif">{deliv.title}</div>
                      <div className="text-[11px] text-charcoal-400">{deliv.deliverableType}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Link to={`/projects/${deliv.projectId}`} className="text-terracotta hover:underline font-medium block">
                        {deliv.projectTitle}
                      </Link>
                      <div className="text-[11px] text-charcoal-500">{deliv.clientName}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-charcoal-700">{deliv.deliveryStage}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-sage">
                      {deliv.approvedPhotos} / {deliv.totalPhotos}
                    </td>

                    <td className="py-3.5 px-4 text-center font-medium text-amber">
                      {deliv.pendingPhotos}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        size="xs"
                        variant={
                          deliv.clientApprovalStatus === 'Approved'
                            ? 'sage'
                            : deliv.clientApprovalStatus === 'Revisions Requested'
                            ? 'destructive'
                            : 'amber'
                        }
                      >
                        {deliv.clientApprovalStatus}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-600">
                      {formatDate(deliv.deadline)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setActiveProofingDeliv(deliv)}
                        >
                          Review
                        </Button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDeliverable(deliv);
                            setIsDeliverableModalOpen(true);
                          }}
                          className="p-1 text-charcoal-400 hover:text-terracotta"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Proofing Interactive Review Modal */}
      {activeProofingDeliv && (
        <ProofingReviewModal
          isOpen={Boolean(activeProofingDeliv)}
          onClose={() => setActiveProofingDeliv(null)}
          deliverable={deliverables.find((d) => d.id === activeProofingDeliv.id) || activeProofingDeliv}
        />
      )}

      {/* Deliverable Creation / Edit Modal */}
      <DeliverableModal
        isOpen={isDeliverableModalOpen}
        onClose={() => {
          setIsDeliverableModalOpen(false);
          setEditingDeliverable(null);
        }}
        deliverable={editingDeliverable}
      />

      {/* Delete All Deliverables Dialog */}
      <ConfirmDialog
        isOpen={isDeleteAllOpen}
        onClose={() => setIsDeleteAllOpen(false)}
        onConfirm={() => {
          const count = deliverables.length;
          deleteAllDeliverables();
          setIsDeleteAllOpen(false);
          setActiveProofingDeliv(null);
          toast.success('Deliverables Cleared', `Successfully deleted all ${count} deliverables.`);
        }}
        title="Delete All Deliverables?"
        message={`Are you sure you want to delete all ${deliverables.length} deliverables? This will remove all proofs, selections, and client galleries. This action cannot be undone.`}
        confirmLabel={`Delete All (${deliverables.length})`}
        isDestructive={true}
      />

      {/* Delete Single Deliverable Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deliverableToDelete)}
        onClose={() => setDeliverableToDelete(null)}
        onConfirm={() => {
          if (!deliverableToDelete) return;
          try {
            deleteDeliverable(deliverableToDelete.id);
            toast.success('Deliverable Removed', `Deleted ${deliverableToDelete.title}`);
          } catch (err) {
            toast.error('Deletion Failed', err.message);
          } finally {
            setDeliverableToDelete(null);
          }
        }}
        title="Remove Deliverable?"
        message={`Are you sure you want to remove deliverable "${deliverableToDelete?.title || ''}"? This action cannot be undone.`}
        confirmLabel="Remove Deliverable"
        cancelLabel="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
