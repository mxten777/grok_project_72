# API Reference

## Firestore Collections

### users
사용자 정보를 저장하는 컬렉션.

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  company?: string;
  phone?: string;
  createdAt: Date;
}
```

### products
상품 정보를 저장하는 컬렉션.

```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock: number;
  createdAt: Date;
}
```

### orders
주문 정보를 저장하는 컬렉션.

```typescript
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}
```

### inventory
재고 정보를 저장하는 컬렉션.

```typescript
interface InventoryItem {
  id: string;
  productId: string;
  quantity: number;
  location: string;
  lastUpdated: Date;
}
```

### pricePolicy
가격 정책 정보를 저장하는 컬렉션.

```typescript
interface PricePolicy {
  id: string;
  userId: string;
  productId: string;
  discountRate: number;
  fixedPrice?: number;
  validFrom: Date;
  validTo?: Date;
}
```

### favoriteItems
즐겨찾기 상품 정보를 저장하는 컬렉션.

```typescript
interface FavoriteItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: Date;
}
```

### returns
반품 정보를 저장하는 컬렉션.

```typescript
interface Return {
  id: string;
  orderId: string;
  userId: string;
  items: ReturnItem[];
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

interface ReturnItem {
  productId: string;
  quantity: number;
}
```

### notifications
알림 정보를 저장하는 컬렉션.

```typescript
interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'inventory' | 'system';
  read: boolean;
  createdAt: Date;
}
```

### analytics
분석 데이터를 저장하는 컬렉션.

```typescript
interface Analytics {
  id: string;
  type: 'sales' | 'inventory' | 'customer';
  data: any;
  date: Date;
}
```

## Firebase Functions

### 주문 생성 시 관리자 알림
- 트리거: orders 컬렉션에 새 문서 추가
- 기능: 관리자에게 주문 알림 전송

### 배송 상태 변경 시 고객 알림톡 발송
- 트리거: orders 문서의 status 필드 업데이트
- 기능: 고객에게 Kakao 알림톡 발송

### 재고 임계점 도달 시 자동 알림
- 트리거: inventory 문서의 quantity 필드 업데이트
- 기능: 재고가 임계점 이하일 때 관리자 알림

### 월 단위 매출 리포트 생성
- 트리거: 매월 1일 스케줄 실행
- 기능: 월별 매출 데이터 집계 및 리포트 생성

## Utility Functions

### Products
- `addProduct(product)`: 새 상품 추가
- `getProducts()`: 모든 상품 조회
- `updateProduct(id, updates)`: 상품 정보 업데이트
- `deleteProduct(id)`: 상품 삭제

### Orders
- `addOrder(order)`: 새 주문 추가
- `getOrders(userId?)`: 주문 목록 조회 (사용자별 필터링 가능)
- `updateOrder(id, updates)`: 주문 정보 업데이트

### Users
- `addUser(user)`: 새 사용자 추가
- `getUser(uid)`: 사용자 정보 조회

## External APIs

### Kakao 알림톡 API
- 배송 상태 변경 시 고객 알림
- 주문 확인 알림

### 날씨 API
- 재고 예측에 활용 (향후 구현)

### Google Maps API
- 배송 경로 최적화 (향후 구현)