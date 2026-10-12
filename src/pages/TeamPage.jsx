import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  Plus,
  Mail,
  Phone,
  Camera,
  Sparkles,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Briefcase,
  ChevronRight,
  FolderKanban,
  CheckSquare,
  ArrowRightLeft,
  X,
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/common/Card';
import { Badge, PriorityBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { TeamMemberModal } from '../components/modals/TeamMemberModal';
import { formatDate } from '../utils/formatters';

export function TeamPage() {
  const {
    team,
    tasks,
    projects,
    getTeamMemberWorkload,
    deleteTeamMember,
    deleteAllTeamMembers,
    updateTask,
  } = useStudioData();
  const toast = useToast();

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

  // Drawer / slide-over state
  const [selectedMember, setSelectedMember] = useState(null);

  // Delete blocker modal state
  const [deletingMember, setDeletingMember] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [memberToDelete, setMemberToDelete] = useState(null);

  // Reassign modal state
  const [reassigningTask, setReassigningTask] = useState(null);
  const [targetMemberId, setTargetMemberId] = useState('');

  const getWorkloadSummaryBadge = (workload) => {
    const { totalTasks, inProgressTasks, overdueTasks } = workload;
    if (totalTasks === 0) {
      return <Badge variant="default" size="xs">0 Tasks Assigned</Badge>;
    }
    if (overdueTasks > 0) {
      return (
        <Badge variant="rose" size="xs">
          {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'} ({overdueTasks} Overdue)
        </Badge>
      );
    }
    if (inProgressTasks > 0) {
      return (
        <Badge variant="terracotta" size="xs">
          {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'} ({inProgressTasks} In Progress)
        </Badge>
      );
    }
    return (
      <Badge variant="default" size="xs">
        {totalTasks} {totalTasks === 1 ? 'Task Assigned' : 'Tasks Assigned'}
      </Badge>
    );
  };

  const getAvailabilityBadge = (member) => {
    if (member.availability) {
      const availLower = member.availability.toLowerCase();
      let variant = 'sage';
      if (availLower.includes('leave') || availLower.includes('away') || availLower.includes('off')) {
        variant = 'amber';
      } else if (availLower.includes('busy') || availLower.includes('unavailable')) {
        variant = 'rose';
      }
      return (
        <div className="mt-1.5 flex items-center gap-1.5">
          <Badge size="xs" variant={variant}>
            {member.availability}
          </Badge>
        </div>
      );
    }

    if (member.status === 'On Leave') {
      return (
        <div className="mt-1.5 flex items-center gap-1.5">
          <Badge size="xs" variant="amber">
            On Leave
          </Badge>
        </div>
      );
    }

    if (member.status === 'Contractor') {
      return (
        <div className="mt-1.5 flex items-center gap-1.5">
          <Badge size="xs" variant="default">
            Contractor
          </Badge>
        </div>
      );
    }

    // Do not show misleading "Active" badge when member has no explicit availability data
    return null;
  };

  const handleDeleteClick = (member) => {
    const assignedTasks = tasks.filter((t) => t.assignedTo === member.id);
    if (assignedTasks.length > 0) {
      setDeletingMember(member);
      setDeleteError(
        `Cannot delete ${member.name} because they are assigned to ${assignedTasks.length} task(s). Please reassign or complete their tasks first.`
      );
      return;
    }

    setMemberToDelete(member);
  };

  const handleExecuteReassignment = () => {
    if (!reassigningTask || !targetMemberId) return;
    try {
      updateTask(reassigningTask.id, { assignedTo: targetMemberId });
      const targetMember = team.find((m) => m.id === targetMemberId);
      toast.success(
        'Task Reassigned',
        `Reassigned "${reassigningTask.title}" to ${targetMember?.name || 'team member'}`
      );
      setReassigningTask(null);
      setTargetMemberId('');
    } catch (err) {
      toast.error('Reassignment Failed', err.message);
    }
  };

  // Compute tasks for the selected drawer member
  const memberTasks = useMemo(() => {
    if (!selectedMember) return [];
    return tasks.filter((t) => t.assignedTo === selectedMember.id);
  }, [tasks, selectedMember]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Studio Creative Team & Crew"
        subtitle="Manage lead photographers, retouchers, colorists, workload distribution, and task assignments."
        badge={<Badge variant="terracotta">{team.length} Team Members</Badge>}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4 text-rose" />}
              onClick={() => setIsDeleteAllOpen(true)}
              disabled={team.length === 0}
              className="text-rose hover:bg-rose-light hover:border-rose/30"
            >
              Delete All ({team.length})
            </Button>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingMember(null);
                setIsAddEditModalOpen(true);
              }}
            >
              Add Team Member
            </Button>
          </div>
        }
      />

      {/* Grid of Team Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => {
          const workload = getTeamMemberWorkload(member.id);

          return (
            <Card key={member.id} hover className="p-4 sm:p-6 flex flex-col justify-between space-y-4">
              <div>
                {/* Header: Avatar, Name, Role, and Availability on clean line beneath role */}
                <div className="flex items-start gap-3.5">
                  <Avatar src={member.avatar} name={member.name} size="xl" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-charcoal font-serif truncate" title={member.name}>
                      {member.name}
                    </h3>
                    <p className="text-xs font-medium text-terracotta leading-snug">
                      {member.role}
                    </p>
                    {/* Team-member availability on its own clean line beneath the role */}
                    {getAvailabilityBadge(member)}
                  </div>
                </div>

                {/* Specialty */}
                <div className="mt-3 p-2.5 bg-ivory-50 rounded-lg border border-border/70 text-xs text-charcoal-600">
                  <span className="font-semibold text-charcoal block mb-0.5 text-[11px] uppercase tracking-wider">
                    Creative Specialty
                  </span>
                  {member.specialty || 'General Studio Photography'}
                </div>

                {/* Workload Section with clear task-count summary badge and accurate metric breakdown */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-charcoal uppercase tracking-wider">
                      Workload
                    </span>
                    {getWorkloadSummaryBadge(workload)}
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 bg-ivory-100/60 p-2.5 rounded-lg border border-border/80 text-center">
                    <div>
                      <span className="text-[10px] text-charcoal-400 block uppercase font-medium">Assigned</span>
                      <span className="text-xs font-bold text-charcoal mt-0.5 block">{workload.totalTasks}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-terracotta block uppercase font-medium">In Progress</span>
                      <span className="text-xs font-bold text-terracotta mt-0.5 block">{workload.inProgressTasks}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-red-500 block uppercase font-medium">Overdue</span>
                      <span className="text-xs font-bold text-red-600 mt-0.5 block">{workload.overdueTasks}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-sage block uppercase font-medium">Completed</span>
                      <span className="text-xs font-bold text-sage mt-0.5 block">{workload.completedTasks}</span>
                    </div>
                  </div>
                </div>

                {/* Contact info */}
                <div className="mt-3.5 space-y-1.5 text-xs text-charcoal-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Actions */}
              <div className="pt-3 border-t border-border/80 flex items-center justify-between">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => setSelectedMember(member)}
                >
                  View Tasks ({workload.totalTasks})
                </Button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMember(member);
                      setIsAddEditModalOpen(true);
                    }}
                    className="p-1.5 text-charcoal-400 hover:text-terracotta rounded"
                    title="Edit Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(member)}
                    className="p-1.5 text-charcoal-400 hover:text-red-600 rounded"
                    title="Remove Member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Member Tasks Drawer / Slide-Over Modal */}
      {selectedMember && (
        <Modal
          isOpen={Boolean(selectedMember)}
          onClose={() => setSelectedMember(null)}
          title={`${selectedMember.name}'s Assigned Workload`}
          subtitle={`${selectedMember.role} • ${memberTasks.length} task(s) on file`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            {memberTasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-charcoal-400 italic bg-ivory-50 rounded-xl border border-dashed border-border">
                No active tasks assigned to {selectedMember.name}.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                {memberTasks.map((task) => {
                  const project = projects.find((p) => p.id === task.projectId);
                  const isDone = task.status === 'Done' || task.status === 'Completed';

                  return (
                    <div
                      key={task.id}
                      className="p-3.5 bg-surface rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={task.priority} size="xs" />
                          <span
                            className={`font-semibold ${
                              isDone ? 'line-through text-charcoal-400' : 'text-charcoal'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>
                        {project && (
                          <div className="text-[11px] text-terracotta font-medium">
                            Project: {project.title}
                          </div>
                        )}
                        <div className="text-[11px] text-charcoal-400">
                          Due: {formatDate(task.dueDate)} &bull; Status: {task.status}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <Button
                          size="xs"
                          variant="outline"
                          leftIcon={<ArrowRightLeft className="w-3 h-3" />}
                          onClick={() => {
                            setReassigningTask(task);
                            setTargetMemberId('');
                          }}
                        >
                          Reassign
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-3 border-t border-border flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedMember(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reassign Task Sub-Modal */}
      {reassigningTask && (
        <Modal
          isOpen={Boolean(reassigningTask)}
          onClose={() => setReassigningTask(null)}
          title="Reassign Production Task"
          subtitle={`Transfer "${reassigningTask.title}" to another crew member`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">
                Select New Assignee
              </label>
              <select
                value={targetMemberId}
                onChange={(e) => setTargetMemberId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-border bg-surface text-charcoal focus:ring-1 focus:ring-terracotta focus:outline-none"
              >
                <option value="">Select a team member...</option>
                {team
                  .filter((m) => m.id !== reassigningTask.assignedTo)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setReassigningTask(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={!targetMemberId}
                onClick={handleExecuteReassignment}
              >
                Confirm Reassignment
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Blocker Warning Modal */}
      {deletingMember && (
        <Modal
          isOpen={Boolean(deletingMember)}
          onClose={() => {
            setDeletingMember(null);
            setDeleteError('');
          }}
          title="Deletion Blocked"
          subtitle="Team member has active assigned production tasks"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>{deleteError}</div>
            </div>

            <p className="text-xs text-charcoal-500">
              Open the member's task list to reassign their tasks to another artist or mark them as completed before removing them from the studio roster.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDeletingMember(null);
                  setDeleteError('');
                }}
              >
                Dismiss
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedMember(deletingMember);
                  setDeletingMember(null);
                  setDeleteError('');
                }}
              >
                View & Reassign Tasks
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Team Member Modal */}
      <TeamMemberModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingMember(null);
        }}
        member={editingMember}
      />

      {/* Delete All Team Members Dialog */}
      <ConfirmDialog
        isOpen={isDeleteAllOpen}
        onClose={() => setIsDeleteAllOpen(false)}
        onConfirm={() => {
          const count = team.length;
          deleteAllTeamMembers();
          setIsDeleteAllOpen(false);
          setSelectedMember(null);
          toast.success('Team Cleared', `Successfully deleted all ${count} team members.`);
        }}
        title="Delete All Team Members?"
        message={`Are you sure you want to delete all ${team.length} team members? This will remove all artist profiles and safely unassign their linked tasks and events. This action cannot be undone.`}
        confirmLabel={`Delete All (${team.length})`}
        isDestructive={true}
      />

      {/* Delete Single Team Member Dialog */}
      <ConfirmDialog
        isOpen={Boolean(memberToDelete)}
        onClose={() => setMemberToDelete(null)}
        onConfirm={() => {
          if (!memberToDelete) return;
          try {
            deleteTeamMember(memberToDelete.id);
            toast.success('Team Member Removed', `Removed ${memberToDelete.name}`);
            if (selectedMember?.id === memberToDelete.id) setSelectedMember(null);
          } catch (err) {
            toast.error('Deletion Failed', err.message);
          } finally {
            setMemberToDelete(null);
          }
        }}
        title="Remove Team Member?"
        message={`Are you sure you want to remove ${memberToDelete?.name || ''} from the studio roster? This action cannot be undone.`}
        confirmLabel="Remove Member"
        cancelLabel="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
