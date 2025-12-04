import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Menu, X, Search, Bell, UserCircle, ShoppingCart, Heart, Package, BarChart3, Settings, LogOut } from 'lucide-react';
import AnimatedPage from './AnimatedPage';

interface LayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

const Layout = ({ children, isAdmin = false }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

  console.log('Layout: Current user state', user);
  console.log('Layout: User email', user?.email);
  console.log('Layout: User exists', !!user);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const customerNav = [
    { path: '/', label: '홈', icon: Package },
    { path: '/products', label: '상품', icon: Package },
    { path: '/cart', label: '장바구니', icon: ShoppingCart },
    { path: '/orders', label: '주문내역', icon: Package },
    { path: '/wishlist', label: '위시리스트', icon: Heart },
    { path: '/support', label: '고객지원', icon: Settings },
  ];

  // 관리자 이메일 체크 (임시로 모든 로그인 사용자를 관리자로 설정)
  const isAdminUser = user?.email ? true : false;

  const adminNav = [
    { path: '/admin', label: '대시보드', icon: BarChart3 },
    { path: '/admin/orders', label: '주문관리', icon: Package },
    { path: '/admin/inventory', label: '재고관리', icon: Package },
    { path: '/admin/products', label: '상품관리', icon: Package },
    { path: '/admin/pricing', label: '가격정책', icon: Settings },
    { path: '/admin/qna', label: '상품문의', icon: Settings },
    { path: '/admin/analytics', label: '분석', icon: BarChart3 },
  ];

  const nav = isAdmin ? adminNav : customerNav;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-secondary-200/50 backdrop-blur-xl">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16 lg:h-18">
            {/* Logo */}
            <div className="flex items-center">
              <Link to={isAdmin ? '/admin' : '/'} className="flex items-center space-x-3 group">
                <div className="w-10 h-10 lg:w-12 lg:h-12 gradient-primary rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-glow transition-all duration-300">
                  <Package className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl lg:text-2xl font-display font-bold text-gradient-primary">
                    한국코프론
                  </h1>
                  <p className="text-xs text-secondary-500 -mt-1">스마트 유통 플랫폼</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {nav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-glow'
                        : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-secondary-500 group-hover:text-primary-500'
                    }`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <button className="hidden sm:flex items-center justify-center w-10 h-10 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200 hover:scale-105">
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button className="hidden sm:flex items-center justify-center w-10 h-10 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200 hover:scale-105 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-rose-500 text-white hover:from-emerald-600 hover:to-rose-600 transition-all duration-200 hover:scale-105 border border-emerald-400 shadow-lg hover:shadow-xl font-medium"
                >
                  {user ? (
                    <>
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-soft">
                        <UserCircle className="h-5 w-5 text-white" />
                      </div>
                      <span className="hidden sm:block text-sm font-medium">
                        {user.displayName || user.email?.split('@')[0] || '사용자'}
                      </span>
                    </>
                  ) : (
                    <Link to="/login" className="inline-flex items-center px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-all duration-200 shadow-soft hover:shadow-medium">
                      로그인
                    </Link>
                  )}
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && user && (
                  <div className="absolute right-0 mt-2 w-64 glass rounded-2xl shadow-large border border-secondary-200/50 animate-scale-in">
                    <div className="p-4 border-b border-secondary-200/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                          <UserCircle className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-secondary-900">{user?.displayName || '사용자'}</p>
                          <p className="text-sm text-secondary-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-3 py-2 rounded-xl text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-all duration-200"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <UserCircle className="h-5 w-5" />
                        <span>프로필</span>
                      </Link>
                      {isAdminUser && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-3 py-2 rounded-xl text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-all duration-200"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <BarChart3 className="h-5 w-5" />
                          <span>관리자</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-secondary-700 hover:bg-error-50 hover:text-error-600 transition-all duration-200"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden glass border-t border-secondary-200/50 animate-slide-down">
            <div className="px-4 py-6 space-y-2">
              {nav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-glow'
                        : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-secondary-500'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <AnimatedPage>{children}</AnimatedPage>
      </main>
    </div>
  );
};

export default Layout;