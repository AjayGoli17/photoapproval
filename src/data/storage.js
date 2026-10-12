import {
  INITIAL_CLIENTS,
  INITIAL_EVENTS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_TEAM,
  INITIAL_DELIVERABLES,
  INITIAL_PAYMENTS,
  INITIAL_ACTIVITY_LOG,
  INITIAL_SETTINGS,
  INITIAL_PROJECT_NOTES,
} from './seedData.js';

const STORAGE_KEY = 'studioflow_demo_data_v2';
const LEGACY_STORAGE_KEY = 'studioflow_demo_data_v1';

// Legacy seed IDs used to differentiate original sample data from user-created records
const LEGACY_SEED_IDS = {
  clients: new Set(['client-1', 'client-2', 'client-3', 'client-4', 'client-5']),
  events: new Set(['event-1', 'event-2', 'event-3', 'event-4', 'event-5']),
  projects: new Set(['proj-1', 'proj-2', 'proj-3', 'proj-4', 'proj-5']),
  tasks: new Set(['task-1', 'task-2', 'task-3', 'task-4', 'task-5', 'task-6', 'task-7']),
  team: new Set(['team-1', 'team-2', 'team-3', 'team-4', 'team-5']),
  deliverables: new Set(['deliv-1', 'deliv-2', 'deliv-3', 'deliv-4', 'deliv-5']),
  payments: new Set(['pay-1', 'pay-2', 'pay-3', 'pay-4', 'pay-5', 'pay-6']),
  projectNotes: new Set(['note-1', 'note-2', 'note-3', 'note-4']),
};

export function getInitialData() {
  return {
    version: '2.0',
    clients: JSON.parse(JSON.stringify(INITIAL_CLIENTS)),
    events: JSON.parse(JSON.stringify(INITIAL_EVENTS)),
    projects: JSON.parse(JSON.stringify(INITIAL_PROJECTS)),
    tasks: JSON.parse(JSON.stringify(INITIAL_TASKS)),
    team: JSON.parse(JSON.stringify(INITIAL_TEAM)),
    deliverables: JSON.parse(JSON.stringify(INITIAL_DELIVERABLES)),
    payments: JSON.parse(JSON.stringify(INITIAL_PAYMENTS)),
    projectNotes: JSON.parse(JSON.stringify(INITIAL_PROJECT_NOTES)),
    activityLog: JSON.parse(JSON.stringify(INITIAL_ACTIVITY_LOG)),
    settings: JSON.parse(JSON.stringify(INITIAL_SETTINGS)),
    lastUpdated: new Date().toISOString(),
  };
}

export function loadStoredData() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return getInitialData();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check if user had custom-created records in legacy storage key
      const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        try {
          const parsedLegacy = JSON.parse(legacyRaw);
          if (parsedLegacy && typeof parsedLegacy === 'object') {
            const userClients = (parsedLegacy.clients || []).filter((c) => !LEGACY_SEED_IDS.clients.has(c.id));
            const userEvents = (parsedLegacy.events || []).filter((e) => !LEGACY_SEED_IDS.events.has(e.id));
            const userProjects = (parsedLegacy.projects || []).filter((p) => !LEGACY_SEED_IDS.projects.has(p.id));
            const userTasks = (parsedLegacy.tasks || []).filter((t) => !LEGACY_SEED_IDS.tasks.has(t.id));
            const userTeam = (parsedLegacy.team || []).filter((tm) => !LEGACY_SEED_IDS.team.has(tm.id));
            const userDeliverables = (parsedLegacy.deliverables || []).filter((d) => !LEGACY_SEED_IDS.deliverables.has(d.id));
            const userPayments = (parsedLegacy.payments || []).filter((p) => !LEGACY_SEED_IDS.payments.has(p.id));
            const userNotes = (parsedLegacy.projectNotes || []).filter((n) => !LEGACY_SEED_IDS.projectNotes.has(n.id));

            const hasUserCreatedData =
              userClients.length > 0 ||
              userEvents.length > 0 ||
              userProjects.length > 0 ||
              userTasks.length > 0 ||
              userTeam.length > 0 ||
              userDeliverables.length > 0 ||
              userPayments.length > 0 ||
              userNotes.length > 0;

            if (hasUserCreatedData) {
              const initialWithUserData = getInitialData();
              initialWithUserData.clients.push(...userClients);
              initialWithUserData.events.push(...userEvents);
              initialWithUserData.projects.push(...userProjects);
              initialWithUserData.tasks.push(...userTasks);
              initialWithUserData.team.push(...userTeam);
              initialWithUserData.deliverables.push(...userDeliverables);
              initialWithUserData.payments.push(...userPayments);
              initialWithUserData.projectNotes.push(...userNotes);

              saveStoredData(initialWithUserData);
              return initialWithUserData;
            }
          }
        } catch (legacyErr) {
          console.warn('Error reading legacy storage data:', legacyErr);
        }
      }

      const initial = getInitialData();
      saveStoredData(initial);
      return initial;
    }

    const parsed = JSON.parse(raw);
    // Graceful check for essential properties
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !Array.isArray(parsed.clients) ||
      !Array.isArray(parsed.events) ||
      !Array.isArray(parsed.projects) ||
      !Array.isArray(parsed.tasks)
    ) {
      console.warn('Malformed demo data detected in localStorage. Reinitializing with defaults.');
      const initial = getInitialData();
      saveStoredData(initial);
      return initial;
    }

    if (!Array.isArray(parsed.projectNotes)) {
      parsed.projectNotes = JSON.parse(JSON.stringify(INITIAL_PROJECT_NOTES));
    }

    // Ensure deliverables is populated
    if (!Array.isArray(parsed.deliverables)) {
      parsed.deliverables = JSON.parse(JSON.stringify(INITIAL_DELIVERABLES));
    }

    // Ensure payments lineItems is populated
    if (Array.isArray(parsed.payments)) {
      parsed.payments = parsed.payments.map((p) => {
        const seedMatch = INITIAL_PAYMENTS.find((sp) => sp.id === p.id);
        if (!Array.isArray(p.lineItems) && seedMatch?.lineItems) {
          return {
            ...seedMatch,
            ...p,
            lineItems: JSON.parse(JSON.stringify(seedMatch.lineItems)),
            paymentHistory: p.paymentHistory || seedMatch.paymentHistory || [],
          };
        }
        return p;
      });
    }

    // Ensure settings has all default properties including taxRate
    if (!parsed.settings || typeof parsed.settings !== 'object') {
      parsed.settings = JSON.parse(JSON.stringify(INITIAL_SETTINGS));
    } else {
      parsed.settings = {
        ...JSON.parse(JSON.stringify(INITIAL_SETTINGS)),
        ...parsed.settings,
      };
    }

    // Ensure activityLog exists
    if (!Array.isArray(parsed.activityLog)) {
      parsed.activityLog = JSON.parse(JSON.stringify(INITIAL_ACTIVITY_LOG));
    }

    return parsed;
  } catch (error) {
    console.error('Failed to parse StudioFlow data from localStorage:', error);
    const initial = getInitialData();
    saveStoredData(initial);
    return initial;
  }
}

export function saveStoredData(data) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const dataWithTimestamp = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp));
  } catch (error) {
    console.error('Failed to save StudioFlow data to localStorage:', error);
  }
}

export function clearAndResetStoredData() {
  if (typeof window === 'undefined' || !window.localStorage) return getInitialData();
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    const freshData = getInitialData();
    saveStoredData(freshData);
    return freshData;
  } catch (error) {
    console.error('Failed to reset demo data:', error);
    return getInitialData();
  }
}
