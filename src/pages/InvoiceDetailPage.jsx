import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Receipt,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  Phone,
  DollarSign,
  Edit2,
  ExternalLink,
  Calendar,
  CreditCard,
  Hash,
  AlertCircle,
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { RecordPaymentModal } from '../components/modals/RecordPaymentModal';
import { InvoiceModal } from '../components/modals/InvoiceModal';
import { formatCurrency, formatDate } from '../utils/formatters';

export function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInvoice, getClient, getEvent, getProject, settings } = useStudioData();

  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isEditInvoiceOpen, setIsEditInvoiceOpen] = useState(false);

  const invoice = getInvoice(id);
  const client = invoice ? getClient(invoice.clientId) : null;
  const event = invoice ? getEvent(invoice.eventId) : null;
  const project = invoice ? getProject(invoice.projectId || (event ? `proj-${event.id.replace('event-', '')}` : null)) : null;

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Compute payments received and balance due for this invoice
  const { amountPaid, balanceDue, isPaid, isOverdue } = useMemo(() => {
    if (!invoice) return { amountPaid: 0, balanceDue: 0, isPaid: false, isOverdue: false };

    const history = Array.isArray(invoice.paymentHistory) ? invoice.paymentHistory : [];
    let paid = history.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    if (paid === 0 && invoice.status === 'Paid') {
      paid = invoice.amount;
    }

    const due = Math.max(0, invoice.amount - paid);
    const paidStatus = invoice.status === 'Paid' || due === 0;
    const overdueStatus = !paidStatus && invoice.dueDate && invoice.dueDate < todayStr;

    return {
      amountPaid: paid,
      balanceDue: due,
      isPaid: paidStatus,
      isOverdue: overdueStatus,
    };
  }, [invoice, todayStr]);

  if (!invoice) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Payments', to: '/payments' }, { label: 'Not Found' }]} />
        <EmptyState
          icon={Receipt}
          title="Invoice not found"
          description={`No invoice record matches ID or reference "${id}".`}
          action={
            <Button variant="primary" onClick={() => navigate('/payments')}>
              Back to Payments Hub
            </Button>
          }
        />
      </div>
    );
  }

  const lineItems = Array.isArray(invoice.lineItems) && invoice.lineItems.length > 0
    ? invoice.lineItems
    : [
        {
          description: invoice.description || 'Studio Photography & Production Package',
          quantity: 1,
          rate: invoice.amount,
          amount: invoice.amount,
        },
      ];

  const subtotal = lineItems.reduce((s, item) => s + (Number(item.amount) || 0), 0);
  const taxRate = invoice.taxRate !== undefined ? Number(invoice.taxRate) : (settings?.taxRate ?? 18);
  const taxAmount = taxRate > 0 ? Math.round((subtotal * taxRate) / (100 + taxRate)) : 0; // inclusive GST
  const netSubtotal = subtotal - taxAmount;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header & Actions (Hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Breadcrumbs
          items={[
            { label: 'Payments', to: '/payments' },
            { label: invoice.invoiceNumber },
          ]}
        />

        <div className="flex items-center gap-2">
          {!isPaid && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<DollarSign className="w-4 h-4" />}
              onClick={() => setIsRecordPaymentOpen(true)}
            >
              Record Payment
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit2 className="w-4 h-4" />}
            onClick={() => setIsEditInvoiceOpen(true)}
          >
            Edit Invoice
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={() => window.print()}
          >
            Print Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Paper Document */}
      <Card className="p-8 sm:p-12 bg-surface shadow-elevated border-border text-charcoal space-y-8 print:shadow-none print:border-none print:p-0">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-border">
          <div>
            <h1 className="editorial-heading text-2xl font-bold text-charcoal font-serif">
              {settings.studioName}
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">{settings.tagline}</p>
            <div className="text-xs text-charcoal-500 mt-2 space-y-0.5">
              <div>{settings.city}</div>
              <div>{settings.contactEmail} &bull; {settings.phone}</div>
              <div className="font-mono text-[11px] text-charcoal-400">GSTIN: 27AABCS1429B1Z8 (Maharashtra)</div>
            </div>
          </div>

          <div className="sm:text-right">
            <Badge
              size="lg"
              className="mb-2"
              variant={isPaid ? 'sage' : isOverdue ? 'destructive' : 'amber'}
            >
              {isPaid ? 'PAID' : isOverdue ? 'OVERDUE' : 'PAYMENT PENDING'}
            </Badge>
            <div className="font-mono text-xl font-bold text-charcoal">{invoice.invoiceNumber}</div>
            <div className="text-xs text-charcoal-500 mt-1">
              Issue Date: {formatDate(invoice.createdAt || invoice.dueDate)}
            </div>
            <div className="text-xs text-charcoal-600 font-medium">
              Due Date: {formatDate(invoice.dueDate)}
            </div>
            {invoice.paymentMethod && invoice.paymentMethod !== 'Pending' && (
              <div className="text-xs text-charcoal-400 mt-0.5">
                Method: {invoice.paymentMethod}
              </div>
            )}
          </div>
        </div>

        {/* Client & Booking Context */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1">
              Billed To Client
            </span>
            <div className="font-semibold text-charcoal text-base font-serif">
              {client ? (
                <Link to={`/clients/${client.id}`} className="hover:text-terracotta print:no-underline">
                  {client.name}
                </Link>
              ) : (
                'Valued Client'
              )}
            </div>
            <div className="text-xs text-charcoal-500 mt-1 space-y-0.5">
              {client?.location && <div>{client.location}</div>}
              {client?.email && <div>{client.email}</div>}
              {client?.phone && <div>{client.phone}</div>}
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1">
              Production & Shoot Reference
            </span>
            <div className="text-xs font-semibold text-charcoal">
              {event ? (
                <Link to={`/events/${event.id}`} className="hover:text-terracotta print:no-underline">
                  {event.title}
                </Link>
              ) : (
                invoice.description
              )}
            </div>
            <div className="text-xs text-charcoal-500 mt-0.5">
              {event?.venue} &bull; {event?.startDate ? formatDate(event.startDate) : ''}
            </div>
            {project && (
              <div className="text-xs text-terracotta mt-1">
                Workspace:{' '}
                <Link to={`/projects/${project.id}`} className="hover:underline print:no-underline">
                  {project.title}
                </Link>
              </div>
            )}
            <div className="text-xs text-charcoal-400 mt-1">
              Terms: {invoice.type}
            </div>
          </div>
        </div>

        {/* Itemized Line Items Table (Req 5) */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-border text-xs uppercase tracking-wider text-charcoal-500 bg-ivory-50/70">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Description</th>
                <th className="py-2.5 px-3 font-semibold text-center w-20">Qty</th>
                <th className="py-2.5 px-3 font-semibold text-right w-28">Rate</th>
                <th className="py-2.5 px-3 font-semibold text-right w-32">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {lineItems.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="py-3.5 px-3 font-medium text-charcoal">
                    {item.description}
                  </td>
                  <td className="py-3.5 px-3 text-center text-charcoal-600">
                    {item.quantity || 1}
                  </td>
                  <td className="py-3.5 px-3 text-right text-charcoal-600">
                    {formatCurrency(item.rate || item.amount)}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-charcoal text-right">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Breakdown (Subtotal, GST, Total, Paid, Balance) */}
        <div className="pt-4 border-t border-border flex justify-end">
          <div className="w-72 space-y-2 text-xs">
            <div className="flex justify-between text-charcoal-500">
              <span>Taxable Value:</span>
              <span className="font-mono">{formatCurrency(netSubtotal)}</span>
            </div>
            <div className="flex justify-between text-charcoal-500">
              <span>{taxRate > 0 ? `GST (${taxRate}% Included):` : 'GST (0% / Exempt):'}</span>
              <span className="font-mono">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-charcoal pt-2 border-t border-border">
              <span>Total Invoice Amount:</span>
              <span className="font-serif text-base">{formatCurrency(invoice.amount)}</span>
            </div>
            <div className="flex justify-between text-sage font-medium pt-1">
              <span>Payments Received:</span>
              <span className="font-mono">(-) {formatCurrency(amountPaid)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-terracotta pt-2 border-t border-border/80">
              <span>Remaining Balance Due:</span>
              <span className="font-serif text-base">{formatCurrency(balanceDue)}</span>
            </div>
          </div>
        </div>

        {/* Payment History Section (Req 4D & 5) */}
        {Array.isArray(invoice.paymentHistory) && invoice.paymentHistory.length > 0 && (
          <div className="pt-4 border-t border-border space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block">
              Payment Transaction Ledger
            </span>
            <div className="bg-ivory-50 rounded-xl border border-border overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-[10px] font-semibold text-charcoal-400 uppercase tracking-wider bg-ivory-100/60">
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Amount</th>
                    <th className="py-2 px-3">Method</th>
                    <th className="py-2 px-3">Reference / UTR</th>
                    <th className="py-2 px-3">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {invoice.paymentHistory.map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-2 px-3 text-charcoal-600">{formatDate(tx.paymentDate)}</td>
                      <td className="py-2 px-3 font-bold text-sage">{formatCurrency(tx.amount)}</td>
                      <td className="py-2 px-3 text-charcoal-600">{tx.method}</td>
                      <td className="py-2 px-3 font-mono text-[11px] text-charcoal-500">{tx.reference || '—'}</td>
                      <td className="py-2 px-3 text-charcoal-500">{tx.note || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Wire & Bank Transfer Terms */}
        <div className="p-4 bg-ivory-100 rounded-xl text-xs text-charcoal-600 leading-relaxed border border-border/80 space-y-1">
          <div className="font-semibold text-charcoal">Bank Wire Details & Tax Information</div>
          <div className="text-[11px] text-charcoal-500">
            Account Name: {settings.studioName} &bull; Bank: HDFC Bank Mumbai Fort &bull; A/C: 50200084920192 &bull; IFSC: HDFC0000060
          </div>
          <p className="text-[11px] text-charcoal-400 pt-1">
            {invoice.notes || 'Please mention invoice reference on all UPI / NEFT transfers. Deliverables access is subject to full invoice clearance.'}
          </p>
        </div>
      </Card>

      {/* Record Payment Modal */}
      {isRecordPaymentOpen && (
        <RecordPaymentModal
          isOpen={isRecordPaymentOpen}
          onClose={() => setIsRecordPaymentOpen(false)}
          eventId={invoice.eventId}
          invoiceId={invoice.id}
          defaultAmount={balanceDue}
        />
      )}

      {/* Edit Invoice Modal */}
      {isEditInvoiceOpen && (
        <InvoiceModal
          isOpen={isEditInvoiceOpen}
          onClose={() => setIsEditInvoiceOpen(false)}
          invoice={invoice}
        />
      )}
    </div>
  );
}
