'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Columns, Filter, Plus, Check, Menu, PanelLeft } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { PriorityOptionRow } from '@/lib/priorityHelpers';

export default function Header() {
  const {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    selectedPriority,
    setSelectedPriority,
    visibleFields,
    toggleField,
    setCreateModalOpen,
    setMobileSidebarOpen,
    toggleSidebar,
  } = useAppStore();

  const [isFieldsOpen, setFieldsOpen] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isSearchActive, setSearchActive] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const priorities = ['All', 'No Priority', 'Urgent', 'High', 'Medium', 'Low'];

  // Global Keyboard Shortcuts: Cmd+F / Ctrl+F for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setSearchActive(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="px-4 md:px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between transition-colors">
      {/* Left: Mobile Hamburger & Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          title="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">Tasks</h1>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center space-x-1.5 md:space-x-2 relative">
        {/* Search Bar */}
        {isSearchActive ? (
          <div className="relative flex items-center animate-in fade-in">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks (⌘F)..."
              onBlur={() => {
                if (!searchQuery) setSearchActive(false);
              }}
              className="pl-9 pr-8 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 md:w-64"
            />
            <span className="hidden md:block absolute right-2 text-[10px] text-zinc-400 bg-zinc-200 dark:bg-zinc-700 px-1 rounded font-mono">
              ⌘F
            </span>
          </div>
        ) : (
          <button
            onClick={() => {
              setSearchActive(true);
              setTimeout(() => searchInputRef.current?.focus(), 50);
            }}
            className="p-2 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 transition cursor-pointer"
            title="Search Tasks (⌘F)"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        {/* Fields Popover Button */}
        <div className="relative">
          <button
            onClick={() => {
              setFieldsOpen(!isFieldsOpen);
              setFilterOpen(false);
            }}
            className="flex items-center space-x-1.5 px-2.5 md:px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 transition cursor-pointer"
          >
            <Columns className="w-4 h-4 text-zinc-500" />
            <span className="hidden sm:inline">Fields</span>
          </button>

          {/* Fields Dropdown Popover matching screenshot */}
          {isFieldsOpen && (
            <div className="absolute right-0 top-10 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2.5 z-50 animate-in fade-in space-y-2 text-xs">
              {/* Top View Mode Switcher Segmented Button */}
              <div className="flex bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('List')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center space-x-1 ${
                    viewMode === 'List'
                      ? 'bg-white dark:bg-zinc-900 text-black dark:text-white border border-black dark:border-white shadow-xs font-bold'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
                  }`}
                >
                  <span>≡ List</span>
                </button>
                <button
                  onClick={() => setViewMode('Board')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center space-x-1 ${
                    viewMode === 'Board'
                      ? 'bg-white dark:bg-zinc-900 text-black dark:text-white border border-black dark:border-white shadow-xs font-bold'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
                  }`}
                >
                  <span>⊞ Board</span>
                </button>
              </div>

              {/* Checkbox Items List */}
              <div className="space-y-1 pt-1">
                {(['priority', 'members', 'dueDate', 'labels', 'status', 'reporter'] as Array<keyof typeof visibleFields>).map((field) => {
                  const labelDisplay = field === 'dueDate' ? 'DueDate' : field.charAt(0).toUpperCase() + field.slice(1);
                  const isChecked = visibleFields[field];

                  return (
                    <label
                      key={field}
                      onClick={() => toggleField(field)}
                      className="flex items-center justify-between px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-lg cursor-pointer text-zinc-800 dark:text-zinc-200 font-medium transition"
                    >
                      <span>{labelDisplay}</span>
                      <div
                        className={`w-4 h-4 rounded border transition flex items-center justify-center ${
                          isChecked
                            ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black'
                            : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Filter Popover Button */}
        <div className="relative">
          <button
            onClick={() => {
              setFilterOpen(!isFilterOpen);
              setFieldsOpen(false);
            }}
            className={`p-2 border rounded-lg transition cursor-pointer ${
              selectedPriority !== 'All'
                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/30'
                : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
            }`}
            title="Filter Tasks"
          >
            <Filter className="w-4 h-4" />
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 top-10 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2.5 z-50 animate-in fade-in space-y-1">
              <div className="px-2.5 py-1 text-[13px] font-medium text-zinc-400 dark:text-zinc-500">
                Priority
              </div>
              {priorities.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setSelectedPriority(p);
                    setFilterOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 rounded-xl cursor-pointer transition text-left"
                >
                  <PriorityOptionRow priority={p} isSelected={selectedPriority === p} />
                  {selectedPriority === p && <Check className="w-4 h-4 text-zinc-900 dark:text-zinc-100 font-bold ml-auto shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* + Add Task Button */}
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center space-x-1.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-3 md:px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
}
