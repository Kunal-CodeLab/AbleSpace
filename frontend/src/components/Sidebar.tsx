'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  FolderKanban,
  ChevronsUpDown,
  Sun,
  Moon,
  Settings,
  Palette,
  ChevronRight,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  X,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ColorMode } from '@/lib/types';

export default function Sidebar() {
  const pathname = usePathname();
  const {
    theme,
    setTheme,
    colorMode,
    setColorMode,
    profile,
    setLoggedIn,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
    isSidebarCollapsed,
    setSidebarCollapsed,
  } = useAppStore();

  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isThemeSubmenuOpen, setThemeSubmenuOpen] = useState(false);
  const [isColorSubmenuOpen, setColorSubmenuOpen] = useState(false);

  const colorOptions: { name: string; mode: ColorMode; bg: string }[] = [
    { name: 'Amber', mode: 'amber', bg: 'bg-amber-500' },
    { name: 'Blue', mode: 'blue', bg: 'bg-blue-500' },
    { name: 'Pink', mode: 'pink', bg: 'bg-pink-500' },
    { name: 'Rose', mode: 'rose', bg: 'bg-rose-500' },
    { name: 'Emerald', mode: 'emerald', bg: 'bg-emerald-500' },
    { name: 'Black', mode: 'black', bg: 'bg-zinc-900' },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 flex flex-col z-50 ${
          isMobileSidebarOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full md:translate-x-0'
        } ${isSidebarCollapsed ? 'md:w-16' : 'md:w-60'}`}
      >
        {/* Top Workspace Selector Header */}
        <div className="p-3 flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50">
          {(!isSidebarCollapsed || isMobileSidebarOpen) && (
            <div
              className="flex items-center space-x-2 overflow-hidden cursor-pointer p-1 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 rounded-lg transition"
              onClick={() => setUserMenuOpen(!isUserMenuOpen)}
            >
              <img
                src={
                  profile.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
                }
                alt={profile.fullName}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
              />
              <div className="flex flex-col text-left truncate">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {profile.fullName}
                </span>
              </div>
              <ChevronsUpDown className="w-4 h-4 text-zinc-400 ml-auto flex-shrink-0" />
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:block p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition cursor-pointer"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition cursor-pointer ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Popover Menu */}
        {isUserMenuOpen && (
          <div className="absolute top-14 left-3 w-56 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-2 z-50 animate-in fade-in">
            <div className="flex items-center space-x-3 p-2 border-b border-zinc-100 dark:border-zinc-700/60 mb-1">
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {profile.fullName}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{profile.email}</span>
              </div>
            </div>

            <div className="space-y-0.5 relative">
              {/* Change Theme */}
              <div className="relative">
                <button
                  onClick={() => {
                    setThemeSubmenuOpen(!isThemeSubmenuOpen);
                    setColorSubmenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 rounded-lg transition cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4 text-zinc-500" />
                    <span>Change Theme</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {isThemeSubmenuOpen && (
                  <div className="absolute left-full top-0 ml-1 w-44 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-1.5 z-50 animate-in fade-in">
                    <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Theme
                    </div>
                    <button
                      onClick={() => {
                        setTheme('light');
                        setThemeSubmenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <Sun className="w-4 h-4 text-amber-500" />
                        <span>Light</span>
                      </div>
                      {theme === 'light' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                    <button
                      onClick={() => {
                        setTheme('dark');
                        setThemeSubmenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <Moon className="w-4 h-4 text-indigo-400" />
                        <span>Dark</span>
                      </div>
                      {theme === 'dark' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Color Mode */}
              <div className="relative">
                <button
                  onClick={() => {
                    setColorSubmenuOpen(!isColorSubmenuOpen);
                    setThemeSubmenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 rounded-lg transition cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-zinc-500" />
                    <span>Color Mode</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {isColorSubmenuOpen && (
                  <div className="absolute left-full top-0 ml-1 w-44 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-1.5 z-50 animate-in fade-in">
                    <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Color Mode
                    </div>
                    {colorOptions.map((opt) => (
                      <button
                        key={opt.mode}
                        onClick={() => {
                          setColorMode(opt.mode);
                          setColorSubmenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <span className={`w-3.5 h-3.5 rounded ${opt.bg}`} />
                          <span>{opt.name}</span>
                        </div>
                        {colorMode === opt.mode && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Settings Link */}
              <Link
                href="/settings"
                onClick={() => {
                  setUserMenuOpen(false);
                  setMobileSidebarOpen(false);
                }}
                className="flex items-center space-x-2 px-2.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 rounded-lg transition"
              >
                <Settings className="w-4 h-4 text-zinc-500" />
                <span>Settings</span>
              </Link>

              <div className="border-t border-zinc-100 dark:border-zinc-700 my-1" />

              {/* Logout Option */}
              <button
                onClick={() => {
                  setLoggedIn(false);
                  setUserMenuOpen(false);
                  setMobileSidebarOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-2.5 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 py-4 px-2 space-y-6">
          <div>
            {(!isSidebarCollapsed || isMobileSidebarOpen) && (
              <div className="px-3 pb-2 flex items-center justify-between text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                <span>Workspace</span>
              </div>
            )}

            <nav className="space-y-1">
              <Link
                href="/"
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  pathname === '/'
                    ? 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                }`}
              >
                <LayoutGrid className="w-4 h-4 flex-shrink-0" />
                {(!isSidebarCollapsed || isMobileSidebarOpen) && <span>Tasks</span>}
              </Link>

              <Link
                href="/projects"
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  pathname === '/projects'
                    ? 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                }`}
              >
                <FolderKanban className="w-4 h-4 flex-shrink-0" />
                {(!isSidebarCollapsed || isMobileSidebarOpen) && <span>Projects</span>}
              </Link>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
