import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Tag, FileText } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormField, FormInput, FormSelect, FormTextarea } from '../common/FormField';
import { useStudioData } from '../../context/StudioDataContext';
import { useToast } from '../../context/ToastContext';

export function ClientModal({
  isOpen,
  onClose,
  client = null, // null for create, object for edit
  onSaved,
}) {
  const { addClient, updateClient } = useStudioData();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    location: '',
    category: 'Wedding Couple',
    status: 'Active',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        contactPerson: client.contactPerson || '',
        phone: client.phone || '',
        email: client.email || '',
        location: client.location || '',
        category: client.category || 'Wedding Couple',
        status: client.status || 'Active',
        notes: client.notes || '',
      });
    } else {
      setFormData({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        location: '',
        category: 'Wedding Couple',
        status: 'Active',
        notes: '',
      });
    }
    setErrors({});
  }, [client, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Client or couple name is required';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    }
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errs.email = 'Please enter a valid email address';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (client) {
        const updated = updateClient(client.id, formData);
        toast.success('Client Updated', `Saved profile changes for ${formData.name.trim()}`);
        if (onSaved) onSaved(updated);
      } else {
        const created = addClient(formData);
        toast.success('Client Created', `Created client profile for ${formData.name.trim()}`);
        if (onSaved) onSaved(created);
      }
      onClose();
    } catch (err) {
      toast.error('Error Saving Client', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={client ? 'Edit Client Profile' : 'Add New Client'}
      subtitle={client ? 'Update client contact details and internal notes' : 'Create a new couple or commercial client profile'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Client / Couple Name" required error={errors.name}>
            <FormInput
              placeholder="e.g. Ananya & Kabir Sharma"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              error={!!errors.name}
              autoFocus
            />
          </FormField>

          <FormField label="Primary Contact Person">
            <FormInput
              placeholder="e.g. Ananya Sharma"
              value={formData.contactPerson}
              onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Phone Number" required error={errors.phone}>
            <FormInput
              placeholder="+91 98210 54321"
              value={formData.phone}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, phone: e.target.value }));
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              error={!!errors.phone}
            />
          </FormField>

          <FormField label="Email Address" error={errors.email}>
            <FormInput
              type="email"
              placeholder="client@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={!!errors.email}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="City / Location">
            <FormInput
              placeholder="e.g. Jaipur / Mumbai"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
            />
          </FormField>

          <FormField label="Category / Source">
            <FormSelect
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option value="Wedding Couple">Wedding Couple</option>
              <option value="Pre-Wedding">Pre-Wedding</option>
              <option value="Celebrity & Fashion">Celebrity & Fashion</option>
              <option value="Commercial Campaign">Commercial Campaign</option>
              <option value="Portrait / Solo">Portrait / Solo</option>
              <option value="Referral">Client Referral</option>
              <option value="Social Media">Instagram / Social Media</option>
            </FormSelect>
          </FormField>
        </div>

        {client && (
          <FormField label="Client Status">
            <FormSelect
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="Active">Active</option>
              <option value="Lead">Lead / Prospect</option>
              <option value="Completed">Completed</option>
              <option value="Archived">Archived</option>
            </FormSelect>
          </FormField>
        )}

        <FormField label="Requirements & Internal Notes">
          <FormTextarea
            rows={3}
            placeholder="Special aesthetic preferences, VIP security, preferred color grading, delivery timeline expectations..."
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          />
        </FormField>

        <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {client ? 'Save Changes' : 'Create Client'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
