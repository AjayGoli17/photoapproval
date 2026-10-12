import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  IndianRupee,
  Camera,
  CheckCircle2,
  Calendar,
  Clock,
  Package,
  Layers,
  CheckSquare,
  AlertCircle,
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';

const CHART_COLORS = ['#B96F52', '#6F816B', '#D99B26', '#464440', '#8B5CF6', '#EC4899'];

export function ReportsPage() {
  const { getReportData } = useStudioData();
  const [dateRange, setDateRange] = useState('all'); // '30days' | '90days' | 'year' | 'all'

  const report = useMemo(() => getReportData(dateRange), [getReportData, dateRange]);

  const dateRangeLabel = useMemo(() => {
    switch (dateRange) {
      case '30days':
        return 'Last 30 Days';
      case '90days':
        return 'Last 90 Days';
      case 'year':
        return 'Current Fiscal Year (2026-27)';
      case 'all':
      default:
        return 'All Time Lifetime Metrics';
    }
  }, [dateRange]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Studio Performance & Analytics"
        subtitle="Real-time financial revenues, shoot conversions, deliverable pipelines, and darkroom task velocities."
        badge={<Badge variant="terracotta">{dateRangeLabel}</Badge>}
        actions={
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 bg-surface p-1 rounded-xl border border-border">
            {[
              { id: '30days', label: '30 Days' },
              { id: '90days', label: '90 Days' },
              { id: 'year', label: 'This Year' },
              { id: 'all', label: 'All Time' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setDateRange(btn.id)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                  dateRange === btn.id
                    ? 'bg-terracotta text-white shadow-xs font-semibold'
                    : 'text-charcoal-600 hover:text-charcoal hover:bg-ivory-100'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        }
      />

      {/* 8 Meaningful Business Summary KPI Cards (Req 6A) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 bg-surface">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400 block">
            Contracted Bookings
          </span>
          <div className="text-xl sm:text-2xl font-bold text-charcoal mt-1.5 font-serif">
            {formatCurrency(report.contractedValue)}
          </div>
          <span className="text-[11px] text-charcoal-500 mt-1 block">
            Across {report.bookedEvents} booked event(s)
          </span>
        </Card>

        <Card className="p-4 bg-surface">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-sage block">
            Payments Received
          </span>
          <div className="text-xl sm:text-2xl font-bold text-sage mt-1.5 font-serif">
            {formatCurrency(report.paymentsReceived)}
          </div>
          <span className="text-[11px] text-sage-dark mt-1 block flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Actual cleared revenue
          </span>
        </Card>

        <Card className="p-4 bg-surface">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber block">
            Outstanding Balances
          </span>
          <div className="text-xl sm:text-2xl font-bold text-amber mt-1.5 font-serif">
            {formatCurrency(report.outstandingBalance)}
          </div>
          <span className="text-[11px] text-charcoal-500 mt-1 block">
            Contracted milestone balance
          </span>
        </Card>

        <Card className="p-4 bg-surface">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-terracotta block">
            Project Completion
          </span>
          <div className="text-xl sm:text-2xl font-bold text-charcoal mt-1.5 font-serif">
            {report.projectCompletionRate}%
          </div>
          <span className="text-[11px] text-charcoal-500 mt-1 block">
            Workspaces finished
          </span>
        </Card>

        <Card className="p-4 bg-surface">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400 block">
            Active Clients
          </span>
          <div className="text-xl sm:text-2xl font-bold text-charcoal mt-1.5 font-serif">
            {report.totalClients}
          </div>
          <span className="text-[11px] text-charcoal-500 mt-1 block">Client accounts on record</span>
        </Card>

        <Card className="p-4 bg-surface">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber block">
            Pending Deliveries
          </span>
          <div className="text-xl sm:text-2xl font-bold text-amber mt-1.5 font-serif">
            {report.pendingDeliveries}
          </div>
          <span className="text-[11px] text-charcoal-500 mt-1 block">In production pipeline</span>
        </Card>

        <Card className="p-4 bg-surface">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400 block">
            Tasks Completed
          </span>
          <div className="text-xl sm:text-2xl font-bold text-charcoal mt-1.5 font-serif">
            {report.tasksCompleted}
          </div>
          <span className="text-[11px] text-sage font-medium mt-1 block">Darkroom items resolved</span>
        </Card>

        <Card className="p-4 bg-surface">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400 block">
            Collection Conversion
          </span>
          <div className="text-xl sm:text-2xl font-bold text-charcoal mt-1.5 font-serif">
            {report.contractedValue > 0
              ? `${Math.round((report.paymentsReceived / report.contractedValue) * 100)}%`
              : '0%'}
          </div>
          <span className="text-[11px] text-charcoal-500 mt-1 block">Contract cash realization</span>
        </Card>
      </div>

      {/* 6 Recharts Charts Grid (Req 6B) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue Over Time */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-charcoal font-serif">1. Revenue Realization Over Time</h3>
              <p className="text-xs text-charcoal-400">Monthly amounts actually cleared in studio account</p>
            </div>
            <Badge variant="sage" size="xs">Cleared Cash</Badge>
          </div>
          <div className="h-64 w-full pt-2 min-w-0 overflow-hidden">
            {report.revenueOverTime.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-charcoal-400 italic">
                No revenue records in this timeframe.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={report.revenueOverTime} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B96F52" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#B96F52" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6E2DA" vertical={false} />
                  <XAxis dataKey="month" stroke="#7B7873" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#7B7873"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v / 1000}k`}
                  />
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), 'Revenue Cleared']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E6E2DA',
                      boxShadow: '0 4px 12px rgba(41,41,37,0.08)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#B96F52"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Chart 2: Bookings by Event Type */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-charcoal font-serif">2. Bookings by Shoot Category</h3>
              <p className="text-xs text-charcoal-400">Distribution across weddings, editorial, and commercial campaigns</p>
            </div>
            <Badge variant="terracotta" size="xs">Categories</Badge>
          </div>
          <div className="h-64 w-full pt-2 min-w-0 overflow-hidden">
            {report.bookingsByEventType.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-charcoal-400 italic">
                No booked events in this timeframe.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.bookingsByEventType} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6E2DA" vertical={false} />
                  <XAxis dataKey="name" stroke="#7B7873" fontSize={10} tickLine={false} angle={-15} textAnchor="end" />
                  <YAxis stroke="#7B7873" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    formatter={(val) => [`${val} Shoots`, 'Bookings']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E6E2DA',
                    }}
                  />
                  <Bar dataKey="value" fill="#6F816B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Chart 3: Payment Status Breakdown */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-charcoal font-serif">3. Payment Settlement Health</h3>
              <p className="text-xs text-charcoal-400">Ratio of settled vs pending vs overdue invoices</p>
            </div>
            <Badge variant="amber" size="xs">Billing</Badge>
          </div>
          <div className="h-64 w-full flex flex-col items-center justify-center pt-2">
            {report.paymentStatusBreakdown.length === 0 ? (
              <div className="text-xs text-charcoal-400 italic">No payments logged in this timeframe.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={report.paymentStatusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {report.paymentStatusBreakdown.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E6E2DA',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Chart 4: Project Status Distribution */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-charcoal font-serif">4. Project Workspace Pipeline</h3>
              <p className="text-xs text-charcoal-400">Workspaces across planning, production, and review</p>
            </div>
            <Badge size="xs">Workspaces</Badge>
          </div>
          <div className="h-64 w-full pt-2 min-w-0 overflow-hidden">
            {report.projectStatusDistribution.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-charcoal-400 italic">
                No active projects found.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={report.projectStatusDistribution}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6E2DA" horizontal={false} />
                  <XAxis type="number" stroke="#7B7873" fontSize={11} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke="#7B7873" fontSize={11} tickLine={false} width={85} />
                  <Tooltip
                    formatter={(val) => [`${val} Projects`, 'Workspaces']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E6E2DA',
                    }}
                  />
                  <Bar dataKey="value" fill="#B96F52" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Chart 5: Task Completion Overview */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-charcoal font-serif">5. Darkroom Task Resolution Velocity</h3>
              <p className="text-xs text-charcoal-400">Completed vs in-progress vs pending studio tasks</p>
            </div>
            <Badge variant="sage" size="xs">Team Velocity</Badge>
          </div>
          <div className="h-64 w-full flex flex-col items-center justify-center pt-2">
            {report.taskCompletionOverview.length === 0 ? (
              <div className="text-xs text-charcoal-400 italic">No tasks logged in this timeframe.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={report.taskCompletionOverview}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {report.taskCompletionOverview.map((entry, idx) => (
                      <Cell key={`cell-task-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E6E2DA',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Chart 6: Deliverables Pipeline */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-charcoal font-serif">6. Deliverables Pipeline</h3>
              <p className="text-xs text-charcoal-400">Packages by current delivery stage</p>
            </div>
            <Badge variant="terracotta" size="xs">Delivery Stages</Badge>
          </div>
          <div className="h-64 w-full pt-2 min-w-0 overflow-hidden">
            {report.deliveryPipeline.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-charcoal-400 italic">
                No deliverables in this timeframe.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.deliveryPipeline} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6E2DA" vertical={false} />
                  <XAxis dataKey="name" stroke="#7B7873" fontSize={10} tickLine={false} angle={-15} textAnchor="end" />
                  <YAxis stroke="#7B7873" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    formatter={(val) => [`${val} Deliverables`, 'Count']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E6E2DA',
                    }}
                  />
                  <Bar dataKey="value" fill="#D99B26" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
