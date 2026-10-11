import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Users,
  Calendar,
  FolderKanban,
  CheckSquare,
  UserCheck,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useStudioData } from '../../context/StudioDataContext';
import { Badge } from '../common/Badge';
import { lockBodyScroll, unlockBodyScroll } from '../common/Modal';

export function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { searchAll, clients, events, projects } = useStudioData();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const resultsContainerRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  const results = searchAll(query);
  const totalResults =
    results.clients.length +
    results.events.length +
    results.projects.length +
    results.tasks.length +
    results.team.length;

  // Static quick navigation items when query is empty
  const quickNavItems = useMemo(
    () => [
      {
        id: 'quick-clients',
        type: 'quick',
        title: 'All Clients',
        subtitle: `${clients.length} active client profiles`,
        url: '/clients',
        icon: Users,
        color: 'text-terracotta bg-terracotta-light',
      },
      {
        id: 'quick-events',
        type: 'quick',
        title: 'Events & Bookings',
        subtitle: `${events.length} booked shoots & weddings`,
        url: '/events',
        icon: Calendar,
        color: 'text-sage bg-sage-light',
      },
      {
        id: 'quick-projects',
        type: 'quick',
        title: 'Production Projects',
        subtitle: `${projects.length} in production`,
        url: '/projects',
        icon: FolderKanban,
        color: 'text-amber bg-amber-light',
      },
      {
        id: 'quick-tasks',
        type: 'quick',
        title: 'Task Board',
        subtitle: 'Upcoming deadlines & culling',
        url: '/tasks',
        icon: CheckSquare,
        color: 'text-charcoal bg-charcoal-100',
      },
    ],
    [clients.length, events.length, projects.length]
  );

  // Flattened selectable items for arrow key navigation
  const flattenedItems = useMemo(() => {
    if (!query.trim()) {
      return quickNavItems;
    }

    const items = [];
    results.clients.forEach((c) => {
      items.push({
        id: `client-${c.id}`,
        section: 'Clients',
        type: 'client',
        title: c.name,
        subtitle: `${c.location || 'Location'} • ${c.category || 'Client'}`,
        url: `/clients/${c.id}`,
        badge: c.status,
        avatar: c.avatar,
      });
    });

    results.events.forEach((e) => {
      items.push({
        id: `event-${e.id}`,
        section: 'Events',
        type: 'event',
        title: e.title,
        subtitle: `${e.venue || 'On Location'} • ${e.startDate || ''}`,
        url: `/events/${e.id}`,
        badge: e.status,
      });
    });

    results.projects.forEach((p) => {
      items.push({
        id: `project-${p.id}`,
        section: 'Projects',
        type: 'project',
        title: p.title,
        subtitle: `${p.category || 'Project'} • Shoot: ${p.shootDate || ''}`,
        url: `/projects/${p.id}`,
        badge: p.status,
      });
    });

    results.tasks.forEach((t) => {
      items.push({
        id: `task-${t.id}`,
        section: 'Tasks',
        type: 'task',
        title: t.title,
        subtitle: `Due ${t.dueDate || 'Soon'}`,
        url: '/tasks',
        badge: t.status,
      });
    });

    results.team.forEach((tm) => {
      items.push({
        id: `team-${tm.id}`,
        section: 'Team',
        type: 'team',
        title: tm.name,
        subtitle: tm.role || 'Studio Artist',
        url: '/team',
        badge: tm.status,
        avatar: tm.avatar,
      });
    });

    return items;
  }, [query, results, quickNavItems]);

  // Reset selected index whenever the query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Manage open lifecycle: focus input, lock body scroll, save and restore focus
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElementRef.current = document.activeElement;
      lockBodyScroll();
      setQuery('');
      setSelectedIndex(0);

      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 30);

      return () => {
        clearTimeout(timer);
        unlockBodyScroll();
        if (
          previouslyFocusedElementRef.current &&
          typeof previouslyFocusedElementRef.current.focus === 'function'
        ) {
          previouslyFocusedElementRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (!isOpen) return;
    const activeEl = resultsContainerRef.current?.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, isOpen]);

  if (!isOpen) return null;

  const handleSelect = (url) => {
    onClose();
    navigate(url);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (flattenedItems.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % flattenedItems.length);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (flattenedItems.length > 0) {
        setSelectedIndex((prev) =>
          prev - 1 < 0 ? flattenedItems.length - 1 : prev - 1
        );
      }
      return;
    }

    if (e.key === 'Enter') {
      if (flattenedItems.length > 0 && flattenedItems[selectedIndex]) {
        e.preventDefault();
        handleSelect(flattenedItems[selectedIndex].url);
      }
    }
  };

  const activeItem = flattenedItems[selectedIndex] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Screen reader live announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {query.trim()
          ? `${flattenedItems.length} result${
              flattenedItems.length === 1 ? '' : 's'
            } found for "${query}". Use up and down arrow keys to navigate.`
          : 'Quick studio navigation suggestions available. Use arrow keys to navigate.'}
      </div>

      {/* Search Palette Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Global Studio Search"
        className="relative w-full max-w-2xl bg-surface rounded-2xl border border-border shadow-modal z-10 overflow-hidden transform animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[82vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border bg-ivory-50/70">
          <Search className="w-5 h-5 text-charcoal-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={flattenedItems.length > 0}
            aria-controls="global-search-results"
            aria-activedescendant={
              activeItem ? `search-item-${activeItem.id}` : undefined
            }
            aria-label="Search studio records"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients, events, projects, tasks, or crew..."
            className="flex-1 bg-transparent border-none text-charcoal text-sm sm:text-base placeholder-charcoal-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-charcoal-400 hover:text-charcoal p-1 rounded-lg mr-2 transition-colors"
              aria-label="Clear query text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono text-charcoal-400 bg-surface border border-border rounded shadow-xs select-none">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div
          ref={resultsContainerRef}
          id="global-search-results"
          role="listbox"
          aria-label="Search results and quick shortcuts"
          className="overflow-y-auto p-4 space-y-4 flex-1 focus:outline-none"
          tabIndex={-1}
        >
          {query.trim() === '' ? (
            <div>
              <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider px-2 mb-2">
                Quick Studio Navigation
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickNavItems.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      id={`search-item-${item.id}`}
                      role="option"
                      aria-selected={isSelected}
                      data-index={index}
                      type="button"
                      onClick={() => handleSelect(item.url)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all border ${
                        isSelected
                          ? 'bg-terracotta/10 border-terracotta/40 shadow-xs ring-1 ring-terracotta/30'
                          : 'bg-surface hover:bg-ivory-100 border-border/80'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-sm font-semibold truncate ${
                            isSelected ? 'text-terracotta' : 'text-charcoal'
                          }`}
                        >
                          {item.title}
                        </div>
                        <div className="text-xs text-charcoal-500 truncate">
                          {item.subtitle}
                        </div>
                      </div>
                      {isSelected && (
                        <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-terracotta bg-surface border border-terracotta/30 rounded">
                          ↵
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center">
              <Search className="w-9 h-9 text-charcoal-300 mx-auto mb-2.5" />
              <p className="text-sm font-semibold text-charcoal">
                No results found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-charcoal-500 mt-1.5 max-w-sm mx-auto">
                Try searching for client names, shoot venues, project codes, or team roles.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Clients Section */}
              {results.clients.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-terracotta" /> Clients ({results.clients.length})
                  </div>
                  <div className="space-y-1">
                    {results.clients.map((c) => {
                      const itemIndex = flattenedItems.findIndex(
                        (i) => i.id === `client-${c.id}`
                      );
                      const isSelected = itemIndex === selectedIndex;
                      return (
                        <button
                          key={c.id}
                          id={`search-item-client-${c.id}`}
                          role="option"
                          aria-selected={isSelected}
                          data-index={itemIndex}
                          type="button"
                          onClick={() => handleSelect(`/clients/${c.id}`)}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all border text-left ${
                            isSelected
                              ? 'bg-terracotta/10 border-terracotta/40 shadow-xs ring-1 ring-terracotta/30'
                              : 'bg-surface hover:bg-ivory-100 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <img
                              src={c.avatar}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover border border-border flex-shrink-0"
                            />
                            <div className="truncate">
                              <span
                                className={`text-sm font-medium ${
                                  isSelected ? 'text-terracotta' : 'text-charcoal'
                                }`}
                              >
                                {c.name}
                              </span>
                              <span className="text-xs text-charcoal-400 ml-2">
                                {c.location} &bull; {c.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge size="sm">{c.status}</Badge>
                            {isSelected && (
                              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-terracotta bg-surface border border-terracotta/30 rounded">
                                ↵
                              </kbd>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Events Section */}
              {results.events.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sage" /> Events ({results.events.length})
                  </div>
                  <div className="space-y-1">
                    {results.events.map((e) => {
                      const itemIndex = flattenedItems.findIndex(
                        (i) => i.id === `event-${e.id}`
                      );
                      const isSelected = itemIndex === selectedIndex;
                      return (
                        <button
                          key={e.id}
                          id={`search-item-event-${e.id}`}
                          role="option"
                          aria-selected={isSelected}
                          data-index={itemIndex}
                          type="button"
                          onClick={() => handleSelect(`/events/${e.id}`)}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all border text-left ${
                            isSelected
                              ? 'bg-terracotta/10 border-terracotta/40 shadow-xs ring-1 ring-terracotta/30'
                              : 'bg-surface hover:bg-ivory-100 border-transparent'
                          }`}
                        >
                          <div className="truncate min-w-0 pr-2">
                            <div
                              className={`text-sm font-medium truncate ${
                                isSelected ? 'text-terracotta' : 'text-charcoal'
                              }`}
                            >
                              {e.title}
                            </div>
                            <div className="text-xs text-charcoal-400 truncate">
                              {e.venue} &bull; {e.startDate}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge size="sm">{e.status}</Badge>
                            {isSelected && (
                              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-terracotta bg-surface border border-terracotta/30 rounded">
                                ↵
                              </kbd>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {results.projects.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5 text-amber" /> Projects ({results.projects.length})
                  </div>
                  <div className="space-y-1">
                    {results.projects.map((p) => {
                      const itemIndex = flattenedItems.findIndex(
                        (i) => i.id === `project-${p.id}`
                      );
                      const isSelected = itemIndex === selectedIndex;
                      return (
                        <button
                          key={p.id}
                          id={`search-item-project-${p.id}`}
                          role="option"
                          aria-selected={isSelected}
                          data-index={itemIndex}
                          type="button"
                          onClick={() => handleSelect(`/projects/${p.id}`)}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all border text-left ${
                            isSelected
                              ? 'bg-terracotta/10 border-terracotta/40 shadow-xs ring-1 ring-terracotta/30'
                              : 'bg-surface hover:bg-ivory-100 border-transparent'
                          }`}
                        >
                          <div className="truncate min-w-0 pr-2">
                            <div
                              className={`text-sm font-medium truncate ${
                                isSelected ? 'text-terracotta' : 'text-charcoal'
                              }`}
                            >
                              {p.title}
                            </div>
                            <div className="text-xs text-charcoal-400">
                              {p.category} &bull; Shoot: {p.shootDate}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge size="sm">{p.status}</Badge>
                            {isSelected && (
                              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-terracotta bg-surface border border-terracotta/30 rounded">
                                ↵
                              </kbd>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tasks Section */}
              {results.tasks.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-charcoal-600" /> Tasks ({results.tasks.length})
                  </div>
                  <div className="space-y-1">
                    {results.tasks.map((t) => {
                      const itemIndex = flattenedItems.findIndex(
                        (i) => i.id === `task-${t.id}`
                      );
                      const isSelected = itemIndex === selectedIndex;
                      return (
                        <button
                          key={t.id}
                          id={`search-item-task-${t.id}`}
                          role="option"
                          aria-selected={isSelected}
                          data-index={itemIndex}
                          type="button"
                          onClick={() => handleSelect('/tasks')}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all border text-left ${
                            isSelected
                              ? 'bg-terracotta/10 border-terracotta/40 shadow-xs ring-1 ring-terracotta/30'
                              : 'bg-surface hover:bg-ivory-100 border-transparent'
                          }`}
                        >
                          <div className="truncate min-w-0 pr-2">
                            <div
                              className={`text-sm font-medium truncate ${
                                isSelected ? 'text-terracotta' : 'text-charcoal'
                              }`}
                            >
                              {t.title}
                            </div>
                            <div className="text-xs text-charcoal-400">
                              Due {t.dueDate}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge size="sm">{t.status}</Badge>
                            {isSelected && (
                              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-terracotta bg-surface border border-terracotta/30 rounded">
                                ↵
                              </kbd>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Team Members Section */}
              {results.team.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-charcoal-600" /> Crew & Team ({results.team.length})
                  </div>
                  <div className="space-y-1">
                    {results.team.map((tm) => {
                      const itemIndex = flattenedItems.findIndex(
                        (i) => i.id === `team-${tm.id}`
                      );
                      const isSelected = itemIndex === selectedIndex;
                      return (
                        <button
                          key={tm.id}
                          id={`search-item-team-${tm.id}`}
                          role="option"
                          aria-selected={isSelected}
                          data-index={itemIndex}
                          type="button"
                          onClick={() => handleSelect('/team')}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all border text-left ${
                            isSelected
                              ? 'bg-terracotta/10 border-terracotta/40 shadow-xs ring-1 ring-terracotta/30'
                              : 'bg-surface hover:bg-ivory-100 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <img
                              src={tm.avatar}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover border border-border flex-shrink-0"
                            />
                            <div className="truncate">
                              <span
                                className={`text-sm font-medium ${
                                  isSelected ? 'text-terracotta' : 'text-charcoal'
                                }`}
                              >
                                {tm.name}
                              </span>
                              <span className="text-xs text-charcoal-400 ml-2">
                                {tm.role}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge size="sm">{tm.status}</Badge>
                            {isSelected && (
                              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-terracotta bg-surface border border-terracotta/30 rounded">
                                ↵
                              </kbd>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with keyboard guidance */}
        <div className="px-4 py-2.5 bg-ivory-100 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs text-charcoal-400 select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px] font-mono inline-flex items-center gap-0.5">
                <ArrowUp className="w-2.5 h-2.5 inline" />
                <ArrowDown className="w-2.5 h-2.5 inline" />
              </kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px] font-mono">
                <CornerDownLeft className="w-2.5 h-2.5 inline" />
              </kbd>
              <span>select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px] font-mono">
                ESC
              </kbd>
              <span>close</span>
            </span>
          </div>
          <div className="hidden sm:block text-[11px] text-charcoal-400">
            StudioFlow Global Palette
          </div>
        </div>
      </div>
    </div>
  );
}
