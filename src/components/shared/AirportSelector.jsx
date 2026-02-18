import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader, X } from 'lucide-react';

/**
 * AirportSelector Component
 * Searchable dropdown for airport selection with AirLabs API integration
 */
const AirportSelector = ({ value, onChange, placeholder = "Airport code (e.g., DXB)", error }) => {
    const [searchTerm, setSearchTerm] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const debounceTimer = useRef(null);

    // Static airport data for testing
    const AIRPORTS_DATA = [
        // Pakistan
        { iata_code: 'KHI', name: 'Jinnah International Airport', city_name: 'Karachi', country_code: 'PK' },
        { iata_code: 'ISB', name: 'Islamabad International Airport', city_name: 'Islamabad', country_code: 'PK' },
        { iata_code: 'LHE', name: 'Allama Iqbal International Airport', city_name: 'Lahore', country_code: 'PK' },
        { iata_code: 'PEW', name: 'Bacha Khan International Airport', city_name: 'Peshawar', country_code: 'PK' },
        { iata_code: 'MUX', name: 'Multan International Airport', city_name: 'Multan', country_code: 'PK' },
        { iata_code: 'SKT', name: 'Sialkot International Airport', city_name: 'Sialkot', country_code: 'PK' },
        { iata_code: 'UET', name: 'Quetta International Airport', city_name: 'Quetta', country_code: 'PK' },
        { iata_code: 'LYP', name: 'Faisalabad International Airport', city_name: 'Faisalabad', country_code: 'PK' },
        { iata_code: 'GIL', name: 'Gilgit Airport', city_name: 'Gilgit', country_code: 'PK' },
        { iata_code: 'SKZ', name: 'Sukkur Airport', city_name: 'Sukkur', country_code: 'PK' },

        // Middle East
        { iata_code: 'DXB', name: 'Dubai International Airport', city_name: 'Dubai', country_code: 'AE' },
        { iata_code: 'DWC', name: 'Al Maktoum International Airport', city_name: 'Dubai', country_code: 'AE' },
        { iata_code: 'AUH', name: 'Abu Dhabi International Airport', city_name: 'Abu Dhabi', country_code: 'AE' },
        { iata_code: 'SHJ', name: 'Sharjah International Airport', city_name: 'Sharjah', country_code: 'AE' },
        { iata_code: 'JED', name: 'King Abdulaziz International Airport', city_name: 'Jeddah', country_code: 'SA' },
        { iata_code: 'RUH', name: 'King Khalid International Airport', city_name: 'Riyadh', country_code: 'SA' },
        { iata_code: 'DMM', name: 'King Fahd International Airport', city_name: 'Dammam', country_code: 'SA' },
        { iata_code: 'MED', name: 'Prince Mohammad Bin Abdulaziz Airport', city_name: 'Madinah', country_code: 'SA' },
        { iata_code: 'DOH', name: 'Hamad International Airport', city_name: 'Doha', country_code: 'QA' },
        { iata_code: 'MCT', name: 'Muscat International Airport', city_name: 'Muscat', country_code: 'OM' },
        { iata_code: 'KWI', name: 'Kuwait International Airport', city_name: 'Kuwait', country_code: 'KW' },
        { iata_code: 'BAH', name: 'Bahrain International Airport', city_name: 'Bahrain', country_code: 'BH' },
        { iata_code: 'IST', name: 'Istanbul Airport', city_name: 'Istanbul', country_code: 'TR' },
        { iata_code: 'SAW', name: 'Sabiha Gokcen International Airport', city_name: 'Istanbul', country_code: 'TR' },
        { iata_code: 'BEY', name: 'Beirut-Rafic Hariri International Airport', city_name: 'Beirut', country_code: 'LB' },
        { iata_code: 'AMM', name: 'Queen Alia International Airport', city_name: 'Amman', country_code: 'JO' },

        // Europe
        { iata_code: 'LHR', name: 'London Heathrow Airport', city_name: 'London', country_code: 'GB' },
        { iata_code: 'LGW', name: 'London Gatwick Airport', city_name: 'London', country_code: 'GB' },
        { iata_code: 'STN', name: 'London Stansted Airport', city_name: 'London', country_code: 'GB' },
        { iata_code: 'MAN', name: 'Manchester Airport', city_name: 'Manchester', country_code: 'GB' },
        { iata_code: 'BHX', name: 'Birmingham Airport', city_name: 'Birmingham', country_code: 'GB' },
        { iata_code: 'CDG', name: 'Charles de Gaulle Airport', city_name: 'Paris', country_code: 'FR' },
        { iata_code: 'ORY', name: 'Orly Airport', city_name: 'Paris', country_code: 'FR' },
        { iata_code: 'FRA', name: 'Frankfurt Airport', city_name: 'Frankfurt', country_code: 'DE' },
        { iata_code: 'MUC', name: 'Munich Airport', city_name: 'Munich', country_code: 'DE' },
        { iata_code: 'AMS', name: 'Schiphol Airport', city_name: 'Amsterdam', country_code: 'NL' },
        { iata_code: 'FCO', name: 'Leonardo da Vinci-Fiumicino Airport', city_name: 'Rome', country_code: 'IT' },
        { iata_code: 'MXP', name: 'Malpensa Airport', city_name: 'Milan', country_code: 'IT' },
        { iata_code: 'MAD', name: 'Adolfo Suarez Madrid-Barajas Airport', city_name: 'Madrid', country_code: 'ES' },
        { iata_code: 'BCN', name: 'Josep Tarradellas Barcelona-El Prat Airport', city_name: 'Barcelona', country_code: 'ES' },
        { iata_code: 'ZRH', name: 'Zurich Airport', city_name: 'Zurich', country_code: 'CH' },

        // North America
        { iata_code: 'JFK', name: 'John F Kennedy International Airport', city_name: 'New York', country_code: 'US' },
        { iata_code: 'EWR', name: 'Newark Liberty International Airport', city_name: 'New York', country_code: 'US' },
        { iata_code: 'ORD', name: 'O\'Hare International Airport', city_name: 'Chicago', country_code: 'US' },
        { iata_code: 'LAX', name: 'Los Angeles International Airport', city_name: 'Los Angeles', country_code: 'US' },
        { iata_code: 'YYZ', name: 'Toronto Pearson International Airport', city_name: 'Toronto', country_code: 'CA' },
        { iata_code: 'YVR', name: 'Vancouver International Airport', city_name: 'Vancouver', country_code: 'CA' },

        // Asia Pacific
        { iata_code: 'SIN', name: 'Changi Airport', city_name: 'Singapore', country_code: 'SG' },
        { iata_code: 'BKK', name: 'Suvarnabhumi Airport', city_name: 'Bangkok', country_code: 'TH' },
        { iata_code: 'HKG', name: 'Hong Kong International Airport', city_name: 'Hong Kong', country_code: 'HK' },
        { iata_code: 'HND', name: 'Haneda Airport', city_name: 'Tokyo', country_code: 'JP' },
        { iata_code: 'NRT', name: 'Narita International Airport', city_name: 'Tokyo', country_code: 'JP' },
        { iata_code: 'KUL', name: 'Kuala Lumpur International Airport', city_name: 'Kuala Lumpur', country_code: 'MY' },
        { iata_code: 'SYD', name: 'Sydney Kingsford Smith Airport', city_name: 'Sydney', country_code: 'AU' },
        { iata_code: 'MEL', name: 'Melbourne Airport', city_name: 'Melbourne', country_code: 'AU' },
    ];

    // Search airports from static data
    const searchAirports = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));

            const filtered = AIRPORTS_DATA.filter(airport =>
                airport.iata_code.toLowerCase().includes(query.toLowerCase()) ||
                airport.name.toLowerCase().includes(query.toLowerCase()) ||
                airport.city_name.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filtered);
        } catch (error) {
            console.error('Airport search error:', error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            searchAirports(searchTerm);
        }, 300);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchTerm]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value.toUpperCase();
        setSearchTerm(value);
        setShowDropdown(true);
        setSelectedIndex(-1);
    };

    const handleSelectAirport = (airport) => {
        setSearchTerm(airport.iata_code);
        onChange(airport.iata_code);
        setShowDropdown(false);
        setSuggestions([]);
    };

    const handleKeyDown = (e) => {
        if (!showDropdown || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    handleSelectAirport(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowDropdown(false);
                break;
            default:
                break;
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        onChange('');
        setSuggestions([]);
        setShowDropdown(false);
        inputRef.current?.focus();
    };

    return (
        <div style={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <MapPin size={18} color="#94a3b8" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    maxLength={3}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        paddingLeft: '2.5rem',
                        paddingRight: searchTerm ? '2.5rem' : '0.75rem',
                        border: error ? '2px solid #ef4444' : '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                    }}
                />
                {loading && (
                    <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>
                        <Loader size={18} color="#667eea" className="animate-spin" />
                    </div>
                )}
                {searchTerm && !loading && (
                    <button
                        onClick={handleClear}
                        style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <X size={18} color="#94a3b8" />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {showDropdown && suggestions.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 1000
                }}>
                    {suggestions.map((airport, index) => (
                        <div
                            key={airport.iata_code}
                            onClick={() => handleSelectAirport(airport)}
                            style={{
                                padding: '0.75rem',
                                cursor: 'pointer',
                                background: selectedIndex === index ? '#eff6ff' : 'white',
                                borderBottom: index < suggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    padding: '0.5rem',
                                    background: '#eff6ff',
                                    borderRadius: '6px',
                                    fontWeight: '700',
                                    color: '#667eea',
                                    fontSize: '0.875rem',
                                    minWidth: '3rem',
                                    textAlign: 'center'
                                }}>
                                    {airport.iata_code}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontWeight: '600', color: '#1e293b', fontSize: '0.875rem' }}>
                                        {airport.name}
                                    </p>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem' }}>
                                        {airport.city_name}, {airport.country_code}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {error}
                </p>
            )}

            <style>{`
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AirportSelector;
