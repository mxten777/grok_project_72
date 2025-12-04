import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addOrder } from '../utils/firestore';
import { ShoppingCart, Trash2, Plus, Minus, Package, ArrowRight, Truck, Shield, CreditCard, Gift, Sparkles } from 'lucide-react';

const Cart = () => {
  const { state, dispatch } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const calculateItemTotal = (item: typeof state.items[0]) => {
    return item.product.price * item.quantity;
  };

  const cartTotal = state.items.reduce((sum, item) => {
    return sum + calculateItemTotal(item);
  }, 0);

  const shippingCost = cartTotal >= 100000 ? 0 : 3000;
  const finalTotal = cartTotal + shippingCost;

  const handleRemoveItem = (productId: string, productName: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
    toast.error(`${productName} 상품을 장바구니에서 삭제했습니다.`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const item = state.items.find(i => i.product.id === productId);
    if (!item) return;

    if (quantity <= 0) {
      handleRemoveItem(productId, item.product.name);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
      toast.success(`${item.product.name} 수량을 ${quantity}개로 변경했습니다.`);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('장바구니를 전체 비우시겠습니까?')) {
      dispatch({ type: 'CLEAR_CART' });
      toast.success('장바구니를 모두 비웠습니다.');
    }
  };

  const handleOrder = async () => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (state.items.length === 0) {
      toast.error('장바구니가 비어 있습니다.');
      return;
    }

    const orderPromise = addOrder({
      userId: user.uid,
      items: state.items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount: finalTotal,
      status: 'pending',
      shippingAddress: '배송 주소 입력 필요', // This should be collected from user
    });

    toast.promise(orderPromise, {
      loading: '주문을 처리하는 중입니다...',
      success: (orderId) => {
        dispatch({ type: 'CLEAR_CART' });
        navigate('/orders');
        return `주문이 완료되었습니다. 주문번호: ${orderId}`;
      },
      error: '주문 생성에 실패했습니다.',
    });
  };

  if (state.items.length === 0) {
    return (
      <div className="container-custom py-20">
        <div className="text-center animate-fade-in-up">
          <div className="card p-16 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float">
              <ShoppingCart className="h-12 w-12 text-primary-600" strokeWidth={2} />
            </div>
            <h1 className="text-4xl font-display font-bold text-secondary-900 mb-4">
              장바구니가 비어있습니다
            </h1>
            <p className="text-xl text-secondary-600 mb-12 max-w-md mx-auto leading-relaxed">
              아직 장바구니에 담은 상품이 없습니다. 마음에 드는 상품을 찾아보세요.
            </p>
            <Link
              to="/products"
              className="btn-primary group text-lg py-4 px-8"
            >
              <Package className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" strokeWidth={2} />
              상품 둘러보기
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
            </Link>
          </div>

          {/* 추천 섹션 */}
          <div className="mt-20 animate-fade-in-up delay-300">
            <h2 className="text-3xl font-display font-bold text-secondary-900 text-center mb-12">
              추천 상품
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-6 text-center hover:shadow-large transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-accent-600" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    인기 상품 {i}
                  </h3>
                  <p className="text-secondary-600 mb-4">
                    최고 품질의 에어컨 부품
                  </p>
                  <Link
                    to="/products"
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    자세히 보기 →
                  </Link>
                </div>
              ))}
            </div>
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
                <ShoppingCart className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              장바구니
            </h1>
            <p className="text-xl text-secondary-600">
              {state.items.length}개의 상품이 담겨있습니다
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
              총 {state.items.reduce((sum, item) => sum + item.quantity, 0)}개 상품
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {state.items.map((item, index) => {
            const itemTotal = item.product.price * item.quantity;

            return (
            <div
              key={item.product.id}
              className="card p-8 hover:shadow-large transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-8">
                {/* Product Image */}
                <div className="relative w-28 h-28 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-soft overflow-hidden">
                  <Package className="h-14 w-14 text-primary-400" strokeWidth={2} />
                  {item.product.stock < 10 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.product.id}`}
                    className="text-xl font-semibold text-secondary-900 hover:text-primary-700 transition-colors line-clamp-2 mb-2"
                  >
                    {item.product.name}
                  </Link>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {item.product.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.product.stock > 50
                        ? 'bg-success-100 text-success-800'
                        : item.product.stock > 20
                        ? 'bg-warning-100 text-warning-800'
                        : 'bg-error-100 text-error-800'
                    }`}>
                      재고 {item.product.stock}개
                    </span>
                  </div>
                  {item.product.originalPrice && item.product.price !== item.product.originalPrice ? (
                    <div className="flex items-baseline gap-3">
                      <p className="text-lg text-secondary-500 line-through">
                        ₩{item.product.originalPrice.toLocaleString()}
                      </p>
                      <p className="text-2xl font-bold text-error-600">
                        ₩{item.product.price.toLocaleString()}
                      </p>
                      <span className="px-2 py-1 bg-error-100 text-error-800 text-xs font-bold rounded-full">
                        {Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-primary-600">
                      ₩{item.product.price.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Quantity Controls & Actions */}
                <div className="flex flex-col items-end gap-4">
                  <div className="flex items-center bg-secondary-50 rounded-2xl border border-secondary-200 p-1">
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-soft"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-5 w-5 text-secondary-600" strokeWidth={2} />
                    </button>
                    <span className="px-6 py-3 font-bold text-lg min-w-[4rem] text-center bg-white rounded-xl">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-soft"
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="h-5 w-5 text-secondary-600" strokeWidth={2} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-secondary-900 mb-2">
                      ₩{itemTotal.toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                      className="text-error-500 hover:text-error-700 text-sm flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-error-50 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2} />
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )})}

          {/* Clear Cart Button */}
          <div className="flex justify-center animate-fade-in-up delay-500">
            <button
              onClick={handleClearCart}
              className="btn-ghost group text-lg py-4 px-8"
            >
              <Trash2 className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" strokeWidth={2} />
              장바구니 전체 비우기
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-3xl p-8 shadow-large sticky top-6 animate-fade-in-up delay-300">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center mr-4">
                <CreditCard className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-display font-bold text-secondary-900">
                주문 요약
              </h2>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-6 mb-8">
              <div className="flex justify-between items-center py-3 border-b border-secondary-200/50">
                <span className="text-secondary-700 font-medium">상품 금액</span>
                <span className="font-semibold text-secondary-900">₩{cartTotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-secondary-200/50">
                <span className="text-secondary-700 font-medium">배송비</span>
                <span className="font-semibold">
                  {shippingCost === 0 ? (
                    <span className="text-success-600 font-bold">무료배송</span>
                  ) : (
                    `₩${shippingCost.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-4 rounded-2xl border border-primary-200/50">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-secondary-900">
                    최종 금액
                  </span>
                  <span className="text-3xl font-bold text-gradient-primary">
                    ₩{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-success-50 to-primary-50 rounded-2xl p-6 mb-8 space-y-4">
              <div className="flex items-center text-success-700">
                <div className="w-8 h-8 bg-success-100 rounded-xl flex items-center justify-center mr-3">
                  <Truck className="h-4 w-4 text-success-600" strokeWidth={2} />
                </div>
                <span className="font-medium">10만원 이상 무료배송</span>
              </div>
              <div className="flex items-center text-primary-700">
                <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center mr-3">
                  <Shield className="h-4 w-4 text-primary-600" strokeWidth={2} />
                </div>
                <span className="font-medium">안전한 결제 보장</span>
              </div>
              {user && (
                <div className="flex items-center text-accent-700">
                  <div className="w-8 h-8 bg-accent-100 rounded-xl flex items-center justify-center mr-3">
                    <Gift className="h-4 w-4 text-accent-600" strokeWidth={2} />
                  </div>
                  <span className="font-medium">고객 등급 할인 적용!</span>
                </div>
              )}
            </div>

            {/* Order Button */}
            <button
              onClick={handleOrder}
              className="w-full btn-primary group text-xl py-5 mb-4"
            >
              <CreditCard className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" strokeWidth={2} />
              주문하기
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
            </button>

            <p className="text-sm text-secondary-500 text-center leading-relaxed">
              주문 시 이용약관 및 개인정보처리방침에 동의하게 됩니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;