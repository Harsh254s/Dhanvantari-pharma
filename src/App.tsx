import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PharmacyProvider, usePharmacy } from './context/PharmacyContext';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer } from './components/ToastContainer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { MedicineStripScannerModal } from './components/MedicineStripScannerModal';
import { BarcodeImageScannerModal } from './components/BarcodeImageScannerModal';
import { LoginScreen } from './components/LoginScreen';

import { DashboardView } from './components/DashboardView';
import { BillingView } from './components/BillingView';
import { MedicinesView } from './components/MedicinesView';
import { PurchasesView } from './components/PurchasesView';
import { ExpiryView } from './components/ExpiryView';
import { CustomersSuppliersView } from './components/CustomersSuppliersView';
import { ReportsView } from './components/ReportsView';
import { UserManagementView } from './components/UserManagementView';
import { SecurityAuditView } from './components/SecurityAuditView';
import { SettingsDocsView } from './components/SettingsDocsView';
import { AccessDeniedView } from './components/AccessDeniedView';

const TAB_MODULE_MAP: Record<string, { module: string; name: string }> = {
  dashboard: { module: 'Dashboard', name: 'Dashboard' },
  billing: { module: 'Billing', name: 'Billing Counter' },
  medicines: { module: 'Medicines', name: 'Medicines & Batches' },
  purchases: { module: 'Purchases', name: 'Purchases & AI OCR' },
  expiry: { module: 'Expiry', name: 'Expiry Engine' },
  directory: { module: 'Customers', name: 'Customers & Suppliers' },
  reports: { module: 'Reports', name: 'Reports & Analytics' },
  users: { module: 'User Management', name: 'User Management' },
  security: { module: 'Security', name: 'Security & Audit' },
  settings: { module: 'System Settings', name: 'System & Docs' },
};

const MainContent: React.FC = () => {
  const { activeTab, settings } = usePharmacy();
  const { currentUser, hasPermission } = useAuth();

  if (!currentUser) {
    return (
      <div className={settings.darkTheme ? 'dark' : ''}>
        <LoginScreen />
        <ToastContainer />
      </div>
    );
  }

  const tabConfig = TAB_MODULE_MAP[activeTab] || { module: 'Dashboard', name: 'Dashboard' };
  const canAccessTab = hasPermission(tabConfig.module, 'read');

  const renderActiveView = () => {
    if (!canAccessTab) {
      return <AccessDeniedView moduleName={tabConfig.name} />;
    }

    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'billing': return <BillingView />;
      case 'medicines': return <MedicinesView />;
      case 'purchases': return <PurchasesView />;
      case 'expiry': return <ExpiryView />;
      case 'directory': return <CustomersSuppliersView />;
      case 'reports': return <ReportsView />;
      case 'users': return <UserManagementView />;
      case 'security': return <SecurityAuditView />;
      case 'settings': return <SettingsDocsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors ${settings.darkTheme ? 'dark' : ''}`}>
      <Header />
      <Navbar />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 lg:pb-8">
        {renderActiveView()}
      </main>

      <MobileBottomNav />

      <ToastContainer />
      <GlobalSearchModal />
      <MedicineStripScannerModal />
      <BarcodeImageScannerModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PharmacyProvider>
        <MainContent />
      </PharmacyProvider>
    </AuthProvider>
  );
}
