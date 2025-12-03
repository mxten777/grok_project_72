import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone, MapPin, Clock, MessageCircle, HeadphonesIcon, Shield, Sparkles } from 'lucide-react';

const Support = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: '주문 취소는 어떻게 하나요?',
      answer: '주문 취소는 주문 완료 후 1시간 이내에 고객센터로 연락주시면 가능합니다. 이후에는 상품 준비가 시작되어 취소가 어려울 수 있습니다.'
    },
    {
      question: '배송 기간은 얼마나 걸리나요?',
      answer: '일반적으로 주문 확인 후 1-3일 이내에 배송이 시작됩니다. 지역에 따라 배송 기간이 다를 수 있으며, 자세한 사항은 주문 시 확인 가능합니다.'
    },
    {
      question: '반품 및 교환 정책은 어떻게 되나요?',
      answer: '상품 수령 후 7일 이내에 반품/교환이 가능합니다. 단, 사용 흔적이 있거나 포장이 훼손된 경우는 어려울 수 있습니다.'
    },
    {
      question: '대량 구매 문의는 어떻게 하나요?',
      answer: '대량 구매의 경우 별도 문의를 부탁드립니다. 기업 담당자가 상담해드리겠습니다.'
    },
    {
      question: '제품 보증 기간은 어떻게 되나요?',
      answer: '모든 제품은 1년의 품질 보증 기간을 제공합니다. 보증 기간 내 무상 수리가 가능합니다.'
    },
    {
      question: '안전한 사용을 위한 주의사항이 있나요?',
      answer: '냉매 가스 취급 시 반드시 전문가에게 맡겨주시고, 환기가 잘 되는 곳에서 작업하세요. 안전 수칙을 준수해주세요.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="container-custom py-16">
      {/* Header */}
      <div className="text-center mb-16 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl shadow-large mb-8 animate-float">
          <HeadphonesIcon className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl font-display font-bold text-secondary-900 mb-6">
          고객지원
        </h1>
        <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
          궁금하신 사항이 있으시면 언제든 문의해주세요
        </p>
        <div className="flex items-center justify-center mt-6">
          <Sparkles className="h-5 w-5 text-accent-500 mr-2" />
          <span className="text-accent-600 font-medium">24시간 전문 상담</span>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="glass p-8 rounded-3xl text-center animate-fade-in-up delay-100 hover:scale-105 transition-all duration-300 cursor-pointer group">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:shadow-large transition-shadow">
            <Phone className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-display font-bold text-secondary-900 mb-3">전화 상담</h3>
          <p className="text-secondary-600 text-sm mb-4">평일 09:00 - 18:00</p>
          <p className="text-2xl font-display font-bold text-primary-600">02-123-4567</p>
        </div>

        <div className="glass p-8 rounded-3xl text-center animate-fade-in-up delay-200 hover:scale-105 transition-all duration-300 cursor-pointer group">
          <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:shadow-large transition-shadow">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-display font-bold text-secondary-900 mb-3">이메일 문의</h3>
          <p className="text-secondary-600 text-sm mb-4">24시간 접수</p>
          <p className="text-lg font-medium text-accent-600">support@hancom.co.kr</p>
        </div>

        <div className="glass p-8 rounded-3xl text-center animate-fade-in-up delay-300 hover:scale-105 transition-all duration-300 cursor-pointer group">
          <div className="w-16 h-16 bg-gradient-to-br from-success-400 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:shadow-large transition-shadow">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-display font-bold text-secondary-900 mb-3">방문 상담</h3>
          <p className="text-secondary-600 text-sm mb-4">서울시 강남구</p>
          <p className="text-lg font-medium text-success-600">지도 보기</p>
        </div>

        <div className="glass p-8 rounded-3xl text-center animate-fade-in-up delay-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
          <div className="w-16 h-16 bg-gradient-to-br from-info-400 to-info-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:shadow-large transition-shadow">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-display font-bold text-secondary-900 mb-3">실시간 채팅</h3>
          <p className="text-secondary-600 text-sm mb-4">평일 09:00 - 18:00</p>
          <p className="text-lg font-medium text-info-600">채팅 시작</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="card p-10 mb-16 animate-fade-in-up delay-500">
        <div className="text-center mb-10">
          <Shield className="h-8 w-8 text-primary-600 mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
            자주 묻는 질문
          </h2>
          <p className="text-secondary-600">가장 많이 받는 질문들을 모았습니다</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-secondary-200/50 rounded-2xl overflow-hidden hover:shadow-soft transition-all duration-200">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-secondary-50/50 transition-all duration-200 group"
              >
                <span className="text-lg font-medium text-secondary-900 group-hover:text-primary-600 transition-colors">{faq.question}</span>
                <div className="w-8 h-8 bg-secondary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  {openFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-primary-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-secondary-500 group-hover:text-primary-600 transition-colors" />
                  )}
                </div>
              </button>

              {openFAQ === index && (
                <div className="px-8 pb-6 text-secondary-600 leading-relaxed animate-fade-in-up">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-gradient-to-br from-primary-50 via-info-50 to-primary-100 rounded-3xl p-10 mb-16 shadow-large border border-primary-200/50 animate-fade-in-up delay-600">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft animate-float">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">운영 시간</h2>
          <p className="text-secondary-600">언제든 편하게 문의해주세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-2xl text-center">
            <h3 className="text-xl font-display font-bold text-secondary-900 mb-4">고객센터</h3>
            <div className="space-y-3 text-secondary-600">
              <div className="flex justify-between items-center py-2 px-4 bg-white/50 rounded-xl">
                <span className="font-medium">평일</span>
                <span>09:00 - 18:00</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 bg-white/50 rounded-xl">
                <span className="font-medium">토요일</span>
                <span>09:00 - 12:00</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 bg-white/50 rounded-xl">
                <span className="font-medium">일요일/공휴일</span>
                <span className="text-error-600">휴무</span>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-2xl text-center">
            <h3 className="text-xl font-display font-bold text-secondary-900 mb-4">긴급 문의</h3>
            <div className="space-y-3 text-secondary-600">
              <div className="flex justify-between items-center py-2 px-4 bg-white/50 rounded-xl">
                <span className="font-medium">접수 시간</span>
                <span className="text-success-600 font-medium">24시간</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 bg-white/50 rounded-xl">
                <span className="font-medium">응답 시간</span>
                <span>2시간 이내</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 bg-white/50 rounded-xl">
                <span className="font-medium">이메일</span>
                <span className="text-accent-600 font-medium">emergency@hancom.co.kr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Placeholder */}
      <div className="card p-10 animate-fade-in-up delay-700">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-soft animate-float">
            <MessageCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-display font-bold text-secondary-900 mb-6">
            문의하기
          </h2>
          <h3 className="text-xl font-medium text-secondary-900 mb-4">
            빠른 문의를 위해
          </h3>
          <p className="text-secondary-600 mb-8 max-w-md mx-auto">
            상단의 연락처로 문의주시면 친절하게 안내해드리겠습니다.
          </p>
          <button className="btn-primary px-10 py-4 text-lg font-medium shadow-large hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            1:1 문의하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Support;