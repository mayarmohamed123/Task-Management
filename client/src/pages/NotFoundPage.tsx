import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.js';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans text-center">
      <div className="max-w-md space-y-5 rounded-3xl border border-slate-100 bg-white p-8 shadow-card">
        <span className="text-6xl font-black text-brand-500">404</span>
        <h1 className="text-2xl font-extrabold text-slate-900">Page Not Found</h1>
        <p className="text-xs text-slate-500">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="inline-block">
          <Button variant="primary" leftIcon={<Home className="h-4 w-4" />}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
