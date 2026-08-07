import React from 'react';
import { motion } from 'framer-motion';
import { useShell } from '../../contexts/ShellContext';

// Top Linear Progress Bar for Page Transitions
export function TopProgressBar() {
  const { isGlobalLoading, loadingProgress } = useShell();

  if (!isGlobalLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-black/20">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
        initial={{ width: '0%' }}
        animate={{ width: `${loadingProgress}%` }}
        transition={{ ease: 'easeOut', duration: 0.2 }}
      />
    </div>
  );
}

// Shimmer Skeleton Base Component
export function SkeletonLoader({ className = '' }) {
  return (
    <div
      className={`relative overflow-hidden bg-white/[0.05] rounded-xl before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.08] before:to-transparent ${className}`}
    />
  );
}

// Card Component Skeleton
export function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-[#121215] border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonLoader className="h-4 w-32" />
        <SkeletonLoader className="h-6 w-16 rounded-full" />
      </div>
      <SkeletonLoader className="h-8 w-48" />
      <SkeletonLoader className="h-3 w-full" />
    </div>
  );
}

// Data Table Skeleton
export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full rounded-2xl bg-[#121215] border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
        <SkeletonLoader className="h-5 w-40" />
        <SkeletonLoader className="h-8 w-24 rounded-lg" />
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <SkeletonLoader className="h-4 w-1/4" />
            <SkeletonLoader className="h-4 w-1/6" />
            <SkeletonLoader className="h-4 w-1/5" />
            <SkeletonLoader className="h-4 w-12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Full Page Layout Skeleton
export function PageSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6 animate-fade-in">
      {/* Header skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="space-y-2">
          <SkeletonLoader className="h-7 w-64" />
          <SkeletonLoader className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          <SkeletonLoader className="h-10 w-28 rounded-xl" />
          <SkeletonLoader className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* Grid Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Table skeleton */}
      <TableSkeleton rows={6} />
    </div>
  );
}
