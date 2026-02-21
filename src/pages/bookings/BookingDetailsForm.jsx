import React, { useState, useEffect, useRef } from 'react';
import { Plane, User, FileText, Mail, Phone, ChevronLeft, CheckCircle, Loader, AlertCircle, Star } from 'lucide-react';
import { bookFlight } from '../../services/flight/searchService';

// ─── Airline lookup ────────────────────────────────────────────────────────────
const AIRLINE_NAMES = {
    PK: 'Pakistan International Airlines', EK: 'Emirates', QR: 'Qatar Airways',
    TK: 'Turkish Airlines', EY: 'Etihad Airways', SV: 'Saudia', WY: 'Oman Air',
    FZ: 'flydubai', G9: 'Air Arabia', GF: 'Gulf Air', ME: 'Middle East Airlines',
    EF: 'AirBlue', PA: 'Airblue',
};
const getAirlineName = (code) => AIRLINE_NAMES[code] || code || 'Airline';

// ─── Country list ──────────────────────────────────────────────────────────────
const COUNTRIES = [
    { code: 'PK', name: 'Pakistan' }, { code: 'SA', name: 'Saudi Arabia' },
    { code: 'AE', name: 'United Arab Emirates' }, { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' }, { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' }, { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' }, { code: 'IN', name: 'India' },
    { code: 'BD', name: 'Bangladesh' }, { code: 'LK', name: 'Sri Lanka' },
    { code: 'MY', name: 'Malaysia' }, { code: 'SG', name: 'Singapore' },
    { code: 'TR', name: 'Turkey' }, { code: 'EG', name: 'Egypt' },
    { code: 'JO', name: 'Jordan' }, { code: 'KW', name: 'Kuwait' },
    { code: 'QA', name: 'Qatar' }, { code: 'BH', name: 'Bahrain' },
    { code: 'OM', name: 'Oman' }, { code: 'LB', name: 'Lebanon' },
];

// ─── Shared Styles ─────────────────────────────────────────────────────────────
const fld = {
    width: '100%', padding: '0.6rem 0.85rem',
    border: '1.5px solid #e2e8f0', borderRadius: '8px',
    fontSize: '0.88rem', color: '#1e293b', background: 'white',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
};

const sectionLabel = {
    margin: '0 0 1rem', fontSize: '0.78rem', fontWeight: '700',
    color: '#667eea', textTransform: 'uppercase', letterSpacing: '0.07em',
    display: 'flex', alignItems: 'center', gap: '0.4rem',
};

const divider = {
    gridColumn: '1 / -1', borderTop: '1px solid #f1f5f9',
    paddingTop: '1rem', marginTop: '0.25rem',
};

const F = ({ label, required, half, children }) => (
    <div style={{ gridColumn: half ? 'span 1' : undefined, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569' }}>
            {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
        </label>
        {children}
    </div>
);

// ─── Passenger Form ────────────────────────────────────────────────────────────
const PassengerForm = ({ index, paxType, data, onChange }) => {
    const update = (field, val) => onChange(index, { ...data, [field]: val });
    const labelMap = { ADT: 'Adult', CHD: 'Child', INF: 'Infant' };

    return (
        <div style={{
            border: '1.5px solid #e2e8f0', borderRadius: '12px',
            marginBottom: '1.25rem', overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{ background: '#f8fafc', padding: '0.9rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} color="#667eea" />
                <span style={{ fontWeight: '700', color: '#334155', fontSize: '0.95rem' }}>
                    {labelMap[paxType] || paxType} {index + 1}
                </span>
            </div>

            <div style={{ padding: '1.25rem' }}>
                {/* Passport note */}
                <p style={{ margin: '0 0 1.25rem', fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    Note: Use all given names and surnames exactly as they appear on your passport/ID to avoid complications.
                </p>

                {/* Personal Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    <F label="Title" required>
                        <select value={data.salutation || 'Mr'} onChange={e => update('salutation', e.target.value)} style={fld}>
                            <option>Mr</option><option>Mrs</option><option>Ms</option>
                            <option>Miss</option><option>Master</option><option>Dr</option>
                        </select>
                    </F>
                    <F label="First Name" required>
                        <input style={fld} placeholder="Enter" value={data.givenName || ''}
                            onChange={e => update('givenName', e.target.value.toUpperCase())} />
                    </F>
                    <F label="Last Name" required>
                        <input style={fld} placeholder="Enter" value={data.surName || ''}
                            onChange={e => update('surName', e.target.value.toUpperCase())} />
                    </F>
                    <F label="Date Of Birth">
                        <input style={fld} type="date" placeholder="DD/MM/YYYY"
                            value={data.birthDate || ''} onChange={e => update('birthDate', e.target.value)} />
                    </F>
                    <F label="Nationality">
                        <select value={data.nationality || 'PK'} onChange={e => update('nationality', e.target.value)} style={fld}>
                            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                    </F>

                    {/* Document section */}
                    <div style={divider}>
                        <p style={sectionLabel}><FileText size={13} /> Document</p>
                    </div>
                    <F label="Document Type">
                        <select value={data.docType || 'PP'} onChange={e => update('docType', e.target.value)} style={fld}>
                            <option value="PP">Passport</option>
                            <option value="NIC">National ID Card</option>
                            <option value="DL">Driving License</option>
                        </select>
                    </F>
                    <F label="Document No">
                        <input style={fld} placeholder="Enter" value={data.docID || ''}
                            onChange={e => update('docID', e.target.value)} />
                    </F>
                    <F label="Expiry Date">
                        <input style={fld} type="date" placeholder="DD/MM/YYYY"
                            value={data.expiryDate || ''} onChange={e => update('expiryDate', e.target.value)} />
                    </F>
                    <F label="Issue Country">
                        <select value={data.docIssueCountry || 'PK'} onChange={e => update('docIssueCountry', e.target.value)} style={fld}>
                            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                    </F>



                    {/* Contact Details — primary passenger only */}
                    {index === 0 && (
                        <>
                            <div style={divider}>
                                <p style={sectionLabel}><Phone size={13} /> Contact Details</p>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <p style={{ margin: '0 0 0.75rem', fontSize: '0.78rem', color: '#64748b' }}>Traveller Contact</p>
                            </div>
                            <F label="Phone No." required>
                                <input style={fld} placeholder="Enter" value={data.phone || ''}
                                    onChange={e => update('phone', e.target.value)} />
                            </F>
                            <F label="Email" required>
                                <input style={fld} type="email" placeholder="Enter" value={data.email || ''}
                                    onChange={e => update('email', e.target.value)} />
                            </F>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Flight Summary ────────────────────────────────────────────────────────────
const FlightSummary = ({ flight, validatedFare }) => {
    const first = flight?.segments?.[0]?.flights?.[0] || {};
    const last = flight?.segments?.[flight.segments.length - 1]?.flights?.at(-1) || {};
    const fare = validatedFare || flight?.fare || {};
    const airline = first.airlineCode || '';

    return (
        <div style={{
            background: '#667eea',
            borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem',
            color: 'white', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {airline && (
                    <img src={`https://pics.avs.io/72/36/${airline}.png`} alt={airline}
                        onError={e => e.target.style.display = 'none'}
                        style={{ width: 60, height: 30, objectFit: 'contain', background: 'white', borderRadius: 6, padding: '2px 4px' }} />
                )}
                <div>
                    <p style={{ margin: 0, fontWeight: '800', fontSize: '1.3rem' }}>
                        {first.departureLocation} → {last.arrivalLocation}
                    </p>
                    <p style={{ margin: '0.25rem 0 0', opacity: 0.85, fontSize: '0.88rem' }}>
                        {getAirlineName(airline)} · {first.departureDate} · {first.departureTime?.replace(/(\d{2})(\d{2})/, '$1:$2')} – {last.arrivalTime?.replace(/(\d{2})(\d{2})/, '$1:$2')}
                    </p>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: '800', fontSize: '1.6rem' }}>
                    {fare.currency} {(fare.total || 0).toLocaleString()}
                </p>
                <p style={{ margin: '0.2rem 0 0', opacity: 0.8, fontSize: '0.8rem' }}>Total (incl. taxes)</p>
            </div>
        </div>
    );
};

// ─── Booking Confirmation ──────────────────────────────────────────────────────
const BookingConfirmation = ({ result, onNewSearch }) => (
    <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <CheckCircle size={72} color="#22c55e" style={{ margin: '0 auto 1.5rem', display: 'block' }} />
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '2rem', fontWeight: '800', color: '#166534' }}>Booking Confirmed!</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Your PNR has been created successfully.</p>

        {/* Details card — full width block so button goes below */}
        <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '1.25rem 2.5rem', textAlign: 'left',
            background: '#f0fdf4', border: '2px solid #bbf7d0',
            borderRadius: '14px', padding: '1.5rem 2rem',
            marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem',
        }}>
            {[
                ['PNR', result.pnr || '—'],
                ['Booking Ref', result.bookingRefId || '—'],
                ['Airline Locator', result.airlineLocator || '—'],
                ['Airline Code', result.airlineCode || '—'],
                ['Status', result.status || 'HK'],
            ].map(([label, value]) => (
                <div key={label}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '1.05rem', fontWeight: '700', color: '#166534' }}>{value}</p>
                </div>
            ))}
        </div>

        <button onClick={onNewSearch} style={{
            display: 'inline-block', padding: '0.85rem 2.5rem',
            background: '#667eea', color: 'white', border: 'none',
            borderRadius: '10px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
        }}>
            Search New Flight
        </button>
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const BookingDetailsForm = ({ flight, sealed, validatedFare, validationPromise, searchParams, onBack, onNewSearch }) => {
    const raw = flight?.rawData || {};
    const paxQty = raw.paxQuantity || { adt: 1, chd: 0, inf: 0 };

    // Background validation tracking
    const validationRef = useRef(null);
    const [validationState, setValidationState] = useState('none');
    const [resolvedSealed, setResolvedSealed] = useState(sealed || null);
    const [resolvedFare, setResolvedFare] = useState(validatedFare || null);
    // Full validate response incl. supplierSpecific (needed for book)
    const [resolvedValidateData, setResolvedValidateData] = useState(null);

    useEffect(() => {
        if (!validationPromise) {
            setValidationState(sealed ? 'done' : 'none');
            return;
        }
        validationRef.current = validationPromise;
        setValidationState('pending');
        validationPromise
            .then((result) => {
                setResolvedSealed(result?.sealed || null);
                setResolvedFare(result?.validatedFare || null);
                setResolvedValidateData(result || null);
                setValidationState('done');
            })
            .catch(() => setValidationState('failed'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const buildInitialPassengers = () => {
        const list = [];
        for (let i = 0; i < (paxQty.adt || 1); i++) list.push({ paxType: 'ADT' });
        for (let i = 0; i < (paxQty.chd || 0); i++) list.push({ paxType: 'CHD' });
        for (let i = 0; i < (paxQty.inf || 0); i++) list.push({ paxType: 'INF' });
        return list;
    };

    const [passengers, setPassengers] = useState(buildInitialPassengers);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [bookingResult, setBookingResult] = useState(null);

    const handlePassengerChange = (idx, updated) => {
        setPassengers(prev => prev.map((p, i) => i === idx ? updated : p));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            let sealedToUse = resolvedSealed;
            if (!sealedToUse && validationRef.current) {
                try {
                    const result = await validationRef.current;
                    sealedToUse = result?.sealed || null;
                    if (result?.validatedFare) setResolvedFare(result.validatedFare);
                } catch (ve) {
                    throw new Error('Price validation failed: ' + (ve.message || ve));
                }
            }
            const result = await bookFlight({
                flight,
                validatedData: resolvedValidateData || { sealed: sealedToUse },
                passengers,
                searchParams,
            });
            setBookingResult(result);
        } catch (err) {
            setError(err.message || 'Booking failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (bookingResult) {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <BookingConfirmation result={bookingResult} onNewSearch={onNewSearch} />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Back */}
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', padding: 0 }}>
                <ChevronLeft size={20} /> Back to results
            </button>

            <FlightSummary flight={flight} validatedFare={resolvedFare || validatedFare} />

            {/* Validation status banner */}
            {validationState === 'pending' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '10px', padding: '0.7rem 1rem', marginBottom: '1rem', color: '#1d4ed8', fontSize: '0.85rem', fontWeight: 600 }}>
                    <Loader size={15} style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                    Confirming price with airline… you can fill details in the meantime.
                </div>
            )}
            {validationState === 'done' && resolvedFare && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '0.7rem 1rem', marginBottom: '1rem', color: '#166534', fontSize: '0.85rem', fontWeight: 600 }}>
                    <CheckCircle size={15} />
                    Price confirmed: {resolvedFare.currency} {(resolvedFare.total || 0).toLocaleString()}
                </div>
            )}
            {validationState === 'failed' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: '10px', padding: '0.7rem 1rem', marginBottom: '1rem', color: '#9a3412', fontSize: '0.85rem', fontWeight: 600 }}>
                    <AlertCircle size={15} />
                    Price validation failed. You may still proceed but fare may have changed.
                </div>
            )}

            {/* Passenger Forms */}
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2rem', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.3rem', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <User size={20} color="#667eea" /> Passenger Details
                </h2>
                <form id="booking-form" onSubmit={handleSubmit}>
                    {passengers.map((pax, i) => (
                        <PassengerForm
                            key={i}
                            index={i}
                            paxType={pax.paxType}
                            data={pax}
                            onChange={handlePassengerChange}
                        />
                    ))}
                </form>
            </div>

            {/* Error */}
            {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem', color: '#991b1b' }}>
                    <AlertCircle size={18} />
                    <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{error}</span>
                </div>
            )}

            {/* Footer actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '0.5rem' }}>
                <button type="button" onClick={onBack}
                    style={{ padding: '0.85rem 2rem', background: 'white', color: '#475569', border: '2px solid #e2e8f0', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' }}>
                    Cancel
                </button>
                <button type="submit" form="booking-form" disabled={submitting}
                    style={{ padding: '0.85rem 2.5rem', background: submitting ? '#94a3b8' : '#667eea', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {submitting
                        ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating PNR…</>
                        : <><CheckCircle size={16} /> Confirm Booking</>}
                </button>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        </div>
    );
};

export default BookingDetailsForm;
