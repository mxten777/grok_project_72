import { Truck, Shield, Zap, Users, ArrowRight, Star, Sparkles, TrendingUp, Award, CheckCircle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 lg:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-mesh-gradient opacity-30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-200/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent-200/20 to-transparent rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mb-8 animate-fade-in-up">
              <Sparkles className="h-4 w-4 mr-2" strokeWidth={2} />
              스마트 유통 플랫폼
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold mb-6 animate-fade-in-up delay-100">
              <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                에어컨 냉매·가스·부품
              </span>
              <br className="sm:hidden" />
              <span className="text-secondary-800 block sm:inline">
                스마트하게 주문하세요
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg lg:text-xl text-secondary-700 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              실시간 재고 확인, AI 기반 예측, 전문가 수준의 품질로
              <br className="hidden sm:block" />
              에너지 산업의 미래를 함께 만들어갑니다
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up delay-300 max-w-lg mx-auto">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-large hover:shadow-xl text-sm sm:text-base"
              >
                <Package className="mr-2 h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                상품 둘러보기
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
              </Link>
              <button className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-600 font-bold rounded-xl border-2 border-primary-200 hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 shadow-soft hover:shadow-medium text-sm sm:text-base">
                <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                회원가입
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 text-sm text-secondary-500 animate-fade-in-up delay-500 max-w-2xl mx-auto">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-500 mr-2 flex-shrink-0" strokeWidth={2} />
                <span>무료배송</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-500 mr-2 flex-shrink-0" strokeWidth={2} />
                <span>품질보증</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-500 mr-2 flex-shrink-0" strokeWidth={2} />
                <span>24/7 고객지원</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-secondary-800 mb-6">
              왜 한국코프론을 선택할까요?
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              산업 최고 수준의 기술과 서비스로 고객님의 비즈니스를 지원합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="card card-hover text-center group animate-fade-in-up">
              <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow transition-all duration-300">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">빠른 주문</h3>
              <p className="text-secondary-600 leading-relaxed">
                모바일로 간편하게 상품을 검색하고 주문하세요. 실시간 재고 확인으로 품절 걱정 없이 안정적인 공급을 보장합니다.
              </p>
            </div>

            <div className="card card-hover text-center group animate-fade-in-up delay-200">
              <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-glow-accent group-hover:shadow-glow-accent transition-all duration-300">
                <Truck className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">실시간 추적</h3>
              <p className="text-secondary-600 leading-relaxed">
                주문부터 배송까지 모든 과정을 실시간으로 확인하세요. GPS 기반 배송 추적으로 정확한 도착 시간을 예측합니다.
              </p>
            </div>

            <div className="card card-hover text-center group animate-fade-in-up delay-300">
              <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow transition-all duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">스마트 재고</h3>
              <p className="text-secondary-600 leading-relaxed">
                AI 기반 재고 예측으로 품절 걱정 없이 안정적인 공급을 보장합니다. 자동 재주문 시스템으로 효율적인 재고 관리를 지원합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6 text-white">
              신뢰할 수 있는 파트너
            </h2>
            <p className="text-lg text-primary-200 max-w-2xl mx-auto font-medium">
              10년 이상의 경험과 5,000개 이상의 고객사가 선택한 이유
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center animate-fade-in-up bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="text-4xl lg:text-5xl font-bold mb-3 text-white">10,000+</div>
              <div className="text-primary-200 text-base font-semibold mb-4">등록 상품</div>
              <div className="w-12 h-1 bg-accent-400 rounded-full mx-auto"></div>
            </div>
            <div className="text-center animate-fade-in-up delay-100 bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="text-4xl lg:text-5xl font-bold mb-3 text-white">5,000+</div>
              <div className="text-primary-200 text-base font-semibold mb-4">활성 고객</div>
              <div className="w-12 h-1 bg-accent-400 rounded-full mx-auto"></div>
            </div>
            <div className="text-center animate-fade-in-up delay-200 bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="text-4xl lg:text-5xl font-bold mb-3 text-white">98%</div>
              <div className="text-primary-200 text-base font-semibold mb-4">만족도</div>
              <div className="w-12 h-1 bg-accent-400 rounded-full mx-auto"></div>
            </div>
            <div className="text-center animate-fade-in-up delay-300 bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="text-4xl lg:text-5xl font-bold mb-3 text-white">24/7</div>
              <div className="text-primary-200 text-base font-semibold mb-4">고객지원</div>
              <div className="w-12 h-1 bg-accent-400 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-secondary-800 mb-6">
              고객님들의 이야기
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              실제 고객님들의 생생한 후기를 확인하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card animate-fade-in-up">
              <div className="flex items-center mb-6">
                <div className="flex text-accent-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <Award className="h-6 w-6 text-accent-500 ml-2" strokeWidth={2} />
              </div>
              <p className="text-secondary-600 mb-6 italic leading-relaxed">
                "한국코프론 덕분에 재고 관리와 주문 처리가 훨씬 효율적으로 바뀌었습니다. 실시간 추적 기능이 특히 마음에 들어요."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">김</span>
                </div>
                <div>
                  <div className="font-bold text-secondary-900">김철수 대표</div>
                  <div className="text-sm text-secondary-500">에어컨 서비스 전문점</div>
                </div>
              </div>
            </div>

            <div className="card animate-fade-in-up delay-200">
              <div className="flex items-center mb-6">
                <div className="flex text-accent-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <Award className="h-6 w-6 text-accent-500 ml-2" strokeWidth={2} />
              </div>
              <p className="text-secondary-600 mb-6 italic leading-relaxed">
                "품질 좋은 제품을 합리적인 가격에 공급받을 수 있어 만족합니다. 고객지원도 빠르고 친절합니다."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">이</span>
                </div>
                <div>
                  <div className="font-bold text-secondary-900">이영희 실장</div>
                  <div className="text-sm text-secondary-500">냉난방 설비 회사</div>
                </div>
              </div>
            </div>

            <div className="card animate-fade-in-up delay-300">
              <div className="flex items-center mb-6">
                <div className="flex text-accent-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <Award className="h-6 w-6 text-accent-500 ml-2" strokeWidth={2} />
              </div>
              <p className="text-secondary-600 mb-6 italic leading-relaxed">
                "스마트한 플랫폼으로 업무 효율성이 크게 향상되었습니다. 앞으로도 계속 이용할 계획입니다."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">박</span>
                </div>
                <div>
                  <div className="font-bold text-secondary-900">박민수 팀장</div>
                  <div className="text-sm text-secondary-500">에너지 솔루션 기업</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container-custom relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <TrendingUp className="h-16 w-16 mx-auto mb-8 text-accent-300" strokeWidth={2} />
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
              지금 바로 시작하세요
            </h2>
            <p className="text-lg text-primary-100 mb-12 leading-relaxed">
              무료 회원가입으로 한국코프론의 모든 기능을 경험해보세요.
              <br />
              첫 주문 시 특별 할인 혜택을 제공합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-accent-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                상품 둘러보기
                <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-primary-500/20 text-white font-bold rounded-xl border-2 border-white/30 hover:bg-primary-500/30 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                <Users className="mr-2 h-5 w-5" strokeWidth={2} />
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;