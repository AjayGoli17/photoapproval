import React, { useState, useEffect } from 'react';
import { FileText, User } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormField, FormInput, FormTextarea, FormSelect } from '../common/FormField';
import { useStudioData } from '../../context/StudioDataContext';
import { useToast } from '../../context/ToastContext';

export function ProjectNoteModal({ isOpen, onClose, projectId, note = null, onSaved = null }) {
  const { team, addProjectNote, updateProjectNote } = useStudioData();
  const toast = useToast();

  const isEditing = Boolean(note && note.id);

  const [formData, setFormData] = useState({
    title: '',
    author: 'Studio Director',
    content: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (note) {
        setFormData({
          title: note.title || '',
          author: note.author || 'Studio Director',
          content: note.content || '',
        });
      } else {
        setFormData({
          title: '',
          author: 'Studio Director',
          content: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, note]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Note title is required';
    }
    if (!formData.content.trim()) {
      errs.content = 'Note content cannot be empty';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        const updated = updateProjectNote(note.id, {
          title: formData.title.trim(),
          author: formData.author,
          content: formData.content, // multiline string preserved
        });
        toast.success('Note Updated', `Saved changes to "${updated.title}"`);
        if (onSaved) onSaved(updated);
      } else {
        const created = addProjectNote(projectId, {
          title: formData.title.trim(),
          author: formData.author,
          content: formData.content, // multiline string preserved
        });
        toast.success('Note Added', `Added "${created.title}" to project workspace`);
        if (onSaved) onSaved(created);
      }
      onClose();
    } catch (err) {
      toast.error('Save Note Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Project Note' : 'Add Project Production Note'}
      subtitle="Preserve editing directives, client remarks, and internal communications"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Note Heading / Title" required error={errors.title}>
          <FormInput
            placeholder="e.g. Color Grading Aesthetic Directives"
            value={formData.title}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, title: e.target.value }));
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            error={!!errors.title}
            autoFocus
          />
        </FormField>

        <FormField label="Note Author">
          <FormSelect
            value={formData.author}
            onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
          >
            <option value="Studio Director">Studio Director</option>
            {team.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name} ({m.role.split(' ')[0]})
              </option>
            ))}
          </FormSelect>
        </FormField>

        <FormField
          label="Note Content (Multiline)"
          required
          error={errors.content}
          helper="Line breaks, bulleted lists, and indentation are preserved exactly"
        >
          <FormTextarea
            placeholder="Enter detailed instructions, client feedback points, or technical camera metadata..."
            value={formData.content}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, content: e.target.value }));
              if (errors.content) setErrors((prev) => ({ ...prev, content: '' }));
            }}
            rows={6}
            error={!!errors.content}
            className="font-mono text-xs leading-relaxed"
          />
        </FormField>

        <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Add Note'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
