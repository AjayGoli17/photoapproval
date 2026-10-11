import React, { useState, useEffect } from 'react';
import { CheckSquare, Calendar, Flag, User, Tag, FileText } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormField, FormInput, FormSelect, FormTextarea } from '../common/FormField';
import { useStudioData } from '../../context/StudioDataContext';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = [
  'Culling',
  'Color Grading',
  'Retouching',
  'Album Design',
  'Client Review',
  'Printing',
  'Deliverable Prep',
  'General',
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const STATUSES = [
  { value: 'To Do', label: 'To Do' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'In Review', label: 'In Review' },
  { value: 'Done', label: 'Done' },
];

export function TaskModal({ isOpen, onClose, task = null, defaultProjectId = null, onSaved = null }) {
  const { projects, team, addTask, updateTask } = useStudioData();
  const toast = useToast();

  const isEditing = Boolean(task && task.id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: defaultProjectId || projects[0]?.id || '',
    assignedTo: team[0]?.id || '',
    startDate: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    category: 'Color Grading',
    status: 'To Do',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Normalize status
        let initialStatus = task.status;
        if (initialStatus === 'Pending') initialStatus = 'To Do';
        if (initialStatus === 'Completed') initialStatus = 'Done';

        setFormData({
          title: task.title || '',
          description: task.description || '',
          projectId: task.projectId || defaultProjectId || '',
          assignedTo: task.assignedTo || '',
          startDate: task.startDate ? task.startDate.split('T')[0] : '',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : new Date().toISOString().split('T')[0],
          priority: task.priority || 'Medium',
          category: task.category || 'General',
          status: initialStatus || 'To Do',
        });
      } else {
        setFormData({
          title: '',
          description: '',
          projectId: defaultProjectId || projects[0]?.id || '',
          assignedTo: team[0]?.id || '',
          startDate: '',
          dueDate: new Date().toISOString().split('T')[0],
          priority: 'Medium',
          category: 'Color Grading',
          status: 'To Do',
        });
      }
      setErrors({});
    }
  }, [isOpen, task, defaultProjectId, projects, team]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Task title is required';
    }
    if (!formData.dueDate) {
      errs.dueDate = 'Due date is required';
    }
    if (formData.startDate && formData.dueDate && formData.dueDate < formData.startDate) {
      errs.dueDate = 'Due date cannot precede the start date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        projectId: formData.projectId || null,
        assignedTo: formData.assignedTo || null,
        startDate: formData.startDate || null,
        dueDate: formData.dueDate,
        priority: formData.priority,
        category: formData.category,
        status: formData.status,
      };

      if (isEditing) {
        const updated = updateTask(task.id, payload);
        toast.success('Task Updated', `Updated task: ${updated.title}`);
        if (onSaved) onSaved(updated);
      } else {
        const created = addTask(payload);
        toast.success('Task Created', `Added task: ${created.title}`);
        if (onSaved) onSaved(created);
      }
      onClose();
    } catch (err) {
      toast.error('Task Save Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Production Task' : 'Create Production Task'}
      subtitle="Assign darkroom editing, culling, or client delivery items to your team"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Task Title" required error={errors.title}>
          <FormInput
            placeholder="e.g. Color grade 150 raw proofs"
            value={formData.title}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, title: e.target.value }));
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            error={!!errors.title}
            autoFocus
          />
        </FormField>

        <FormField label="Description / Brief" error={errors.description}>
          <FormTextarea
            placeholder="Key editing directives, reference look, client requests..."
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            rows={2}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Associated Project">
            <FormSelect
              value={formData.projectId}
              onChange={(e) => setFormData((prev) => ({ ...prev, projectId: e.target.value }))}
            >
              <option value="">General Studio Task</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </FormSelect>
          </FormField>

          <FormField label="Assigned Artist">
            <FormSelect
              value={formData.assignedTo}
              onChange={(e) => setFormData((prev) => ({ ...prev, assignedTo: e.target.value }))}
            >
              <option value="">Unassigned</option>
              {team.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role.split(' ')[0]})
                </option>
              ))}
            </FormSelect>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Category">
            <FormSelect
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </FormSelect>
          </FormField>

          <FormField label="Priority">
            <FormSelect
              value={formData.priority}
              onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value }))}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </FormSelect>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FormField label="Start Date">
            <FormInput
              type="date"
              value={formData.startDate}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, startDate: e.target.value }));
                if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: '' }));
              }}
            />
          </FormField>

          <FormField label="Due Date" required error={errors.dueDate}>
            <FormInput
              type="date"
              value={formData.dueDate}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, dueDate: e.target.value }));
                if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: '' }));
              }}
              error={!!errors.dueDate}
            />
          </FormField>

          <FormField label="Status">
            <FormSelect
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </FormSelect>
          </FormField>
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
