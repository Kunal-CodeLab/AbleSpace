'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { loginAsGuestApi } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { theme } = useAppStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(
      theme === 'dark' ||
      (typeof window !== 'undefined' && document.documentElement.classList.contains('dark'))
    );
  }, [theme]);

  const handleGuestLogin = async () => {
    try {
      await loginAsGuestApi();
    } catch (e) {
      console.warn('Guest login offline mode:', e);
    }
    router.push('/');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 ${isDarkMode ? 'dark' : ''}`}>
      <div className="w-full max-w-md flex flex-col items-center space-y-6">
        {/* Pyramid Logo */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 font-black shadow-lg text-sm">
            ▲
          </div>
          <span className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
            Pyramid
          </span>
        </div>

        {/* High-Contrast Auth Card */}
        <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md flex flex-col items-center text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Let's get back on track
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
              Enter your email below to login to your account.
            </p>
          </div>

          <div className="w-full space-y-3 pt-2">
            {/* Continue as Guest Button - Bright Solid Contrast Pill Box */}
            <button
              onClick={handleGuestLogin}
              className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 py-3.5 px-4 rounded-full text-xs font-extrabold shadow-lg transition-all duration-150 transform active:scale-98 cursor-pointer flex items-center justify-center"
            >
              Continue as Guest
            </button>

            {/* Login with Google Button - Distinct Dark/Light Pill Box */}
            <button
              onClick={handleGuestLogin}
              className="w-full bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-white border border-zinc-200 dark:border-zinc-700 py-3.5 px-4 rounded-full text-xs font-bold shadow-md flex items-center justify-center space-x-2.5 transition-all duration-150 transform active:scale-98 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Login with Google</span>
            </button>
          </div>
        </div>

        {/* High-Contrast Footer Terms */}
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center max-w-xs leading-relaxed font-medium">
          By clicking continue, you agree to our{' '}
          <Link href="#" className="underline font-semibold text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="underline font-semibold text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
