# 한국코프론 스마트 유통 플랫폼

에어컨 냉매·가스·부품을 유통하는 한국코프론의 스마트 플랫폼입니다.

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시스템 아키텍처](#시스템-아키텍처)
- [설치 및 실행](#설치-및-실행)
- [개발 가이드](#개발-가이드)
- [배포 가이드](#배포-가이드)
- [문서](#문서)
- [기여](#기여)
- [라이선스](#라이선스)

## 🎯 프로젝트 개요

한국코프론은 에어컨 냉매·가스·부품(B2B 중심)을 유통하는 기업으로,

여름 성수기 중심의 변동이 심한 재고·주문·배송 프로세스를

**스마트·자동화·데이터 기반**으로 전환하는 것을 목표로 한다.

### 구축 목표

- **주문·배송 프로세스 완전 디지털화**: 모바일 주문 → 관리자 승인 → 출고 → 배송 완료까지 실시간 추적
- **스마트 재고관리**: 입고/출고 스캔 자동화, AI 기반 수요 예측
- **단가·고객 전용 정책 자동화**: 고객사별 고정단가/할인률
- **경영 데이터 시각화**: 월·분기 매출, 상품별·지역별 판매분석

## ✨ 주요 기능

### 고객용 웹앱
- ✅ 상품 카탈로그 및 검색
- ✅ 장바구니 및 주문 시스템
- ✅ 주문 내역 조회
- ✅ 실시간 배송 상태 추적
- 🔄 상품 문의 시스템 (개발 중)

### 관리자 대시보드
- ✅ 주문 접수 및 승인
- ✅ 실시간 주문 상태 관리
- ✅ 대시보드 지표 확인
- ✅ 재고 관리 시스템
  - ✅ 재고 이력 추적
  - ✅ 재고 부족 알림
  - ✅ 실시간 재고 업데이트
- ✅ 상품 관리 시스템
  - ✅ 상품 CRUD 기능
  - ✅ 카테고리별 관리
- ✅ 가격 정책 관리
  - ✅ 할인율 설정
  - ✅ 고정 가격 설정
  - ✅ 기간별 프로모션
  - ✅ 우선순위 기반 규칙 적용

### AI 기반 기능 (Phase 2)
- 🔄 AI 재고 부족 예측
- 🔄 AI 가격 비교 및 단가 추천
- 🔄 AI 챗봇: 견적 문의 → 자동 견적서 생성
- 🔄 AI 고객사 분석 (이탈 위험/성장 고객)

## 🛠 기술 스택

### Frontend
- **React 18** with TypeScript
- **Vite** - 빠른 빌드 도구
- **TailwindCSS** - 유틸리티 기반 스타일링
- **React Router** - 클라이언트 사이드 라우팅
- **React Context API** - 상태 관리

### Backend
- **Firebase**
  - Authentication - 사용자 인증
  - Firestore - NoSQL 데이터베이스
  - Cloud Storage - 파일 저장
  - Cloud Functions - 서버리스 함수

### Deployment & DevOps
- **Vercel** - 프론트엔드 배포
- **Firebase Hosting** - 백엔드 호스팅 (선택)
- **ESLint** - 코드 품질 관리
- **TypeScript** - 타입 안전성

### External APIs
- **Kakao 알림톡** - 고객 알림
- **Google Maps API** - 배송 경로 (향후)
- **날씨 API** - 재고 예측 (향후)

## 🏗 시스템 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React SPA     │    │  Firebase Auth  │    │  Firestore DB   │
│                 │◄──►│                 │◄──►│                 │
│ - Components    │    │ - JWT Tokens    │    │ - Collections   │
│ - Context       │    │ - User Mgmt     │    │ - Real-time     │
│ - Routing       │    │                 │    │ - Security      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Cloud Functions │
                    │                 │
                    │ - Order Alerts  │
                    │ - Notifications │
                    │ - Analytics     │
                    └─────────────────┘
```

### 프로젝트 구조
```
src/
├── components/          # 재사용 컴포넌트
│   ├── Layout.tsx       # 메인 레이아웃
│   └── ProtectedRoute.tsx
├── contexts/           # React Context
│   ├── AuthContext.tsx  # 인증 상태 관리
│   ├── CartContext.tsx  # 장바구니 상태
│   └── WishlistContext.tsx
├── pages/              # 페이지 컴포넌트
│   ├── Home.tsx
│   ├── Products.tsx     # 상품 목록
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Orders.tsx
│   ├── Profile.tsx
│   └── admin/          # 관리자 페이지
│       ├── Dashboard.tsx
│       ├── OrderManagement.tsx
│       ├── InventoryManagement.tsx
│       ├── ProductManagement.tsx
│       ├── PriceManagement.tsx
│       └── QnAManagement.tsx
├── types.ts            # TypeScript 타입 정의
├── utils/              # 헬퍼 함수
│   ├── firestore.ts    # Firestore CRUD 함수
│   └── pricing.ts      # 가격 계산 로직
├── hooks/              # Custom Hooks
│   ├── useCart.ts
│   └── useWishlist.ts
├── firebase.ts         # Firebase 설정
└── App.tsx            # 메인 앱
```

## 🚀 설치 및 실행

### Prerequisites
- Node.js 18.x 이상
- npm 또는 yarn

### 설치
```bash
# 프로젝트 클론
git clone <repository-url>
cd grok_project_72

# 의존성 설치
npm install
```

### Firebase 설정
1. [Firebase Console](https://console.firebase.google.com)에서 새 프로젝트 생성
2. Authentication, Firestore, Storage 활성화
3. `src/firebase.ts`의 설정 값들 업데이트

### 실행
```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 미리보기
npm run preview
```

## 💻 개발 가이드

### 코드 스타일
- **TypeScript**: 엄격한 타입 체크
- **React**: 함수형 컴포넌트 + Hooks
- **Styling**: TailwindCSS 유틸리티 클래스
- **Naming**: PascalCase (컴포넌트), camelCase (함수/변수)

### 주요 패턴
```typescript
// Context 사용
const { state, dispatch } = useCart();

// Firebase 연동
const orders = await getOrders(userId);

// 타입 안전성
interface Product {
  id: string;
  name: string;
  price: number;
}
```

### 테스트
```bash
# 타입 체크
npm run build

# 린팅
npm run lint
```

## 📚 문서

### 주요 구현 기능

#### 1. 인증 시스템
- Firebase Authentication 연동
- 역할 기반 접근 제어 (admin/user)
- Protected Routes 구현
- 사용자 프로필 관리

#### 2. 상품 관리
- 상품 CRUD (Create, Read, Update, Delete)
- 카테고리별 분류 (냉매가스, 부품, 장비)
- 실시간 재고 표시
- 이미지 업로드 지원
- 검색 및 필터링

#### 3. 주문 시스템
- 장바구니 기능
- 주문 생성 및 추적
- 주문 상태 관리 (대기/승인/배송/완료/취소)
- 관리자 주문 승인 프로세스
- 배송 처리 시 자동 재고 차감

#### 4. 재고 관리
- 실시간 재고 수량 관리
- 재고 이력 추적 (입고/출고/조정)
- 재고 부족 알림 (임계값: 20개)
- 재고 변경 사유 기록
- 낮은 재고 우선 표시

#### 5. 가격 정책
- 다양한 할인 유형 (할인율, 고정할인, 고정가격)
- 카테고리/상품별 적용
- 기간 설정 (시작일/종료일)
- 우선순위 기반 규칙 적용
- 배타적 규칙 지원
- 실시간 가격 계산 및 표시

#### 6. 대시보드
- 실시간 주문 통계
- 매출 현황
- 재고 현황
- 최근 주문 목록

### 기술적 특징

- **TypeScript**: 엄격한 타입 체크로 런타임 오류 방지
- **React Context API**: 전역 상태 관리 (인증, 장바구니, 위시리스트)
- **Firebase Firestore**: 
  - 실시간 데이터 동기화
  - Batch 트랜잭션으로 원자성 보장
  - 복잡한 쿼리 및 인덱싱
- **TailwindCSS**: 반응형 디자인 및 빠른 UI 개발
- **React Router**: SPA 라우팅 및 Protected Routes

자세한 문서는 `docs/` 폴더에서 확인하세요:
1. [Vercel](https://vercel.com) 계정 생성
2. GitHub 리포지토리 연결
3. 환경 변수 설정
4. 자동 배포 완료

### Firebase Hosting (대안)
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 로그인 및 초기화
firebase login
firebase init hosting

# 배포
npm run build
firebase deploy --only hosting
```

## 📚 문서

자세한 문서는 `docs/` 폴더에서 확인하세요:

- **[API Reference](docs/API_REFERENCE.md)** - Firestore 컬렉션 및 함수 설명
- **[Architecture](docs/ARCHITECTURE.md)** - 시스템 아키텍처 상세
- **[Development](docs/DEVELOPMENT.md)** - 개발 환경 및 워크플로우
- **[Deployment](docs/DEPLOYMENT.md)** - 배포 및 운영 가이드
- **[User Guide](docs/USER_GUIDE.md)** - 사용자 매뉴얼

## 🤝 기여

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### 기여 가이드라인
- 코드 변경 시 테스트 필수
- 새로운 기능 추가 시 문서 업데이트
- 커밋 메시지 명확하게 작성
- PR 템플릿 준수

## 📄 라이선스

이 프로젝트는 한국코프론 내부 시스템으로, 승인된 사용자만 접근 가능합니다.

## 📞 연락처

- **프로젝트 관리자**: 개발팀
- **이메일**: dev@copron.co.kr
- **문의**: 플랫폼 내 고객 지원 시스템 이용

---

## 📊 개발 일정

### ✅ Week 1: 기본 기능 구현
- [x] 프로젝트 환경 구성
- [x] 고객용 기본 UI (홈/상품 목록/상세)
- [x] 장바구니/주문 시스템
- [x] Firebase Auth 연동
- [x] Firestore 기본 연동

### 🔄 Week 2: 고급 기능 및 배포
- [x] 관리자 대시보드
- [x] 주문 관리 시스템
  - [x] 주문 상태 실시간 업데이트
  - [x] 주문 승인/취소 기능
  - [x] 배송 처리 및 재고 자동 차감
- [x] 재고 관리 시스템
  - [x] 재고 수량 실시간 추적
  - [x] 재고 이력 관리 (입고/출고/조정)
  - [x] 재고 부족 알림 (임계값 20개)
  - [x] 재고 변경 사유 기록
- [x] 상품 관리 시스템
  - [x] 상품 추가/수정/삭제
  - [x] 카테고리별 상품 관리
  - [x] 재고 연동
- [x] 가격 정책 관리
  - [x] 가격 규칙 CRUD
  - [x] 할인율/고정가/고정할인 지원
  - [x] 카테고리/상품별 적용
  - [x] 기간 설정 및 우선순위
  - [x] 실시간 가격 적용
- [x] TypeScript 타입 안전성 강화
- [ ] 배포 및 테스트

### 🔮 Phase 2: AI 기능 확장
- [ ] AI 재고 예측
- [ ] 챗봇 시스템
- [ ] 고급 분석 대시보드
- [ ] 모바일 앱 개발

---

**한국코프론 스마트 유통 플랫폼** - 더 나은 B2B 거래를 위해 🚀
