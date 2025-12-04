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
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-2xl border-b border-secondary-200/30">
        <div className="container-custom">
          <div className="flex justify-between items-center h-20 lg:h-24">
            {/* Logo */}
            <div className="flex items-center">
              <Link to={isAdmin ? '/admin' : '/'} className="flex items-center space-x-4 group">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-105">
                  <Package className="h-7 w-7 lg:h-8 lg:w-8 text-white drop-shadow-sm" strokeWidth={2} />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl lg:text-3xl font-display font-bold bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 bg-clip-text text-transparent drop-shadow-sm">
                    한국코프론
                  </h1>
                  <p className="text-sm text-secondary-600 font-medium -mt-1 tracking-wide">스마트 유통 플랫폼</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 flex-wrap justify-center">
              {nav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 xl:px-5 py-3 rounded-2xl font-semibold transition-all duration-300 group shadow-sm hover:shadow-md ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-xl'
                        : 'text-secondary-700 hover:text-primary-700 hover:bg-primary-50/80 border border-transparent hover:border-primary-200/50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 transition-all duration-300 group-hover:scale-110 ${
                      isActive ? 'text-white drop-shadow-sm' : 'text-secondary-600 group-hover:text-primary-600'
                    }`} strokeWidth={2} />
                    <span className="hidden xl:block text-sm tracking-wide">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <button className="hidden sm:flex items-center justify-center w-12 h-12 text-secondary-600 hover:text-primary-700 hover:bg-primary-50/80 rounded-2xl transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md border border-transparent hover:border-primary-200/50">
                <Search className="h-6 w-6" strokeWidth={2} />
              </button>

              {/* Notifications */}
              <button className="hidden sm:flex items-center justify-center w-12 h-12 text-secondary-600 hover:text-primary-700 hover:bg-primary-50/80 rounded-2xl transition-all duration-300 hover:scale-105 relative shadow-sm hover:shadow-md border border-transparent hover:border-primary-200/50">
                <Bell className="h-6 w-6" strokeWidth={2} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full border-2 border-white shadow-sm"></span>
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 p-3 rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 transition-all duration-300 hover:scale-105 border-2 border-primary-500/50 shadow-xl hover:shadow-2xl font-semibold ring-2 ring-primary-400/30 hover:ring-primary-500/50"
                >
                  {user ? (
                    <>
                      <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                        <UserCircle className="h-6 w-6 text-white drop-shadow-sm" strokeWidth={2} />
                      </div>
                      <span className="hidden sm:block text-sm font-medium tracking-wide">
                        {user.displayName || user.email?.split('@')[0] || '사용자'}
                      </span>
                    </>
                  ) : (
                    <Link to="/login" className="inline-flex items-center px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20">
                      로그인
                    </Link>
                  )}
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && user && (
                  <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-secondary-200/50 animate-scale-in">
                    <div className="p-5 border-b border-secondary-200/50">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center shadow-xl">
                          <UserCircle className="h-8 w-8 text-white drop-shadow-sm" strokeWidth={2} />
                        </div>
                        <div>
                          <p className="font-bold text-secondary-900 text-lg">{user?.displayName || '사용자'}</p>
                          <p className="text-sm text-secondary-600 font-medium">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-4 px-4 py-3 rounded-2xl text-secondary-700 hover:bg-primary-50/80 hover:text-primary-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md border border-transparent hover:border-primary-200/50"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <UserCircle className="h-5 w-5" strokeWidth={2} />
                        <span>프로필</span>
                      </Link>
                      {isAdminUser && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-4 px-4 py-3 rounded-2xl text-secondary-700 hover:bg-primary-50/80 hover:text-primary-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md border border-transparent hover:border-primary-200/50"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <BarChart3 className="h-5 w-5" strokeWidth={2} />
                          <span>관리자</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-4 px-4 py-3 rounded-2xl text-secondary-700 hover:bg-error-50 hover:text-error-600 transition-all duration-300 font-medium shadow-sm hover:shadow-md border border-transparent hover:border-error-200/50"
                      >
                        <LogOut className="h-5 w-5" strokeWidth={2} />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-12 h-12 text-secondary-600 hover:text-primary-700 hover:bg-primary-50/80 rounded-2xl transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md border border-transparent hover:border-primary-200/50"
              >
                {isMobileMenuOpen ? <X className="h-7 w-7" strokeWidth={2} /> : <Menu className="h-7 w-7" strokeWidth={2} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-secondary-200/50 animate-slide-down shadow-2xl">
            <div className="px-6 py-8 space-y-3">
              {nav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-xl'
                        : 'text-secondary-700 hover:text-primary-700 hover:bg-primary-50/80 border border-transparent hover:border-primary-200/50'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${isActive ? 'text-white drop-shadow-sm' : 'text-secondary-600'}`} strokeWidth={2} />
                    <span className="text-base tracking-wide">{item.label}</span>
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