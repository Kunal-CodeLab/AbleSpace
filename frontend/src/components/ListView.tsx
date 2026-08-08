'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Signal,
  Plus,
  MoreHorizontal,
  Edit3,
  Trash2,
  Check,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { TaskPriority, TaskStatus } from '@/lib/types';

import { PriorityBadge } from '@/lib/priorityHelpers';

export default function ListView() {
  const {
    tasks,
    searchQuery,
    selectedPriority,
    visibleFields,
    setActiveTaskId,
    setCreateModalOpen,
    updateTask,
    deleteTask,
  } = useAppStore();

  const [expandedSections, setExpandedSections] = useState<Record<TaskStatus, boolean>>({
    'To Do': true,
    Doing: true,
    Completed: true,
    'On Hold': true,
  });

  const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);

  const toggleSection = (status: TaskStatus) => {
    setExpandedSections((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const statuses: TaskStatus[] = ['To Do', 'Doing', 'Completed', 'On Hold'];
  const priorities: TaskPriority[] = ['No Priority', 'Urgent', 'High', 'Medium', 'Low'];

  // Filter tasks based on search & priority
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  const getPriorityBadge = (priority: TaskPriority) => {
    return <PriorityBadge priority={priority} />;
  };

  return (
    <div className="flex-1 p-6 bg-white dark:bg-zinc-900 min-h-[calc(100vh-65px)]">
      <div className="max-w-6xl mx-auto space-y-6">
        {statuses.map((status) => {
          const sectionTasks = filteredTasks.filter((t) => t.status === status);
          const isExpanded = expandedSections[status];

          return (
            <div key={status} className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              {/* Accordion Header */}
              <div
                onClick={() => toggleSection(status)}
                className="flex items-center space-x-2 cursor-pointer select-none py-2 hover:opacity-80 transition"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                )}
                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {status}
                </h3>
                <span className="text-xs text-zinc-400">({sectionTasks.length})</span>
              </div>

              {/* Table View */}
              {isExpanded && (
                <div className="mt-2 border border-zinc-200/80 dark:border-zinc-800 rounded-xl overflow-visible shadow-2xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/80 dark:bg-zinc-800/50 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 border-b border-zinc-200/60 dark:border-zinc-800">
                        <th className="py-2.5 px-4 font-semibold">Task</th>
                        {visibleFields.priority && <th className="py-2.5 px-4 font-semibold">Priority</th>}
                        {visibleFields.members && <th className="py-2.5 px-4 font-semibold">Members</th>}
                        {visibleFields.dueDate && <th className="py-2.5 px-4 font-semibold">Due Date</th>}
                        <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs">
                      {sectionTasks.map((task) => (
                        <tr
                          key={task.id}
                          onClick={() => setActiveTaskId(task.id)}
                          className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition relative"
                        >
                          <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                            {task.title}
                          </td>

                          {visibleFields.priority && (
                            <td className="py-3 px-4">{getPriorityBadge(task.priority)}</td>
                          )}

                          {visibleFields.members && (
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-1.5">
                                <img
                                  src={
                                    task.assigneeAvatar ||
                                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
                                  }
                                  alt={task.assigneeName || 'Admin'}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                              </div>
                            </td>
                          )}

                          {visibleFields.dueDate && (
                            <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                              {task.dueDate || '12 Sep 2026'}
                            </td>
                          )}

                          {/* Row Options (...) Button & Popover */}
                          <td className="py-3 px-4 text-right relative">
                            <div className="relative inline-block text-left">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveRowMenuId(activeRowMenuId === task.id ? null : task.id);
                                }}
                                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                                title="Task Actions"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              {/* Row Actions Popover */}
                              {activeRowMenuId === task.id && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute right-0 top-8 w-44 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-1.5 z-50 animate-in fade-in space-y-0.5 text-left"
                                >
                                  <button
                                    onClick={() => {
                                      setActiveTaskId(task.id);
                                      setActiveRowMenuId(null);
                                    }}
                                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                                    <span>Edit Task</span>
                                  </button>

                                  <div className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                                    Priority
                                  </div>
                                  {priorities.map((p) => (
                                    <button
                                      key={p}
                                      onClick={() => {
                                        updateTask(task.id, { priority: p });
                                        setActiveRowMenuId(null);
                                      }}
                                      className="w-full flex items-center justify-between px-2.5 py-1 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer"
                                    >
                                      <span>{p}</span>
                                      {task.priority === p && (
                                        <Check className="w-3 h-3 text-blue-600" />
                                      )}
                                    </button>
                                  ))}

                                  <div className="border-t border-zinc-100 dark:border-zinc-700 my-1" />

                                  <button
                                    onClick={() => {
                                      deleteTask(task.id);
                                      setActiveRowMenuId(null);
                                    }}
                                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md cursor-pointer font-medium"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete Task</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Add Task row button */}
                  <div className="p-2.5 bg-zinc-50/30 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800/60">
                    <button
                      onClick={() => setCreateModalOpen(true)}
                      className="flex items-center space-x-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 px-2 py-1 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 rounded transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Task</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
