import React from 'react';
import { TaskPriority } from './types';

export interface PriorityConfig {
  label: TaskPriority;
  textClass: string;
  bgClass: string;
  borderClass: string;
  badgeBg: string;
}

export function getPriorityConfig(priority: TaskPriority): PriorityConfig {
  switch (priority) {
    case 'Urgent':
      return {
        label: 'Urgent',
        textClass: 'text-red-600 dark:text-red-400 font-medium',
        bgClass: 'bg-red-50 dark:bg-zinc-900',
        borderClass: 'border-red-200 dark:border-red-900/60',
        badgeBg: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300',
      };
    case 'High':
      return {
        label: 'High',
        textClass: 'text-orange-600 dark:text-orange-400 font-medium',
        bgClass: 'bg-orange-50 dark:bg-zinc-900',
        borderClass: 'border-orange-200 dark:border-orange-900/60',
        badgeBg: 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300',
      };
    case 'Medium':
      return {
        label: 'Medium',
        textClass: 'text-amber-600 dark:text-amber-400 font-medium',
        bgClass: 'bg-amber-50 dark:bg-zinc-900',
        borderClass: 'border-amber-200 dark:border-amber-900/60',
        badgeBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
      };
    case 'Low':
      return {
        label: 'Low',
        textClass: 'text-slate-600 dark:text-slate-400 font-medium',
        bgClass: 'bg-slate-50 dark:bg-zinc-900',
        borderClass: 'border-slate-200 dark:border-slate-800',
        badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
      };
    case 'No Priority':
    default:
      return {
        label: 'No Priority',
        textClass: 'text-zinc-900 dark:text-zinc-100 font-medium',
        bgClass: 'bg-zinc-100 dark:bg-zinc-900',
        borderClass: 'border-zinc-200 dark:border-zinc-700',
        badgeBg: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
      };
  }
}

export function PrioritySignalIcon({ priority, className = 'w-4 h-4' }: { priority: TaskPriority; className?: string }) {
  if (priority === 'No Priority') {
    return (
      <span className="inline-block text-zinc-900 dark:text-zinc-100 font-black text-sm leading-none mr-2 select-none">
        .
      </span>
    );
  }

  if (priority === 'Urgent') {
    return (
      <svg className={`inline-block ${className} shrink-0 mr-2`} viewBox="0 0 16 16">
        <rect x="1" y="10" width="2.5" height="5" rx="0.5" fill="#ef4444" />
        <rect x="4.8" y="7" width="2.5" height="8" rx="0.5" fill="#ef4444" />
        <rect x="8.6" y="4" width="2.5" height="11" rx="0.5" fill="#ef4444" />
        <rect x="12.4" y="1" width="2.5" height="14" rx="0.5" fill="#ef4444" />
      </svg>
    );
  }

  if (priority === 'High') {
    return (
      <svg className={`inline-block ${className} shrink-0 mr-2`} viewBox="0 0 16 16">
        <rect x="1" y="10" width="2.5" height="5" rx="0.5" fill="#f97316" />
        <rect x="4.8" y="7" width="2.5" height="8" rx="0.5" fill="#f97316" />
        <rect x="8.6" y="4" width="2.5" height="11" rx="0.5" fill="#f97316" />
      </svg>
    );
  }

  if (priority === 'Medium') {
    return (
      <svg className={`inline-block ${className} shrink-0 mr-2`} viewBox="0 0 16 16">
        <rect x="1" y="10" width="2.5" height="5" rx="0.5" fill="#eab308" />
        <rect x="4.8" y="7" width="2.5" height="8" rx="0.5" fill="#eab308" />
      </svg>
    );
  }

  if (priority === 'Low') {
    return (
      <span className="inline-block text-slate-400 font-black text-xs leading-none mr-2 select-none">
        ..
      </span>
    );
  }

  return null;
}

export function PriorityOptionRow({ priority, isSelected = false }: { priority: TaskPriority | string; isSelected?: boolean }) {
  if (priority === 'All') {
    return (
      <div className="flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-normal text-[14px]">
        <span className="w-4 text-center font-bold text-sm">•</span>
        <span>All Priorities</span>
      </div>
    );
  }

  const p = priority as TaskPriority;
  const config = getPriorityConfig(p);

  return (
    <div className={`flex items-center text-[14px] font-normal ${config.textClass}`}>
      <PrioritySignalIcon priority={p} className="w-4 h-4 shrink-0" />
      <span>{p}</span>
    </div>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const config = getPriorityConfig(priority);

  return (
    <span
      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${config.bgClass} ${config.textClass} ${config.borderClass}`}
    >
      <PrioritySignalIcon priority={priority} className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
}
