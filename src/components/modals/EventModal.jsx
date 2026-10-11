import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, IndianRupee, Users, Clock, Camera, Plus, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormField, FormInput, FormSelect, FormTextarea } from '../common/FormField';
import { useStudioData } from '../../context/StudioDataContext';
import { useToast } from '../../context/ToastContext';

export function EventModal({
  isOpen,
  onClose,
  event = null, // null for create, object for edit
  preselectedClientId = null,
  onSaved,
}) {
  const { clients, team, addEvent, updateEvent, addClient } = useStudioData();
  const toast = useToast();

  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    eventType: 'Destination Wedding',
    startDate: '',
    endDate: '',
    startTime: '10:00 AM',
    venue: '',
    guestCount: '',
    packageName: 'Royal Heritage Collection',
    packageValue: '',
    leadPhotographerId: '',
    description: '',
    notes: '',
    status: 'Confirmed',
    // Creation options
    advanceAmount: '',
    paymentMethod: 'UPI / Bank Transfer',
    createProject: true,
  });

  const [isQuickClientMode, setIsQuickClientMode] = useState(false);
  const [quickClientName, setQuickClientName] = useState('');
  const [quickClientPhone, setQuickClientPhone] = useState('');
  const [quickClientEmail, setQuickClientEmail] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        clientId: event.clientId || '',
        title: event.title || '',
        eventType: event.eventType || 'Destination Wedding',
        startDate: event.startDate || '',
        endDate: event.endDate || event.startDate || '',
        startTime: event.startTime || '10:00 AM',
        venue: event.venue || '',
        guestCount: event.guestCount || '',
        packageName: event.packageName || 'Custom Package',
        packageValue: event.packageValue !== undefined ? String(event.packageValue) : '',
        leadPhotographerId: event.leadPhotographerId || (team[0]?.id || ''),
        description: event.description || '',
        notes: event.notes || '',
        status: event.status || 'Confirmed',
        advanceAmount: '',
        paymentMethod: 'UPI / Bank Transfer',
        createProject: false,
      });
    } else {
      setFormData({
        clientId: preselectedClientId || (clients[0]?.id || ''),
        title: '',
        eventType: 'Destination Wedding',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        startTime: '10:00 AM',
        venue: '',
        guestCount: '',
        packageName: 'Royal Heritage Collection',
        packageValue: '250000',
        leadPhotographerId: team[0]?.id || '',
        description: 'Comprehensive candid documentary, traditional portraits, and high-res print masters.',
        notes: '',
        status: 'Confirmed',
        advanceAmount: '50000',
        paymentMethod: 'UPI / Bank Transfer',
        createProject: true,
      });
    }
    setErrors({});
    setIsQuickClientMode(false);
    setQuickClientName('');
    setQuickClientPhone('');
    setQuickClientEmail('');
  }, [event, preselectedClientId, isOpen, clients, team]);

  const handleCreateQuickClient = () => {
    if (!quickClientName.trim() || !quickClientPhone.trim()) {
      toast.error('Validation Error', 'Please enter both client name and phone number');
      return;
    }
    const newClient = addClient({
      name: quickClientName.trim(),
      phone: quickClientPhone.trim(),
      email: quickClientEmail.trim(),
      category: formData.eventType.includes('Wedding') ? 'Wedding Couple' : 'Commercial Campaign',
    });
    setFormData((prev) => ({ ...prev, clientId: newClient.id }));
    setIsQuickClientMode(false);
    toast.success('Client Added', `Created profile for ${newClient.name}`);
  };

  const validate = () => {
    const errs = {};
    if (!formData.clientId) {
      errs.clientId = 'Please select a client';
    }
    if (!formData.title.trim()) {
      errs.title = 'Event / Shoot title is required';
    }
    if (!formData.startDate) {
      errs.startDate = 'Event date is required';
    }
    if (!formData.venue.trim()) {
      errs.venue = 'Venue or shoot location is required';
    }
    const price = Number(formData.packageValue);
    if (isNaN(price) || price < 0 || formData.packageValue === '') {
      errs.packageValue = 'Please enter a valid price (>= 0)';
    }
    if (!event && formData.advanceAmount) {
      const adv = Number(formData.advanceAmount);
      if (isNaN(adv) || adv < 0) {
        errs.advanceAmount = 'Advance amount must be a valid number';
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
      const payload = {
        clientId: formData.clientId,
        title: formData.title.trim(),
        eventType: formData.eventType,
        startDate: formData.startDate,
        endDate: formData.endDate || formData.startDate,
        startTime: formData.startTime,
        venue: formData.venue.trim(),
        guestCount: formData.guestCount ? Number(formData.guestCount) : null,
        packageName: formData.packageName,
        packageValue: Number(formData.packageValue),
        leadPhotographerId: formData.leadPhotographerId || null,
        description: formData.description.trim(),
        notes: formData.notes.trim(),
        status: formData.status,
      };

      if (event) {
        const updated = updateEvent(event.id, payload);
        toast.success('Event Updated', `Updated booking details for ${payload.title}`);
        if (onSaved) onSaved(updated);
      } else {
        const options = {
          advanceAmount: formData.advanceAmount ? Number(formData.advanceAmount) : null,
          paymentMethod: formData.paymentMethod,
          createProject: formData.createProject,
        };
        const created = addEvent(payload, options);
        toast.success('Event Booked', `Successfully scheduled ${payload.title}`);
        if (onSaved) onSaved(created);
      }
      onClose();
    } catch (err) {
      toast.error('Error Saving Event', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Event Booking' : 'Book New Event / Shoot'}
      subtitle={event ? 'Update event itinerary, package, and status' : 'Schedule a wedding, commercial campaign, or portrait session'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1">
        {/* Section A: Client & Event Core */}
        <div className="space-y-4">
          <div className="border-b border-border pb-1.5 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              A. Client & Event Details
            </h4>
            {!event && !isQuickClientMode && (
              <button
                type="button"
                onClick={() => setIsQuickClientMode(true)}
                className="text-xs text-terracotta hover:underline font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Quick Add New Client
              </button>
            )}
          </div>

          {/* Quick Client Mode */}
          {isQuickClientMode ? (
            <div className="p-3.5 bg-ivory-100 rounded-xl border border-terracotta-border/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-charcoal">Quick Add Client</span>
                <button
                  type="button"
                  onClick={() => setIsQuickClientMode(false)}
                  className="text-xs text-charcoal-400 hover:text-charcoal"
                >
                  Select Existing Instead
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <FormInput
                  placeholder="Client / Couple Name *"
                  value={quickClientName}
                  onChange={(e) => setQuickClientName(e.target.value)}
                />
                <FormInput
                  placeholder="Phone Number *"
                  value={quickClientPhone}
                  onChange={(e) => setQuickClientPhone(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <FormInput
                  placeholder="Email Address (optional)"
                  value={quickClientEmail}
                  onChange={(e) => setQuickClientEmail(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" size="sm" variant="primary" onClick={handleCreateQuickClient}>
                  Add & Select
                </Button>
              </div>
            </div>
          ) : (
            <FormField label="Assigned Client" required error={errors.clientId}>
              <FormSelect
                value={formData.clientId}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, clientId: e.target.value }));
                  if (errors.clientId) setErrors((prev) => ({ ...prev, clientId: undefined }));
                }}
                error={!!errors.clientId}
              >
                <option value="">Select a client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.location || c.category})
                  </option>
                ))}
              </FormSelect>
            </FormField>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Event Title" required error={errors.title}>
              <FormInput
                placeholder="e.g. Royal Palace Wedding or SS27 Lookbook"
                value={formData.title}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, title: e.target.value }));
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                error={!!errors.title}
              />
            </FormField>

            <FormField label="Event Type">
              <FormSelect
                value={formData.eventType}
                onChange={(e) => setFormData((prev) => ({ ...prev, eventType: e.target.value }))}
              >
                <option value="Destination Wedding">Destination Wedding</option>
                <option value="Wedding">Wedding</option>
                <option value="Pre-Wedding">Pre-Wedding</option>
                <option value="Engagement">Engagement</option>
                <option value="Fashion Editorial">Fashion Editorial</option>
                <option value="Commercial Campaign">Commercial Campaign</option>
                <option value="Birthday">Birthday / Anniversary</option>
                <option value="Maternity">Maternity</option>
                <option value="Portrait">Portrait / Solo Portfolio</option>
                <option value="Corporate">Corporate</option>
              </FormSelect>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label="Start Date" required error={errors.startDate}>
              <FormInput
                type="date"
                value={formData.startDate}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    startDate: val,
                    endDate: prev.endDate < val ? val : prev.endDate,
                  }));
                  if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: undefined }));
                }}
                error={!!errors.startDate}
              />
            </FormField>

            <FormField label="End Date">
              <FormInput
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </FormField>

            <FormField label="Start Time">
              <FormInput
                placeholder="e.g. 10:00 AM"
                value={formData.startTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <FormField label="Venue / Location" required error={errors.venue}>
                <FormInput
                  placeholder="e.g. Amber Fort, Jaipur or Studio 9, Mumbai"
                  value={formData.venue}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, venue: e.target.value }));
                    if (errors.venue) setErrors((prev) => ({ ...prev, venue: undefined }));
                  }}
                  error={!!errors.venue}
                />
              </FormField>
            </div>

            <FormField label="Guest / Crew Est.">
              <FormInput
                type="number"
                placeholder="e.g. 250"
                value={formData.guestCount}
                onChange={(e) => setFormData((prev) => ({ ...prev, guestCount: e.target.value }))}
              />
            </FormField>
          </div>
        </div>

        {/* Section B: Package & Pricing */}
        <div className="space-y-4">
          <div className="border-b border-border pb-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              B. Package, Pricing & Crew
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Package / Collection Name">
              <FormInput
                placeholder="e.g. Royal Heritage Collection"
                value={formData.packageName}
                onChange={(e) => setFormData((prev) => ({ ...prev, packageName: e.target.value }))}
              />
            </FormField>

            <FormField label="Agreed Package Price (INR ₹)" required error={errors.packageValue}>
              <FormInput
                type="number"
                min="0"
                placeholder="e.g. 250000"
                value={formData.packageValue}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, packageValue: e.target.value }));
                  if (errors.packageValue) setErrors((prev) => ({ ...prev, packageValue: undefined }));
                }}
                error={!!errors.packageValue}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Lead Photographer / Crew Lead">
              <FormSelect
                value={formData.leadPhotographerId}
                onChange={(e) => setFormData((prev) => ({ ...prev, leadPhotographerId: e.target.value }))}
              >
                <option value="">Unassigned</option>
                {team.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.role}
                  </option>
                ))}
              </FormSelect>
            </FormField>

            <FormField label="Booking Status">
              <FormSelect
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="Inquiry">Inquiry</option>
                <option value="Quoted">Quoted</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </FormSelect>
            </FormField>
          </div>

          <FormField label="Deliverables & Package Details">
            <FormInput
              placeholder="e.g. 2 Teaser Reels, 450 Edited Master TIFFs, 1 Handcrafted Album"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </FormField>

          <FormField label="Special Requirements & Notes">
            <FormTextarea
              rows={2}
              placeholder="Drone clearances, specific family groupings, golden hour schedule priorities..."
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </FormField>
        </div>

        {/* Section C: Booking Options (Only for new events) */}
        {!event && (
          <div className="space-y-4 bg-ivory-50 p-4 rounded-xl border border-border">
            <div className="border-b border-border/80 pb-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                C. Initial Advance & Project Workspace
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Advance Payment Received (₹ optional)" error={errors.advanceAmount}>
                <FormInput
                  type="number"
                  min="0"
                  placeholder="e.g. 50000 (leave 0 if none)"
                  value={formData.advanceAmount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, advanceAmount: e.target.value }))}
                />
              </FormField>

              <FormField label="Payment Method">
                <FormSelect
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                >
                  <option value="UPI / Bank Transfer">UPI / Bank Transfer</option>
                  <option value="Razorpay / Card">Razorpay / Card</option>
                  <option value="Corporate Wire">Corporate Wire</option>
                  <option value="Cash Deposit">Cash Deposit</option>
                </FormSelect>
              </FormField>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-charcoal-700 font-medium">
              <input
                type="checkbox"
                checked={formData.createProject}
                onChange={(e) => setFormData((prev) => ({ ...prev, createProject: e.target.checked }))}
                className="w-4 h-4 rounded text-terracotta focus:ring-terracotta/30 border-border"
              />
              <span>Create linked production project workspace immediately</span>
            </label>
          </div>
        )}

        <div className="pt-4 border-t border-border flex items-center justify-end gap-3 sticky bottom-0 bg-surface py-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {event ? 'Save Booking Changes' : 'Confirm & Schedule Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
