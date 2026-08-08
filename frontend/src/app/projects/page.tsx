'use client';

import React, { useState, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import CreateTaskModal from '@/components/CreateTaskModal';
import Avatar from '@/components/Avatar';
import {
  Plus,
  MoreHorizontal,
  ChevronRight,
  Edit3,
  Trash2,
  X,
  Check,
  Calendar as CalendarIcon,
  User,
  CheckCircle,
  FolderOpen,
  ListTodo,
  Search,
  Columns,
  Filter,
  PanelLeft,
  Circle,
  Users,
  Tag,
  Briefcase,
  RotateCcw,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Project, TaskPriority, TaskStatus } from '@/lib/types';
import { getPriorityConfig, PriorityBadge, PrioritySignalIcon, PriorityOptionRow } from '@/lib/priorityHelpers';

export default function ProjectsPage() {
  const {
    theme,
    colorMode,
    projects,
    setProjects,
    tasks,
    setActiveTaskId,
    setCreateModalOpen,
    toggleSidebar,
  } = useAppStore();

  const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);
  const [activePriorityPopoverId, setActivePriorityPopoverId] = useState<string | null>(null);
  const [activeLeadPopoverId, setActiveLeadPopoverId] = useState<string | null>(null);
  const [activeDatePickerId, setActiveDatePickerId] = useState<string | null>(null);

  // Top Bar Dropdown Controls State
  const [isSearchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFieldsOpen, setFieldsOpen] = useState(false);
  const [activeFieldsSubmenu, setActiveFieldsSubmenu] = useState<string | null>(null);
  const [isFilterOpen, setFilterOpen] = useState(false);

  // Active Filter States (All 7 Fields)
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [pagePriorityFilter, setPagePriorityFilter] = useState<string>('All');
  const [filterMember, setFilterMember] = useState<string>('All');
  const [filterDueDateRange, setFilterDueDateRange] = useState<string>('All');
  const [filterTeam, setFilterTeam] = useState<string>('All');
  const [filterLabel, setFilterLabel] = useState<string>('All');
  const [filterReporter, setFilterReporter] = useState<string>('All');

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);

  const [projectName, setProjectName] = useState('');
  const [projectPriority, setProjectPriority] = useState<TaskPriority>('Medium');
  const [projectLead, setProjectLead] = useState('Dexter');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const priorities: TaskPriority[] = ['No Priority', 'Urgent', 'High', 'Medium', 'Low'];
  const filterPrioritiesList: string[] = ['All', 'No Priority', 'Urgent', 'High', 'Medium', 'Low'];
  const statuses: string[] = ['All', 'To Do', 'Doing', 'Completed', 'On Hold'];
  const availableLeads = [
    { name: 'Dexter', role: 'Lead Designer' },
    { name: 'Ankit Dutta', role: 'Full-Stack Dev' },
    { name: 'Sarah Connor', role: 'Product Manager' },
    { name: 'Alex Morgan', role: 'QA Lead' },
    { name: 'CN', role: 'Software Engineer' },
    { name: 'Admin', role: 'Project Manager' },
  ];
  const dateRanges = ['All', 'Today', 'This Week', 'This Month', 'Overdue'];
  const teams = ['All', 'Engineering Team', 'Design Team', 'Marketing Team', 'Product Management'];
  const labelsList = ['All', 'Research', 'Design', 'Development', 'Testing', 'Deployment', 'Bug', 'Feature'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterStatus('All');
    setPagePriorityFilter('All');
    setFilterMember('All');
    setFilterDueDateRange('All');
    setFilterTeam('All');
    setFilterLabel('All');
    setFilterReporter('All');
    showToast('All filters cleared');
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    setActiveRowMenuId(null);
    if (activeProjectModal?.id === id) setActiveProjectModal(null);
    showToast('Project deleted');
  };

  const handleUpdateProject = (id: string, updates: Partial<Project>) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setProjects(updated);
    if (activeProjectModal && activeProjectModal.id === id) {
      setActiveProjectModal({ ...activeProjectModal, ...updates });
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: projectName,
      priority: projectPriority,
      status: 'To Do',
      lead: projectLead,
      dueDate: '18 Sep 2026',
      team: 'Design Team',
      labels: ['Design'],
      reporter: 'Dexter',
      description: 'Project details and task milestones.',
    };

    setProjects([...projects, newProj]);
    setProjectName('');
    setAddModalOpen(false);
    showToast(`Project "${projectName}" created!`);
  };

  // Filter projects strictly across all 7 field options
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || (p.status || 'To Do') === filterStatus;
    const matchesPriority = pagePriorityFilter === 'All' || p.priority === pagePriorityFilter;
    const matchesMember = filterMember === 'All' || (p.lead || 'Dexter') === filterMember;
    const matchesTeam = filterTeam === 'All' || (p.team || 'Engineering Team') === filterTeam;
    const matchesLabel = filterLabel === 'All' || (p.labels && p.labels.includes(filterLabel));
    const matchesReporter = filterReporter === 'All' || (p.reporter || 'Sarah Connor') === filterReporter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesMember &&
      matchesTeam &&
      matchesLabel &&
      matchesReporter
    );
  });

  const hasActiveFilters =
    filterStatus !== 'All' ||
    pagePriorityFilter !== 'All' ||
    filterMember !== 'All' ||
    filterDueDateRange !== 'All' ||
    filterTeam !== 'All' ||
    filterLabel !== 'All' ||
    filterReporter !== 'All' ||
    searchQuery !== '';

  return (
    <div className={`min-h-screen flex text-zinc-900 dark:text-zinc-100 ${theme === 'dark' ? 'dark' : ''} theme-${colorMode}`}>
      <Sidebar />
      <CreateTaskModal />

      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-900 transition-colors relative">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs px-4 py-2 rounded-full shadow-lg z-50 flex items-center space-x-1.5 animate-in">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}



        {/* Projects Page Header & Control Buttons */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Projects</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-semibold">
              {filteredProjects.length} / {projects.length} Shown
            </span>
          </div>

          {/* Right Control Buttons */}
          <div className="flex items-center space-x-2 relative">
            {/* Search Button & Input */}
            {isSearchActive ? (
              <div className="relative flex items-center animate-in fade-in">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  onBlur={() => {
                    if (!searchQuery) setSearchActive(false);
                  }}
                  className="pl-9 pr-8 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 md:w-56"
                />
              </div>
            ) : (
              <button
                onClick={() => {
                  setSearchActive(true);
                  setTimeout(() => searchInputRef.current?.focus(), 50);
                }}
                className="p-2 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 transition cursor-pointer"
                title="Search Projects"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Fields Button & Submenus */}
            <div className="relative">
              <button
                onClick={() => {
                  setFieldsOpen(!isFieldsOpen);
                  setFilterOpen(false);
                  setActiveFieldsSubmenu(null);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 transition cursor-pointer"
              >
                <Columns className="w-4 h-4 text-zinc-500" />
                <span>Fields</span>
              </button>

              {/* Fields Main Menu Popover */}
              {isFieldsOpen && (
                <div className="absolute right-0 top-10 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2 z-50 animate-in fade-in space-y-1 text-xs">
                  {/* 1. Status Item & Nested Submenu */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveFieldsSubmenu(activeFieldsSubmenu === 'status' ? null : 'status')}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer transition font-medium ${
                        activeFieldsSubmenu === 'status' || filterStatus !== 'All' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Circle className="w-4 h-4 text-zinc-400" />
                        <span>Status</span>
                        {filterStatus !== 'All' && <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold">{filterStatus}</span>}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>

                    {activeFieldsSubmenu === 'status' && (
                      <div className="absolute right-full top-0 mr-1.5 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2.5 z-50 animate-in fade-in space-y-1 text-left">
                        <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Status</div>
                        {statuses.map((st) => (
                          <button
                            key={st}
                            onClick={() => {
                              setFilterStatus(st);
                              setFieldsOpen(false);
                              showToast(`Filtered by Status: ${st}`);
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition text-zinc-800 dark:text-zinc-200 font-medium"
                          >
                            <span>{st}</span>
                            {filterStatus === st && <Check className="w-4 h-4 text-blue-600 font-bold" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. Priority Item & Nested Submenu */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveFieldsSubmenu(activeFieldsSubmenu === 'priority' ? null : 'priority')}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer transition font-medium ${
                        activeFieldsSubmenu === 'priority' || pagePriorityFilter !== 'All' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <PrioritySignalIcon priority="High" className="w-4 h-4" />
                        <span>Priority</span>
                        {pagePriorityFilter !== 'All' && <span className="text-[10px] bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-1.5 py-0.5 rounded font-bold">{pagePriorityFilter}</span>}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>

                    {activeFieldsSubmenu === 'priority' && (
                      <div className="absolute right-full top-0 mr-1.5 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2.5 z-50 animate-in fade-in space-y-1 text-left">
                        <div className="px-2.5 py-1 text-[13px] font-medium text-zinc-400 dark:text-zinc-500">
                          Priority
                        </div>
                        {filterPrioritiesList.map((p) => (
                          <button
                            key={p}
                            onClick={() => {
                              setPagePriorityFilter(p);
                              setActiveFieldsSubmenu(null);
                              setFieldsOpen(false);
                              showToast(`Filtered by Priority: ${p}`);
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 rounded-xl cursor-pointer transition text-left"
                          >
                            <PriorityOptionRow priority={p} isSelected={pagePriorityFilter === p} />
                            {pagePriorityFilter === p && (
                              <Check className="w-4 h-4 text-zinc-900 dark:text-zinc-100 font-bold ml-auto shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. Members Item & Nested Submenu */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveFieldsSubmenu(activeFieldsSubmenu === 'members' ? null : 'members')}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer transition font-medium ${
                        activeFieldsSubmenu === 'members' || filterMember !== 'All' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-zinc-400" />
                        <span>Members</span>
                        {filterMember !== 'All' && <span className="text-[10px] bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded font-bold">{filterMember}</span>}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>

                    {activeFieldsSubmenu === 'members' && (
                      <div className="absolute right-full top-0 mr-1.5 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2.5 z-50 animate-in fade-in space-y-1 text-left">
                        <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Lead / Member</div>
                        <button
                          onClick={() => {
                            setFilterMember('All');
                            setFieldsOpen(false);
                            showToast('Showing all members');
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer font-medium text-zinc-800 dark:text-zinc-200"
                        >
                          <span>All Members</span>
                          {filterMember === 'All' && <Check className="w-4 h-4 text-blue-600 font-bold" />}
                        </button>
                        {availableLeads.map((m) => (
                          <button
                            key={m.name}
                            onClick={() => {
                              setFilterMember(m.name);
                              setFieldsOpen(false);
                              showToast(`Filtered by Lead: ${m.name}`);
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition"
                          >
                            <div className="flex items-center space-x-2">
                              <Avatar name={m.name} size="xs" />
                              <span className="font-medium text-zinc-800 dark:text-zinc-200">{m.name}</span>
                            </div>
                            {filterMember === m.name && <Check className="w-4 h-4 text-blue-600 font-bold" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. Due Date Item & Nested Submenu */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveFieldsSubmenu(activeFieldsSubmenu === 'dueDate' ? null : 'dueDate')}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer transition font-medium ${
                        activeFieldsSubmenu === 'dueDate' || filterDueDateRange !== 'All' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4 text-zinc-400" />
                        <span>Due Date</span>
                        {filterDueDateRange !== 'All' && <span className="text-[10px] bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 px-1.5 py-0.5 rounded font-bold">{filterDueDateRange}</span>}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>

                    {activeFieldsSubmenu === 'dueDate' && (
                      <div className="absolute right-full top-0 mr-1.5 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2.5 z-50 animate-in fade-in space-y-1 text-left">
                        <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Date Range</div>
                        {dateRanges.map((dr) => (
                          <button
                            key={dr}
                            onClick={() => {
                              setFilterDueDateRange(dr);
                              setFieldsOpen(false);
                              showToast(`Filtered by Due Date: ${dr}`);
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition font-medium text-zinc-800 dark:text-zinc-200"
                          >
                            <span>{dr}</span>
                            {filterDueDateRange === dr && <Check className="w-4 h-4 text-blue-600 font-bold" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 5. Teams Item & Nested Submenu */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveFieldsSubmenu(activeFieldsSubmenu === 'teams' ? null : 'teams')}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer transition font-medium ${
                        activeFieldsSubmenu === 'teams' || filterTeam !== 'All' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-zinc-400" />
                        <span>Teams</span>
                        {filterTeam !== 'All' && <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">{filterTeam}</span>}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>

                    {activeFieldsSubmenu === 'teams' && (
                      <div className="absolute right-full top-0 mr-1.5 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2.5 z-50 animate-in fade-in space-y-1 text-left">
                        <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Select Team</div>
                        {teams.map((tm) => (
                          <button
                            key={tm}
                            onClick={() => {
                              setFilterTeam(tm);
                              setFieldsOpen(false);
                              showToast(`Filtered by Team: ${tm}`);
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition font-medium text-zinc-800 dark:text-zinc-200"
                          >
                            <span>{tm}</span>
                            {filterTeam === tm && <Check className="w-4 h-4 text-blue-600 font-bold" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 6. Labels Item & Nested Submenu */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveFieldsSubmenu(activeFieldsSubmenu === 'labels' ? null : 'labels')}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer transition font-medium ${
                        activeFieldsSubmenu === 'labels' || filterLabel !== 'All' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-zinc-400" />
                        <span>Labels</span>
                        {filterLabel !== 'All' && <span className="text-[10px] bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300 px-1.5 py-0.5 rounded font-bold">{filterLabel}</span>}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>

                    {activeFieldsSubmenu === 'labels' && (
                      <div className="absolute right-full top-0 mr-1.5 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2.5 z-50 animate-in fade-in space-y-1 text-left">
                        <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Select Label</div>
                        {labelsList.map((lb) => (
                          <button
                            key={lb}
                            onClick={() => {
                              setFilterLabel(lb);
                              setFieldsOpen(false);
                              showToast(`Filtered by Label: ${lb}`);
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition font-medium text-zinc-800 dark:text-zinc-200"
                          >
                            <span>{lb}</span>
                            {filterLabel === lb && <Check className="w-4 h-4 text-blue-600 font-bold" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 7. Reporter Item & Nested Submenu */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveFieldsSubmenu(activeFieldsSubmenu === 'reporter' ? null : 'reporter')}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer transition font-medium ${
                        activeFieldsSubmenu === 'reporter' || filterReporter !== 'All' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-zinc-400" />
                        <span>Reporter</span>
                        {filterReporter !== 'All' && <span className="text-[10px] bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300 px-1.5 py-0.5 rounded font-bold">{filterReporter}</span>}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>

                    {activeFieldsSubmenu === 'reporter' && (
                      <div className="absolute right-full top-0 mr-1.5 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2.5 z-50 animate-in fade-in space-y-1 text-left">
                        <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Reporter</div>
                        <button
                          onClick={() => {
                            setFilterReporter('All');
                            setFieldsOpen(false);
                            showToast('Showing all reporters');
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer font-medium text-zinc-800 dark:text-zinc-200"
                        >
                          <span>All Reporters</span>
                          {filterReporter === 'All' && <Check className="w-4 h-4 text-blue-600 font-bold" />}
                        </button>
                        {availableLeads.map((rp) => (
                          <button
                            key={rp.name}
                            onClick={() => {
                              setFilterReporter(rp.name);
                              setFieldsOpen(false);
                              showToast(`Filtered by Reporter: ${rp.name}`);
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition"
                          >
                            <div className="flex items-center space-x-2">
                              <Avatar name={rp.name} size="xs" />
                              <span className="font-medium text-zinc-800 dark:text-zinc-200">{rp.name}</span>
                            </div>
                            {filterReporter === rp.name && <Check className="w-4 h-4 text-blue-600 font-bold" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setFilterOpen(!isFilterOpen);
                  setFieldsOpen(false);
                }}
                className={`p-2 border rounded-lg transition cursor-pointer ${
                  pagePriorityFilter !== 'All'
                    ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/30'
                    : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                }`}
                title="Filter Priority"
              >
                <Filter className="w-4 h-4" />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 top-10 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2.5 z-50 animate-in fade-in space-y-1 text-xs">
                  <div className="px-2.5 py-1 text-[13px] font-medium text-zinc-400 dark:text-zinc-500">
                    Filter Priority
                  </div>
                  {filterPrioritiesList.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPagePriorityFilter(p);
                        setFilterOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition text-left"
                    >
                      <PriorityOptionRow priority={p} isSelected={pagePriorityFilter === p} />
                      {pagePriorityFilter === p && (
                        <Check className="w-4 h-4 text-zinc-900 dark:text-zinc-100 font-bold ml-auto shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* + Add Task Button Top Right */}
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center space-x-1.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {hasActiveFilters && (
          <div className="px-6 py-2 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200/60 dark:border-zinc-800 flex items-center flex-wrap gap-2 text-xs">
            <span className="text-zinc-400 font-medium">Filtering by:</span>
            {filterStatus !== 'All' && (
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md font-semibold flex items-center space-x-1">
                <span>Status: {filterStatus}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterStatus('All')} />
              </span>
            )}
            {pagePriorityFilter !== 'All' && (
              <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-md font-semibold flex items-center space-x-1">
                <span>Priority: {pagePriorityFilter}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setPagePriorityFilter('All')} />
              </span>
            )}
            {filterMember !== 'All' && (
              <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-md font-semibold flex items-center space-x-1">
                <span>Lead: {filterMember}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterMember('All')} />
              </span>
            )}
            {filterDueDateRange !== 'All' && (
              <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-md font-semibold flex items-center space-x-1">
                <span>Date: {filterDueDateRange}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterDueDateRange('All')} />
              </span>
            )}
            {filterTeam !== 'All' && (
              <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md font-semibold flex items-center space-x-1">
                <span>Team: {filterTeam}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterTeam('All')} />
              </span>
            )}
            {filterLabel !== 'All' && (
              <span className="bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-md font-semibold flex items-center space-x-1">
                <span>Label: {filterLabel}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterLabel('All')} />
              </span>
            )}
            {filterReporter !== 'All' && (
              <span className="bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 px-2 py-0.5 rounded-md font-semibold flex items-center space-x-1">
                <span>Reporter: {filterReporter}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterReporter('All')} />
              </span>
            )}
            {searchQuery && (
              <span className="bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-2 py-0.5 rounded-md font-semibold flex items-center space-x-1">
                <span>Search: "{searchQuery}"</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline ml-auto flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        )}

        {/* Projects Content Table Area */}
        <div className="p-6 max-w-6xl mx-auto w-full space-y-4">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-visible shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 font-semibold border-b border-zinc-200 dark:border-zinc-800 text-[11px]">
                  <th className="py-3.5 px-4 font-semibold">Projects</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Priority</th>
                  <th className="py-3.5 px-4 font-semibold">Lead</th>
                  <th className="py-3.5 px-4 font-semibold">Team & Labels</th>
                  <th className="py-3.5 px-4 font-semibold">Due Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((proj) => (
                    <tr
                      key={proj.id}
                      onClick={() => setActiveProjectModal(proj)}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition cursor-pointer relative group"
                    >
                      {/* Project Name */}
                      <td className="py-3.5 px-4 font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                        <div className="flex items-center space-x-2">
                          <FolderOpen className="w-4 h-4 text-blue-500 shrink-0" />
                          <span>{proj.name}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          proj.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                          proj.status === 'Doing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400' :
                          proj.status === 'On Hold' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' :
                          'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}>
                          {proj.status || 'To Do'}
                        </span>
                      </td>

                      {/* Priority Cell */}
                      <td className="py-3.5 px-4 relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActivePriorityPopoverId(activePriorityPopoverId === proj.id ? null : proj.id)}
                          className="cursor-pointer"
                        >
                          <PriorityBadge priority={proj.priority} />
                        </button>

                        {activePriorityPopoverId === proj.id && (
                          <div className="absolute left-4 top-10 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2.5 z-50 animate-in fade-in space-y-1 text-left">
                            <div className="px-2.5 py-1 text-[13px] font-medium text-zinc-400 dark:text-zinc-500">
                              Priority
                            </div>
                            {priorities.map((p) => (
                              <button
                                key={p}
                                onClick={() => {
                                  handleUpdateProject(proj.id, { priority: p });
                                  setActivePriorityPopoverId(null);
                                  showToast(`Priority updated to ${p}`);
                                }}
                                className="w-full flex items-center justify-between px-2.5 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 rounded-xl cursor-pointer transition text-left"
                              >
                                <PriorityOptionRow priority={p} isSelected={proj.priority === p} />
                                {proj.priority === p && <Check className="w-4 h-4 text-zinc-900 dark:text-zinc-100 font-bold ml-auto shrink-0" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Lead Cell */}
                      <td className="py-3.5 px-4 relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActiveLeadPopoverId(activeLeadPopoverId === proj.id ? null : proj.id)}
                          className="flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 py-1 rounded-md transition cursor-pointer"
                        >
                          <Avatar name={proj.lead || 'Dexter'} size="sm" />
                          <span className="font-medium">{proj.lead || 'Dexter'}</span>
                        </button>

                        {activeLeadPopoverId === proj.id && (
                          <div className="absolute left-4 top-10 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-1.5 z-50 animate-in fade-in space-y-0.5">
                            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                              Select Project Lead
                            </div>
                            {availableLeads.map((l) => (
                              <button
                                key={l.name}
                                onClick={() => {
                                  handleUpdateProject(proj.id, { lead: l.name });
                                  setActiveLeadPopoverId(null);
                                  showToast(`Lead updated to ${l.name}`);
                                }}
                                className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer"
                              >
                                <Avatar name={l.name} size="xs" />
                                <span>{l.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Team & Labels */}
                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400">
                        <div className="flex flex-col space-y-1">
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">{proj.team || 'Design Team'}</span>
                          <div className="flex items-center space-x-1">
                            {(proj.labels || ['Design']).map((lb) => (
                              <span key={lb} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[9px] px-1.5 py-0.2 rounded font-mono">
                                {lb}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Due Date Cell */}
                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActiveDatePickerId(activeDatePickerId === proj.id ? null : proj.id)}
                          className="hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 py-1 rounded-md transition cursor-pointer"
                        >
                          📅 {proj.dueDate || '18 Sep 2026'}
                        </button>

                        {activeDatePickerId === proj.id && (
                          <div className="absolute left-4 top-10 w-56 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-3 z-50 animate-in fade-in text-center text-xs">
                            <div className="font-semibold text-zinc-800 dark:text-zinc-200 pb-2 border-b border-zinc-100 dark:border-zinc-700">
                              September 2026
                            </div>
                            <div className="grid grid-cols-7 gap-1 mt-2 text-[10px] font-bold text-zinc-400">
                              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                            </div>
                            <div className="grid grid-cols-7 gap-1 mt-1 text-xs">
                              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                                <button
                                  key={day}
                                  onClick={() => {
                                    handleUpdateProject(proj.id, { dueDate: `${day} Sep 2026` });
                                    setActiveDatePickerId(null);
                                    showToast(`Due date updated to ${day} Sep 2026`);
                                  }}
                                  className="p-1 rounded-full text-center hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
                                >
                                  {day}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Row Actions (...) */}
                      <td className="py-3.5 px-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setActiveRowMenuId(activeRowMenuId === proj.id ? null : proj.id)}
                            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                            title="Project Actions"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {activeRowMenuId === proj.id && (
                            <div className="absolute right-0 top-8 w-44 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-1.5 z-50 animate-in fade-in space-y-0.5 text-left">
                              <button
                                onClick={() => {
                                  setActiveProjectModal(proj);
                                  setActiveRowMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer"
                              >
                                <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
                                <span>Open Project</span>
                              </button>

                              <button
                                onClick={() => {
                                  const newName = prompt('Enter new project name:', proj.name);
                                  if (newName) {
                                    handleUpdateProject(proj.id, { name: newName });
                                    showToast('Project renamed');
                                  }
                                  setActiveRowMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-purple-500" />
                                <span>Rename Project</span>
                              </button>

                              <button
                                onClick={() => handleDeleteProject(proj.id)}
                                className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md cursor-pointer font-medium"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Project</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-400 text-xs">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <FolderOpen className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                        <p className="font-semibold text-zinc-700 dark:text-zinc-300 text-sm">No projects match the selected filters</p>
                        <p className="text-zinc-400 text-xs max-w-sm">Try clearing your filters or selecting a different sub-option from the Fields menu.</p>
                        <button
                          onClick={handleResetFilters}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition cursor-pointer shadow-xs"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="p-3 bg-zinc-50/50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setAddModalOpen(true)}
                className="flex items-center space-x-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Projects</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Project Detail Drawer / Modal */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-zinc-400 font-medium">
                <FolderOpen className="w-4 h-4 text-blue-500" />
                <span>Projects /</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{activeProjectModal.name}</span>
              </div>
              <button
                onClick={() => setActiveProjectModal(null)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Editable Name & Description */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">Project Name</label>
                <input
                  type="text"
                  value={activeProjectModal.name}
                  onChange={(e) => handleUpdateProject(activeProjectModal.id, { name: e.target.value })}
                  className="w-full text-lg font-bold text-zinc-900 dark:text-zinc-100 bg-transparent border-b border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-blue-500 pb-1"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">Description</label>
                <textarea
                  value={
                    activeProjectModal.description ||
                    'Comprehensive project workspace covering task deliverables, design systems, testing, and team milestones.'
                  }
                  onChange={(e) => handleUpdateProject(activeProjectModal.id, { description: e.target.value })}
                  rows={3}
                  className="w-full text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Editable Properties Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Priority</label>
                  <select
                    value={activeProjectModal.priority}
                    onChange={(e) => handleUpdateProject(activeProjectModal.id, { priority: e.target.value as TaskPriority })}
                    className="w-full bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 font-semibold cursor-pointer"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Lead</label>
                  <select
                    value={activeProjectModal.lead || 'Dexter'}
                    onChange={(e) => {
                      handleUpdateProject(activeProjectModal.id, { lead: e.target.value });
                    }}
                    className="w-full bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 font-semibold cursor-pointer"
                  >
                    {availableLeads.map((l) => (
                      <option key={l.name} value={l.name}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Due Date</label>
                  <input
                    type="text"
                    value={activeProjectModal.dueDate || '18 Sep 2026'}
                    onChange={(e) => handleUpdateProject(activeProjectModal.id, { dueDate: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 font-medium"
                  />
                </div>
              </div>

              {/* Tasks in Project */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center space-x-1.5">
                    <ListTodo className="w-4 h-4 text-blue-500" />
                    <span>Project Tasks ({tasks.length})</span>
                  </h4>
                </div>

                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => {
                        setActiveTaskId(task.id);
                        setActiveProjectModal(null);
                      }}
                      className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 flex items-center justify-between cursor-pointer transition"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{task.title}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <PriorityBadge priority={task.priority} />
                        <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-500">
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
              <button
                onClick={() => handleDeleteProject(activeProjectModal.id)}
                className="flex items-center space-x-1 text-red-600 text-xs font-semibold hover:underline cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Project</span>
              </button>
              <button
                onClick={() => setActiveProjectModal(null)}
                className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Add New Project</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Design Mobile App"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Priority
                </label>
                <select
                  value={projectPriority}
                  onChange={(e) => setProjectPriority(e.target.value as TaskPriority)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Lead
                </label>
                <select
                  value={projectLead}
                  onChange={(e) => setProjectLead(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
                >
                  {availableLeads.map((l) => (
                    <option key={l.name} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
