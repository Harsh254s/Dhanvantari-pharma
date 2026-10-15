import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePharmacy } from '../context/PharmacyContext';

interface AccessDeniedViewProps {
  moduleName?: string;
  requiredRole?: string;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({ 
  moduleName = 'Restricted Module', 
  requiredRole 
}) => {
  const { currentUser } = useAuth();
  const { setActiveTab } = usePharmacy();

  // Find a suitable fallback tab based on user's role
  const getFallbackTab = () => {
    if (!currentUser) return 'dashboard';
    if (currentUser.role === 'Cashier') return 'billing';
    if (currentUser.role === 'Inventory Manager') return 'purchases';
    return 'dashboard';
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Ambient Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600"></div>

        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20 shadow-inner">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase tracking-wider rounded-full inline-block">
            Error 403 • Access Denied
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Restricted ERP Module
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            You do not have permission to access the <strong className="text-slate-900 dark:text-white">{moduleName}</strong> workspace. Your assigned role restricts access to this section.
          </p>
        </div>

        {/* Current User Session Info Box */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-left space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-bold">
              <UserCheck className="w-3.5 h-3.5 text-teal-500" /> Current Session
            </span>
            <span className="font-mono text-[10px]">{currentUser?.email}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-300 font-semibold">Assigned Role:</span>
            <span className="px-2.5 py-0.5 bg-slate-900 text-teal-400 font-black text-[10px] rounded-lg border border-teal-500/30 uppercase">
              {currentUser?.role}
            </span>
          </div>
          {requiredRole && (
            <div className="flex items-center justify-between pt-1 text-[11px] text-amber-600 dark:text-amber-400">
              <span className="font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" /> Required Role:
              </span>
              <span className="font-bold">{requiredRole}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setActiveTab(getFallbackTab())}
          className="w-full py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4 text-teal-400" />
          <span>Return to Authorized Workspace</span>
        </button>

      </div>
    </div>
  );
};
