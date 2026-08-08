'use client';

import React, { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import KanbanBoard from '@/components/KanbanBoard';
import ListView from '@/components/ListView';
import TaskDetailModal from '@/components/TaskDetailModal';
import CreateTaskModal from '@/components/CreateTaskModal';
import { useAppStore } from '@/lib/store';
import { INITIAL_TASKS, INITIAL_PROJECTS } from '@/lib/initialData';
import { fetchTasks, loginAsGuestApi } from '@/lib/api';

export default function App() {
  const {
    isLoggedIn,
    setLoggedIn,
    viewMode,
    theme,
    colorMode,
    setTasks,
    setProjects,
  } = useAppStore();

  useEffect(() => {
    // Initialize data
    setTasks(INITIAL_TASKS);
    setProjects(INITIAL_PROJECTS);

    // Fetch NestJS API if available
    fetchTasks().then((data) => {
      if (data && data.length > 0) {
        setTasks(data);
      }
    });
  }, [setTasks, setProjects]);

  const handleGuestLogin = async () => {
    try {
      await loginAsGuestApi();
    } catch (e) {
      console.warn('Guest login offline mode:', e);
    }
    setLoggedIn(true);
  };

  // 1. IF NOT LOGGED IN -> Show 1.PNG Login Screen
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-4 ${theme === 'dark' ? 'dark' : ''} theme-${colorMode}`}
           style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: theme === 'dark' ? '#09090b' : '#ffffff', fontFamily: 'system-ui, sans-serif' }}>
        
        <div className="w-full max-w-md flex flex-col items-center space-y-6 animate-in"
             style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          
          {/* Pyramid Logo matching 1.PNG */}
          <div className="flex items-center space-x-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-bold shadow-md"
                 style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#18181b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              ▲
            </div>
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight"
                  style={{ fontSize: '18px', fontWeight: 'bold', color: theme === 'dark' ? '#f4f4f5' : '#18181b' }}>
              Pyramid
            </span>
          </div>

          {/* Auth Card matching 1.PNG */}
          <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xs flex flex-col items-center text-center space-y-6"
               style={{ width: '100%', backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff', border: '1px solid #e4e4e7', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            
            <div className="space-y-1.5" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100" style={{ fontSize: '22px', fontWeight: '700', color: theme === 'dark' ? '#ffffff' : '#18181b' }}>
                Let's get back on track
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400" style={{ fontSize: '13px', color: '#71717a' }}>
                Enter your email below to login to your account.
              </p>
            </div>

            <div className="w-full space-y-3 pt-2" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Continue as Guest Button */}
              <button
                onClick={handleGuestLogin}
                className="w-full bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 py-3 px-4 rounded-full text-xs font-semibold shadow-sm transition cursor-pointer"
                style={{ width: '100%', backgroundColor: '#18181b', color: '#ffffff', padding: '12px 16px', borderRadius: '9999px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
              >
                Continue as Guest
              </button>

              {/* Login with Google Button */}
              <button
                onClick={handleGuestLogin}
                className="w-full bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 py-3 px-4 rounded-full text-xs font-semibold shadow-2xs flex items-center justify-center space-x-2 transition cursor-pointer"
                style={{ width: '100%', backgroundColor: '#ffffff', color: '#18181b', border: '1px solid #e4e4e7', padding: '12px 16px', borderRadius: '9999px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ width: '18px', height: '18px', flexShrink: 0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Login with Google</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 text-center max-w-xs leading-relaxed" style={{ fontSize: '11px', color: '#a1a1aa', textAlign: 'center' }}>
            By clicking continue, you agree to our{' '}
            <a href="#" className="underline hover:text-zinc-600 dark:hover:text-zinc-300" style={{ textDecoration: 'underline', color: '#71717a' }}>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-zinc-600 dark:hover:text-zinc-300" style={{ textDecoration: 'underline', color: '#71717a' }}>
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    );
  }

  // 2. IF LOGGED IN -> Show Production Application Workspace
  return (
    <div className={`min-h-screen flex text-zinc-900 dark:text-zinc-100 ${theme === 'dark' ? 'dark' : ''} theme-${colorMode}`}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-900 transition-colors">
        <Header />
        {viewMode === 'Board' ? <KanbanBoard /> : <ListView />}
      </main>

      {/* Task Detail Full Modal */}
      <TaskDetailModal />

      {/* Create Task Modal */}
      <CreateTaskModal />
    </div>
  );
}
