import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Plus,
  Clock,
  Filter,
  AlertCircle,
  Kanban,
  List,
  CheckCircle2,
  Edit2,
  Trash2,
  User,
  Calendar,
  ArrowRight,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge, PriorityBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { SearchInput } from '../components/common/SearchInput';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { TaskModal } from '../components/modals/TaskModal';
import { formatDate } from '../utils/formatters';

const KANBAN_COLUMNS = [
  { id: 'To Do', label: 'To Do', color: 'border-charcoal/20 bg-ivory-50/70', aliases: ['To Do', 'Pending'] },
  { id: 'In Progress', label: 'In Progress', color: 'border-terracotta/30 bg-terracotta/5', aliases: ['In Progress'] },
  { id: 'In Review', label: 'In Review', color: 'border-amber/30 bg-amber/5', aliases: ['In Review'] },
  { id: 'Done', label: 'Done', color: 'border-sage/30 bg-sage/5', aliases: ['Done', 'Completed'] },
];

export function TasksPage() {
  const { tasks, projects, team, updateTask, deleteTask, deleteAllTasks, toggleTaskComplete } = useStudioData();
  const toast = useToast();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedAssignee, setSelectedAssignee] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDeadline, setSelectedDeadline] = useState('All'); // 'All' | 'overdue' | 'today' | 'week'

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Helper date calculations
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const nextWeekStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  }, []);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Search
      const matchesSearch =
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Project filter
      const matchesProject = selectedProject === 'All' || t.projectId === selectedProject;

      // Assignee filter
      const matchesAssignee = selectedAssignee === 'All' || t.assignedTo === selectedAssignee;

      // Priority filter
      const matchesPriority = selectedPriority === 'All' || t.priority === selectedPriority;

      // Status filter
      let matchesStatus = true;
      if (selectedStatus !== 'All') {
        if (selectedStatus === 'To Do') {
          matchesStatus = t.status === 'To Do' || t.status === 'Pending';
        } else if (selectedStatus === 'Done') {
          matchesStatus = t.status === 'Done' || t.status === 'Completed';
        } else {
          matchesStatus = t.status === selectedStatus;
        }
      }

      // Deadline filter
      let matchesDeadline = true;
      if (selectedDeadline === 'overdue') {
        const isDone = t.status === 'Done' || t.status === 'Completed';
        matchesDeadline = !isDone && t.dueDate < todayStr;
      } else if (selectedDeadline === 'today') {
        matchesDeadline = t.dueDate === todayStr;
      } else if (selectedDeadline === 'week') {
        matchesDeadline = t.dueDate >= todayStr && t.dueDate <= nextWeekStr;
      }

      return matchesSearch && matchesProject && matchesAssignee && matchesPriority && matchesStatus && matchesDeadline;
    });
  }, [
    tasks,
    searchTerm,
    selectedProject,
    selectedAssignee,
    selectedPriority,
    selectedStatus,
    selectedDeadline,
    todayStr,
    nextWeekStr,
  ]);

  const handleStatusChange = (taskId, newStatus) => {
    try {
      updateTask(taskId, { status: newStatus });
      toast.success('Status Updated', `Task moved to ${newStatus}`);
    } catch (err) {
      toast.error('Update Failed', err.message);
    }
  };

  const handleAssigneeChange = (taskId, newAssignee) => {
    try {
      updateTask(taskId, { assignedTo: newAssignee || null });
      toast.success('Assignee Updated', 'Task reassigned successfully');
    } catch (err) {
      toast.error('Reassignment Failed', err.message);
    }
  };

  const handleDeleteTask = (taskId, title) => {
    setTaskToDelete({ id: taskId, title });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Studio Task Board"
        subtitle="Coordinate darkroom processing, color grading batches, culling, and client deliverables."
        badge={<Badge variant="terracotta">{tasks.length} Total Tasks</Badge>}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4 text-rose" />}
              onClick={() => setIsDeleteAllOpen(true)}
              disabled={tasks.length === 0}
              className="text-rose hover:bg-rose-light hover:border-rose/30"
            >
              Delete All ({tasks.length})
            </Button>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
            >
              Create Task
            </Button>
          </div>
        }
      />

      {/* Filter and Control Bar */}
      <div className="flex flex-col gap-3 p-3.5 sm:p-4 bg-surface rounded-xl border border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search tasks by title or brief..."
            className="w-full md:w-80"
          />

          {/* View mode toggle */}
          <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-ivory-50 shrink-0 self-end md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1.5 ${
                viewMode === 'kanban'
                  ? 'bg-surface text-terracotta shadow-xs font-semibold'
                  : 'text-charcoal-400 hover:text-charcoal'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-surface text-terracotta shadow-xs font-semibold'
                  : 'text-charcoal-400 hover:text-charcoal'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
              <span>List</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2 border-t border-border/60">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-ivory-50 text-charcoal hover:bg-surface focus:outline-none focus:ring-1 focus:ring-terracotta truncate"
          >
            <option value="All">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-ivory-50 text-charcoal hover:bg-surface focus:outline-none focus:ring-1 focus:ring-terracotta"
          >
            <option value="All">All Assignees</option>
            {team.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-ivory-50 text-charcoal hover:bg-surface focus:outline-none focus:ring-1 focus:ring-terracotta"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-ivory-50 text-charcoal hover:bg-surface focus:outline-none focus:ring-1 focus:ring-terracotta"
          >
            <option value="All">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="In Review">In Review</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={selectedDeadline}
            onChange={(e) => setSelectedDeadline(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-ivory-50 text-charcoal hover:bg-surface focus:outline-none focus:ring-1 focus:ring-terracotta col-span-2 sm:col-span-1"
          >
            <option value="All">All Deadlines</option>
            <option value="overdue">Overdue Only</option>
            <option value="today">Due Today</option>
            <option value="week">Due This Week</option>
          </select>
        </div>
      </div>

      {/* Main View: Kanban or List */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {KANBAN_COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => col.aliases.includes(t.status));

            return (
              <div
                key={col.id}
                className={`flex flex-col rounded-xl border p-3 min-h-[280px] sm:min-h-[480px] ${col.color}`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-charcoal font-serif">
                      {col.label}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-surface text-charcoal font-semibold text-[11px] flex items-center justify-center border border-border/80">
                      {colTasks.length}
                    </span>
                  </div>
                  <Button
                    size="xs"
                    variant="ghost"
                    className="p-1 h-auto text-charcoal-400 hover:text-charcoal"
                    onClick={() => {
                      setEditingTask({ status: col.id });
                      setIsModalOpen(true);
                    }}
                    title={`Add task to ${col.label}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="p-6 text-center text-xs text-charcoal-400 italic bg-surface/50 rounded-lg border border-dashed border-border/70 my-2">
                      No tasks in {col.label}
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const project = projects.find((p) => p.id === task.projectId);
                      const assigned = team.find((tm) => tm.id === task.assignedTo);
                      const isDone = task.status === 'Done' || task.status === 'Completed';
                      const isOverdue = !isDone && task.dueDate < todayStr;

                      return (
                        <Card
                          key={task.id}
                          className="p-3.5 bg-surface border border-border shadow-xs hover:shadow-sm transition-all space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 min-w-0">
                              <button
                                type="button"
                                onClick={() => toggleTaskComplete(task.id)}
                                className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                                  isDone
                                    ? 'bg-sage border-sage text-white'
                                    : 'border-border hover:border-terracotta bg-surface'
                                }`}
                                title={isDone ? 'Mark as incomplete' : 'Mark as done'}
                              >
                                {isDone && <CheckCircle2 className="w-3 h-3" />}
                              </button>
                              <div className="min-w-0">
                                <h4
                                  className={`text-xs font-semibold leading-snug ${
                                    isDone ? 'line-through text-charcoal-400' : 'text-charcoal'
                                  }`}
                                >
                                  {task.title}
                                </h4>
                                {project && (
                                  <Link
                                    to={`/projects/${project.id}`}
                                    className="text-[10px] text-terracotta hover:underline truncate block mt-0.5"
                                  >
                                    {project.title}
                                  </Link>
                                )}
                              </div>
                            </div>

                            <PriorityBadge priority={task.priority} size="xs" />
                          </div>

                          {task.description && (
                            <p className="text-[11px] text-charcoal-500 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                            {/* Due date */}
                            <div
                              className={`flex items-center gap-1 font-medium ${
                                isOverdue ? 'text-red-500' : 'text-charcoal-500'
                              }`}
                            >
                              <Clock className="w-3 h-3 shrink-0" />
                              <span>{formatDate(task.dueDate)}</span>
                            </div>

                            {/* Quick Assignee select */}
                            <div className="flex items-center gap-1.5">
                              <select
                                value={task.assignedTo || ''}
                                onChange={(e) => handleAssigneeChange(task.id, e.target.value)}
                                className="text-[10px] bg-ivory-50 border border-border rounded px-1.5 py-0.5 text-charcoal hover:bg-surface focus:outline-none"
                                title="Change Assignee"
                              >
                                <option value="">Unassigned</option>
                                {team.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.name.split(' ')[0]}
                                  </option>
                                ))}
                              </select>
                              {assigned && <Avatar src={assigned.avatar} name={assigned.name} size="xs" />}
                            </div>
                          </div>

                          {/* Quick Status Movement & Actions */}
                          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                            <select
                              value={col.id}
                              onChange={(e) => handleStatusChange(task.id, e.target.value)}
                              className="text-[10px] bg-ivory-100 font-medium border border-border/60 rounded px-1.5 py-0.5 text-charcoal-700"
                            >
                              <option value="To Do">Move: To Do</option>
                              <option value="In Progress">Move: In Progress</option>
                              <option value="In Review">Move: In Review</option>
                              <option value="Done">Move: Done</option>
                            </select>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingTask(task);
                                  setIsModalOpen(true);
                                }}
                                className="p-1 text-charcoal-400 hover:text-terracotta rounded"
                                title="Edit Task"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteTask(task.id, task.title)}
                                className="p-1 text-charcoal-400 hover:text-red-600 rounded"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <Card className="overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b border-border bg-ivory-50 text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-10">Done</th>
                  <th className="py-3 px-4">Task</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-xs text-charcoal-400 italic">
                      No tasks match your selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((t) => {
                    const project = projects.find((p) => p.id === t.projectId);
                    const assigned = team.find((tm) => tm.id === t.assignedTo);
                    const isDone = t.status === 'Done' || t.status === 'Completed';
                    const isOverdue = !isDone && t.dueDate < todayStr;

                    return (
                      <tr key={t.id} className="hover:bg-ivory-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => toggleTaskComplete(t.id)}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              isDone
                                ? 'bg-sage border-sage text-white'
                                : 'border-border hover:border-terracotta bg-surface'
                            }`}
                          >
                            {isDone && <CheckCircle2 className="w-3 h-3" />}
                          </button>
                        </td>

                        <td className="py-3 px-4 max-w-xs">
                          <span
                            className={`font-medium ${
                              isDone ? 'line-through text-charcoal-400' : 'text-charcoal'
                            }`}
                          >
                            {t.title}
                          </span>
                          {t.description && (
                            <p className="text-[11px] text-charcoal-400 truncate mt-0.5">{t.description}</p>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {project ? (
                            <Link
                              to={`/projects/${project.id}`}
                              className="text-terracotta hover:underline truncate block max-w-[150px]"
                            >
                              {project.title}
                            </Link>
                          ) : (
                            <span className="text-charcoal-400 italic">Studio General</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            {assigned ? (
                              <>
                                <Avatar src={assigned.avatar} name={assigned.name} size="xs" />
                                <span className="text-charcoal-700">{assigned.name}</span>
                              </>
                            ) : (
                              <span className="text-charcoal-400 italic">Unassigned</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <PriorityBadge priority={t.priority} size="xs" />
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`font-medium ${
                              isOverdue ? 'text-red-500 font-semibold' : 'text-charcoal-600'
                            }`}
                          >
                            {formatDate(t.dueDate)}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={
                              t.status === 'Pending' ? 'To Do' : t.status === 'Completed' ? 'Done' : t.status
                            }
                            onChange={(e) => handleStatusChange(t.id, e.target.value)}
                            className="text-[11px] bg-ivory-50 border border-border rounded px-2 py-1 text-charcoal hover:bg-surface focus:outline-none"
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="In Review">In Review</option>
                            <option value="Done">Done</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingTask(t);
                                setIsModalOpen(true);
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
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
      />

      {/* Delete All Tasks Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDeleteAllOpen}
        onClose={() => setIsDeleteAllOpen(false)}
        onConfirm={() => {
          const count = deleteAllTasks();
          setIsDeleteAllOpen(false);
          toast.success('Tasks Deleted', `Successfully deleted all ${count} tasks.`);
        }}
        title="Delete All Tasks?"
        message={`Are you sure you want to delete all ${tasks.length} studio tasks? This action cannot be undone.`}
        confirmLabel={`Delete All (${tasks.length})`}
        cancelLabel="Cancel"
        isDestructive={true}
      />

      {/* Delete Single Task Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (!taskToDelete) return;
          try {
            deleteTask(taskToDelete.id);
            toast.success('Task Deleted', `Removed task "${taskToDelete.title}"`);
          } catch (err) {
            toast.error('Deletion Failed', err.message);
          } finally {
            setTaskToDelete(null);
          }
        }}
        title="Delete Task?"
        message={`Are you sure you want to delete task "${taskToDelete?.title || ''}"? This action cannot be undone.`}
        confirmLabel="Delete Task"
        cancelLabel="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
