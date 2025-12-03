# Development Guide

## Prerequisites

- Node.js 18.x 이상
- npm 또는 yarn
- Git
- Firebase CLI (선택사항)

## Installation

1. **Repository Clone**
   ```bash
   git clone <repository-url>
   cd grok_project_72
   ```

2. **Dependencies 설치**
   ```bash
   npm install
   ```

3. **Firebase 설정**
   - Firebase 콘솔에서 새 프로젝트 생성
   - Authentication, Firestore, Storage, Functions 활성화
   - `src/firebase.ts` 파일의 config 값들 업데이트

4. **환경 변수 설정** (필요시)
   ```bash
   # .env 파일 생성
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_KAKAO_API_KEY=your-kakao-api-key
   ```

## Development Workflow

### 로컬 개발 서버 실행
```bash
npm run dev
```
- 기본 URL: http://localhost:5173
- HMR (Hot Module Replacement) 지원

### 빌드
```bash
npm run build
```
- 프로덕션용 최적화 빌드
- `dist/` 폴더에 결과물 생성

### 타입 체크
```bash
npm run build  # TypeScript 컴파일 포함
```

### 린팅
```bash
npm run lint  # ESLint 실행
```

## Project Structure

```
grok_project_72/
├── public/                 # 정적 파일들
├── src/
│   ├── components/         # 재사용 가능한 컴포넌트들
│   │   └── Layout.tsx      # 공통 레이아웃
│   ├── contexts/           # React Context들
│   │   ├── AuthContext.tsx # 인증 상태
│   │   └── CartContext.tsx # 장바구니 상태
│   ├── pages/              # 페이지 컴포넌트들
│   │   ├── admin/          # 관리자 페이지들
│   │   ├── Home.tsx        # 홈페이지
│   │   ├── Products.tsx    # 상품 목록
│   │   └── ...
│   ├── types/              # TypeScript 타입 정의들
│   │   └── index.ts
│   ├── utils/              # 유틸리티 함수들
│   │   └── firestore.ts    # Firestore 헬퍼
│   ├── firebase.ts         # Firebase 설정
│   ├── App.tsx             # 메인 앱 컴포넌트
│   └── main.tsx            # 앱 진입점
├── docs/                   # 문서화
├── dist/                   # 빌드 결과물 (생성됨)
├── node_modules/           # 의존성들
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

## Coding Standards

### TypeScript
- 모든 컴포넌트와 함수에 타입 정의
- `any` 타입 사용 최소화
- 인터페이스와 타입 별칭 적절히 사용

### React
- 함수형 컴포넌트와 Hooks 사용
- 커스텀 Hooks로 로직 재사용
- 컴포넌트 이름은 PascalCase

### Styling
- TailwindCSS 클래스 사용
- 반응형 디자인 (mobile-first)
- 일관된 색상과 간격 사용

### Naming Conventions
- 파일명: PascalCase (컴포넌트), camelCase (유틸리티)
- 변수명: camelCase
- 상수명: UPPER_SNAKE_CASE
- 함수명: camelCase

## Firebase Integration

### Authentication
```typescript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const user = useAuth();

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  return <div>환영합니다, {user.email}!</div>;
};
```

### Firestore Operations
```typescript
import { addOrder, getOrders } from '../utils/firestore';

// 주문 추가
const orderId = await addOrder({
  userId: user.uid,
  items: cartItems,
  totalAmount: total,
  status: 'pending',
  shippingAddress: address
});

// 주문 조회
const orders = await getOrders(user.uid);
```

### Real-time Listeners
```typescript
import { onSnapshot, collection } from 'firebase/firestore';

useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setOrders(orders);
  });

  return unsubscribe;
}, []);
```

## State Management

### Cart Context 사용법
```typescript
import { useCart } from '../contexts/CartContext';

const MyComponent = () => {
  const { state, dispatch } = useCart();

  const addToCart = (product) => {
    dispatch({
      type: 'ADD_ITEM',
      product,
      quantity: 1
    });
  };

  return (
    <div>
      <p>총 금액: ₩{state.total.toLocaleString()}</p>
      <button onClick={() => addToCart(product)}>
        장바구니에 담기
      </button>
    </div>
  );
};
```

## Testing

### Unit Tests (향후 구현)
```bash
npm run test
```

### E2E Tests (향후 구현)
```bash
npm run test:e2e
```

## Debugging

### Browser DevTools
- React Developer Tools 설치 권장
- Network 탭에서 Firebase 요청 확인
- Console에서 에러 로그 확인

### Firebase Console
- Authentication: 사용자 관리
- Firestore: 데이터베이스 조회/수정
- Functions: 서버리스 함수 로그
- Storage: 파일 업로드 확인

## Common Issues

### Firebase Config 오류
```
Error: Missing or insufficient permissions
```
- Firebase Security Rules 확인
- 프로젝트 ID가 올바른지 확인

### TypeScript 오류
```
Property 'X' does not exist on type 'Y'
```
- 타입 정의 확인
- 인터페이스 업데이트

### Build 실패
```
Module not found: Can't resolve 'firebase'
```
- `npm install` 재실행
- node_modules 삭제 후 재설치

## Contributing

1. Feature branch 생성: `git checkout -b feature/new-feature`
2. 코드 작성 및 테스트
3. Commit: `git commit -m "Add new feature"`
4. Push: `git push origin feature/new-feature`
5. Pull Request 생성

## Performance Tips

- 불필요한 리렌더링 방지 (React.memo, useMemo)
- 이미지 최적화 (lazy loading, WebP 포맷)
- 번들 크기 모니터링 (500KB 이하 권장)
- Firestore 쿼리 최적화 (인덱스 활용)