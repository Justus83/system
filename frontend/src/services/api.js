import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Products API
export const productsAPI = {
  // Smartphones
  getSmartphones: () => api.get('/smartphones'),
  getSmartphonesByStore: (storeId) => api.get(`/smartphones/store/${storeId}`),
  getSmartphone: (id) => api.get(`/smartphones/${id}`),
  createSmartphone: (data) => api.post('/smartphones', data),
  updateSmartphone: (id, data) => api.put(`/smartphones/${id}`, data),
  deleteSmartphone: (id) => api.delete(`/smartphones/${id}`),
  
  // Laptops
  getLaptops: () => api.get('/laptops'),
  getLaptopsByStore: (storeId) => api.get(`/laptops/store/${storeId}`),
  getLaptop: (id) => api.get(`/laptops/${id}`),
  createLaptop: (data) => api.post('/laptops', data),
  updateLaptop: (id, data) => api.put(`/laptops/${id}`, data),
  deleteLaptop: (id) => api.delete(`/laptops/${id}`),
  
  // Tablets
  getTablets: () => api.get('/tablets'),
  getTabletsByStore: (storeId) => api.get(`/tablets/store/${storeId}`),
  getTablet: (id) => api.get(`/tablets/${id}`),
  createTablet: (data) => api.post('/tablets', data),
  updateTablet: (id, data) => api.put(`/tablets/${id}`, data),
  deleteTablet: (id) => api.delete(`/tablets/${id}`),
  
  // Smartwatches
  getSmartwatches: () => api.get('/smartwatches'),
  getSmartwatchesByStore: (storeId) => api.get(`/smartwatches/store/${storeId}`),
  getSmartwatch: (id) => api.get(`/smartwatches/${id}`),
  createSmartwatch: (data) => api.post('/smartwatches', data),
  updateSmartwatch: (id, data) => api.put(`/smartwatches/${id}`, data),
  deleteSmartwatch: (id) => api.delete(`/smartwatches/${id}`),
  
  // TVs
  getTVs: () => api.get('/tvs'),
  getTVsByStore: (storeId) => api.get(`/tvs/store/${storeId}`),
  getTV: (id) => api.get(`/tvs/${id}`),
  createTV: (data) => api.post('/tvs', data),
  updateTV: (id, data) => api.put(`/tvs/${id}`, data),
  deleteTV: (id) => api.delete(`/tvs/${id}`),
  
  // Accessories
  getAccessories: () => api.get('/accessories'),
  getAccessoriesByStore: (storeId) => api.get(`/accessories/store/${storeId}`),
  getAccessory: (id) => api.get(`/accessories/${id}`),
  createAccessory: (data) => api.post('/accessories', data),
  updateAccessory: (id, data) => api.put(`/accessories/${id}`, data),
  deleteAccessory: (id) => api.delete(`/accessories/${id}`),
};

// Sales API
export const salesAPI = {
  getSales: () => api.get('/electronic-sales'),
  getSalesByStore: (storeId) => api.get(`/electronic-sales/store/${storeId}`),
  getSale: (id) => api.get(`/electronic-sales/${id}`),
  createSale: (data) => api.post('/electronic-sales', data),
  updateSale: (id, data) => api.put(`/electronic-sales/${id}`, data),
  deleteSale: (id) => api.delete(`/electronic-sales/${id}`),
};

// Customer Returns API (Customer Returns)
export const customerReturnsAPI = {
  getReturns: () => api.get('/electronic-returns'),
  getReturn: (id) => api.get(`/electronic-returns/${id}`),
  getReturnsByStore: (storeId) => api.get(`/electronic-returns/store/${storeId}`),
  getReturnsBySale: (saleId) => api.get(`/electronic-returns/sale/${saleId}`),
  getReturnsByStatus: (status) => api.get(`/electronic-returns/status/${status}`),
  createReturn: (data) => api.post('/electronic-returns', data),
  updateReturn: (id, data) => api.put(`/electronic-returns/${id}`, data),
  updateReturnStatus: (id, status) => api.patch(`/electronic-returns/${id}/status?status=${status}`),
  deleteReturn: (id) => api.delete(`/electronic-returns/${id}`),
};

// Customers API
export const customersAPI = {
  getCustomers: () => api.get('/customers'),
  getCustomersByStore: (storeId) => api.get(`/customers/store/${storeId}`),
  getCustomer: (id) => api.get(`/customers/${id}`),
  createCustomer: (data) => api.post('/customers', data),
  updateCustomer: (id, data) => api.put(`/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/customers/${id}`),
};

// Suppliers API
export const suppliersAPI = {
  getSuppliers: () => api.get('/suppliers'),
  getSuppliersByStore: (storeId) => api.get(`/suppliers/store/${storeId}`),
  getSupplier: (id) => api.get(`/suppliers/${id}`),
  createSupplier: (data) => api.post('/suppliers', data),
  updateSupplier: (id, data) => api.put(`/suppliers/${id}`, data),
  deleteSupplier: (id) => api.delete(`/suppliers/${id}`),
};

// Branches API
export const branchesAPI = {
  getBranches: () => api.get('/branches'),
  getBranch: (id) => api.get(`/branches/${id}`),
  getBranchesByStore: (storeId) => api.get(`/branches/store/${storeId}`),
  createBranch: (data) => api.post('/branches', data),
  updateBranch: (id, data) => api.put(`/branches/${id}`, data),
  deleteBranch: (id) => api.delete(`/branches/${id}`),
};

// Stores API
export const storesAPI = {
  getStores: () => api.get('/stores'),
  getStore: (id) => api.get(`/stores/${id}`),
  createStore: (data) => api.post('/stores', data),
  updateStore: (id, data) => api.put(`/stores/${id}`, data),
  deleteStore: (id) => api.delete(`/stores/${id}`),
};

// Users API
export const usersAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  changePassword: (id, currentPassword, newPassword) => 
    api.post(`/users/${id}/change-password`, { currentPassword, newPassword }),
};

// Subscriptions API
export const subscriptionsAPI = {
  getSubscriptions: () => api.get('/subscriptions'),
  getSubscription: (id) => api.get(`/subscriptions/${id}`),
  getSubscriptionByUserId: (userId) => api.get(`/subscriptions/user/${userId}`),
  createSubscription: (data) => api.post('/subscriptions', data),
  updateSubscription: (id, data) => api.put(`/subscriptions/${id}`, data),
  upgradePlan: (id, plan) => api.patch(`/subscriptions/${id}/upgrade?plan=${plan}`),
  deleteSubscription: (id) => api.delete(`/subscriptions/${id}`),
};

// Shop Types API
export const shopTypesAPI = {
  getShopTypes: () => api.get('/shops'),
};

// Shops API
export const shopsAPI = {
  getShops: () => api.get('/shops'),
  getShop: (id) => api.get(`/shops/${id}`),
  getShopByType: (shopType) => api.get(`/shops/type/${shopType}`),
};

// Store Access API
export const storeAccessAPI = {
  getStoreAccessByUser: (userId) => api.get(`/store-access/user/${userId}`),
  getAllStoreAccess: () => api.get('/store-access'),
  createStoreAccess: (data) => api.post('/store-access', data),
};

// Electronic Brokers API
export const brokersAPI = {
  getBrokers: () => api.get('/electronic-brokers'),
  getBroker: (id) => api.get(`/electronic-brokers/${id}`),
  getBrokersByStore: (storeId) => api.get(`/electronic-brokers/store/${storeId}`),
  createBroker: (data) => api.post('/electronic-brokers', data),
  updateBroker: (id, data) => api.put(`/electronic-brokers/${id}`, data),
  deleteBroker: (id) => api.delete(`/electronic-brokers/${id}`),
};

// Broker Transactions API
export const brokerTransactionsAPI = {
  getTransactions: () => api.get('/electronic-broker-transactions'),
  getTransaction: (id) => api.get(`/electronic-broker-transactions/${id}`),
  getTransactionsByStore: (storeId) => api.get(`/electronic-broker-transactions/store/${storeId}`),
  getTransactionsByBroker: (brokerId) => api.get(`/electronic-broker-transactions/broker/${brokerId}`),
  getTransactionsByStatus: (status) => api.get(`/electronic-broker-transactions/status/${status}`),
  createTransaction: (data) => api.post('/electronic-broker-transactions', data),
  updateTransaction: (id, data) => api.put(`/electronic-broker-transactions/${id}`, data),
  updateTransactionStatus: (id, status) => api.patch(`/electronic-broker-transactions/${id}/status?status=${status}`),
  deleteTransaction: (id) => api.delete(`/electronic-broker-transactions/${id}`),
  markAsSold: (id, customerId, paymentMethod) => 
    api.post(`/electronic-broker-transactions/${id}/mark-as-sold?customerId=${customerId}&paymentMethod=${paymentMethod}`),
};

// Payments API
export const paymentsAPI = {
  createPayment: (data) => api.post('/payments', data),
  getPaymentsBySaleId: (saleId) => api.get(`/payments/sale/${saleId}`),
  getPaymentsByBrokerTransactionId: (brokerTransactionId) => api.get(`/payments/broker-transaction/${brokerTransactionId}`),
  getPayment: (id) => api.get(`/payments/${id}`),
  deletePayment: (id) => api.delete(`/payments/${id}`),
  getAllPayments: () => api.get('/payments'),
  getPaymentsByInvestmentId: (investmentId) => api.get(`/payments/investment/${investmentId}`),
};

// Electronic Supplier Returns API
export const supplierReturnsAPI = {
  getSupplierReturns: () => api.get('/supplier-returns'),
  getSupplierReturn: (id) => api.get(`/supplier-returns/${id}`),
  getSupplierReturnsByStore: (storeId) => api.get(`/supplier-returns/store/${storeId}`),
  getSupplierReturnsBySupplier: (supplierId) => api.get(`/supplier-returns/supplier/${supplierId}`),
  getSupplierReturnsByProduct: (productId) => api.get(`/supplier-returns/product/${productId}`),
  getSupplierReturnsByStatus: (status) => api.get(`/supplier-returns/status/${status}`),
  createSupplierReturn: (data) => api.post('/supplier-returns', data),
  updateSupplierReturn: (id, data) => api.put(`/supplier-returns/${id}`, data),
  processReplacement: (id, replacementSerialNumber, replacementReason) => 
    api.post(`/supplier-returns/${id}/process-replacement?replacementSerialNumber=${replacementSerialNumber}&replacementReason=${replacementReason}`),
  updateSupplierReturnStatus: (id, status) => api.patch(`/supplier-returns/${id}/status?status=${status}`),
  deleteSupplierReturn: (id) => api.delete(`/supplier-returns/${id}`),
};

// Investments API
export const investmentsAPI = {
  getInvestments: () => api.get('/investments'),
  getInvestment: (id) => api.get(`/investments/${id}`),
  getInvestmentsByStore: (storeId) => api.get(`/investments/store/${storeId}`),
  getInvestmentsByStoreAndStatus: (storeId, status) => api.get(`/investments/store/${storeId}/status/${status}`),
  getInvestmentsBySupplier: (supplierId) => api.get(`/investments/supplier/${supplierId}`),
  getInvestmentByInvoice: (invoiceNumber) => api.get(`/investments/invoice/${invoiceNumber}`),
  createInvestment: (data) => api.post('/investments', data),
  updateInvestment: (id, data) => api.put(`/investments/${id}`, data),
  addPayment: (investmentId, amount, paymentMethod) => 
    api.post(`/investments/${investmentId}/payment?amount=${amount}&paymentMethod=${paymentMethod}`),
  deleteInvestment: (id) => api.delete(`/investments/${id}`),
};

// Shipments API
export const shipmentsAPI = {
  getShipments: () => api.get('/shipments'),
  getShipment: (id) => api.get(`/shipments/${id}`),
  getShipmentsByStore: (storeId) => api.get(`/shipments/store/${storeId}`),
  getShipmentsByInvestment: (investmentId) => api.get(`/shipments/invoice/${investmentId}`),
  createShipment: (data) => api.post('/shipments', data),
  updateShipment: (id, data) => api.put(`/shipments/${id}`, data),
  deleteShipment: (id) => api.delete(`/shipments/${id}`),
};

// Expenses API
export const expensesAPI = {
  getExpenses: () => api.get('/expenses'),
  getExpense: (id) => api.get(`/expenses/${id}`),
  getExpensesByStore: (storeId) => api.get(`/expenses/store/${storeId}`),
  getExpensesByStoreAndDateRange: (storeId, startDate, endDate) => 
    api.get(`/expenses/store/${storeId}/date-range?startDate=${startDate}&endDate=${endDate}`),
  getExpensesByStoreAndDate: (storeId, date) => 
    api.get(`/expenses/store/${storeId}/date?date=${date}`),
  getExpensesByStoreFromDate: (storeId, startDate) => 
    api.get(`/expenses/store/${storeId}/from-date?startDate=${startDate}`),
  getTotalExpensesByStore: (storeId) => api.get(`/expenses/store/${storeId}/total`),
  getTotalExpensesByStoreAndDateRange: (storeId, startDate, endDate) => 
    api.get(`/expenses/store/${storeId}/total/date-range?startDate=${startDate}&endDate=${endDate}`),
  createExpense: (data) => api.post('/expenses', data),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
};

export default api;

// Enums API
export const enumsAPI = {
  getReturnStatuses: () => api.get('/enums/return-statuses'),
};

// Rentals API - Rental Houses
export const rentalHousesAPI = {
  getRentalHouses: () => api.get('/rental-houses'),
  getRentalHouse: (id) => api.get(`/rental-houses/${id}`),
  getRentalHousesByStore: (storeId) => api.get(`/rental-houses/store/${storeId}`),
  getRentalHousesByStatus: (status) => api.get(`/rental-houses/status/${status}`),
  createRentalHouse: (data) => api.post('/rental-houses', data),
  updateRentalHouse: (id, data) => api.put(`/rental-houses/${id}`, data),
  deleteRentalHouse: (id) => api.delete(`/rental-houses/${id}`),
};

// Rentals API - Apartments
export const apartmentsAPI = {
  getApartments: () => api.get('/apartments'),
  getApartment: (id) => api.get(`/apartments/${id}`),
  getApartmentsByStore: (storeId) => api.get(`/apartments/store/${storeId}`),
  createApartment: (data) => api.post('/apartments', data),
  updateApartment: (id, data) => api.put(`/apartments/${id}`, data),
  deleteApartment: (id) => api.delete(`/apartments/${id}`),
};

// Rentals API - Suites
export const suitesAPI = {
  getSuites: () => api.get('/suites'),
  getSuite: (id) => api.get(`/suites/${id}`),
  getSuitesByStore: (storeId) => api.get(`/suites/store/${storeId}`),
  getSuitesByApartment: (apartmentId) => api.get(`/suites/apartment/${apartmentId}`),
  getSuitesByStatus: (status) => api.get(`/suites/status/${status}`),
  createSuite: (data) => api.post('/suites', data),
  updateSuite: (id, data) => api.put(`/suites/${id}`, data),
  deleteSuite: (id) => api.delete(`/suites/${id}`),
};

// Rentals API - Hostels
export const hostelsAPI = {
  getHostels: () => api.get('/hostels'),
  getHostel: (id) => api.get(`/hostels/${id}`),
  getHostelsByStore: (storeId) => api.get(`/hostels/store/${storeId}`),
  createHostel: (data) => api.post('/hostels', data),
  updateHostel: (id, data) => api.put(`/hostels/${id}`, data),
  deleteHostel: (id) => api.delete(`/hostels/${id}`),
};

// Rentals API - Hostel Rooms
export const hostelRoomsAPI = {
  getHostelRooms: () => api.get('/hostel-rooms'),
  getHostelRoom: (id) => api.get(`/hostel-rooms/${id}`),
  getHostelRoomsByStore: (storeId) => api.get(`/hostel-rooms/store/${storeId}`),
  getHostelRoomsByHostel: (hostelId) => api.get(`/hostel-rooms/hostel/${hostelId}`),
  getHostelRoomsByStatus: (status) => api.get(`/hostel-rooms/status/${status}`),
  createHostelRoom: (data) => api.post('/hostel-rooms', data),
  updateHostelRoom: (id, data) => api.put(`/hostel-rooms/${id}`, data),
  deleteHostelRoom: (id) => api.delete(`/hostel-rooms/${id}`),
};

// Rentals API - Tenants
export const tenantsAPI = {
  getTenants: () => api.get('/tenants'),
  getTenant: (id) => api.get(`/tenants/${id}`),
  getTenantsByStore: (storeId) => api.get(`/tenants/store/${storeId}`),
  getTenantsByRentalHouse: (rentalHouseId) => api.get(`/tenants/rental-house/${rentalHouseId}`),
  getTenantsBySuite: (suiteId) => api.get(`/tenants/suite/${suiteId}`),
  getTenantsByHostelRoom: (hostelRoomId) => api.get(`/tenants/hostel-room/${hostelRoomId}`),
  createTenant: (data) => api.post('/tenants', data),
  updateTenant: (id, data) => api.put(`/tenants/${id}`, data),
  deleteTenant: (id) => api.delete(`/tenants/${id}`),
};

// Rentals API - Rent Payments
export const rentPaymentsAPI = {
  getRentPayments: () => api.get('/rent-payments'),
  getRentPayment: (id) => api.get(`/rent-payments/${id}`),
  getRentPaymentsByStore: (storeId) => api.get(`/rent-payments/store/${storeId}`),
  getRentPaymentsByTenant: (tenantId) => api.get(`/rent-payments/tenant/${tenantId}`),
  createRentPayment: (data) => api.post('/rent-payments', data),
  updateRentPayment: (id, data) => api.put(`/rent-payments/${id}`, data),
  deleteRentPayment: (id) => api.delete(`/rent-payments/${id}`),
};

// Rentals API - Meter Readings
export const meterReadingsAPI = {
  getMeterReadings: () => api.get('/meter-readings'),
  getMeterReading: (id) => api.get(`/meter-readings/${id}`),
  getMeterReadingsByStore: (storeId) => api.get(`/meter-readings/store/${storeId}`),
  getMeterReadingsBySuite: (suiteId) => api.get(`/meter-readings/suite/${suiteId}`),
  getMeterReadingsByRentalHouse: (rentalHouseId) => api.get(`/meter-readings/rental-house/${rentalHouseId}`),
  getMeterReadingsByHostelRoom: (hostelRoomId) => api.get(`/meter-readings/hostel-room/${hostelRoomId}`),
  createMeterReading: (data) => api.post('/meter-readings', data),
  updateMeterReading: (id, data) => api.put(`/meter-readings/${id}`, data),
  deleteMeterReading: (id) => api.delete(`/meter-readings/${id}`),
};

// Rentals API - Maintenance Requests
export const maintenanceRequestsAPI = {
  getMaintenanceRequests: () => api.get('/maintenance-requests'),
  getMaintenanceRequest: (id) => api.get(`/maintenance-requests/${id}`),
  getMaintenanceRequestsByStore: (storeId) => api.get(`/maintenance-requests/store/${storeId}`),
  getMaintenanceRequestsByTenant: (tenantId) => api.get(`/maintenance-requests/tenant/${tenantId}`),
  getMaintenanceRequestsByStatus: (status) => api.get(`/maintenance-requests/status/${status}`),
  createMaintenanceRequest: (data) => api.post('/maintenance-requests', data),
  updateMaintenanceRequest: (id, data) => api.put(`/maintenance-requests/${id}`, data),
  deleteMaintenanceRequest: (id) => api.delete(`/maintenance-requests/${id}`),
};

// Dashboard Analytics API
export const dashboardAnalyticsAPI = {
  getAnalytics: (storeId, year) => api.get('/dashboard/analytics', { params: { storeId, year } }),
};

// Bar Products API
export const barProductsAPI = {
  // Beers
  getBeers: () => api.get('/beers'),
  getBeersByStore: (storeId) => api.get(`/beers/store/${storeId}`),
  getBeer: (id) => api.get(`/beers/${id}`),
  createBeer: (data) => api.post('/beers', data),
  updateBeer: (id, data) => api.put(`/beers/${id}`, data),
  deleteBeer: (id) => api.delete(`/beers/${id}`),
  
  // Spirits
  getSpirits: () => api.get('/spirits'),
  getSpiritsByStore: (storeId) => api.get(`/spirits/store/${storeId}`),
  getSpirit: (id) => api.get(`/spirits/${id}`),
  createSpirit: (data) => api.post('/spirits', data),
  updateSpirit: (id, data) => api.put(`/spirits/${id}`, data),
  deleteSpirit: (id) => api.delete(`/spirits/${id}`),

  // Wines
  getWines: () => api.get('/wines'),
  getWinesByStore: (storeId) => api.get(`/wines/store/${storeId}`),
  getWine: (id) => api.get(`/wines/${id}`),
  createWine: (data) => api.post('/wines', data),
  updateWine: (id, data) => api.put(`/wines/${id}`, data),
  deleteWine: (id) => api.delete(`/wines/${id}`),

  // Champagnes
  getChampagnes: () => api.get('/champagnes'),
  getChampagnesByStore: (storeId) => api.get(`/champagnes/store/${storeId}`),
  getChampagne: (id) => api.get(`/champagnes/${id}`),
  createChampagne: (data) => api.post('/champagnes', data),
  updateChampagne: (id, data) => api.put(`/champagnes/${id}`, data),
  deleteChampagne: (id) => api.delete(`/champagnes/${id}`),

  // Juices
  getJuices: () => api.get('/juices'),
  getJuicesByStore: (storeId) => api.get(`/juices/store/${storeId}`),
  getJuice: (id) => api.get(`/juices/${id}`),
  createJuice: (data) => api.post('/juices', data),
  updateJuice: (id, data) => api.put(`/juices/${id}`, data),
  deleteJuice: (id) => api.delete(`/juices/${id}`),

  // Soft Drinks
  getSoftDrinks: () => api.get('/soft-drinks'),
  getSoftDrinksByStore: (storeId) => api.get(`/soft-drinks/store/${storeId}`),
  getSoftDrink: (id) => api.get(`/soft-drinks/${id}`),
  createSoftDrink: (data) => api.post('/soft-drinks', data),
  updateSoftDrink: (id, data) => api.put(`/soft-drinks/${id}`, data),
  deleteSoftDrink: (id) => api.delete(`/soft-drinks/${id}`),

  // Reference data
  getBrands: () => api.get('/brands'),
  createBrand: (data) => api.post('/brands', data),
  getBeerSizes: () => api.get('/beer-sizes'),
  createBeerSize: (data) => api.post('/beer-sizes', data),
  getSpiritSizes: () => api.get('/spirit-sizes'),
  createSpiritSize: (data) => api.post('/spirit-sizes', data),
  getSpiritTypes: () => api.get('/spirit-types'),
  createSpiritType: (data) => api.post('/spirit-types', data),
  getSpiritYears: () => api.get('/spirit-years'),
  createSpiritYear: (data) => api.post('/spirit-years', data),
  getWineSizes: () => api.get('/wine-sizes'),
  createWineSize: (data) => api.post('/wine-sizes', data),
  getWineTypes: () => api.get('/wine-types'),
  createWineType: (data) => api.post('/wine-types', data),
  getWineYears: () => api.get('/wine-years'),
  createWineYear: (data) => api.post('/wine-years', data),
  getChampagneSizes: () => api.get('/champagne-sizes'),
  createChampagneSize: (data) => api.post('/champagne-sizes', data),
  getJuiceSizes: () => api.get('/juice-sizes'),
  createJuiceSize: (data) => api.post('/juice-sizes', data),
  getSoftDrinkTypes: () => api.get('/soft-drink-types'),
  createSoftDrinkType: (data) => api.post('/soft-drink-types', data),
  getSoftDrinkSizes: () => api.get('/soft-drink-sizes'),
  createSoftDrinkSize: (data) => api.post('/soft-drink-sizes', data),
  getPackaging: () => api.get('/packaging'),
  createPackaging: (data) => api.post('/packaging', data),
};

// Counters API
export const countersAPI = {
  getCounters: () => api.get('/counters'),
  getCounter: (id) => api.get(`/counters/${id}`),
  getCountersByStore: (storeId) => api.get(`/counters/store/${storeId}`),
  createCounter: (data) => api.post('/counters', data),
  updateCounter: (id, data) => api.put(`/counters/${id}`, data),
  deleteCounter: (id) => api.delete(`/counters/${id}`),
};

// Inventory API
export const inventoryAPI = {
  getInventory: () => api.get('/inventory'),
  getInventoryItem: (id) => api.get(`/inventory/${id}`),
  getInventoryByStore: (storeId) => api.get(`/inventory/store/${storeId}`),
  getInventoryByCounter: (counterId) => api.get(`/inventory/counter/${counterId}`),
  getInventoryByProduct: (productId, productType) => api.get(`/inventory/product/${productId}?productType=${productType}`),
  createInventory: (data) => api.post('/inventory', data),
  updateInventory: (id, data) => api.put(`/inventory/${id}`, data),
  adjustInventory: (id, adjustment) => api.patch(`/inventory/${id}/adjust?adjustment=${adjustment}`),
  deleteInventory: (id) => api.delete(`/inventory/${id}`),
};

// Bar Sales API
export const barSalesAPI = {
  getSales: () => api.get('/bar-sales'),
  getSale: (id) => api.get(`/bar-sales/${id}`),
  getSalesByCounter: (counterId) => api.get(`/bar-sales/counter/${counterId}`),
  getSalesByStore: (storeId) => api.get(`/bar-sales/store/${storeId}`),
  getSalesByDateRange: (startDate, endDate) => 
    api.get(`/bar-sales/date-range?startDate=${startDate}&endDate=${endDate}`),
  getSalesByCounterAndDateRange: (counterId, startDate, endDate) => 
    api.get(`/bar-sales/counter/${counterId}/date-range?startDate=${startDate}&endDate=${endDate}`),
  getSalesByStoreAndDateRange: (storeId, startDate, endDate) => 
    api.get(`/bar-sales/store/${storeId}/date-range?startDate=${startDate}&endDate=${endDate}`),
  createSale: (data) => api.post('/bar-sales', data),
  deleteSale: (id) => api.delete(`/bar-sales/${id}`),
};

// Bar Shifts API
export const barShiftsAPI = {
  startShift: (data) => api.post('/bar-shifts/start', data),
  endShift: (id, data) => api.put(`/bar-shifts/${id}/end`, data),
  getShift: (id) => api.get(`/bar-shifts/${id}`),
  getAllShifts: () => api.get('/bar-shifts'),
  getShiftsByCounter: (counterId) => api.get(`/bar-shifts/counter/${counterId}`),
  getActiveShiftByCounter: (counterId) => api.get(`/bar-shifts/counter/${counterId}/active`),
  getLastClosedShiftByCounter: (counterId) => api.get(`/bar-shifts/counter/${counterId}/last-closed`),
  getShiftsByUser: (userId) => api.get(`/bar-shifts/user/${userId}`),
  getShiftsByStore: (storeId) => api.get(`/bar-shifts/store/${storeId}`),
  getShiftsByDateRange: (startDate, endDate) => 
    api.get(`/bar-shifts/date-range?startDate=${startDate}&endDate=${endDate}`),
  deleteShift: (id) => api.delete(`/bar-shifts/${id}`),
};
