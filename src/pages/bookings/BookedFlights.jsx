import React, { useState, useEffect } from 'react';
import { Plane, RefreshCw, AlertCircle, ChevronRight, Calendar, Hash, MapPin, Tag } from 'lucide-react';
import { listBookings } from '../../services/flight/searchService';
import BookingDetailPage from './BookingDetailPage';

// ── Status badge ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const map = {
        HK: { bg: '#dcfce7', color: '#166534', label: 'Confirmed' },
        TK: { bg: '#fef9c3', color: '#854d0e', label: 'Changed' },
        UN: { bg: '#fee2e2', color: '#991b1b', label: 'Unable' },
        WL: { bg: '#f1f5f9', color: '#475569', label: 'Waitlist' },
    };
    const s = map[status] || { bg: '#f1f5f9', color: '#475569', label: status || '—' };
    return (
        <span style={{
            padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem',
            fontWeight: 700, background: s.bg, color: s.color,
        }}>{s.label}</span>
    );
};

// ── One booking row card ─────────────────────────────────────────────────────
const BookingCard = ({ booking, onDetails }) => {
    const booked = booking.bookedAt
        ? new Date(booking.bookedAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })
        : '—';
    const pax = [
        booking.adt ? `${booking.adt} Adult${booking.adt > 1 ? 's' : ''}` : null,
        booking.chd ? `${booking.chd} Child${booking.chd > 1 ? 'ren' : ''}` : null,
        booking.inf ? `${booking.inf} Infant${booking.inf > 1 ? 's' : ''}` : null,
    ].filter(Boolean).join(', ');
    const tripMap = { O: 'One Way', R: 'Round Trip', M: 'Multi City' };

    return (
        <div style={{
            background: 'white', borderRadius: '14px', padding: '1.25rem 1.5rem',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap',
            transition: 'box-shadow 0.2s',
        }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(102,126,234,0.15)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
        >
            {/* Airline icon */}
            <div style={{
                width: 50, height: 40, borderRadius: '8px', background: '#f8fafc',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                border: '1px solid #e2e8f0', overflow: 'hidden'
            }}>
                {booking.airlineCode ? (
                    <img
                        src={`https://pics.avs.io/72/36/${booking.airlineCode}.png`}
                        alt={booking.airlineCode}
                        style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div style="color:#667eea"><svg size="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plane"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path></svg></div>';
                        }}
                    />
                ) : (
                    <Plane size={20} color="#667eea" />
                )}
            </div>

            {/* Main info */}
            <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                        {booking.pnr || '—'}
                    </span>
                    <StatusBadge status={booking.status} />
                    {booking.tripType && (
                        <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: 6 }}>
                            {tripMap[booking.tripType] || booking.tripType}
                        </span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                    {booking.bookingRefId && (
                        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Hash size={12} /> {booking.bookingRefId}
                        </span>
                    )}
                    {booking.airlineLocator && (
                        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MapPin size={12} /> {booking.airlineLocator}
                        </span>
                    )}
                    {booking.airlineCode && (
                        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Tag size={12} /> {booking.airlineCode}
                        </span>
                    )}
                    {pax && (
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>· {pax}</span>
                    )}
                </div>
            </div>

            {/* Booked date */}
            <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 130 }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <Calendar size={11} /> {booked}
                </p>
            </div>

            {/* Details button */}
            <button
                onClick={() => onDetails(booking)}
                style={{
                    padding: '0.6rem 1.25rem', background: '#667eea', color: 'white',
                    border: 'none', borderRadius: '9px', fontWeight: 700,
                    fontSize: '0.85rem', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', gap: '0.35rem', flexShrink: 0,
                }}
            >
                Details <ChevronRight size={14} />
            </button>
        </div>
    );
};

// ── Main page ────────────────────────────────────────────────────────────────
const BookedFlights = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [detailBooking, setDetailBooking] = useState(null); // open detail page

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await listBookings();
            setBookings(data.bookings || []);
        } catch (e) {
            setError('Failed to load bookings: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    // ── Detail page open ──────────────────────────────────────────────────
    if (detailBooking) {
        return (
            <BookingDetailPage
                booking={detailBooking}
                onBack={() => setDetailBooking(null)}
            />
        );
    }

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Plane size={24} color="#667eea" /> Booked Flights
                    </h1>
                    <p style={{ margin: '0.35rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                        All PNRs created through this portal
                    </p>
                </div>
                <button
                    onClick={fetchBookings}
                    disabled={loading}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.6rem 1.2rem', background: 'white',
                        border: '2px solid #667eea', color: '#667eea',
                        borderRadius: '9px', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem',
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    <RefreshCw size={14} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
                    Refresh
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                    <RefreshCw size={36} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
                    Loading bookings…
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', color: '#991b1b', marginBottom: '1.5rem' }}>
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{error}</span>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && bookings.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <Plane size={56} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>No booked flights yet.</p>
                    <p style={{ color: '#cbd5e1', fontSize: '0.85rem', marginTop: '0.35rem' }}>Bookings will appear here after you create a PNR.</p>
                </div>
            )}

            {/* Booking cards */}
            {!loading && bookings.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {bookings.map((b, i) => (
                        <BookingCard key={b._id || i} booking={b} onDetails={setDetailBooking} />
                    ))}
                </div>
            )}

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default BookedFlights;
