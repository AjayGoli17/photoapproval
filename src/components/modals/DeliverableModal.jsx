import React, { useState, useEffect } from 'react';
import { Package, Calendar, Link as LinkIcon, FileText } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormField, FormInput, FormSelect, FormTextarea } from '../common/FormField';
import { useStudioData } from '../../context/StudioDataContext';
import { useToast } from '../../context/ToastContext';

const DELIVERABLE_TYPES = [
  'Preview Gallery',
  'Edited Proofs',
  'Wedding Album Layout',
  'Print Master TIFFs',
  'High-Res Digital Delivery',
];

const DELIVERY_STAGES = [
  'Culling',
  'First Proofs',
  'Client Selection',
  'Final Handover',
];

export function DeliverableModal({ isOpen, onClose, defaultProjectId = null, deliverable = null, onSaved = null }) {
  const { projects, addDeliverable, updateDeliverable } = useStudioData();
  const toast = useToast();

  const isEditing = Boolean(deliverable && deliverable.id);

  const [formData, setFormData] = useState({
    title: '',
    projectId: defaultProjectId || projects[0]?.id || '',
    deliverableType: 'Preview Gallery',
    deliveryStage: 'Client Selection',
    description: '',
    deadline: new Date().toISOString().split('T')[0],
    shareLink: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (deliverable) {
        setFormData({
          title: deliverable.title || '',
          projectId: deliverable.projectId || defaultProjectId || '',
          deliverableType: deliverable.deliverableType || 'Preview Gallery',
          deliveryStage: deliverable.deliveryStage || 'Client Selection',
          description: deliverable.description || '',
          deadline: deliverable.deadline ? deliverable.deadline.split('T')[0] : new Date().toISOString().split('T')[0],
          shareLink: deliverable.shareLink || '',
        });
      } else {
        const proj = projects.find((p) => p.id === (defaultProjectId || projects[0]?.id));
        setFormData({
          title: proj ? `${proj.title} Proof Gallery` : '',
          projectId: defaultProjectId || projects[0]?.id || '',
          deliverableType: 'Preview Gallery',
          deliveryStage: 'Client Selection',
          description: 'Master photo collection for client proof review.',
          deadline: new Date().toISOString().split('T')[0],
          shareLink: `https://studioflow.gallery/proofs/${Date.now()}`,
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
        shareLink: formData.shareLink || `https://studioflow.gallery/proofs/${Date.now()}`,
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
      title={isEditing ? 'Edit Deliverable Package' : 'Publish Deliverable Collection'}
      subtitle="Configure client proofing albums, print masters, or social highlight galleries"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Collection Title" required error={errors.title}>
          <FormInput
            placeholder="e.g. Udaipur Sangeet 150 Photo Proof Gallery"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Signoff Deadline" required error={errors.deadline}>
            <FormInput
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
              error={!!errors.deadline}
            />
          </FormField>

          <FormField label="Client Portal Proofing URL">
            <FormInput
              placeholder="https://studioflow.gallery/proofs/..."
              value={formData.shareLink}
              onChange={(e) => setFormData((prev) => ({ ...prev, shareLink: e.target.value }))}
            />
          </FormField>
        </div>

        <FormField label="Description & Client Notes">
          <FormTextarea
            placeholder="Add handover notes, proof selection limits, or format details..."
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
