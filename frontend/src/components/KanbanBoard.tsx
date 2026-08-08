'use client';

import React, { useState } from 'react';
import {
  Plus,
  MoreHorizontal,
  Calendar,
  Tag,
  GripVertical,
  Trash2,
  Edit3,
  ArrowRight,
  ArrowUpDown,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { TaskStatus } from '@/lib/types';
import { PriorityBadge } from '@/lib/priorityHelpers';

export default function KanbanBoard() {
  const {
    tasks,
    searchQuery,
    selectedPriority,
    setActiveTaskId,
    setCreateModalOpen,
    updateTask,
    deleteTask,
    setTasks,
  } = useAppStore();

  const [activeTaskMenuId, setActiveTaskMenuId] = useState<string | null>(null);
  const [activeColumnMenu, setActiveColumnMenu] = useState<TaskStatus | null>(null);

  const columns: TaskStatus[] = ['To Do', 'Doing', 'Completed', 'On Hold'];

  // Filter tasks based on search & priority
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  const handleSortColumn = (status: TaskStatus) => {
    const sorted = [...tasks].sort((a, b) => (a.priority > b.priority ? -1 : 1));
    setTasks(sorted);
    setActiveColumnMenu(null);
  };

  return (
    <div className="flex-1 p-6 overflow-x-auto bg-zinc-50/50 dark:bg-zinc-950/40 min-h-[calc(100vh-65px)]">
      <div className="flex items-start space-x-5 min-w-max pb-6">
        {columns.map((columnStatus) => {
          const columnTasks = filteredTasks.filter((t) => t.status === columnStatus);

          return (
            <div
              key={columnStatus}
              className="w-72 bg-zinc-100/70 dark:bg-zinc-900/60 rounded-xl p-3 border border-zinc-200/60 dark:border-zinc-800/80 flex flex-col max-h-[82vh] relative"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 px-1 border-b border-zinc-200/40 dark:border-zinc-800/40 mb-3 relative">
                <div className="flex items-center space-x-2">
                  <GripVertical className="w-4 h-4 text-zinc-400 cursor-grab" />
                  <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    {columnStatus}
                  </h3>
                  <span className="text-[11px] font-medium text-zinc-400 bg-zinc-200/60 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-zinc-400">
                  <button
                    onClick={() => setCreateModalOpen(true)}
                    className="p-1 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 rounded transition cursor-pointer"
                    title="Add Task to this column"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  
                  {/* Column Header Options Menu (...) */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveColumnMenu(activeColumnMenu === columnStatus ? null : columnStatus);
                        setActiveTaskMenuId(null);
                      }}
                      className="p-1 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 rounded transition cursor-pointer"
                      title="Column Options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Column Options Popover */}
                    {activeColumnMenu === columnStatus && (
                      <div className="absolute right-0 top-7 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-1.5 z-50 animate-in fade-in">
                        <button
                          onClick={() => {
                            setCreateModalOpen(true);
                            setActiveColumnMenu(null);
                          }}
                          className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Task</span>
                        </button>
                        <button
                          onClick={() => handleSortColumn(columnStatus)}
                          className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer"
                        >
                          <ArrowUpDown className="w-3.5 h-3.5" />
                          <span>Sort by Priority</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Task Cards List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setActiveTaskId(task.id)}
                    className="bg-white dark:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-600 cursor-pointer transition-all duration-150 group relative"
                  >
                    {/* Priority Badge & Options Header */}
                    <div className="flex items-center justify-between mb-2">
                      <PriorityBadge priority={task.priority} />
                      
                      {/* Task Options (...) Button & Popover */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTaskMenuId(activeTaskMenuId === task.id ? null : task.id);
                            setActiveColumnMenu(null);
                          }}
                          className="text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition cursor-pointer"
                          title="Task Actions"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Task Card Popover Menu */}
                        {activeTaskMenuId === task.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-6 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-1.5 z-50 animate-in fade-in space-y-0.5"
                          >
                            <button
                              onClick={() => {
                                setActiveTaskId(task.id);
                                setActiveTaskMenuId(null);
                              }}
                              className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                              <span>Edit Details</span>
                            </button>

                            {/* Move to another column */}
                            <div className="px-2.5 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                              Move Status
                            </div>
                            {columns
                              .filter((c) => c !== task.status)
                              .map((nextStatus) => (
                                <button
                                  key={nextStatus}
                                  onClick={() => {
                                    updateTask(task.id, { status: nextStatus });
                                    setActiveTaskMenuId(null);
                                  }}
                                  className="w-full flex items-center space-x-2 px-2.5 py-1 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer"
                                >
                                  <ArrowRight className="w-3 h-3 text-zinc-400" />
                                  <span>{nextStatus}</span>
                                </button>
                              ))}

                            <div className="border-t border-zinc-100 dark:border-zinc-700 my-1" />

                            <button
                              onClick={() => {
                                deleteTask(task.id);
                                setActiveTaskMenuId(null);
                              }}
                              className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md cursor-pointer font-medium"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Task</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Title */}
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {task.title}
                    </h4>

                    {/* Card Footer: Assignee & Due Date Pill */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <img
                          src={
                            task.assigneeAvatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
                          }
                          alt={task.assigneeName || 'Admin'}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                          {task.assigneeName || 'Admin'}
                        </span>
                      </div>

                      {task.dueDate && (
                        <div className="flex items-center space-x-1 bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 text-[10px] font-medium px-2 py-0.5 rounded-full border border-red-100 dark:border-red-900/30">
                          <Calendar className="w-3 h-3" />
                          <span>{task.dueDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Labels Pills */}
                    {task.labels && (
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {task.labels.split(',').slice(0, 2).map((label, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-700/60 text-zinc-600 dark:text-zinc-300 text-[10px] font-medium px-2 py-0.5 rounded-full"
                          >
                            <Tag className="w-2.5 h-2.5 text-zinc-400" />
                            <span>{label.trim()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Task Button at bottom of column */}
              <button
                onClick={() => setCreateModalOpen(true)}
                className="mt-3 flex items-center space-x-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 p-2 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60 rounded-lg transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
