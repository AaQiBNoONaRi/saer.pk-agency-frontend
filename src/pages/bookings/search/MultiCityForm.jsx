import React, { useState } from 'react';
import { Search, Calendar, Users, Plus, X } from 'lucide-react';
import AirportSelector from '../../../components/shared/AirportSelector';

const MultiCityForm = ({ onSearch, searching }) => {
    const [segments, setSegments] = useState([
        { origin: '', destination: '', departureDate: '' },
        { origin: '', destination: '', departureDate: '' }
    ]);

    const [formData, setFormData] = useState({
        passengers: {
            adults: 1,
            children: 0,
            infants: 0
        },
        cabin: 'Y',
        preferredAirlines: []
    });

    const [errors, setErrors] = useState({});

    const addSegment = () => {
        if (segments.length < 6) {
            setSegments([...segments, { origin: '', destination: '', departureDate: '' }]);
        }
    };

    const removeSegment = (index) => {
        if (segments.length > 2) {
            setSegments(segments.filter((_, i) => i !== index));
        }
    };

    const updateSegment = (index, field, value) => {
        const newSegments = [...segments];
        newSegments[index][field] = value;
        setSegments(newSegments);
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate each segment
        segments.forEach((segment, index) => {
            if (!segment.origin) newErrors[`origin_${index}`] = 'Origin is required';
            if (!segment.destination) newErrors[`destination_${index}`] = 'Destination is required';
            if (!segment.departureDate) newErrors[`date_${index}`] = 'Date is required';

            // Check if date is in future
            if (segment.departureDate) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const segmentDate = new Date(segment.departureDate);
                if (segmentDate < today) {
                    newErrors[`date_${index}`] = 'Date must be in the future';
                }

                // Check if date is after previous segment
                if (index > 0 && segments[index - 1].departureDate) {
                    const prevDate = new Date(segments[index - 1].departureDate);
                    if (segmentDate < prevDate) {
                        newErrors[`date_${index}`] = 'Must be after previous segment date';
                    }
                }
            }
        });

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
                ondPairs: segments.map(segment => ({
                    origin: segment.origin,
                    destination: segment.destination,
                    departureDate: formatDate(segment.departureDate)
                }))
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Flight Segments */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#334155' }}>
                    Flight Segments
                </h3>
                {segments.map((segment, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '1.5rem',
                            background: '#f8fafc',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            position: 'relative'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem'
                        }}>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#64748b' }}>
                                Segment {index + 1}
                            </h4>
                            {segments.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeSegment(index)}
                                    style={{
                                        padding: '0.5rem',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {/* Origin */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>
                                    From
                                </label>
                                <AirportSelector
                                    value={segment.origin}
                                    onChange={(value) => updateSegment(index, 'origin', value)}
                                    placeholder={`Origin ${index + 1}`}
                                    error={errors[`origin_${index}`]}
                                />
                            </div>

                            {/* Destination */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>
                                    To
                                </label>
                                <AirportSelector
                                    value={segment.destination}
                                    onChange={(value) => updateSegment(index, 'destination', value)}
                                    placeholder={`Destination ${index + 1}`}
                                    error={errors[`destination_${index}`]}
                                />
                            </div>

                            {/* Departure Date */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>
                                    <Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={segment.departureDate}
                                    onChange={(e) => updateSegment(index, 'departureDate', e.target.value)}
                                    min={
                                        index > 0 && segments[index - 1].departureDate
                                            ? segments[index - 1].departureDate
                                            : new Date().toISOString().split('T')[0]
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: errors[`date_${index}`] ? '2px solid #ef4444' : '2px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                />
                                {errors[`date_${index}`] && (
                                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                        {errors[`date_${index}`]}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Segment Button */}
                {segments.length < 6 && (
                    <button
                        type="button"
                        onClick={addSegment}
                        style={{
                            padding: '0.75rem',
                            background: 'white',
                            color: '#667eea',
                            border: '2px dashed #667eea',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontWeight: '600',
                            fontSize: '1rem'
                        }}
                    >
                        <Plus size={20} />
                        Add Another Flight
                    </button>
                )}
            </div>

            {/* Passengers & Cabin */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
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
            </div>

            {/* Submit Button */}
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
                    transition: 'all 0.3s',
                    marginTop: '1rem'
                }}
            >
                <Search size={20} />
                {searching ? 'Searching...' : 'Search Flights'}
            </button>
        </form>
    );
};

export default MultiCityForm;
