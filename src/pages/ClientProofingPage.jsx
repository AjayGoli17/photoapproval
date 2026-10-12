import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Maximize2,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Calendar,
  Clock,
  ShieldCheck,
  Heart,
  Share2,
  Download,
  Eye,
  Check,
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { formatDate } from '../utils/formatters';

export function ClientProofingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    getDeliverable,
    getProject,
    getClient,
    submitSpreadReview,
    submitFinalAlbumApproval,
  } = useStudioData();

  const deliverable = getDeliverable(id);
  const project = deliverable ? getProject(deliverable.projectId) : null;
  const client = project ? getClient(project.clientId) : null;

  // View mode: 'spread' (large sequential viewer) or 'grid' (overview gallery)
  const [viewMode, setViewMode] = useState('spread');
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);

  // Revision modal state
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionItem, setRevisionItem] = useState(null);
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [revisionError, setRevisionError] = useState('');

  // Final approval modal state
  const [isFinalApprovalModalOpen, setIsFinalApprovalModalOpen] = useState(false);
  const [signoffName, setSignoffName] = useState('');
  const [signoffRemarks, setSignoffRemarks] = useState('');
  const [confirmedTerms, setConfirmedTerms] = useState(false);

  // Fullscreen zoom image preview
  const [zoomedImage, setZoomedImage] = useState(null);

  const items = deliverable?.items || [];
  const currentItem = items[currentSpreadIndex] || null;

  // Set default signoff name from client record
  useEffect(() => {
    if (client && !signoffName) {
      setSignoffName(client.name);
    }
  }, [client, signoffName]);

  // Keyboard navigation for spread viewer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isRevisionModalOpen || isFinalApprovalModalOpen || zoomedImage) return;
      if (e.key === 'ArrowRight' && currentSpreadIndex < items.length - 1) {
        setCurrentSpreadIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentSpreadIndex > 0) {
        setCurrentSpreadIndex((prev) => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSpreadIndex, items.length, isRevisionModalOpen, isFinalApprovalModalOpen, zoomedImage]);

  // Counters
  const totalSpreads = items.length;
  const approvedCount = items.filter((i) => i.status === 'Approved').length;
  const revisionCount = items.filter((i) => i.status === 'Revision Requested').length;
  const pendingCount = items.filter((i) => i.status === 'Pending').length;
  const progressPercent = totalSpreads > 0 ? Math.round((approvedCount / totalSpreads) * 100) : 0;
  const isAllApproved = totalSpreads > 0 && approvedCount === totalSpreads;
  const isAlreadyApproved = deliverable?.clientApprovalStatus === 'Approved';

  if (!deliverable) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-charcoal">
        <div className="max-w-md w-full bg-surface p-8 rounded-2xl border border-border text-center shadow-subtle space-y-4">
          <div className="w-12 h-12 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-serif">Proofing Album Not Found</h2>
          <p className="text-xs text-charcoal-500 leading-relaxed">
            The album review link you opened is either invalid, expired, or has not yet been published by the studio.
          </p>
          <div className="pt-2">
            <Button variant="primary" size="sm" onClick={() => navigate('/deliverables')}>
              Return to Studio Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Handle single spread approval
  const handleApproveCurrentSpread = (item = currentItem) => {
    if (!item) return;
    try {
      submitSpreadReview(
        deliverable.id,
        item.id,
        'Approved',
        '',
        client?.name || 'Client Reviewer'
      );
      toast.success('Spread Approved', `Marked "${item.title}" as approved.`);
      // Auto-advance to next pending spread if available
      if (currentSpreadIndex < items.length - 1) {
        setCurrentSpreadIndex((prev) => prev + 1);
      }
    } catch (err) {
      toast.error('Approval Failed', err.message);
    }
  };

  // Open revision request modal
  const handleOpenRevisionModal = (item = currentItem) => {
    if (!item) return;
    setRevisionItem(item);
    setRevisionFeedback(item.feedback || '');
    setRevisionError('');
    setIsRevisionModalOpen(true);
  };

  // Submit revision request
  const handleSubmitRevision = (e) => {
    e.preventDefault();
    if (!revisionFeedback.trim()) {
      setRevisionError('Please provide detailed instructions describing the required change.');
      return;
    }
    try {
      submitSpreadReview(
        deliverable.id,
        revisionItem.id,
        'Revision Requested',
        revisionFeedback.trim(),
        client?.name || 'Client Reviewer'
      );
      toast.success(
        'Changes Requested',
        `Logged revision request for "${revisionItem.title}". The studio has been notified.`
      );
      setIsRevisionModalOpen(false);
      setRevisionFeedback('');
      setRevisionItem(null);
    } catch (err) {
      toast.error('Submission Failed', err.message);
    }
  };

  // Reset spread to pending
  const handleResetCurrentSpread = (item = currentItem) => {
    if (!item) return;
    try {
      submitSpreadReview(
        deliverable.id,
        item.id,
        'Pending',
        '',
        client?.name || 'Client Reviewer'
      );
      toast.success('Spread Reset', `Returned "${item.title}" to pending.`);
    } catch (err) {
      toast.error('Reset Failed', err.message);
    }
  };

  // Submit final approval
  const handleConfirmFinalApproval = (e) => {
    e.preventDefault();
    const cleanName = signoffName.trim() || client?.name?.trim() || '';
    if (!cleanName) {
      toast.error('Name Required', 'Please enter your authorized legal sign-off name.');
      return;
    }
    if (!confirmedTerms) {
      toast.error('Confirmation Required', 'Please confirm that you have reviewed all album spreads.');
      return;
    }
    if (revisionCount > 0 || pendingCount > 0) {
      toast.error(
        'Incomplete Review',
        'Cannot submit final approval while spreads remain pending or have revision requests. All spreads must be approved first.'
      );
      return;
    }
    try {
      submitFinalAlbumApproval(
        deliverable.id,
        cleanName,
        signoffRemarks.trim()
      );
      toast.success(
        'Album Approved!',
        'Your final sign-off has been recorded. Our bindery team will now proceed with luxury print production!'
      );
      setIsFinalApprovalModalOpen(false);
    } catch (err) {
      toast.error('Approval Error', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-ivory text-charcoal flex flex-col selection:bg-terracotta selection:text-white">
      {/* Studio Header Bar for pair navigation */}
      <div className="bg-charcoal text-white text-xs py-2 px-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-ivory tracking-wide">StudioFlow</span>
          <span className="text-white/40">&bull;</span>
          <span className="text-charcoal-200">Private Client Proofing Portal</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/projects/${deliverable.projectId}`}
            className="text-ivory/80 hover:text-white flex items-center gap-1 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Studio Workspace</span>
          </Link>
          <span className="text-white/20">|</span>
          <Link
            to="/deliverables"
            className="text-ivory/80 hover:text-white hover:underline"
          >
            Proofing Hub
          </Link>
        </div>
      </div>

      {/* Hero Editorial Header */}
      <header className="bg-surface border-b border-border shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  size="sm"
                  variant={
                    isAlreadyApproved
                      ? 'sage'
                      : deliverable.clientApprovalStatus === 'Revisions Requested'
                      ? 'rose'
                      : deliverable.clientApprovalStatus === 'In Review'
                      ? 'terracotta'
                      : 'amber'
                  }
                >
                  {isAlreadyApproved ? 'Final Approval Granted' : deliverable.clientApprovalStatus}
                </Badge>
                {deliverable.version && deliverable.version > 1 && (
                  <span className="px-2 py-0.5 text-[11px] rounded bg-ivory-100 text-charcoal-600 font-mono font-medium">
                    Proof Version {deliverable.version}.0
                  </span>
                )}
                <span className="text-xs text-charcoal-400 font-medium">
                  {deliverable.deliverableType} &bull; Target Delivery: {formatDate(deliverable.deadline)}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-charcoal">
                {deliverable.title}
              </h1>

              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                Prepared exclusively for{' '}
                <span className="font-semibold text-charcoal">{client?.name || 'Valued Couple'}</span>
                {project && <span> &bull; Project: {project.title}</span>}.
                Please review every page spread sequentially, approve individual layouts, or submit precise revision remarks before final sign-off.
              </p>
            </div>

            {/* Quick Review Stats & Final CTA */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 shrink-0">
              <div className="bg-ivory-50 p-3.5 rounded-xl border border-border/80 text-left sm:text-right w-full sm:w-auto min-w-[200px]">
                <div className="flex items-center justify-between sm:justify-end gap-2 text-xs mb-1">
                  <span className="text-charcoal-500 font-medium">Spread Sign-Off</span>
                  <span className="font-bold text-charcoal font-serif">{approvedCount} of {totalSpreads} Approved</span>
                </div>
                <div className="w-full h-2 bg-ivory-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${isAlreadyApproved ? 'bg-sage' : 'bg-terracotta'}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-charcoal-400 mt-1.5 font-medium">
                  <span className="text-sage">{approvedCount} Approved</span>
                  {revisionCount > 0 && <span className="text-rose">{revisionCount} Revisions</span>}
                  {pendingCount > 0 && <span>{pendingCount} Pending</span>}
                </div>
              </div>

              {/* Final Approval Button */}
              {isAlreadyApproved ? (
                <div className="flex items-center gap-1.5 text-xs text-sage font-semibold bg-sage/10 px-3 py-1.5 rounded-lg border border-sage/20">
                  <ShieldCheck className="w-4 h-4 text-sage" />
                  <span>Approved & Locked for Bindery</span>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-sage hover:bg-sage-dark text-white shadow-2xs w-full sm:w-auto"
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={() => setIsFinalApprovalModalOpen(true)}
                  disabled={revisionCount > 0 || pendingCount > 0}
                  title={
                    revisionCount > 0
                      ? 'Resolve requested revisions before final album sign-off'
                      : pendingCount > 0
                      ? 'Review and approve all spreads before final album sign-off'
                      : 'Submit final album sign-off'
                  }
                >
                  Submit Final Album Approval
                </Button>
              )}
            </div>
          </div>

          {/* View mode toggle toolbar */}
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1 bg-ivory-100 p-1 rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setViewMode('spread')}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  viewMode === 'spread'
                    ? 'bg-surface text-charcoal font-semibold shadow-2xs'
                    : 'text-charcoal-500 hover:text-charcoal'
                }`}
              >
                Spread-by-Spread Viewer
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded font-medium transition-colors flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-surface text-charcoal font-semibold shadow-2xs'
                    : 'text-charcoal-500 hover:text-charcoal'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Gallery Overview ({totalSpreads})</span>
              </button>
            </div>

            {viewMode === 'spread' && currentItem && (
              <span className="text-charcoal-500 font-mono text-[11px] hidden sm:inline">
                Viewing Spread {currentSpreadIndex + 1} of {totalSpreads} (Use Left/Right arrow keys)
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Review Canvas */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Approved Congratulations Banner if already approved */}
        {isAlreadyApproved && deliverable.finalApproval && (
          <div className="p-4 sm:p-5 bg-sage/10 border border-sage/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sage text-white flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-charcoal font-serif">
                  Album Proof Officially Approved for Print Production
                </h3>
                <p className="text-xs text-charcoal-600 mt-0.5">
                  Signed off by <strong className="text-charcoal">{deliverable.finalApproval.approvedBy}</strong> on{' '}
                  {formatDate(deliverable.finalApproval.approvedAt)}.
                  {deliverable.finalApproval.remarks && (
                    <span className="italic block mt-0.5">"{deliverable.finalApproval.remarks}"</span>
                  )}
                </p>
              </div>
            </div>
            <Badge variant="sage" size="md">Ready for Bindery Print</Badge>
          </div>
        )}

        {/* Pending Revisions Banner */}
        {!isAlreadyApproved && revisionCount > 0 && (
          <div className="p-4 bg-rose/10 border border-rose/30 rounded-xl flex items-center justify-between gap-3 text-xs text-charcoal">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose shrink-0" />
              <span>
                <strong>{revisionCount} spread(s) have revision requests logged.</strong> Our studio retouching artists are actively preparing layout adjustments.
              </span>
            </div>
            <Badge variant="rose" size="xs">Revisions Pending Studio Action</Badge>
          </div>
        )}

        {/* VIEW 1: Spread-by-Spread Large Interactive Viewer */}
        {viewMode === 'spread' && currentItem && (
          <div className="space-y-4">
            {/* Viewer Stage */}
            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-subtle p-3 sm:p-6 space-y-4">
              {/* Top controls: title, spread index, status, zoom */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-ivory-100 text-charcoal font-mono text-xs font-bold">
                    Spread {currentSpreadIndex + 1} / {totalSpreads}
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-charcoal font-serif truncate max-w-md">
                    {currentItem.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Badge
                    size="sm"
                    variant={
                      currentItem.status === 'Approved'
                        ? 'sage'
                        : currentItem.status === 'Revision Requested'
                        ? 'rose'
                        : 'amber'
                    }
                  >
                    {currentItem.status}
                  </Badge>

                  <button
                    type="button"
                    onClick={() => setZoomedImage(currentItem.thumbnail)}
                    className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal hover:bg-ivory-100 transition-colors"
                    title="Inspect Full Resolution"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Large Image Frame */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-charcoal/5 rounded-xl overflow-hidden border border-border/60 flex items-center justify-center group">
                <img
                  src={currentItem.thumbnail}
                  alt={currentItem.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                />

                {/* Left/Right floating navigation chevrons */}
                <button
                  type="button"
                  onClick={() => setCurrentSpreadIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentSpreadIndex === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/85 backdrop-blur-md border border-border shadow-md flex items-center justify-center text-charcoal hover:bg-surface disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  title="Previous Spread (Left Arrow)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentSpreadIndex((prev) => Math.min(items.length - 1, prev + 1))}
                  disabled={currentSpreadIndex === items.length - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/85 backdrop-blur-md border border-border shadow-md flex items-center justify-center text-charcoal hover:bg-surface disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  title="Next Spread (Right Arrow)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Client Feedback Display if revision was requested */}
              {currentItem.feedback && (
                <div className="p-3.5 bg-rose-light/50 border border-rose-border rounded-xl text-xs space-y-1 text-charcoal">
                  <div className="flex items-center gap-1.5 font-bold text-rose-dark uppercase tracking-wider text-[10px]">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Your Revision Request Remarks</span>
                    {currentItem.reviewedAt && (
                      <span className="text-charcoal-400 font-normal">({formatDate(currentItem.reviewedAt)})</span>
                    )}
                  </div>
                  <p className="text-charcoal-700 font-sans leading-relaxed">
                    {currentItem.feedback}
                  </p>
                </div>
              )}

              {/* Historical revisions if any */}
              {currentItem.revisionHistory && currentItem.revisionHistory.length > 0 && (
                <div className="p-3 bg-ivory-100 rounded-xl border border-border/80 text-xs space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-500 block">
                    Revision History ({currentItem.revisionHistory.length})
                  </span>
                  {currentItem.revisionHistory.map((hist, idx) => (
                    <div key={idx} className="text-[11px] text-charcoal-600 border-l-2 border-terracotta pl-2.5">
                      <span className="font-semibold text-charcoal">Version {hist.version}: </span>
                      <span>"{hist.feedback}"</span>
                      {hist.studioNotes && (
                        <p className="text-sage font-medium mt-0.5">Studio Response: {hist.studioNotes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Action Toolbar for current spread */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentSpreadIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentSpreadIndex === 0}
                    leftIcon={<ChevronLeft className="w-4 h-4" />}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentSpreadIndex((prev) => Math.min(items.length - 1, prev + 1))}
                    disabled={currentSpreadIndex === items.length - 1}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    Next Spread
                  </Button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {currentItem.status === 'Approved' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                      onClick={() => handleResetCurrentSpread(currentItem)}
                    >
                      Reset to Pending
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-sage hover:bg-sage-dark text-white shadow-2xs"
                      leftIcon={<ThumbsUp className="w-3.5 h-3.5" />}
                      onClick={() => handleApproveCurrentSpread(currentItem)}
                    >
                      Approve This Spread
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="border-rose/30 text-rose hover:bg-rose-light"
                    leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                    onClick={() => handleOpenRevisionModal(currentItem)}
                  >
                    {currentItem.status === 'Revision Requested' ? 'Update Revision Remarks' : 'Request Changes'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Thumbnail Ribbon Selector */}
            <div className="bg-surface p-3 rounded-xl border border-border">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-400 block mb-2">
                Album Spreads Sequence
              </span>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 custom-scrollbar">
                {items.map((item, idx) => {
                  const isCurrent = idx === currentSpreadIndex;
                  const isAppr = item.status === 'Approved';
                  const isRev = item.status === 'Revision Requested';

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrentSpreadIndex(idx)}
                      className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        isCurrent
                          ? 'border-terracotta ring-2 ring-terracotta/30 scale-105'
                          : 'border-border opacity-70 hover:opacity-100'
                      }`}
                      title={`Spread ${idx + 1}: ${item.title}`}
                    >
                      <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 px-1 py-0.2 text-[9px] font-mono font-bold rounded bg-charcoal/80 text-white">
                        {idx + 1}
                      </div>
                      <div className="absolute bottom-1 right-1">
                        <span
                          className={`w-2 h-2 rounded-full block ${
                            isAppr ? 'bg-sage' : isRev ? 'bg-rose' : 'bg-amber'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Gallery Overview Grid */}
        {viewMode === 'grid' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, idx) => {
                const isAppr = item.status === 'Approved';
                const isRev = item.status === 'Revision Requested';

                return (
                  <div
                    key={item.id}
                    className="bg-surface rounded-2xl border border-border overflow-hidden shadow-2xs hover:shadow-subtle transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Preview with overlay status */}
                      <div
                        className="relative aspect-[16/10] bg-charcoal/5 cursor-pointer overflow-hidden group"
                        onClick={() => {
                          setCurrentSpreadIndex(idx);
                          setViewMode('spread');
                        }}
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 text-xs font-mono font-bold rounded bg-charcoal/80 text-white">
                          Spread {idx + 1}
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge
                            size="xs"
                            variant={isAppr ? 'sage' : isRev ? 'rose' : 'amber'}
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-4 space-y-2">
                        <h3 className="text-xs font-bold text-charcoal font-serif truncate" title={item.title}>
                          {item.title}
                        </h3>

                        {item.feedback ? (
                          <div className="p-2 bg-rose-light/50 border border-rose-border rounded-lg text-[11px] text-charcoal-700 leading-snug">
                            <span className="font-semibold text-rose-dark block">Client Remarks:</span>
                            <span className="line-clamp-2">{item.feedback}</span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-charcoal-400">
                            {isAppr ? `Approved ${formatDate(item.approvedAt)}` : 'Awaiting your review signoff'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions bar */}
                    <div className="p-3 border-t border-border bg-ivory-50 flex items-center justify-between gap-2">
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => {
                          setCurrentSpreadIndex(idx);
                          setViewMode('spread');
                        }}
                      >
                        Inspect Spread
                      </Button>

                      <div className="flex items-center gap-1.5">
                        {isAppr ? (
                          <button
                            type="button"
                            onClick={() => handleResetCurrentSpread(item)}
                            className="p-1 text-charcoal-400 hover:text-charcoal"
                            title="Reset to Pending"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <Button
                            size="xs"
                            variant="primary"
                            className="bg-sage hover:bg-sage-dark text-white"
                            leftIcon={<ThumbsUp className="w-3 h-3" />}
                            onClick={() => handleApproveCurrentSpread(item)}
                          >
                            Approve
                          </Button>
                        )}

                        <Button
                          size="xs"
                          variant="outline"
                          className="text-rose border-rose/30 hover:bg-rose-light"
                          onClick={() => handleOpenRevisionModal(item)}
                        >
                          Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Revision Input Modal */}
      {isRevisionModalOpen && revisionItem && (
        <Modal
          isOpen={isRevisionModalOpen}
          onClose={() => setIsRevisionModalOpen(false)}
          title={`Request Changes — ${revisionItem.title}`}
          subtitle="Describe retouching, cropping, color temperature, or photo swap directives for this layout spread."
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSubmitRevision} className="space-y-4">
            <div className="rounded-xl overflow-hidden aspect-[16/9] border border-border bg-charcoal/10 max-h-48">
              <img src={revisionItem.thumbnail} alt="" className="w-full h-full object-cover" />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">
                Specific Revision Directives <span className="text-rose">*</span>
              </label>
              <textarea
                value={revisionFeedback}
                onChange={(e) => {
                  setRevisionFeedback(e.target.value);
                  if (revisionError) setRevisionError('');
                }}
                placeholder="e.g. Please soften the glare on the bridal necklace, crop slightly closer on the groom's expression, and remove the microphone stand in the background."
                rows={4}
                className="w-full text-xs p-3 rounded-xl border border-border bg-surface text-charcoal focus:ring-2 focus:ring-terracotta/25 focus:outline-none leading-relaxed"
                autoFocus
              />
              {revisionError && (
                <p className="text-xs text-rose mt-1 font-medium">{revisionError}</p>
              )}
            </div>

            {/* Quick Directive suggestion chips */}
            <div>
              <span className="text-[10px] uppercase font-semibold text-charcoal-400 block mb-1.5">
                Quick Retouching Directives
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  'Warm up skin tones by +5%',
                  'Crop tighter on couple portrait',
                  'Soften highlight glare / lens flare',
                  'Swap for alternate candid expression',
                  'Remove background distraction',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setRevisionFeedback((prev) => (prev ? `${prev}. ${chip}` : chip))}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-ivory-100 hover:bg-ivory-200 text-charcoal-700 transition-colors"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsRevisionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-rose hover:bg-rose-dark text-white">
                Submit Change Request
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Final Album Approval Sign-off Modal */}
      {isFinalApprovalModalOpen && (
        <Modal
          isOpen={isFinalApprovalModalOpen}
          onClose={() => setIsFinalApprovalModalOpen(false)}
          title="Final Album Proof Approval"
          subtitle={`Luxury flush mount layout sign-off for "${deliverable.title}"`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleConfirmFinalApproval} className="space-y-4 text-xs">
            <div className="p-3.5 bg-sage-light/60 border border-sage-border rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-sage-dark text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ready for Print Bindery</span>
              </div>
              <p className="text-charcoal-700 leading-relaxed text-[11px]">
                By submitting final approval, you authorize StudioFlow to send all {totalSpreads} spreads to our archival album print bindery. Once printing commences, layout alterations cannot be made.
              </p>
            </div>

            <div>
              <label className="font-semibold text-charcoal block mb-1">
                Authorized Sign-off Name <span className="text-rose">*</span>
              </label>
              <input
                type="text"
                value={signoffName}
                onChange={(e) => setSignoffName(e.target.value)}
                placeholder="e.g. Radhika Merchant & Anant Ambani"
                required
                className="w-full p-2.5 rounded-lg border border-border bg-surface text-charcoal focus:ring-2 focus:ring-terracotta/25 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-charcoal block mb-1">
                Optional Compliments or Final Remarks
              </label>
              <textarea
                value={signoffRemarks}
                onChange={(e) => setSignoffRemarks(e.target.value)}
                placeholder="e.g. We absolutely adore this wedding album layout! Thank you for capturing our celebration so beautifully."
                rows={2}
                className="w-full p-2.5 rounded-lg border border-border bg-surface text-charcoal focus:ring-2 focus:ring-terracotta/25 focus:outline-none"
              />
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-lg bg-ivory-50 border border-border cursor-pointer select-none">
              <input
                type="checkbox"
                checked={confirmedTerms}
                onChange={(e) => setConfirmedTerms(e.target.checked)}
                className="mt-0.5 rounded border-charcoal-300 text-terracotta focus:ring-terracotta"
              />
              <span className="text-charcoal-700 leading-snug text-[11px]">
                I confirm that I have reviewed all album spreads and approve this layout as final for printing.
              </span>
            </label>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsFinalApprovalModalOpen(false)}
              >
                Back to Review
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="bg-sage hover:bg-sage-dark text-white"
                disabled={!confirmedTerms}
              >
                Confirm Final Approval
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Fullscreen Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-charcoal-900/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
            <img
              src={zoomedImage}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setZoomedImage(null)}
              className="absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-charcoal/80 text-white text-xs font-medium hover:bg-charcoal"
            >
              Close Preview (Esc)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
