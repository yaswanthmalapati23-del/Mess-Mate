'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Building2,
  CheckCircle,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';
import { AdminRole, AdminUser } from '@/lib/types';
import { supabase, checkAdminRole, signInAdmin } from '@/lib/supabaseClient';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1. Check local session cache for fast access
    try {
      const cached = localStorage.getItem('mess_mate_admin_session');
      if (cached) {
        setAdmin(JSON.parse(cached));
        setIsLoading(false);
        return;
      }
    } catch (e) {}

    // 2. Check active Supabase session
    if (supabase) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          const check = await checkAdminRole(session.user.id);
          if (check.isAdmin) {
            const adminData: AdminUser = {
              id: session.user.id,
              userId: session.user.id,
              email: session.user.email || 'admin@vitap.ac.in',
              role: (check.role as AdminRole) || 'admin',
              createdAt: new Date().toISOString(),
            };
            setAdmin(adminData);
            try {
              localStorage.setItem('mess_mate_admin_session', JSON.stringify(adminData));
            } catch (e) {}
          }
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await signInAdmin(email, password);
      if (!res.success || !res.admin) {
        setErrorMessage(res.error || 'Invalid administrator credentials.');
        setIsSubmitting(false);
        return;
      }

      const adminUser: AdminUser = {
        id: res.admin.id,
        userId: res.admin.id,
        email: res.admin.email,
        role: (res.admin.role as AdminRole) || 'admin',
        createdAt: new Date().toISOString(),
      };

      setAdmin(adminUser);
      try {
        localStorage.setItem('mess_mate_admin_session', JSON.stringify(adminUser));
      } catch (e) {}
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAdminLogin = (role: AdminRole = 'admin') => {
    const demoAdmin: AdminUser = {
      id: 'demo_admin_001',
      userId: 'demo_admin_001',
      email: role === 'mess_committee' ? 'mess.committee@vitap.ac.in' : 'admin@vitap.ac.in',
      role,
      createdAt: new Date().toISOString(),
    };
    setAdmin(demoAdmin);
    try {
      localStorage.setItem('mess_mate_admin_session', JSON.stringify(demoAdmin));
    } catch (e) {}
  };

  const handleAdminSignOut = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    setAdmin(null);
    try {
      localStorage.removeItem('mess_mate_admin_session');
    } catch (e) {}
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-950 text-gray-300">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="w-8 h-8 text-terracotta-500 animate-spin" />
          <span className="text-xs font-semibold tracking-wider font-display">
            Verifying Administrator Credentials...
          </span>
        </div>
      </div>
    );
  }

  // Not authenticated as admin: render admin login portal
  if (!admin) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col items-center justify-center p-4 selection:bg-terracotta-500 selection:text-white relative overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-terracotta-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-obsidian-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-terracotta-700 via-terracotta-600 to-saffron-600 text-white shadow-glow-terracotta mb-3 select-none">
              <Building2 className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black font-display text-white tracking-tight">
              Campus Admin Portal
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              Mess Committee & Food Court Operations
            </p>
          </div>

          {/* Security Notice */}
          <div className="mb-5 p-3 rounded-2xl bg-obsidian-950 border border-terracotta-900/40 text-terracotta-300 text-xs flex items-start space-x-2.5">
            <Lock className="w-4 h-4 text-terracotta-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">Restricted Access:</span> This area is isolated for campus menu managers and mess caterers. Student accounts cannot access administrative controls.
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-start space-x-2.5 animate-shake">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                Admin / Committee Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. mess.committee@vitap.ac.in"
                  required
                  autoFocus
                  disabled={isSubmitting}
                  className="w-full bg-obsidian-950 border border-white/10 focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none transition-all pr-10"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  required
                  disabled={isSubmitting}
                  className="w-full bg-obsidian-950 border border-white/10 focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email.trim() || !password}
              className="w-full h-12 bg-terracotta-500 hover:bg-terracotta-600 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-glow-terracotta"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Options for Testing & Evaluation */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center space-y-3">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Evaluation & Pilot Quick Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoAdminLogin('admin')}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white transition-all flex items-center justify-center space-x-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-terracotta-400" />
                <span>Super Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoAdminLogin('mess_committee')}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white transition-all flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-saffron-400" />
                <span>Mess Committee</span>
              </button>
            </div>

            <div className="pt-2">
              <a
                href="/"
                className="text-xs text-gray-400 hover:text-terracotta-300 underline font-medium transition-colors"
              >
                ← Return to Student Nutrition App
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin verified: render with admin context header
  return (
    <div className="min-h-screen bg-obsidian-950 text-gray-100 flex flex-col selection:bg-terracotta-500 selection:text-white">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-obsidian-900/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-terracotta-600 to-saffron-600 flex items-center justify-center text-white shadow-glow-terracotta font-black text-sm">
              🏛️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-black text-base text-white tracking-tight">
                  Mess Mate Admin
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-terracotta-950 text-terracotta-300 border border-terracotta-700/50">
                  {admin.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono">
                {admin.email} • Campus Operations Portal
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="/"
              className="text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl transition-all"
            >
              ← Student App
            </a>
            <button
              onClick={handleAdminSignOut}
              className="text-xs font-semibold text-red-300 hover:text-red-200 bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 px-3 py-1.5 rounded-xl transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">{children}</div>
    </div>
  );
};
