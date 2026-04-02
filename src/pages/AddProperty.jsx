import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadImages, addProperty } from '../services/propertyService';
import { Upload, X, Loader2, DollarSign, MapPin, Maximize, FileText } from 'lucide-react';

const AddProperty = () => {
  const { currentUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      const imageUrls = await uploadImages(images);
      
      await addProperty({
        ...data,
        ownerId: currentUser.uid,
        ownerName: currentUser.displayName || 'Owner',
        imageUrls,
        price: parseFloat(data.price),
        area: parseFloat(data.area),
      });

      navigate('/owner-dashboard');
    } catch (err) {
      setError('Failed to add property');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">List New Property</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-xl border shadow-sm">
        {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
            <input 
              {...register("title", { required: "Title is required" })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
              placeholder="Modern 2BHK Apartment in Downtown"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input 
                {...register("location", { required: "Location is required" })}
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
                placeholder="New York, NY"
              />
            </div>
            {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per Month ($)</label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input 
                {...register("price", { required: "Price is required" })}
                type="number"
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
                placeholder="1500"
              />
            </div>
            {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area (Sq Ft)</label>
            <div className="relative">
              <Maximize size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input 
                {...register("area", { required: "Area is required" })}
                type="number"
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
                placeholder="1200"
              />
            </div>
            {errors.area && <p className="mt-1 text-xs text-red-600">{errors.area.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <select 
              {...register("type", { required: "Type is required" })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Studio">Studio</option>
              <option value="Condo">Condo</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['WiFi', 'Parking', 'Air Conditioning', 'Kitchen', 'Gym', 'Pool', 'Pet Friendly', 'Furnished'].map(amenity => (
                <label key={amenity} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" value={amenity} {...register("amenities")} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <div className="relative">
              <FileText size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <textarea 
                {...register("description", { required: "Description is required" })}
                rows="4"
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
                placeholder="Describe your property details, amenities, etc."
              ></textarea>
            </div>
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Property Images</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {images.map((img, index) => (
              <div key={index} className="relative h-24 w-full group">
                <img src={URL.createObjectURL(img)} alt="preview" className="h-full w-full object-cover rounded-lg border" />
                <button 
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <Upload size={24} className="text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">Upload</span>
              <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition shadow-md flex justify-center items-center gap-2"
        >
          {uploading ? <Loader2 className="animate-spin" /> : "List Property"}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
