import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Briefcase, Sparkles, Image } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormField, FormInput, FormSelect } from '../common/FormField';
import { useStudioData } from '../../context/StudioDataContext';
import { useToast } from '../../context/ToastContext';

const PRESET_AVATARS = [
  { label: 'Photographer 1 (Female)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80' },
  { label: 'Photographer 2 (Male)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80' },
  { label: 'Colorist (Female)', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80' },
  { label: 'Cinematographer (Male)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80' },
  { label: 'Studio Lead (Female)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80' },
];

const ROLES = [
  'Lead Photographer',
  'Senior Colorist & Editor',
  'Second Shooter / Assistant',
  'Cinematographer & Drone Op',
  'High-End Retoucher',
  'Album Designer',
  'Production Assistant',
  'Studio Coordinator',
];

export function TeamMemberModal({ isOpen, onClose, member = null, onSaved = null }) {
  const { addTeamMember, updateTeamMember } = useStudioData();
  const toast = useToast();

  const isEditing = Boolean(member && member.id);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Lead Photographer',
    specialty: 'Fine Art Lighting & Portraits',
    email: '',
    phone: '',
    status: 'Active',
    avatar: PRESET_AVATARS[0].url,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (member) {
        setFormData({
          name: member.name || '',
          role: member.role || 'Lead Photographer',
          specialty: member.specialty || '',
          email: member.email || '',
          phone: member.phone || '',
          status: member.status || 'Active',
          avatar: member.avatar || PRESET_AVATARS[0].url,
        });
      } else {
        setFormData({
          name: '',
          role: 'Lead Photographer',
          specialty: 'Fine Art Lighting & Portraits',
          email: '',
          phone: '',
          status: 'Active',
          avatar: PRESET_AVATARS[0].url,
        });
      }
      setErrors({});
    }
  }, [isOpen, member]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!formData.email.includes('@')) {
      errs.email = 'Please provide a valid email';
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
        const updated = updateTeamMember(member.id, formData);
        toast.success('Team Member Updated', `Updated details for ${updated.name}`);
        if (onSaved) onSaved(updated);
      } else {
        const created = addTeamMember(formData);
        toast.success('Team Member Added', `Added ${created.name} to the roster`);
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
      title={isEditing ? 'Edit Team Member' : 'Add Team Member'}
      subtitle="Manage photography artists, colorists, and production crew"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Full Name" required error={errors.name}>
          <FormInput
            placeholder="e.g. Devika Menon"
            value={formData.name}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }));
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            error={!!errors.name}
            autoFocus
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Primary Role">
            <FormSelect
              value={formData.role}
              onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </FormSelect>
          </FormField>

          <FormField label="Status">
            <FormSelect
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Contractor">Contractor</option>
            </FormSelect>
          </FormField>
        </div>

        <FormField label="Artistic Specialty / Focus">
          <FormInput
            placeholder="e.g. Skin Retouching, DaVinci Resolve, Medium Format"
            value={formData.specialty}
            onChange={(e) => setFormData((prev) => ({ ...prev, specialty: e.target.value }))}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Email Address" required error={errors.email}>
            <FormInput
              type="email"
              placeholder="name@studioflow.com"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              error={!!errors.email}
            />
          </FormField>

          <FormField label="Phone Number">
            <FormInput
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </FormField>
        </div>

        <FormField label="Profile Avatar">
          <div className="flex items-center gap-3">
            <img
              src={formData.avatar}
              alt="Avatar preview"
              className="w-12 h-12 rounded-full object-cover border border-border shrink-0"
            />
            <div className="flex-1">
              <FormSelect
                value={formData.avatar}
                onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
              >
                {PRESET_AVATARS.map((av) => (
                  <option key={av.url} value={av.url}>
                    {av.label}
                  </option>
                ))}
              </FormSelect>
            </div>
          </div>
        </FormField>

        <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Add Team Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
