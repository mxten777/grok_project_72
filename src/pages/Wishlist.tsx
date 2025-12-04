import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';
import { Heart, ShoppingCart, X, ArrowRight, Package, Sparkles, Trash2 } from 'lucide-react';
import type { Product } from '../types';

const Wishlist = () => {
  const { state, dispatch: wishlistDispatch } = useWishlist();
  const { dispatch: cartDispatch } = useCart();

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    wishlistDispatch({ type: 'REMOVE_ITEM', productId });
    toast.error(`${productName}을(를) 위시리스트에서 제거했습니다.`);
  };

  const handleAddToCart = (product: Product) => {
    cartDispatch({ type: 'ADD_ITEM', product, quantity: 1 });
    toast.success(`${product.name}을(를) 장바구니에 담았습니다.`);
  };

  const handleClearWishlist = () => {
    if (window.confirm('위시리스트를 정말 비우시겠습니까?')) {
      wishlistDispatch({ type: 'CLEAR_WISHLIST' });
      toast.success('위시리스트를 모두 비웠습니다.');
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="container-custom py-20">
        <div className="text-center animate-fade-in-up">
          <div className="card p-16 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-error-100 to-error-200 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float">
              <Heart className="h-12 w-12 text-error-500 fill-current" strokeWidth={2} />
            </div>
            <h1 className="text-4xl font-display font-bold text-secondary-900 mb-4">
              위시리스트가 비어있습니다
            </h1>
            <p className="text-xl text-secondary-600 mb-12 max-w-md mx-auto leading-relaxed">
              상품 상세 페이지에서 하트 아이콘을 클릭하여 마음에 드는 상품을 저장해보세요.
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
              <div className="w-12 h-12 bg-gradient-to-br from-error-500 to-error-600 rounded-2xl flex items-center justify-center mr-4">
                <Heart className="h-7 w-7 text-white fill-current" strokeWidth={2} />
              </div>
              위시리스트
            </h1>
            <p className="text-xl text-secondary-600">
              {state.items.length}개의 상품이 저장되어 있습니다
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-error-50 text-error-700 rounded-full text-sm font-medium">
              ♥ {state.items.length}개 저장됨
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {state.items.map((product, index) => (
          <div
            key={product.id}
            className="card p-0 overflow-hidden group hover:shadow-large transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Product Image */}
            <div className="relative overflow-hidden">
              <Link to={`/products/${product.id}`}>
                <div className="w-full h-56 bg-gradient-to-br from-primary-50 via-primary-25 to-secondary-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Package className="h-20 w-20 text-primary-400 group-hover:text-primary-500 transition-colors" strokeWidth={2} />
                </div>
              </Link>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-soft hover:shadow-medium hover:bg-white transition-all duration-200 group"
              >
                <X className="h-5 w-5 text-error-500 group-hover:scale-110 transition-transform" strokeWidth={2} />
              </button>

              {/* Stock Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  product.stock > 50
                    ? 'bg-success-100 text-success-800'
                    : product.stock > 20
                    ? 'bg-warning-100 text-warning-800'
                    : 'bg-error-100 text-error-800'
                }`}>
                  재고 {product.stock}개
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
              <Link to={`/products/${product.id}`}>
                <h3 className="font-semibold text-secondary-900 text-lg mb-3 line-clamp-2 h-14 group-hover:text-primary-700 transition-colors leading-tight">
                  {product.name}
                </h3>
              </Link>

              <div className="mb-6">
                <p className="text-2xl font-bold text-gradient-primary mb-1">
                  ₩{product.price.toLocaleString()}
                </p>
                <p className="text-sm text-secondary-500">
                  {product.category}
                </p>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full btn-primary group text-base py-3"
              >
                <ShoppingCart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" strokeWidth={2} />
                장바구니 담기
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Clear All Button */}
      {state.items.length > 1 && (
        <div className="mt-12 text-center animate-fade-in-up delay-500">
          <button
            onClick={handleClearWishlist}
            className="btn-ghost group text-lg py-4 px-8"
          >
            <Trash2 className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" strokeWidth={2} />
            위시리스트 전체 비우기
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;