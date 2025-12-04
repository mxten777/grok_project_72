import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ShoppingCart, DollarSign, AlertTriangle, Users, Package, TrendingUp, Bell, BarChart3, Sparkles, Shield } from 'lucide-react';

const Dashboard = () => {
  // 샘플 데이터
  const salesData = [
    { month: '1월', sales: 1200000 },
    { month: '2월', sales: 1500000 },
    { month: '3월', sales: 1800000 },
    { month: '4월', sales: 2200000 },
    { month: '5월', sales: 2500000 },
    { month: '6월', sales: 2800000 },
  ];

  const orderStatusData = [
    { name: '대기', value: 45, color: '#fbbf24' },
    { name: '처리중', value: 30, color: '#3b82f6' },
    { name: '완료', value: 156, color: '#10b981' },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'ABC 냉매', amount: '₩450,000', status: '완료', date: '2025-01-15' },
    { id: 'ORD-002', customer: 'XYZ 부품', amount: '₩320,000', status: '처리중', date: '2025-01-14' },
    { id: 'ORD-003', customer: 'DEF 가스', amount: '₩680,000', status: '대기', date: '2025-01-13' },
    { id: 'ORD-004', customer: 'GHI 냉매', amount: '₩290,000', status: '완료', date: '2025-01-12' },
  ];

  const notifications = [
    { id: 1, message: '재고 부족: R-134a 냉매 (남은 수량: 5개)', type: 'warning', time: '10분 전' },
    { id: 2, message: '새 주문 접수: ORD-005 (₩750,000)', type: 'info', time: '1시간 전' },
    { id: 3, message: '월간 목표 달성: 85% (₩10,500,000 / ₩12,000,000)', type: 'success', time: '2시간 전' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '완료': return 'text-success-600 bg-success-100';
      case '처리중': return 'text-info-600 bg-info-100';
      case '대기': return 'text-warning-600 bg-warning-100';
      default: return 'text-secondary-600 bg-secondary-100';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-l-warning-500 bg-warning-50';
      case 'info': return 'border-l-info-500 bg-info-50';
      case 'success': return 'border-l-success-500 bg-success-50';
      default: return 'border-l-secondary-500 bg-secondary-50';
    }
  };

  return (
    <div className="container-custom py-8 sm:py-12 lg:py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-16 animate-fade-in-up">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 rounded-3xl flex items-center justify-center mr-8 shadow-2xl animate-float group-hover:shadow-3xl transition-all duration-300">
            <BarChart3 className="h-10 w-10 text-white drop-shadow-sm" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 bg-clip-text text-transparent drop-shadow-sm mb-3">
              관리자 대시보드
            </h1>
            <p className="text-lg text-secondary-600 flex items-center font-medium tracking-wide">
              <Sparkles className="h-5 w-5 mr-3 text-accent-500 drop-shadow-sm" strokeWidth={2} />
              실시간 비즈니스 현황 모니터링
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <button className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white px-8 py-4 font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-primary-500/50 hover:border-primary-600/70">
            보고서 내보내기
          </button>
        </div>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-16">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-primary-600/10 to-primary-700/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-primary-200/30 shadow-2xl hover:shadow-3xl animate-fade-in-up delay-100 hover:scale-[1.02] transition-all duration-500 cursor-pointer group/card overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-400/10 to-primary-600/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-secondary-700 mb-3 tracking-wide uppercase">총 주문</p>
                  <p className="text-5xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent mb-3">156</p>
                  <div className="flex items-center">
                    <div className="flex items-center bg-success-50 px-3 py-1 rounded-full border border-success-200/50">
                      <TrendingUp className="w-4 h-4 mr-2 text-success-600" strokeWidth={2} />
                      <span className="text-sm font-semibold text-success-700">+12% 전월 대비</span>
                    </div>
                  </div>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl flex items-center justify-center shadow-xl group-hover/card:shadow-2xl transition-all duration-500 group-hover/card:scale-110">
                  <ShoppingCart className="w-10 h-10 text-white drop-shadow-sm" strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-success-500/20 via-success-600/10 to-success-700/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-success-200/30 shadow-2xl hover:shadow-3xl animate-fade-in-up delay-200 hover:scale-[1.02] transition-all duration-500 cursor-pointer group/card overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-success-400/10 to-success-600/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-secondary-700 mb-3 tracking-wide uppercase">총 매출</p>
                  <p className="text-5xl font-display font-bold bg-gradient-to-r from-success-700 to-success-900 bg-clip-text text-transparent mb-3">₩12,450,000</p>
                  <div className="flex items-center">
                    <div className="flex items-center bg-success-50 px-3 py-1 rounded-full border border-success-200/50">
                      <TrendingUp className="w-4 h-4 mr-2 text-success-600" strokeWidth={2} />
                      <span className="text-sm font-semibold text-success-700">+18% 전월 대비</span>
                    </div>
                  </div>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-success-500 via-success-600 to-success-700 rounded-3xl flex items-center justify-center shadow-xl group-hover/card:shadow-2xl transition-all duration-500 group-hover/card:scale-110">
                  <DollarSign className="w-10 h-10 text-white drop-shadow-sm" strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-error-500/20 via-error-600/10 to-error-700/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-error-200/30 shadow-2xl hover:shadow-3xl animate-fade-in-up delay-300 hover:scale-[1.02] transition-all duration-500 cursor-pointer group/card overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-error-400/10 to-error-600/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-secondary-700 mb-3 tracking-wide uppercase">재고 부족 상품</p>
                  <p className="text-5xl font-display font-bold bg-gradient-to-r from-error-700 to-error-900 bg-clip-text text-transparent mb-3">3</p>
                  <div className="flex items-center">
                    <div className="flex items-center bg-error-50 px-3 py-1 rounded-full border border-error-200/50">
                      <AlertTriangle className="w-4 h-4 mr-2 text-error-600" strokeWidth={2} />
                      <span className="text-sm font-semibold text-error-700">긴급 확인 필요</span>
                    </div>
                  </div>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-error-500 via-error-600 to-error-700 rounded-3xl flex items-center justify-center shadow-xl group-hover/card:shadow-2xl transition-all duration-500 group-hover/card:scale-110">
                  <Package className="w-10 h-10 text-white drop-shadow-sm" strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-info-500/20 via-info-600/10 to-info-700/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-info-200/30 shadow-2xl hover:shadow-3xl animate-fade-in-up delay-400 hover:scale-[1.02] transition-all duration-500 cursor-pointer group/card overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-info-400/10 to-info-600/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-secondary-700 mb-3 tracking-wide uppercase">신규 고객</p>
                  <p className="text-5xl font-display font-bold bg-gradient-to-r from-info-700 to-info-900 bg-clip-text text-transparent mb-3">24</p>
                  <div className="flex items-center">
                    <div className="flex items-center bg-success-50 px-3 py-1 rounded-full border border-success-200/50">
                      <TrendingUp className="w-4 h-4 mr-2 text-success-600" strokeWidth={2} />
                      <span className="text-sm font-semibold text-success-700">+8% 전월 대비</span>
                    </div>
                  </div>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-info-500 via-info-600 to-info-700 rounded-3xl flex items-center justify-center shadow-xl group-hover/card:shadow-2xl transition-all duration-500 group-hover/card:scale-110">
                  <Users className="w-10 h-10 text-white drop-shadow-sm" strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* 매출 추이 차트 */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-primary-600/5 to-primary-700/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-primary-200/20 shadow-2xl hover:shadow-3xl animate-fade-in-up delay-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-400/5 to-primary-600/3 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mr-5 shadow-xl">
                  <TrendingUp className="w-7 h-7 text-white drop-shadow-sm" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent">월별 매출 추이</h3>
                  <p className="text-sm text-secondary-600 font-medium">지난 6개월 매출 현황</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280} className="sm:h-[320px]">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    fontSize={12}
                    fontWeight={500}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    fontWeight={500}
                    tick={{ fill: '#6b7280' }}
                    tickFormatter={(value) => `₩${(value / 10000).toFixed(0)}만`}
                  />
                  <Tooltip
                    formatter={(value) => [`₩${value.toLocaleString()}`, '매출']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(229, 231, 235, 0.5)',
                      borderRadius: '16px',
                      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    labelStyle={{ color: '#374151', fontWeight: '600' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="url(#primaryGradient)"
                    strokeWidth={3}
                    dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 6, stroke: '#ffffff' }}
                    activeDot={{ r: 8, stroke: '#0ea5e9', strokeWidth: 2, fill: '#ffffff' }}
                  />
                  <defs>
                    <linearGradient id="primaryGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 주문 상태 차트 */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 via-accent-600/5 to-accent-700/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-accent-200/20 shadow-2xl hover:shadow-3xl animate-fade-in-up delay-600 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent-400/5 to-accent-600/3 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-500 via-accent-600 to-accent-700 rounded-2xl flex items-center justify-center mr-5 shadow-xl">
                  <BarChart3 className="w-7 h-7 text-white drop-shadow-sm" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold bg-gradient-to-r from-accent-700 to-accent-900 bg-clip-text text-transparent">주문 상태 분포</h3>
                  <p className="text-sm text-secondary-600 font-medium">현재 주문 처리 현황</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280} className="sm:h-[320px]">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="white"
                    strokeWidth={2}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value}건`, name]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(229, 231, 235, 0.5)',
                      borderRadius: '16px',
                      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    labelStyle={{ color: '#374151', fontWeight: '600' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                {orderStatusData.map((item) => (
                  <div key={item.name} className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-secondary-200/30 shadow-sm">
                    <div className="w-4 h-4 rounded-full mr-3 shadow-md" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-semibold text-secondary-700">{item.name}: {item.value}건</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 최근 주문 및 알림 센터 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* 최근 주문 */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-success-500/10 via-success-600/5 to-success-700/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-success-200/20 shadow-2xl hover:shadow-3xl animate-fade-in-up delay-700 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-success-400/5 to-success-600/3 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="relative z-10 p-8 border-b border-success-200/30">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-success-500 via-success-600 to-success-700 rounded-2xl flex items-center justify-center mr-5 shadow-xl">
                  <Package className="w-7 h-7 text-white drop-shadow-sm" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold bg-gradient-to-r from-success-700 to-success-900 bg-clip-text text-transparent">최근 주문</h3>
                  <p className="text-sm text-secondary-600 font-medium">실시간 주문 현황</p>
                </div>
              </div>
            </div>
            <div className="relative z-10 overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-secondary-50/80 to-secondary-100/60 backdrop-blur-sm">
                    <tr>
                      <th className="px-8 py-5 text-left text-xs font-display font-bold text-secondary-700 uppercase tracking-wider">주문번호</th>
                      <th className="px-8 py-5 text-left text-xs font-display font-bold text-secondary-700 uppercase tracking-wider">고객사</th>
                      <th className="px-8 py-5 text-left text-xs font-display font-bold text-secondary-700 uppercase tracking-wider">금액</th>
                      <th className="px-8 py-5 text-left text-xs font-display font-bold text-secondary-700 uppercase tracking-wider">상태</th>
                      <th className="px-8 py-5 text-left text-xs font-display font-bold text-secondary-700 uppercase tracking-wider">날짜</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200/20">
                    {recentOrders.map((order, index) => (
                      <tr key={order.id} className="hover:bg-gradient-to-r hover:from-secondary-50/50 hover:to-transparent transition-all duration-300 group/row">
                        <td className="px-8 py-6 whitespace-nowrap text-sm font-display font-bold text-secondary-900 group-hover/row:text-primary-700 transition-colors">{order.id}</td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm text-secondary-700 font-medium group-hover/row:text-secondary-900 transition-colors">{order.customer}</td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm font-semibold text-secondary-900 group-hover/row:text-success-700 transition-colors">{order.amount}</td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className={`inline-flex px-4 py-2 text-xs font-display font-bold rounded-full border-2 transition-all duration-300 ${getStatusColor(order.status)} group-hover/row:scale-105`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm text-secondary-600 font-medium group-hover/row:text-secondary-800 transition-colors">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 알림 센터 */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-warning-500/10 via-warning-600/5 to-warning-700/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-warning-200/20 shadow-2xl hover:shadow-3xl animate-fade-in-up delay-800 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-warning-400/5 to-warning-600/3 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="relative z-10 p-8 border-b border-warning-200/30 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-warning-500 via-warning-600 to-warning-700 rounded-2xl flex items-center justify-center mr-5 shadow-xl">
                  <Bell className="w-7 h-7 text-white drop-shadow-sm" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold bg-gradient-to-r from-warning-700 to-warning-900 bg-clip-text text-transparent">알림 센터</h3>
                  <p className="text-sm text-secondary-600 font-medium">중요 알림 및 업데이트</p>
                </div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white drop-shadow-sm" strokeWidth={2} />
              </div>
            </div>
            <div className="relative z-10 divide-y divide-secondary-200/20">
              {notifications.map((notification, index) => (
                <div key={notification.id} className={`p-6 border-l-4 ${getNotificationColor(notification.type)} hover:bg-gradient-to-r hover:from-secondary-50/30 hover:to-transparent transition-all duration-300 group/notification cursor-pointer`}>
                  <p className="text-sm font-semibold text-secondary-900 leading-relaxed break-words group-hover/notification:text-secondary-800 transition-colors">{notification.message}</p>
                  <p className="text-xs text-secondary-600 mt-3 flex items-center font-medium">
                    <Sparkles className="w-4 h-4 mr-2 text-accent-500" strokeWidth={2} />
                    {notification.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
                  {notification.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;