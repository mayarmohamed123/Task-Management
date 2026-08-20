import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext.js';
import {
  LayoutDashboard,
  ListTodo,
  Clock,
  CheckCircle2,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  User as UserIcon,
  CheckSquare,
} from 'lucide-react';
import { Button } from '../components/ui/Button.js';
import { cn } from '../utils/cn.js';

interface DashboardLayoutProps {
  onOpenCreateTaskModal?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onOpenCreateTaskModal }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/dashboard?status=ALL', label: 'All Tasks', icon: ListTodo },
    { to: '/dashboard?status=TODO', label: 'To Do', icon: CheckSquare },
    { to: '/dashboard?status=IN_PROGRESS', label: 'In Progress', icon: Clock },
    { to: '/dashboard?status=DONE', label: 'Done', icon: CheckCircle2 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-slate-200/80 bg-white p-6 shadow-sm transition-transform duration-300 lg:static lg:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div>
          {/* Logo Branding */}
          <div className="flex items-center justify-between pb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-md shadow-brand-500/30">
                {/* TaskFlow Logo Glyph */}
                <svg className="h-6 w-6 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
                  <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Task<span className="text-brand-500">Flow</span>
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Overview
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150',
                      isActive
                        ? 'bg-brand-50 text-brand-600 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            <div className="pt-6">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                System
              </span>
              <button
                disabled
                className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed opacity-60 mt-1"
              >
                <Settings className="h-4 w-4 shrink-0" />
                <span>Settings</span>
              </button>
            </div>
          </nav>
        </div>

        {/* User Info Card & Logout */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700 font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</h4>
              <p className="text-[11px] text-slate-500 truncate">{user?.email || ''}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50/50 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 py-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Here's what's happening with your tasks today.
              </p>
            </div>
          </div>

          {/* Action Header Button */}
          <div className="flex items-center gap-3">
            {onOpenCreateTaskModal && (
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={onOpenCreateTaskModal}
                className="shadow-md"
              >
                <span className="hidden sm:inline">New Task</span>
                <span className="sm:hidden">Add</span>
              </Button>
            )}

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 ring-2 ring-white">
              <UserIcon className="h-5 w-5" />
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
