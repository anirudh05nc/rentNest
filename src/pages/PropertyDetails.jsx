import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';
import { MapPin, DollarSign, Maximize, User, Send, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const PropertyDetails = () => {
  const { id } = useParams();
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (error) {
        console.error("Error fetching property", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (!message.trim()) return;

    try {
      setSending(true);
      
      // Create a conversation/message in Firestore
      await addDoc(collection(db, 'messages'), {
        senderId: currentUser.uid,
        senderName: userData?.name || 'Tenant',
        receiverId: property.ownerId,
        propertyId: property.id,
        propertyTitle: property.title,
        message: message.trim(),
        timestamp: serverTimestamp(),
      });

      setSent(true);
      setMessage('');
    } catch (error) {
      console.error("Error sending message", error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  if (!property) return <div className="text-center py-20"><h2 className="text-2xl font-bold">Property not found</h2></div>;

  return (
    <div className="py-8">
      {/* Image Gallery */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-8 aspect-video md:aspect-[21/9]">
        <img 
          src={property.imageUrls?.[activeImage]} 
          alt={property.title} 
          className="w-full h-full object-cover transition-all duration-700" 
        />
        
        {property.imageUrls?.length > 1 && (
          <>
            <button 
              onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : property.imageUrls.length - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => setActiveImage((prev) => (prev < property.imageUrls.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {property.imageUrls?.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setActiveImage(i)}
              className={`h-2 w-2 rounded-full transition-all ${activeImage === i ? 'bg-white w-6' : 'bg-white/50'}`} 
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-primary-100">AVAILABLE</span>
              <span className="text-gray-500 text-sm flex items-center gap-1">
                <MapPin size={16} />
                {property.location}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{property.title}</h1>
            <div className="flex gap-8 py-6 border-y">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Monthly Rent</span>
                <span className="text-2xl font-bold text-primary-600">${property.price}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Floorspace</span>
                <span className="text-2xl font-bold text-gray-900">{property.area} sqft</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Features & Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                <Home size={18} className="text-primary-500" />
                <span className="font-medium">{property.type || 'Entire Place'}</span>
              </div>
              {property.amenities?.map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <CheckCircle2 size={18} className="text-primary-500" />
                  <span>{feat}</span>
                </div>
              ))}
              {(!property.amenities || property.amenities.length === 0) && (
                <p className="text-gray-400 text-sm italic col-span-full">No specific amenities listed.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Contact Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border shadow-xl p-8 sticky top-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{property.ownerName || 'Listed by Owner'}</h3>
                <p className="text-sm text-gray-500">Professional Host</p>
              </div>
            </div>

            {sent ? (
              <div className="text-center py-6">
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h4>
                <p className="text-gray-500 mb-6">The owner will get back to you shortly via the chat system.</p>
                <button 
                  onClick={() => setSent(false)}
                  className="text-primary-600 font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900">Contact the Owner</h4>
                <textarea 
                  rows="4"
                  className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition text-sm bg-gray-50"
                  placeholder="Hi, I'm interested in this property. Is it still available?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
                <button 
                  type="submit"
                  disabled={sending}
                  className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg flex items-center justify-center gap-2 group"
                >
                  {sending ? <Loader2 size={20} className="animate-spin" /> : (
                    <>
                      <span>Send Message</span>
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
                {!currentUser && (
                  <p className="text-xs text-center text-gray-500">
                    You'll need to <Link to="/login" className="text-primary-600 hover:underline">sign in</Link> to contact the owner.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
