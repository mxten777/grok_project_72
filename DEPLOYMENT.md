# Vercel 배포 설정

## 1. 환경 변수 설정 (.env.local)
```bash
# Firebase 설정
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# 기타 설정
VITE_APP_ENV=production
```

## 2. Vercel CLI 설치 및 로그인
```bash
npm install -g vercel
vercel login
```

## 3. 프로젝트 배포
```bash
vercel --prod
```

## 4. 도메인 연결 (선택)
```bash
vercel domains add your-domain.com
```