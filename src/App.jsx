import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerDashboard from './pages/OwnerDashboard';
import AddProperty from './pages/AddProperty';
import PropertyListings from './pages/PropertyListings';
import PropertyDetails from './pages/PropertyDetails';
import Chat from './pages/Chat';
import TenantDashboard from './pages/TenantDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <Layout>
              <div className="py-20 text-center max-w-4xl mx-auto px-4">
                <h1 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">Find Your <span className="text-primary-600">Dream Nest</span></h1>
                <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">Discover premium rentals designed for modern living. Your journey to a better home starts here.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a href="/properties" className="bg-primary-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200 text-lg">Browse Properties</a>
                  <a href="/register" className="bg-white text-gray-900 border-2 border-gray-100 px-10 py-4 rounded-xl font-bold hover:bg-gray-50 transition text-lg">List Your Property</a>
                </div>
                
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                  <div className="p-6 bg-white rounded-2xl border shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 font-bold">1</div>
                    <h3 className="font-bold text-lg mb-2">Search</h3>
                    <p className="text-gray-500 text-sm">Find properties that match your lifestyle and budget.</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border shadow-sm">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4 font-bold">2</div>
                    <h3 className="font-bold text-lg mb-2">Connect</h3>
                    <p className="text-gray-500 text-sm">Chat directly with owners in real-time.</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border shadow-sm">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 font-bold">3</div>
                    <h3 className="font-bold text-lg mb-2">Move In</h3>
                    <p className="text-gray-500 text-sm">Secure your dream home with ease and confidence.</p>
                  </div>
                </div>
              </div>
            </Layout>
          } />

          <Route path="/my-properties" element={
            <ProtectedRoute>
              <Layout showSidebar>
                <OwnerDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/add-property" element={
            <ProtectedRoute>
              <Layout showSidebar>
                <AddProperty />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/properties" element={
            <Layout>
              <PropertyListings />
            </Layout>
          } />

          <Route path="/property/:id" element={
            <Layout>
              <PropertyDetails />
            </Layout>
          } />

          <Route path="/chat" element={
            <ProtectedRoute>
              <Layout showSidebar>
                <Chat />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout showSidebar>
                <TenantDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Fallback */}
          <Route path="*" element={<div className="p-10">404 - Not Found</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
