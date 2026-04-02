import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProperties } from '../services/propertyService';
import { Link } from 'react-router-dom';
import { Search, MapPin, DollarSign, ChevronRight, PlusCircle } from 'lucide-react';

const TenantDashboard = () => {
  const { userData } = useAuth();
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await getProperties();
        setRecentProperties(data.slice(0, 3));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="space-y-10">
      <div className="bg-white rounded-3xl p-8 border shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome back, {userData?.name}!</h1>
          <p className="text-gray-600">Ready to find your next dream home?</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link 
              to="/properties" 
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200"
            >
              <Search size={20} />
              <span>Search Rentals</span>
            </Link>
            <Link 
              to="/add-property" 
              className="inline-flex items-center gap-2 bg-white text-gray-900 border-2 border-gray-100 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm"
            >
              <PlusCircle size={20} />
              <span>Post Your Property</span>
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <MapPin size={300} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 text-xl">0</div>
          <h3 className="font-bold text-gray-900">Active Applications</h3>
          <p className="text-sm text-gray-500">Track your ongoing rental interests</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4 text-xl">2</div>
          <h3 className="font-bold text-gray-900">Inquiries Sent</h3>
          <p className="text-sm text-gray-500">Owners you've contacted recently</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4 text-xl">5</div>
          <h3 className="font-bold text-gray-900">Saved Properties</h3>
          <p className="text-sm text-gray-500">Places you've bookmarked for later</p>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Listings</h2>
          <Link to="/properties" className="text-primary-600 font-medium flex items-center hover:underline">
            View all <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="animate-pulse flex gap-6">
            {[1, 2, 3].map(i => <div key={i} className="flex-1 h-64 bg-gray-200 rounded-2xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProperties.map(prop => (
              <Link key={prop.id} to={`/property/${prop.id}`} className="block group">
                <div className="relative h-48 rounded-2xl overflow-hidden mb-3">
                  <img src={prop.imageUrls?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-900 flex items-center">
                    <DollarSign size={12} /> {prop.price}/mo
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition truncate">{prop.title}</h4>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin size={14} /> {prop.location}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TenantDashboard;
