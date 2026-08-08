'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Edit2, User, Sun, Palette, LogOut, AlertTriangle, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, colorMode, profile, setProfile, setLoggedIn, setTasks, setProjects } = useAppStore();

  const [fullName, setFullName] = useState(profile.fullName);
  const [title, setTitle] = useState(profile.title || 'Designer');
  const [username, setUsername] = useState(profile.username || 'Dexuser');
  const [email, setEmail] = useState(profile.email);
  const [isConfirmLeaveOpen, setConfirmLeaveOpen] = useState(false);

  const handleSave = () => {
    setProfile({ fullName, title, username, email });
  };

  const handleLeaveWorkspace = () => {
    // Clear tasks and projects state
    setTasks([]);
    setProjects([]);
    // Set authentication state to logged out
    setLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pyramid_auth');
      localStorage.removeItem('pyramid_user');
    }
    // Redirect immediately to login
    router.push('/login');
  };

  return (
    <div className={`min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 ${theme === 'dark' ? 'dark' : ''} theme-${colorMode}`}>
      {/* Settings Left Sidebar */}
      <aside className="w-60 border-r border-zinc-200 dark:border-zinc-800 p-4 space-y-4 bg-white dark:bg-zinc-900">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to app</span>
        </Link>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-xs focus:outline-none"
          />
        </div>

        {/* Nav Links */}
        <nav className="space-y-1 text-xs font-medium">
          <button className="w-full flex items-center space-x-2.5 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 font-semibold cursor-pointer">
            <User className="w-4 h-4 text-zinc-500" />
            <span>Profile</span>
          </button>

          <Link
            href="/"
            className="w-full flex items-center space-x-2.5 px-3 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
          >
            <Sun className="w-4 h-4 text-zinc-500" />
            <span>Theme</span>
          </Link>

          <Link
            href="/"
            className="w-full flex items-center space-x-2.5 px-3 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
          >
            <Palette className="w-4 h-4 text-zinc-500" />
            <span>Color</span>
          </Link>
        </nav>
      </aside>

      {/* Main Settings Content */}
      <main className="flex-1 p-10 max-w-4xl space-y-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Profile</h1>

        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-2xs space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Profile picture
            </span>
            <img
              src={profile.avatar}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
            />
          </div>

          {/* Email */}
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Email</span>
            <div className="flex items-center space-x-2 text-xs font-medium text-zinc-800 dark:text-zinc-200">
              <span>{email}</span>
              <Edit2 className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-600 cursor-pointer" />
            </div>
          </div>

          {/* Full Name */}
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Full name
            </span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={handleSave}
              className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none w-64 text-right"
            />
          </div>

          {/* Title */}
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div>
              <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Title</div>
              <div className="text-[11px] text-zinc-400">Your job title or role</div>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none w-64 text-right"
            />
          </div>

          {/* Username */}
          <div className="flex items-center justify-between pb-2">
            <div>
              <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Username</div>
              <div className="text-[11px] text-zinc-400">One word, like a nickname or first name</div>
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={handleSave}
              className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none w-64 text-right"
            />
          </div>
        </div>

        {/* Workspace Access Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Workspace access</h3>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
            <span className="text-xs text-zinc-500">Remove yourself from the workspace</span>
            <button
              onClick={() => setConfirmLeaveOpen(true)}
              className="bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer active:scale-95"
            >
              Leave Workspace
            </button>
          </div>
        </div>
      </main>

      {/* Confirmation Modal to Leave Workspace */}
      {isConfirmLeaveOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Leave AbleSpace Workspace?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Are you sure you want to remove yourself from this workspace? You will lose access to all tasks, projects, and team deliverables.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setConfirmLeaveOpen(false)}
                className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveWorkspace}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm active:scale-95 flex items-center justify-center space-x-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Yes, Leave Workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
