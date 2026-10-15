import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  register: (data: { name: string; email: string; role: UserRole; phone: string; password: string }) => { success: boolean; message?: string };
  logout: () => void;
  hasPermission: (module: string, action?: 'read' | 'write' | 'delete' | 'admin') => boolean;
  usersList: User[];
  addUser: (data: { name: string; email: string; role: UserRole; phone: string; password: string }) => { success: boolean; message?: string };
  editUser: (id: string, data: { name: string; email: string; role: UserRole; phone: string }) => { success: boolean; message?: string };
  deleteUser: (id: string) => { success: boolean; message?: string };
  toggleUserActive: (id: string) => { success: boolean; message?: string };
  resetPassword: (id: string, newPass: string) => { success: boolean; message?: string };
  assignRole: (id: string, newRole: UserRole) => { success: boolean; message?: string };
}

const STORAGE_KEY_USER = 'dhanvantari_auth_user';
const STORAGE_KEY_ALL_USERS = 'dhanvantari_users';

// Exactly ONE Owner account allowed
const initialDefaultUsers: User[] = [
  { 
    id: 'usr-owner-1', 
    name: 'Pharmacy Owner', 
    email: 'owner@dhanvantari.com', 
    password: 'owner', 
    role: 'Owner', 
    phone: '9876543210', 
    active: true, 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'usr-admin-1', 
    name: 'System Admin', 
    email: 'admin@dhanvantari.com', 
    password: 'admin', 
    role: 'Admin', 
    phone: '9876543211', 
    active: true, 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'usr-pharm-1', 
    name: 'Rahul Pharmacist', 
    email: 'pharmacist@dhanvantari.com', 
    password: 'pharmacist', 
    role: 'Pharmacist', 
    phone: '9876543212', 
    active: true, 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'usr-cashier-1', 
    name: 'Priya Cashier', 
    email: 'cashier@dhanvantari.com', 
    password: 'cashier', 
    role: 'Cashier', 
    phone: '9876543213', 
    active: true, 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'usr-inv-1', 
    name: 'Amit Inventory', 
    email: 'inventory@dhanvantari.com', 
    password: 'inventory', 
    role: 'Inventory Manager', 
    phone: '9876543214', 
    active: true, 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'usr-viewer-1', 
    name: 'Auditor Viewer', 
    email: 'viewer@dhanvantari.com', 
    password: 'viewer', 
    role: 'Viewer', 
    phone: '9876543215', 
    active: true, 
    createdAt: new Date().toISOString() 
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usersList, setUsersList] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALL_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Enforce SINGLE Owner rule on loaded users list
          let ownerFound = false;
          const sanitized = parsed.map((u: User) => {
            if (u.role === 'Owner') {
              if (!ownerFound && (u.id === 'usr-owner-1' || u.email === 'owner@dhanvantari.com')) {
                ownerFound = true;
                return u;
              } else {
                // Change extra owners to Admin
                return { ...u, role: 'Admin' as UserRole };
              }
            }
            return u;
          });

          // Ensure owner@dhanvantari.com is present as Owner
          if (!ownerFound) {
            sanitized.unshift(initialDefaultUsers[0]);
          }

          return sanitized;
        }
      }
    } catch (e) {
      console.error('Failed to parse users from storage:', e);
    }
    return initialDefaultUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse current user from storage:', e);
    }
    return null;
  });

  // Sync usersList to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(usersList));
    } catch (e) {
      console.error('Failed to save users list:', e);
    }
  }, [usersList]);

  // Sync currentUser to localStorage whenever updated
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Failed to save current user:', e);
    }
  }, [currentUser]);

  const login = (emailInput: string, passwordInput: string): { success: boolean; message?: string } => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, message: 'Please provide both email/username and password.' };
    }

    const matchedUser = usersList.find(
      u => (u.email.toLowerCase() === cleanEmail || u.name.toLowerCase() === cleanEmail) && 
           (u.password === cleanPass || (!u.password && (cleanPass === 'admin' || cleanPass === 'owner')))
    );

    if (!matchedUser) {
      return { success: false, message: 'Invalid credentials. Please check your email and password.' };
    }

    if (!matchedUser.active) {
      return { success: false, message: 'This account has been deactivated. Please contact the Pharmacy Owner.' };
    }

    setCurrentUser(matchedUser);
    return { success: true };
  };

  // Public registration is disabled by specification
  const register = (): { success: boolean; message?: string } => {
    return { 
      success: false, 
      message: 'Public registration is disabled. New accounts must be created by the Pharmacy Owner.' 
    };
  };

  // Create new user (Owner or Admin authorized)
  const addUser = (data: { name: string; email: string; role: UserRole; phone: string; password: string }): { success: boolean; message?: string } => {
    if (!currentUser) return { success: false, message: 'Unauthorized action.' };

    // Check permission
    if (currentUser.role !== 'Owner' && currentUser.role !== 'Admin') {
      return { success: false, message: 'Only Owner or Admin can create new staff accounts.' };
    }

    const cleanEmail = data.email.trim().toLowerCase();
    if (!cleanEmail || !data.password || !data.name.trim()) {
      return { success: false, message: 'Name, Email, and Password are required.' };
    }

    // Single Owner Rule
    if (data.role === 'Owner') {
      return { success: false, message: 'There can only be one Owner account in the system.' };
    }

    const existing = usersList.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: data.name.trim(),
      email: cleanEmail,
      role: data.role,
      phone: data.phone?.trim() || '',
      password: data.password.trim(),
      active: true,
      createdAt: new Date().toISOString()
    };

    setUsersList(prev => [...prev, newUser]);
    return { success: true };
  };

  // Edit existing user
  const editUser = (id: string, data: { name: string; email: string; role: UserRole; phone: string }): { success: boolean; message?: string } => {
    if (!currentUser) return { success: false, message: 'Unauthorized action.' };

    const targetUser = usersList.find(u => u.id === id);
    if (!targetUser) return { success: false, message: 'User not found.' };

    // Cannot edit Owner unless you are the Owner
    if (targetUser.role === 'Owner' && currentUser.role !== 'Owner') {
      return { success: false, message: 'Only the Owner can edit the Owner account.' };
    }

    // Single Owner Rule: Cannot promote someone else to Owner
    if (data.role === 'Owner' && targetUser.role !== 'Owner') {
      return { success: false, message: 'There can only be one Owner account in the system.' };
    }

    // Owner role cannot be demoted
    if (targetUser.role === 'Owner' && data.role !== 'Owner') {
      return { success: false, message: 'The Owner account role cannot be changed.' };
    }

    const cleanEmail = data.email.trim().toLowerCase();
    const existing = usersList.find(u => u.email.toLowerCase() === cleanEmail && u.id !== id);
    if (existing) {
      return { success: false, message: 'Email address is already in use by another account.' };
    }

    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        const updated = {
          ...u,
          name: data.name.trim(),
          email: cleanEmail,
          role: data.role,
          phone: data.phone.trim()
        };
        // Update currentUser if modifying self
        if (currentUser.id === id) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));

    return { success: true };
  };

  // Delete User
  const deleteUser = (id: string): { success: boolean; message?: string } => {
    if (!currentUser) return { success: false, message: 'Unauthorized action.' };

    const targetUser = usersList.find(u => u.id === id);
    if (!targetUser) return { success: false, message: 'User not found.' };

    // Single Owner Rule
    if (targetUser.role === 'Owner') {
      return { success: false, message: 'The Pharmacy Owner account cannot be deleted.' };
    }

    // Admin cannot delete Owner or another Admin
    if (currentUser.role === 'Admin' && (targetUser.role === 'Owner' || targetUser.role === 'Admin')) {
      return { success: false, message: 'Admin cannot delete Owner or Admin accounts.' };
    }

    setUsersList(prev => prev.filter(u => u.id !== id));
    if (currentUser?.id === id) {
      setCurrentUser(null);
    }
    return { success: true };
  };

  // Disable / Enable User
  const toggleUserActive = (id: string): { success: boolean; message?: string } => {
    if (!currentUser) return { success: false, message: 'Unauthorized action.' };

    const targetUser = usersList.find(u => u.id === id);
    if (!targetUser) return { success: false, message: 'User not found.' };

    if (targetUser.role === 'Owner') {
      return { success: false, message: 'The Pharmacy Owner account cannot be deactivated.' };
    }

    if (currentUser.role === 'Admin' && targetUser.role === 'Admin') {
      return { success: false, message: 'Admin cannot deactivate another Admin account.' };
    }

    setUsersList(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
    return { success: true };
  };

  // Reset Password
  const resetPassword = (id: string, newPass: string): { success: boolean; message?: string } => {
    if (!currentUser) return { success: false, message: 'Unauthorized action.' };

    const targetUser = usersList.find(u => u.id === id);
    if (!targetUser) return { success: false, message: 'User not found.' };

    if (targetUser.role === 'Owner' && currentUser.role !== 'Owner') {
      return { success: false, message: 'Only the Owner can reset the Owner password.' };
    }

    if (!newPass.trim()) {
      return { success: false, message: 'New password cannot be empty.' };
    }

    setUsersList(prev => prev.map(u => u.id === id ? { ...u, password: newPass.trim() } : u));
    return { success: true };
  };

  // Assign Role
  const assignRole = (id: string, newRole: UserRole): { success: boolean; message?: string } => {
    if (!currentUser) return { success: false, message: 'Unauthorized action.' };

    const targetUser = usersList.find(u => u.id === id);
    if (!targetUser) return { success: false, message: 'User not found.' };

    if (targetUser.role === 'Owner') {
      return { success: false, message: 'The Owner role cannot be modified.' };
    }

    if (newRole === 'Owner') {
      return { success: false, message: 'There can only be one Owner account in the system.' };
    }

    setUsersList(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Strict RBAC Permissions Engine according to specification
  const hasPermission = (module: string, action: 'read' | 'write' | 'delete' | 'admin' = 'read'): boolean => {
    if (!currentUser || !currentUser.active) return false;
    const role = currentUser.role;

    // 1. OWNER: Full access to everything
    if (role === 'Owner') return true;

    // 2. ADMIN: Manage medicines, purchases, suppliers, customers, reports, users (except Owner).
    // Restricted from System Settings override.
    if (role === 'Admin') {
      if (module === 'System Settings') return false; // Strictly restricted to Owner
      return true;
    }

    // 3. PHARMACIST: Billing, Medicines, Inventory lookup, Customer management.
    // No access to system settings, user management, audit logs (Security), or Reports.
    if (role === 'Pharmacist') {
      if (
        module === 'System Settings' || 
        module === 'User Management' || 
        module === 'Security' || 
        module === 'Reports'
      ) {
        return false;
      }
      if (module === 'Billing' || module === 'Medicines' || module === 'Customers' || module === 'Dashboard' || module === 'Expiry') {
        return action === 'read' || action === 'write';
      }
      if (module === 'Purchases') {
        return action === 'read';
      }
      return false;
    }

    // 4. CASHIER: Billing only, Customer search, Print invoices. Cannot edit inventory.
    if (role === 'Cashier') {
      if (module === 'Billing') return true;
      if (module === 'Customers' || module === 'Dashboard') return action === 'read';
      return false; // Cannot edit inventory, no purchases, no settings, no user management, etc.
    }

    // 5. INVENTORY MANAGER: Purchase entry, Stock updates, Batch management, Expiry management. No billing.
    if (role === 'Inventory Manager') {
      if (module === 'Billing') return false; // No billing
      if (
        module === 'Medicines' || 
        module === 'Purchases' || 
        module === 'Batches' || 
        module === 'Expiry'
      ) {
        return action === 'read' || action === 'write';
      }
      if (module === 'Customers' || module === 'Dashboard') return action === 'read';
      return false;
    }

    // 6. VIEWER: Read-only access to basic modules. No write/create/billing/user management/settings.
    if (role === 'Viewer') {
      if (
        module === 'System Settings' || 
        module === 'User Management' || 
        module === 'Security' || 
        module === 'Billing'
      ) {
        return false;
      }
      return action === 'read';
    }

    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      register, 
      logout, 
      hasPermission, 
      usersList,
      addUser,
      editUser,
      deleteUser,
      toggleUserActive,
      resetPassword,
      assignRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
