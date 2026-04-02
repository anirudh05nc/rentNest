import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProperties, deleteProperty } from '../services/propertyService';
import { Plus, Edit, Trash2, MapPin, DollarSign } from 'lucide-react';

const OwnerDashboard = () => {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties({ ownerId: currentUser.uid });
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchProperties();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(id);
        setProperties(properties.filter(p => p.id !== id));
      } catch (error) {
        alert("Failed to delete property");
      }
    }
  };

  if (loading) return <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-xl mb-10 overflow-hidden relative">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-2">Welcome Back!</h1>
          <p className="text-primary-100 text-lg">Manage your properties and connect with potential tenants.</p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Home size={160} />
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
        <Link 
          to="/add-property" 
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition shadow-sm"
        >
          <Plus size={20} />
          <span>Add Property</span>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center space-y-6 shadow-sm">
          <div className="mx-auto w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-4">
            <Plus size={40} />
          </div>
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to list your first property?</h2>
            <p className="text-gray-500 mb-8">Join thousands of owners who trust RentNest to find reliable tenants and manage their rentals with ease.</p>
            <Link 
              to="/add-property" 
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200"
            >
              <Plus size={20} />
              <span>Get Started Now</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden bg-gray-100">
                <img 
                  src={property.imageUrls?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
                  alt={property.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{property.title}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin size={16} className="mr-1" />
                  <span>{property.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-primary-600 font-bold">
                    <DollarSign size={18} />
                    <span className="text-xl">{property.price}</span>
                    <span className="text-sm font-normal text-gray-500 ml-1">/mo</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-primary-600 transition">
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(property.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
