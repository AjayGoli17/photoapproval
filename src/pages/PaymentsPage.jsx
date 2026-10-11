import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Receipt,
  Plus,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  FileText,
  DollarSign,
  Calendar,
  Filter,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { SearchInput } from '../components/common/SearchInput';
import { RecordPaymentModal } from '../components/modals/RecordPaymentModal';
import { InvoiceModal } from '../components/modals/InvoiceModal';
import { formatCurrency, formatDate } from '../utils/formatters';

export function PaymentsPage() {
  const { payments, clients, events, projects, metrics, getEventFinancials } = useStudioData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('All');

  // Modal states
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Summary Metrics calculations (Req 4A)
  const financialMetrics = useMemo(() => {
    const totalReceived = payments
      .filter((p) => p.status === 'Paid')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // Sum of contracted events minus received
    const totalContracted = events.reduce((sum, e) => sum + (Number(e.packageValue) || 0), 0);
    const outstandingBalances = Math.max(0, totalContracted - totalReceived);

    // Overdue payments: status !== 'Paid' and dueDate < today
    const overdueCount = payments.filter((p) => p.status !== 'Paid' && p.dueDate && p.dueDate < todayStr).length;
    const overdueAmount = payments
      .filter((p) => p.status !== 'Paid' && p.dueDate && p.dueDate < todayStr)
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // Received this month
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const receivedThisMonth = payments
      .filter((p) => {
        if (p.status !== 'Paid' || !p.paidDate) return false;
        const d = new Date(p.paidDate);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      })
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    return {
      totalReceived,
      outstandingBalances,
      overdueCount,
      overdueAmount,
      receivedThisMonth,
    };
  }, [payments, events, todayStr]);

  // Enriched invoices list
  const enrichedPayments = useMemo(() => {
    return payments.map((p) => {
      const client = clients.find((c) => c.id === p.clientId);
      const event = events.find((e) => e.id === p.eventId);
      const project = projects.find((pr) => pr.id === p.projectId || pr.eventId === p.eventId);

      const eventFinancials = event ? getEventFinancials(event.id) : null;
      const agreedAmount = event ? Number(event.packageValue) || p.amount : p.amount;

      // Status check for overdue
      let computedStatus = p.status;
      if (p.status !== 'Paid' && p.dueDate && p.dueDate < todayStr) {
        computedStatus = 'Overdue';
      }

      const amountPaid = p.status === 'Paid' ? p.amount : (p.paymentHistory?.reduce((s, h) => s + (Number(h.amount) || 0), 0) || 0);
      const outstanding = Math.max(0, p.amount - amountPaid);

      return {
        ...p,
        computedStatus,
        clientName: client?.name || 'Valued Client',
        eventName: event?.title || 'Studio Production',
        projectTitle: project?.title || null,
        agreedAmount,
        amountPaid,
        outstanding,
      };
    });
  }, [payments, clients, events, projects, getEventFinancials, todayStr]);

  // Filtered payments
  const filteredPayments = useMemo(() => {
    const now = new Date();
    return enrichedPayments.filter((p) => {
      const matchesSearch =
        p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.eventName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Paid' && p.computedStatus === 'Paid') ||
        (statusFilter === 'Pending' && p.computedStatus === 'Pending') ||
        (statusFilter === 'Overdue' && p.computedStatus === 'Overdue');

      const matchesMethod =
        methodFilter === 'All' ||
        (p.paymentMethod && p.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase()));

      let matchesDate = true;
      if (dateRangeFilter === '30days') {
        const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = new Date(p.paidDate || p.dueDate) >= cutoff;
      } else if (dateRangeFilter === '90days') {
        const cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        matchesDate = new Date(p.paidDate || p.dueDate) >= cutoff;
      } else if (dateRangeFilter === 'year') {
        matchesDate = new Date(p.paidDate || p.dueDate).getFullYear() === now.getFullYear();
      }

      return matchesSearch && matchesStatus && matchesMethod && matchesDate;
    });
  }, [enrichedPayments, searchTerm, statusFilter, methodFilter, dateRangeFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments & Invoices"
        subtitle="Manage client booking retainers, milestone payments, GST tax invoices, and bank settlements."
        badge={<Badge variant="sage">{payments.length} Invoices On Record</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsInvoiceModalOpen(true)}
            >
              Create Invoice
            </Button>
            <Button
              variant="primary"
              leftIcon={<DollarSign className="w-4 h-4" />}
              onClick={() => {
                setSelectedInvoiceForPayment(null);
                setIsRecordModalOpen(true);
              }}
            >
              Record Payment
            </Button>
          </div>
        }
      />

      {/* 4 Financial Summary KPI Cards (Req 4A) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-surface">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-sage block">
            Total Revenue Received
          </span>
          <div className="text-2xl font-bold text-sage mt-2 font-serif">
            {formatCurrency(financialMetrics.totalReceived)}
          </div>
          <span className="text-xs text-charcoal-500 mt-0.5 block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-sage" /> Settled in bank account
          </span>
        </Card>

        <Card className="p-4 bg-surface">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber block">
            Outstanding Balances
          </span>
          <div className="text-2xl font-bold text-amber mt-2 font-serif">
            {formatCurrency(financialMetrics.outstandingBalances)}
          </div>
          <span className="text-xs text-charcoal-500 mt-0.5 block">
            Contracted balance pending
          </span>
        </Card>

        <Card className="p-4 bg-surface">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose block">
            Overdue Invoices
          </span>
          <div className="text-2xl font-bold text-rose-dark mt-2 font-serif">
            {financialMetrics.overdueCount > 0 ? formatCurrency(financialMetrics.overdueAmount) : '₹0'}
          </div>
          <span className="text-xs text-rose-dark mt-0.5 block">
            {financialMetrics.overdueCount} payment(s) past due date
          </span>
        </Card>

        <Card className="p-4 bg-surface">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-terracotta block">
            Received This Month
          </span>
          <div className="text-2xl font-bold text-charcoal mt-2 font-serif">
            {formatCurrency(financialMetrics.receivedThisMonth)}
          </div>
          <span className="text-xs text-charcoal-500 mt-0.5 block">
            Current fiscal period receipts
          </span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-surface rounded-xl border border-border">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search invoice #, client, event..."
            className="w-full sm:w-64"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-ivory-50 text-charcoal hover:bg-surface focus:outline-none focus:ring-1 focus:ring-terracotta"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid Only</option>
            <option value="Pending">Pending Invoices</option>
            <option value="Overdue">Overdue Invoices</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-ivory-50 text-charcoal hover:bg-surface focus:outline-none focus:ring-1 focus:ring-terracotta"
          >
            <option value="All">All Payment Methods</option>
            <option value="NEFT">NEFT / RTGS</option>
            <option value="UPI">UPI / QR Code</option>
            <option value="IMPS">IMPS Direct</option>
            <option value="Wire">Corporate Wire</option>
            <option value="Card">Card</option>
          </select>

          <select
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-ivory-50 text-charcoal hover:bg-surface focus:outline-none focus:ring-1 focus:ring-terracotta"
          >
            <option value="All">All Time</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Invoices Table (Req 4A) */}
      <Card className="overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-ivory-50 text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Event / Project</th>
                <th className="py-3 px-4 text-right">Invoice Amount</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-xs text-charcoal-400 italic">
                    No invoice or payment records match your current filter query.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const isPaid = p.computedStatus === 'Paid';
                  const isOverdue = p.computedStatus === 'Overdue';

                  return (
                    <tr key={p.id} className="hover:bg-ivory-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-charcoal">
                        <Link to={`/invoices/${p.id}`} className="hover:text-terracotta underline">
                          {p.invoiceNumber}
                        </Link>
                      </td>

                      <td className="py-3.5 px-4">
                        <Link to={`/clients/${p.clientId}`} className="font-medium text-charcoal hover:underline">
                          {p.clientName}
                        </Link>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <Link
                          to={p.eventId ? `/events/${p.eventId}` : `/projects/${p.projectId}`}
                          className="font-medium text-charcoal-700 hover:text-terracotta truncate block"
                        >
                          {p.eventName}
                        </Link>
                        <span className="text-[11px] text-charcoal-400 block truncate">{p.description}</span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-semibold text-charcoal">
                        {formatCurrency(p.amount)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-semibold text-sage">
                        {formatCurrency(p.amountPaid)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-semibold text-amber">
                        {formatCurrency(p.outstanding)}
                      </td>

                      <td className="py-3.5 px-4 text-charcoal-600">
                        <span className={isOverdue ? 'text-red-600 font-bold' : ''}>
                          {formatDate(p.dueDate)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          size="xs"
                          variant={isPaid ? 'sage' : isOverdue ? 'destructive' : 'amber'}
                        >
                          {p.computedStatus}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isPaid && (
                            <Button
                              size="xs"
                              variant="outline"
                              className="text-terracotta border-terracotta/40 hover:bg-terracotta/10"
                              onClick={() => {
                                setSelectedInvoiceForPayment(p);
                                setIsRecordModalOpen(true);
                              }}
                            >
                              Pay
                            </Button>
                          )}
                          <Link to={`/invoices/${p.id}`}>
                            <Button variant="ghost" size="xs" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                              View
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <RecordPaymentModal
          isOpen={isRecordModalOpen}
          onClose={() => {
            setIsRecordModalOpen(false);
            setSelectedInvoiceForPayment(null);
          }}
          eventId={selectedInvoiceForPayment?.eventId || null}
          invoiceId={selectedInvoiceForPayment?.id || null}
          defaultAmount={selectedInvoiceForPayment ? selectedInvoiceForPayment.outstanding : ''}
        />
      )}

      {/* Create Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
    </div>
  );
}
