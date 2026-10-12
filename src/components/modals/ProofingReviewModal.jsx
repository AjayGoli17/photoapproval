import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ThumbsUp,
  MessageSquare,
  AlertCircle,
  Eye,
  CheckSquare,
  Square,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Copy,
  History,
  Send,
  PackageCheck,
  Truck,
  Check,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useStudioData } from '../../context/StudioDataContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';

const REVISION_CHIPS = [
  'Warm up color temperature by +5%',
  'Crop tighter on couple portrait',
  'Soften highlight glare / lens flare',
  'Swap for alternate candid expression',
  'Remove background distraction',
];

export function ProofingReviewModal({ isOpen, onClose, deliverable }) {
  const {
    updateDeliverableItemStatus,
    publishProofForReview,
    resubmitRevisedProof,
    markDeliverableReadyForDelivery,
    markDeliverableDelivered,
  } = useStudioData();
  const toast = useToast();

  const [selectedIds, setSelectedIds] = useState([]);
  const [filterTab, setFilterTab] = useState('All'); // 'All' | 'Approved' | 'Revision Requested' | 'Pending'
  const [isRevisionInputOpen, setIsRevisionInputOpen] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [isResubmitModalOpen, setIsResubmitModalOpen] = useState(false);
  const [resubmitNotes, setResubmitNotes] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activePhotoPreview, setActivePhotoPreview] = useState(null);

  const items = deliverable?.items || [];

  // Filter items
  const filteredItems = useMemo(() => {
    if (filterTab === 'All') return items;
    return items.filter((item) => item.status === filterTab);
  }, [items, filterTab]);

  const allSelected = filteredItems.length > 0 && filteredItems.every((item) => selectedIds.includes(item.id));

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.id));
    }
  };

  const handleToggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApproveSelected = () => {
    if (selectedIds.length === 0) return;
    try {
      updateDeliverableItemStatus(deliverable.id, selectedIds, 'Approved', '', 'Studio Team');
      toast.success(
        'Spreads Approved',
        `Marked ${selectedIds.length} item(s) as Approved.`
      );
      setSelectedIds([]);
    } catch (err) {
      toast.error('Approval Error', err.message);
    }
  };

  const handleResetToPending = () => {
    if (selectedIds.length === 0) return;
    try {
      updateDeliverableItemStatus(deliverable.id, selectedIds, 'Pending', '', 'Studio Team');
      toast.success(
        'Status Reset',
        `Returned ${selectedIds.length} item(s) to Pending Review.`
      );
      setSelectedIds([]);
    } catch (err) {
      toast.error('Reset Error', err.message);
    }
  };

  const handleOpenRevisionInput = () => {
    if (selectedIds.length === 0) return;
    setRevisionFeedback('');
    setIsRevisionInputOpen(true);
  };

  const handleSubmitRevisions = (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;
    try {
      const feedback = revisionFeedback.trim() || 'Studio logged revision request.';
      updateDeliverableItemStatus(deliverable.id, selectedIds, 'Revision Requested', feedback, 'Studio Team');
      toast.success(
        'Revisions Logged',
        `Flagged ${selectedIds.length} item(s) with revision directives.`
      );
      setSelectedIds([]);
      setIsRevisionInputOpen(false);
      setRevisionFeedback('');
    } catch (err) {
      toast.error('Revision Error', err.message);
    }
  };

  const handlePublishForReview = () => {
    try {
      publishProofForReview(deliverable.id);
      toast.success('Proof Published', 'Album proof is now active and ready for client review.');
    } catch (err) {
      toast.error('Publish Error', err.message);
    }
  };

  const handleResubmitRevisedProof = (e) => {
    e.preventDefault();
    try {
      const currentVer = deliverable.proofVersion || 1;
      const nextVer = currentVer + 1;
      resubmitRevisedProof(deliverable.id, resubmitNotes || `Proof updated to v${nextVer} addressing client revision requests.`);
      toast.success(
        'Revised Proof Published',
        `Version v${nextVer} has been published. Revised spreads reset for client re-evaluation.`
      );
      setIsResubmitModalOpen(false);
      setResubmitNotes('');
    } catch (err) {
      toast.error('Resubmission Error', err.message);
    }
  };

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/proofs/${deliverable.id}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedLink(true);
      toast.success('Link Copied', 'Client review portal link copied to clipboard.');
      setTimeout(() => setCopiedLink(false), 2500);
    }).catch(() => {
      toast.error('Error', 'Unable to copy link to clipboard.');
    });
  };

  const handleOpenClientPortal = () => {
    window.open(`/proofs/${deliverable.id}`, '_blank');
  };

  // Quick single actions
  const handleQuickApprove = (item) => {
    updateDeliverableItemStatus(deliverable.id, [item.id], 'Approved', '', 'Studio Team');
    toast.success('Approved', `"${item.title}" approved.`);
  };

  const handleQuickPending = (item) => {
    updateDeliverableItemStatus(deliverable.id, [item.id], 'Pending', '', 'Studio Team');
    toast.success('Pending', `"${item.title}" reset to pending.`);
  };

  if (!deliverable) return null;

  const totalItems = deliverable.totalPhotos || items.length || 1;
  const approvedCount = deliverable.approvedPhotos || 0;
  const rejectedCount = deliverable.rejectedPhotos || 0;
  const pendingCount = deliverable.pendingPhotos !== undefined ? deliverable.pendingPhotos : Math.max(0, totalItems - approvedCount - rejectedCount);
  const approvalPercent = Math.round((approvedCount / totalItems) * 100);
  const isFullyApproved = deliverable.clientApprovalStatus === 'Approved';
  const hasRevisions = rejectedCount > 0 || deliverable.clientApprovalStatus === 'Revisions Requested';
  const currentVersion = deliverable.proofVersion || 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={deliverable.title}
      subtitle={`${deliverable.deliverableType} • Version v${currentVersion} • Deadline: ${formatDate(deliverable.deadline)}`}
      maxWidth="max-w-5xl"
    >
      <div className="space-y-5">
        {/* Studio Operations Toolbar & Client Portal Action Bar */}
        <div className="p-3.5 bg-ivory-100 rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-charcoal">Studio Review Center:</span>
            <Badge
              size="xs"
              variant={
                isFullyApproved
                  ? 'sage'
                  : hasRevisions
                  ? 'rose'
                  : deliverable.clientApprovalStatus.includes('Review')
                  ? 'terracotta'
                  : 'amber'
              }
            >
              {deliverable.clientApprovalStatus}
            </Badge>
            <Badge size="xs" variant="default" className="font-mono">
              Proof v{currentVersion}
            </Badge>
            <span className="text-charcoal-400">|</span>
            <span className="text-charcoal-600">Stage: <strong className="text-charcoal">{deliverable.deliveryStage}</strong></span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="xs"
              variant="outline"
              leftIcon={copiedLink ? <Check className="w-3.5 h-3.5 text-sage" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopyLink}
              title="Copy Client Portal URL to share with client"
            >
              {copiedLink ? 'Copied Link' : 'Copy Client Link'}
            </Button>
            <Button
              size="xs"
              variant="primary"
              className="bg-charcoal hover:bg-charcoal-800 text-white"
              leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
              onClick={handleOpenClientPortal}
            >
              Open Client Portal
            </Button>
          </div>
        </div>

        {/* Client Final Approval Banner if Approved */}
        {isFullyApproved && (
          <div className="p-4 bg-sage-light/60 border border-sage-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-sage shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sage-dark text-sm">Album Formally Approved by Client</h4>
                <p className="text-sage-dark/80 mt-0.5">
                  Signed off by: <strong>{deliverable.finalApproval?.approvedBy || 'Client'}</strong> on{' '}
                  {formatDate(deliverable.finalApproval?.approvedAt || deliverable.lastUpdated)}
                  {deliverable.finalApproval?.remarks && ` — "${deliverable.finalApproval.remarks}"`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {deliverable.deliveryStage !== 'Ready for Delivery' && deliverable.deliveryStage !== 'Delivered' && (
                <Button
                  size="xs"
                  variant="outline"
                  className="border-sage text-sage-dark hover:bg-sage-light"
                  leftIcon={<PackageCheck className="w-3.5 h-3.5" />}
                  onClick={() => {
                    markDeliverableReadyForDelivery(deliverable.id);
                    toast.success('Ready for Delivery', 'Deliverable marked ready for bindery print delivery.');
                  }}
                >
                  Mark Ready for Delivery
                </Button>
              )}
              {deliverable.deliveryStage === 'Ready for Delivery' && (
                <Button
                  size="xs"
                  variant="primary"
                  className="bg-sage hover:bg-sage-dark text-white"
                  leftIcon={<Truck className="w-3.5 h-3.5" />}
                  onClick={() => {
                    markDeliverableDelivered(deliverable.id);
                    toast.success('Marked Delivered', 'Deliverable marked as completed and delivered to client.');
                  }}
                >
                  Mark Delivered
                </Button>
              )}
              {deliverable.deliveryStage === 'Delivered' && (
                <Badge variant="sage" size="xs">
                  Delivered to Client
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Prompt when Revisions are Requested */}
        {hasRevisions && (
          <div className="p-4 bg-rose-light/50 border border-rose-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-rose-dark">Revisions Requested by Client</h4>
                <p className="text-rose-dark/80 mt-0.5">
                  {rejectedCount} spread(s) have client revision requests. Once retouching adjustments are complete, resubmit an updated proof version (v{currentVersion + 1}) to allow client re-inspection.
                </p>
              </div>
            </div>
            <Button
              size="xs"
              variant="primary"
              className="bg-rose hover:bg-rose-dark text-white shrink-0"
              leftIcon={<Send className="w-3.5 h-3.5" />}
              onClick={() => {
                setResubmitNotes(`Proof updated to v${currentVersion + 1} incorporating retouching corrections.`);
                setIsResubmitModalOpen(true);
              }}
            >
              Resubmit Revised Proof (v{currentVersion + 1})
            </Button>
          </div>
        )}

        {/* Draft Publish Prompt if Proof is in Draft */}
        {deliverable.clientApprovalStatus === 'Draft' && (
          <div className="p-3 bg-amber-light/60 border border-amber-border rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber shrink-0" />
              <span className="text-amber-dark">
                This proof is currently in <strong>Draft</strong> state. Publish it to allow client access.
              </span>
            </div>
            <Button
              size="xs"
              variant="primary"
              className="bg-amber hover:bg-amber-dark text-white"
              onClick={handlePublishForReview}
            >
              Publish for Client Review
            </Button>
          </div>
        )}

        {/* Progress & Stat Header */}
        <div className="p-4 bg-surface rounded-xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="p-2 bg-ivory-100 rounded-lg text-center min-w-[70px]">
              <span className="text-[10px] text-charcoal-400 block font-semibold uppercase">Total Spreads</span>
              <span className="text-base font-bold text-charcoal font-serif">{totalItems}</span>
            </div>
            <div className="p-2 bg-sage-light rounded-lg text-center min-w-[70px]">
              <span className="text-[10px] text-sage-dark block font-semibold uppercase">Approved</span>
              <span className="text-base font-bold text-sage-dark font-serif">{approvedCount}</span>
            </div>
            <div className="p-2 bg-amber-light rounded-lg text-center min-w-[70px]">
              <span className="text-[10px] text-amber-dark block font-semibold uppercase">Pending</span>
              <span className="text-base font-bold text-amber-dark font-serif">{pendingCount}</span>
            </div>
            <div className="p-2 bg-rose-light rounded-lg text-center min-w-[70px]">
              <span className="text-[10px] text-rose-dark block font-semibold uppercase">Revisions</span>
              <span className="text-base font-bold text-rose-dark font-serif">{rejectedCount}</span>
            </div>
          </div>

          <div className="flex-1 md:max-w-xs">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-charcoal-500 text-[11px]">Approval Progress</span>
              <span className="font-bold text-charcoal text-[11px]">{approvalPercent}%</span>
            </div>
            <div className="w-full h-2 bg-ivory-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-sage rounded-full transition-all duration-300"
                style={{ width: `${approvalPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Controls & Tab Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-ivory-50 rounded-xl border border-border">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['All', 'Approved', 'Revision Requested', 'Pending'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                  filterTab === tab
                    ? 'bg-charcoal text-white font-semibold shadow-xs'
                    : 'bg-surface text-charcoal-600 hover:bg-ivory-200 border border-border/80'
                }`}
              >
                {tab}
                {tab === 'All' && ` (${items.length})`}
                {tab === 'Approved' && ` (${approvedCount})`}
                {tab === 'Revision Requested' && ` (${rejectedCount})`}
                {tab === 'Pending' && ` (${pendingCount})`}
              </button>
            ))}
          </div>

          {/* Bulk Selection Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="text-xs font-medium text-charcoal-600 hover:text-charcoal flex items-center gap-1.5 px-2 py-1 rounded bg-surface border border-border"
            >
              {allSelected ? <CheckSquare className="w-3.5 h-3.5 text-terracotta" /> : <Square className="w-3.5 h-3.5 text-charcoal-400" />}
              <span>{allSelected ? 'Deselect All' : 'Select All'}</span>
            </button>

            {selectedIds.length > 0 && (
              <>
                <span className="text-xs font-semibold text-terracotta">
                  {selectedIds.length} selected:
                </span>
                <Button
                  size="xs"
                  variant="primary"
                  className="bg-sage hover:bg-sage-dark text-white"
                  leftIcon={<ThumbsUp className="w-3.5 h-3.5" />}
                  onClick={handleApproveSelected}
                >
                  Approve
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  className="border-rose text-rose hover:bg-rose-light"
                  leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                  onClick={handleOpenRevisionInput}
                >
                  Request Revision
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  onClick={handleResetToPending}
                >
                  Reset
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-xs text-charcoal-400 italic bg-surface rounded-xl border border-dashed border-border">
            No spreads match status "{filterTab}".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const isApproved = item.status === 'Approved';
              const isRevision = item.status === 'Revision Requested';

              return (
                <div
                  key={item.id}
                  className={`group relative rounded-xl border overflow-hidden flex flex-col justify-between transition-all bg-surface ${
                    isSelected
                      ? 'ring-2 ring-terracotta border-transparent shadow-md'
                      : 'border-border hover:shadow-xs'
                  }`}
                >
                  {/* Photo / Spread Image */}
                  <div className="relative aspect-16/10 bg-charcoal/10 overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Checkbox button */}
                    <button
                      type="button"
                      onClick={() => handleToggleSelectOne(item.id)}
                      className="absolute top-2 left-2 p-1.5 rounded-md bg-surface/90 shadow-sm border border-border text-charcoal hover:bg-surface transition-colors"
                      title={isSelected ? 'Deselect' : 'Select spread'}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-terracotta" />
                      ) : (
                        <Square className="w-4 h-4 text-charcoal-400" />
                      )}
                    </button>

                    {/* Status Pill on image */}
                    <div className="absolute top-2 right-2">
                      <Badge
                        size="xs"
                        variant={
                          isApproved ? 'sage' : isRevision ? 'rose' : 'amber'
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>

                    {/* Magnify Preview Button */}
                    <button
                      type="button"
                      onClick={() => setActivePhotoPreview(item)}
                      className="absolute bottom-2 right-2 p-1.5 rounded-md bg-charcoal/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-charcoal"
                      title="Enlarge preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Content & Feedback */}
                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-semibold text-charcoal truncate" title={item.title}>
                          {item.title}
                        </h4>
                        {item.reviewedBy && (
                          <span className="text-[10px] text-charcoal-400 shrink-0">
                            by {item.reviewedBy}
                          </span>
                        )}
                      </div>

                      {/* Display revision feedback if present */}
                      {item.feedback ? (
                        <div className="mt-1.5 p-2 bg-rose-light/50 rounded-lg border border-rose-border text-[11px] text-rose-dark leading-relaxed">
                          <div className="flex items-center gap-1 font-semibold mb-0.5">
                            <MessageSquare className="w-3 h-3 shrink-0 text-rose" />
                            <span>Client Directives:</span>
                          </div>
                          <p className="line-clamp-2">{item.feedback}</p>
                        </div>
                      ) : (
                        <span className="text-[10px] text-charcoal-400 block mt-1">
                          {item.approvedAt ? `Approved ${formatDate(item.approvedAt)}` : 'Awaiting client signoff'}
                        </span>
                      )}

                      {/* Show previous revision history note if available */}
                      {item.revisionHistory && item.revisionHistory.length > 0 && (
                        <div className="mt-1.5 pt-1 border-t border-border/50 text-[10px] text-charcoal-400 flex items-center gap-1">
                          <History className="w-3 h-3 shrink-0" />
                          <span>{item.revisionHistory.length} previous revision cycle(s) archived</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Action buttons */}
                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                      {isApproved ? (
                        <button
                          type="button"
                          onClick={() => handleQuickPending(item)}
                          className="text-[11px] text-charcoal-500 hover:text-charcoal font-medium flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleQuickApprove(item)}
                          className="text-[11px] text-sage font-semibold hover:text-sage-dark flex items-center gap-1"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedIds([item.id]);
                          setIsRevisionInputOpen(true);
                        }}
                        className="text-[11px] text-terracotta hover:underline font-medium"
                      >
                        Add Directive
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-charcoal-500">
            <span>Share Link:</span>
            <span className="font-mono text-terracotta truncate max-w-xs">{window.location.origin}/proofs/{deliverable.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close Session
            </Button>
          </div>
        </div>
      </div>

      {/* Revision Input Sub-Modal */}
      {isRevisionInputOpen && (
        <Modal
          isOpen={isRevisionInputOpen}
          onClose={() => setIsRevisionInputOpen(false)}
          title="Add Retouching / Revision Directive"
          subtitle={`Submit feedback notes for ${selectedIds.length} selected spread(s)`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSubmitRevisions} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">
                Revision Instructions
              </label>
              <textarea
                value={revisionFeedback}
                onChange={(e) => setRevisionFeedback(e.target.value)}
                placeholder="e.g. Please crop slightly on left edge, soften highlight flare, and warm skin tones..."
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-charcoal focus:ring-1 focus:ring-terracotta focus:outline-none"
                autoFocus
              />
            </div>

            {/* Suggestion Chips */}
            <div>
              <span className="text-[10px] font-semibold text-charcoal-400 block mb-1.5 uppercase">
                Quick Retouching Directives
              </span>
              <div className="flex flex-wrap gap-1.5">
                {REVISION_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setRevisionFeedback(chip)}
                    className="px-2 py-1 text-[11px] rounded bg-ivory-100 hover:bg-ivory-200 text-charcoal-700 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsRevisionInputOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Revision Directives
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Resubmit Revised Proof Sub-Modal */}
      {isResubmitModalOpen && (
        <Modal
          isOpen={isResubmitModalOpen}
          onClose={() => setIsResubmitModalOpen(false)}
          title={`Publish Revised Proof (v${currentVersion + 1})`}
          subtitle="Submit updated layouts and notify client that revisions have been addressed."
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleResubmitRevisedProof} className="space-y-4">
            <div className="p-3 bg-ivory-50 rounded-xl border border-border text-xs text-charcoal-600 space-y-1.5">
              <p>
                <strong>What happens when you resubmit?</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-charcoal-500 text-[11px]">
                <li>Proof increments from version <strong>v{currentVersion}</strong> to <strong>v{currentVersion + 1}</strong>.</li>
                <li>Previously revised spreads are reset to <em>Pending Review</em> for the client to re-evaluate.</li>
                <li>All previous client feedback comments are archived safely in revision history.</li>
                <li>Status transitions to <strong>Revised Proof Awaiting Review</strong>.</li>
              </ul>
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">
                Studio Notes to Client for this Revision
              </label>
              <textarea
                value={resubmitNotes}
                onChange={(e) => setResubmitNotes(e.target.value)}
                placeholder="Describe what changes were made in response to their feedback..."
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-charcoal focus:ring-1 focus:ring-terracotta focus:outline-none"
                autoFocus
              />
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsResubmitModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-rose hover:bg-rose-dark text-white">
                Resubmit & Publish v{currentVersion + 1}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Enlarged Photo Preview Modal */}
      {activePhotoPreview && (
        <Modal
          isOpen={Boolean(activePhotoPreview)}
          onClose={() => setActivePhotoPreview(null)}
          title={activePhotoPreview.title}
          subtitle={`Status: ${activePhotoPreview.status}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-charcoal/95 max-h-[70vh] flex items-center justify-center">
              <img
                src={activePhotoPreview.thumbnail}
                alt={activePhotoPreview.title}
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
            </div>
            {activePhotoPreview.feedback && (
              <div className="p-3 bg-rose-light/50 border border-rose-border rounded-xl text-xs text-rose-dark">
                <strong>Client Directive:</strong> {activePhotoPreview.feedback}
              </div>
            )}
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setActivePhotoPreview(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
}
