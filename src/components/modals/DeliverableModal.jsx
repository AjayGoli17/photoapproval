import React, { useState, useEffect } from 'react';
import { Package, Calendar, FileText } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormField, FormInput, FormSelect, FormTextarea } from '../common/FormField';
import { useStudioData } from '../../context/StudioDataContext';
import { useToast } from '../../context/ToastContext';

const DELIVERABLE_TYPES = [
  'High-Res Digital Delivery',
  'Print Master TIFFs',
  'Digital Master Files',
  'Physical Album',
  'Highlight Slideshow',
];

const DELIVERY_STAGES = [
  'Draft',
  'In Progress',
  'Ready for Delivery',
  'Delivered',
];

export function DeliverableModal({ isOpen, onClose, defaultProjectId = null, deliverable = null, onSaved = null }) {
  const { projects, addDeliverable, updateDeliverable } = useStudioData();
  const toast = useToast();

  const isEditing = Boolean(deliverable && deliverable.id);

  const [formData, setFormData] = useState({
    title: '',
    projectId: defaultProjectId || projects[0]?.id || '',
    deliverableType: 'High-Res Digital Delivery',
    deliveryStage: 'In Progress',
    description: '',
    deadline: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (deliverable) {
        setFormData({
          title: deliverable.title || '',
          projectId: deliverable.projectId || defaultProjectId || '',
          deliverableType: deliverable.deliverableType || 'High-Res Digital Delivery',
          deliveryStage: deliverable.deliveryStage || 'In Progress',
          description: deliverable.description || '',
          deadline: deliverable.deadline ? deliverable.deadline.split('T')[0] : new Date().toISOString().split('T')[0],
        });
      } else {
        const proj = projects.find((p) => p.id === (defaultProjectId || projects[0]?.id));
        setFormData({
          title: proj ? `${proj.title} Digital Masters` : '',
          projectId: defaultProjectId || projects[0]?.id || '',
          deliverableType: 'High-Res Digital Delivery',
          deliveryStage: 'In Progress',
          description: 'Master photo collection and final deliverables.',
          deadline: new Date().toISOString().split('T')[0],
        });
      }
      setErrors({});
    }
  }, [isOpen, deliverable, defaultProjectId, projects]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.projectId) errs.projectId = 'Please select a project';
    if (!formData.deadline) errs.deadline = 'Deadline is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const selectedProject = projects.find((p) => p.id === formData.projectId);
      const payload = {
        title: formData.title.trim(),
        projectId: formData.projectId,
        eventId: selectedProject?.eventId || null,
        deliverableType: formData.deliverableType,
        deliveryStage: formData.deliveryStage,
        description: formData.description.trim(),
        deadline: formData.deadline,
      };

      if (isEditing) {
        const updated = updateDeliverable(deliverable.id, payload);
        toast.success('Deliverable Updated', `Saved changes to ${updated.title}`);
        if (onSaved) onSaved(updated);
      } else {
        const created = addDeliverable(payload);
        toast.success('Deliverable Created', `Created ${created.title}`);
        if (onSaved) onSaved(created);
      }
      onClose();
    } catch (err) {
      toast.error('Save Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Deliverable Package' : 'Create Deliverable'}
      subtitle="Configure deliverable packages, digital masters, and handover dates"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Deliverable Title" required error={errors.title}>
          <FormInput
            placeholder="e.g. Udaipur Reception High-Res Digital Delivery"
            value={formData.title}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, title: e.target.value }));
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            error={!!errors.title}
            autoFocus
          />
        </FormField>

        <FormField label="Linked Project Workspace" required error={errors.projectId}>
          <FormSelect
            value={formData.projectId}
            onChange={(e) => setFormData((prev) => ({ ...prev, projectId: e.target.value }))}
            error={!!errors.projectId}
          >
            <option value="">Select a project...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </FormSelect>
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Deliverable Type">
            <FormSelect
              value={formData.deliverableType}
              onChange={(e) => setFormData((prev) => ({ ...prev, deliverableType: e.target.value }))}
            >
              {DELIVERABLE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </FormSelect>
          </FormField>

          <FormField label="Delivery Stage">
            <FormSelect
              value={formData.deliveryStage}
              onChange={(e) => setFormData((prev) => ({ ...prev, deliveryStage: e.target.value }))}
            >
              {DELIVERY_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </FormSelect>
          </FormField>
        </div>

        <FormField label="Target Delivery Date" required error={errors.deadline}>
          <FormInput
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
            error={!!errors.deadline}
          />
        </FormField>

        <FormField label="Description & Handover Notes">
          <FormTextarea
            placeholder="Add handover notes, file format specifications, or packaging details..."
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </FormField>

        <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Deliverable'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
