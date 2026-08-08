import React from 'react';

interface AvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const colorPairs = [
  'bg-blue-500 text-white',
  'bg-purple-500 text-white',
  'bg-emerald-500 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
  'bg-indigo-500 text-white',
  'bg-cyan-500 text-white',
];

function getColorForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorPairs[Math.abs(hash) % colorPairs.length];
}

function getInitials(name: string) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function Avatar({ name, avatarUrl, size = 'sm', className = '' }: AvatarProps) {
  const sizeClasses = {
    xs: 'w-4 h-4 text-[9px]',
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-7 h-7 text-xs',
    lg: 'w-9 h-9 text-sm',
  }[size];

  const colorClass = getColorForName(name);
  const initials = getInitials(name);

  // Use crisp SVG/Text avatar to guarantee 0ms network latency
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-bold shrink-0 ${sizeClasses} ${colorClass} ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
}
