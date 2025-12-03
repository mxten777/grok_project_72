/**
 * 한국코프론 스마트 유통 플랫폼 메인 애플리케이션
 *
 * 이 애플리케이션은 React Router를 사용하여 고객용 웹앱과 관리자 대시보드를
 * 단일 페이지 애플리케이션으로 제공합니다.
 *
 * 주요 기능:
 * - 고객용: 상품 브라우징, 장바구니, 주문
 * - 관리자용: 주문 관리, 대시보드
 *
 * @author 한국코프론 개발팀
 * @version 1.0.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Support from './pages/Support';
import Wishlist from './pages/Wishlist';
import Signup from './pages/Signup';
import Dashboard from './pages/admin/Dashboard';
import OrderManagement from './pages/admin/OrderManagement';
import ProductManagement from './pages/admin/ProductManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import PriceManagement from './pages/admin/PriceManagement';
import QnAManagement from './pages/admin/QnAManagement';

const AppRoutes = () => {
  const location = useLocation();
  console.log('AppRoutes: Current location', location.pathname);
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Customer routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Layout><Products /></Layout>} />
        <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/orders" element={<Layout><Orders /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/support" element={<Layout><Support /></Layout>} />
        <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin><Layout isAdmin><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute requireAdmin><Layout isAdmin><OrderManagement /></Layout></ProtectedRoute>} />
        <Route path="/admin/inventory" element={<ProtectedRoute requireAdmin><Layout isAdmin><InventoryManagement /></Layout></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute requireAdmin><Layout isAdmin><ProductManagement /></Layout></ProtectedRoute>} />
        <Route path="/admin/pricing" element={<ProtectedRoute requireAdmin><Layout isAdmin><PriceManagement /></Layout></ProtectedRoute>} />
        <Route path="/admin/qna" element={<ProtectedRoute requireAdmin><Layout isAdmin><QnAManagement /></Layout></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin><Layout isAdmin><div>분석</div></Layout></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
              }}
            />
            <AppRoutes />
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
export default App;
