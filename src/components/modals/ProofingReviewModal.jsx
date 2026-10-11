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
  const { updateDeliverableItemStatus } = useStudioData();
  const toast = useToast();

  const [selectedIds, setSelectedIds] = useState([]);
  const [filterTab, setFilterTab] = useState('All'); // 'All' | 'Approved' | 'Revision Requested' | 'Pending'
  const [isRevisionInputOpen, setIsRevisionInputOpen] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState('');
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
      updateDeliverableItemStatus(deliverable.id, selectedIds, 'Approved');
      toast.success(
        'Photos Approved',
        `Marked ${selectedIds.length} photograph(s) as Approved.`
      );
      setSelectedIds([]);
    } catch (err) {
      toast.error('Approval Error', err.message);
    }
  };

  const handleResetToPending = () => {
    if (selectedIds.length === 0) return;
    try {
      updateDeliverableItemStatus(deliverable.id, selectedIds, 'Pending');
      toast.success(
        'Status Reset',
        `Returned ${selectedIds.length} photograph(s) to Pending Review.`
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
      const feedback = revisionFeedback.trim() || 'Client requested retouching revisions.';
      updateDeliverableItemStatus(deliverable.id, selectedIds, 'Revision Requested', feedback);
      toast.success(
        'Revisions Logged',
        `Flagged ${selectedIds.length} photograph(s) with revision directives.`
      );
      setSelectedIds([]);
      setIsRevisionInputOpen(false);
      setRevisionFeedback('');
    } catch (err) {
      toast.error('Revision Error', err.message);
    }
  };

  // Quick single actions
  const handleQuickApprove = (item) => {
    updateDeliverableItemStatus(deliverable.id, [item.id], 'Approved');
    toast.success('Approved', `"${item.title}" approved.`);
  };

  const handleQuickPending = (item) => {
    updateDeliverableItemStatus(deliverable.id, [item.id], 'Pending');
    toast.success('Pending', `"${item.title}" reset to pending.`);
  };

  if (!deliverable) return null;

  const approvalPercent = Math.round(((deliverable.approvedPhotos || 0) / (deliverable.totalPhotos || 1)) * 100);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={deliverable.title}
      subtitle={`${deliverable.deliverableType} • ${deliverable.deliveryStage} • Deadline: ${formatDate(deliverable.deadline)}`}
      maxWidth="max-w-5xl"
    >
      <div className="space-y-5">
        {/* Simulated Demo Notice */}
        <div className="p-3 bg-terracotta/10 border border-terracotta/20 rounded-xl flex items-center justify-between gap-3 text-xs text-charcoal">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-terracotta shrink-0" />
            <span>
              <strong>Simulated Proofing Session:</strong> Interactive demonstration of client review, photo selections, and retouching revision loops.
            </span>
          </div>
          <Badge variant="terracotta" size="xs">Simulated Mode</Badge>
        </div>

        {/* Progress & Stat Header */}
        <div className="p-4 bg-surface rounded-xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="p-2 bg-ivory-100 rounded-lg text-center min-w-[70px]">
              <span className="text-[10px] text-charcoal-400 block font-semibold uppercase">Total</span>
              <span className="text-base font-bold text-charcoal font-serif">{deliverable.totalPhotos}</span>
            </div>
            <div className="p-2 bg-sage-light rounded-lg text-center min-w-[70px]">
              <span className="text-[10px] text-sage-dark block font-semibold uppercase">Approved</span>
              <span className="text-base font-bold text-sage-dark font-serif">{deliverable.approvedPhotos}</span>
            </div>
            <div className="p-2 bg-amber-light rounded-lg text-center min-w-[70px]">
              <span className="text-[10px] text-amber-dark block font-semibold uppercase">Pending</span>
              <span className="text-base font-bold text-amber-dark font-serif">{deliverable.pendingPhotos}</span>
            </div>
            <div className="p-2 bg-rose-light rounded-lg text-center min-w-[70px]">
              <span className="text-[10px] text-rose-dark block font-semibold uppercase">Revisions</span>
              <span className="text-base font-bold text-rose-dark font-serif">{deliverable.rejectedPhotos}</span>
            </div>
          </div>

          <div className="flex-1 md:max-w-xs">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-charcoal-500 text-[11px]">Approval Signoff Progress</span>
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
                {tab === 'Approved' && ` (${deliverable.approvedPhotos})`}
                {tab === 'Revision Requested' && ` (${deliverable.rejectedPhotos})`}
                {tab === 'Pending' && ` (${deliverable.pendingPhotos})`}
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
                  className="border-amber text-amber-dark hover:bg-amber-light"
                  leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                  onClick={handleOpenRevisionInput}
                >
                  Request Revisions
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
            No photographs match status "{filterTab}".
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[52vh] overflow-y-auto pr-1">
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
                  {/* Photo Image */}
                  <div className="relative aspect-4/3 bg-charcoal/10 overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Checkbox badge */}
                    <button
                      type="button"
                      onClick={() => handleToggleSelectOne(item.id)}
                      className="absolute top-2 left-2 p-1.5 rounded-md bg-surface/90 shadow-sm border border-border text-charcoal hover:bg-surface transition-colors"
                      title={isSelected ? 'Deselect' : 'Select photo'}
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
                          isApproved ? 'sage' : isRevision ? 'destructive' : 'amber'
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Card Content & Feedback */}
                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-charcoal truncate" title={item.title}>
                        {item.title}
                      </h4>

                      {/* Display revision feedback if present */}
                      {item.feedback ? (
                        <div className="mt-1.5 p-2 bg-amber-light rounded-lg border border-amber-border/70 text-[11px] text-amber-dark leading-relaxed">
                          <div className="flex items-center gap-1 font-semibold mb-0.5">
                            <MessageSquare className="w-3 h-3 shrink-0" />
                            <span>Client Note:</span>
                          </div>
                          <p className="line-clamp-2">{item.feedback}</p>
                        </div>
                      ) : (
                        <span className="text-[10px] text-charcoal-400 block mt-1">
                          {item.approvedAt ? `Approved ${formatDate(item.approvedAt)}` : 'Awaiting client signoff'}
                        </span>
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
                        Add Remark
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-charcoal-500">
            Client portal URL: <span className="font-mono text-terracotta">{deliverable.shareLink}</span>
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Proofing Session
          </Button>
        </div>
      </div>

      {/* Revision Input Sub-Modal */}
      {isRevisionInputOpen && (
        <Modal
          isOpen={isRevisionInputOpen}
          onClose={() => setIsRevisionInputOpen(false)}
          title="Simulate Client Revision Request"
          subtitle={`Submit feedback remarks for ${selectedIds.length} selected photograph(s)`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSubmitRevisions} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">
                Client Retouching Remark / Request
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
                Submit Revision Directives
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </Modal>
  );
}
