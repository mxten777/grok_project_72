import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Calendar, Package, ShoppingCart,
  Heart, Settings, Edit2, Save, X, Award, Clock, Sparkles,
  Shield, TrendingUp, Star
} from 'lucide-react';

const Profile = () => {
  const user = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    name: '김철수',
    phone: '010-1234-5678',
    email: user?.user?.email || '',
    address: '서울시 강남구 테헤란로 123',
    company: '(주)에어컨 서비스',
  });

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  const stats = [
    { label: '총 주문', value: '24건', icon: Package, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: '총 구매액', value: '₩3,250,000', icon: ShoppingCart, color: 'text-green-600', bg: 'bg-green-50' },
    { label: '위시리스트', value: '8개', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
    { label: '적립 포인트', value: '12,500P', icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  const recentActivities = [
    { id: 1, type: '주문', description: 'R-410A 냉매 외 2건', date: '2025-12-01', status: '배송 중' },
    { id: 2, type: '리뷰', description: '압축기 필터 리뷰 작성', date: '2025-11-28', status: '완료' },
    { id: 3, type: '문의', description: '대량 구매 문의', date: '2025-11-25', status: '답변 완료' },
    { id: 4, type: '주문', description: '콘덴서 코일', date: '2025-11-20', status: '배송 완료' },
  ];

  if (!user) {
    return (
      <div className="container-custom py-20">
        <div className="text-center animate-fade-in-up">
          <div className="card p-16 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float">
              <User className="h-12 w-12 text-primary-600" />
            </div>
            <h1 className="text-4xl font-display font-bold text-secondary-900 mb-4">
              로그인이 필요합니다
            </h1>
            <p className="text-xl text-secondary-600 mb-12 max-w-md mx-auto leading-relaxed">
              프로필을 확인하려면 로그인해주세요
            </p>
            <Link
              to="/login"
              className="btn-primary group text-lg py-4 px-8"
            >
              <Shield className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              로그인하기
              <Sparkles className="ml-3 h-6 w-6 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
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
                <User className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              내 프로필
            </h1>
            <p className="text-xl text-secondary-600">
              회원님의 정보와 활동 내역을 관리하세요
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
              GOLD 회원
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Card */}
          <div className="card p-0 overflow-hidden animate-fade-in-up delay-100">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-primary-50 via-primary-25 to-accent-50 px-8 py-8 border-b border-secondary-200/50">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-soft animate-float">
                  <User className="h-12 w-12 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-display font-bold text-secondary-900 mb-2">{editedInfo.name}</h2>
                  <p className="text-lg text-secondary-600 mb-3">{editedInfo.company}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium">
                      <Calendar className="h-4 w-4" strokeWidth={2} />
                      가입일: 2025년 3월
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium">
                      <Award className="h-4 w-4" strokeWidth={2} />
                      GOLD 등급
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    isEditing
                      ? 'bg-error-500 text-white hover:bg-error-600'
                      : 'btn-secondary'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <X className="mr-2 h-5 w-5" />
                      취소
                    </>
                  ) : (
                    <>
                      <Edit2 className="mr-2 h-5 w-5" />
                      정보 수정
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-secondary-700">
                    <Mail className="h-5 w-5 mr-2 text-primary-600" strokeWidth={2} />
                    이메일 주소
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedInfo.email}
                      onChange={(e) => setEditedInfo({...editedInfo, email: e.target.value})}
                      className="input-primary"
                    />
                  ) : (
                    <p className="text-lg text-secondary-900 font-medium">{editedInfo.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-secondary-700">
                    <Phone className="h-5 w-5 mr-2 text-primary-600" strokeWidth={2} />
                    전화번호
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedInfo.phone}
                      onChange={(e) => setEditedInfo({...editedInfo, phone: e.target.value})}
                      className="input-primary"
                    />
                  ) : (
                    <p className="text-lg text-secondary-900 font-medium">{editedInfo.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-secondary-700">
                  <MapPin className="h-5 w-5 mr-2 text-primary-600" strokeWidth={2} />
                  배송 주소
                </label>
                {isEditing ? (
                  <textarea
                    value={editedInfo.address}
                    onChange={(e) => setEditedInfo({...editedInfo, address: e.target.value})}
                    className="input-primary h-24 resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-lg text-secondary-900 font-medium leading-relaxed">{editedInfo.address}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-6 border-t border-secondary-200">
                  <button
                    onClick={handleSave}
                    className="flex-1 btn-primary group text-lg py-4"
                  >
                    <Save className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    저장하기
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 btn-ghost text-lg py-4"
                  >
                    취소
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card p-8 animate-fade-in-up delay-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-display font-bold text-secondary-900 flex items-center">
                <Clock className="h-6 w-6 mr-3 text-primary-600" strokeWidth={2} />
                최근 활동
              </h3>
              <Link
                to="/orders"
                className="btn-ghost text-base py-2 px-4"
              >
                전체보기 →
              </Link>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-6 bg-gradient-to-r from-secondary-50 to-secondary-25 rounded-2xl border border-secondary-100/50 hover:shadow-soft transition-all duration-200 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-soft ${
                      activity.type === '주문' ? 'bg-primary-100 text-primary-600' :
                      activity.type === '리뷰' ? 'bg-accent-100 text-accent-600' :
                      'bg-success-100 text-success-600'
                    }`}>
                      {activity.type === '주문' ? <Package className="h-6 w-6" strokeWidth={2} /> :
                       activity.type === '리뷰' ? <Star className="h-6 w-6" strokeWidth={2} /> :
                       <Mail className="h-6 w-6" strokeWidth={2} />}
                    </div>
                    <div>
                      <p className="font-semibold text-secondary-900 text-lg">{activity.description}</p>
                      <p className="text-secondary-600">{activity.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold px-4 py-2 rounded-full ${
                    activity.status.includes('완료') ? 'bg-success-100 text-success-800' :
                    activity.status.includes('중') ? 'bg-primary-100 text-primary-800' :
                    'bg-warning-100 text-warning-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Settings */}
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="space-y-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="card p-6 hover:shadow-large transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center shadow-soft`}>
                        <Icon className={`h-7 w-7 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-secondary-600 font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                      </div>
                    </div>
                    <TrendingUp className="h-5 w-5 text-success-500" strokeWidth={2} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Membership Card */}
          <div className="bg-gradient-to-br from-accent-50 via-yellow-50 to-accent-100 rounded-3xl shadow-large p-8 border border-accent-200/50 animate-fade-in-up delay-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold text-secondary-900 flex items-center">
                <Award className="h-6 w-6 mr-3 text-accent-600" strokeWidth={2} />
                멤버십 등급
              </h3>
              <Sparkles className="h-5 w-5 text-accent-500" strokeWidth={2} />
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-soft animate-float">
                <Award className="h-10 w-10 text-white" strokeWidth={2} />
              </div>
              <p className="text-3xl font-display font-bold text-secondary-900 mb-2">GOLD</p>
              <p className="text-secondary-600 mb-6">다음 등급까지 ₩750,000</p>
              <div className="w-full bg-secondary-200 rounded-full h-3 mb-2">
                <div className="bg-gradient-to-r from-accent-400 to-accent-600 h-3 rounded-full shadow-soft" style={{width: '65%'}}></div>
              </div>
              <p className="text-sm text-secondary-500">65% 달성</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-8 animate-fade-in-up delay-500">
            <h3 className="text-xl font-display font-bold text-secondary-900 mb-6 flex items-center">
              <Settings className="h-6 w-6 mr-3 text-primary-600" strokeWidth={2} />
              빠른 설정
            </h3>
            <div className="space-y-3">
              <Link
                to="/orders"
                className="flex items-center justify-between w-full p-4 bg-secondary-50 hover:bg-secondary-100 rounded-2xl transition-all duration-200 group"
              >
                <span className="font-medium text-secondary-900">주문 내역 보기</span>
                <Package className="h-5 w-5 text-secondary-500 group-hover:text-primary-600 transition-colors" strokeWidth={2} />
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center justify-between w-full p-4 bg-secondary-50 hover:bg-secondary-100 rounded-2xl transition-all duration-200 group"
              >
                <span className="font-medium text-secondary-900">위시리스트</span>
                <Heart className="h-5 w-5 text-secondary-500 group-hover:text-error-600 transition-colors" strokeWidth={2} />
              </Link>
              <Link
                to="/support"
                className="flex items-center justify-between w-full p-4 bg-secondary-50 hover:bg-secondary-100 rounded-2xl transition-all duration-200 group"
              >
                <span className="font-medium text-secondary-900">고객 지원</span>
                <Settings className="h-5 w-5 text-secondary-500 group-hover:text-primary-600 transition-colors" strokeWidth={2} />
              </Link>
              <button className="flex items-center justify-between w-full p-4 bg-error-50 hover:bg-error-100 rounded-2xl transition-all duration-200 group text-error-700">
                <span className="font-medium">로그아웃</span>
                <X className="h-5 w-5 group-hover:scale-110 transition-transform" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;