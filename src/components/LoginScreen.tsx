import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Pill, Lock, Mail, Eye, EyeOff, ShieldCheck, 
  Check, ArrowRight, AlertCircle, Key, UserCheck
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  
  // Login Form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = login(loginEmail, loginPassword);
      if (!res.success) {
        setLoginError(res.message || 'Login failed.');
      }
      setIsSubmitting(false);
    }, 150);
  };

  const fillQuickLogin = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setLoginError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 selection:bg-teal-500 selection:text-white">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Brand & Value Highlights */}
        <div className="lg:col-span-5 bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-teal-500/20">
                <Pill className="w-7 h-7" />
              </div>
              <div>
                <h1 className="font-black text-xl text-white tracking-tight leading-tight">Dhanvantari</h1>
                <p className="text-xs text-teal-400 font-bold tracking-wider uppercase">Pharmacy ERP & Retail POS</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Role-Based Access Control System
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log in with your assigned staff account to access your module. Public registration is disabled. Users are managed exclusively by the Pharmacy Owner.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3 pt-2">
              {[
                'Single Owner Account with Full Master Controls',
                'Owner-Managed User Accounts & Role Assignments',
                'Role-Restricted Module Access & Menu Controls',
                'Full Frontend Route & API Security Protection'
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <div className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5 border border-teal-500/40">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Dhanvantari v3.2 Enterprise</span>
            <span className="flex items-center gap-1 text-teal-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> RBAC Protected
            </span>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-slate-900 space-y-6">
          
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-teal-400" />
                <span>Sign In to Workspace</span>
              </h3>
              <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-[10px] font-extrabold uppercase rounded-lg border border-slate-700">
                Staff Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Enter your email/username and password provided by your Pharmacy Owner.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">
                  Email Address or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="owner@dhanvantari.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-teal-500 outline-none transition-all placeholder:text-slate-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-teal-500 outline-none transition-all placeholder:text-slate-600 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-950/40 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to ERP Terminal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Staff Account Switcher for Testing Roles */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Testing Credentials (Click to fill)
              </span>
              <Key className="w-3 h-3 text-slate-500" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[
                { role: 'Owner', email: 'owner@dhanvantari.com', pass: 'owner', color: 'border-teal-500/30 text-teal-400' },
                { role: 'Admin', email: 'admin@dhanvantari.com', pass: 'admin', color: 'border-blue-500/30 text-blue-400' },
                { role: 'Pharmacist', email: 'pharmacist@dhanvantari.com', pass: 'pharmacist', color: 'border-purple-500/30 text-purple-400' },
                { role: 'Cashier', email: 'cashier@dhanvantari.com', pass: 'cashier', color: 'border-amber-500/30 text-amber-400' },
                { role: 'Inventory', email: 'inventory@dhanvantari.com', pass: 'inventory', color: 'border-emerald-500/30 text-emerald-400' },
                { role: 'Viewer', email: 'viewer@dhanvantari.com', pass: 'viewer', color: 'border-slate-500/30 text-slate-400' },
              ].map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => fillQuickLogin(acc.email, acc.pass)}
                  className={`p-2 bg-slate-950 hover:bg-slate-800/90 border rounded-xl text-left transition-all group ${acc.color}`}
                >
                  <span className="text-[11px] font-black block">{acc.role}</span>
                  <span className="text-[9px] text-slate-500 font-mono block truncate">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
