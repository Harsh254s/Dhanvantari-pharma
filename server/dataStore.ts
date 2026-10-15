import { 
  User, Medicine, MedicineBatch, Customer, Supplier, SaleInvoice, 
  PurchaseInvoice, AlertItem, AuditLog, SystemSettings 
} from '../src/types';

export const initialSettings: SystemSettings = {
  pharmacyName: "Dhanvantari Pharmacy",
  tagline: "Your Trusted Quality Healthcare Partner",
  address: "Shop #12-14, Dhanvantari Medical Complex, Station Road, City Center, PIN-400001",
  phone: "+91 98765 43210",
  email: "care@dhanvantaripharmacy.com",
  gstNo: "27AABCD1234E1Z5",
  drugLicenseNo: "20B-MH-458921 / 21B-MH-458922",
  fefoEnabled: true,
  autoQuarantineExpired: true,
  loyaltyEarnRate: 100, // 1 point per 100 Rs
  loyaltyRedeemRate: 1,  // 1 point = 1 Rs
  receiptFooterMessage: "Get well soon! Medicines once sold can only be returned with valid bill within 7 days in original condition.",
  darkTheme: false,
};

export const initialUsers: User[] = [
  { id: 'usr-1', name: 'Dr. Rajesh Sharma', email: 'owner@dhanvantari.com', role: 'Owner', phone: '9876543210', active: true, createdAt: '2025-01-01T08:00:00Z' },
  { id: 'usr-2', name: 'Ananya Verma', email: 'admin@dhanvantari.com', role: 'Admin', phone: '9876543211', active: true, createdAt: '2025-01-02T08:00:00Z' },
  { id: 'usr-3', name: 'Suresh Patel (Reg Pharmacist)', email: 'pharmacist@dhanvantari.com', role: 'Pharmacist', phone: '9876543212', active: true, createdAt: '2025-01-05T08:00:00Z' },
  { id: 'usr-4', name: 'Rohan Gupta', email: 'cashier@dhanvantari.com', role: 'Cashier', phone: '9876543213', active: true, createdAt: '2025-01-10T08:00:00Z' },
  { id: 'usr-5', name: 'Vikas Singh', email: 'inventory@dhanvantari.com', role: 'Inventory Manager', phone: '9876543214', active: true, createdAt: '2025-01-12T08:00:00Z' },
];

export const initialSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'USV Private Limited Depo',
    phone: '9819933445',
    email: 'orders@usvdepo.in',
    gstNumber: '24AAACU1234F1Z3',
    drugLicense: 'DL-20B-77881',
    address: 'Plot No. 538-540, GIDC Indl. Area, Savli, Vadodara, Gujarat',
    outstandingAmount: 18500,
    createdAt: '2025-01-15T09:00:00Z'
  },
  {
    id: 'sup-2',
    name: 'Sun Pharma Distributors Pvt Ltd',
    phone: '9820011223',
    email: 'distribution@sunpharma.in',
    gstNumber: '27AAAAA0000A1Z5',
    drugLicense: 'DL-20B-10021',
    address: 'Sun House, Plot No. 201 B/1, Western Express Highway, Goregaon East, Mumbai',
    outstandingAmount: 24200,
    createdAt: '2025-01-10T09:00:00Z'
  },
  {
    id: 'sup-3',
    name: 'Micro Labs C&F Agency',
    phone: '9845011990',
    email: 'orders@microlabs.in',
    gstNumber: '29AABCM9988D1Z2',
    drugLicense: 'DL-20B-22991',
    address: 'No. 27, Race Course Road, Bangalore, Karnataka',
    outstandingAmount: 0,
    createdAt: '2025-01-12T09:00:00Z'
  },
  {
    id: 'sup-4',
    name: 'GlaxoSmithKline Healthcare Distributors',
    phone: '9820144556',
    email: 'supply@gskindia.com',
    gstNumber: '27AAACG1122K1Z9',
    drugLicense: 'DL-20B-33445',
    address: 'GSK House, Dr. Annie Besant Road, Worli, Mumbai',
    outstandingAmount: 12400,
    createdAt: '2025-01-08T09:00:00Z'
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Rahul S. Mehta',
    phone: '9820199882',
    email: 'rahul.mehta@gmail.com',
    loyaltyPoints: 140,
    pendingAmount: 0,
    createdAt: '2025-02-01T10:00:00Z'
  },
  {
    id: 'cust-2',
    name: 'Smt. Sunita Devi',
    phone: '9871100223',
    email: 'sunita.d@yahoo.com',
    loyaltyPoints: 85,
    pendingAmount: 320,
    createdAt: '2025-02-10T10:00:00Z'
  },
  {
    id: 'cust-3',
    name: 'Amitabh Sen',
    phone: '9892233445',
    email: 'amitabh.sen@rediffmail.com',
    loyaltyPoints: 210,
    pendingAmount: 0,
    createdAt: '2025-02-15T10:00:00Z'
  }
];

export const initialMedicines: Medicine[] = [
  {
    id: 'med-1',
    name: 'Glycomet-GP 1 Tablet',
    genericName: 'Metformin Hydrochloride (PR) & Glimepiride Tablets IP',
    brand: 'Glycomet-GP',
    manufacturer: 'USV Private Limited',
    category: 'Tablet',
    dosageForm: 'Prolonged Release Tablet',
    strength: '500mg + 1mg',
    composition: 'Metformin HCl Prolonged-Release 500mg + Glimepiride IP 1mg',
    packSize: '15 Tablets',
    storageConditions: 'Protect from moisture and excessive heat. Store below 25°C',
    gstPercentage: 12,
    hsnCode: '30049099',
    prescriptionRequired: true,
    scheduleType: 'Schedule H',
    barcode: '8901117283910',
    description: 'Oral antidiabetic medication for Type 2 diabetes mellitus management.',
    rackLocation: 'Rack B-03',
    minStockLevel: 25,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z'
  },
  {
    id: 'med-2',
    name: 'Dolo 650mg Tablet',
    genericName: 'Paracetamol Tablets IP 650mg',
    brand: 'Dolo',
    manufacturer: 'Micro Labs Limited',
    category: 'Tablet',
    dosageForm: 'Oral Tablet',
    strength: '650mg',
    composition: 'Paracetamol IP 650mg',
    packSize: '15 Tablets',
    storageConditions: 'Store in cool and dry place below 30°C',
    gstPercentage: 12,
    hsnCode: '30049060',
    prescriptionRequired: false,
    scheduleType: 'OTC',
    barcode: '8901234567890',
    description: 'Antipyretic and analgesic for relief of fever and mild to moderate pain.',
    rackLocation: 'Rack A-01',
    minStockLevel: 50,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z'
  },
  {
    id: 'med-3',
    name: 'Augmentin 625 Duo Tablet',
    genericName: 'Amoxycillin and Potassium Clavulanate Tablets IP',
    brand: 'Augmentin',
    manufacturer: 'GlaxoSmithKline Pharmaceuticals Ltd',
    category: 'Tablet',
    dosageForm: 'Film-coated Tablet',
    strength: '500mg + 125mg',
    composition: 'Amoxicillin Trihydrate IP eq to Amoxicillin 500mg + Potassium Clavulanate 125mg',
    packSize: '10 Tablets',
    storageConditions: 'Store below 25°C in a dry place',
    gstPercentage: 12,
    hsnCode: '30041010',
    prescriptionRequired: true,
    scheduleType: 'Schedule H1',
    barcode: '8901456789012',
    description: 'Broad-spectrum antibiotic used to treat bacterial infections.',
    rackLocation: 'Rack C-02',
    minStockLevel: 20,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z'
  },
  {
    id: 'med-4',
    name: 'Pan-D Capsule',
    genericName: 'Pantoprazole Gastro-resistant and Domperidone PR Capsules',
    brand: 'Pan-D',
    manufacturer: 'Alkem Laboratories Ltd',
    category: 'Capsule',
    dosageForm: 'Hard Gelatin Capsule',
    strength: '40mg + 30mg',
    composition: 'Pantoprazole Sodium IP 40mg + Domperidone 30mg SR',
    packSize: '15 Capsules',
    storageConditions: 'Store protected from light and moisture',
    gstPercentage: 12,
    hsnCode: '30049099',
    prescriptionRequired: true,
    scheduleType: 'Schedule H',
    barcode: '8901678901234',
    description: 'Relief of acid reflux, heartburn, GERD, and nausea/vomiting.',
    rackLocation: 'Rack B-01',
    minStockLevel: 30,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z'
  },
  {
    id: 'med-5',
    name: 'Telma 40 AM Tablet',
    genericName: 'Telmisartan and Amlodipine Tablets IP',
    brand: 'Telma',
    manufacturer: 'Glenmark Pharmaceuticals Ltd',
    category: 'Tablet',
    dosageForm: 'Uncoated Tablet',
    strength: '40mg + 5mg',
    composition: 'Telmisartan IP 40mg + Amlodipine Besilate IP eq to Amlodipine 5mg',
    packSize: '15 Tablets',
    storageConditions: 'Store below 25°C. Protect from light.',
    gstPercentage: 12,
    hsnCode: '30049099',
    prescriptionRequired: true,
    scheduleType: 'Schedule H',
    barcode: '8901890123456',
    description: 'Antihypertensive combination medicine for high blood pressure control.',
    rackLocation: 'Rack C-05',
    minStockLevel: 20,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z'
  }
];

export const initialBatches: MedicineBatch[] = [
  {
    id: 'batch-1',
    medicineId: 'med-1',
    batchNumber: 'USV-8492',
    mfgDate: '2025-01-01',
    expiryDate: '2026-12-31',
    purchaseDate: '2025-01-15',
    purchasePrice: 105.00,
    sellingPrice: 140.00,
    mrp: 145.00,
    supplierId: 'sup-1',
    supplierName: 'USV Private Limited Depo',
    invoiceNumber: 'INV-USV-9901',
    initialQuantity: 100,
    currentQuantity: 80,
    warehouse: 'Main Store',
    rackNumber: 'Rack B-03',
    status: 'Active'
  },
  {
    id: 'batch-2',
    medicineId: 'med-2',
    batchNumber: 'DL-650-882',
    mfgDate: '2024-05-01',
    expiryDate: '2027-04-30',
    purchaseDate: '2024-05-20',
    purchasePrice: 22.00,
    sellingPrice: 30.00,
    mrp: 32.00,
    supplierId: 'sup-3',
    supplierName: 'Micro Labs C&F Agency',
    invoiceNumber: 'INV-ML-4411',
    initialQuantity: 200,
    currentQuantity: 165,
    warehouse: 'Main Store',
    rackNumber: 'Rack A-01',
    status: 'Active'
  },
  {
    id: 'batch-3',
    medicineId: 'med-3',
    batchNumber: 'GSK-9921',
    mfgDate: '2024-03-01',
    expiryDate: '2026-02-28',
    purchaseDate: '2024-03-25',
    purchasePrice: 168.00,
    sellingPrice: 215.00,
    mrp: 223.50,
    supplierId: 'sup-4',
    supplierName: 'GlaxoSmithKline Healthcare Distributors',
    invoiceNumber: 'INV-GSK-3301',
    initialQuantity: 50,
    currentQuantity: 38,
    warehouse: 'Main Store',
    rackNumber: 'Rack C-02',
    status: 'Active'
  },
  {
    id: 'batch-4',
    medicineId: 'med-4',
    batchNumber: 'PND-9921',
    mfgDate: '2024-01-01',
    expiryDate: '2025-12-31',
    purchaseDate: '2024-01-20',
    purchasePrice: 145.00,
    sellingPrice: 190.00,
    mrp: 199.00,
    supplierId: 'sup-2',
    supplierName: 'Sun Pharma Distributors Pvt Ltd',
    invoiceNumber: 'INV-SUN-1192',
    initialQuantity: 80,
    currentQuantity: 55,
    warehouse: 'Main Store',
    rackNumber: 'Rack B-01',
    status: 'Active'
  },
  {
    id: 'batch-5',
    medicineId: 'med-5',
    batchNumber: 'T40-KJ22',
    mfgDate: '2023-08-01',
    expiryDate: '2025-07-31',
    purchaseDate: '2023-08-25',
    purchasePrice: 135.00,
    sellingPrice: 175.00,
    mrp: 184.00,
    supplierId: 'sup-2',
    supplierName: 'Sun Pharma Distributors Pvt Ltd',
    invoiceNumber: 'INV-SUN-1004',
    initialQuantity: 60,
    currentQuantity: 42,
    warehouse: 'Main Store',
    rackNumber: 'Rack C-05',
    status: 'Active'
  }
];

export const initialSales: SaleInvoice[] = [];
export const initialPurchases: PurchaseInvoice[] = [];
export const initialAlerts: AlertItem[] = [];
export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-seed-1',
    timestamp: new Date().toISOString(),
    userId: 'usr-admin',
    userName: 'Administrator',
    userRole: 'Admin',
    action: 'System Initialized',
    module: 'System Settings',
    details: 'Dhanvantari Pharmacy ERP Database initialized with standard inventory master'
  }
];
