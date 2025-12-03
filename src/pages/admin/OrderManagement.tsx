import { useState, useEffect } from 'react';
import { getOrders, updateOrder, processShipment } from '../../utils/firestore';
import type { Order } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Package, Truck, CheckCircle, XCircle, Clock, Sparkles, Shield, Filter } from 'lucide-react';

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const user = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await getOrders();
        setOrders(allOrders);
      } catch (error) {
        console.error('주문 조회 실패:', error);
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
      <div className="flex items-center justify-between mb-12 animate-fade-in-up">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl flex items-center justify-center mr-6 shadow-large animate-float">
            <Package className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-secondary-900 mb-2">
              주문 관리
            </h1>
            <p className="text-secondary-600 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-accent-500" />
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
      <div className="card animate-fade-in-up delay-200">
        <div className="p-8 border-b border-secondary-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-display font-bold text-secondary-900">주문 목록</h2>
            </div>
            <div className="text-sm text-secondary-600">
              총 {filteredOrders.length}건의 주문
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200/30">
            <thead className="bg-secondary-50/50">
              <tr>
                <th className="px-8 py-6 text-left text-xs font-display font-bold text-secondary-600 uppercase tracking-wider">
                  주문번호
                </th>
                <th className="px-8 py-6 text-left text-xs font-display font-bold text-secondary-600 uppercase tracking-wider">
                  고객
                </th>
                <th className="px-8 py-6 text-left text-xs font-display font-bold text-secondary-600 uppercase tracking-wider">
                  금액
                </th>
                <th className="px-8 py-6 text-left text-xs font-display font-bold text-secondary-600 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-8 py-6 text-left text-xs font-display font-bold text-secondary-600 uppercase tracking-wider">
                  주문일
                </th>
                <th className="px-8 py-6 text-left text-xs font-display font-bold text-secondary-600 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200/30">
              {filteredOrders.map((order, index) => (
                <tr key={order.id} className="hover:bg-secondary-50/30 transition-all duration-200 animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm font-display font-bold text-secondary-900">
                      {order.id}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm text-secondary-700">
                      {order.userId}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-lg font-display font-bold text-secondary-900">
                      ₩{order.totalAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-display font-bold border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-2">{getStatusLabel(order.status)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm text-secondary-600">
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
                      className="input-primary text-sm"
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

        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">주문이 없습니다</h3>
            <p className="text-secondary-600">선택한 필터 조건에 맞는 주문이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;