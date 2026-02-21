import React, { useState, useEffect } from 'react';

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/hotels', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hotels');
      }

      const data = await response.json();
      setHotels(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get price for specific bed type
  const getPriceByBedType = (prices, bedTypeName) => {
    if (!prices || !Array.isArray(prices)) return 'N/A';
    const price = prices.find(p => p.bed_type_name?.toLowerCase().includes(bedTypeName.toLowerCase()));
    return price ? price.selling_price : 'N/A';
  };

  const formatDateRange = (from, to) => {
    if (!from || !to) return 'N/A';
    return `${from} — ${to}`;
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-gray-500">Loading hotels...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Hotels</h1>
        <button 
          onClick={fetchHotels}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {hotels.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hotels found. Add your first hotel to get started.
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-md shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-3 py-3 font-semibold text-gray-700">Hotel Name</th>
                <th className="px-3 py-3 font-semibold text-gray-700">City</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Address</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Category</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Contact</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Availability</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Distance (m)</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Walk Time (min)</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Walking Distance (m)</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Price Dates</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Room Price</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Sharing Price</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Quint Price</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Quad Price</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Triple Price</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Double Price</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Pictures</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Location</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {hotels.map((hotel, idx) => {
                const firstPrice = hotel.prices && hotel.prices.length > 0 ? hotel.prices[0] : null;
                
                return (
                  <tr key={hotel._id || idx} className="hover:bg-gray-50">
                    <td className="px-3 py-2 align-top font-medium">{hotel.name || 'N/A'}</td>
                    <td className="px-3 py-2 align-top">{hotel.city || 'N/A'}</td>
                    <td className="px-3 py-2 align-top max-w-xs truncate" title={hotel.address}>
                      {hotel.address || 'N/A'}
                    </td>
                    <td className="px-3 py-2 align-top">{hotel.category_name || 'N/A'}</td>
                    <td className="px-3 py-2 align-top">{hotel.contact_number || 'N/A'}</td>
                    <td className="px-3 py-2 align-top">
                      <span className={`px-2 py-1 rounded text-xs ${hotel.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {hotel.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-top whitespace-nowrap">
                      {formatDateRange(hotel.available_from, hotel.available_until)}
                    </td>
                    <td className="px-3 py-2 align-top">{hotel.distance_meters || 'N/A'}</td>
                    <td className="px-3 py-2 align-top">{hotel.walking_time_minutes || 'N/A'}</td>
                    <td className="px-3 py-2 align-top">{hotel.walking_distance_meters || 'N/A'}</td>
                    <td className="px-3 py-2 align-top whitespace-nowrap">
                      {firstPrice ? formatDateRange(firstPrice.date_from, firstPrice.date_to) : 'N/A'}
                    </td>
                    <td className="px-3 py-2 align-top">
                      {firstPrice?.room_only_price || 'N/A'}
                    </td>
                    <td className="px-3 py-2 align-top">{getPriceByBedType(hotel.prices, 'sharing')}</td>
                    <td className="px-3 py-2 align-top">{getPriceByBedType(hotel.prices, 'quint')}</td>
                    <td className="px-3 py-2 align-top">{getPriceByBedType(hotel.prices, 'quad')}</td>
                    <td className="px-3 py-2 align-top">{getPriceByBedType(hotel.prices, 'triple')}</td>
                    <td className="px-3 py-2 align-top">{getPriceByBedType(hotel.prices, 'double')}</td>
                    <td className="px-3 py-2 align-top">
                      {hotel.photos && hotel.photos.length > 0 ? (
                        <a href={hotel.photos[0]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td className="px-3 py-2 align-top">
                      {hotel.google_location_link ? (
                        <a href={hotel.google_location_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Map
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex gap-2">
                        <button className="text-sm text-blue-600 hover:underline">Edit</button>
                        <button className="text-sm text-red-600 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
