import React, { useState, useEffect } from 'react';
import { FolderKanban, Calendar, Tag, Image, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormField, FormInput, FormSelect } from '../common/FormField';
import { useStudioData } from '../../context/StudioDataContext';
import { useToast } from '../../context/ToastContext';

const PRESET_COVERS = [
  { label: 'Udaipur Palace (Wedding)', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
  { label: 'Studio Editorial', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
  { label: 'Vogue Runway / Fashion', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fine Art Portrait', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
  { label: 'Luxury Reception', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80' },
];

export function ProjectModal({ isOpen, onClose, project = null, defaultEventId = null, onSaved = null }) {
  const { events, clients, projects, addProject, updateProject } = useStudioData();
  const toast = useToast();

  const isEditing = Boolean(project && project.id);

  // Filter events without existing projects (except for current project's event if editing)
  const availableEvents = events.filter((ev) => {
    if (isEditing && project.eventId === ev.id) return true;
    const existing = projects.find((p) => p.eventId === ev.id);
    return !existing;
  });

  const [formData, setFormData] = useState({
    eventId: '',
    title: '',
    status: 'Planning',
    category: 'Wedding',
    shootDate: '',
    deliveryDeadline: '',
    coverImage: PRESET_COVERS[0].url,
    tags: 'Active Workspace',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (project) {
        setFormData({
          eventId: project.eventId || '',
          title: project.title || '',
          status: project.status || 'Planning',
          category: project.category || 'Wedding',
          shootDate: project.shootDate ? project.shootDate.split('T')[0] : '',
          deliveryDeadline: project.deliveryDeadline ? project.deliveryDeadline.split('T')[0] : '',
          coverImage: project.coverImage || PRESET_COVERS[0].url,
          tags: Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || ''),
        });
      } else {
        const initialEventId = defaultEventId || availableEvents[0]?.id || (events[0]?.id || '');
        const selEvent = events.find((e) => e.id === initialEventId);
        setFormData({
          eventId: initialEventId,
          title: selEvent ? `${selEvent.title} Workspace` : '',
          status: 'Planning',
          category: selEvent?.eventType?.includes('Wedding') ? 'Wedding' : 'Commercial',
          shootDate: selEvent ? selEvent.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
          deliveryDeadline: selEvent ? (selEvent.endDate || selEvent.startDate).split('T')[0] : '',
          coverImage: PRESET_COVERS[0].url,
          tags: 'Active Workspace, Post-Production',
        });
      }
      setErrors({});
    }
  }, [isOpen, project, defaultEventId]);

  const handleEventChange = (evId) => {
    const selEvent = events.find((e) => e.id === evId);
    setFormData((prev) => ({
      ...prev,
      eventId: evId,
      title: selEvent ? `${selEvent.title} Workspace` : prev.title,
      shootDate: selEvent ? selEvent.startDate.split('T')[0] : prev.shootDate,
      deliveryDeadline: selEvent ? (selEvent.endDate || selEvent.startDate).split('T')[0] : prev.deliveryDeadline,
      category: selEvent?.eventType?.includes('Wedding') ? 'Wedding' : 'Commercial',
    }));
  };

  const validate = () => {
    const errs = {};
    if (!isEditing && !formData.eventId) {
      errs.eventId = 'Please link a scheduled event';
    }
    if (!formData.title.trim()) {
      errs.title = 'Project title is required';
    }
    if (!formData.deliveryDeadline) {
      errs.deliveryDeadline = 'Delivery deadline is required';
    }
    if (formData.shootDate && formData.deliveryDeadline && formData.deliveryDeadline < formData.shootDate) {
      errs.deliveryDeadline = 'Delivery deadline cannot be before shoot date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const parsedTags = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      if (isEditing) {
        const updated = updateProject(project.id, {
          title: formData.title.trim(),
          status: formData.status,
          category: formData.category,
          shootDate: formData.shootDate,
          deliveryDeadline: formData.deliveryDeadline,
          coverImage: formData.coverImage,
          tags: parsedTags,
        });
        toast.success('Project Workspace Updated', `Updated ${updated.title}`);
        if (onSaved) onSaved(updated);
      } else {
        const created = addProject({
          eventId: formData.eventId,
          title: formData.title.trim(),
          status: formData.status,
          category: formData.category,
          shootDate: formData.shootDate,
          deliveryDeadline: formData.deliveryDeadline,
          coverImage: formData.coverImage,
          tags: parsedTags,
        });
        toast.success('Project Workspace Initialized', `Created ${created.title}`);
        if (onSaved) onSaved(created);
      }
      onClose();
    } catch (err) {
      toast.error('Project Save Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Project Workspace' : 'Initialize Project Workspace'}
      subtitle="Connect a scheduled event to darkroom culling, task workflows, and deliverables"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isEditing && (
          <FormField
            label="Linked Scheduled Event"
            required
            error={errors.eventId}
            helper="Every production workspace is connected to a booked event"
          >
            {availableEvents.length === 0 ? (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  All currently booked events already have associated project workspaces. You can still link to an existing event or create a new booking first.
                </span>
              </div>
            ) : null}
            <FormSelect
              value={formData.eventId}
              onChange={(e) => handleEventChange(e.target.value)}
              error={!!errors.eventId}
            >
              <option value="">Select a booked event...</option>
              {(availableEvents.length > 0 ? availableEvents : events).map((ev) => {
                const client = clients.find((c) => c.id === ev.clientId);
                return (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} {client ? `(${client.name})` : ''} - {ev.startDate}
                  </option>
                );
              })}
            </FormSelect>
          </FormField>
        )}

        <FormField label="Workspace Title" required error={errors.title}>
          <FormInput
            placeholder="e.g. Udaipur Palace Royal Wedding Post-Production"
            value={formData.title}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, title: e.target.value }));
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            error={!!errors.title}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Production Status">
            <FormSelect
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="Planning">Planning</option>
              <option value="In Production">In Production</option>
              <option value="Post-Production">Post-Production</option>
              <option value="Client Review">Client Review</option>
              <option value="Completed">Completed</option>
            </FormSelect>
          </FormField>

          <FormField label="Category">
            <FormSelect
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option value="Wedding">Wedding</option>
              <option value="Commercial">Commercial</option>
              <option value="Editorial">Editorial</option>
              <option value="Portrait">Portrait</option>
              <option value="Event">Event</option>
            </FormSelect>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Shoot / Start Date">
            <FormInput
              type="date"
              value={formData.shootDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, shootDate: e.target.value }))}
            />
          </FormField>

          <FormField label="Delivery Deadline" required error={errors.deliveryDeadline}>
            <FormInput
              type="date"
              value={formData.deliveryDeadline}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, deliveryDeadline: e.target.value }));
                if (errors.deliveryDeadline) setErrors((prev) => ({ ...prev, deliveryDeadline: '' }));
              }}
              error={!!errors.deliveryDeadline}
            />
          </FormField>
        </div>

        <FormField label="Cover Image Style / Preview">
          <div className="space-y-2">
            <FormSelect
              value={formData.coverImage}
              onChange={(e) => setFormData((prev) => ({ ...prev, coverImage: e.target.value }))}
            >
              {PRESET_COVERS.map((preset) => (
                <option key={preset.url} value={preset.url}>
                  {preset.label}
                </option>
              ))}
            </FormSelect>
            <div className="h-20 rounded-lg overflow-hidden border border-border bg-charcoal/5 relative">
              <img
                src={formData.coverImage}
                alt="Workspace preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </FormField>

        <FormField label="Workspace Tags" helper="Separate multiple tags with commas">
          <FormInput
            placeholder="e.g. Cine, 4K Raw, Color Grade, Album"
            value={formData.tags}
            onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
          />
        </FormField>

        <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Initialize Workspace'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
