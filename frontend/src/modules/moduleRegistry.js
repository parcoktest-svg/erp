export const modules = [
  {
    id: 'core',
    title: 'Core Setup',
    description: 'Setup perusahaan, organisasi, dan penomoran dokumen.',
    flow: ['Create Company', 'Create Org', 'Setup Document Sequence'],
    pages: [
      { title: 'Companies', description: 'Buat dan pilih company', to: '/modules/core/companies' },
      { title: 'Organizations', description: 'Buat dan pilih org per company', to: '/modules/core/orgs' }
    ],
    match: ['/api/core/']
  },
  {
    id: 'masterdata',
    title: 'Master Data',
    description: 'Data master untuk transaksi: Product, BP, Warehouse, UoM, Currency, Tax, Price List.',
    flow: ['Create UoM', 'Create Warehouse', 'Create Product', 'Create Business Partner', 'Create Tax Rate', 'Create Price List'],
    pages: [
      { title: 'UoM', description: 'Satuan unit (PCS, KG, LTR)', to: '/modules/masterdata/uoms' },
      { title: 'Business Partners', description: 'Customer/Vendor', to: '/modules/masterdata/business-partners' },
      { title: 'Currencies', description: 'Mata uang untuk price list', to: '/modules/masterdata/currencies' },
      { title: 'Products', description: 'Buat produk untuk transaksi', to: '/modules/masterdata/products' },
      { title: 'Warehouses', description: 'Gudang untuk inventory', to: '/modules/masterdata/warehouses' },
      { title: 'Price Lists', description: 'Price list dan version', to: '/modules/masterdata/price-lists' }
    ],
    match: ['/api/masterdata/']
  },
  {
    id: 'purchase',
    title: 'Purchase',
    description: 'Alur pembelian dari Purchase Order sampai Goods Receipt.',
    flow: ['Create Purchase Order', 'Receive Goods (Goods Receipt)'],
    pages: [
      { title: 'Purchase Orders', description: 'Buat dan lihat PO', to: '/modules/purchase/purchase-orders' }
    ],
    match: ['/api/purchase/']
  },
  {
    id: 'sales',
    title: 'Sales',
    description: 'Alur penjualan dari Sales Order sampai Goods Shipment.',
    flow: ['Create Sales Order', 'Ship Goods (Goods Shipment)'],
    pages: [
      { title: 'Sales Orders', description: 'Buat dan lihat SO', to: '/modules/sales/sales-orders' }
    ],
    match: ['/api/sales/']
  },
  {
    id: 'inventory',
    title: 'Inventory',
    description: 'Manajemen stok: on-hand, locator, movement, adjustment.',
    flow: ['Setup Locator', 'Check On-hand', 'Inventory Movement', 'Inventory Adjustment (Complete/Void)'],
    pages: [
      { title: 'Warehouses', description: 'Gudang untuk stok', to: '/modules/masterdata/warehouses' },
      { title: 'Locators', description: 'Rak/lokasi per warehouse', to: '/modules/inventory/locators' },
      { title: 'On-hand', description: 'Cek stok per locator & product', to: '/modules/inventory/onhand' },
      { title: 'Movements', description: 'IN/OUT/TRANSFER stok', to: '/modules/inventory/movements' },
      { title: 'Adjustments', description: 'Stock opname + jurnal', to: '/modules/inventory/adjustments' }
    ],
    match: ['/api/inventory/']
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing',
    description: 'BOM, Work Order, dan laporan produksi.',
    flow: ['Create BOM', 'Create Work Order', 'Complete/Void Work Order', 'Manufacturing Reports'],
    pages: [
      { title: 'BOMs', description: 'Buat Bill of Materials (finished good + komponen)', to: '/modules/manufacturing/boms' },
      { title: 'Work Orders', description: 'Buat dan proses Work Order (complete/void)', to: '/modules/manufacturing/work-orders' },
      { title: 'Reports', description: 'WIP dan estimasi biaya produksi', to: '/modules/manufacturing/reports' }
    ],
    match: ['/api/manufacturing/']
  },
  {
    id: 'finance',
    title: 'Finance',
    description: 'Accounting/Finance: GL Account, Journal, Invoice, Payment, Bank, Budget, Period, Reports.',
    flow: ['Setup Fiscal Year/Period', 'Seed GL Accounts', 'Post Invoice', 'Receive/Make Payment', 'Reconcile Bank Statement', 'Run Reports'],
    pages: [
      { title: 'GL Accounts', description: 'Chart of Accounts (create + seed defaults)', to: '/modules/finance/gl-accounts' },
      { title: 'Periods', description: 'Fiscal Year & Accounting Period (open/close)', to: '/modules/finance/periods' },
      { title: 'Reports', description: 'Aging, GL Summary, Trial Balance, P/L, Balance Sheet', to: '/modules/finance/reports' }
    ],
    match: ['/api/finance/']
  },
  {
    id: 'hr',
    title: 'HR',
    description: 'HR Operations: Employee, Department, Attendance, Leave, Performance, Payroll.',
    flow: ['Create Department', 'Create Employee', 'Mark Attendance', 'Leave Request & Approval', 'Performance Review', 'Payslip/Salary'],
    pages: [
      { title: 'Departments', description: 'Setup department untuk struktur organisasi', to: '/modules/hr/departments' },
      { title: 'Employees', description: 'Master data employee (role, dept, salary, active)', to: '/modules/hr/employees' }
    ],
    match: ['/api/employees', '/api/departments', '/api/attendance', '/api/leaves', '/api/performance-reviews', '/api/payslips', '/api/salaries']
  },
  {
    id: 'admin',
    title: 'Admin',
    description: 'User management (khusus ADMIN).',
    flow: ['Create User', 'Update User', 'Reset Password', 'Change Status', 'List Users'],
    pages: [{ title: 'Users', description: 'Create/update user, reset password, change status, delete', to: '/modules/admin/users' }],
    match: ['/admin/']
  }
]

export function findModule(id) {
  return modules.find((m) => m.id === id) || null
}

export function matchEndpointToModule(endpointPath, moduleDef) {
  return (moduleDef?.match || []).some((prefix) => endpointPath.startsWith(prefix))
}
