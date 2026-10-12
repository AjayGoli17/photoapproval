import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StudioDataProvider } from './context/StudioDataContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Page imports
import { DashboardPage } from './pages/DashboardPage';
import { ClientsPage } from './pages/ClientsPage';
import { ClientDetailPage } from './pages/ClientDetailPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { TasksPage } from './pages/TasksPage';
import { CalendarPage } from './pages/CalendarPage';
import { TeamPage } from './pages/TeamPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { InvoiceDetailPage } from './pages/InvoiceDetailPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <StudioDataProvider>
      <ToastProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              {/* Studio Workspace Application (With AppLayout sidebar & topbar) */}
              <Route path="/" element={<AppLayout />}>
                {/* Default redirect to /dashboard */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />

                {/* Workspace routes */}
                <Route path="clients" element={<ClientsPage />} />
                <Route path="clients/:id" element={<ClientDetailPage />} />

                <Route path="events" element={<EventsPage />} />
                <Route path="events/:id" element={<EventDetailPage />} />

                <Route path="projects" element={<ProjectsPage />} />
                <Route path="projects/:id" element={<ProjectDetailPage />} />

                <Route path="tasks" element={<TasksPage />} />
                <Route path="calendar" element={<CalendarPage />} />

                {/* Studio Operations routes */}
                <Route path="team" element={<TeamPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="invoices/:id" element={<InvoiceDetailPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />

                {/* 404 catch-all */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </ToastProvider>
    </StudioDataProvider>
  );
}
