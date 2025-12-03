# Deployment Guide

## Vercel 배포 (권장)

### 1. Vercel 계정 생성
- [vercel.com](https://vercel.com)에서 계정 생성
- GitHub 연동

### 2. 프로젝트 연결
```bash
# Vercel CLI 설치 (선택사항)
npm i -g vercel

# 프로젝트 연결
vercel

# 또는 Vercel 웹사이트에서 직접 연결
```

### 3. 환경 변수 설정
Vercel 대시보드에서 Environment Variables 설정:

```
# Firebase 설정
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id

# 외부 API 키들
VITE_KAKAO_API_KEY=your-kakao-api-key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_WEATHER_API_KEY=your-weather-api-key
```

### 4. 빌드 설정
`vercel.json` 파일 생성 (프로젝트 루트):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### 5. 커스텀 도메인 설정
- Vercel 대시보드에서 Domain 설정
- DNS 레코드 업데이트

## Firebase Hosting 배포 (대안)

### 1. Firebase CLI 설치
```bash
npm install -g firebase-tools
```

### 2. Firebase 로그인
```bash
firebase login
```

### 3. 프로젝트 초기화
```bash
firebase init hosting
```

### 4. Firebase 설정
`firebase.json` 파일 생성:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
        ]
      },
      {
        "source": "**/*.css",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### 5. 배포
```bash
# 빌드
npm run build

# Firebase에 배포
firebase deploy --only hosting
```

## Firebase Functions 배포

### 1. Functions 초기화
```bash
firebase init functions
```

### 2. Functions 코드 작성
`functions/src/index.ts`:

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const onOrderCreate = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    // 관리자에게 알림 전송 로직
  });

export const onOrderUpdate = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    if (newValue.status !== previousValue.status) {
      // 상태 변경 시 알림톡 발송 로직
    }
  });
```

### 3. Functions 배포
```bash
firebase deploy --only functions
```

## 환경별 설정

### Development
- 로컬 Firebase 에뮬레이터 사용
- 테스트 데이터 사용
- 디버그 모드 활성화

### Staging
- 별도 Firebase 프로젝트 사용
- 프로덕션과 동일한 설정
- QA 팀 테스트용

### Production
- 프로덕션 Firebase 프로젝트
- 실제 API 키 사용
- 모니터링 및 로깅 활성화

## 모니터링 및 유지보수

### Firebase Console
- 실시간 데이터베이스 모니터링
- Functions 로그 확인
- 사용량 및 비용 모니터링

### Vercel Analytics
- 페이지뷰 및 사용자 분석
- 성능 메트릭
- 에러 트래킹

### 로깅
```typescript
// 클라이언트 사이드 로깅
console.log('User action:', action);
console.error('Error occurred:', error);

// 서버 사이드 로깅 (Functions)
functions.logger.info('Order created', { orderId });
functions.logger.error('Payment failed', { error });
```

## 백업 및 복구

### Firestore 백업
```bash
# Firebase CLI로 백업
firebase firestore:export gs://your-backup-bucket

# 복구
firebase firestore:import gs://your-backup-bucket
```

### 자동 백업 설정
Firebase Console에서 Scheduled backups 설정

## 성능 최적화

### CDN 설정
- Firebase Hosting의 글로벌 CDN 활용
- 정적 자원 캐싱 헤더 설정

### 이미지 최적화
- WebP 포맷 사용
- Lazy loading 구현
- 이미지 압축

### 번들 최적화
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  }
});
```

## 보안 설정

### Firebase Security Rules
`firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 자신의 데이터만 접근 가능
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 관리자만 모든 주문 접근 가능
    match /orders/{orderId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        (request.auth.token.admin == true || resource.data.userId == request.auth.uid);
    }

    // 상품은 모두 읽기 가능, 관리자만 쓰기
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### 환경 변수 보호
- API 키를 환경 변수로 관리
- 클라이언트 사이드에 민감한 정보 노출 금지
- CORS 설정

## 롤백 전략

### Vercel 롤백
- Vercel 대시보드에서 이전 배포로 롤백
- 배포 히스토리 확인 가능

### Firebase 롤백
```bash
# 특정 버전으로 Functions 롤백
firebase functions:rollback --region asia-northeast1

# Hosting 롤백
firebase hosting:rollback
```

## 비용 최적화

### Firebase 비용 모니터링
- 월별 사용량 확인
- 비용 알림 설정
- 불필요한 리소스 정리

### 최적화 팁
- Functions 콜드 스타트 최소화
- Firestore 쿼리 최적화
- Storage 사용량 모니터링