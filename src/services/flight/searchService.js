/**
 * AIQS Flight Search Service
 * All flight-related API calls to the FastAPI backend.
 */
const API_BASE = 'http://localhost:8000/api/flight-search';

const post = async (url, body) => {
    const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || `Request to ${url} failed`);
    }
    return resp.json();
};

/**
 * Search for flights.
 */
export const searchFlights = (params) => post(`${API_BASE}/search`, params);

/**
 * Validate/revalidate pricing for a selected flight.
 * Returns { status, sealed, validatedFare, supplierSpecific }
 */
export const validateFlight = (flight, searchParams) => post(`${API_BASE}/validate`, {
    supplierCode: flight.supplierCode,
    supplierSpecific: flight.supplierSpecific,
    rawData: flight.rawData,
    adt: searchParams?.adults ?? 1,
    chd: searchParams?.children ?? 0,
    inf: searchParams?.infants ?? 0,
    tripType: (() => {
        const t = searchParams?.tripType || 'oneway';
        if (t === 'oneway') return 'O';
        if (t === 'return' || t === 'roundtrip') return 'R';
        if (t === 'multicity') return 'M';
        return 'O';
    })(),
    searchKey: flight.rawData?.searchKey || null,
});


/**
 * Get fare rules for a flight.
 */
export const getFareRules = (flight) => post(`${API_BASE}/fare-rules`, {
    supplierCode: flight.supplierCode,
    supplierSpecific: flight.supplierSpecific,
    rawData: flight.rawData,
});

/**
 * Fetch branded fare options (FlightBrandedFareRQ via WS).
 * @param {Object} flight — full parsed flight object with rawData + supplierSpecific
 */
export const getBrandedFares = (flight) => post(`${API_BASE}/branded-fares`, {
    supplierCode: flight.supplierCode,
    supplierSpecific: flight.supplierSpecific,
    rawData: flight.rawData,
});

/**
 * Fetch available meals (FlightMealAncillaryRQ via WS).
 * @param {Object} flight — full parsed flight object with rawData + supplierSpecific
 */
export const getMeals = (flight) => post(`${API_BASE}/meals`, {
    supplierCode: flight.supplierCode,
    supplierSpecific: flight.supplierSpecific,
    rawData: flight.rawData,
});

/**
 * Fetch extra baggage options (FlightBaggageAncillaryRQ via WS).
 * @param {Object} flight — full parsed flight object with rawData + supplierSpecific
 */
export const getBaggage = (flight) => post(`${API_BASE}/baggage`, {
    supplierCode: flight.supplierCode,
    supplierSpecific: flight.supplierSpecific,
    rawData: flight.rawData,
});

/**
 * Create PNR booking (FlightBookRQ via REST).
 * @param {Object} params.flight           — full parsed flight with rawData + supplierSpecific
 * @param {Object} params.validatedData    — response from /validate { sealed, supplierSpecific, validatedFare }
 * @param {Array}  params.passengers       — passenger objects
 * @param {Object} params.searchParams     — original search params (adults/children/infants/tripType)
 */
export const bookFlight = ({ flight, validatedData, passengers, searchParams }) => {
    const tripType = (() => {
        const t = searchParams?.tripType || 'oneway';
        if (t === 'oneway') return 'O';
        if (t === 'return' || t === 'roundtrip') return 'R';
        if (t === 'multicity') return 'M';
        return 'O';
    })();
    return post(`${API_BASE}/book`, {
        rawData: flight.rawData,
        supplierCode: flight.supplierCode,
        supplierSpecific: flight.supplierSpecific,
        // Pass supplierSpecific returned from /validate (contains Book_fareSessionId etc.)
        validatedSupplierSpecific: validatedData?.supplierSpecific ?? null,
        sealed: validatedData?.sealed ?? null,
        passengers,
        adt: searchParams?.adults ?? 1,
        chd: searchParams?.children ?? 0,
        inf: searchParams?.infants ?? 0,
        tripType,
    });
};


/**
 * List all bookings saved in the database.
 */
export const listBookings = () =>
    fetch(`${API_BASE}/bookings`).then(r => r.json());

/**
 * Retrieve full PNR details from AIQS.
 */
export const getBookingDetail = (bookingRefId, supplierCode = 2) =>
    post(`${API_BASE}/booking-detail`, { bookingRefId, supplierCode });

/**
 * Update passport / traveler info for an existing PNR (FlightUpdatePassportRQ).
 * @param {string} bookingRefId       — e.g. "CLI_11078-4787"
 * @param {object} supplierSpecific   — from the retrieve response (segRef, availabilitySourceMap …)
 * @param {Array}  travelerInfo       — array of passenger objects
 * @param {number} supplierCode
 */
export const updatePassport = (bookingRefId, supplierSpecific, travelerInfo, supplierCode = 2) =>
    post(`${API_BASE}/update-passport`, { bookingRefId, supplierSpecific, travelerInfo, supplierCode });


export default {
    searchFlights,
    validateFlight,
    getFareRules,
    getBrandedFares,
    getMeals,
    getBaggage,
    bookFlight,
    listBookings,
    getBookingDetail,
    updatePassport,
};
