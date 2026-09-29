import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProduceProvider } from './context/ProduceContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FarmerDashboardLayout } from './components/farmer/FarmerDashboardLayout';
import { FarmerPriceDiscoveryPage } from './pages/FarmerPriceDiscoveryPage';
import { NetRealisationPage } from './pages/farmer/NetRealisationPage';
import { FPOAggregationPage } from './pages/farmer/FPOAggregationPage';
import { SellWaitPage } from './pages/farmer/SellWaitPage';
import { BuyerMatchingPage } from './pages/farmer/BuyerMatchingPage';
import { CropRescuePage } from './pages/farmer/CropRescuePage';
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ProduceProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Unified Farmer Dashboard with Shared Header & 6-Module Nav */}
              <Route
                path="/farmer"
                element={
                  <ProtectedRoute allowedRoles={['FARMER']}>
                    <FarmerDashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="price-discovery" replace />} />
                <Route path="price-discovery" element={<FarmerPriceDiscoveryPage />} />
                <Route path="net-realisation" element={<NetRealisationPage />} />
                <Route path="fpo" element={<FPOAggregationPage />} />
                <Route path="sell-wait" element={<SellWaitPage />} />
                <Route path="buyer-matching" element={<BuyerMatchingPage />} />
                <Route path="crop-rescue" element={<CropRescuePage />} />
              </Route>

              {/* Protected Buyer Routes */}
              <Route
                path="/buyer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['BUYER']}>
                    <BuyerDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallbacks */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </ProduceProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
