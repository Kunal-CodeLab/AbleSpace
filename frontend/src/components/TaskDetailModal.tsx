'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Lock,
  Unlock,
  Eye,
  Share2,
  MoreHorizontal,
  Plus,
  Paperclip,
  Send,
  Calendar as CalendarIcon,
  Smile,
  ChevronDown,
  Check,
  Trash2,
  Copy,
  CheckCircle,
  FileText,
  Download,
  Tag,
  User,
  ExternalLink,
  Edit2,
  CheckSquare,
  Square,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { TaskPriority, TaskStatus, Subtask, FileAttachment } from '@/lib/types';
import { getPriorityConfig, PrioritySignalIcon, PriorityOptionRow } from '@/lib/priorityHelpers';

export default function TaskDetailModal() {
  const { tasks, activeTaskId, setActiveTaskId, updateTask, deleteTask, addTask } = useAppStore();

  const task = tasks.find((t) => t.id === activeTaskId);

  const [commentInput, setCommentInput] = useState('');
  const [isPriorityPopoverOpen, setPriorityPopoverOpen] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [isHeaderMenuOpen, setHeaderMenuOpen] = useState(false);
  const [isLabelsPopoverOpen, setLabelsPopoverOpen] = useState(false);
  const [isReporterPopoverOpen, setReporterPopoverOpen] = useState(false);
  const [newLabelInput, setNewLabelInput] = useState('');
  const [subtaskInput, setSubtaskInput] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [watchersCount, setWatchersCount] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activeTaskId || !task) return null;

  const priorities: TaskPriority[] = ['No Priority', 'Urgent', 'High', 'Medium', 'Low'];
  const statuses: TaskStatus[] = ['To Do', 'Doing', 'Completed', 'On Hold'];
  const availableReporters = [
    { name: 'Dexter', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256', role: 'Lead Designer' },
    { name: 'Ankit Dutta', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256', role: 'Full-Stack Developer' },
    { name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256', role: 'Product Manager' },
    { name: 'Alex Morgan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256', role: 'QA Engineer' },
  ];
  const standardLabels = ['Research', 'Design', 'Development', 'Testing', 'Deployment', 'Bug', 'Feature', 'Urgent'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;

    const newComment = {
      id: `comm-${Date.now()}`,
      content: commentInput,
      authorName: 'Ankit Dutta',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      createdAt: 'just now',
      taskId: task.id,
    };

    const newActivity = {
      id: `act-${Date.now()}`,
      action: 'Comment Added',
      details: 'posted an update · just now',
      createdAt: 'just now',
    };

    updateTask(task.id, {
      comments: [newComment, ...(task.comments || [])],
      activityLogs: [newActivity, ...(task.activityLogs || [])],
    });

    setCommentInput('');
    showToast('Comment added!');
  };

  // Subtasks CRUD
  const handleAddSubtask = (customTitle?: string) => {
    const currentSubtasks = task.subtasks && task.subtasks.length > 0
      ? task.subtasks
      : [
          { id: 'sub-1', title: 'Subtask 1', status: 'To Do', completed: false, priority: 'High' as TaskPriority, dueDate: '12 Sep 2026', taskId: task.id },
          { id: 'sub-2', title: 'Subtask 2', status: 'To Do', completed: false, priority: 'Low' as TaskPriority, dueDate: '15 Sep 2026', taskId: task.id },
          { id: 'sub-3', title: 'Subtask 3', status: 'Completed', completed: true, priority: 'Medium' as TaskPriority, dueDate: '18 Sep 2026', taskId: task.id },
        ];

    const titleToUse = customTitle || subtaskInput.trim() || `Subtask ${currentSubtasks.length + 1}`;

    const newSubtask: Subtask = {
      id: `sub-${Date.now()}`,
      title: titleToUse,
      status: 'To Do',
      completed: false,
      priority: 'Medium',
      dueDate: '18 Sep 2026',
      assigneeName: 'Dexter',
      assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      taskId: task.id,
    };

    updateTask(task.id, {
      subtasks: [...currentSubtasks, newSubtask],
    });

    setSubtaskInput('');
    showToast(`Subtask "${titleToUse}" added!`);
  };

  const handleToggleSubtask = (subtask: Subtask) => {
    const currentSubtasks = task.subtasks || [
      { id: 'sub-1', title: 'Subtask 1', status: 'To Do', completed: false, priority: 'High' as TaskPriority, dueDate: '12 Sep 2026', taskId: task.id },
      { id: 'sub-2', title: 'Subtask 2', status: 'To Do', completed: false, priority: 'Low' as TaskPriority, dueDate: '15 Sep 2026', taskId: task.id },
      { id: 'sub-3', title: 'Subtask 3', status: 'Completed', completed: true, priority: 'Medium' as TaskPriority, dueDate: '18 Sep 2026', taskId: task.id },
    ];

    const updated = currentSubtasks.map((s) =>
      s.id === subtask.id ? { ...s, completed: !s.completed, status: !s.completed ? 'Completed' : 'To Do' } : s
    );

    updateTask(task.id, { subtasks: updated });
    showToast(subtask.completed ? 'Subtask marked incomplete' : 'Subtask completed');
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const currentSubtasks = task.subtasks || [];
    const updated = currentSubtasks.filter((s) => s.id !== subtaskId);
    updateTask(task.id, { subtasks: updated });
    showToast('Subtask deleted');
  };

  const handleUpdateSubtaskPriority = (subtaskId: string, priority: TaskPriority) => {
    const currentSubtasks = task.subtasks || [];
    const updated = currentSubtasks.map((s) => (s.id === subtaskId ? { ...s, priority } : s));
    updateTask(task.id, { subtasks: updated });
    showToast(`Subtask priority updated to ${priority}`);
  };

  const handleUpdateSubtaskTitle = (subtaskId: string, title: string) => {
    const currentSubtasks = task.subtasks || [];
    const updated = currentSubtasks.map((s) => (s.id === subtaskId ? { ...s, title } : s));
    updateTask(task.id, { subtasks: updated });
  };

  const handleUpdateSubtaskDueDate = (subtaskId: string, dueDate: string) => {
    const currentSubtasks = task.subtasks || [];
    const updated = currentSubtasks.map((s) => (s.id === subtaskId ? { ...s, dueDate } : s));
    updateTask(task.id, { subtasks: updated });
  };

  // Real File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formattedSize = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;

    const newAttachment: FileAttachment = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: formattedSize,
      type: file.type || 'application/octet-stream',
      url: URL.createObjectURL(file),
      createdAt: 'Just now',
    };

    updateTask(task.id, {
      attachments: [...(task.attachments || []), newAttachment],
    });

    showToast(`File attached: ${file.name}`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    const updated = (task.attachments || []).filter((a) => a.id !== attachmentId);
    updateTask(task.id, { attachments: updated });
    showToast('Attachment removed');
  };

  // Labels Add/Remove
  const currentLabelsList = task.labels ? task.labels.split(',').map((l) => l.trim()).filter(Boolean) : ['Research', 'Design', 'Development', 'Testing', 'Deployment'];

  const handleAddLabel = (label: string) => {
    if (!label.trim()) return;
    if (currentLabelsList.includes(label.trim())) return;

    const updatedLabels = [...currentLabelsList, label.trim()].join(',');
    updateTask(task.id, { labels: updatedLabels });
    setNewLabelInput('');
    showToast(`Label '${label.trim()}' added`);
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    const updatedLabels = currentLabelsList.filter((l) => l !== labelToRemove).join(',');
    updateTask(task.id, { labels: updatedLabels });
    showToast(`Label removed`);
  };

  // Resource Link Add
  const handleAddResource = () => {
    const url = prompt('Enter resource website or document URL (e.g. https://figma.com or https://docs.google.com):');
    if (!url) return;

    const currentResources = task.resources || ['https://figma.com/file/pyramid-design-system', 'https://github.com/pyramid-task-app'];
    updateTask(task.id, { resources: [...currentResources, url] });
    showToast('Resource link added');
  };

  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Task link copied to clipboard!');
    }
  };

  const handleDuplicateTask = () => {
    const dupTask = {
      ...task,
      id: `task-${Date.now()}`,
      title: `${task.title} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    addTask(dupTask);
    showToast('Task duplicated!');
    setHeaderMenuOpen(false);
  };

  const currentPriorityConfig = getPriorityConfig(task.priority);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in">
      {/* Hidden File Input */}
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden relative">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs px-4 py-2 rounded-full shadow-lg z-50 flex items-center space-x-1.5 animate-in">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Top Header Bar */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-zinc-400 font-medium">
            <span>Tasks</span>
            <span>/</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{task.title}</span>
            {isLocked && (
              <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                LOCKED (READ-ONLY)
              </span>
            )}
          </div>

          {/* Action Buttons Top Right */}
          <div className="flex items-center space-x-2 text-zinc-400 relative">
            {/* Lock Button */}
            <button
              onClick={() => {
                setIsLocked(!isLocked);
                showToast(isLocked ? 'Task unlocked' : 'Task locked (editing disabled)');
              }}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isLocked ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' : 'hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
              title={isLocked ? 'Unlock Task' : 'Lock Task'}
            >
              {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>

            {/* Watchers Button */}
            <button
              onClick={() => {
                setWatchersCount(watchersCount + 1);
                showToast(`Now watching task (${watchersCount + 1} total watchers)`);
              }}
              className="flex items-center space-x-1 p-1.5 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs transition cursor-pointer"
              title="Watch Task"
            >
              <Eye className="w-4 h-4" />
              <span>{watchersCount}</span>
            </button>

            {/* Share Link Button */}
            <button
              onClick={handleShareLink}
              className="p-1.5 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              title="Share Task Link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Modal Actions (...) Button & Popover */}
            <div className="relative">
              <button
                onClick={() => setHeaderMenuOpen(!isHeaderMenuOpen)}
                className="p-1.5 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                title="Task Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {/* Header Options Popover Menu */}
              {isHeaderMenuOpen && (
                <div className="absolute right-0 top-8 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-1.5 z-50 animate-in fade-in space-y-0.5">
                  <button
                    onClick={handleShareLink}
                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-blue-500" />
                    <span>Copy Task Link</span>
                  </button>
                  <button
                    onClick={handleDuplicateTask}
                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-purple-500" />
                    <span>Duplicate Task</span>
                  </button>
                  <button
                    onClick={() => {
                      deleteTask(task.id);
                      setActiveTaskId(null);
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md cursor-pointer font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Task</span>
                  </button>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setActiveTaskId(null)}
              className="p-1.5 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-zinc-800">
          {/* Left Main Details Column */}
          <div className="lg:col-span-2 p-6 space-y-6">
            <div>
              <input
                type="text"
                value={task.title}
                disabled={isLocked}
                onChange={(e) => updateTask(task.id, { title: e.target.value })}
                className="text-xl font-bold text-zinc-900 dark:text-zinc-100 bg-transparent border-none focus:outline-none w-full border-b border-transparent focus:border-zinc-300"
              />
              <textarea
                value={
                  task.description ||
                  'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.'
                }
                disabled={isLocked}
                onChange={(e) => updateTask(task.id, { description: e.target.value })}
                rows={2}
                className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed bg-transparent border-none focus:outline-none w-full resize-none"
              />
            </div>

            {/* Properties */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-4 text-xs">
                <span className="w-20 text-zinc-400 font-medium">Assignee</span>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1.5 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full text-zinc-700 dark:text-zinc-300 font-medium cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">
                    <img
                      src={task.assigneeAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                      alt="Assignee"
                      className="w-4 h-4 rounded-full"
                    />
                    <span>{task.assigneeName || 'Dexter'}</span>
                    <span className="text-[10px] text-zinc-400">({task.assigneeRole || 'Designer'})</span>
                  </div>
                </div>
              </div>

              {/* Interactive Labels */}
              <div className="flex items-start space-x-4 text-xs">
                <span className="w-20 text-zinc-400 font-medium mt-1">Labels</span>
                <div className="flex-1 flex flex-wrap items-center gap-1.5 relative">
                  {currentLabelsList.map((label, idx) => (
                    <span
                      key={idx}
                      className="group inline-flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 font-medium"
                    >
                      <Tag className="w-3 h-3 text-blue-500" />
                      <span>{label}</span>
                      {!isLocked && (
                        <button
                          onClick={() => handleRemoveLabel(label)}
                          className="opacity-60 group-hover:opacity-100 hover:text-red-500 transition cursor-pointer ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}

                  {!isLocked && (
                    <div className="relative">
                      <button
                        onClick={() => setLabelsPopoverOpen(!isLabelsPopoverOpen)}
                        className="inline-flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-full transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Label</span>
                      </button>

                      {isLabelsPopoverOpen && (
                        <div className="absolute left-0 top-7 w-56 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-2 z-50 animate-in fade-in space-y-2">
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-1">Select Label</div>
                          <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto">
                            {standardLabels.map((lbl) => (
                              <button
                                key={lbl}
                                onClick={() => {
                                  handleAddLabel(lbl);
                                  setLabelsPopoverOpen(false);
                                }}
                                className={`text-[11px] px-2 py-1 rounded-md transition border cursor-pointer ${
                                  currentLabelsList.includes(lbl)
                                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 font-semibold'
                                    : 'bg-zinc-50 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border-zinc-200 hover:bg-zinc-100'
                                }`}
                              >
                                {lbl}
                              </button>
                            ))}
                          </div>
                          <div className="border-t border-zinc-100 dark:border-zinc-700 pt-2 flex items-center space-x-1">
                            <input
                              type="text"
                              value={newLabelInput}
                              onChange={(e) => setNewLabelInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (handleAddLabel(newLabelInput), setLabelsPopoverOpen(false))}
                              placeholder="New label..."
                              className="flex-1 bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded-md text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                handleAddLabel(newLabelInput);
                                setLabelsPopoverOpen(false);
                              }}
                              className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-md cursor-pointer font-medium"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Resources & Links */}
              <div className="flex items-center space-x-4 text-xs">
                <span className="w-20 text-zinc-400 font-medium">Resources</span>
                <div className="flex flex-wrap items-center gap-2">
                  {(task.resources && task.resources.length > 0
                    ? task.resources
                    : ['https://figma.com/file/pyramid-design-system']
                  ).map((link, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{link.replace('https://', '').slice(0, 24)}...</span>
                    </a>
                  ))}
                  {!isLocked && (
                    <button
                      onClick={handleAddResource}
                      className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-xs font-medium transition cursor-pointer flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add link</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Real File Attachments Section */}
              <div className="flex items-start space-x-4 text-xs pt-1">
                <span className="w-20 text-zinc-400 font-medium mt-1">Attachments</span>
                <div className="flex-1 space-y-2">
                  {task.attachments && task.attachments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {task.attachments.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/80 p-2 rounded-xl border border-zinc-200/80 dark:border-zinc-700 text-xs"
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                            <div className="truncate">
                              <p className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{file.name}</p>
                              <p className="text-[10px] text-zinc-400">{file.size} · {file.createdAt}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 shrink-0">
                            <a
                              href={file.url}
                              download={file.name}
                              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-500 cursor-pointer"
                              title="Download file"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                            {!isLocked && (
                              <button
                                onClick={() => handleDeleteAttachment(file.id)}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-950/40 rounded text-red-500 cursor-pointer"
                                title="Remove file"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-400 text-xs italic">No files attached yet</p>
                  )}

                  {!isLocked && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center space-x-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer pt-1"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Upload real file from computer</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                  <span>Subtasks</span>
                  <span className="text-zinc-400 font-normal">
                    ({(task.subtasks || []).filter((s) => s.completed).length}/
                    {(task.subtasks || []).length || 3})
                  </span>
                </h3>

                {!isLocked && (
                  <button
                    type="button"
                    onClick={() => handleAddSubtask()}
                    className="inline-flex items-center space-x-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded-lg transition cursor-pointer shadow-2xs active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Subtask</span>
                  </button>
                )}
              </div>

              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-400 font-medium border-b border-zinc-200 dark:border-zinc-800 text-[11px]">
                      <th className="p-2.5 w-8 text-center">Status</th>
                      <th className="p-2.5">Task Title</th>
                      <th className="p-2.5">Priority</th>
                      <th className="p-2.5">Members</th>
                      <th className="p-2.5">Due Date</th>
                      <th className="p-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {(task.subtasks && task.subtasks.length > 0
                      ? task.subtasks
                      : [
                          {
                            id: 'sub-1',
                            title: 'Subtask 1',
                            completed: false,
                            status: 'To Do',
                            priority: 'High' as TaskPriority,
                            dueDate: '12 Sep 2026',
                            assigneeAvatar:
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
                            taskId: task.id,
                          },
                          {
                            id: 'sub-2',
                            title: 'Subtask 2',
                            completed: false,
                            status: 'To Do',
                            priority: 'Low' as TaskPriority,
                            dueDate: '15 Sep 2026',
                            assigneeAvatar:
                              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
                            taskId: task.id,
                          },
                          {
                            id: 'sub-3',
                            title: 'Subtask 3',
                            completed: true,
                            status: 'Completed',
                            priority: 'Medium' as TaskPriority,
                            dueDate: '18 Sep 2026',
                            assigneeAvatar:
                              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
                            taskId: task.id,
                          },
                        ]
                    ).map((sub) => {
                      const subPriorityConfig = getPriorityConfig(sub.priority);

                      return (
                        <tr key={sub.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 group transition">
                          <td className="p-2.5 text-center">
                            <button
                              type="button"
                              disabled={isLocked}
                              onClick={() => handleToggleSubtask(sub)}
                              className="text-zinc-400 hover:text-emerald-600 transition cursor-pointer"
                            >
                              {sub.completed ? (
                                <CheckSquare className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                          <td className="p-2.5 font-medium text-zinc-800 dark:text-zinc-200">
                            <input
                              type="text"
                              value={sub.title}
                              disabled={isLocked}
                              onChange={(e) => handleUpdateSubtaskTitle(sub.id, e.target.value)}
                              className={`bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-blue-500 focus:outline-none w-full text-xs font-semibold ${
                                sub.completed ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'
                              }`}
                            />
                          </td>
                          <td className="p-2.5">
                            <select
                              value={sub.priority}
                              disabled={isLocked}
                              onChange={(e) => handleUpdateSubtaskPriority(sub.id, e.target.value as TaskPriority)}
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border focus:outline-none cursor-pointer dark:bg-zinc-900 dark:text-zinc-100 ${subPriorityConfig.bgClass} ${subPriorityConfig.textClass} ${subPriorityConfig.borderClass}`}
                            >
                              {priorities.map((p) => (
                                <option key={p} value={p} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                                  {p}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2.5">
                            <img
                              src={
                                sub.assigneeAvatar ||
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
                              }
                              alt="Avatar"
                              className="w-5 h-5 rounded-full"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={sub.dueDate}
                              disabled={isLocked}
                              onChange={(e) => handleUpdateSubtaskDueDate(sub.id, e.target.value)}
                              className="bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-blue-500 focus:outline-none w-20 text-[11px] text-zinc-500"
                            />
                          </td>
                          <td className="p-2.5 text-right">
                            {!isLocked && (
                              <button
                                type="button"
                                onClick={() => handleDeleteSubtask(sub.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition cursor-pointer"
                                title="Delete subtask"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {!isLocked && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddSubtask();
                    }}
                    className="p-2.5 bg-zinc-50/70 dark:bg-zinc-800/40 flex items-center space-x-2 border-t border-zinc-100 dark:border-zinc-800"
                  >
                    <Plus className="w-4 h-4 text-zinc-400 shrink-0" />
                    <input
                      type="text"
                      value={subtaskInput}
                      onChange={(e) => setSubtaskInput(e.target.value)}
                      placeholder="Add new subtask... (press Enter or click Save)"
                      className="flex-1 bg-transparent border-none text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none placeholder-zinc-400"
                    />
                    <button
                      type="submit"
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1 rounded-lg transition cursor-pointer shadow-2xs flex items-center space-x-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save Subtask</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
              <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Comments ({(task.comments || []).length})
              </h3>

              <div className="space-y-3">
                {(task.comments && task.comments.length > 0
                  ? task.comments
                  : [
                      {
                        id: 'comm-1',
                        content: 'Verified requirements and updated Figma components.',
                        authorName: 'Ankit Dutta',
                        authorAvatar:
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
                        createdAt: 'just now',
                        taskId: task.id,
                      },
                    ]
                ).map((comm) => (
                  <div
                    key={comm.id}
                    className="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={comm.authorAvatar}
                          alt={comm.authorName}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {comm.authorName}
                        </span>
                        <span className="text-zinc-400 text-[10px]">{comm.createdAt}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-zinc-400">
                        <Smile className="w-3.5 h-3.5 hover:text-zinc-600 cursor-pointer" />
                        <MoreHorizontal className="w-3.5 h-3.5 hover:text-zinc-600 cursor-pointer" />
                      </div>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300 pl-7 leading-relaxed">{comm.content}</p>
                  </div>
                ))}
              </div>

              {!isLocked && (
                <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 bg-white dark:bg-zinc-800 shadow-2xs">
                  <textarea
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Add a comment..."
                    rows={2}
                    className="w-full text-xs bg-transparent border-none text-zinc-900 dark:text-zinc-100 focus:outline-none resize-none placeholder-zinc-400"
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-700/60">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 cursor-pointer"
                      title="Attach file to comment"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleAddComment}
                      disabled={!commentInput.trim()}
                      className="flex items-center space-x-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-40 transition cursor-pointer"
                    >
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Details Sidebar Panel */}
          <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-6">
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 shadow-2xs space-y-4">
              <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                <span>▾ Details</span>
                <Plus className="w-3.5 h-3.5 text-zinc-400 cursor-pointer" />
              </h4>

              <div className="space-y-3.5 text-xs">
                {/* Status Selector */}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Status</span>
                  <select
                    value={task.status}
                    disabled={isLocked}
                    onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                    className="bg-zinc-100 dark:bg-zinc-700/60 text-zinc-800 dark:text-zinc-200 px-2.5 py-1 rounded-md text-xs border border-zinc-200 dark:border-zinc-600 focus:outline-none cursor-pointer font-medium"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        ● {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Selector with Distinct Colors */}
                <div className="relative flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Priority</span>
                  <button
                    disabled={isLocked}
                    onClick={() => setPriorityPopoverOpen(!isPriorityPopoverOpen)}
                    className={`flex items-center space-x-1.5 font-semibold px-2.5 py-1 rounded-md border transition cursor-pointer ${currentPriorityConfig.bgClass} ${currentPriorityConfig.textClass} ${currentPriorityConfig.borderClass}`}
                  >
                    <PrioritySignalIcon priority={task.priority} className="w-3.5 h-3.5" />
                    <span>{task.priority}</span>
                    <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
                  </button>

                  {/* Priority Options Popover */}
                  {isPriorityPopoverOpen && (
                    <div className="absolute right-0 top-8 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2.5 z-50 animate-in fade-in space-y-1">
                      <div className="px-2.5 py-1 text-[13px] font-medium text-zinc-400 dark:text-zinc-500">
                        Priority
                      </div>
                      {priorities.map((p) => (
                        <button
                          key={p}
                          onClick={() => {
                            updateTask(task.id, { priority: p });
                            setPriorityPopoverOpen(false);
                            showToast(`Priority set to ${p}`);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 rounded-xl cursor-pointer transition text-left"
                        >
                          <PriorityOptionRow priority={p} isSelected={task.priority === p} />
                          {task.priority === p && <Check className="w-4 h-4 text-zinc-900 dark:text-zinc-100 font-bold ml-auto shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dates Picker */}
                <div className="relative flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Dates</span>
                  <button
                    disabled={isLocked}
                    onClick={() => setDatePickerOpen(!isDatePickerOpen)}
                    className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-700/60 rounded-md text-xs border border-zinc-200 dark:border-zinc-600 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-600 transition"
                  >
                    <CalendarIcon className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{task.dueDate || 'Jan 10 → End'}</span>
                  </button>

                  {isDatePickerOpen && (
                    <div className="absolute right-0 top-8 w-60 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-3 z-50 animate-in fade-in text-center text-xs">
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
                              updateTask(task.id, { dueDate: `${day} Sep 2026` });
                              setDatePickerOpen(false);
                              showToast(`Due date updated to ${day} Sep 2026`);
                            }}
                            className={`p-1 rounded-full text-center hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer ${
                              day === 18 ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold' : 'text-zinc-700 dark:text-zinc-300'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Reporter Selector Popover */}
                <div className="relative flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Reporter</span>
                  <button
                    disabled={isLocked}
                    onClick={() => setReporterPopoverOpen(!isReporterPopoverOpen)}
                    className="flex items-center space-x-1.5 text-zinc-700 dark:text-zinc-300 px-2 py-1 bg-zinc-100 dark:bg-zinc-700/60 rounded-md text-xs border border-zinc-200 dark:border-zinc-600 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-600 transition"
                  >
                    <img
                      src={task.reporterAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                      alt="Reporter"
                      className="w-4 h-4 rounded-full"
                    />
                    <span className="font-semibold">{task.reporterName || 'Dexter'}</span>
                    <ChevronDown className="w-3 h-3 text-zinc-400" />
                  </button>

                  {isReporterPopoverOpen && (
                    <div className="absolute right-0 top-8 w-52 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-1.5 z-50 animate-in fade-in space-y-0.5">
                      <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                        Assign Reporter
                      </div>
                      {availableReporters.map((r) => (
                        <button
                          key={r.name}
                          onClick={() => {
                            updateTask(task.id, { reporterName: r.name, reporterAvatar: r.avatar });
                            setReporterPopoverOpen(false);
                            showToast(`Reporter changed to ${r.name}`);
                          }}
                          className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer"
                        >
                          <img src={r.avatar} alt={r.name} className="w-5 h-5 rounded-full" />
                          <div className="text-left truncate">
                            <p className="font-semibold text-[11px]">{r.name}</p>
                            <p className="text-[9px] text-zinc-400">{r.role}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Updates / Activity Feed */}
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 shadow-2xs space-y-3">
              <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">▾ Updates Feed</h4>
              <div className="space-y-3 text-xs">
                {(task.activityLogs && task.activityLogs.length > 0
                  ? task.activityLogs
                  : [
                      {
                        id: 'act-1',
                        action: 'Priority Changed',
                        details: `priority is set to ${task.priority}`,
                      },
                      {
                        id: 'act-2',
                        action: 'Update Posted',
                        details: 'posted an update · Aug 2026',
                      },
                    ]
                ).map((log) => (
                  <div key={log.id} className="flex items-start space-x-2 text-[11px]">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
                      alt="User"
                      className="w-5 h-5 rounded-full mt-0.5"
                    />
                    <div>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">You </span>
                      <span className="text-zinc-500 dark:text-zinc-400">{log.details}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
