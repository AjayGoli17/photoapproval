import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { loadStoredData, saveStoredData, clearAndResetStoredData } from '../data/storage.js';

const StudioDataContext = createContext(null);

export function StudioDataProvider({ children }) {
  const [data, setData] = useState(() => loadStoredData());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);

    // Cross-tab synchronization via localStorage storage event
    const handleStorageChange = (e) => {
      if (e.key === 'studioflow_demo_data_v2' && e.newValue) {
        try {
          const freshData = JSON.parse(e.newValue);
          setData(freshData);
        } catch (err) {
          console.error('Failed to sync StudioFlow storage across tabs:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync to localStorage on changes
  const persistChanges = useCallback((updater) => {
    setData((prev) => {
      const nextData = typeof updater === 'function' ? updater(prev) : updater;
      saveStoredData(nextData);
      return nextData;
    });
  }, []);

  // Reset to original demo data
  const resetDemoData = useCallback(() => {
    const fresh = clearAndResetStoredData();
    setData(fresh);
    return fresh;
  }, []);

  // Log activity
  const logActivity = useCallback((userName, action, targetType, targetTitle, details, targetId = null) => {
    const newEntry = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userName: userName || 'Studio Director',
      action,
      targetType,
      targetTitle,
      targetId,
      details,
    };
    persistChanges((prev) => ({
      ...prev,
      activityLog: [newEntry, ...prev.activityLog.slice(0, 49)], // keep latest 50
    }));
  }, [persistChanges]);

  const clearActivityLog = useCallback(() => {
    const count = data.activityLog.length;
    persistChanges((prev) => ({
      ...prev,
      activityLog: [],
    }));
    return count;
  }, [data.activityLog.length, persistChanges]);

  // ==========================================
  // CLIENT MUTATIONS
  // ==========================================
  const addClient = useCallback((client) => {
    const id = `client-${Date.now()}`;
    const newClient = {
      ...client,
      id,
      createdAt: new Date().toISOString(),
      totalSpent: client.totalSpent || 0,
      status: client.status || 'Active',
      avatar: client.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      category: client.category || 'Wedding Couple',
      notes: (client.notes || '').trim(),
      location: (client.location || '').trim(),
      contactPerson: (client.contactPerson || client.name || '').trim(),
      email: (client.email || '').trim(),
      phone: (client.phone || '').trim(),
      name: (client.name || '').trim(),
    };
    persistChanges((prev) => ({
      ...prev,
      clients: [newClient, ...prev.clients],
    }));
    logActivity('Studio Director', 'Client Added', 'Client', newClient.name, `New client profile created for ${newClient.name}`, id);
    return newClient;
  }, [persistChanges, logActivity]);

  const updateClient = useCallback((id, updates) => {
    let updatedClient = null;
    persistChanges((prev) => ({
      ...prev,
      clients: prev.clients.map((c) => {
        if (c.id === id) {
          updatedClient = {
            ...c,
            ...updates,
            name: updates.name ? updates.name.trim() : c.name,
            email: updates.email !== undefined ? updates.email.trim() : c.email,
            phone: updates.phone !== undefined ? updates.phone.trim() : c.phone,
            location: updates.location !== undefined ? updates.location.trim() : c.location,
            contactPerson: updates.contactPerson !== undefined ? updates.contactPerson.trim() : c.contactPerson,
            notes: updates.notes !== undefined ? updates.notes.trim() : c.notes,
          };
          return updatedClient;
        }
        return c;
      }),
    }));
    if (updatedClient) {
      logActivity('Studio Director', 'Client Updated', 'Client', updatedClient.name, `Updated details for ${updatedClient.name}`, id);
    }
    return updatedClient;
  }, [persistChanges, logActivity]);

  const deleteClient = useCallback((id) => {
    const client = data.clients.find((c) => c.id === id);
    const linkedEvents = data.events.filter((e) => e.clientId === id);
    if (linkedEvents.length > 0) {
      throw new Error(`Cannot delete client with ${linkedEvents.length} active booking(s). Please remove or reassign the events first.`);
    }

    persistChanges((prev) => ({
      ...prev,
      clients: prev.clients.filter((c) => c.id !== id),
      projects: prev.projects.map((p) => (p.clientId === id ? { ...p, clientId: null } : p)),
      payments: prev.payments.map((pay) => (pay.clientId === id ? { ...pay, clientId: null } : pay)),
    }));
    if (client) {
      logActivity('Studio Director', 'Client Deleted', 'Client', client.name, `Removed client record for ${client.name}`, id);
    }
  }, [data.clients, data.events, persistChanges, logActivity]);

  const deleteAllClients = useCallback(() => {
    const count = data.clients.length;
    persistChanges((prev) => ({
      ...prev,
      clients: [],
      // Safely unlink client references in events, projects, and payments
      events: prev.events.map((e) => ({ ...e, clientId: null })),
      projects: prev.projects.map((p) => ({ ...p, clientId: null })),
      payments: prev.payments.map((pay) => ({ ...pay, clientId: null })),
    }));
    logActivity('Studio Director', 'All Clients Deleted', 'Client Directory', 'All Clients', `Deleted all ${count} client records and safely unlinked related bookings`);
    return count;
  }, [data.clients.length, persistChanges, logActivity]);

  // ==========================================
  // EVENT MUTATIONS
  // ==========================================
  const addEvent = useCallback((eventData, options = {}) => {
    const id = `event-${Date.now()}`;
    const newEvent = {
      ...eventData,
      id,
      status: eventData.status || 'Confirmed',
      packageValue: Number(eventData.packageValue) || 0,
      title: (eventData.title || '').trim(),
      venue: (eventData.venue || '').trim(),
      description: (eventData.description || '').trim(),
      notes: (eventData.notes || '').trim(),
      createdAt: new Date().toISOString(),
    };

    let newPayments = data.payments;
    let newProjects = data.projects;

    if (options.advanceAmount && Number(options.advanceAmount) > 0) {
      const payId = `pay-${Date.now()}`;
      const advancePayment = {
        id: payId,
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        clientId: newEvent.clientId,
        eventId: id,
        projectId: null,
        description: `Booking Advance — ${newEvent.title}`,
        amount: Number(options.advanceAmount),
        type: 'Advance Deposit',
        status: 'Paid',
        dueDate: newEvent.startDate,
        paidDate: new Date().toISOString().split('T')[0],
        paymentMethod: options.paymentMethod || 'UPI / Bank Transfer',
      };
      newPayments = [advancePayment, ...newPayments];
    }

    if (options.createProject) {
      const projId = `proj-${Date.now()}`;
      const newProject = {
        id: projId,
        title: newEvent.title,
        clientId: newEvent.clientId,
        eventId: id,
        status: 'Planning',
        shootDate: newEvent.startDate,
        deliveryDeadline: options.deliveryDeadline || newEvent.endDate || newEvent.startDate,
        coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        category: newEvent.eventType?.includes('Wedding') ? 'Wedding' : 'Commercial',
        tags: [newEvent.eventType, 'Active Workspace'],
        progressPercent: 0,
      };
      newProjects = [newProject, ...newProjects];
    }

    persistChanges((prev) => ({
      ...prev,
      events: [newEvent, ...prev.events],
      payments: newPayments !== data.payments ? newPayments : prev.payments,
      projects: newProjects !== data.projects ? newProjects : prev.projects,
    }));

    logActivity('Studio Director', 'Event Booked', 'Event', newEvent.title, `Booked ${newEvent.title} for ${newEvent.startDate}`, id);
    return newEvent;
  }, [data.payments, data.projects, persistChanges, logActivity]);

  const updateEvent = useCallback((id, updates) => {
    let updatedEvent = null;
    let prevStatus = null;
    persistChanges((prev) => ({
      ...prev,
      events: prev.events.map((e) => {
        if (e.id === id) {
          prevStatus = e.status;
          updatedEvent = {
            ...e,
            ...updates,
            packageValue: updates.packageValue !== undefined ? Number(updates.packageValue) : e.packageValue,
            title: updates.title !== undefined ? updates.title.trim() : e.title,
            venue: updates.venue !== undefined ? updates.venue.trim() : e.venue,
          };
          return updatedEvent;
        }
        return e;
      }),
    }));

    if (updatedEvent) {
      if (updates.status && updates.status !== prevStatus) {
        logActivity('Studio Director', 'Booking Status Changed', 'Event', updatedEvent.title, `Changed status from ${prevStatus} to ${updates.status}`, id);
      } else {
        logActivity('Studio Director', 'Event Updated', 'Event', updatedEvent.title, `Updated booking details for ${updatedEvent.title}`, id);
      }
    }
    return updatedEvent;
  }, [persistChanges, logActivity]);

  const deleteEvent = useCallback((id) => {
    const event = data.events.find((e) => e.id === id);
    persistChanges((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
      projects: prev.projects.map((p) => (p.eventId === id ? { ...p, eventId: null } : p)),
    }));

    if (event) {
      logActivity('Studio Director', 'Event Deleted', 'Event', event.title, `Cancelled and removed booking ${event.title}`, id);
    }
  }, [data.events, persistChanges, logActivity]);

  const deleteAllEvents = useCallback(() => {
    const count = data.events.length;
    persistChanges((prev) => ({
      ...prev,
      events: [],
      // Safely unlink event references in projects, payments, and deliverables
      projects: prev.projects.map((p) => ({ ...p, eventId: null })),
      payments: prev.payments.map((pay) => ({ ...pay, eventId: null })),
      deliverables: prev.deliverables.map((d) => ({ ...d, eventId: null })),
    }));
    logActivity('Studio Director', 'All Events Deleted', 'Events', 'All Bookings', `Deleted all ${count} event bookings and safely unlinked related workspaces`);
    return count;
  }, [data.events.length, persistChanges, logActivity]);

  // ==========================================
  // PROJECT MUTATIONS
  // ==========================================
  const addProject = useCallback((projectData) => {
    const event = data.events.find((e) => e.id === projectData.eventId);
    if (!event) {
      throw new Error('Project must be linked to a valid scheduled event');
    }

    // Check duplicate project for the same event
    const existing = data.projects.find((p) => p.eventId === projectData.eventId);
    if (existing) {
      throw new Error(`A project workspace already exists for "${event.title}". Please edit the existing project.`);
    }

    const id = `proj-${Date.now()}`;
    const newProject = {
      ...projectData,
      id,
      clientId: event.clientId,
      eventId: event.id,
      title: (projectData.title || event.title).trim(),
      status: projectData.status || 'Planning',
      shootDate: projectData.shootDate || event.startDate,
      deliveryDeadline: projectData.deliveryDeadline || event.endDate || event.startDate,
      coverImage: projectData.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      category: projectData.category || (event.eventType?.includes('Wedding') ? 'Wedding' : 'Commercial'),
      tags: projectData.tags || [event.eventType, 'Active Workspace'],
      progressPercent: 0,
      createdAt: new Date().toISOString(),
    };

    persistChanges((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
    }));

    logActivity('Studio Director', 'Project Created', 'Project', newProject.title, `Initiated production workspace for ${newProject.title}`, id);
    return newProject;
  }, [data.events, data.projects, persistChanges, logActivity]);

  const updateProject = useCallback((id, updates) => {
    let updated = null;
    persistChanges((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id === id) {
          updated = { ...p, ...updates };
          return updated;
        }
        return p;
      }),
    }));
    if (updated) {
      logActivity('Studio Director', 'Project Updated', 'Project', updated.title, `Updated workspace details for ${updated.title}`, id);
    }
    return updated;
  }, [persistChanges, logActivity]);

  const deleteProject = useCallback((id) => {
    const project = data.projects.find((p) => p.id === id);
    persistChanges((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
      // Clean up linked tasks and notes
      tasks: prev.tasks.filter((t) => t.projectId !== id),
      projectNotes: prev.projectNotes ? prev.projectNotes.filter((n) => n.projectId !== id) : [],
    }));
    if (project) {
      logActivity('Studio Director', 'Project Deleted', 'Project', project.title, `Removed project workspace and archived associated tasks`, id);
    }
  }, [data.projects, persistChanges, logActivity]);

  const deleteAllProjects = useCallback(() => {
    const count = data.projects.length;
    persistChanges((prev) => ({
      ...prev,
      projects: [],
      // Clean up linked tasks, notes, and unlink deliverables & payments
      tasks: prev.tasks.map((t) => ({ ...t, projectId: null })),
      projectNotes: [],
      deliverables: prev.deliverables.map((d) => ({ ...d, projectId: null })),
      payments: prev.payments.map((pay) => ({ ...pay, projectId: null })),
    }));
    logActivity('Studio Director', 'All Projects Deleted', 'Projects', 'All Workspaces', `Deleted all ${count} project workspaces and cleaned up associated production notes`);
    return count;
  }, [data.projects.length, persistChanges, logActivity]);

  const createProjectForEvent = useCallback((eventId) => {
    const event = data.events.find((e) => e.id === eventId);
    if (!event) return null;
    const existing = data.projects.find((p) => p.eventId === eventId);
    if (existing) return existing;

    const projId = `proj-${Date.now()}`;
    const newProject = {
      id: projId,
      title: event.title,
      clientId: event.clientId,
      eventId: eventId,
      status: 'Planning',
      shootDate: event.startDate,
      deliveryDeadline: event.endDate || event.startDate,
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      category: event.eventType?.includes('Wedding') ? 'Wedding' : 'Commercial',
      tags: [event.eventType, 'Active Workspace'],
      progressPercent: 0,
      createdAt: new Date().toISOString(),
    };

    persistChanges((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
    }));

    logActivity('Studio Director', 'Project Created', 'Project', newProject.title, `Initiated workspace for ${event.title}`, projId);
    return newProject;
  }, [data.events, data.projects, persistChanges, logActivity]);

  // Project progress derived from tasks (Requirement 8)
  const getProjectProgress = useCallback((projectId) => {
    const projectTasks = data.tasks.filter((t) => t.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    const completed = projectTasks.filter((t) => t.status === 'Completed' || t.status === 'Done').length;
    return Math.round((completed / projectTasks.length) * 100);
  }, [data.tasks]);

  // ==========================================
  // TASK MUTATIONS
  // ==========================================
  const addTask = useCallback((taskData) => {
    const trimmedTitle = (taskData.title || '').trim();
    if (!trimmedTitle) {
      throw new Error('Task title is required');
    }
    if (!taskData.dueDate) {
      throw new Error('Task due date is required');
    }
    if (taskData.startDate && taskData.dueDate && taskData.dueDate < taskData.startDate) {
      throw new Error('Due date cannot precede the task start date');
    }

    const id = `task-${Date.now()}`;
    const newTask = {
      ...taskData,
      id,
      title: trimmedTitle,
      description: (taskData.description || '').trim(),
      projectId: taskData.projectId || null,
      assignedTo: taskData.assignedTo || null,
      category: taskData.category || 'General',
      startDate: taskData.startDate || null,
      dueDate: taskData.dueDate,
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    persistChanges((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));

    logActivity('Studio Director', 'Task Created', 'Task', newTask.title, `Added new studio task: ${newTask.title}`, id);
    return newTask;
  }, [persistChanges, logActivity]);

  const updateTask = useCallback((id, updates) => {
    if (updates.title !== undefined && !updates.title.trim()) {
      throw new Error('Task title cannot be empty');
    }
    if (updates.startDate && updates.dueDate && updates.dueDate < updates.startDate) {
      throw new Error('Due date cannot precede the task start date');
    }

    let updated = null;
    let prevStatus = null;
    persistChanges((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id === id) {
          prevStatus = t.status;
          updated = {
            ...t,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          return updated;
        }
        return t;
      }),
    }));

    if (updated) {
      if (updates.status && updates.status !== prevStatus) {
        if (updates.status === 'Completed' || updates.status === 'Done') {
          logActivity('Studio Director', 'Task Completed', 'Task', updated.title, `Marked task "${updated.title}" as completed`, id);
        } else {
          logActivity('Studio Director', 'Task Status Changed', 'Task', updated.title, `Changed status to ${updates.status}`, id);
        }
      } else if (updates.assignedTo) {
        const member = data.team.find((m) => m.id === updates.assignedTo);
        logActivity('Studio Director', 'Task Assigned', 'Task', updated.title, `Assigned task to ${member?.name || 'team member'}`, id);
      }
    }
    return updated;
  }, [data.team, persistChanges, logActivity]);

  const deleteTask = useCallback((id) => {
    const task = data.tasks.find((t) => t.id === id);
    persistChanges((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
    if (task) {
      logActivity('Studio Director', 'Task Deleted', 'Task', task.title, `Removed task "${task.title}"`, id);
    }
  }, [data.tasks, persistChanges, logActivity]);

  const deleteAllTasks = useCallback(() => {
    const count = data.tasks.length;
    persistChanges((prev) => ({
      ...prev,
      tasks: [],
    }));
    logActivity('Studio Director', 'All Tasks Deleted', 'Tasks', 'All Tasks', `Deleted all ${count} studio tasks`);
    return count;
  }, [data.tasks.length, persistChanges, logActivity]);

  const deleteTasksForProject = useCallback((projectId) => {
    let deletedCount = 0;
    persistChanges((prev) => {
      const remaining = prev.tasks.filter((t) => t.projectId !== projectId);
      deletedCount = prev.tasks.length - remaining.length;
      return {
        ...prev,
        tasks: remaining,
      };
    });
    const proj = data.projects.find((p) => p.id === projectId);
    logActivity('Studio Director', 'Project Tasks Deleted', 'Tasks', proj?.title || 'Project Workspace', `Deleted all ${deletedCount} tasks for ${proj?.title || 'workspace'}`);
    return deletedCount;
  }, [data.projects, persistChanges, logActivity]);

  const toggleTaskComplete = useCallback((id) => {
    const task = data.tasks.find((t) => t.id === id);
    if (!task) return;
    const isDone = task.status === 'Completed' || task.status === 'Done';
    const nextStatus = isDone ? 'In Progress' : 'Completed';
    updateTask(id, { status: nextStatus });
  }, [data.tasks, updateTask]);

  const reassignTask = useCallback((id, newAssigneeId) => {
    updateTask(id, { assignedTo: newAssigneeId });
  }, [updateTask]);

  // ==========================================
  // PROJECT NOTES MUTATIONS
  // ==========================================
  const addProjectNote = useCallback((projectId, noteData) => {
    const id = `note-${Date.now()}`;
    const newNote = {
      id,
      projectId,
      title: (noteData.title || 'Untitled Note').trim(),
      content: noteData.content || '',
      author: noteData.author || 'Studio Director',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    persistChanges((prev) => ({
      ...prev,
      projectNotes: [newNote, ...(prev.projectNotes || [])],
    }));

    logActivity('Studio Director', 'Note Added', 'Project Note', newNote.title, `Added internal note to workspace`, id);
    return newNote;
  }, [persistChanges, logActivity]);

  const updateProjectNote = useCallback((id, updates) => {
    let updated = null;
    persistChanges((prev) => ({
      ...prev,
      projectNotes: (prev.projectNotes || []).map((n) => {
        if (n.id === id) {
          updated = {
            ...n,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          return updated;
        }
        return n;
      }),
    }));
    return updated;
  }, [persistChanges]);

  const deleteProjectNote = useCallback((id) => {
    persistChanges((prev) => ({
      ...prev,
      projectNotes: (prev.projectNotes || []).filter((n) => n.id !== id),
    }));
  }, [persistChanges]);

  const deleteAllProjectNotes = useCallback(() => {
    const count = (data.projectNotes || []).length;
    persistChanges((prev) => ({
      ...prev,
      projectNotes: [],
    }));
    logActivity('Studio Director', 'All Notes Deleted', 'Project Notes', 'All Notes', `Deleted all ${count} production notes across all projects`);
    return count;
  }, [data.projectNotes, persistChanges, logActivity]);

  const deleteNotesForProject = useCallback((projectId) => {
    let deletedCount = 0;
    persistChanges((prev) => {
      const remaining = (prev.projectNotes || []).filter((n) => n.projectId !== projectId);
      deletedCount = (prev.projectNotes || []).length - remaining.length;
      return {
        ...prev,
        projectNotes: remaining,
      };
    });
    const proj = data.projects.find((p) => p.id === projectId);
    logActivity('Studio Director', 'Project Notes Deleted', 'Project Notes', proj?.title || 'Project Workspace', `Deleted all ${deletedCount} notes for ${proj?.title || 'workspace'}`);
    return deletedCount;
  }, [data.projects, data.projectNotes, persistChanges, logActivity]);

  const getNotesByProject = useCallback((projectId) => {
    return (data.projectNotes || []).filter((n) => n.projectId === projectId);
  }, [data.projectNotes]);

  // ==========================================
  // TEAM MUTATIONS & WORKLOAD
  // ==========================================
  const addTeamMember = useCallback((memberData) => {
    const id = `team-${Date.now()}`;
    const newMember = {
      ...memberData,
      id,
      name: (memberData.name || '').trim(),
      role: (memberData.role || 'Photographer').trim(),
      email: (memberData.email || '').trim(),
      phone: (memberData.phone || '').trim(),
      specialty: (memberData.specialty || '').trim(),
      status: memberData.status || 'Active',
      avatar: memberData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      activeProjects: 0,
    };

    persistChanges((prev) => ({
      ...prev,
      team: [...prev.team, newMember],
    }));

    logActivity('Studio Director', 'Team Member Added', 'Team', newMember.name, `Added ${newMember.name} as ${newMember.role}`, id);
    return newMember;
  }, [persistChanges, logActivity]);

  const updateTeamMember = useCallback((id, updates) => {
    let updated = null;
    persistChanges((prev) => ({
      ...prev,
      team: prev.team.map((m) => {
        if (m.id === id) {
          updated = { ...m, ...updates };
          return updated;
        }
        return m;
      }),
    }));
    return updated;
  }, [persistChanges]);

  const deleteTeamMember = useCallback((id) => {
    const member = data.team.find((m) => m.id === id);
    const assignedTasks = data.tasks.filter((t) => t.assignedTo === id);
    if (assignedTasks.length > 0) {
      throw new Error(`Cannot delete ${member?.name || 'team member'} because they have ${assignedTasks.length} assigned task(s). Please reassign their tasks first.`);
    }

    persistChanges((prev) => ({
      ...prev,
      team: prev.team.filter((m) => m.id !== id),
      events: prev.events.map((e) => ({
        ...e,
        leadPhotographerId: e.leadPhotographerId === id ? null : e.leadPhotographerId,
        teamAssigned: Array.isArray(e.teamAssigned) ? e.teamAssigned.filter((tid) => tid !== id) : [],
      })),
    }));

    if (member) {
      logActivity('Studio Director', 'Team Member Removed', 'Team', member.name, `Removed team member profile for ${member.name}`, id);
    }
  }, [data.team, data.tasks, persistChanges, logActivity]);

  const deleteAllTeamMembers = useCallback(() => {
    const count = data.team.length;
    persistChanges((prev) => ({
      ...prev,
      team: [],
      // Safely unlink team member assignments in tasks and events
      tasks: prev.tasks.map((t) => ({ ...t, assignedTo: null })),
      events: prev.events.map((e) => ({ ...e, leadPhotographerId: null, teamAssigned: [] })),
    }));
    logActivity('Studio Director', 'All Team Members Removed', 'Team', 'All Team Members', `Removed all ${count} team members and safely cleared task assignments`);
    return count;
  }, [data.team.length, persistChanges, logActivity]);

  const getTeamMemberWorkload = useCallback((memberId) => {
    const memberTasks = data.tasks.filter((t) => t.assignedTo === memberId);
    const todayStr = new Date().toISOString().split('T')[0];

    const inProgressTasks = memberTasks.filter((t) => t.status === 'In Progress').length;
    const completedTasks = memberTasks.filter((t) => t.status === 'Completed' || t.status === 'Done').length;
    const overdueTasks = memberTasks.filter(
      (t) => t.status !== 'Completed' && t.status !== 'Done' && t.dueDate < todayStr
    ).length;

    const assignedProjectIds = new Set(
      memberTasks.filter((t) => t.projectId).map((t) => t.projectId)
    );

    return {
      totalTasks: memberTasks.length,
      inProgressTasks,
      completedTasks,
      overdueTasks,
      activeProjectsCount: assignedProjectIds.size,
      tasks: memberTasks,
    };
  }, [data.tasks]);

  // ==========================================
  // DELIVERABLES MUTATIONS & CLIENT APPROVAL SIMULATION
  // ==========================================
  const addDeliverable = useCallback((delivData) => {
    const id = `deliv-${Date.now()}`;
    const initialItems = Array.isArray(delivData.items) ? delivData.items : [];
    const totalPhotos = initialItems.length || Number(delivData.totalPhotos) || 10;
    const approvedPhotos = initialItems.filter((i) => i.status === 'Approved').length;
    const rejectedPhotos = initialItems.filter((i) => i.status === 'Revision Requested').length;
    const pendingPhotos = totalPhotos - approvedPhotos - rejectedPhotos;

    const newDeliverable = {
      ...delivData,
      id,
      title: (delivData.title || 'Client Proof Gallery').trim(),
      projectId: delivData.projectId,
      eventId: delivData.eventId || null,
      deliverableType: delivData.deliverableType || 'Preview Gallery',
      deliveryStage: delivData.deliveryStage || 'Client Selection',
      description: delivData.description || 'Curated high-resolution digital proof gallery.',
      totalPhotos,
      approvedPhotos,
      rejectedPhotos,
      pendingPhotos,
      clientApprovalStatus: delivData.clientApprovalStatus || (approvedPhotos === totalPhotos && totalPhotos > 0 ? 'Approved' : 'Pending Review'),
      shareLink: delivData.shareLink || `https://studioflow.gallery/proofs/${id}`,
      deadline: delivData.deadline || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString(),
      items: initialItems.length > 0 ? initialItems : [
        {
          id: `photo-${Date.now()}-1`,
          title: 'PROOF-001 — Master Shot.jpg',
          thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
          status: 'Pending',
          feedback: '',
          approvedAt: null,
          reviewedAt: null,
        },
        {
          id: `photo-${Date.now()}-2`,
          title: 'PROOF-002 — Editorial Detail.jpg',
          thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
          status: 'Pending',
          feedback: '',
          approvedAt: null,
          reviewedAt: null,
        },
      ],
    };

    persistChanges((prev) => ({
      ...prev,
      deliverables: [newDeliverable, ...prev.deliverables],
    }));

    logActivity('Studio Director', 'Deliverable Published', 'Deliverable', newDeliverable.title, `Published deliverable collection: ${newDeliverable.title}`, id);
    return newDeliverable;
  }, [persistChanges, logActivity]);

  const updateDeliverable = useCallback((id, updates) => {
    let updated = null;
    persistChanges((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((d) => {
        if (d.id === id) {
          updated = {
            ...d,
            ...updates,
            lastUpdated: new Date().toISOString(),
          };
          return updated;
        }
        return d;
      }),
    }));
    return updated;
  }, [persistChanges]);

  const deleteDeliverable = useCallback((id) => {
    const deliv = data.deliverables.find((d) => d.id === id);
    persistChanges((prev) => ({
      ...prev,
      deliverables: prev.deliverables.filter((d) => d.id !== id),
    }));
    if (deliv) {
      logActivity('Studio Director', 'Deliverable Deleted', 'Deliverable', deliv.title, `Removed deliverable collection: ${deliv.title}`, id);
    }
  }, [data.deliverables, persistChanges, logActivity]);

  const deleteAllDeliverables = useCallback(() => {
    const count = data.deliverables.length;
    persistChanges((prev) => ({
      ...prev,
      deliverables: [],
    }));
    logActivity('Studio Director', 'All Deliverables Deleted', 'Deliverables', 'All Collections', `Deleted all ${count} client deliverable collections`);
    return count;
  }, [data.deliverables.length, persistChanges, logActivity]);

  const deleteDeliverablesForProject = useCallback((projectId) => {
    let deletedCount = 0;
    persistChanges((prev) => {
      const remaining = prev.deliverables.filter((d) => d.projectId !== projectId);
      deletedCount = prev.deliverables.length - remaining.length;
      return {
        ...prev,
        deliverables: remaining,
      };
    });
    const proj = data.projects.find((p) => p.id === projectId);
    logActivity('Studio Director', 'Project Deliverables Deleted', 'Deliverables', proj?.title || 'Project Workspace', `Deleted all ${deletedCount} deliverables for ${proj?.title || 'workspace'}`);
    return deletedCount;
  }, [data.projects, data.deliverables, persistChanges, logActivity]);

  const updateDeliverableItemStatus = useCallback((deliverableId, photoIds, status, feedbackNote = '', reviewerName = 'Client Reviewer') => {
    const ids = Array.isArray(photoIds) ? photoIds : [photoIds];
    let updatedDeliverable = null;

    persistChanges((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((d) => {
        if (d.id === deliverableId) {
          const now = new Date().toISOString();
          const newItems = (d.items || []).map((item) => {
            if (ids.includes(item.id)) {
              return {
                ...item,
                status,
                feedback: status === 'Revision Requested'
                  ? (feedbackNote || item.feedback || '')
                  : (status === 'Approved' ? (item.feedback || '') : item.feedback),
                reviewedAt: now,
                approvedAt: status === 'Approved' ? now : null,
              };
            }
            return item;
          });

          const totalPhotos = newItems.length;
          const approvedPhotos = newItems.filter((i) => i.status === 'Approved').length;
          const rejectedPhotos = newItems.filter((i) => i.status === 'Revision Requested').length;
          const pendingPhotos = newItems.filter((i) => i.status === 'Pending').length;

          let clientApprovalStatus = d.clientApprovalStatus || 'In Review';
          if (totalPhotos > 0 && approvedPhotos === totalPhotos) {
            clientApprovalStatus = d.finalApproval ? 'Approved' : 'Ready for Final Sign-off';
          } else if (rejectedPhotos > 0) {
            clientApprovalStatus = 'Revisions Requested';
          } else if (approvedPhotos > 0) {
            clientApprovalStatus = 'Partially Approved';
          } else {
            clientApprovalStatus = 'In Review';
          }

          // If any spread has revisions requested or resets to pending, prior finalApproval is invalidated
          const finalApproval = (rejectedPhotos > 0 || pendingPhotos > 0) ? null : d.finalApproval;

          updatedDeliverable = {
            ...d,
            items: newItems,
            totalPhotos,
            approvedPhotos,
            rejectedPhotos,
            pendingPhotos,
            clientApprovalStatus,
            finalApproval,
            lastUpdated: now,
          };
          return updatedDeliverable;
        }
        return d;
      }),
    }));

    if (updatedDeliverable) {
      logActivity(
        reviewerName,
        `Proof ${status}`,
        'Deliverable',
        updatedDeliverable.title,
        `Marked ${ids.length} spread/photo(s) as "${status}" in ${updatedDeliverable.title}`,
        deliverableId
      );
    }
    return updatedDeliverable;
  }, [persistChanges, logActivity]);

  const publishProofForReview = useCallback((deliverableId) => {
    let updated = null;
    const now = new Date().toISOString();
    persistChanges((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((d) => {
        if (d.id === deliverableId) {
          const currentVer = d.proofVersion || d.version || 1;
          const status = currentVer > 1 ? 'Revised Proof Awaiting Review' : 'In Review';
          updated = {
            ...d,
            clientApprovalStatus: status,
            deliveryStage: 'Client Review',
            publishedForReviewAt: now,
            lastUpdated: now,
          };
          return updated;
        }
        return d;
      }),
    }));
    if (updated) {
      logActivity('Studio Director', 'Proof Published for Review', 'Deliverable', updated.title, `Made "${updated.title}" available on client review portal.`, deliverableId);
    }
    return updated;
  }, [persistChanges, logActivity]);

  const submitSpreadReview = useCallback((deliverableId, itemId, status, feedbackNote = '', reviewerName = 'Client Reviewer') => {
    return updateDeliverableItemStatus(deliverableId, [itemId], status, feedbackNote, reviewerName);
  }, [updateDeliverableItemStatus]);

  const submitFinalAlbumApproval = useCallback((deliverableId, signoffName = '', remarks = '') => {
    const trimmedName = (signoffName || '').trim();
    if (!trimmedName) {
      throw new Error('Authorized client sign-off name is required for final album approval.');
    }

    let updated = null;
    const now = new Date().toISOString();
    persistChanges((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((d) => {
        if (d.id === deliverableId) {
          if (d.clientApprovalStatus === 'Approved') {
            throw new Error('This album proof has already been granted final approval.');
          }

          const items = d.items || [];
          const hasUnresolved = items.some((item) => item.status !== 'Approved');
          if (hasUnresolved) {
            throw new Error('Cannot grant final album approval: all spreads must be reviewed and approved first.');
          }

          updated = {
            ...d,
            clientApprovalStatus: 'Approved',
            deliveryStage: 'Final Handover',
            finalApproval: {
              approvedBy: trimmedName,
              approvedAt: now,
              remarks: (remarks || '').trim(),
            },
            lastUpdated: now,
          };
          return updated;
        }
        return d;
      }),
    }));
    if (updated) {
      logActivity(
        trimmedName,
        'Final Album Approval Granted',
        'Deliverable',
        updated.title,
        `Client ${trimmedName} granted final album approval for "${updated.title}". Signoff recorded.`,
        deliverableId
      );
    }
    return updated;
  }, [persistChanges, logActivity]);

  const resubmitRevisedProof = useCallback((deliverableId, studioNotes = '') => {
    let updated = null;
    const now = new Date().toISOString();
    persistChanges((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((d) => {
        if (d.id === deliverableId) {
          const hasRevisionsRequested = (d.items || []).some((item) => item.status === 'Revision Requested');
          if (!hasRevisionsRequested) {
            throw new Error('No pending revision requests found on this proof to resubmit.');
          }

          const currentVer = d.proofVersion || d.version || 1;
          const nextVersion = currentVer + 1;
          const newItems = (d.items || []).map((item) => {
            if (item.status === 'Revision Requested') {
              const prevHistory = item.revisionHistory || [];
              return {
                ...item,
                status: 'Pending',
                feedback: '',
                revisionHistory: [
                  ...prevHistory,
                  {
                    version: currentVer,
                    feedback: item.feedback,
                    addressedAt: now,
                    studioNotes: studioNotes.trim(),
                  },
                ],
              };
            }
            return item;
          });

          const totalPhotos = newItems.length;
          const approvedPhotos = newItems.filter((i) => i.status === 'Approved').length;
          const rejectedPhotos = newItems.filter((i) => i.status === 'Revision Requested').length;
          const pendingPhotos = newItems.filter((i) => i.status === 'Pending').length;

          updated = {
            ...d,
            version: nextVersion,
            proofVersion: nextVersion,
            items: newItems,
            totalPhotos,
            approvedPhotos,
            rejectedPhotos,
            pendingPhotos,
            clientApprovalStatus: 'Revised Proof Awaiting Review',
            deliveryStage: 'Client Review',
            finalApproval: null, // Ensure approval of v1 cannot count as approval of v2
            lastUpdated: now,
          };
          return updated;
        }
        return d;
      }),
    }));
    if (updated) {
      logActivity(
        'Studio Director',
        'Revised Proof Resubmitted',
        'Deliverable',
        updated.title,
        `Resubmitted revised layout proof v${updated.version} for "${updated.title}". Changes addressed.`,
        deliverableId
      );
    }
    return updated;
  }, [persistChanges, logActivity]);

  const markDeliverableReadyForDelivery = useCallback((deliverableId) => {
    let updated = null;
    persistChanges((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((d) => {
        if (d.id === deliverableId) {
          if (d.clientApprovalStatus !== 'Approved') {
            throw new Error('Deliverable cannot be marked ready for delivery without client sign-off approval.');
          }
          updated = {
            ...d,
            deliveryStage: 'Ready for Delivery',
            lastUpdated: new Date().toISOString(),
          };
          return updated;
        }
        return d;
      }),
    }));
    if (updated) {
      logActivity('Studio Director', 'Album Ready for Delivery', 'Deliverable', updated.title, `Marked "${updated.title}" ready for bindery print delivery.`, deliverableId);
    }
    return updated;
  }, [persistChanges, logActivity]);

  const markDeliverableDelivered = useCallback((deliverableId) => {
    let updated = null;
    const now = new Date().toISOString();
    persistChanges((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((d) => {
        if (d.id === deliverableId) {
          if (d.deliveryStage !== 'Ready for Delivery' && d.deliveryStage !== 'Final Handover') {
            throw new Error('Deliverable must be ready for delivery before marking as delivered.');
          }
          updated = {
            ...d,
            deliveryStage: 'Delivered',
            deliveredAt: now,
            lastUpdated: now,
          };
          return updated;
        }
        return d;
      }),
    }));
    if (updated) {
      logActivity('Studio Director', 'Deliverable Handed Over', 'Deliverable', updated.title, `Handed over "${updated.title}" to client.`, deliverableId);
    }
    return updated;
  }, [persistChanges, logActivity]);

  // ==========================================
  // PAYMENT & INVOICE MUTATIONS
  // ==========================================
  const addPayment = useCallback((payment) => {
    const id = `pay-${Date.now()}`;
    const invoiceNum = payment.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newPayment = {
      ...payment,
      id,
      invoiceNumber: invoiceNum,
      status: payment.status || 'Pending',
      amount: Number(payment.amount) || 0,
      taxRate: payment.taxRate !== undefined ? Number(payment.taxRate) : 18,
      lineItems: payment.lineItems || [
        {
          description: payment.description || 'Photography Services & Master Deliverables',
          quantity: 1,
          rate: Number(payment.amount) || 0,
          amount: Number(payment.amount) || 0,
        },
      ],
      paymentHistory: payment.paymentHistory || (payment.status === 'Paid' ? [
        {
          id: `tx-${Date.now()}`,
          amount: Number(payment.amount) || 0,
          paymentDate: payment.paidDate || new Date().toISOString().split('T')[0],
          method: payment.paymentMethod || 'UPI / Bank Transfer',
          reference: payment.referenceNumber || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
          note: payment.notes || 'Full settlement on invoice creation',
        },
      ] : []),
    };

    persistChanges((prev) => ({
      ...prev,
      payments: [newPayment, ...prev.payments],
    }));

    logActivity('Studio Director', 'Invoice Generated', 'Payment', newPayment.invoiceNumber, `Generated invoice for ₹${newPayment.amount.toLocaleString('en-IN')}`, id);
    return newPayment;
  }, [persistChanges, logActivity]);

  const updatePayment = useCallback((id, updates) => {
    let updated = null;
    persistChanges((prev) => ({
      ...prev,
      payments: prev.payments.map((p) => {
        if (p.id === id) {
          updated = {
            ...p,
            ...updates,
            amount: updates.amount !== undefined ? Number(updates.amount) : p.amount,
          };
          return updated;
        }
        return p;
      }),
    }));
    return updated;
  }, [persistChanges]);

  const deletePayment = useCallback((id) => {
    const p = data.payments.find((pay) => pay.id === id);
    persistChanges((prev) => ({
      ...prev,
      payments: prev.payments.filter((pay) => pay.id !== id),
    }));
    if (p) {
      logActivity('Studio Director', 'Invoice Removed', 'Payment', p.invoiceNumber, `Cancelled invoice ${p.invoiceNumber}`, id);
    }
  }, [data.payments, persistChanges, logActivity]);

  const deleteAllPayments = useCallback(() => {
    const count = data.payments.length;
    persistChanges((prev) => ({
      ...prev,
      payments: [],
    }));
    logActivity('Studio Director', 'All Payments Deleted', 'Payments', 'All Invoices & Payments', `Deleted all ${count} payment records and tax invoices`);
    return count;
  }, [data.payments.length, persistChanges, logActivity]);

  const recordEventPayment = useCallback((eventId, paymentData) => {
    const event = data.events.find((e) => e.id === eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const numAmount = Number(paymentData.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Payment amount must be greater than ₹0');
    }

    // Verify amount does not exceed remaining contracted balance
    const agreedPrice = Number(event.packageValue) || 0;
    const existingPaid = data.payments
      .filter((p) => p.eventId === eventId && (p.status === 'Paid' || p.status === 'Completed' || p.status === 'Received'))
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const remainingBalance = Math.max(0, agreedPrice - existingPaid);

    // If paying against a specific invoice, also check that invoice
    if (paymentData.invoiceId) {
      const invoice = data.payments.find((p) => p.id === paymentData.invoiceId);
      if (invoice) {
        const history = Array.isArray(invoice.paymentHistory) ? invoice.paymentHistory : [];
        let currentPaid = history.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        if (currentPaid === 0 && invoice.status === 'Paid') currentPaid = invoice.amount;
        const remainingInvoiceBalance = Math.max(0, invoice.amount - currentPaid);
        if (numAmount > remainingInvoiceBalance) {
          throw new Error(`Payment amount (₹${numAmount.toLocaleString('en-IN')}) exceeds remaining balance due on this invoice (₹${remainingInvoiceBalance.toLocaleString('en-IN')}).`);
        }

        const txId = `tx-${Date.now()}`;
        const newTx = {
          id: txId,
          amount: numAmount,
          paymentDate: paymentData.paidDate || new Date().toISOString().split('T')[0],
          method: paymentData.paymentMethod || 'UPI / Bank Transfer',
          reference: paymentData.referenceNumber || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
          note: paymentData.description || 'Payment applied to invoice',
        };

        const updatedHistory = [...(invoice.paymentHistory || []), newTx];
        const totalTx = updatedHistory.reduce((s, t) => s + (Number(t.amount) || 0), 0);
        const newStatus = totalTx >= invoice.amount ? 'Paid' : 'Partially Paid';

        persistChanges((prev) => ({
          ...prev,
          payments: prev.payments.map((p) => (p.id === invoice.id ? {
            ...p,
            status: newStatus,
            paidDate: newStatus === 'Paid' ? (paymentData.paidDate || new Date().toISOString().split('T')[0]) : p.paidDate,
            paymentMethod: paymentData.paymentMethod || p.paymentMethod,
            referenceNumber: paymentData.referenceNumber || p.referenceNumber,
            paymentHistory: updatedHistory,
          } : p)),
        }));

        logActivity('Studio Director', 'Payment Received', 'Payment', invoice.invoiceNumber, `Recorded payment of ₹${numAmount.toLocaleString('en-IN')} for invoice ${invoice.invoiceNumber}`, invoice.id);
        return invoice;
      }
    }

    if (numAmount > remainingBalance) {
      throw new Error(
        remainingBalance === 0
          ? 'This booking has already been fully paid.'
          : `Payment amount (₹${numAmount.toLocaleString('en-IN')}) exceeds remaining contracted balance of ₹${remainingBalance.toLocaleString('en-IN')}.`
      );
    }

    // Create a new payment/milestone record
    const payId = `pay-${Date.now()}`;
    const invoiceNumber = paymentData.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const paidDate = paymentData.status === 'Paid' ? (paymentData.paidDate || new Date().toISOString().split('T')[0]) : null;

    const newPayment = {
      id: payId,
      invoiceNumber,
      clientId: event.clientId,
      eventId: eventId,
      projectId: paymentData.projectId || null,
      description: paymentData.description || `Payment installment for ${event.title}`,
      amount: numAmount,
      type: paymentData.type || 'Interim Milestone',
      status: paymentData.status || 'Paid',
      dueDate: paymentData.dueDate || new Date().toISOString().split('T')[0],
      paidDate,
      paymentMethod: paymentData.paymentMethod || 'UPI / Bank Transfer',
      referenceNumber: paymentData.referenceNumber || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      taxRate: 18,
      lineItems: [
        {
          description: paymentData.description || `Milestone payment for ${event.title}`,
          quantity: 1,
          rate: numAmount,
          amount: numAmount,
        },
      ],
      paymentHistory: paymentData.status === 'Paid' ? [
        {
          id: `tx-${Date.now()}`,
          amount: numAmount,
          paymentDate: paidDate || new Date().toISOString().split('T')[0],
          method: paymentData.paymentMethod || 'UPI / Bank Transfer',
          reference: paymentData.referenceNumber || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
          note: paymentData.description || 'Recorded installment',
        },
      ] : [],
      notes: paymentData.notes || '',
    };

    persistChanges((prev) => ({
      ...prev,
      payments: [newPayment, ...prev.payments],
    }));

    logActivity('Studio Director', 'Payment Received', 'Payment', newPayment.invoiceNumber, `Recorded payment of ₹${numAmount.toLocaleString('en-IN')} for ${event.title}`, payId);
    return newPayment;
  }, [data.events, data.payments, data.settings, persistChanges, logActivity]);

  // ==========================================
  // SETTINGS MUTATIONS
  // ==========================================
  const updateSettings = useCallback((updates) => {
    let updatedSettings = null;
    persistChanges((prev) => {
      updatedSettings = {
        ...prev.settings,
        ...updates,
        taxRate: updates.taxRate !== undefined ? Number(updates.taxRate) : (prev.settings?.taxRate ?? 18),
      };
      return {
        ...prev,
        settings: updatedSettings,
      };
    });
    logActivity('Studio Director', 'Settings Updated', 'Settings', updatedSettings?.studioName || 'Studio Preferences', 'Updated studio profile, tax configuration, or branding');
    return updatedSettings;
  }, [persistChanges, logActivity]);

  // ==========================================
  // HELPER GETTERS & FINANCIAL CALCULATIONS
  // ==========================================
  const getClient = useCallback((id) => data.clients.find((c) => c.id === id), [data.clients]);
  const getEvent = useCallback((id) => data.events.find((e) => e.id === id), [data.events]);
  const getProject = useCallback((id) => data.projects.find((p) => p.id === id), [data.projects]);
  const getTask = useCallback((id) => data.tasks.find((t) => t.id === id), [data.tasks]);
  const getTeamMember = useCallback((id) => data.team.find((tm) => tm.id === id), [data.team]);
  const getInvoice = useCallback((id) => data.payments.find((p) => p.id === id || p.invoiceNumber === id), [data.payments]);
  const getDeliverable = useCallback((id) => data.deliverables.find((d) => d.id === id), [data.deliverables]);
  const getDeliverablesByProject = useCallback((projectId) => data.deliverables.filter((d) => d.projectId === projectId), [data.deliverables]);

  const getEventsByClient = useCallback((clientId) => data.events.filter((e) => e.clientId === clientId), [data.events]);
  const getProjectsByClient = useCallback((clientId) => data.projects.filter((p) => p.clientId === clientId), [data.projects]);
  const getTasksByProject = useCallback((projectId) => data.tasks.filter((t) => t.projectId === projectId), [data.tasks]);
  const getPaymentsByClient = useCallback((clientId) => data.payments.filter((p) => p.clientId === clientId), [data.payments]);
  const getPaymentsByProject = useCallback((projectId) => data.payments.filter((p) => p.projectId === projectId), [data.payments]);

  const getEventFinancials = useCallback((eventId) => {
    const event = data.events.find((e) => e.id === eventId);
    const agreedPrice = Number(event?.packageValue) || 0;
    const eventPayments = data.payments.filter((p) => p.eventId === eventId);
    const amountReceived = eventPayments
      .filter((p) => p.status === 'Paid' || p.status === 'Completed' || p.status === 'Received')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const outstandingBalance = Math.max(0, agreedPrice - amountReceived);

    let paymentStatus = 'Unpaid';
    if (agreedPrice > 0 && amountReceived >= agreedPrice) {
      paymentStatus = 'Paid';
    } else if (amountReceived > 0) {
      paymentStatus = 'Partially Paid';
    }

    return {
      agreedPrice,
      amountReceived,
      outstandingBalance,
      paymentStatus,
      payments: eventPayments,
    };
  }, [data.events, data.payments]);

  const getClientFinancials = useCallback((clientId) => {
    const clientEvents = data.events.filter((e) => e.clientId === clientId);
    const totalAgreed = clientEvents.reduce((sum, e) => sum + (Number(e.packageValue) || 0), 0);
    const clientPayments = data.payments.filter((p) => p.clientId === clientId);
    const totalReceived = clientPayments
      .filter((p) => p.status === 'Paid' || p.status === 'Completed' || p.status === 'Received')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const outstandingBalance = Math.max(0, totalAgreed - totalReceived);

    return {
      totalAgreed,
      totalReceived,
      outstandingBalance,
      eventsCount: clientEvents.length,
      payments: clientPayments,
    };
  }, [data.events, data.payments]);

  // Dynamic dashboard metrics
  const metrics = useMemo(() => {
    const totalRevenue = data.payments
      .filter((p) => p.status === 'Paid')
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    const pendingRevenue = data.payments
      .filter((p) => p.status === 'Pending')
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    const totalOutstanding = data.events.reduce((sum, e) => {
      const agreed = Number(e.packageValue) || 0;
      const received = data.payments
        .filter((p) => p.eventId === e.id && (p.status === 'Paid' || p.status === 'Completed'))
        .reduce((s, p) => s + (Number(p.amount) || 0), 0);
      return sum + Math.max(0, agreed - received);
    }, 0);

    const activeProjectsCount = data.projects.filter((p) => p.status !== 'Completed').length;
    const pendingTasksCount = data.tasks.filter((t) => t.status !== 'Completed' && t.status !== 'Done').length;
    const totalClientsCount = data.clients.length;
    const upcomingEventsCount = data.events.filter((e) => e.status !== 'Completed' && e.status !== 'Cancelled').length;

    return {
      totalRevenue,
      pendingRevenue,
      totalOutstanding,
      activeProjectsCount,
      pendingTasksCount,
      totalClientsCount,
      upcomingEventsCount,
    };
  }, [data.payments, data.projects, data.tasks, data.clients, data.events]);

  // Centralized report analytics helper
  const getReportData = useCallback((dateRange = 'all') => {
    const now = new Date();
    let filterFn = () => true;

    if (dateRange === '30days') {
      const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filterFn = (d) => d && new Date(d) >= cutoff;
    } else if (dateRange === '90days') {
      const cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      filterFn = (d) => d && new Date(d) >= cutoff;
    } else if (dateRange === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      filterFn = (d) => d && new Date(d) >= startOfYear;
    }

    const inScopePayments = data.payments.filter((p) => filterFn(p.paidDate || p.dueDate || p.createdAt));
    const inScopeEvents = data.events.filter((e) => filterFn(e.startDate || e.createdAt));
    const inScopeProjects = data.projects.filter((p) => filterFn(p.shootDate || p.deliveryDeadline || p.createdAt));
    const inScopeTasks = data.tasks.filter((t) => filterFn(t.dueDate || t.createdAt));
    const inScopeDeliverables = data.deliverables.filter((d) => filterFn(d.deadline || d.lastUpdated));

    const contractedValue = inScopeEvents.reduce((sum, e) => sum + (Number(e.packageValue) || 0), 0);
    const paymentsReceived = inScopePayments
      .filter((p) => p.status === 'Paid')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const outstandingBalance = Math.max(0, contractedValue - paymentsReceived);

    const completedProjects = inScopeProjects.filter((p) => p.status === 'Completed').length;
    const projectCompletionRate = inScopeProjects.length > 0 ? Math.round((completedProjects / inScopeProjects.length) * 100) : 0;

    const deliverablesAwaitingApproval = inScopeDeliverables.filter(
      (d) => d.clientApprovalStatus !== 'Approved'
    ).length;

    const completedTasksCount = inScopeTasks.filter((t) => t.status === 'Completed' || t.status === 'Done').length;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenueMap = {};
    inScopePayments
      .filter((p) => p.status === 'Paid' && p.paidDate)
      .forEach((p) => {
        const d = new Date(p.paidDate);
        const key = `${monthNames[d.getMonth()]}`;
        monthlyRevenueMap[key] = (monthlyRevenueMap[key] || 0) + Number(p.amount);
      });

    // Preset standard order for clean chart
    const standardMonths = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueOverTime = standardMonths.map((m) => ({
      month: m,
      revenue: monthlyRevenueMap[m] || 0,
    }));

    // Event types breakdown
    const eventTypeMap = {};
    inScopeEvents.forEach((e) => {
      const type = e.eventType || 'Other';
      eventTypeMap[type] = (eventTypeMap[type] || 0) + 1;
    });
    const bookingsByEventType = Object.keys(eventTypeMap).map((type) => ({
      name: type,
      value: eventTypeMap[type],
    }));

    // Payment status breakdown
    const todayStr = new Date().toISOString().split('T')[0];
    const paymentStatusMap = { Paid: 0, Pending: 0, Overdue: 0 };
    inScopePayments.forEach((p) => {
      if (p.status === 'Paid') {
        paymentStatusMap.Paid += 1;
      } else if (p.dueDate && p.dueDate < todayStr) {
        paymentStatusMap.Overdue += 1;
      } else {
        paymentStatusMap.Pending += 1;
      }
    });
    const paymentStatusBreakdown = [
      { name: 'Paid', value: paymentStatusMap.Paid, color: '#6F816B' },
      { name: 'Pending', value: paymentStatusMap.Pending, color: '#D99B26' },
      { name: 'Overdue', value: paymentStatusMap.Overdue, color: '#C94A4A' },
    ];

    // Project status distribution
    const projectStatusMap = {};
    inScopeProjects.forEach((p) => {
      projectStatusMap[p.status] = (projectStatusMap[p.status] || 0) + 1;
    });
    const projectStatusDistribution = Object.keys(projectStatusMap).map((st) => ({
      name: st,
      value: projectStatusMap[st],
    }));

    // Task completion overview
    const taskCompletionOverview = [
      { name: 'Completed', value: inScopeTasks.filter((t) => t.status === 'Completed' || t.status === 'Done').length, color: '#6F816B' },
      { name: 'In Progress', value: inScopeTasks.filter((t) => t.status === 'In Progress').length, color: '#B96F52' },
      { name: 'To Do', value: inScopeTasks.filter((t) => t.status === 'To Do' || t.status === 'Pending').length, color: '#7B7873' },
    ];

    // Approval pipeline
    const approvalMap = {
      Approved: inScopeDeliverables.filter((d) => d.clientApprovalStatus === 'Approved').length,
      'In Review': inScopeDeliverables.filter((d) => d.clientApprovalStatus === 'In Review' || d.clientApprovalStatus === 'Partially Approved').length,
      'Revisions Requested': inScopeDeliverables.filter((d) => d.clientApprovalStatus === 'Revisions Requested').length,
      'Pending Review': inScopeDeliverables.filter((d) => d.clientApprovalStatus === 'Pending' || d.clientApprovalStatus === 'Pending Review').length,
    };
    const approvalPipeline = Object.keys(approvalMap).map((status) => ({
      name: status,
      value: approvalMap[status],
    }));

    return {
      totalClients: data.clients.length,
      bookedEvents: inScopeEvents.length,
      contractedValue,
      paymentsReceived,
      outstandingBalance,
      projectCompletionRate,
      deliverablesAwaitingApproval,
      tasksCompleted: completedTasksCount,
      revenueOverTime,
      bookingsByEventType,
      paymentStatusBreakdown,
      projectStatusDistribution,
      taskCompletionOverview,
      approvalPipeline,
    };
  }, [data]);

  // Global search helper
  const searchAll = useCallback((query) => {
    if (!query || !query.trim()) {
      return { clients: [], events: [], projects: [], tasks: [], team: [] };
    }
    const q = query.toLowerCase().trim();

    const matchedClients = data.clients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.location?.toLowerCase().includes(q)
    );
    const matchedEvents = data.events.filter(
      (e) => e.title.toLowerCase().includes(q) || e.venue?.toLowerCase().includes(q) || e.eventType?.toLowerCase().includes(q)
    );
    const matchedProjects = data.projects.filter(
      (p) => p.title.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q) || p.tags?.some((t) => t.toLowerCase().includes(q))
    );
    const matchedTasks = data.tasks.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q)
    );
    const matchedTeam = data.team.filter((tm) => tm.name.toLowerCase().includes(q) || tm.role.toLowerCase().includes(q));

    return {
      clients: matchedClients,
      events: matchedEvents,
      projects: matchedProjects,
      tasks: matchedTasks,
      team: matchedTeam,
    };
  }, [data]);

  const contextValue = useMemo(() => ({
    isInitialized,
    clients: data.clients,
    events: data.events,
    projects: data.projects,
    tasks: data.tasks,
    team: data.team,
    deliverables: data.deliverables,
    payments: data.payments,
    projectNotes: data.projectNotes || [],
    activityLog: data.activityLog,
    settings: data.settings,
    metrics,
    // client mutations
    addClient,
    updateClient,
    deleteClient,
    deleteAllClients,
    // event mutations
    addEvent,
    updateEvent,
    deleteEvent,
    deleteAllEvents,
    // project mutations
    addProject,
    updateProject,
    deleteProject,
    deleteAllProjects,
    createProjectForEvent,
    getProjectProgress,
    // task mutations
    addTask,
    updateTask,
    deleteTask,
    deleteAllTasks,
    deleteTasksForProject,
    toggleTaskComplete,
    reassignTask,
    // project notes mutations
    addProjectNote,
    updateProjectNote,
    deleteProjectNote,
    deleteAllProjectNotes,
    deleteNotesForProject,
    getNotesByProject,
    // team mutations & workload
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    deleteAllTeamMembers,
    getTeamMemberWorkload,
    // deliverables mutations
    addDeliverable,
    updateDeliverable,
    deleteDeliverable,
    deleteAllDeliverables,
    deleteDeliverablesForProject,
    updateDeliverableItemStatus,
    publishProofForReview,
    submitSpreadReview,
    submitFinalAlbumApproval,
    resubmitRevisedProof,
    markDeliverableReadyForDelivery,
    markDeliverableDelivered,
    getDeliverablesByProject,
    // payment & invoice mutations
    addPayment,
    recordEventPayment,
    updatePayment,
    deletePayment,
    deleteAllPayments,
    // settings
    updateSettings,
    // reset & activity
    resetDemoData,
    logActivity,
    clearActivityLog,
    // queries & financial calculations
    getClient,
    getEvent,
    getProject,
    getTask,
    getTeamMember,
    getInvoice,
    getDeliverable,
    getEventsByClient,
    getProjectsByClient,
    getTasksByProject,
    getPaymentsByClient,
    getPaymentsByProject,
    getEventFinancials,
    getClientFinancials,
    getReportData,
    searchAll,
  }), [
    isInitialized,
    data,
    metrics,
    addClient,
    updateClient,
    deleteClient,
    deleteAllClients,
    addEvent,
    updateEvent,
    deleteEvent,
    deleteAllEvents,
    addProject,
    updateProject,
    deleteProject,
    deleteAllProjects,
    createProjectForEvent,
    getProjectProgress,
    addTask,
    updateTask,
    deleteTask,
    deleteAllTasks,
    deleteTasksForProject,
    toggleTaskComplete,
    reassignTask,
    addProjectNote,
    updateProjectNote,
    deleteProjectNote,
    deleteAllProjectNotes,
    deleteNotesForProject,
    getNotesByProject,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    deleteAllTeamMembers,
    getTeamMemberWorkload,
    addDeliverable,
    updateDeliverable,
    deleteDeliverable,
    deleteAllDeliverables,
    deleteDeliverablesForProject,
    updateDeliverableItemStatus,
    publishProofForReview,
    submitSpreadReview,
    submitFinalAlbumApproval,
    resubmitRevisedProof,
    markDeliverableReadyForDelivery,
    markDeliverableDelivered,
    getDeliverablesByProject,
    addPayment,
    recordEventPayment,
    updatePayment,
    deletePayment,
    deleteAllPayments,
    updateSettings,
    resetDemoData,
    logActivity,
    clearActivityLog,
    getClient,
    getEvent,
    getProject,
    getTask,
    getTeamMember,
    getInvoice,
    getDeliverable,
    getEventsByClient,
    getProjectsByClient,
    getTasksByProject,
    getPaymentsByClient,
    getPaymentsByProject,
    getEventFinancials,
    getClientFinancials,
    getReportData,
    searchAll,
  ]);

  return (
    <StudioDataContext.Provider value={contextValue}>
      {children}
    </StudioDataContext.Provider>
  );
}

export function useStudioData() {
  const context = useContext(StudioDataContext);
  if (!context) {
    throw new Error('useStudioData must be used within a StudioDataProvider');
  }
  return context;
}
