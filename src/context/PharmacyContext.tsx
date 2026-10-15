import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Medicine, MedicineBatch, Customer, Supplier, SaleInvoice, 
  PurchaseInvoice, AlertItem, AuditLog, SystemSettings, MedicineStripScanResult
} from '../types';
import { 
  initialSettings, initialMedicines, initialBatches, 
  initialSuppliers, initialCustomers, initialAuditLogs 
} from '../../server/dataStore';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface PharmacyContextType {
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;
  medicines: Medicine[];
  batches: MedicineBatch[];
  customers: Customer[];
  suppliers: Supplier[];
  sales: SaleInvoice[];
  purchases: PurchaseInvoice[];
  alerts: AlertItem[];
  auditLogs: AuditLog[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scannerConnected: boolean;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
  recordSale: (saleData: any) => Promise<SaleInvoice>;
  recordPurchase: (purchaseData: any) => Promise<PurchaseInvoice>;
  addMedicine: (medData: any) => Promise<Medicine>;
  updateMedicine: (id: string, medData: any) => Promise<void>;
  addBatch: (batchData: any) => Promise<MedicineBatch>;
  addCustomer: (custData: any) => Promise<Customer>;
  addSupplier: (supData: any) => Promise<Supplier>;
  markAlertRead: (alertId: string) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  scannedCode: string | null;
  setScannedCode: (code: string | null) => void;
  isStripScanOpen: boolean;
  setIsStripScanOpen: (open: boolean) => void;
  scanMedicineStrip: (base64Data?: string, rawText?: string) => Promise<MedicineStripScanResult>;
  isBarcodeScanOpen: boolean;
  setIsBarcodeScanOpen: (open: boolean) => void;
  scanBarcodeImage: (base64Data?: string, rawText?: string) => Promise<any>;
  userGeminiKey: string;
  setUserGeminiKey: (key: string) => void;
  exportDatabaseJSON: () => string;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

// Helper to safely parse JSON from responses without crashing on HTML 404/500
async function parseResponseJson<T = any>(res: Response, defaultError: string): Promise<T> {
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    if (res.status === 404 || text.includes('The page could not be found') || text.includes('404: NOT_FOUND')) {
      throw new Error(
        "Backend API route returned 404 (Not Found). On Vercel, ensure vercel.json is deployed and GEMINI_API_KEY is configured in Vercel Project Settings > Environment Variables."
      );
    }
    if (res.status >= 500) {
      throw new Error(`Server error (${res.status}): ${text.slice(0, 150)}`);
    }
    throw new Error(`Invalid server response (${res.status}): ${text.slice(0, 120)}`);
  }

  if (!res.ok) {
    throw new Error(json?.error || json?.message || defaultError);
  }
  return json as T;
}

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SystemSettings>(initialSettings);
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [batches, setBatches] = useState<MedicineBatch[]>(initialBatches);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [sales, setSales] = useState<SaleInvoice[]>([]);
  const [purchases, setPurchases] = useState<PurchaseInvoice[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [scannerConnected] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [isStripScanOpen, setIsStripScanOpen] = useState<boolean>(false);
  const [isBarcodeScanOpen, setIsBarcodeScanOpen] = useState<boolean>(false);

  // User-provided Gemini API key stored in localStorage (useful if Vercel env var wasn't set)
  const [userGeminiKey, setUserGeminiKeyState] = useState<string>(() => {
    try {
      return localStorage.getItem('dhanvantari_gemini_key') || '';
    } catch {
      return '';
    }
  });

  const setUserGeminiKey = (key: string) => {
    setUserGeminiKeyState(key);
    try {
      if (key) {
        localStorage.setItem('dhanvantari_gemini_key', key);
      } else {
        localStorage.removeItem('dhanvantari_gemini_key');
      }
    } catch (e) {
      console.warn("Could not save Gemini key to localStorage", e);
    }
  };

  const getHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (userGeminiKey) {
      headers['x-gemini-key'] = userGeminiKey;
    }
    return headers;
  };

  const scanMedicineStrip = async (base64Data?: string, rawText?: string): Promise<MedicineStripScanResult> => {
    const res = await fetch('/api/ocr/scan-strip', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ base64Data, rawText, userApiKey: userGeminiKey || undefined })
    });
    return await parseResponseJson<MedicineStripScanResult>(res, 'Failed to scan medicine strip');
  };

  const scanBarcodeImage = async (base64Data?: string, rawText?: string): Promise<any> => {
    const res = await fetch('/api/ocr/scan-barcode-image', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ base64Data, rawText, userApiKey: userGeminiKey || undefined })
    });
    return await parseResponseJson(res, 'Failed to read barcode from image');
  };

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch data safely from backend API with fallback to initial data
  const refreshData = useCallback(async () => {
    const safeFetch = async (url: string) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      } catch {
        return null;
      }
    };

    try {
      const [sRes, mRes, bRes, cRes, supRes, saleRes, purRes, altRes, logRes] = await Promise.all([
        safeFetch('/api/settings'),
        safeFetch('/api/medicines'),
        safeFetch('/api/batches'),
        safeFetch('/api/customers'),
        safeFetch('/api/suppliers'),
        safeFetch('/api/sales'),
        safeFetch('/api/purchases'),
        safeFetch('/api/expiry/alerts'),
        safeFetch('/api/audit-logs')
      ]);

      if (sRes && typeof sRes === 'object') setSettings(sRes);
      if (Array.isArray(mRes) && mRes.length > 0) setMedicines(mRes);
      if (Array.isArray(bRes) && bRes.length > 0) setBatches(bRes);
      if (Array.isArray(cRes) && cRes.length > 0) setCustomers(cRes);
      if (Array.isArray(supRes) && supRes.length > 0) setSuppliers(supRes);
      if (Array.isArray(saleRes)) setSales(saleRes);
      if (Array.isArray(purRes)) setPurchases(purRes);
      if (Array.isArray(altRes)) setAlerts(altRes);
      if (Array.isArray(logRes) && logRes.length > 0) setAuditLogs(logRes);
    } catch (err) {
      console.warn("Server API sync warning, using local state cache:", err);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Dark theme class handler
  useEffect(() => {
    if (settings.darkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkTheme]);

  // Global Barcode Scanner & Keyboard Shortcuts Listener
  useEffect(() => {
    let buffer = '';
    let timeoutId: any = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setActiveTab('billing');
        addToast('Switched to Fast Billing Counter [F2]', 'info');
        return;
      }
      if (e.key === 'F4' || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setIsSearchOpen(true);
        return;
      }
      if (e.key === 'F9') {
        e.preventDefault();
        setActiveTab('expiry');
        addToast('Opened Expiry Engine [F9]', 'info');
        return;
      }

      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName);
      
      if (e.key === 'Enter') {
        if (buffer.length >= 4) {
          const code = buffer;
          buffer = '';
          setScannedCode(code);
          addToast(`Barcode Scanned: ${code}`, 'success');
          if (activeTab !== 'billing' && activeTab !== 'medicines') {
            setActiveTab('billing');
          }
        }
        buffer = '';
        return;
      }

      if (!isInput && e.key.length === 1) {
        buffer += e.key;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          buffer = '';
        }, 150);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [activeTab, addToast]);

  const updateSettings = async (newSet: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSet }));
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newSet)
      });
      const updated = await parseResponseJson(res, 'Failed to update settings');
      setSettings(updated);
    } catch {
      // Local state already updated
    }
    addToast('System settings updated successfully', 'success');
  };

  const recordSale = async (saleData: any): Promise<SaleInvoice> => {
    try {
      const res = await fetch('/api/billing/sale', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(saleData)
      });
      const newSale = await parseResponseJson<SaleInvoice>(res, 'Sale recording failed');
      await refreshData();
      addToast(`Invoice #${newSale.invoiceNo} generated! (₹${newSale.grandTotal.toFixed(2)})`, 'success');
      return newSale;
    } catch (err: any) {
      // Offline fallback: generate invoice in local state
      const invoiceNo = `DHN-${new Date().getFullYear()}-${String(sales.length + 101).padStart(4, '0')}`;
      const localSale: SaleInvoice = {
        ...saleData,
        id: 'sale-' + Date.now(),
        invoiceNo,
        createdAt: new Date().toISOString()
      };
      setSales(prev => [localSale, ...prev]);

      // Deduct batches in local state
      setBatches(prev => prev.map(b => {
        const item = saleData.items.find((it: any) => it.batchId === b.id);
        if (item) {
          const newQty = Math.max(0, b.currentQuantity - item.quantity);
          return { ...b, currentQuantity: newQty, status: newQty === 0 ? 'Low' : b.status };
        }
        return b;
      }));

      addToast(`Invoice #${localSale.invoiceNo} generated (local mode)`, 'success');
      return localSale;
    }
  };

  const recordPurchase = async (purchaseData: any): Promise<PurchaseInvoice> => {
    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(purchaseData)
      });
      const newPur = await parseResponseJson<PurchaseInvoice>(res, 'Purchase entry failed');
      await refreshData();
      addToast(`Purchase Invoice #${newPur.invoiceNo} recorded successfully!`, 'success');
      return newPur;
    } catch (err: any) {
      const invoiceNo = purchaseData.invoiceNumber || `PUR-${Date.now()}`;
      const localPur: PurchaseInvoice = {
        ...purchaseData,
        id: 'pur-' + Date.now(),
        invoiceNo,
        createdAt: new Date().toISOString()
      };
      setPurchases(prev => [localPur, ...prev]);
      addToast(`Purchase Invoice #${localPur.invoiceNo} saved (local mode)`, 'success');
      return localPur;
    }
  };

  const addMedicine = async (medData: any): Promise<Medicine> => {
    const newMedItem: Medicine = {
      ...medData,
      id: medData.id || ('med-' + Date.now()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMedicines(prev => [newMedItem, ...prev]);

    try {
      const res = await fetch('/api/medicines', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(medData)
      });
      const serverMed = await parseResponseJson(res, 'Add medicine failed');
      setMedicines(prev => prev.map(m => m.id === newMedItem.id ? serverMed : m));
    } catch {
      // Local state already updated
    }
    addToast(`Added medicine ${newMedItem.name}`, 'success');
    return newMedItem;
  };

  const updateMedicine = async (id: string, medData: any) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...medData, updatedAt: new Date().toISOString() } : m));
    try {
      await fetch(`/api/medicines/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(medData)
      });
    } catch {
      // Local state already updated
    }
    addToast(`Updated medicine details`, 'success');
  };

  const addBatch = async (batchData: any): Promise<MedicineBatch> => {
    const newBItem: MedicineBatch = {
      ...batchData,
      id: batchData.id || ('batch-' + Date.now()),
      status: batchData.status || 'Active'
    };
    setBatches(prev => [newBItem, ...prev]);

    try {
      const res = await fetch('/api/batches', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(batchData)
      });
      const serverB = await parseResponseJson(res, 'Add batch failed');
      setBatches(prev => prev.map(b => b.id === newBItem.id ? serverB : b));
    } catch {
      // Local state already updated
    }
    addToast(`Added batch ${newBItem.batchNumber}`, 'success');
    return newBItem;
  };

  const addCustomer = async (custData: any): Promise<Customer> => {
    const newCItem: Customer = {
      ...custData,
      id: custData.id || ('cust-' + Date.now()),
      loyaltyPoints: custData.loyaltyPoints || 0,
      pendingAmount: custData.pendingAmount || 0,
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => [newCItem, ...prev]);

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(custData)
      });
      const serverC = await parseResponseJson(res, 'Add customer failed');
      setCustomers(prev => prev.map(c => c.id === newCItem.id ? serverC : c));
    } catch {
      // Local state already updated
    }
    addToast(`Added customer ${newCItem.name}`, 'success');
    return newCItem;
  };

  const addSupplier = async (supData: any): Promise<Supplier> => {
    const newSItem: Supplier = {
      ...supData,
      id: supData.id || ('sup-' + Date.now()),
      outstandingAmount: supData.outstandingAmount || 0,
      createdAt: new Date().toISOString()
    };
    setSuppliers(prev => [newSItem, ...prev]);

    try {
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(supData)
      });
      const serverS = await parseResponseJson(res, 'Add supplier failed');
      setSuppliers(prev => prev.map(s => s.id === newSItem.id ? serverS : s));
    } catch {
      // Local state already updated
    }
    addToast(`Added supplier ${newSItem.name}`, 'success');
    return newSItem;
  };

  const markAlertRead = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'read' } : a));
  };

  const exportDatabaseJSON = () => {
    return JSON.stringify({
      version: "1.0",
      exportedAt: new Date().toISOString(),
      pharmacy: settings,
      medicines,
      batches,
      suppliers,
      customers,
      sales,
      purchases,
      auditLogs
    }, null, 2);
  };

  return (
    <PharmacyContext.Provider value={{
      settings, updateSettings, medicines, batches, customers, suppliers,
      sales, purchases, alerts, auditLogs, activeTab, setActiveTab, scannerConnected,
      toasts, addToast, removeToast, refreshData, recordSale, recordPurchase,
      addMedicine, updateMedicine, addBatch, addCustomer, addSupplier, markAlertRead,
      globalSearchQuery, setGlobalSearchQuery, isSearchOpen, setIsSearchOpen,
      scannedCode, setScannedCode, isStripScanOpen, setIsStripScanOpen, scanMedicineStrip,
      isBarcodeScanOpen, setIsBarcodeScanOpen, scanBarcodeImage,
      userGeminiKey, setUserGeminiKey, exportDatabaseJSON
    }}>
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) throw new Error('usePharmacy must be used within a PharmacyProvider');
  return context;
};
