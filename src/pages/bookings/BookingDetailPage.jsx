import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Plane, User, CreditCard, Luggage,
    CheckCircle2, Clock, RefreshCw, AlertCircle,
    Calendar, Hash, MapPin, Tag, ChevronRight,
} from 'lucide-react';
import { getBookingDetail, updatePassport } from '../../services/flight/searchService';

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v) => v || '—';
const fmtMoney = (v, cur = 'PKR') =>
    v ? `${cur} ${Number(v).toLocaleString()}` : '—';

const StatusPill = ({ status }) => {
    const map = {
        HK: { bg: '#dcfce7', color: '#166534', label: 'Confirmed' },
        Pending: { bg: '#fef9c3', color: '#854d0e', label: 'Pending' },
        Issued: { bg: '#dbeafe', color: '#1d4ed8', label: 'Issued' },
    };
    const s = map[status] || { bg: '#f1f5f9', color: '#475569', label: status || '—' };
    return (
        <span style={{ padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, background: s.bg, color: s.color }}>
            {s.label}
        </span>
    );
};

const SectionCard = ({ title, icon: Icon, children }) => (
    <div style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', marginBottom: '1.25rem' }}>
        <h3 style={{ margin: '0 0 1.1rem', fontSize: '0.95rem', fontWeight: 700, color: '#667eea', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {Icon && <Icon size={15} />} {title}
        </h3>
        {children}
    </div>
);

const LabelValue = ({ label, value }) => (
    <div>
        <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
        <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{fmt(value)}</p>
    </div>
);

// ── Segment card ─────────────────────────────────────────────────────────────
const SegmentRow = ({ seg }) => (
    <div style={{
        background: '#f8faff', borderRadius: '12px', padding: '1rem 1.25rem',
        marginBottom: '0.75rem', border: '1px solid #e0e7ff',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Route */}
            <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: '1.3rem', color: '#1e293b' }}>{seg.depAirport}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                            {seg.depDate} {seg.depTime?.replace(/(\d{2})(\d{2})/, '$1:$2')}
                        </p>
                        {seg.depTerminal && <p style={{ margin: 0, fontSize: '0.68rem', color: '#94a3b8' }}>T{seg.depTerminal}</p>}
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ flex: 1, height: 2, background: '#e0e7ff' }} />
                        <Plane size={14} color="#667eea" style={{ transform: 'rotate(90deg)' }} />
                        <div style={{ flex: 1, height: 2, background: '#e0e7ff' }} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: '1.3rem', color: '#1e293b' }}>{seg.arrAirport}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                            {seg.arrDate} {seg.arrTime?.replace(/(\d{2})(\d{2})/, '$1:$2')}
                        </p>
                        {seg.arrTerminal && <p style={{ margin: 0, fontSize: '0.68rem', color: '#94a3b8' }}>T{seg.arrTerminal}</p>}
                    </div>
                </div>
            </div>

            {/* Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '0.5rem 1.25rem', fontSize: '0.8rem', color: '#475569' }}>
                <span><b>{seg.mktgAirline}</b> {seg.flightNo}</span>
                <span>Class: <b>{seg.cabin}/{seg.rbd}</b></span>
                <span>Equip: <b>{seg.eqpType || '—'}</b></span>
                <span>Stops: <b>{seg.stops ?? 0}</b></span>
                <span>Locator: <b>{seg.airlineLocator}</b></span>
                <StatusPill status={seg.statusShort || seg.status} />
            </div>
        </div>

        {/* Baggage */}
        {seg.baggageAllowance?.length > 0 && (
            <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {seg.baggageAllowance.map((b, i) => (
                    <span key={i} style={{ fontSize: '0.72rem', background: '#dbeafe', color: '#1d4ed8', borderRadius: 6, padding: '0.15rem 0.5rem', fontWeight: 700 }}>
                        {b.paxType}: {b.value} {b.unit} ({b.type})
                    </span>
                ))}
            </div>
        )}
    </div>
);

// ── Passenger row ────────────────────────────────────────────────────────────
const PaxRow = ({ pax }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem 1.5rem', padding: '1rem', background: '#f8faff', borderRadius: '10px', marginBottom: '0.75rem', border: '1px solid #e0e7ff' }}>
        <LabelValue label="Name" value={`${pax.salutation || ''} ${pax.givenName} ${pax.surName}`} />
        <LabelValue label="Type" value={pax.paxType} />
        <LabelValue label="DOB" value={pax.birthDate} />
        <LabelValue label="Nationality" value={pax.nationality} />
        <LabelValue label="Passport" value={pax.documentNumber} />
        <LabelValue label="Expiry" value={pax.expiryDate} />
        <LabelValue label="Phone" value={pax.contact?.phoneList?.[0]?.number} />
        <LabelValue label="Email" value={pax.contact?.emailList?.[0]?.emailId} />
        {pax.eTickets?.map((t, i) => (
            <LabelValue key={i} label={`eTicket ${pax.eTickets.length > 1 ? i + 1 : ''}`} value={t.ticketNo || t.status} />
        ))}
    </div>
);

// ── Tax code → full name lookup ───────────────────────────────────────────────
const TAX_NAMES = {
    AE: 'UAE Tax',
    F6: 'UAE Airport Tax',
    TP: 'Government Tax',
    ZR: 'Airport Security Fee',
    BH: 'Bahrain Tax',
    HM: 'Bahrain Departure Tax',
    W6: 'Fuel Surcharge',
    YQ: 'Carrier Surcharge (Fuel)',
    YR: 'Carrier-Imposed Surcharge',
    I2: 'Insurance Tax',
    OM: 'Oman Tax',
    S6: 'Service Fee',
    PK: 'Pakistan Tax',
    WO: 'Pakistan Withholding Tax',
    XT: 'UK Departure Tax',
    GB: 'UK Air Passenger Duty',
    QX: 'Passenger Facility Charge',
    XY: 'US Federal Inspection Fee',
    XA: 'US Immigration User Fee',
    AY: 'US Security Service Fee',
    US: 'US Transportation Tax',
    ZP: 'US Flight Segment Tax',
    WY: 'Oman Aviation Tax',
    OT: 'Other Government Tax',
    OO: 'Other Tax',
};

// ── Tax breakdown row ─────────────────────────────────────────────────────────
const TaxRow = ({ code, amount }) => {
    const fullName = TAX_NAMES[code] || '';
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.83rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{
                    background: '#e0e7ff', color: '#4338ca',
                    borderRadius: '5px', padding: '0.1rem 0.45rem',
                    fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.04em',
                    flexShrink: 0,
                }}>
                    {code}
                </span>
                {fullName && (
                    <span style={{ color: '#64748b' }}>{fullName}</span>
                )}
            </div>
            <span style={{ fontWeight: 700, color: '#1e293b', flexShrink: 0, marginLeft: '1rem' }}>
                PKR {Number(amount).toLocaleString()}
            </span>
        </div>
    );
};

// ── Update Passport Modal ────────────────────────────────────────────────────
const SALUTATIONS = ['Mr', 'Mrs', 'Ms', 'Mstr', 'Miss'];
const DOC_TYPES = [{ v: '1', l: 'Passport' }, { v: '2', l: 'National ID' }];
const GENDERS = ['Male', 'Female'];
const PAX_TYPES = ['ADT', 'CHD', 'INF'];

const fieldStyle = {
    width: '100%', padding: '0.5rem 0.7rem', border: '1.5px solid #e2e8f0',
    borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box',
    color: '#1e293b', background: 'white',
};
const labelStyle = {
    display: 'block', marginBottom: '0.25rem',
    fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase',
};

const UpdatePassportModal = ({ pax, supplierSpecific, bookingRefId, supplierCode, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        paxType: pax.paxType || 'ADT',
        gender: pax.gender || 'Male',
        salutation: pax.salutation || 'Mr',
        givenName: pax.givenName || '',
        surName: pax.surName || '',
        birthDate: pax.birthDate || '',
        docType: pax.docType || '1',
        docID: pax.documentNumber || '',
        docIssueCountry: pax.docIssueCountry || pax.nationality || '',
        expiryDate: pax.expiryDate || '',
        nationality: pax.nationality || '',
    });
    const [saving, setSaving] = useState(false);
    const [errMsg, setErrMsg] = useState(null);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrMsg(null);
        try {
            await updatePassport(
                bookingRefId,
                supplierSpecific,
                [form],
                supplierCode,
            );
            onSuccess();
        } catch (err) {
            setErrMsg(err.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(3px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }} onClick={onClose}>
            <div style={{
                background: 'white', borderRadius: '16px', width: '100%', maxWidth: '560px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden',
            }} onClick={e => e.stopPropagation()}>

                {/* Modal header */}
                <div style={{ background: '#667eea', padding: '1.1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'white' }}>
                        <User size={18} />
                        <span style={{ fontWeight: 800, fontSize: '1rem' }}>Update Passport Info</span>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', padding: '0.3rem 0.6rem', fontWeight: 700 }}>✕</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '1.4rem 1.5rem', overflowY: 'auto', maxHeight: '70vh' }}>
                    <div style={row2}>
                        <label style={labelStyle}>Pax Type
                            <select style={fieldStyle} value={form.paxType} onChange={e => set('paxType', e.target.value)}>
                                {PAX_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </label>
                        <label style={labelStyle}>Gender
                            <select style={fieldStyle} value={form.gender} onChange={e => set('gender', e.target.value)}>
                                {GENDERS.map(g => <option key={g}>{g}</option>)}
                            </select>
                        </label>
                    </div>

                    <div style={{ ...row2, marginTop: '0.75rem' }}>
                        <label style={labelStyle}>Salutation
                            <select style={fieldStyle} value={form.salutation} onChange={e => set('salutation', e.target.value)}>
                                {SALUTATIONS.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </label>
                        <label style={labelStyle}>Given Name
                            <input required style={fieldStyle} value={form.givenName} onChange={e => set('givenName', e.target.value)} placeholder="John" />
                        </label>
                    </div>

                    <div style={{ ...row2, marginTop: '0.75rem' }}>
                        <label style={labelStyle}>Surname
                            <input required style={fieldStyle} value={form.surName} onChange={e => set('surName', e.target.value)} placeholder="Doe" />
                        </label>
                        <label style={labelStyle}>Date of Birth
                            <input required style={fieldStyle} value={form.birthDate} onChange={e => set('birthDate', e.target.value)} placeholder="DD-MM-YYYY" />
                        </label>
                    </div>

                    <div style={{ ...row2, marginTop: '0.75rem' }}>
                        <label style={labelStyle}>Document Type
                            <select style={fieldStyle} value={form.docType} onChange={e => set('docType', e.target.value)}>
                                {DOC_TYPES.map(d => <option key={d.v} value={d.v}>{d.l}</option>)}
                            </select>
                        </label>
                        <label style={labelStyle}>Document Number
                            <input required style={fieldStyle} value={form.docID} onChange={e => set('docID', e.target.value)} placeholder="AB1234567" />
                        </label>
                    </div>

                    <div style={{ ...row2, marginTop: '0.75rem' }}>
                        <label style={labelStyle}>Issue Country
                            <input required style={fieldStyle} value={form.docIssueCountry} onChange={e => set('docIssueCountry', e.target.value)} placeholder="PK" maxLength={2} />
                        </label>
                        <label style={labelStyle}>Expiry Date
                            <input required style={fieldStyle} value={form.expiryDate} onChange={e => set('expiryDate', e.target.value)} placeholder="DD-MM-YYYY" />
                        </label>
                    </div>

                    <label style={{ ...labelStyle, marginTop: '0.75rem' }}>Nationality
                        <input required style={fieldStyle} value={form.nationality} onChange={e => set('nationality', e.target.value)} placeholder="PK" maxLength={2} />
                    </label>

                    {errMsg && (
                        <div style={{ marginTop: '0.85rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.6rem 0.9rem', color: '#991b1b', fontSize: '0.84rem', display: 'flex', gap: '0.5rem' }}>
                            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} /> {errMsg}
                        </div>
                    )}

                    <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button type="button" onClick={onClose} style={{ padding: '0.6rem 1.2rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '9px', fontWeight: 600, cursor: 'pointer', color: '#475569', fontSize: '0.88rem' }}>Cancel</button>
                        <button type="submit" disabled={saving} style={{ padding: '0.6rem 1.4rem', background: '#667eea', border: 'none', borderRadius: '9px', fontWeight: 700, cursor: 'pointer', color: 'white', fontSize: '0.88rem', opacity: saving ? 0.7 : 1 }}>
                            {saving ? 'Updating…' : 'Update Passport'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ── Main page ────────────────────────────────────────────────────────────────
const BookingDetailPage = ({ booking, onBack }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [detail, setDetail] = useState(null);
    const [supplierSpecific, setSupplierSpecific] = useState(null);

    // passport modal state
    const [editingPax, setEditingPax] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getBookingDetail(booking.bookingRefId, booking.supplierCode || 2);
                // Response path: response.content.tripDetailRS.tripDetailsUiData.response
                const content = res?.response?.content || {};
                const tripDetailRS = content.tripDetailRS || {};
                const tripDetail = tripDetailRS?.tripDetailsUiData?.response || null;
                // Keep supplierSpecific for updatingpassport
                setSupplierSpecific(content.supplierSpecific || null);

                console.log('[RETRIEVE] content keys:', Object.keys(content));
                console.log('[RETRIEVE] tripDetailRS keys:', Object.keys(tripDetailRS));
                console.log('[RETRIEVE] tripDetail:', tripDetail);

                if (tripDetail) {
                    setDetail(tripDetail);
                } else {
                    setError(
                        `Could not parse trip details. Content keys: [${Object.keys(content).join(', ')}]. ` +
                        `tripDetailRS keys: [${Object.keys(tripDetailRS).join(', ')}]`
                    );
                }
            } catch (e) {
                setError('Failed to load booking detail: ' + e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [booking.bookingRefId]);

    const fare = detail?.fare || {};
    const travelers = detail?.travelerInfo || [];
    const ondPairs = detail?.ondPairs || [];
    const costBreakup = detail?.costBreakuppax || [];

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                <button
                    onClick={onBack}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.55rem 1.1rem', background: 'white',
                        border: '2px solid #e2e8f0', color: '#475569',
                        borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#667eea'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                    <ArrowLeft size={14} /> Back
                </button>

                <div style={{
                    width: 56, height: 44, borderRadius: '10px', background: '#f8fafc',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0',
                    overflow: 'hidden'
                }}>
                    {(booking.airlineCode || detail?.airlineCode) ? (
                        <img
                            src={`https://pics.avs.io/72/36/${booking.airlineCode || detail?.airlineCode}.png`}
                            alt="Airline Logo"
                            style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<div style="color:#667eea"><svg size="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plane"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path></svg></div>';
                            }}
                        />
                    ) : (
                        <Plane size={24} color="#667eea" />
                    )}
                </div>

                <div style={{ flex: 1 }}>
                    <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
                        {detail?.pnr || booking.pnr || '—'}
                    </h1>
                    <p style={{ margin: '0.15rem 0 0', color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Hash size={13} /> {booking.bookingRefId}
                        <span style={{ color: '#cbd5e1' }}>|</span>
                        <Tag size={13} /> {booking.airlineCode || detail?.airlineCode || '—'}
                    </p>
                </div>
                {booking.status && <StatusPill status={booking.status} />}
            </div>

            {/* Loading */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                    <RefreshCw size={36} style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto 1rem' }} />
                    Fetching booking details from AIQS…
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', color: '#991b1b', marginBottom: '1.5rem' }}>
                    <AlertCircle size={18} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                </div>
            )}

            {detail && (
                <>
                    {/* Summary bar */}
                    <div style={{ background: '#667eea', borderRadius: '14px', padding: '1.25rem 1.5rem', marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'white', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.72rem', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase' }}>Booking Status</p>
                            <p style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem' }}>{detail.bookingStatusName || detail.bookingStatus}</p>
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.72rem', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase' }}>Booking Date</p>
                            <p style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem' }}>{detail.bookingDate?.split(' ')[0] || '—'}</p>
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.72rem', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase' }}>Pax</p>
                            <p style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem' }}>{detail.adt}A {detail.chd}C {detail.inf}I</p>
                        </div>
                        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '0.72rem', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase' }}>Total Fare</p>
                            <p style={{ margin: 0, fontWeight: 800, fontSize: '1.5rem' }}>
                                {fare.currency} {Number(fare.total || 0).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Flight Segments */}
                    {ondPairs.map((ond, oi) => (
                        <SectionCard key={oi} title={`${ond.originCity} → ${ond.destinationCity}`} icon={Plane}>
                            {ond.segments?.map((seg, si) => <SegmentRow key={si} seg={seg} />)}
                        </SectionCard>
                    ))}

                    {/* Passengers */}
                    <SectionCard title="Passengers" icon={User}>
                        {travelers.length === 0
                            ? <p style={{ color: '#94a3b8', margin: 0 }}>No passenger data</p>
                            : travelers.map((pax, i) => (
                                <div key={i}>
                                    <PaxRow pax={pax} />
                                    <div style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '0.75rem' }}>
                                        <button
                                            onClick={() => { setEditingPax(pax); setUpdateSuccess(false); }}
                                            style={{
                                                padding: '0.35rem 0.9rem', background: 'white',
                                                border: '1.5px solid #667eea', color: '#667eea',
                                                borderRadius: '7px', fontWeight: 700, cursor: 'pointer',
                                                fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                            }}
                                        >
                                            ✏ Update Passport
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                        {updateSuccess && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', background: '#dcfce7', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.5rem' }}>
                                <CheckCircle2 size={15} /> Passport updated successfully!
                            </div>
                        )}
                    </SectionCard>

                    {/* Fare breakdown */}
                    <SectionCard title="Fare Breakdown" icon={CreditCard}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                            <div style={{ background: '#f8faff', borderRadius: 10, padding: '0.85rem 1rem', border: '1px solid #e0e7ff' }}>
                                <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Base Fare</p>
                                <p style={{ margin: '0.2rem 0 0', fontWeight: 800, color: '#1e293b' }}>{fmtMoney(fare.baseFare, fare.currency)}</p>
                            </div>
                            <div style={{ background: '#f8faff', borderRadius: 10, padding: '0.85rem 1rem', border: '1px solid #e0e7ff' }}>
                                <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Taxes</p>
                                <p style={{ margin: '0.2rem 0 0', fontWeight: 800, color: '#1e293b' }}>{fmtMoney(fare.tax, fare.currency)}</p>
                            </div>
                            <div style={{ background: '#667eea', borderRadius: 10, padding: '0.85rem 1rem' }}>
                                <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600, textTransform: 'uppercase' }}>Total</p>
                                <p style={{ margin: '0.2rem 0 0', fontWeight: 800, color: 'white', fontSize: '1.1rem' }}>{fmtMoney(fare.total, fare.currency)}</p>
                            </div>
                        </div>

                        {/* Per-pax cost breakup with tax detail */}
                        {costBreakup.map((cb, i) => (
                            <div key={i} style={{ marginBottom: '1rem' }}>
                                <p style={{ margin: '0 0 0.6rem', fontWeight: 700, color: '#475569', fontSize: '0.88rem' }}>
                                    {cb.paxName} ({cb.paxType})
                                </p>
                                {cb.taxBreakup?.map((t, ti) => (
                                    <TaxRow key={ti} code={t.taxCode} amount={t.amount} />
                                ))}
                            </div>
                        ))}
                    </SectionCard>
                </>
            )}

            {editingPax && (
                <UpdatePassportModal
                    pax={editingPax}
                    supplierSpecific={supplierSpecific || {}}
                    bookingRefId={booking.bookingRefId}
                    supplierCode={booking.supplierCode || 2}
                    onClose={() => setEditingPax(null)}
                    onSuccess={() => { setEditingPax(null); setUpdateSuccess(true); }}
                />
            )}

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default BookingDetailPage;
