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

const STORAGE_KEY = 'studioflow_demo_data_v1';

export function getInitialData() {
  return {
    version: '1.0',
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

    // Migrate deliverables items if older version stored without photo items array
    if (Array.isArray(parsed.deliverables)) {
      parsed.deliverables = parsed.deliverables.map((deliv) => {
        const seedMatch = INITIAL_DELIVERABLES.find((d) => d.id === deliv.id);
        if (!Array.isArray(deliv.items) || deliv.items.length === 0) {
          if (seedMatch && Array.isArray(seedMatch.items)) {
            return {
              ...seedMatch,
              ...deliv,
              items: JSON.parse(JSON.stringify(seedMatch.items)),
            };
          }
        }
        return deliv;
      });
      // Also include any new seed deliverables (deliv-4, deliv-5) if not present
      INITIAL_DELIVERABLES.forEach((seedDeliv) => {
        if (!parsed.deliverables.some((d) => d.id === seedDeliv.id)) {
          parsed.deliverables.push(JSON.parse(JSON.stringify(seedDeliv)));
        }
      });
    } else {
      parsed.deliverables = JSON.parse(JSON.stringify(INITIAL_DELIVERABLES));
    }

    // Migrate payments lineItems if missing
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
    const freshData = getInitialData();
    saveStoredData(freshData);
    return freshData;
  } catch (error) {
    console.error('Failed to reset demo data:', error);
    return getInitialData();
  }
}
