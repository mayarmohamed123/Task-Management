import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { TaskStatus, TaskPriority, TaskFilterParams } from '../../../types/index.js';
import { useDebounce } from '../../../hooks/useDebounce.js';

interface TaskFiltersProps {
  filters: TaskFilterParams;
  onFilterChange: (newFilters: Partial<TaskFilterParams>) => void;
  onResetFilters: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const [searchInput, setSearchInput] = useState<string>(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 300);

  // Sync debounced search to parent filters
  useEffect(() => {
    onFilterChange({ search: debouncedSearch });
  }, [debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onFilterChange({ search: '' });
  };

  const statusTabs: Array<{ id: TaskStatus | 'ALL'; label: string }> = [
    { id: 'ALL', label: 'All Tasks' },
    { id: 'TODO', label: 'To Do' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'DONE', label: 'Done' },
  ];

  const hasActiveFilters =
    (filters.search && filters.search.trim() !== '') ||
    (filters.status && filters.status !== 'ALL') ||
    (filters.priority && filters.priority !== 'ALL');

  return (
    <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search tasks by title..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-9 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all duration-200 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filters Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Priority Dropdown Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              Priority:
            </span>
            <select
              value={filters.priority || 'ALL'}
              onChange={(e) =>
                onFilterChange({ priority: e.target.value as TaskPriority | 'ALL' })
              }
              className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-700 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchInput('');
                onResetFilters();
              }}
              className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Status Tabs Bar */}
      <div className="flex overflow-x-auto border-t border-slate-100 pt-3 no-scrollbar">
        <div className="flex gap-2">
          {statusTabs.map((tab) => {
            const isActive = (filters.status || 'ALL') === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onFilterChange({ status: tab.id })}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
