import React from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, UserCheck, KeyRound, Check, X, UserPlus, 
  Shield, ExternalLink
} from 'lucide-react';

export const SecurityAuditView: React.FC = () => {
  const { auditLogs, setActiveTab } = usePharmacy();
  const { currentUser, usersList } = useAuth();

  const modulesList = [
    { name: 'Dashboard', owner: true, admin: true, pharm: true, cashier: true, inv: true, viewer: true },
    { name: 'Billing Counter', owner: true, admin: true, pharm: true, cashier: true, inv: false, viewer: false },
    { name: 'Medicines & Batches', owner: true, admin: true, pharm: true, cashier: false, inv: true, viewer: true },
    { name: 'Purchases & AI OCR', owner: true, admin: true, pharm: false, cashier: false, inv: true, viewer: true },
    { name: 'Expiry Engine', owner: true, admin: true, pharm: true, cashier: false, inv: true, viewer: false },
    { name: 'Customers & Directory', owner: true, admin: true, pharm: true, cashier: true, inv: true, viewer: true },
    { name: 'Reports & Analytics', owner: true, admin: true, pharm: false, cashier: false, inv: false, viewer: true },
    { name: 'User Management', owner: true, admin: true, pharm: false, cashier: false, inv: false, viewer: false },
    { name: 'Security & Audit', owner: true, admin: true, pharm: false, cashier: false, inv: false, viewer: false },
    { name: 'System Settings', owner: true, admin: false, pharm: false, cashier: false, inv: false, viewer: false },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-2xl border border-teal-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Security, Access Matrix & Audit Ledger</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Authenticated user sessions, role permission specs, and activity logs.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Session:</span>
            <span className="text-xs font-black text-teal-700 dark:text-teal-400">{currentUser?.name} ({currentUser?.role})</span>
          </div>

          {(currentUser?.role === 'Owner' || currentUser?.role === 'Admin') && (
            <button
              onClick={() => setActiveTab('users')}
              className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>User Management</span>
            </button>
          )}
        </div>
      </div>

      {/* Staff User Management Quick Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-4.5 h-4.5 text-teal-600" />
            <span>Active Pharmacy Staff Accounts ({usersList.length})</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Single Owner ({usersList.filter(u => u.role === 'Owner').length}), Admins ({usersList.filter(u => u.role === 'Admin').length}), Pharmacists ({usersList.filter(u => u.role === 'Pharmacist').length}), Cashiers ({usersList.filter(u => u.role === 'Cashier').length}), Inventory ({usersList.filter(u => u.role === 'Inventory Manager').length}), Viewers ({usersList.filter(u => u.role === 'Viewer').length}).
          </p>
        </div>

        {(currentUser?.role === 'Owner' || currentUser?.role === 'Admin') && (
          <button
            onClick={() => setActiveTab('users')}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <span>Manage Users & Roles</span>
            <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
          </button>
        )}
      </div>

      {/* Role Permission Matrix Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden p-5 space-y-3">
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-teal-600" />
          <span>Role Permissions Matrix Specification</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">System Module</th>
                <th className="py-2.5 px-3 text-center">Owner</th>
                <th className="py-2.5 px-3 text-center">Admin</th>
                <th className="py-2.5 px-3 text-center">Pharmacist</th>
                <th className="py-2.5 px-3 text-center">Cashier</th>
                <th className="py-2.5 px-3 text-center">Inventory Mgr</th>
                <th className="py-2.5 px-3 text-center">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {modulesList.map(item => (
                <tr key={item.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{item.name}</td>
                  <td className="py-2.5 px-3 text-center">{item.owner ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-400 mx-auto" />}</td>
                  <td className="py-2.5 px-3 text-center">{item.admin ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-400 mx-auto" />}</td>
                  <td className="py-2.5 px-3 text-center">{item.pharm ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-400 mx-auto" />}</td>
                  <td className="py-2.5 px-3 text-center">{item.cashier ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-400 mx-auto" />}</td>
                  <td className="py-2.5 px-3 text-center">{item.inv ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-400 mx-auto" />}</td>
                  <td className="py-2.5 px-3 text-center">{item.viewer ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-400 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Audit Logs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs p-5 space-y-3">
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-purple-600" />
          <span>System Operation & Security Audit Logs ({auditLogs.length})</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 font-mono text-[11px]">
                  <td className="py-2.5 px-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{log.userName} ({log.userRole})</td>
                  <td className="py-2.5 px-3 font-bold text-teal-700 dark:text-teal-300">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{log.module}</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
