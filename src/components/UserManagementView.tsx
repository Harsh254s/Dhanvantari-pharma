import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePharmacy } from '../context/PharmacyContext';
import { 
  Users, UserPlus, ShieldCheck, Key, Lock, Mail, Phone, User, 
  Trash2, Edit3, KeyRound, Search, Check, AlertTriangle, Shield, X, Eye, EyeOff
} from 'lucide-react';
import { UserRole, User as UserType } from '../types';

export const UserManagementView: React.FC = () => {
  const { 
    currentUser, usersList, addUser, editUser, deleteUser, 
    toggleUserActive, resetPassword 
  } = useAuth();
  const { addToast } = usePharmacy();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addRole, setAddRole] = useState<UserRole>('Pharmacist');
  const [addError, setAddError] = useState<string | null>(null);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('Pharmacist');
  const [editError, setEditError] = useState<string | null>(null);

  // Reset Password Modal State
  const [resettingUser, setResettingUser] = useState<UserType | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Filtered User List
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    const res = addUser({
      name: addName,
      email: addEmail,
      phone: addPhone,
      password: addPassword,
      role: addRole
    });

    if (res.success) {
      addToast(`Created user account for ${addName} (${addRole})`, 'success');
      setShowAddModal(false);
      setAddName('');
      setAddEmail('');
      setAddPhone('');
      setAddPassword('');
    } else {
      setAddError(res.message || 'Failed to add user');
    }
  };

  const openEditModal = (user: UserType) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone || '');
    setEditRole(user.role);
    setEditError(null);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setEditError(null);
    const res = editUser(editingUser.id, {
      name: editName,
      email: editEmail,
      phone: editPhone,
      role: editRole
    });

    if (res.success) {
      addToast(`Updated user details for ${editName}`, 'success');
      setEditingUser(null);
    } else {
      setEditError(res.message || 'Failed to update user');
    }
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser) return;

    setResetError(null);
    const res = resetPassword(resettingUser.id, newPassword);

    if (res.success) {
      addToast(`Password reset successfully for ${resettingUser.name}`, 'success');
      setResettingUser(null);
      setNewPassword('');
    } else {
      setResetError(res.message || 'Failed to reset password');
    }
  };

  const handleDeleteUser = (user: UserType) => {
    if (user.role === 'Owner') {
      addToast('The Pharmacy Owner account cannot be deleted.', 'error');
      return;
    }

    if (window.confirm(`Are you sure you want to permanently delete staff account for ${user.name}?`)) {
      const res = deleteUser(user.id);
      if (res.success) {
        addToast(`Deleted user account ${user.name}`, 'info');
      } else {
        addToast(res.message || 'Failed to delete user', 'error');
      }
    }
  };

  const handleToggleActive = (user: UserType) => {
    const res = toggleUserActive(user.id);
    if (res.success) {
      addToast(`${user.name} account is now ${!user.active ? 'Active' : 'Disabled'}`, 'info');
    } else {
      addToast(res.message || 'Failed to toggle account status', 'error');
    }
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'Owner': return 'bg-teal-500/20 text-teal-600 dark:text-teal-400 border-teal-500/40';
      case 'Admin': return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/40';
      case 'Pharmacist': return 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/40';
      case 'Cashier': return 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40';
      case 'Inventory Manager': return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40';
      case 'Viewer': return 'bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/40';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-2xl border border-teal-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                Pharmacy Staff & User Management
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 rounded-full">
                Owner Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Create, manage, disable, reset passwords, and assign RBAC roles to pharmacy staff.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-950/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Staff Account</span>
          </button>
        </div>
      </div>

      {/* Role Matrix Reference Card */}
      <div className="p-4 bg-slate-900 text-slate-200 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Role Permissions Matrix
          </span>
          <span className="text-[10px] text-slate-400">Owner-Defined Standards</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
          <div className="p-2.5 bg-slate-950 rounded-xl border border-teal-500/30 space-y-1">
            <span className="font-black text-teal-400 block">Owner (1)</span>
            <p className="text-[10px] text-slate-400">Full access to all modules & system settings.</p>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-blue-500/30 space-y-1">
            <span className="font-black text-blue-400 block">Admin</span>
            <p className="text-[10px] text-slate-400">All modules & non-owner user management.</p>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-purple-500/30 space-y-1">
            <span className="font-black text-purple-400 block">Pharmacist</span>
            <p className="text-[10px] text-slate-400">Billing, Medicines & Customers. No settings/users.</p>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-amber-500/30 space-y-1">
            <span className="font-black text-amber-400 block">Cashier</span>
            <p className="text-[10px] text-slate-400">Billing counter & customer lookup only.</p>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-1">
            <span className="font-black text-emerald-400 block">Inventory</span>
            <p className="text-[10px] text-slate-400">Purchases, stock updates & expiry. No billing.</p>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-700 space-y-1">
            <span className="font-black text-slate-400 block">Viewer</span>
            <p className="text-[10px] text-slate-400">Read-only access across allowed views.</p>
          </div>
        </div>
      </div>

      {/* Controls: Search & Filter */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search staff by name, email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-teal-500"
          >
            <option value="all">All Roles ({usersList.length})</option>
            <option value="Owner">Owner</option>
            <option value="Admin">Admin</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="Cashier">Cashier</option>
            <option value="Inventory Manager">Inventory Manager</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Role / Designation</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No staff accounts match your search filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    
                    {/* Name & Avatar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-teal-400 font-black flex items-center justify-center border border-teal-500/30 text-sm shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.role === 'Owner' && (
                              <span className="px-1.5 py-0.2 bg-teal-500 text-slate-950 font-black text-[9px] rounded uppercase">
                                Sole Owner
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {user.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300 font-semibold">
                      {user.email}
                    </td>

                    {/* Role Badge */}
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border ${getRoleBadgeStyle(user.role)}`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                      {user.phone || 'N/A'}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(user)}
                        disabled={user.role === 'Owner'}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all flex items-center gap-1 ${
                          user.active 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                        } ${user.role === 'Owner' ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span>{user.active ? 'Active' : 'Disabled'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Edit User */}
                        <button
                          onClick={() => openEditModal(user)}
                          disabled={user.role === 'Owner' && currentUser?.role !== 'Owner'}
                          className="p-1.5 text-slate-400 hover:text-teal-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all disabled:opacity-30"
                          title="Edit User Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Reset Password */}
                        <button
                          onClick={() => { setResettingUser(user); setNewPassword(''); setResetError(null); }}
                          disabled={user.role === 'Owner' && currentUser?.role !== 'Owner'}
                          className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all disabled:opacity-30"
                          title="Reset Password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>

                        {/* Delete User */}
                        <button
                          onClick={() => handleDeleteUser(user)}
                          disabled={user.role === 'Owner'}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all disabled:opacity-30"
                          title={user.role === 'Owner' ? 'Owner cannot be deleted' : 'Delete User'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-teal-400" />
                <span>Add Staff Account</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    placeholder="rahul@dhanvantari.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Role / Designation</label>
                  <select
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold outline-none focus:border-teal-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Inventory Manager">Inventory Manager</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Initial Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={addPassword}
                    onChange={(e) => setAddPassword(e.target.value)}
                    placeholder="Set temporary password"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-2 cursor-pointer"
              >
                Create Staff Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-teal-400" />
                <span>Edit Staff Member Details</span>
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Assigned Role</label>
                  {editingUser.role === 'Owner' ? (
                    <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-teal-400 font-black">
                      Owner (Unique)
                    </div>
                  ) : (
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold outline-none focus:border-teal-500"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Pharmacist">Pharmacist</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Inventory Manager">Inventory Manager</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-2 cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <span>Reset Password</span>
              </h3>
              <button onClick={() => setResettingUser(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Set a new password for <strong className="text-white">{resettingUser.name}</strong> ({resettingUser.email}).
            </p>

            {resetError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-2 cursor-pointer"
              >
                Confirm Password Reset
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
