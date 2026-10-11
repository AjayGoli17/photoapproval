import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, Calendar, FolderKanban, CheckSquare, UserCheck, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useStudioData } from '../../context/StudioDataContext';
import { Badge } from '../common/Badge';

export function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const { searchAll, clients, events, projects } = useStudioData();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const results = searchAll(query);
  const totalResults =
    results.clients.length +
    results.events.length +
    results.projects.length +
    results.tasks.length +
    results.team.length;

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (url) => {
    onClose();
    navigate(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Palette Container */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl bg-surface rounded-2xl border border-border shadow-modal z-10 overflow-hidden transform animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border bg-ivory-50/50">
          <Search className="w-5 h-5 text-charcoal-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients, events, projects, tasks, or team members..."
            className="flex-1 bg-transparent border-none text-charcoal text-base placeholder-charcoal-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-charcoal-400 hover:text-charcoal p-1 rounded-lg mr-2"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono text-charcoal-400 bg-surface border border-border rounded shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {query.trim() === '' ? (
            <div>
              <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider px-2 mb-2">
                Quick Studio Navigation
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelect('/clients')}
                  className="flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-ivory-100 transition-colors border border-transparent hover:border-border"
                >
                  <div className="w-8 h-8 rounded-lg bg-terracotta-light text-terracotta flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-charcoal">All Clients</div>
                    <div className="text-xs text-charcoal-500">{clients.length} active client profiles</div>
                  </div>
                </button>
                <button
                  onClick={() => handleSelect('/events')}
                  className="flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-ivory-100 transition-colors border border-transparent hover:border-border"
                >
                  <div className="w-8 h-8 rounded-lg bg-sage-light text-sage flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-charcoal">Events & Bookings</div>
                    <div className="text-xs text-charcoal-500">{events.length} booked shoots & weddings</div>
                  </div>
                </button>
                <button
                  onClick={() => handleSelect('/projects')}
                  className="flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-ivory-100 transition-colors border border-transparent hover:border-border"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-light text-amber flex items-center justify-center">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-charcoal">Production Projects</div>
                    <div className="text-xs text-charcoal-500">{projects.length} in production</div>
                  </div>
                </button>
                <button
                  onClick={() => handleSelect('/tasks')}
                  className="flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-ivory-100 transition-colors border border-transparent hover:border-border"
                >
                  <div className="w-8 h-8 rounded-lg bg-charcoal-100 text-charcoal flex items-center justify-center">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-charcoal">Task Board</div>
                    <div className="text-xs text-charcoal-500">Upcoming deadlines & culling</div>
                  </div>
                </button>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-charcoal-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-charcoal">No results found for "{query}"</p>
              <p className="text-xs text-charcoal-500 mt-1">
                Try searching for client names (Ananya, Priya), venues (Jaipur, Udaipur), or task keywords.
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
                    {results.clients.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelect(`/clients/${c.id}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-ivory-100 transition-colors group text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={c.avatar}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border border-border flex-shrink-0"
                          />
                          <div className="truncate">
                            <span className="text-sm font-medium text-charcoal group-hover:text-terracotta transition-colors">
                              {c.name}
                            </span>
                            <span className="text-xs text-charcoal-400 ml-2">
                              {c.location} • {c.category}
                            </span>
                          </div>
                        </div>
                        <Badge size="sm">{c.status}</Badge>
                      </button>
                    ))}
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
                    {results.events.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => handleSelect(`/events/${e.id}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-ivory-100 transition-colors group text-left"
                      >
                        <div className="truncate min-w-0 pr-2">
                          <div className="text-sm font-medium text-charcoal group-hover:text-terracotta transition-colors truncate">
                            {e.title}
                          </div>
                          <div className="text-xs text-charcoal-400 truncate">
                            {e.venue} • {e.startDate}
                          </div>
                        </div>
                        <Badge size="sm">{e.status}</Badge>
                      </button>
                    ))}
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
                    {results.projects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelect(`/projects/${p.id}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-ivory-100 transition-colors group text-left"
                      >
                        <div className="truncate min-w-0 pr-2">
                          <div className="text-sm font-medium text-charcoal group-hover:text-terracotta transition-colors truncate">
                            {p.title}
                          </div>
                          <div className="text-xs text-charcoal-400">
                            {p.category} • Shoot: {p.shootDate}
                          </div>
                        </div>
                        <Badge size="sm">{p.status}</Badge>
                      </button>
                    ))}
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
                    {results.tasks.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleSelect('/tasks')}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-ivory-100 transition-colors group text-left"
                      >
                        <div className="truncate min-w-0 pr-2">
                          <div className="text-sm font-medium text-charcoal group-hover:text-terracotta transition-colors truncate">
                            {t.title}
                          </div>
                          <div className="text-xs text-charcoal-400">Due {t.dueDate}</div>
                        </div>
                        <Badge size="sm">{t.status}</Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Members Section */}
              {results.team.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-charcoal-600" /> Team Members ({results.team.length})
                  </div>
                  <div className="space-y-1">
                    {results.team.map((tm) => (
                      <button
                        key={tm.id}
                        onClick={() => handleSelect('/team')}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-ivory-100 transition-colors group text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={tm.avatar}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border border-border flex-shrink-0"
                          />
                          <div className="truncate">
                            <span className="text-sm font-medium text-charcoal group-hover:text-terracotta transition-colors">
                              {tm.name}
                            </span>
                            <span className="text-xs text-charcoal-400 ml-2">{tm.role}</span>
                          </div>
                        </div>
                        <Badge size="sm">{tm.status}</Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-ivory-100 border-t border-border flex items-center justify-between text-xs text-charcoal-400">
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px] font-mono">
              <CornerDownLeft className="w-3 h-3 inline" />
            </kbd>
            <span>to open record</span>
          </div>
          <div>StudioFlow Global Search</div>
        </div>
      </div>
    </div>
  );
}
