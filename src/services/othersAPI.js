import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token if available
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

// ============================================================================
// VISA RATES PEX WISE API
// ============================================================================
export const visaRatesPexAPI = {
    getAll: (isActive = null) => {
        const params = isActive !== null ? { is_active: isActive } : {};
        return api.get('/api/others/visa-rates-pex', { params });
    },
    getById: (id) => api.get(`/api/others/visa-rates-pex/${id}`),
};

// ============================================================================
// RIYAL RATE API
// ============================================================================
export const riyalRateAPI = {
    getActive: () => api.get('/api/others/riyal-rate/active'),
};

// ============================================================================
// TRANSPORT PRICES API
// ============================================================================
export const transportPricesAPI = {
    getAll: (statusFilter = null) => {
        const params = statusFilter ? { status_filter: statusFilter } : {};
        return api.get('/api/others/transport-prices', { params });
    },
    getById: (id) => api.get(`/api/others/transport-prices/${id}`),
};

// ============================================================================
// FOOD PRICES API
// ============================================================================
export const foodPricesAPI = {
    getAll: (statusFilter = null) => {
        const params = statusFilter ? { status_filter: statusFilter } : {};
        return api.get('/api/others/food-prices', { params });
    },
    getById: (id) => api.get(`/api/others/food-prices/${id}`),
};

// ============================================================================
// ZIARAT PRICES API
// ============================================================================
export const ziaratPricesAPI = {
    getAll: (statusFilter = null) => {
        const params = statusFilter ? { status_filter: statusFilter } : {};
        return api.get('/api/others/ziarat-prices', { params });
    },
    getById: (id) => api.get(`/api/others/ziarat-prices/${id}`),
};

// Default export with all APIs
const othersAPI = {
    visaRatesPex: visaRatesPexAPI,
    riyalRate: riyalRateAPI,
    transportPrices: transportPricesAPI,
    foodPrices: foodPricesAPI,
    ziaratPrices: ziaratPricesAPI,
};

export default othersAPI;
