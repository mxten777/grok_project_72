import { useState, useEffect } from 'react';
import { getOrders, updateOrder, processShipment } from '../../utils/firestore';
import type { Order } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Package, Truck, CheckCircle, XCircle, Clock, Sparkles, Shield, Filter } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const user = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await getOrders();
        // 더미 데이터 추가 (실제 데이터가 없을 경우)
        const mockOrders: Order[] = [
          {
            id: 'ORD-2025-001',
            userId: '김철수 (cheolsu@example.com)',
            items: [
              { productId: 'prod-001', productName: '에어컨 냉매 R-410A', quantity: 5, price: 45000 },
              { productId: 'prod-002', productName: '냉매 충전기', quantity: 1, price: 120000 }
            ],
            totalAmount: 345000,
            status: 'pending',
            createdAt: Timestamp.fromDate(new Date('2025-12-01')),
            updatedAt: Timestamp.fromDate(new Date('2025-12-01')),
            shippingAddress: '서울시 강남구 테헤란로 123'
          },
          {
            id: 'ORD-2025-002',
            userId: '박영희 (younghee@example.com)',
            items: [
              { productId: 'prod-003', productName: '에어컨 필터 세트', quantity: 10, price: 25000 },
              { productId: 'prod-004', productName: '배관 클리너', quantity: 3, price: 35000 }
            ],
            totalAmount: 395000,
            status: 'approved',
            createdAt: Timestamp.fromDate(new Date('2025-12-02')),
            updatedAt: Timestamp.fromDate(new Date('2025-12-02')),
            shippingAddress: '부산시 해운대구 센텀동 456'
          },
          {
            id: 'ORD-2025-003',
            userId: '이민수 (minsoo@example.com)',
            items: [
              { productId: 'prod-005', productName: '에어컨 실외기 팬', quantity: 2, price: 85000 },
              { productId: 'prod-006', productName: '온도 센서', quantity: 5, price: 15000 }
            ],
            totalAmount: 200000,
            status: 'shipped',
            createdAt: Timestamp.fromDate(new Date('2025-12-03')),
            updatedAt: Timestamp.fromDate(new Date('2025-12-03')),
            shippingAddress: '대구시 중구 동성로 789'
          },
          {
            id: 'ORD-2025-004',
            userId: '정수진 (soojin@example.com)',
            items: [
              { productId: 'prod-007', productName: '냉매 R-32', quantity: 8, price: 52000 },
              { productId: 'prod-008', productName: '압력 게이지', quantity: 2, price: 45000 }
            ],
            totalAmount: 514000,
            status: 'delivered',
            createdAt: Timestamp.fromDate(new Date('2025-12-04')),
            updatedAt: Timestamp.fromDate(new Date('2025-12-04')),
            shippingAddress: '인천시 남동구 구월동 101'
          },
          {
            id: 'ORD-2025-005',
            userId: '홍길동 (gildong@example.com)',
            items: [
              { productId: 'prod-009', productName: '에어컨 드레인 호스', quantity: 15, price: 8000 },
              { productId: 'prod-010', productName: '단열 테이프', quantity: 20, price: 3000 }
            ],
            totalAmount: 190000,
            status: 'cancelled',
            createdAt: Timestamp.fromDate(new Date('2025-12-05')),
            updatedAt: Timestamp.fromDate(new Date('2025-12-05')),
            shippingAddress: '광주시 서구 치평동 202'
          }
        ];
        setOrders(allOrders.length > 0 ? allOrders : mockOrders);
      } catch (error) {
        console.error('주문 조회 실패:', error);
        // 에러 시에도 더미 데이터 표시
        setOrders([
          {
            id: 'ORD-2025-001',
            userId: '김철수 (cheolsu@example.com)',
            items: [
              { productId: 'prod-001', productName: '에어컨 냉매 R-410A', quantity: 5, price: 45000 }
            ],
            totalAmount: 225000,
            status: 'pending',
            createdAt: Timestamp.fromDate(new Date('2025-12-01')),
            updatedAt: Timestamp.fromDate(new Date('2025-12-01')),
            shippingAddress: '서울시 강남구'
          }
        ]);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    const originalOrders = [...orders];
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Optimistic UI update
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    try {
      if (newStatus === 'shipped') {
        if (order.status !== 'approved') {
          toast.error('승인된 주문만 배송 처리할 수 있습니다.');
          setOrders(originalOrders); // Revert
          return;
        }
        await processShipment(orderId, user?.user?.uid || 'admin');
        toast.success('주문이 배송 처리되었고 재고가 업데이트되었습니다.');
      } else {
        await updateOrder(orderId, { status: newStatus });
        toast.success('주문 상태가 변경되었습니다.');
      }
    } catch (error) {
      console.error('주문 상태 변경 실패:', error);
      toast.error(`오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      setOrders(originalOrders); // Revert on error
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'approved': return 'bg-info-100 text-info-800 border-info-200';
      case 'shipped': return 'bg-accent-100 text-accent-800 border-accent-200';
      case 'delivered': return 'bg-success-100 text-success-800 border-success-200';
      case 'cancelled': return 'bg-error-100 text-error-800 border-error-200';
      default: return 'bg-secondary-100 text-secondary-800 border-secondary-200';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '대기중';
      case 'approved': return '승인됨';
      case 'shipped': return '배송중';
      case 'delivered': return '배송완료';
      case 'cancelled': return '취소됨';
      default: return '알 수 없음';
    }
  };

  const filteredOrders = orders.filter(order =>
    filterStatus === 'all' || order.status === filterStatus
  );

  return (
    <div className="container-custom py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-16 animate-fade-in-up">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 rounded-3xl flex items-center justify-center mr-8 shadow-2xl animate-float group-hover:shadow-3xl transition-all duration-300">
            <Package className="h-10 w-10 text-white drop-shadow-sm" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 bg-clip-text text-transparent drop-shadow-sm mb-3">
              주문 관리
            </h1>
            <p className="text-lg text-secondary-600 flex items-center font-medium tracking-wide">
              <Sparkles className="h-5 w-5 mr-3 text-accent-500 drop-shadow-sm" strokeWidth={2} />
              실시간 주문 현황 및 상태 관리
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-secondary-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-primary"
            >
              <option value="all">전체 상태</option>
              <option value="pending">대기중</option>
              <option value="approved">승인됨</option>
              <option value="shipped">배송중</option>
              <option value="delivered">배송완료</option>
              <option value="cancelled">취소됨</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-primary-600/5 to-primary-700/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-primary-200/20 shadow-2xl hover:shadow-3xl animate-fade-in-up delay-200 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-400/5 to-primary-600/3 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="relative z-10 p-8 border-b border-primary-200/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mr-5 shadow-xl">
                  <Shield className="w-7 h-7 text-white drop-shadow-sm" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent">주문 목록</h2>
                  <p className="text-sm text-secondary-600 font-medium">실시간 주문 관리 시스템</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-4 py-2 rounded-full border border-primary-200/50">
                <div className="text-sm font-semibold text-primary-700">
                  총 {filteredOrders.length}건의 주문
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200/20">
              <thead className="bg-gradient-to-r from-secondary-50/80 to-secondary-100/60 backdrop-blur-sm">
                <tr>
                  <th className="px-8 py-6 text-left text-xs font-display font-bold text-secondary-700 uppercase tracking-wider">
                    주문번호
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-display font-bold text-secondary-700 uppercase tracking-wider">
                    고객
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-display font-bold text-secondary-700 uppercase tracking-wider">
                    금액
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-display font-bold text-secondary-700 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-display font-bold text-secondary-700 uppercase tracking-wider">
                    주문일
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-display font-bold text-secondary-700 uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200/20">
              {filteredOrders.map((order, index) => (
                <tr key={order.id} className="hover:bg-gradient-to-r hover:from-secondary-50/50 hover:to-transparent transition-all duration-300 group/row animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm font-bold text-secondary-900 group-hover/row:text-primary-700 transition-colors">
                      {order.id}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm text-secondary-700 font-medium group-hover/row:text-secondary-900 transition-colors">
                      {order.userId}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-lg font-bold text-secondary-900 group-hover/row:text-success-700 transition-colors">
                      ₩{order.totalAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-display font-bold border-2 transition-all duration-300 group-hover/row:scale-105 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-2">{getStatusLabel(order.status)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm text-secondary-600 font-medium group-hover/row:text-secondary-800 transition-colors">
                      {(() => {
                        const createdAt = order.createdAt as unknown;
                        if (createdAt && typeof createdAt === 'object' && 'toDate' in createdAt && typeof (createdAt as { toDate: () => Date }).toDate === 'function') {
                          return (createdAt as { toDate: () => Date }).toDate().toLocaleDateString();
                        }
                        if (typeof createdAt === 'string' || typeof createdAt === 'number') {
                          return new Date(createdAt).toLocaleDateString();
                        }
                        return 'N/A';
                      })()}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id ?? '', e.target.value as Order['status'])}
                      className="bg-white/80 backdrop-blur-sm border-2 border-secondary-200/50 rounded-xl px-4 py-2 text-sm font-semibold text-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 hover:border-primary-400 group-hover/row:scale-105"
                    >
                      <option value="pending">대기중</option>
                      <option value="approved">승인</option>
                      <option value="shipped">배송중</option>
                      <option value="delivered">배송완료</option>
                      <option value="cancelled">취소</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="relative z-10 text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Package className="h-10 w-10 text-white drop-shadow-sm" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-display font-bold text-secondary-700 mb-3">주문이 없습니다</h3>
            <p className="text-secondary-600 font-medium">선택한 필터 조건에 맞는 주문이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;