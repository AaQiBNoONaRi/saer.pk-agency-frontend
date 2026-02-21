import React, { useState, useMemo } from 'react';
import { Plane, Clock, DollarSign, ChevronDown, ChevronUp, Info, Loader, Luggage, Utensils, Tag, CheckCircle, AlertCircle, BookOpen, Layers } from 'lucide-react';
import { validateFlight, getFareRules, getMeals, getBaggage, getBrandedFares } from '../../../services/flight/searchService';

// ─── Airline Name Lookup ────────────────────────────────────────────────
const AIRLINE_NAMES = {
    PK: 'Pakistan International Airlines', PA: 'Pakistan Airways',
    EK: 'Emirates', QR: 'Qatar Airways', TK: 'Turkish Airlines',
    EY: 'Etihad Airways', SV: 'Saudia', WY: 'Oman Air',
    FZ: 'flydubai', G9: 'Air Arabia', '9P': 'AtlasGlobal',
    AI: 'Air India', BA: 'British Airways', LH: 'Lufthansa',
    AF: 'Air France', KL: 'KLM', MS: 'EgyptAir',
    ET: 'Ethiopian Airlines', RJ: 'Royal Jordanian',
    GF: 'Gulf Air', ME: 'MEA', UL: 'SriLankan Airlines',
    MH: 'Malaysia Airlines', SQ: 'Singapore Airlines',
    CX: 'Cathay Pacific', QF: 'Qantas',
};
const getAirlineName = (code) => AIRLINE_NAMES[code] || code || 'Unknown Airline';
const getLogoUrl = (code) =>
    code ? `https://pics.avs.io/72/36/${code}.png` : null;

// ─── Fare Rules Display ─────────────────────────────────────────────────
const FareRulesPanel = ({ data }) => {
    const [openCat, setOpenCat] = useState(null);
    const [activeRoute, setActiveRoute] = useState(0);
    if (!data) return null;

    // The real API returns: data.fareRules = [{depAirport, arrAirport, fareRuleDetails: [{ruleHead, ruleBody}]}]
    // Parse all routes with their rules
    let routes = [];
    try {
        const fareRules = data.fareRules;
        if (Array.isArray(fareRules) && fareRules.length > 0) {
            for (const segment of fareRules) {
                const details = segment.fareRuleDetails;
                if (Array.isArray(details) && details.length > 0) {
                    routes.push({
                        label: `${segment.depAirport || '?'} → ${segment.arrAirport || '?'}`,
                        rules: details, // [{ruleHead, ruleBody}]
                    });
                }
            }
        }
        // Fallback: try raw.response.content.fareRuleResponse.airFareRule
        if (!routes.length && data.raw) {
            const airFareRule = data.raw?.response?.content?.fareRuleResponse?.airFareRule;
            if (Array.isArray(airFareRule)) {
                for (const seg of airFareRule) {
                    const details = seg.fareRuleDetails;
                    if (Array.isArray(details) && details.length) {
                        routes.push({
                            label: `${seg.depAirport || '?'} → ${seg.arrAirport || '?'}`,
                            rules: details,
                        });
                    }
                }
            }
        }
    } catch (_) { }

    const currentRoute = routes[activeRoute] || null;
    const currentRules = currentRoute?.rules || [];

    return (
        <div
            onClick={e => e.stopPropagation()}
            style={{
                background: 'white',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                marginBottom: '1rem',
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <div style={{ padding: '0.75rem 1.1rem', borderBottom: '2px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Info size={16} color="#667eea" />
                    <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#1e293b' }}>Fare Rules</span>
                </div>
                {/* Route tabs — only shown when there are multiple routes */}
                {routes.length > 1 && (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {routes.map((r, i) => (
                            <button key={i} onClick={() => { setActiveRoute(i); setOpenCat(null); }}
                                style={{
                                    padding: '0.3rem 0.75rem', borderRadius: 6, border: 'none', cursor: 'pointer',
                                    fontSize: '0.75rem', fontWeight: 600,
                                    background: i === activeRoute ? '#667eea' : '#f1f5f9',
                                    color: i === activeRoute ? 'white' : '#475569',
                                }}>
                                {r.label}
                            </button>
                        ))}
                    </div>
                )}
                {routes.length === 1 && (
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>{routes[0].label}</span>
                )}
            </div>

            {/* Rule accordion rows */}
            {currentRules.length > 0 ? (
                currentRules.map((rule, i) => {
                    const title = (rule.ruleHead || `Rule ${i + 1}`).toString().toUpperCase();
                    const body = rule.ruleBody || '';
                    const isOpen = openCat === i;
                    return (
                        <div key={i} style={{ borderBottom: i < currentRules.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                            <button
                                onClick={() => setOpenCat(isOpen ? null : i)}
                                style={{
                                    width: '100%', padding: '0.85rem 1.1rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    background: isOpen ? '#f8fafc' : 'transparent', border: 'none', cursor: 'pointer',
                                    textAlign: 'left',
                                }}
                            >
                                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#334155', letterSpacing: '0.03em' }}>{title}</span>
                                <span style={{ color: '#94a3b8', fontSize: '1rem', display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                    ∨
                                </span>
                            </button>
                            {isOpen && (
                                <div style={{ padding: '0.25rem 1.1rem 1rem', background: '#f8fafc' }}>
                                    <pre style={{ margin: 0, fontSize: '0.78rem', color: '#475569', whiteSpace: 'pre-wrap', lineHeight: 1.75, fontFamily: 'inherit' }}>
                                        {body || 'No details available for this rule.'}
                                    </pre>
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <div style={{ padding: '1.5rem 1.1rem' }}>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>No fare rules returned by provider.</p>
                </div>
            )}
        </div>
    );
};


// ─── Baggage Info ────────────────────────────────────────────────────────
const BaggageTag = ({ baggage }) => {
    if (!baggage || baggage.length === 0) {
        return <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>—</span>;
    }
    return (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {baggage.map((b, i) => {
                let display = '';
                // Handle JSON string format from AIQS
                if (typeof b === 'string' && b.trim().startsWith('{')) {
                    try {
                        const parsed = JSON.parse(b);
                        display = `${parsed.value || ''} ${parsed.unit || ''}`.trim();
                        if (!display) display = b; // fallback if empty
                    } catch (e) {
                        display = b;
                    }
                }
                // Handle direct object
                else if (typeof b === 'object' && b !== null) {
                    if (b.value && b.unit) {
                        display = `${b.value} ${b.unit}`;
                    } else {
                        display = b.allowance || b.weight || b.pieces || JSON.stringify(b);
                    }
                }
                // Handle plain string
                else {
                    display = String(b);
                }

                return (
                    <span key={i} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                        padding: '0.2rem 0.6rem',
                        background: '#e0f2fe',
                        color: '#0369a1',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                    }}>
                        <Luggage size={13} /> {display}
                    </span>
                );
            })}
        </div>
    );
};

// ─── Main Component ──────────────────────────────────────────────────────
const SearchResults = ({ results, searching, searchCompleted, searchParams, onBook }) => {
    const [sortBy, setSortBy] = useState('price');
    const [expandedFlight, setExpandedFlight] = useState(null);
    const [validating, setValidating] = useState(null);
    const [validatedPrice, setValidatedPrice] = useState({});
    const [fareRulesData, setFareRulesData] = useState({});
    const [mealsData, setMealsData] = useState({});
    const [baggageData, setBaggageData] = useState({});
    const [brandedFaresData, setBrandedFaresData] = useState({});
    const [selectedBrandIdx, setSelectedBrandIdx] = useState({});  // { [flightIdx]: brandIndex }
    const [loadingRules, setLoadingRules] = useState(null);
    const [loadingMeals, setLoadingMeals] = useState(null);
    const [loadingBaggage, setLoadingBaggage] = useState(null);
    const [loadingBrands, setLoadingBrands] = useState(null);
    const [filters, setFilters] = useState({ maxStops: 'all', minPrice: 0, maxPrice: 9999999 });

    // ─── Sort & Filter ───────────────────────────────────────────────────
    const processedResults = useMemo(() => {
        let filtered = results.filter(f => {
            const total = f.fare?.total || 0;
            if (filters.maxStops !== 'all') {
                let stops = 0;
                for (const seg of (f.segments || [])) stops += Math.max(0, (seg.flights?.length || 1) - 1);
                if (stops > parseInt(filters.maxStops)) return false;
            }
            return total >= filters.minPrice && total <= filters.maxPrice;
        });
        if (sortBy === 'price') filtered.sort((a, b) => (a.fare?.total || 0) - (b.fare?.total || 0));
        else if (sortBy === 'duration') filtered.sort((a, b) => (a.segments?.[0]?.ond?.duration || '').localeCompare(b.segments?.[0]?.ond?.duration || ''));
        return filtered;
    }, [results, sortBy, filters]);

    // ─── Helpers ─────────────────────────────────────────────────────────
    const getFirstFlight = (f) => f.segments?.[0]?.flights?.[0] || {};
    const getLastFlight = (f) => {
        const last = f.segments?.[f.segments.length - 1];
        const legs = last?.flights || [];
        return legs[legs.length - 1] || {};
    };
    const getTotalStops = (f) => {
        let s = 0;
        for (const seg of (f.segments || [])) s += Math.max(0, (seg.flights?.length || 1) - 1);
        return s;
    };
    const formatTime = (t) => {
        if (!t) return '--:--';
        if (t.length === 4 && !t.includes(':')) return `${t.slice(0, 2)}:${t.slice(2)}`;
        return t;
    };

    const toggleExpanded = (idx) => {
        const next = expandedFlight === idx ? null : idx;
        setExpandedFlight(next);
        // Auto-seed inline brands so they render in the comparison table immediately
        if (next !== null) {
            const flight = processedResults[next];
            if (!brandedFaresData[next] && flight?.brands && !flight?.brandedFareSeparate) {
                const inlineBrands = flight.brands;
                const brandArr = Array.isArray(inlineBrands)
                    ? inlineBrands
                    : Object.values(inlineBrands).flat();
                if (brandArr.length > 0) {
                    setBrandedFaresData(prev => ({ ...prev, [next]: { brands: brandArr, source: 'inline' } }));
                }
            }
        }
    };

    // ─── Actions ─────────────────────────────────────────────────────────
    const handleBookFlight = (e, flight, idx, brandOverride) => {
        e.stopPropagation();
        // Start validation in background — don't block the user
        const validationPromise = validateFlight(flight, searchParams);
        // Navigate to booking form immediately
        if (onBook) {
            onBook(flight, null, null, validationPromise);
        }
    };

    const handleBookBrand = (e, flight, idx) => {
        e.stopPropagation();
        const brands = brandedFaresData[idx]?.brands || [];
        const selIdx = selectedBrandIdx[idx] ?? 0;
        const chosenBrand = brands[selIdx];
        // Merge brand data into the flight object for validation
        const flightWithBrand = chosenBrand
            ? { ...flight, chosenBrand, supplierSpecific: chosenBrand.supplierSpecific ?? flight.supplierSpecific }
            : flight;
        const validationPromise = validateFlight(flightWithBrand, searchParams);
        if (onBook) {
            onBook(flightWithBrand, null, null, validationPromise);
        }
    };

    const handleViewRules = async (e, flight, idx) => {
        e.stopPropagation();
        setLoadingRules(idx);
        try {
            const result = await getFareRules(flight);
            setFareRulesData(prev => ({ ...prev, [idx]: result }));
        } catch (err) {
            alert(`Fare rules failed: ${err.message}`);
        } finally {
            setLoadingRules(null);
        }
    };

    const handleViewMeals = async (e, flight, idx) => {
        e.stopPropagation();
        setLoadingMeals(idx);
        try {
            const result = await getMeals(flight);
            setMealsData(prev => ({ ...prev, [idx]: result }));
        } catch (err) {
            setMealsData(prev => ({ ...prev, [idx]: { meals: [] } }));
        } finally {
            setLoadingMeals(null);
        }
    };

    const handleViewBaggage = async (e, flight, idx) => {
        e.stopPropagation();
        setLoadingBaggage(idx);
        try {
            const result = await getBaggage(flight);
            setBaggageData(prev => ({ ...prev, [idx]: result }));
        } catch (err) {
            setBaggageData(prev => ({ ...prev, [idx]: { baggage: [] } }));
        } finally {
            setLoadingBaggage(null);
        }
    };

    const handleViewBrandedFares = async (e, flight, idx) => {
        e.stopPropagation();
        // If already loaded, toggle off
        if (brandedFaresData[idx]) {
            setBrandedFaresData(prev => { const n = { ...prev }; delete n[idx]; return n; });
            return;
        }
        // Use inline brands if brandedFareSeparate is false and brands exist
        const inlineBrands = flight?.brands;
        const hasBrandedFareSeparate = flight?.brandedFareSeparate;
        if (!hasBrandedFareSeparate && inlineBrands && Object.keys(inlineBrands).length > 0) {
            setBrandedFaresData(prev => ({ ...prev, [idx]: { brands: inlineBrands, source: 'inline' } }));
            return;
        }
        // Otherwise fetch via API
        setLoadingBrands(idx);
        try {
            const result = await getBrandedFares(flight);
            setBrandedFaresData(prev => ({ ...prev, [idx]: result }));
        } catch (err) {
            setBrandedFaresData(prev => ({ ...prev, [idx]: { brands: null, error: err.message } }));
        } finally {
            setLoadingBrands(null);
        }
    };

    if (results.length === 0 && !searching) return null;

    return (
        <div style={{ padding: '0 0 2rem' }}>
            {/* Header bar */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '1.25rem', padding: '1rem 1.25rem',
                background: 'white', borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#1e293b' }}>
                        {searchCompleted
                            ? `${processedResults.length} flights found`
                            : `${processedResults.length} results (loading…)`}
                    </h2>
                    <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                        {searchCompleted ? 'All results loaded' : 'More results incoming…'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <select value={filters.maxStops} onChange={e => setFilters(f => ({ ...f, maxStops: e.target.value }))}
                        style={{ padding: '0.45rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <option value="all">All stops</option>
                        <option value="0">Non-stop only</option>
                        <option value="1">Max 1 stop</option>
                    </select>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        style={{ padding: '0.45rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <option value="price">Sort: Price ↑</option>
                        <option value="duration">Sort: Duration ↑</option>
                    </select>
                </div>
            </div>

            {/* Flight Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {processedResults.map((flight, idx) => {
                    const first = getFirstFlight(flight);
                    const last = getLastFlight(flight);
                    const stops = getTotalStops(flight);
                    const airlineCode = first.airlineCode;
                    const isExpanded = expandedFlight === idx;

                    return (
                        <div key={idx} onClick={() => toggleExpanded(idx)} style={{
                            background: 'white',
                            borderRadius: '14px',
                            border: isExpanded ? '2px solid #667eea' : '2px solid transparent',
                            boxShadow: isExpanded ? '0 8px 24px rgba(102,126,234,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
                            transition: 'all 0.25s ease',
                            cursor: 'pointer',
                            overflow: 'hidden',
                        }}>
                            {/* ── Summary Row ──────────────────────────────── */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '200px 1fr auto auto',
                                gap: '1rem',
                                alignItems: 'center',
                                padding: '1.25rem 1.5rem',
                            }}>
                                {/* Airline logo + name */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {airlineCode ? (
                                        <img
                                            src={getLogoUrl(airlineCode)}
                                            alt={airlineCode}
                                            onError={e => { e.target.style.display = 'none'; }}
                                            style={{ width: 56, height: 28, objectFit: 'contain', borderRadius: 4 }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: 40, height: 40, borderRadius: '50%',
                                            background: '#667eea',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <Plane size={18} color="white" />
                                        </div>
                                    )}
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {getAirlineName(airlineCode)}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                                            {airlineCode} {first.flightNo}
                                        </p>
                                        {flight.refundable && (
                                            <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', background: '#d1fae5', color: '#065f46', borderRadius: 6, fontWeight: 700 }}>
                                                Refundable
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Route + times */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#1e293b', lineHeight: 1 }}>
                                            {formatTime(first.departureTime)}
                                        </p>
                                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
                                            {first.departureLocation}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>{first.departureDate}</p>
                                    </div>

                                    <div style={{ flex: 1, textAlign: 'center', maxWidth: 180 }}>
                                        <p style={{ margin: '0 0 0.2rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                                            {flight.segments?.[0]?.ond?.duration || ''}
                                        </p>
                                        <div style={{ position: 'relative', border: 'none', borderTop: '2px dashed #cbd5e1', margin: '6px 0' }}>
                                            <Plane size={14} style={{
                                                position: 'absolute', top: -9, left: '50%',
                                                transform: 'translateX(-50%)',
                                                background: 'white', color: '#667eea',
                                                padding: '0 4px',
                                            }} />
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.78rem', color: stops === 0 ? '#16a34a' : '#f59e0b', fontWeight: 600 }}>
                                            {stops === 0 ? '✈ Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`}
                                        </p>
                                    </div>

                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#1e293b', lineHeight: 1 }}>
                                            {formatTime(last.arrivalTime)}
                                        </p>
                                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
                                            {last.arrivalLocation}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>{last.arrivalDate}</p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: 0, fontSize: '1.65rem', fontWeight: '800', color: '#667eea', lineHeight: 1 }}>
                                        {(flight.fare?.total || 0).toLocaleString()}
                                    </p>
                                    <p style={{ margin: '0.1rem 0 0', fontSize: '0.72rem', color: '#94a3b8' }}>
                                        {flight.fare?.currency || 'PKR'} / person
                                    </p>
                                    {first.cabin && (
                                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: '#eff6ff', color: '#3b82f6', borderRadius: 6, fontWeight: 600 }}>
                                            {first.cabin}
                                        </span>
                                    )}
                                </div>

                                {/* Expand chevron */}
                                <div>
                                    {isExpanded
                                        ? <ChevronUp size={22} color="#667eea" />
                                        : <ChevronDown size={22} color="#94a3b8" />}
                                </div>
                            </div>

                            {/* ── Expanded Section ─────────────────────────── */}
                            {isExpanded && (
                                <div onClick={e => e.stopPropagation()} style={{
                                    borderTop: '1.5px solid #f1f5f9',
                                    padding: '1.5rem',
                                    background: '#fafbff',
                                }}>
                                    {/* Segment legs */}
                                    {flight.segments?.map((seg, sIdx) => (
                                        <div key={sIdx} style={{ marginBottom: '1.25rem' }}>
                                            <p style={{
                                                margin: '0 0 0.6rem',
                                                fontSize: '0.75rem',
                                                fontWeight: '700',
                                                color: '#667eea',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.08em',
                                            }}>
                                                Segment {sIdx + 1}  {seg.ond?.issuingAirline ? `· ${getAirlineName(seg.ond.issuingAirline)}` : ''}
                                                {seg.ond?.duration ? ` · ${seg.ond.duration}` : ''}
                                            </p>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {seg.flights?.map((leg, lIdx) => (
                                                    <div key={lIdx} style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: '180px 1fr 1fr auto',
                                                        gap: '0.75rem',
                                                        background: 'white',
                                                        borderRadius: '10px',
                                                        padding: '0.875rem 1rem',
                                                        border: '1px solid #e2e8f0',
                                                        alignItems: 'center',
                                                    }}>
                                                        {/* Airline */}
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <img
                                                                src={getLogoUrl(leg.airlineCode)}
                                                                alt={leg.airlineCode}
                                                                onError={e => { e.target.src = ''; e.target.style.display = 'none'; }}
                                                                style={{ width: 40, height: 20, objectFit: 'contain' }}
                                                            />
                                                            <div>
                                                                <p style={{ margin: 0, fontWeight: '700', fontSize: '0.82rem', color: '#1e293b' }}>
                                                                    {leg.airlineCode} {leg.flightNo}
                                                                </p>
                                                                <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8' }}>
                                                                    {leg.equipmentType || ''}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Departure → Arrival */}
                                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem', color: '#1e293b' }}>{formatTime(leg.departureTime)}</p>
                                                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{leg.departureLocation}</p>
                                                                {leg.departureTerminal && <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8' }}>T{leg.departureTerminal}</p>}
                                                            </div>
                                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                                                                <Plane size={12} color="#94a3b8" />
                                                                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                                                            </div>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem', color: '#1e293b' }}>{formatTime(leg.arrivalTime)}</p>
                                                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{leg.arrivalLocation}</p>
                                                                {leg.arrivalTerminal && <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8' }}>T{leg.arrivalTerminal}</p>}
                                                            </div>
                                                        </div>

                                                        {/* Cabin + duration */}
                                                        <div>
                                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}>
                                                                <span style={{ color: '#94a3b8' }}>Cabin: </span>
                                                                <strong>{leg.cabin || 'Economy'}</strong>
                                                                {leg.seatsAvailable != null && (
                                                                    <span style={{ color: parseInt(leg.seatsAvailable) <= 5 ? '#ef4444' : '#16a34a', marginLeft: 6, fontSize: '0.72rem' }}>
                                                                        ({leg.seatsAvailable} seats)
                                                                    </span>
                                                                )}
                                                            </p>
                                                            {leg.duration && (
                                                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                                                                    <Clock size={11} style={{ display: 'inline', marginRight: 3 }} />{leg.duration}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Baggage */}
                                                        <div>
                                                            <p style={{ margin: '0 0 0.2rem', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>BAGGAGE</p>
                                                            <BaggageTag baggage={leg.baggage} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Fare breakdown */}
                                    <div style={{
                                        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem',
                                        marginBottom: '1.25rem',
                                    }}>
                                        {[
                                            { label: 'Base Fare', value: flight.fare?.baseFare },
                                            { label: 'Taxes & Fees', value: flight.fare?.tax },
                                            { label: 'Total', value: flight.fare?.total, highlight: true },
                                        ].map(({ label, value, highlight }) => (
                                            <div key={label} style={{
                                                padding: '0.75rem',
                                                background: highlight ? '#eff6ff' : '#f1f5f9',
                                                borderRadius: '9px',
                                                border: highlight ? '2px solid #667eea' : '1px solid #e2e8f0',
                                            }}>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{label}</p>
                                                <p style={{ margin: '0.2rem 0 0', fontSize: '1.05rem', fontWeight: '700', color: highlight ? '#667eea' : '#1e293b' }}>
                                                    {flight.fare?.currency} {(value || 0).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>


                                    {/* Validated Price Banner */}
                                    {validatedPrice[idx] && (
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                                            padding: '0.875rem 1rem', background: '#f0fdf4',
                                            border: '2px solid #86efac', borderRadius: '10px',
                                            marginBottom: '1rem',
                                        }}>
                                            <CheckCircle size={20} color="#16a34a" />
                                            <div>
                                                <p style={{ margin: 0, fontWeight: '700', color: '#166534', fontSize: '0.9rem' }}>
                                                    Price Validated Successfully
                                                </p>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#4ade80' }}>
                                                    Fare confirmed with provider · Proceed to booking
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Fare Rules Panel */}
                                    {fareRulesData[idx] && <FareRulesPanel data={fareRulesData[idx]} />}

                                    {/* Meals Panel */}
                                    {mealsData[idx] && (
                                        <div onClick={e => e.stopPropagation()} style={{
                                            background: '#fff7ed', border: '2px solid #fed7aa',
                                            borderRadius: '10px', padding: '1rem', marginBottom: '1rem',
                                        }}>
                                            <p style={{ margin: '0 0 0.5rem', fontWeight: '700', fontSize: '0.82rem', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Utensils size={14} /> Available Meals
                                            </p>
                                            {mealsData[idx]?.meals?.length > 0 ? (
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    {mealsData[idx].meals.map((m, mIdx) => (
                                                        <span key={mIdx} style={{
                                                            padding: '0.25rem 0.6rem', background: 'white',
                                                            border: '1px solid #fdba74', borderRadius: 8,
                                                            fontSize: '0.78rem', color: '#9a3412',
                                                        }}>
                                                            {m.name || m.code || JSON.stringify(m)}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#a16207' }}>
                                                    No meal options available from this provider.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Baggage Panel */}
                                    {baggageData[idx] && (
                                        <div onClick={e => e.stopPropagation()} style={{
                                            background: '#f0f9ff', border: '2px solid #bae6fd',
                                            borderRadius: '10px', padding: '1rem', marginBottom: '1rem',
                                        }}>
                                            <p style={{ margin: '0 0 0.5rem', fontWeight: '700', fontSize: '0.82rem', color: '#075985', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Luggage size={14} /> Extra Baggage Options
                                            </p>
                                            {baggageData[idx]?.baggage?.length > 0 ? (
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    {baggageData[idx].baggage.map((b, bIdx) => (
                                                        <span key={bIdx} style={{
                                                            padding: '0.25rem 0.6rem', background: 'white',
                                                            border: '1px solid #7dd3fc', borderRadius: 8,
                                                            fontSize: '0.78rem', color: '#0369a1',
                                                        }}>
                                                            {b.weight || b.name} - {b.price || b.amount} {b.currency}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#0369a1' }}>
                                                    No extra baggage options available.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Branded Fares Comparison Table */}
                                    {brandedFaresData[idx] && (() => {
                                        // Error state
                                        if (brandedFaresData[idx].error) {
                                            return (
                                                <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#991b1b', fontSize: '0.85rem' }}>
                                                    <AlertCircle size={16} />
                                                    <span>Could not load branded fares: {brandedFaresData[idx].error}</span>
                                                    <button onClick={() => setBrandedFaresData(prev => { const n = { ...prev }; delete n[idx]; return n; })}
                                                        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b', fontSize: '1rem' }}>×</button>
                                                </div>
                                            );
                                        }

                                        const raw = brandedFaresData[idx].brands;
                                        let brandList = [];
                                        if (Array.isArray(raw)) brandList = raw;
                                        else if (raw && typeof raw === 'object') brandList = Object.values(raw).flat();
                                        const selIdx = selectedBrandIdx[idx] ?? 0;

                                        // Collect all unique feature keys across brands
                                        const allFeatureKeys = Array.from(
                                            new Set(brandList.flatMap(b => Object.keys(b.inclusions || {})))
                                        );

                                        // Icons for known features
                                        const featureIcon = (k) => {
                                            const kl = k.toLowerCase();
                                            if (kl.includes('baggage') && kl.includes('check')) return '🧳';
                                            if (kl.includes('hand') || kl.includes('cabin')) return '💼';
                                            if (kl.includes('meal')) return '🍽️';
                                            if (kl.includes('seat')) return '💺';
                                            if (kl.includes('refund')) return '💰';
                                            if (kl.includes('rebooking') || kl.includes('rebook')) return '🔄';
                                            if (kl.includes('wifi')) return '📶';
                                            if (kl.includes('lounge')) return '🛋️';
                                            if (kl.includes('mileage') || kl.includes('miles')) return '✈️';
                                            if (kl.includes('upgrade')) return '⬆️';
                                            if (kl.includes('priority')) return '⭐';
                                            if (kl.includes('entertainment') || kl.includes('ife')) return '🎬';
                                            return '•';
                                        };

                                        const isIncluded = (v) => {
                                            if (!v) return 'not';
                                            const vl = String(v).toLowerCase();
                                            if (vl === 'not offered') return 'not';
                                            if (vl.includes('included')) return 'yes';
                                            if (vl.startsWith('starts from') || vl.match(/^\d/)) return 'charge';
                                            return 'info';
                                        };

                                        const valueColor = (v) => {
                                            const s = isIncluded(v);
                                            if (s === 'yes') return '#16a34a';
                                            if (s === 'not') return '#94a3b8';
                                            if (s === 'charge') return '#f59e0b';
                                            return '#334155';
                                        };

                                        return brandList.length > 0 ? (
                                            <div onClick={e => e.stopPropagation()} style={{ marginBottom: '1.25rem', overflowX: 'auto' }}>
                                                {/* Flight route header */}
                                                <p style={{ margin: '0 0 0.75rem', fontWeight: '700', fontSize: '0.85rem', color: '#6b21a8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <Layers size={14} /> Select Your Fare — click a column to choose
                                                </p>
                                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                                                    <thead>
                                                        <tr>
                                                            {/* Feature label column */}
                                                            <th style={{ width: 150, padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 700, color: '#475569', borderBottom: '2px solid #e9d5ff', background: 'transparent' }}></th>
                                                            {brandList.map((brand, bIdx) => (
                                                                <th
                                                                    key={bIdx}
                                                                    onClick={() => setSelectedBrandIdx(prev => ({ ...prev, [idx]: bIdx }))}
                                                                    style={{
                                                                        padding: '0.6rem 0.75rem', textAlign: 'center', cursor: 'pointer',
                                                                        fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.04em',
                                                                        textTransform: 'uppercase',
                                                                        color: selIdx === bIdx ? '#7c3aed' : '#475569',
                                                                        borderBottom: selIdx === bIdx ? '3px solid #7c3aed' : '2px solid #e9d5ff',
                                                                        background: selIdx === bIdx ? '#ede9fe' : 'transparent',
                                                                        borderRadius: selIdx === bIdx ? '8px 8px 0 0' : 0,
                                                                        transition: 'all 0.2s',
                                                                        userSelect: 'none',
                                                                    }}
                                                                >
                                                                    {selIdx === bIdx && <span style={{ display: 'block', marginBottom: 2 }}>✓</span>}
                                                                    {brand.brandName || `Fare ${bIdx + 1}`}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                        {/* Price row */}
                                                        <tr>
                                                            <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, color: '#334155', background: '#f8fafc', fontSize: '0.8rem' }}>Total</td>
                                                            {brandList.map((brand, bIdx) => (
                                                                <td key={bIdx} onClick={() => setSelectedBrandIdx(prev => ({ ...prev, [idx]: bIdx }))}
                                                                    style={{
                                                                        padding: '0.5rem 0.75rem', textAlign: 'center', cursor: 'pointer',
                                                                        fontWeight: 800, fontSize: '0.95rem',
                                                                        color: selIdx === bIdx ? '#7c3aed' : '#0f172a',
                                                                        background: selIdx === bIdx ? '#f3e8ff' : '#f8fafc',
                                                                    }}>
                                                                    {brand.currency || 'PKR'} {Number(brand.total || 0).toLocaleString()}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {allFeatureKeys.map((key, kIdx) => (
                                                            <tr key={kIdx} style={{ background: kIdx % 2 === 0 ? '#faf5ff' : 'white' }}>
                                                                <td style={{ padding: '0.45rem 0.75rem', fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>
                                                                    {featureIcon(key)} {key}
                                                                </td>
                                                                {brandList.map((brand, bIdx) => {
                                                                    const val = brand.inclusions?.[key] ?? '—';
                                                                    return (
                                                                        <td key={bIdx}
                                                                            onClick={() => setSelectedBrandIdx(prev => ({ ...prev, [idx]: bIdx }))}
                                                                            style={{
                                                                                padding: '0.45rem 0.75rem', textAlign: 'center', cursor: 'pointer',
                                                                                color: valueColor(val), fontWeight: isIncluded(val) === 'yes' ? 700 : 400,
                                                                                background: selIdx === bIdx ? 'rgba(167,139,250,0.08)' : 'transparent',
                                                                                fontSize: '0.8rem',
                                                                            }}>
                                                                            {val}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#7e22ce' }}>
                                                No branded fare tiers available from this provider.
                                            </p>
                                        );
                                    })()}

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        <button
                                            onClick={e => handleViewRules(e, flight, idx)}
                                            disabled={loadingRules === idx}
                                            style={{
                                                flex: '1 1 120px', padding: '0.75rem', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                                background: 'white', color: '#667eea',
                                                border: '2px solid #667eea', borderRadius: '9px',
                                                fontWeight: '600', cursor: 'pointer', fontSize: '0.88rem',
                                                opacity: loadingRules === idx ? 0.7 : 1,
                                            }}
                                        >
                                            {loadingRules === idx
                                                ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Loading…</>
                                                : <><Info size={15} /> Fare Rules</>}
                                        </button>

                                        <button
                                            onClick={e => handleViewMeals(e, flight, idx)}
                                            disabled={loadingMeals === idx}
                                            style={{
                                                flex: '1 1 120px', padding: '0.75rem', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                                background: 'white', color: '#f59e0b',
                                                border: '2px solid #f59e0b', borderRadius: '9px',
                                                fontWeight: '600', cursor: 'pointer', fontSize: '0.88rem',
                                                opacity: loadingMeals === idx ? 0.7 : 1,
                                            }}
                                        >
                                            {loadingMeals === idx
                                                ? <><Loader size={15} /> Loading…</>
                                                : <><Utensils size={15} /> Meals</>}
                                        </button>

                                        <button
                                            onClick={e => handleViewBaggage(e, flight, idx)}
                                            disabled={loadingBaggage === idx}
                                            style={{
                                                flex: '1 1 120px', padding: '0.75rem', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                                background: 'white', color: '#0ea5e9',
                                                border: '2px solid #0ea5e9', borderRadius: '9px',
                                                fontWeight: '600', cursor: 'pointer', fontSize: '0.88rem',
                                                opacity: loadingBaggage === idx ? 0.7 : 1,
                                            }}
                                        >
                                            {loadingBaggage === idx
                                                ? <><Loader size={15} /> Loading…</>
                                                : <><Luggage size={15} /> Baggage</>}
                                        </button>

                                        {/* Branded Fares button — show when supported OR always (to let user try) */}
                                        {(flight.brandedFareSupported || flight.brands) && (
                                            <button
                                                onClick={e => handleViewBrandedFares(e, flight, idx)}
                                                disabled={loadingBrands === idx}
                                                style={{
                                                    flex: '1 1 130px', padding: '0.75rem', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                                    background: brandedFaresData[idx] ? '#7c3aed' : 'white',
                                                    color: brandedFaresData[idx] ? 'white' : '#a855f7',
                                                    border: '2px solid #a855f7', borderRadius: '9px',
                                                    fontWeight: '600', cursor: loadingBrands === idx ? 'not-allowed' : 'pointer',
                                                    fontSize: '0.88rem',
                                                    opacity: loadingBrands === idx ? 0.7 : 1,
                                                }}
                                            >
                                                {loadingBrands === idx
                                                    ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Loading…</>
                                                    : <><Layers size={15} /> Branded Fares</>}
                                            </button>
                                        )}

                                        {/* Book Flight — instant navigation, validation in background */}
                                        <button
                                            onClick={e => handleBookFlight(e, flight, idx)}
                                            style={{
                                                flex: '2 1 200px', padding: '0.75rem',
                                                background: '#667eea',
                                                color: 'white', border: 'none', borderRadius: '9px',
                                                fontWeight: '700', cursor: 'pointer',
                                                fontSize: '0.95rem', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', gap: '0.4rem',
                                            }}
                                        >
                                            <BookOpen size={15} />
                                            Book Now {(() => {
                                                const selectedBrandIdxVal = selectedBrandIdx[idx];
                                                const brands = brandedFaresData[idx]?.brands;
                                                let fareToDisplay = flight.fare;

                                                if (selectedBrandIdxVal !== undefined && brands) {
                                                    const brandList = Array.isArray(brands) ? brands : Object.values(brands).flat();
                                                    if (brandList[selectedBrandIdxVal]) {
                                                        fareToDisplay = brandList[selectedBrandIdxVal];
                                                    }
                                                }

                                                const amount = Number(fareToDisplay?.total || 0).toLocaleString();
                                                const currency = fareToDisplay?.currency || 'PKR';
                                                return `(${currency} ${amount})`;
                                            })()}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {processedResults.length === 0 && searchCompleted && (
                <div style={{ background: 'white', padding: '3rem', borderRadius: '14px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                    <Plane size={56} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ margin: '0 0 0.5rem', color: '#64748b' }}>No flights found</h3>
                    <p style={{ margin: 0, color: '#94a3b8' }}>Try adjusting your search criteria</p>
                </div>
            )}

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default SearchResults;
