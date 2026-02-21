import React, { useState, useCallback } from 'react';
import { Plane, Search, RefreshCw, AlertCircle } from 'lucide-react';
import OneWayForm from './search/OneWayForm';
import RoundTripForm from './search/RoundTripForm';
import MultiCityForm from './search/MultiCityForm';
import SearchResults from './results/SearchResults';
import BookingDetailsForm from './BookingDetailsForm';
import { searchFlights } from '../../services/flight/searchService';

const tabs = [
    { id: 'oneway', label: 'One Way', icon: '→' },
    { id: 'roundtrip', label: 'Round Trip', icon: '⇄' },
    { id: 'multicity', label: 'Multi City', icon: '⤴' },
];

const FlightsPage = () => {
    const [activeTab, setActiveTab] = useState('oneway');
    const [searching, setSearching] = useState(false);
    const [searchCompleted, setSearchCompleted] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [lastSearchParams, setLastSearchParams] = useState(null); // stored to pass to validate

    // Booking flow state
    const [view, setView] = useState('search'); // 'search' | 'booking'
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [sealedToken, setSealedToken] = useState(null);
    const [validatedFare, setValidatedFare] = useState(null);
    const [validationPromise, setValidationPromise] = useState(null);

    const handleBook = useCallback((flight, sealed, valFare, valPromise) => {
        setSelectedFlight(flight);
        setSealedToken(sealed);
        setValidatedFare(valFare);
        setValidationPromise(valPromise || null);
        setView('booking');
    }, []);

    const handleBackToSearch = useCallback(() => {
        setView('search');
    }, []);

    const handleNewSearch = useCallback(() => {
        setView('search');
        setResults([]);
        setSearchCompleted(false);
        setSelectedFlight(null);
        setSealedToken(null);
        setValidatedFare(null);
        setValidationPromise(null);
    }, []);

    const handleSearch = useCallback(async (formData) => {
        setSearching(true);
        setSearchCompleted(false);
        setResults([]);
        setError(null);

        try {
            // Map tab to tripType
            const tripType = activeTab === 'roundtrip' ? 'return' : activeTab;
            const isMultiCity = tripType === 'multicity';

            // For multicity: ondPairs comes from MultiCityForm
            const multiCitySegments = isMultiCity
                ? (formData.ondPairs || []).map(s => ({
                    origin: s.origin,
                    destination: s.destination,
                    departureDate: s.departureDate,
                }))
                : (formData.multiCitySegments || []);

            const searchParams = {
                tripType,
                // Only include origin/destination for non-multicity
                ...(isMultiCity ? {} : {
                    origin: formData.origin,
                    destination: formData.destination,
                    departureDate: formData.ondPairs?.[0]?.departureDate || formData.departureDate,
                    returnDate: formData.ondPairs?.[1]?.departureDate || formData.returnDate || '',
                }),
                adults: formData.passengers?.adults || 1,
                children: formData.passengers?.children || 0,
                infants: formData.passengers?.infants || 0,
                cabinClass: formData.cabin || 'Y',
                nonStop: formData.nonStop || false,
                preferredAirlines: formData.preferredAirlines || [],
                multiCitySegments,
            };

            const data = await searchFlights(searchParams);
            setResults(data.flights || []);
            setLastSearchParams(searchParams); // save for validate call
            setSearchCompleted(true);
        } catch (err) {
            console.error('Search failed:', err);
            setError(err.message || 'Search failed. Please try again.');
        } finally {
            setSearching(false);
        }
    }, [activeTab]);

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {view === 'booking' ? (
                <BookingDetailsForm
                    flight={selectedFlight}
                    sealed={sealedToken}
                    validatedFare={validatedFare}
                    validationPromise={validationPromise}
                    searchParams={lastSearchParams}
                    onBack={handleBackToSearch}
                    onNewSearch={handleNewSearch}
                />
            ) : (
                <>
                    {/* Page Header */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            color: '#1e293b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            margin: 0,
                        }}>
                            <Plane size={28} color="#667eea" />
                            Flight Search
                        </h1>
                        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
                            Search and book flights from AIQS provider
                        </p>
                    </div>

                    {/* Search Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                        marginBottom: '2rem',
                    }}>
                        {/* Tab Switcher */}
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            marginBottom: '2rem',
                            borderBottom: '2px solid #f1f5f9',
                            paddingBottom: '1rem',
                        }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        transition: 'all 0.2s',
                                        background: activeTab === tab.id
                                            ? '#667eea'
                                            : '#f1f5f9',
                                        color: activeTab === tab.id ? 'white' : '#64748b',
                                    }}
                                >
                                    <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Forms */}
                        {activeTab === 'oneway' && (
                            <OneWayForm onSearch={handleSearch} searching={searching} />
                        )}
                        {activeTab === 'roundtrip' && (
                            <RoundTripForm onSearch={handleSearch} searching={searching} />
                        )}
                        {activeTab === 'multicity' && (
                            <MultiCityForm onSearch={handleSearch} searching={searching} />
                        )}
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div style={{
                            background: '#fef2f2',
                            border: '2px solid #fecaca',
                            borderRadius: '12px',
                            padding: '1rem 1.5rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            color: '#991b1b',
                        }}>
                            <AlertCircle size={20} />
                            <span style={{ fontWeight: '500' }}>{error}</span>
                            <button
                                onClick={() => setError(null)}
                                style={{
                                    marginLeft: 'auto',
                                    background: 'none',
                                    border: 'none',
                                    color: '#991b1b',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '1.25rem',
                                }}
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Loading Spinner */}
                    {searching && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4rem 2rem',
                            background: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            marginBottom: '2rem',
                        }}>
                            <RefreshCw
                                size={48}
                                color="#667eea"
                                style={{ animation: 'spin 1s linear infinite' }}
                            />
                            <p style={{
                                marginTop: '1.5rem',
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                color: '#334155',
                            }}>
                                Searching flights...
                            </p>
                            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
                                This may take up to 30 seconds
                            </p>
                        </div>
                    )}

                    {/* Results */}
                    <SearchResults
                        results={results}
                        searching={searching}
                        searchCompleted={searchCompleted}
                        searchParams={lastSearchParams}
                        onBook={handleBook}
                    />

                    {/* Spin animation */}
                    <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
                </>
            )}
        </div>
    );
};

export default FlightsPage;
