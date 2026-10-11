import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Calendar,
  Clock,
  CheckSquare,
  Users,
  Image as ImageIcon,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle2,
  ListTodo,
  Milestone,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Badge, PriorityBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { TaskModal } from '../components/modals/TaskModal';
import { ProjectModal } from '../components/modals/ProjectModal';
import { ProjectNoteModal } from '../components/modals/ProjectNoteModal';
import { ProofingReviewModal } from '../components/modals/ProofingReviewModal';
import { DeliverableModal } from '../components/modals/DeliverableModal';
import { RecordPaymentModal } from '../components/modals/RecordPaymentModal';
import { formatDate, formatCurrency } from '../utils/formatters';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'schedule', label: 'Schedule & Milestones' },
  { id: 'notes', label: 'Production Notes' },
  { id: 'team', label: 'Crew & Team' },
  { id: 'deliverables', label: 'Deliverables' },
  { id: 'payments', label: 'Financials' },
];

export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    getProject,
    getClient,
    getEvent,
    getTasksByProject,
    getProjectProgress,
    getNotesByProject,
    deleteProject,
    toggleTaskComplete,
    deleteTask,
    deleteProjectNote,
    team,
    deliverables,
    payments,
  } = useStudioData();

  const [activeTab, setActiveTab] = useState('overview');

  // Modal states
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Deliverables & Payments modals
  const [activeProofingDeliv, setActiveProofingDeliv] = useState(null);
  const [isDeliverableModalOpen, setIsDeliverableModalOpen] = useState(false);
  const [editingDeliverable, setEditingDeliverable] = useState(null);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);

  const project = getProject(id);
  const client = project ? getClient(project.clientId) : null;
  const event = project ? getEvent(project.eventId) : null;
  const projectTasks = project ? getTasksByProject(project.id) : [];
  const projectNotes = project ? getNotesByProject(project.id) : [];
  const projectProgress = project ? getProjectProgress(project.id) : 0;
  const projectDeliverable = project ? deliverables.find((d) => d.projectId === project.id) : null;

  // Event financial calculations
  const eventPayments = useMemo(() => {
    if (!event) return [];
    return payments.filter((p) => p.eventId === event.id);
  }, [event, payments]);

  const totalPaid = useMemo(() => {
    return eventPayments
      .filter((p) => p.status === 'Paid' || p.status === 'Completed' || p.status === 'Received')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }, [eventPayments]);

  const totalFee = event?.packageValue || 0;
  const balanceDue = Math.max(0, totalFee - totalPaid);

  // Team members involved in this project
  const involvedTeam = useMemo(() => {
    const memberMap = new Map();
    projectTasks.forEach((t) => {
      if (t.assignedTo) {
        const currentCount = memberMap.get(t.assignedTo) || 0;
        memberMap.set(t.assignedTo, currentCount + 1);
      }
    });

    return Array.from(memberMap.entries()).map(([memberId, taskCount]) => {
      const member = team.find((m) => m.id === memberId);
      return {
        member,
        taskCount,
      };
    }).filter((item) => Boolean(item.member));
  }, [projectTasks, team]);

  // Tasks grouping and filter
  const [taskStatusFilter, setTaskStatusFilter] = useState('All');
  const filteredTasks = useMemo(() => {
    if (taskStatusFilter === 'All') return projectTasks;
    if (taskStatusFilter === 'Done') {
      return projectTasks.filter((t) => t.status === 'Done' || t.status === 'Completed');
    }
    if (taskStatusFilter === 'To Do') {
      return projectTasks.filter((t) => t.status === 'To Do' || t.status === 'Pending');
    }
    return projectTasks.filter((t) => t.status === taskStatusFilter);
  }, [projectTasks, taskStatusFilter]);

  if (!project) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Projects', to: '/projects' }, { label: 'Not Found' }]} />
        <EmptyState
          icon={FolderKanban}
          title="Project workspace not found"
          description={`No project exists with ID "${id}".`}
          action={
            <Button variant="primary" onClick={() => navigate('/projects')}>
              Return to Projects
            </Button>
          }
        />
      </div>
    );
  }

  const handleDeleteProject = () => {
    try {
      deleteProject(project.id);
      toast.success('Project Workspace Deleted', `Removed workspace "${project.title}"`);
      navigate('/projects');
    } catch (err) {
      toast.error('Deletion Failed', err.message);
    }
  };

  const handleDeleteTask = (taskId, taskTitle) => {
    if (window.confirm(`Are you sure you want to delete task "${taskTitle}"?`)) {
      deleteTask(taskId);
      toast.success('Task Deleted', `Removed task "${taskTitle}"`);
    }
  };

  const handleDeleteNote = (noteId, noteTitle) => {
    if (window.confirm(`Are you sure you want to delete note "${noteTitle}"?`)) {
      deleteProjectNote(noteId);
      toast.success('Note Deleted', `Removed note "${noteTitle}"`);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Projects', to: '/projects' }, { label: project.title }]} />

      {/* Hero Workspace Banner */}
      <div className="relative rounded-card overflow-hidden border border-border bg-charcoal text-white shadow-elevated">
        <div className="absolute inset-0 z-0 opacity-30">
          <img src={project.coverImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/80 to-transparent z-10" />

        <div className="relative z-20 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="terracotta" size="sm">{project.category}</Badge>
              <Badge
                size="sm"
                variant={
                  project.status === 'Completed'
                    ? 'sage'
                    : project.status === 'Client Review'
                    ? 'amber'
                    : 'default'
                }
              >
                {project.status}
              </Badge>
              {project.tags && project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] bg-white/10 text-charcoal-200 rounded-md font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
              {project.title}
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-300 mt-2">
              Client:{' '}
              {client ? (
                <Link to={`/clients/${client.id}`} className="text-ivory font-medium hover:underline">
                  {client.name}
                </Link>
              ) : (
                'Unassigned'
              )}{' '}
              &bull; Shoot Date: {formatDate(project.shootDate)} &bull; Deadline: {formatDate(project.deliveryDeadline)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-surface/15 backdrop-blur-md p-3.5 rounded-xl border border-white/20 text-right min-w-[170px]">
              <span className="text-[11px] text-charcoal-300 block">Workspace Progress</span>
              <span className="text-2xl font-bold text-white mt-0.5 block font-serif">
                {projectProgress}%
              </span>
              <div className="w-full h-1.5 bg-white/20 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-terracotta transition-all duration-300"
                  style={{ width: `${projectProgress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                onClick={() => setIsEditProjectOpen(true)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="bg-red-500/80 hover:bg-red-600 text-white"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={() => setIsDeleteProjectOpen(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto pb-px">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3.5 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-terracotta text-terracotta font-semibold'
                    : 'border-transparent text-charcoal-500 hover:text-charcoal hover:border-border'
                }`}
              >
                {tab.label}
                {tab.id === 'tasks' && ` (${projectTasks.length})`}
                {tab.id === 'notes' && ` (${projectNotes.length})`}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-surface">
              <span className="text-[11px] text-charcoal-400 font-medium uppercase tracking-wider block">
                Tasks Completed
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-charcoal font-serif">
                  {projectTasks.filter((t) => t.status === 'Done' || t.status === 'Completed').length} / {projectTasks.length}
                </span>
                <span className="text-xs text-sage font-semibold">{projectProgress}%</span>
              </div>
            </Card>

            <Card className="p-4 bg-surface">
              <span className="text-[11px] text-charcoal-400 font-medium uppercase tracking-wider block">
                Deliverable Status
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold text-charcoal font-serif">
                  {projectDeliverable ? projectDeliverable.status : 'Not Initialized'}
                </span>
                {projectDeliverable && (
                  <span className="text-xs text-terracotta font-medium">
                    {projectDeliverable.approvedPhotos}/{projectDeliverable.totalPhotos}
                  </span>
                )}
              </div>
            </Card>

            <Card className="p-4 bg-surface">
              <span className="text-[11px] text-charcoal-400 font-medium uppercase tracking-wider block">
                Crew Assigned
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-charcoal font-serif">
                  {involvedTeam.length}
                </span>
                <span className="text-xs text-charcoal-500">artists</span>
              </div>
            </Card>

            <Card className="p-4 bg-surface">
              <span className="text-[11px] text-charcoal-400 font-medium uppercase tracking-wider block">
                Event Balance
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold text-charcoal font-serif">
                  {formatCurrency(balanceDue)}
                </span>
                <span className={`text-[11px] font-semibold ${balanceDue === 0 ? 'text-sage' : 'text-amber'}`}>
                  {balanceDue === 0 ? 'Settled' : 'Pending'}
                </span>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overview Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-charcoal mb-4 font-serif">
                  Production Scope & Milestones
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-ivory-50 rounded-xl border border-border/80">
                    <span className="text-charcoal-400 text-[11px] block">Production Category</span>
                    <span className="font-semibold text-charcoal text-sm mt-0.5 block">{project.category}</span>
                  </div>

                  <div className="p-3.5 bg-ivory-50 rounded-xl border border-border/80">
                    <span className="text-charcoal-400 text-[11px] block">Current Stage</span>
                    <span className="font-semibold text-charcoal text-sm mt-0.5 block">{project.status}</span>
                  </div>

                  <div className="p-3.5 bg-ivory-50 rounded-xl border border-border/80">
                    <span className="text-charcoal-400 text-[11px] block">Original Shoot Date</span>
                    <span className="font-semibold text-charcoal text-sm mt-0.5 block">{formatDate(project.shootDate)}</span>
                  </div>

                  <div className="p-3.5 bg-ivory-50 rounded-xl border border-border/80">
                    <span className="text-charcoal-400 text-[11px] block">Final Proofs Deadline</span>
                    <span className="font-semibold text-terracotta text-sm mt-0.5 block">{formatDate(project.deliveryDeadline)}</span>
                  </div>
                </div>

                {/* Next pending tasks */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-charcoal uppercase tracking-wider">
                      Upcoming Active Tasks
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('tasks')}
                      className="text-xs text-terracotta hover:underline font-medium"
                    >
                      View All ({projectTasks.length})
                    </button>
                  </div>
                  <div className="space-y-2">
                    {projectTasks
                      .filter((t) => t.status !== 'Done' && t.status !== 'Completed')
                      .slice(0, 3)
                      .map((task) => {
                        const assigned = team.find((m) => m.id === task.assignedTo);
                        return (
                          <div
                            key={task.id}
                            className="p-3 bg-ivory-50 rounded-lg border border-border flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <PriorityBadge priority={task.priority} />
                              <span className="font-medium text-charcoal truncate">{task.title}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-charcoal-400 text-[11px]">Due {formatDate(task.dueDate)}</span>
                              {assigned && <Avatar src={assigned.avatar} name={assigned.name} size="xs" />}
                            </div>
                          </div>
                        );
                      })}
                    {projectTasks.filter((t) => t.status !== 'Done' && t.status !== 'Completed').length === 0 && (
                      <div className="p-4 text-center text-xs text-sage font-medium bg-sage/10 rounded-lg">
                        All assigned tasks for this workspace are complete!
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Latest Notes Snippet */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-charcoal font-serif">
                    Recent Production Directives
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('notes')}
                    className="text-xs text-terracotta hover:underline font-medium"
                  >
                    View All ({projectNotes.length})
                  </button>
                </div>
                {projectNotes.length === 0 ? (
                  <p className="text-xs text-charcoal-400 italic">No notes recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {projectNotes.slice(0, 2).map((note) => (
                      <div key={note.id} className="p-3.5 bg-ivory-50 rounded-lg border border-border text-xs">
                        <div className="flex items-center justify-between font-medium text-charcoal mb-1">
                          <span>{note.title}</span>
                          <span className="text-[10px] text-charcoal-400">{formatDate(note.updatedAt || note.createdAt)}</span>
                        </div>
                        {/* Requirement 4: preserve line breaks */}
                        <div className="text-charcoal-600 whitespace-pre-wrap font-mono text-[11px] line-clamp-3">
                          {note.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-6">
              {/* Client Info Card */}
              <Card className="p-5 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
                  Client Information
                </h3>
                {client ? (
                  <div>
                    <h4 className="text-sm font-semibold text-charcoal">{client.name}</h4>
                    <p className="text-xs text-charcoal-500 mt-0.5">{client.email}</p>
                    <p className="text-xs text-charcoal-500">{client.phone}</p>
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <Badge size="xs">{client.status || 'Active'}</Badge>
                      <Link to={`/clients/${client.id}`}>
                        <Button size="xs" variant="ghost" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                          Client Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-charcoal-400">No client connected.</p>
                )}
              </Card>

              {/* Linked Event Card */}
              {event && (
                <Card className="p-5 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
                    Linked Scheduled Shoot
                  </h3>
                  <div>
                    <h4 className="text-sm font-semibold text-charcoal">{event.title}</h4>
                    <p className="text-xs text-charcoal-500 mt-0.5">{event.venue}</p>
                    <p className="text-xs text-charcoal-500">
                      {formatDate(event.startDate)} &bull; {event.eventType}
                    </p>
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <Badge size="xs" variant="amber">{event.status}</Badge>
                      <Link to={`/events/${event.id}`}>
                        <Button size="xs" variant="ghost" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                          Event Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-surface rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-charcoal">Filter by Status:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['All', 'To Do', 'In Progress', 'In Review', 'Done'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setTaskStatusFilter(st)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                      taskStatusFilter === st
                        ? 'bg-terracotta text-white font-medium'
                        : 'bg-ivory-100 text-charcoal-600 hover:bg-ivory-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
            >
              Add Task to Project
            </Button>
          </div>

          <Card className="divide-y divide-border/60">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center">
                <CheckSquare className="w-10 h-10 text-charcoal-300 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-charcoal font-serif">No Tasks Found</h4>
                <p className="text-xs text-charcoal-400 mt-1">
                  {taskStatusFilter !== 'All'
                    ? `No tasks with status "${taskStatusFilter}".`
                    : 'Get started by creating your first task for this project workspace.'}
                </p>
                <div className="mt-3">
                  <Button
                    size="xs"
                    onClick={() => {
                      setEditingTask(null);
                      setIsTaskModalOpen(true);
                    }}
                  >
                    Create Task
                  </Button>
                </div>
              </div>
            ) : (
              filteredTasks.map((t) => {
                const assigned = team.find((tm) => tm.id === t.assignedTo);
                const isDone = t.status === 'Done' || t.status === 'Completed';

                return (
                  <div
                    key={t.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-ivory-50/50 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleTaskComplete(t.id)}
                        className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                          isDone
                            ? 'bg-sage border-sage text-white'
                            : 'border-border hover:border-terracotta bg-surface'
                        }`}
                        title={isDone ? 'Mark as incomplete' : 'Mark as done'}
                      >
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={t.priority} />
                          <span
                            className={`text-sm font-medium ${
                              isDone ? 'line-through text-charcoal-400' : 'text-charcoal'
                            }`}
                          >
                            {t.title}
                          </span>
                        </div>
                        {t.description && (
                          <p className="text-xs text-charcoal-500 mt-1 line-clamp-1">{t.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-[11px] text-charcoal-400 mt-1">
                          <span className="font-medium text-charcoal-600">{t.category || 'General'}</span>
                          &bull;
                          <span>Due: {formatDate(t.dueDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      {assigned ? (
                        <div className="flex items-center gap-1.5 text-xs text-charcoal-600">
                          <Avatar src={assigned.avatar} name={assigned.name} size="xs" />
                          <span className="hidden md:inline">{assigned.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-charcoal-400 italic">Unassigned</span>
                      )}

                      <Badge
                        size="xs"
                        variant={
                          isDone
                            ? 'sage'
                            : t.status === 'In Progress'
                            ? 'terracotta'
                            : t.status === 'In Review'
                            ? 'amber'
                            : 'default'
                        }
                      >
                        {t.status}
                      </Badge>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTask(t);
                            setIsTaskModalOpen(true);
                          }}
                          className="p-1 text-charcoal-400 hover:text-terracotta rounded"
                          title="Edit Task"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(t.id, t.title)}
                          className="p-1 text-charcoal-400 hover:text-red-600 rounded"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </Card>
        </div>
      )}

      {/* Tab 3: Schedule / Milestones */}
      {activeTab === 'schedule' && (
        <Card className="p-6">
          <h3 className="text-base font-semibold text-charcoal mb-2 font-serif">
            Production Timeline & Milestones
          </h3>
          <p className="text-xs text-charcoal-500 mb-6">
            Chronological roadmap tracking scheduled shoot, editing milestones, and final delivery deadline.
          </p>

          <div className="relative border-l-2 border-border/80 pl-6 space-y-8 ml-3">
            {/* 1. Shoot Date Milestone */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-terracotta border-2 border-surface" />
              <div className="text-xs font-semibold text-terracotta uppercase tracking-wider">
                Event Production Shoot
              </div>
              <h4 className="text-sm font-bold text-charcoal mt-0.5">{event?.title || project.title}</h4>
              <p className="text-xs text-charcoal-500 mt-1">
                Date: {formatDate(project.shootDate)} &bull; Venue: {event?.venue || 'On Location'}
              </p>
            </div>

            {/* 2. Tasks Due Dates Milestones */}
            {projectTasks
              .slice()
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .map((t) => {
                const isDone = t.status === 'Done' || t.status === 'Completed';
                const isOverdue = !isDone && new Date(t.dueDate) < new Date();
                const assigned = team.find((m) => m.id === t.assignedTo);

                return (
                  <div key={t.id} className="relative">
                    <div
                      className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-surface ${
                        isDone
                          ? 'bg-sage'
                          : isOverdue
                          ? 'bg-red-500'
                          : 'bg-ivory-400'
                      }`}
                    />
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          isDone ? 'text-sage' : isOverdue ? 'text-red-500' : 'text-charcoal-500'
                        }`}
                      >
                        {isDone ? 'Completed Milestone' : isOverdue ? 'Overdue Milestone' : 'Upcoming Task'}
                      </span>
                      <span className="text-[11px] text-charcoal-400">&bull; Due: {formatDate(t.dueDate)}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-charcoal mt-0.5">{t.title}</h4>
                    <p className="text-xs text-charcoal-500 mt-0.5">
                      Assigned: {assigned ? assigned.name : 'Unassigned'} &bull; Status: {t.status}
                    </p>
                  </div>
                );
              })}

            {/* 3. Delivery Deadline Milestone */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-charcoal border-2 border-surface" />
              <div className="text-xs font-semibold text-charcoal uppercase tracking-wider">
                Final Client Delivery Deadline
              </div>
              <h4 className="text-sm font-bold text-charcoal mt-0.5">Handover & Proof Gallery Release</h4>
              <p className="text-xs text-charcoal-500 mt-1">
                Target Handover Date: {formatDate(project.deliveryDeadline)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Production Notes (Requirement 4: preserve line breaks) */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
            <div>
              <h3 className="text-sm font-semibold text-charcoal font-serif">Workspace Directives & Notes</h3>
              <p className="text-xs text-charcoal-400 mt-0.5">
                Technical lighting notes, client style references, and color grading instructions.
              </p>
            </div>
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingNote(null);
                setIsNoteModalOpen(true);
              }}
            >
              Add Note
            </Button>
          </div>

          {projectNotes.length === 0 ? (
            <Card className="p-10 text-center">
              <FileText className="w-10 h-10 text-charcoal-300 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-charcoal font-serif">No Production Notes</h4>
              <p className="text-xs text-charcoal-400 mt-1">
                Keep your team aligned by adding aesthetic briefs or client remarks.
              </p>
              <div className="mt-3">
                <Button
                  size="xs"
                  onClick={() => {
                    setEditingNote(null);
                    setIsNoteModalOpen(true);
                  }}
                >
                  Create First Note
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectNotes.map((note) => (
                <Card key={note.id} className="p-5 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-charcoal font-serif">{note.title}</h4>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNote(note);
                            setIsNoteModalOpen(true);
                          }}
                          className="p-1 text-charcoal-400 hover:text-terracotta rounded"
                          title="Edit Note"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note.id, note.title)}
                          className="p-1 text-charcoal-400 hover:text-red-600 rounded"
                          title="Delete Note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-charcoal-400 mt-1 mb-3">
                      <span>Author: {note.author || 'Studio Director'}</span>
                      &bull;
                      <span>Updated: {formatDate(note.updatedAt || note.createdAt)}</span>
                    </div>

                    {/* Preserves line breaks & multiline content */}
                    <div className="p-3 bg-ivory-50 rounded-lg border border-border/80 text-xs text-charcoal-700 whitespace-pre-wrap font-mono leading-relaxed">
                      {note.content}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Crew & Team */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
            <div>
              <h3 className="text-sm font-semibold text-charcoal font-serif">Assigned Production Artists</h3>
              <p className="text-xs text-charcoal-400 mt-0.5">
                Artists and photographers assigned to active workflows in this project.
              </p>
            </div>
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
            >
              Assign Crew Member
            </Button>
          </div>

          {involvedTeam.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="w-10 h-10 text-charcoal-300 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-charcoal font-serif">No Team Members Assigned</h4>
              <p className="text-xs text-charcoal-400 mt-1">
                Assign production tasks to crew members to view their workload here.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {involvedTeam.map(({ member, taskCount }) => (
                <Card key={member.id} className="p-5 flex items-center gap-4">
                  <Avatar src={member.avatar} name={member.name} size="lg" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-charcoal truncate font-serif">{member.name}</h4>
                    <p className="text-xs text-charcoal-500 truncate">{member.role}</p>
                    <p className="text-[11px] text-terracotta font-medium mt-1">
                      {taskCount} task{taskCount > 1 ? 's' : ''} assigned
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Deliverables & Client Proofs */}
      {activeTab === 'deliverables' && (
        <Card className="p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-charcoal font-serif">Client Proofs & Collections</h3>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Manage preview galleries, edited photographs, album drafts, and final digital handovers.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => {
                  setEditingDeliverable(null);
                  setIsDeliverableModalOpen(true);
                }}
              >
                Publish Deliverable
              </Button>
              <Link to="/deliverables">
                <Button size="sm" variant="outline" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Proofing Hub
                </Button>
              </Link>
            </div>
          </div>

          {deliverables.filter((d) => d.projectId === project.id).length === 0 ? (
            <div className="p-8 text-center bg-ivory-50 rounded-xl border border-dashed border-border">
              <ImageIcon className="w-10 h-10 text-charcoal-300 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-charcoal font-serif">No Deliverables Published</h4>
              <p className="text-xs text-charcoal-400 mt-1 max-w-sm mx-auto">
                Publish a client preview gallery, high-res edited files, or wedding album layout to start collecting feedback.
              </p>
              <div className="mt-3">
                <Button
                  size="xs"
                  onClick={() => {
                    setEditingDeliverable(null);
                    setIsDeliverableModalOpen(true);
                  }}
                >
                  Publish First Collection
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {deliverables
                .filter((d) => d.projectId === project.id)
                .map((deliv) => {
                  const total = deliv.totalPhotos || (deliv.items ? deliv.items.length : 0);
                  const approved = deliv.approvedPhotos || (deliv.items ? deliv.items.filter((i) => i.status === 'Approved').length : 0);
                  const rejected = deliv.rejectedPhotos || (deliv.items ? deliv.items.filter((i) => i.status === 'Revision Requested').length : 0);
                  const pending = deliv.pendingPhotos !== undefined ? deliv.pendingPhotos : Math.max(0, total - approved - rejected);
                  const percent = total > 0 ? Math.round((approved / total) * 100) : 0;

                  return (
                    <div key={deliv.id} className="p-4 bg-ivory-50 rounded-xl border border-border space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-charcoal font-serif">{deliv.title}</h4>
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
                          </div>
                          <p className="text-xs text-charcoal-500 mt-0.5">
                            Type: {deliv.deliverableType} &bull; Stage: <span className="font-semibold">{deliv.deliveryStage}</span> &bull; Due: {formatDate(deliv.deadline)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="xs"
                            variant="primary"
                            className="bg-terracotta hover:bg-terracotta-hover"
                            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                            onClick={() => setActiveProofingDeliv(deliv)}
                          >
                            Review Proofs
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => {
                              setEditingDeliverable(deliv);
                              setIsDeliverableModalOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>

                      {/* Photo Counters */}
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="p-2 bg-surface rounded-lg border border-border">
                          <span className="text-[10px] text-charcoal-400 block uppercase">Total</span>
                          <span className="text-sm font-bold text-charcoal font-serif">{total}</span>
                        </div>
                        <div className="p-2 bg-surface rounded-lg border border-border">
                          <span className="text-[10px] text-sage block uppercase">Approved</span>
                          <span className="text-sm font-bold text-sage font-serif">{approved}</span>
                        </div>
                        <div className="p-2 bg-surface rounded-lg border border-border">
                          <span className="text-[10px] text-amber block uppercase">Pending</span>
                          <span className="text-sm font-bold text-amber font-serif">{pending}</span>
                        </div>
                        <div className="p-2 bg-surface rounded-lg border border-border">
                          <span className="text-[10px] text-rose block uppercase">Revisions</span>
                          <span className="text-sm font-bold text-rose-dark font-serif">{rejected}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] text-charcoal-500 mb-1">
                          <span>Approval Signoff</span>
                          <span className="font-semibold text-charcoal">{percent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-ivory-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sage rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </Card>
      )}

      {/* Tab 7: Financials */}
      {activeTab === 'payments' && (
        <Card className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-charcoal font-serif">Event Financial Summary</h3>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Financial records tied to booked shoot and production milestones.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {event && (
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<DollarSign className="w-3.5 h-3.5" />}
                  onClick={() => setIsRecordPaymentOpen(true)}
                >
                  Record Payment
                </Button>
              )}
              {event && (
                <Link to={`/events/${event.id}`}>
                  <Button size="sm" variant="outline" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                    View Event Billing
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-ivory-50 rounded-xl border border-border">
              <span className="text-xs text-charcoal-400 block">Total Package Value</span>
              <span className="text-xl font-bold text-charcoal mt-1 block font-serif">
                {formatCurrency(totalFee)}
              </span>
            </div>

            <div className="p-4 bg-ivory-50 rounded-xl border border-border">
              <span className="text-xs text-sage block">Total Received</span>
              <span className="text-xl font-bold text-sage mt-1 block font-serif">
                {formatCurrency(totalPaid)}
              </span>
            </div>

            <div className="p-4 bg-ivory-50 rounded-xl border border-border">
              <span className="text-xs text-amber block">Balance Remaining</span>
              <span className="text-xl font-bold text-amber mt-1 block font-serif">
                {formatCurrency(balanceDue)}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-3">
              Recorded Payment Installments ({eventPayments.length})
            </h4>
            {eventPayments.length === 0 ? (
              <p className="text-xs text-charcoal-400 italic">No payments logged for this event.</p>
            ) : (
              <div className="space-y-2">
                {eventPayments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-surface rounded-lg border border-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-charcoal">{formatCurrency(p.amount)}</span>
                      <span className="text-charcoal-400 ml-2">via {p.paymentMethod || p.method}</span>
                      {p.referenceNumber && (
                        <span className="text-charcoal-400 font-mono text-[10px] ml-2">({p.referenceNumber})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-charcoal-400">{formatDate(p.paidDate || p.paymentDate || p.createdAt)}</span>
                      <Badge size="xs" variant={p.status === 'Paid' || p.status === 'Completed' ? 'sage' : 'amber'}>
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Edit Project Modal */}
      <ProjectModal
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        project={project}
      />

      {/* Delete Project Confirmation Modal */}
      <Modal
        isOpen={isDeleteProjectOpen}
        onClose={() => setIsDeleteProjectOpen(false)}
        title="Confirm Project Workspace Deletion"
        subtitle="This action safely cleans up linked tasks and production notes."
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              Are you sure you want to delete <strong>{project.title}</strong>? All {projectTasks.length} associated task(s) and {projectNotes.length} note(s) will be removed. The original scheduled shoot record will remain untouched.
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsDeleteProjectOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        defaultProjectId={project.id}
      />

      {/* Project Note Modal */}
      <ProjectNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setEditingNote(null);
        }}
        projectId={project.id}
        note={editingNote}
      />

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
        defaultProjectId={project.id}
        deliverable={editingDeliverable}
      />

      {/* Record Payment Modal */}
      {isRecordPaymentOpen && event && (
        <RecordPaymentModal
          isOpen={isRecordPaymentOpen}
          onClose={() => setIsRecordPaymentOpen(false)}
          eventId={event.id}
        />
      )}
    </div>
  );
}
