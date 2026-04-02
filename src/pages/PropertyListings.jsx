import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProperties } from '../services/propertyService';
import { Search, MapPin, DollarSign, Maximize, Filter, Home } from 'lucide-react';

const PropertyListings = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    location: ''
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error("Error fetching properties", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    let result = properties;

    if (searchTerm) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.location) {
      result = result.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
    }

    if (filters.minPrice) {
      result = result.filter(p => p.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    setFilteredProperties(result);
  }, [searchTerm, filters, properties]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Available Properties</h1>
          <p className="text-gray-600">Find the perfect place to call home.</p>
        </div>
        
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search by title or location..."
            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center gap-2 mb-6 font-bold text-gray-900">
              <Filter size={20} />
              <span>Filters</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City / Location</label>
                <input 
                  type="text"
                  className="w-full p-2.5 border rounded-lg text-sm"
                  placeholder="e.g. New York"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    className="w-full p-2.5 border rounded-lg text-sm"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  />
                  <span className="text-gray-400">-</span>
                  <input 
                    type="number"
                    className="w-full p-2.5 border rounded-lg text-sm"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  setFilters({ minPrice: '', maxPrice: '', location: '' });
                  setSearchTerm('');
                }}
                className="w-full text-sm font-medium text-primary-600 hover:text-primary-700 py-2"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-3">
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-xl border p-20 text-center">
              <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProperties.map((property) => (
                <Link 
                  key={property.id} 
                  to={`/property/${property.id}`}
                  className="bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition group"
                >
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={property.imageUrls?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
                      alt={property.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary-700 shadow-sm">
                      NEW LISTING
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition truncate">{property.title}</h3>
                      <div className="flex items-center text-primary-600 font-bold bg-primary-50 px-2 py-1 rounded-lg">
                        <span className="text-base">${property.price}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <MapPin size={16} className="mr-1" />
                      <span>{property.location}</span>
                    </div>

                    <div className="flex items-center gap-4 text-gray-600 text-sm pt-4 border-t">
                      <div className="flex items-center gap-1">
                        <Maximize size={16} className="text-gray-400" />
                        <span>{property.area} sqft</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Home size={16} className="text-gray-400" />
                        <span>{property.type || 'Entire Place'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyListings;
