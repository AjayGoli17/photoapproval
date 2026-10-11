import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Trash2,
  Calendar,
  Clock,
  ChevronRight,
  LayoutGrid,
  List,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { SearchInput } from '../components/common/SearchInput';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ProjectModal } from '../components/modals/ProjectModal';
import { formatDate } from '../utils/formatters';

export function ProjectsPage() {
  const { projects, clients, events, tasks, team, getProjectProgress, deleteAllProjects } = useStudioData();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline' | 'progress' | 'shoot' | 'title'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

  // Compute enriched project list
  const enrichedProjects = useMemo(() => {
    return projects.map((p) => {
      const client = clients.find((c) => c.id === p.clientId);
      const event = events.find((e) => e.id === p.eventId);
      const projectTasks = tasks.filter((t) => t.projectId === p.id);
      const progress = getProjectProgress(p.id);

      // Find next task deadline for pending tasks
      const pendingTasks = projectTasks
        .filter((t) => t.status !== 'Completed' && t.status !== 'Done')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      const nextTask = pendingTasks[0] || null;

      // Find team members assigned to this project
      const assignedMemberIds = Array.from(new Set(projectTasks.map((t) => t.assignedTo).filter(Boolean)));
      const assignedMembers = team.filter((m) => assignedMemberIds.includes(m.id));

      return {
        ...p,
        clientName: client?.name || 'Unassigned Client',
        eventName: event?.title || 'Standalone Production',
        eventDate: event?.startDate,
        progress,
        projectTasksCount: projectTasks.length,
        nextTask,
        assignedMembers,
      };
    });
  }, [projects, clients, events, tasks, team, getProjectProgress]);

  // Filter and sort
  const filteredProjects = useMemo(() => {
    return enrichedProjects
      .filter((p) => {
        const matchesSearch =
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          return new Date(a.deliveryDeadline || '2099-01-01') - new Date(b.deliveryDeadline || '2099-01-01');
        }
        if (sortBy === 'progress') {
          return b.progress - a.progress;
        }
        if (sortBy === 'shoot') {
          return new Date(b.shootDate || '1970-01-01') - new Date(a.shootDate || '1970-01-01');
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [enrichedProjects, searchTerm, statusFilter, categoryFilter, sortBy]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [projects]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Workspaces"
        subtitle="Manage end-to-end post-production pipelines, culling workflows, editing progress, and team deliverables."
        badge={<Badge variant="terracotta">{projects.length} Active Workspaces</Badge>}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4 text-rose" />}
              onClick={() => setIsDeleteAllOpen(true)}
              disabled={projects.length === 0}
              className="text-rose hover:bg-rose-light hover:border-rose/30"
            >
              Delete All ({projects.length})
            </Button>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              New Project
            </Button>
          </div>
        }
      />

      {/* Control bar: Filters, Search, View Mode */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 bg-surface rounded-xl border border-border">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 flex-1">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search projects or clients..."
            className="w-full sm:w-64"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-border bg-ivory-50 text-charcoal hover:bg-surface focus:outline-none focus:ring-1 focus:ring-terracotta"
          >
            <option value="All">All Statuses</option>
            <option value="Planning">Planning</option>
            <option value="In Production">In Production</option>
            <option value="Post-Production">Post-Production</option>
            <option value="Client Review">Client Review</option>
            <option value="Completed">Completed</option>
          </select>

          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-border bg-ivory-50 text-charcoal hover:bg-surface focus:outline-none focus:ring-1 focus:ring-terracotta"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-border bg-ivory-50 text-charcoal hover:bg-surface focus:outline-none focus:ring-1 focus:ring-terracotta"
          >
            <option value="deadline">Sort by Deadline</option>
            <option value="progress">Sort by Progress</option>
            <option value="shoot">Sort by Shoot Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-ivory-50 shrink-0 self-end md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded text-xs transition-colors ${
              viewMode === 'grid'
                ? 'bg-surface text-terracotta shadow-xs font-medium'
                : 'text-charcoal-400 hover:text-charcoal'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded text-xs transition-colors ${
              viewMode === 'table'
                ? 'bg-surface text-terracotta shadow-xs font-medium'
                : 'text-charcoal-400 hover:text-charcoal'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 ? (
        <Card className="p-12 text-center bg-surface border-dashed">
          <FolderKanban className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-charcoal font-serif">No Project Workspaces Found</h3>
          <p className="text-xs text-charcoal-500 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'All' || categoryFilter !== 'All'
              ? 'No projects match your current filter query. Try clearing your search parameters.'
              : 'There are currently no active projects. Create a new project workspace linked to a booked shoot.'}
          </p>
          <div className="mt-4">
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              New Project
            </Button>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} hover className="overflow-hidden flex flex-col justify-between">
              <div>
                {/* Cover Image */}
                <div className="h-44 w-full bg-ivory-200 relative overflow-hidden">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge variant="default" size="sm" className="bg-surface/90 shadow-xs backdrop-blur-xs">
                      {project.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge
                      size="sm"
                      variant={
                        project.status === 'Completed'
                          ? 'sage'
                          : project.status === 'Client Review'
                          ? 'amber'
                          : project.status === 'Post-Production'
                          ? 'terracotta'
                          : 'default'
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-semibold text-charcoal leading-snug font-serif">
                      <Link to={`/projects/${project.id}`} className="hover:text-terracotta transition-colors">
                        {project.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-charcoal-500 mt-1">
                      Client: <span className="text-charcoal-700 font-medium">{project.clientName}</span>
                    </p>
                    <p className="text-xs text-charcoal-400 mt-0.5">
                      Event: <span className="text-charcoal-600">{project.eventName}</span>
                    </p>
                  </div>

                  {/* Dynamic Progress Calculation (Req 8) */}
                  <div className="pt-2 border-t border-border/60">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-charcoal-500 text-[11px]">Production Progress</span>
                      <span className="font-semibold text-charcoal text-[11px]">
                        {project.progress}% ({project.projectTasksCount} tasks)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-ivory-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-terracotta rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Next task deadline & Team */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-charcoal-500">
                    <div className="flex items-center gap-1.5 truncate max-w-[60%]">
                      <Clock className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                      <span className="truncate text-[11px]">
                        {project.nextTask ? `Next: ${project.nextTask.title}` : 'All tasks cleared'}
                      </span>
                    </div>

                    {/* Team avatars */}
                    <div className="flex -space-x-1.5 overflow-hidden shrink-0">
                      {project.assignedMembers.slice(0, 3).map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar}
                          alt={m.name}
                          title={`${m.name} (${m.role})`}
                          className="w-5 h-5 rounded-full object-cover border border-surface"
                        />
                      ))}
                      {project.assignedMembers.length > 3 && (
                        <span className="w-5 h-5 rounded-full bg-ivory-300 text-charcoal-600 text-[9px] flex items-center justify-center font-bold">
                          +{project.assignedMembers.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3.5 bg-ivory-50 border-t border-border/80 flex items-center justify-between text-xs">
                <span className="text-charcoal-500 text-[11px]">
                  Target: {formatDate(project.deliveryDeadline)}
                </span>
                <Link to={`/projects/${project.id}`}>
                  <Button variant="ghost" size="xs" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                    Open Workspace
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Compact Table List View */
        <Card className="overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-ivory-50 text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Project Workspace</th>
                  <th className="py-3 px-4">Client & Event</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Next Deadline</th>
                  <th className="py-3 px-4">Assigned Team</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-ivory-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-border"
                        />
                        <div>
                          <Link
                            to={`/projects/${project.id}`}
                            className="font-semibold text-charcoal hover:text-terracotta transition-colors font-serif"
                          >
                            {project.title}
                          </Link>
                          <div className="text-[11px] text-charcoal-400">
                            {project.category} &bull; Target: {formatDate(project.deliveryDeadline)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-charcoal-700">{project.clientName}</div>
                      <div className="text-[11px] text-charcoal-400">{project.eventName}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        size="xs"
                        variant={
                          project.status === 'Completed'
                            ? 'sage'
                            : project.status === 'Client Review'
                            ? 'amber'
                            : project.status === 'Post-Production'
                            ? 'terracotta'
                            : 'default'
                        }
                      >
                        {project.status}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="w-28">
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="font-semibold text-charcoal">{project.progress}%</span>
                          <span className="text-charcoal-400">{project.projectTasksCount} tasks</span>
                        </div>
                        <div className="w-full h-1.5 bg-ivory-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-terracotta rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-600">
                      {project.nextTask ? (
                        <div>
                          <div className="font-medium text-[11px] truncate max-w-[140px]">
                            {project.nextTask.title}
                          </div>
                          <div className="text-[10px] text-charcoal-400">
                            Due: {formatDate(project.nextTask.dueDate)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sage font-medium text-[11px]">All tasks done</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex -space-x-1 overflow-hidden">
                        {project.assignedMembers.map((m) => (
                          <img
                            key={m.id}
                            src={m.avatar}
                            alt={m.name}
                            title={`${m.name} (${m.role})`}
                            className="w-6 h-6 rounded-full object-cover border border-surface"
                          />
                        ))}
                        {project.assignedMembers.length === 0 && (
                          <span className="text-[11px] text-charcoal-400 italic">None</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link to={`/projects/${project.id}`}>
                        <Button variant="ghost" size="xs" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                          Open
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Project Creation Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Delete All Projects Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDeleteAllOpen}
        onClose={() => setIsDeleteAllOpen(false)}
        onConfirm={() => {
          const count = deleteAllProjects();
          setIsDeleteAllOpen(false);
          toast.success('Projects Deleted', `Successfully deleted all ${count} project workspaces.`);
        }}
        title="Delete All Projects?"
        message={`Are you sure you want to delete all ${projects.length} project workspaces? Associated tasks, production notes, and deliverable links will be cleanly removed or unlinked. This action cannot be undone.`}
        confirmLabel={`Delete All (${projects.length})`}
        cancelLabel="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
