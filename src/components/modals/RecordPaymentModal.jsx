import React, { useState, useEffect } from 'react';
import { IndianRupee, Calendar, CreditCard, Hash, FileText, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormField, FormInput, FormSelect, FormTextarea } from '../common/FormField';
import { useStudioData } from '../../context/StudioDataContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';

const PAYMENT_METHODS = [
  'UPI / GPay / PhonePe',
  'NEFT / RTGS Bank Transfer',
  'IMPS Direct Transfer',
  'Debit / Credit Card',
  'Cash Receipt',
  'Cheque Deposit',
];

export function RecordPaymentModal({
  isOpen,
  onClose,
  eventId = null,
  invoiceId = null,
  defaultAmount = '',
  onSaved = null,
}) {
  const { events, clients, payments, getEventFinancials, recordEventPayment } = useStudioData();
  const toast = useToast();

  const [selectedEventId, setSelectedEventId] = useState(eventId || '');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(invoiceId || '');

  const [formData, setFormData] = useState({
    amount: '',
    type: 'Interim Milestone',
    status: 'Paid',
    paymentMethod: PAYMENT_METHODS[0],
    paidDate: new Date().toISOString().split('T')[0],
    referenceNumber: '',
    description: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derive target event & financials
  const targetEvent = events.find((e) => e.id === selectedEventId) || (events.length > 0 ? events[0] : null);
  const targetInvoice = payments.find((p) => p.id === selectedInvoiceId);
  const financials = targetEvent ? getEventFinancials(targetEvent.id) : null;

  useEffect(() => {
    if (isOpen) {
      const activeEvId = eventId || targetInvoice?.eventId || (events[0]?.id || '');
      setSelectedEventId(activeEvId);
      setSelectedInvoiceId(invoiceId || '');

      const ev = events.find((e) => e.id === activeEvId);
      const fin = ev ? getEventFinancials(ev.id) : null;
      const initialAmt = defaultAmount
        ? String(defaultAmount)
        : targetInvoice
        ? String(targetInvoice.amount)
        : fin && fin.outstandingBalance > 0
        ? String(fin.outstandingBalance)
        : '25000';

      setFormData({
        amount: initialAmt,
        type: targetInvoice ? targetInvoice.type : 'Interim Milestone',
        status: 'Paid',
        paymentMethod: targetInvoice?.paymentMethod !== 'Pending' ? (targetInvoice?.paymentMethod || PAYMENT_METHODS[0]) : PAYMENT_METHODS[0],
        paidDate: new Date().toISOString().split('T')[0],
        referenceNumber: `UTR-${Math.floor(10000000 + Math.random() * 90000000)}`,
        description: targetInvoice ? `Settlement for ${targetInvoice.invoiceNumber}` : (ev ? `Installment for ${ev.title}` : ''),
      });
      setError('');
    }
  }, [isOpen, eventId, invoiceId, defaultAmount]);

  const handleEventChange = (evId) => {
    setSelectedEventId(evId);
    const ev = events.find((e) => e.id === evId);
    if (ev) {
      const fin = getEventFinancials(ev.id);
      setFormData((prev) => ({
        ...prev,
        amount: fin.outstandingBalance > 0 ? String(fin.outstandingBalance) : '25000',
        description: `Installment for ${ev.title}`,
      }));
    }
  };

  const validate = () => {
    const num = Number(formData.amount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid payment amount greater than ₹0');
      return false;
    }
    if (targetInvoice) {
      const history = Array.isArray(targetInvoice.paymentHistory) ? targetInvoice.paymentHistory : [];
      let currentPaid = history.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      if (currentPaid === 0 && targetInvoice.status === 'Paid') currentPaid = targetInvoice.amount;
      const invoiceRemaining = Math.max(0, targetInvoice.amount - currentPaid);
      if (num > invoiceRemaining) {
        setError(`Amount cannot exceed the remaining invoice balance of ${formatCurrency(invoiceRemaining)}`);
        return false;
      }
    } else if (financials) {
      if (financials.outstandingBalance === 0) {
        setError('This booking has already been fully paid.');
        return false;
      }
      if (num > financials.outstandingBalance) {
        setError(`Amount cannot exceed the remaining balance of ${formatCurrency(financials.outstandingBalance)}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!targetEvent) {
      setError('Please select a valid booked event.');
      return;
    }

    setIsSubmitting(true);
    try {
      const num = Number(formData.amount);
      const recorded = recordEventPayment(targetEvent.id, {
        amount: num,
        type: formData.type,
        status: 'Paid',
        paymentMethod: formData.paymentMethod,
        paidDate: formData.paidDate,
        dueDate: formData.paidDate,
        referenceNumber: formData.referenceNumber.trim(),
        description: formData.description.trim() || `Payment for ${targetEvent.title}`,
        invoiceId: selectedInvoiceId || null,
      });

      toast.success(
        'Payment Recorded',
        `Logged ${formatCurrency(num)} via ${formData.paymentMethod}.`
      );
      if (onSaved) onSaved(recorded);
      onClose();
    } catch (err) {
      setError(err.message);
      toast.error('Payment Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Payment Installment"
      subtitle="Log client advance deposits, milestone payments, or final settlements"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Linked event selection if not fixed */}
        {!eventId && !invoiceId && (
          <FormField label="Associated Event / Booking" required>
            <FormSelect
              value={selectedEventId}
              onChange={(e) => handleEventChange(e.target.value)}
            >
              {events.map((ev) => {
                const client = clients.find((c) => c.id === ev.clientId);
                return (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({client?.name || 'Client'})
                  </option>
                );
              })}
            </FormSelect>
          </FormField>
        )}

        {financials && (
          <div className="p-3 bg-ivory-100 rounded-xl border border-border text-xs flex justify-between items-center">
            <div>
              <span className="text-charcoal-400 block text-[11px]">Agreed Total: {formatCurrency(financials.agreedPrice)}</span>
              <span className="text-sage font-medium text-[11px]">Received: {formatCurrency(financials.amountReceived)}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-charcoal-400 block">Balance Due</span>
              <span className="text-sm font-bold text-terracotta font-serif">
                {formatCurrency(financials.outstandingBalance)}
              </span>
            </div>
          </div>
        )}

        <FormField label="Payment Amount (₹ INR)" required error={error}>
          <FormInput
            type="number"
            min="1"
            placeholder="e.g. 50000"
            value={formData.amount}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, amount: e.target.value }));
              if (error) setError('');
            }}
            error={!!error}
            autoFocus
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Payment Type">
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

          <FormField label="Payment Method">
            <FormSelect
              value={formData.paymentMethod}
              onChange={(e) => setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </FormSelect>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Date Received" required>
            <FormInput
              type="date"
              value={formData.paidDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, paidDate: e.target.value }))}
            />
          </FormField>

          <FormField label="Transaction / UTR Reference">
            <FormInput
              placeholder="e.g. UTR-98230192"
              value={formData.referenceNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, referenceNumber: e.target.value }))}
            />
          </FormField>
        </div>

        <FormField label="Payment Note / Description">
          <FormInput
            placeholder="e.g. 50% wedding advance payment"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
        </FormField>

        <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Record Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
}
