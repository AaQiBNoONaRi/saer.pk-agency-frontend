import React, { useState } from 'react';
import { Search, Calendar, Users } from 'lucide-react';
import AirportSelector from '../../../components/shared/AirportSelector';

const RoundTripForm = ({ onSearch, searching }) => {
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        passengers: {
            adults: 1,
            children: 0,
            infants: 0
        },
        cabin: 'Y',
        nonStop: false,
        preferredAirlines: []
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.origin) newErrors.origin = 'Origin is required';
        if (!formData.destination) newErrors.destination = 'Destination is required';
        if (!formData.departureDate) newErrors.departureDate = 'Departure date is required';
        if (!formData.returnDate) newErrors.returnDate = 'Return date is required';

        // Validate dates are in future
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const departureDate = new Date(formData.departureDate);
        const returnDate = new Date(formData.returnDate);

        if (departureDate < today) {
            newErrors.departureDate = 'Departure date must be in the future';
        }
        if (returnDate < departureDate) {
            newErrors.returnDate = 'Return date must be after departure date';
        }

        // Validate total passengers
        const totalPassengers = formData.passengers.adults + formData.passengers.children + formData.passengers.infants;
        if (totalPassengers > 9) {
            newErrors.passengers = 'Maximum 9 passengers allowed';
        }
        if (formData.passengers.adults < 1) {
            newErrors.passengers = 'At least 1 adult is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Format dates to DD-MM-YYYY
            const formatDate = (dateStr) => {
                const [year, month, day] = dateStr.split('-');
                return `${day}-${month}-${year}`;
            };

            onSearch({
                ...formData,
                ondPairs: [
                    {
                        origin: formData.origin,
                        destination: formData.destination,
                        departureDate: formatDate(formData.departureDate)
                    },
                    {
                        origin: formData.destination,
                        destination: formData.origin,
                        departureDate: formatDate(formData.returnDate)
                    }
                ]
            });
        }
    };

    const cabinOptions = [
        { value: 'Y', label: 'Economy' },
        { value: 'W', label: 'Premium Economy' },
        { value: 'C', label: 'Business' },
        { value: 'F', label: 'First Class' }
    ];

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {/* Origin */}
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>
                    From
                </label>
                <AirportSelector
                    value={formData.origin}
                    onChange={(value) => setFormData({ ...formData, origin: value })}
                    placeholder="Search origin (e.g., Dubai)"
                    error={errors.origin}
                />
            </div>

            {/* Destination */}
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>
                    To
                </label>
                <AirportSelector
                    value={formData.destination}
                    onChange={(value) => setFormData({ ...formData, destination: value })}
                    placeholder="Search destination (e.g., London)"
                    error={errors.destination}
                />
            </div>

            {/* Departure Date */}
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>
                    <Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Departure
                </label>
                <input
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: errors.departureDate ? '2px solid #ef4444' : '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                    }}
                />
                {errors.departureDate && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.departureDate}</p>}
            </div>

            {/* Return Date */}
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>
                    <Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Return
                </label>
                <input
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    min={formData.departureDate || new Date().toISOString().split('T')[0]}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: errors.returnDate ? '2px solid #ef4444' : '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                    }}
                />
                {errors.returnDate && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.returnDate}</p>}
            </div>

            {/* Passengers */}
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>
                    <Users size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Passengers
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                        <input
                            type="number"
                            placeholder="Adults"
                            min="1"
                            max="9"
                            value={formData.passengers.adults}
                            onChange={(e) => setFormData({
                                ...formData,
                                passengers: { ...formData.passengers, adults: parseInt(e.target.value) || 1 }
                            })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        />
                        <small style={{ color: '#64748b' }}>Adults</small>
                    </div>
                    <div style={{ flex: 1 }}>
                        <input
                            type="number"
                            placeholder="Children"
                            min="0"
                            max="8"
                            value={formData.passengers.children}
                            onChange={(e) => setFormData({
                                ...formData,
                                passengers: { ...formData.passengers, children: parseInt(e.target.value) || 0 }
                            })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        />
                        <small style={{ color: '#64748b' }}>Children</small>
                    </div>
                </div>
                {errors.passengers && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.passengers}</p>}
            </div>

            {/* Cabin Class */}
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>
                    Cabin Class
                </label>
                <select
                    value={formData.cabin}
                    onChange={(e) => setFormData({ ...formData, cabin: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                    }}
                >
                    {cabinOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>

            {/* Non-Stop Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '2rem' }}>
                <input
                    type="checkbox"
                    id="nonStop"
                    checked={formData.nonStop}
                    onChange={(e) => setFormData({ ...formData, nonStop: e.target.checked })}
                    style={{ width: '20px', height: '20px' }}
                />
                <label htmlFor="nonStop" style={{ fontWeight: '500', color: '#334155' }}>
                    Non-stop flights only
                </label>
            </div>

            {/* Submit Button */}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                <button
                    type="submit"
                    disabled={searching}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: searching ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        cursor: searching ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s'
                    }}
                >
                    <Search size={20} />
                    {searching ? 'Searching...' : 'Search Flights'}
                </button>
            </div>
        </form>
    );
};

export default RoundTripForm;
