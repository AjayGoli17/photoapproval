import React, { useState, useEffect } from 'react';
import { Receipt, Plus, Trash2, Calendar, FileText, IndianRupee } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormField, FormInput, FormSelect, FormTextarea } from '../common/FormField';
import { useStudioData } from '../../context/StudioDataContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';

export function InvoiceModal({ isOpen, onClose, invoice = null, defaultEventId = null, onSaved = null }) {
  const { events, clients, projects, payments, settings, addPayment, updatePayment } = useStudioData();
  const toast = useToast();

  const isEditing = Boolean(invoice && invoice.id);

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    eventId: '',
    type: 'Interim Milestone',
    status: 'Pending',
    dueDate: new Date().toISOString().split('T')[0],
    taxRate: settings?.taxRate ?? 18,
    notes: '',
    lineItems: [
      { id: 'li-1', description: 'Photography Services & Master Deliverables', quantity: 1, rate: 50000, amount: 50000 },
    ],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (invoice) {
        setFormData({
          invoiceNumber: invoice.invoiceNumber || '',
          eventId: invoice.eventId || '',
          type: invoice.type || 'Interim Milestone',
          status: invoice.status || 'Pending',
          dueDate: invoice.dueDate ? invoice.dueDate.split('T')[0] : new Date().toISOString().split('T')[0],
          taxRate: invoice.taxRate !== undefined ? Number(invoice.taxRate) : (settings?.taxRate ?? 18),
          notes: invoice.notes || '',
          lineItems: Array.isArray(invoice.lineItems) && invoice.lineItems.length > 0 ? invoice.lineItems : [
            { id: 'li-1', description: invoice.description || 'Photography Services', quantity: 1, rate: invoice.amount || 0, amount: invoice.amount || 0 },
          ],
        });
      } else {
        const ev = events.find((e) => e.id === (defaultEventId || events[0]?.id));
        const newInvoiceNum = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

        setFormData({
          invoiceNumber: newInvoiceNum,
          eventId: ev ? ev.id : (events[0]?.id || ''),
          type: 'Interim Milestone',
          status: 'Pending',
          dueDate: new Date().toISOString().split('T')[0],
          taxRate: settings?.taxRate ?? 18,
          notes: 'Standard 15-day payment term. Payment via direct bank transfer or UPI.',
          lineItems: [
            { id: 'li-1', description: ev ? `${ev.title} — Photography & Coverage` : 'Studio Photography Services', quantity: 1, rate: 50000, amount: 50000 },
          ],
        });
      }
      setErrors({});
    }
  }, [isOpen, invoice, defaultEventId, events, settings]);

  const handleLineItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.lineItems];
      const item = { ...updated[index], [field]: value };
      if (field === 'quantity' || field === 'rate') {
        const qty = Number(field === 'quantity' ? value : item.quantity) || 0;
        const rate = Number(field === 'rate' ? value : item.rate) || 0;
        item.amount = qty * rate;
      }
      updated[index] = item;
      return { ...prev, lineItems: updated };
    });
  };

  const handleAddLineItem = () => {
    setFormData((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { id: `li-${Date.now()}`, description: 'Additional Deliverable / Coverage', quantity: 1, rate: 15000, amount: 15000 },
      ],
    }));
  };

  const handleRemoveLineItem = (index) => {
    if (formData.lineItems.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, idx) => idx !== index),
    }));
  };

  const totalAmount = formData.lineItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const validate = () => {
    const errs = {};
    if (!formData.invoiceNumber.trim()) errs.invoiceNumber = 'Invoice number is required';
    if (!formData.eventId) errs.eventId = 'Please select a booked event';
    if (totalAmount <= 0) errs.lineItems = 'Total invoice amount must be greater than ₹0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const selectedEvent = events.find((ev) => ev.id === formData.eventId);
      const linkedProject = projects.find((p) => p.eventId === formData.eventId);

      const payload = {
        invoiceNumber: formData.invoiceNumber.trim(),
        clientId: selectedEvent?.clientId || null,
        eventId: formData.eventId,
        projectId: linkedProject?.id || null,
        description: formData.lineItems[0]?.description || `Invoice for ${selectedEvent?.title}`,
        amount: totalAmount,
        type: formData.type,
        status: formData.status,
        dueDate: formData.dueDate,
        lineItems: formData.lineItems,
        notes: formData.notes.trim(),
        taxRate: Number(formData.taxRate) >= 0 ? Number(formData.taxRate) : 18,
      };

      if (isEditing) {
        const updated = updatePayment(invoice.id, payload);
        toast.success('Invoice Updated', `Saved changes to ${formData.invoiceNumber}`);
        if (onSaved) onSaved(updated);
      } else {
        const created = addPayment(payload);
        toast.success('Invoice Generated', `Created ${created.invoiceNumber}`);
        if (onSaved) onSaved(created);
      }
      onClose();
    } catch (err) {
      toast.error('Invoice Save Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Studio Invoice' : 'Create New Invoice'}
      subtitle="Generate itemized tax invoices for client bookings and milestone installments"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Invoice Number" required error={errors.invoiceNumber}>
            <FormInput
              value={formData.invoiceNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
              error={!!errors.invoiceNumber}
            />
          </FormField>

          <FormField label="Booked Shoot / Event" required error={errors.eventId}>
            <FormSelect
              value={formData.eventId}
              onChange={(e) => setFormData((prev) => ({ ...prev, eventId: e.target.value }))}
              error={!!errors.eventId}
            >
              <option value="">Select an event...</option>
              {events.map((ev) => {
                const client = clients.find((c) => c.id === ev.clientId);
                return (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} {client ? `(${client.name})` : ''}
                  </option>
                );
              })}
            </FormSelect>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FormField label="Invoice Type">
            <FormSelect
              value={formData.type}
              onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
            >
              <option value="Advance Deposit">Advance Deposit</option>
              <option value="Interim Milestone">Interim Milestone</option>
              <option value="Final Balance">Final Balance</option>
              <option value="Full Payment">Full Payment</option>
            </FormSelect>
          </FormField>

          <FormField label="Due Date" required>
            <FormInput
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
            />
          </FormField>

          <FormField label="Initial Status">
            <FormSelect
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </FormSelect>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Configured GST / Tax Rate (%)">
            <FormSelect
              value={formData.taxRate}
              onChange={(e) => setFormData((prev) => ({ ...prev, taxRate: Number(e.target.value) }))}
            >
              <option value={18}>18% — Standard GST (Photography & Production)</option>
              <option value={12}>12% — Concessional Rate</option>
              <option value={5}>5% — Essential Services & Goods</option>
              <option value={0}>0% — Exempt / Nil-rated</option>
            </FormSelect>
          </FormField>

          <div className="text-xs text-charcoal-500 flex items-center pt-5">
            <span>GST is calculated within invoice totals based on studio sample presets.</span>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-charcoal">Itemized Line Items</label>
            <Button
              type="button"
              variant="outline"
              size="xs"
              leftIcon={<Plus className="w-3 h-3" />}
              onClick={handleAddLineItem}
            >
              Add Item
            </Button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {formData.lineItems.map((item, idx) => (
              <div key={item.id || idx} className="flex items-center gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Service description"
                  value={item.description}
                  onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-charcoal focus:ring-1 focus:ring-terracotta focus:outline-none"
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleLineItemChange(idx, 'quantity', e.target.value)}
                  className="w-16 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-charcoal text-center focus:ring-1 focus:ring-terracotta focus:outline-none"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) => handleLineItemChange(idx, 'rate', e.target.value)}
                  className="w-24 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-charcoal text-right focus:ring-1 focus:ring-terracotta focus:outline-none"
                />
                <span className="w-24 text-right font-semibold text-charcoal">
                  {formatCurrency(item.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveLineItem(idx)}
                  disabled={formData.lineItems.length <= 1}
                  className="p-1 text-charcoal-400 hover:text-red-600 disabled:opacity-30"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {errors.lineItems && (
            <p className="text-xs text-red-500 font-medium">{errors.lineItems}</p>
          )}

          {/* Subtotal & Total */}
          <div className="pt-2 border-t border-border flex justify-end text-xs space-y-1">
            <div className="w-56 text-right space-y-1">
              <div className="flex justify-between text-charcoal-500">
                <span>Subtotal:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-charcoal-500">
                <span>GST (18% included):</span>
                <span>{formatCurrency(Math.round(totalAmount * 0.18 / 1.18))}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-charcoal pt-1 border-t border-border">
                <span>Total Amount:</span>
                <span className="text-terracotta">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        <FormField label="Payment Notes & Wire Details">
          <FormTextarea
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            rows={2}
          />
        </FormField>

        <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Generate Invoice'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
