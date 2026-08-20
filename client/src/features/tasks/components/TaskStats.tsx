import React from 'react';
import { TaskStats as TaskStatsType } from '../../../types/index.js';
import { StatCardSkeleton } from '../../../components/ui/Skeleton.js';
import { CheckCircle2, Clock, ListTodo, Layers } from 'lucide-react';

interface TaskStatsProps {
  stats?: TaskStatsType;
  isLoading: boolean;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  const statItems = [
    {
      title: 'Total Tasks',
      count: stats?.total ?? 0,
      icon: Layers,
      color: 'text-brand-500',
      bg: 'bg-brand-50 border-brand-100',
    },
    {
      title: 'To Do',
      count: stats?.todo ?? 0,
      icon: ListTodo,
      color: 'text-slate-600',
      bg: 'bg-slate-50 border-slate-200',
    },
    {
      title: 'In Progress',
      count: stats?.inProgress ?? 0,
      icon: Clock,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Completed',
      count: stats?.done ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                {item.title}
              </span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${item.bg}`}>
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {item.count}
              </span>
              <span className="text-xs text-slate-600 font-medium">tasks</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
