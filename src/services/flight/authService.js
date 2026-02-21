/**
 * AIQS Flight Auth Service
 * Handles authentication token management via FastAPI backend.
 */
const API_BASE = 'http://localhost:8000/api/flight-search';
const TOKEN_KEY = 'aiqs_token';
const EXPIRY_KEY = 'aiqs_token_expiry';

/**
 * Get a valid AIQS token. Returns cached if still valid, otherwise fetches fresh.
 */
export const getToken = async () => {
    const cached = sessionStorage.getItem(TOKEN_KEY);
    const expiry = sessionStorage.getItem(EXPIRY_KEY);

    if (cached && expiry && Date.now() < parseInt(expiry)) {
        return JSON.parse(cached);
    }

    return await refreshToken();
};

/**
 * Force-refresh the AIQS token from backend.
 */
export const refreshToken = async () => {
    try {
        const resp = await fetch(`${API_BASE}/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.detail || 'Authentication failed');
        }

        const data = await resp.json();

        // Cache with 50-minute TTL (tokens expire ~60min)
        const expiryMs = Date.now() + (data.expires_in || 3000) * 1000;
        sessionStorage.setItem(TOKEN_KEY, JSON.stringify(data));
        sessionStorage.setItem(EXPIRY_KEY, expiryMs.toString());

        return data;
    } catch (err) {
        console.error('AIQS auth error:', err);
        throw err;
    }
};

/**
 * Clear cached token.
 */
export const clearToken = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EXPIRY_KEY);
};

export default { getToken, refreshToken, clearToken };
