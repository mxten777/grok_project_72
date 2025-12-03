import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getOrders } from '../utils/firestore';
import { Package, Clock, CheckCircle, Truck, XCircle, Calendar, Filter, Search, ChevronRight, MapPin, ArrowRight, UserX, Inbox } from 'lucide-react';
import type { Order } from '../types';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const user = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const userOrders = await getOrders(user.user!.uid);
          setOrders(userOrders);
        } catch (error) {
          console.error('주문 내역 조회 실패:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', label: '주문 대기' };
      case 'approved':
        return { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', label: '승인 완료' };
      case 'shipped':
        return { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50', label: '배송 중' };
      case 'delivered':
        return { icon: Package, color: 'text-green-600', bg: 'bg-green-50', label: '배송 완료' };
      case 'cancelled':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: '주문 취소' };
      default:
        return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50', label: '알 수 없음' };
    }
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      const matchesSearch = (order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.items.some(item => item.productName.toLowerCase().includes(searchQuery.toLowerCase()))) ?? false;
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => (b.createdAt as unknown as { toMillis: () => number }).toMillis() - (a.createdAt as unknown as { toMillis: () => number }).toMillis());

  if (!user) {
    return (
      <div className="container-custom py-20">
        <div className="text-center animate-fade-in-up">
          <div className="card p-16 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float">
              <UserX className="h-12 w-12 text-primary-600" />
            </div>
            <h1 className="text-4xl font-display font-bold text-secondary-900 mb-4">
              로그인이 필요합니다
            </h1>
            <p className="text-xl text-secondary-600 mb-12 max-w-md mx-auto leading-relaxed">
              주문 내역을 확인하시려면 먼저 로그인해주세요.
            </p>
            <Link
              to="/login"
              className="btn-primary group text-lg py-4 px-8"
            >
              로그인 페이지로 이동
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in-up">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-6"></div>
          <p className="text-lg text-secondary-600">주문 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-12 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold text-secondary-900 mb-2 flex items-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center mr-4">
                <Package className="h-7 w-7 text-white" />
              </div>
              주문 내역
            </h1>
            <p className="text-xl text-secondary-600">
              총 {orders.length}개의 주문 기록이 있습니다
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
              최근 30일
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="glass rounded-3xl p-8 shadow-soft mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search className="h-6 w-6 text-secondary-400" />
            </div>
            <input
              type="text"
              placeholder="주문번호 또는 상품명으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-primary pl-12 text-lg py-4"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Filter className="h-6 w-6 text-secondary-500" />
              <span className="font-semibold text-secondary-900">상태 필터</span>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-6 py-4 bg-white border border-secondary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-lg"
            >
              <option value="all">전체 주문</option>
              <option value="pending">주문 대기</option>
              <option value="approved">승인 완료</option>
              <option value="shipped">배송 중</option>
              <option value="delivered">배송 완료</option>
              <option value="cancelled">주문 취소</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center animate-fade-in-up delay-200">
          <div className="card p-16 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float">
              <Inbox className="h-12 w-12 text-secondary-500" />
            </div>
            <h1 className="text-4xl font-display font-bold text-secondary-900 mb-4">
              {searchQuery || filterStatus !== 'all' ? '검색된 주문이 없습니다' : '아직 주문 내역이 없습니다'}
            </h1>
            <p className="text-xl text-secondary-600 mb-12 max-w-md mx-auto leading-relaxed">
              {searchQuery || filterStatus !== 'all'
                ? '다른 검색어나 필터로 다시 시도해보세요.'
                : '아직 주문하신 상품이 없습니다. 멋진 상품들을 둘러보세요!'}
            </p>
            <Link
              to="/products"
              className="btn-primary group text-lg py-4 px-8"
            >
              <Package className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              상품 둘러보기
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              const orderDate = (order.createdAt as unknown as { toDate: () => Date }).toDate();

              return (
                <div
                  key={order.id}
                  className="card p-0 overflow-hidden animate-fade-in-up hover:shadow-large transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-primary-50 via-primary-25 to-secondary-50 px-8 py-6 border-b border-secondary-100/50">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-secondary-600">주문번호</span>
                            <span className="text-sm font-mono font-bold text-secondary-900 bg-secondary-100 px-3 py-1 rounded-full">
                              #{order.id?.slice(0, 8)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-secondary-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {orderDate.toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className={`flex items-center gap-3 px-4 py-3 ${statusInfo.bg} rounded-2xl border border-opacity-50`}>
                          <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
                          <span className={`font-semibold ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-secondary-500 mb-1">총 금액</div>
                          <div className="text-2xl font-bold text-gradient-primary">
                            ₩{order.totalAmount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-8 py-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-4 px-6 bg-secondary-50/50 rounded-2xl border border-secondary-100/50 hover:bg-secondary-50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-6 flex-1">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft">
                              <Package className="h-8 w-8 text-primary-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-secondary-900 text-lg line-clamp-1 mb-1">
                                {item.productName}
                              </h4>
                              <p className="text-secondary-600">
                                수량: <span className="font-medium text-primary-600">{item.quantity}개</span> × ₩{item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-secondary-900">
                              ₩{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 px-8 py-6 border-t border-secondary-200/50">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      <div className="flex items-center text-secondary-600">
                        <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center mr-3">
                          <MapPin className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-medium text-secondary-900 mb-1">배송지</div>
                          <div className="text-sm">{order.shippingAddress}</div>
                        </div>
                      </div>
                      <button className="btn-secondary group">
                        상세보기
                        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  {(order.status === 'shipped' || order.status === 'delivered' || order.status === 'approved') && (
                    <div className="px-8 py-8 bg-gradient-to-r from-primary-50/30 via-accent-50/20 to-secondary-50/30 border-t border-secondary-200/50">
                      <div className="flex items-center justify-between max-w-3xl mx-auto">
                        {['주문접수', '승인완료', '배송중', '배송완료'].map((step, index) => {
                          const stepStatuses = ['pending', 'approved', 'shipped', 'delivered'];
                          const currentStepIndex = stepStatuses.indexOf(order.status);
                          const isActive = index <= currentStepIndex;
                          const isCompleted = index < currentStepIndex;

                          return (
                            <div key={step} className="flex items-center flex-1">
                              <div className="flex flex-col items-center flex-1">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                                  isCompleted
                                    ? 'bg-success-500 text-white shadow-glow'
                                    : isActive
                                    ? 'bg-primary-500 text-white shadow-glow'
                                    : 'bg-secondary-200 text-secondary-500'
                                }`}>
                                  {isCompleted ? <CheckCircle size={20} /> : index + 1}
                                </div>
                                <span className={`text-sm mt-3 font-medium text-center ${
                                  isActive ? 'text-primary-700' : 'text-secondary-500'
                                }`}>
                                  {step}
                                </span>
                              </div>
                              {index < 3 && (
                                <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
                                  isCompleted ? 'bg-success-500' : index < currentStepIndex ? 'bg-primary-500' : 'bg-secondary-200'
                                }`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center animate-fade-in-up delay-200">
              <div className="card p-16 max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float">
                  <Inbox className="h-12 w-12 text-secondary-500" />
                </div>
                <h1 className="text-4xl font-display font-bold text-secondary-900 mb-4">
                  검색된 주문이 없습니다
                </h1>
                <p className="text-xl text-secondary-600 mb-12 max-w-md mx-auto leading-relaxed">
                  다른 검색어나 필터로 다시 시도해보세요.
                </p>
                <Link
                  to="/products"
                  className="btn-primary group text-lg py-4 px-8"
                >
                  <Package className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                  상품 둘러보기
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;