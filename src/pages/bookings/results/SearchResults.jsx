import React, { useState, useMemo } from 'react';
import { Plane, Clock, DollarSign, ChevronDown, ChevronUp, Info, Filter } from 'lucide-react';

const SearchResults = ({ results, searching, searchCompleted }) => {
    // Render flight search results
    const [sortBy, setSortBy] = useState('price');
    const [expandedFlight, setExpandedFlight] = useState(null);
    const [filters, setFilters] = useState({
        maxStops: 'all',
        minPrice: 0,
        maxPrice: 100000
    });

    // Sort and filter results
    const processedResults = useMemo(() => {
        let filtered = results.filter(flight => {
            const totalPrice = flight.fare?.total || 0;
            return totalPrice >= filters.minPrice && totalPrice <= filters.maxPrice;
        });

        // Sort
        if (sortBy === 'price') {
            filtered.sort((a, b) => (a.fare?.total || 0) - (b.fare?.total || 0));
        } else if (sortBy === 'duration') {
            filtered.sort((a, b) => {
                const getDuration = (flight) => {
                    const seg = flight.ondPairs?.[0]?.segments?.[0];
                    return seg?.journeyDuration || 0;
                };
                return getDuration(a) - getDuration(b);
            });
        }

        return filtered;
    }, [results, sortBy, filters]);

    const formatTime = (dateTime) => {
        if (!dateTime) return 'N/A';
        const date = new Date(dateTime);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDuration = (minutes) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const toggleExpanded = (index) => {
        setExpandedFlight(expandedFlight === index ? null : index);
    };

    if (results.length === 0 && !searching) {
        return null;
    }

    return (
        <div className="search-results">
            {/* Results Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                padding: '1rem',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
                        {searchCompleted ? `${processedResults.length} flights found` : `${processedResults.length} flights (searching...)`}
                    </h2>
                    <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.875rem' }}>
                        {searchCompleted ? 'Search completed' : 'Partial results - more flights loading...'}
                    </p>
                </div>

                {/* Sort Controls */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <label style={{ fontWeight: '500', color: '#334155' }}>Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="price">Price (Low to High)</option>
                        <option value="duration">Duration (Shortest)</option>
                        <option value="departure">Departure Time</option>
                    </select>
                </div>
            </div>

            {/* Flight Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {processedResults.map((flight, index) => (
                    <div
                        key={index}
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            border: '2px solid #e2e8f0',
                            transition: 'all 0.3s',
                            cursor: 'pointer'
                        }}
                        onClick={() => toggleExpanded(index)}
                    >
                        {/* Flight Summary */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 2fr auto', gap: '1.5rem', alignItems: 'center' }}>
                            {/* Airline Info */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <Plane size={24} color="#667eea" />
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '600', color: '#1e293b', fontSize: '1.125rem' }}>
                                            {flight.ondPairs?.[0]?.segments?.[0]?.airlineDetails?.airlineName || 'Airline'}
                                        </p>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                                            {flight.ondPairs?.[0]?.segments?.[0]?.airlineDetails?.airlineCode || 'N/A'}
                                            {flight.ondPairs?.[0]?.segments?.[0]?.flightNumber || ''}
                                        </p>
                                    </div>
                                </div>
                                {flight.refundable && (
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        background: '#d1fae5',
                                        color: '#065f46',
                                        borderRadius: '12px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        Refundable
                                    </span>
                                )}
                            </div>

                            {/* Flight Times */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                                        {formatTime(flight.ondPairs?.[0]?.segments?.[0]?.departureDateTime)}
                                    </p>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                                        {flight.ondPairs?.[0]?.origin || 'N/A'}
                                    </p>
                                </div>

                                <div style={{ flex: 1, textAlign: 'center', padding: '0 1rem' }}>
                                    <div style={{ borderTop: '2px solid #cbd5e1', position: 'relative', margin: '0.5rem 0' }}>
                                        <Clock size={16} style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '0 0.25rem', color: '#667eea' }} />
                                    </div>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                                        {formatDuration(flight.ondPairs?.[0]?.segments?.[0]?.journeyDuration)}
                                    </p>
                                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.75rem' }}>
                                        {(flight.ondPairs?.[0]?.segments?.length || 1) - 1 === 0 ? 'Non-stop' : `${(flight.ondPairs?.[0]?.segments?.length || 1) - 1} stop(s)`}
                                    </p>
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                                        {formatTime(flight.ondPairs?.[0]?.segments?.[flight.ondPairs[0].segments.length - 1]?.arrivalDateTime)}
                                    </p>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                                        {flight.ondPairs?.[0]?.destination || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Price */}
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
                                    {flight.fare?.currency || 'USD'} {(flight.fare?.total || 0).toFixed(2)}
                                </p>
                                <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.875rem' }}>
                                    per person
                                </p>
                            </div>

                            {/* Expand Button */}
                            <div>
                                {expandedFlight === index ? <ChevronUp size={24} color="#667eea" /> : <ChevronDown size={24} color="#667eea" />}
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedFlight === index && (
                            <div style={{
                                marginTop: '1.5rem',
                                paddingTop: '1.5rem',
                                borderTop: '2px solid #e2e8f0'
                            }}>
                                {/* Fare Breakdown */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <h4 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: '600', color: '#334155' }}>
                                        <DollarSign size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                        Fare Breakdown
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                        <div style={{ padding: '0.75rem', background: '#f1f5f9', borderRadius: '8px' }}>
                                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Base Fare</p>
                                            <p style={{ margin: '0.25rem 0 0', fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>
                                                {flight.fare?.currency} {flight.fare?.baseFare || '0.00'}
                                            </p>
                                        </div>
                                        <div style={{ padding: '0.75rem', background: '#f1f5f9', borderRadius: '8px' }}>
                                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Taxes & Fees</p>
                                            <p style={{ margin: '0.25rem 0 0', fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>
                                                {flight.fare?.currency} {flight.fare?.tax || '0.00'}
                                            </p>
                                        </div>
                                        <div style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: '8px', border: '2px solid #667eea' }}>
                                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Total</p>
                                            <p style={{ margin: '0.25rem 0 0', fontSize: '1.125rem', fontWeight: '600', color: '#667eea' }}>
                                                {flight.fare?.currency} {(flight.fare?.total || 0).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Options */}
                                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('View Rules for flight', index);
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            background: 'white',
                                            color: '#667eea',
                                            border: '2px solid #667eea',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <Info size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                        View Rules & Baggage
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('Select flight', index);
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        Select Flight
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* No Results */}
            {processedResults.length === 0 && searchCompleted && (
                <div style={{
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                    <Plane size={64} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', color: '#64748b' }}>No flights found</h3>
                    <p style={{ margin: 0, color: '#94a3b8' }}>Try adjusting your search criteria</p>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
