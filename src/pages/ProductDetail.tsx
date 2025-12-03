import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import toast from 'react-hot-toast';
import { getProductById, getPriceRules, getProductQuestions, addProductQuestion } from '../utils/firestore';
import { ShoppingCart, Star, Truck, Shield, RotateCcw, Heart, Share2, ChevronLeft, ChevronRight, Frown, MessageCircle, X } from 'lucide-react';
import type { Product, PriceRule, ProductQuestion } from '../types';
import { applyPriceRules } from '../utils/pricing';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [priceRules, setPriceRules] = useState<PriceRule[]>([]);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [productInquiries, setProductInquiries] = useState<ProductQuestion[]>([]);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryText, setInquiryText] = useState('');
  const { dispatch } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();

  useEffect(() => {
    const fetchProductAndRules = async () => {
      if (!id) {
        setError('상품 ID가 없습니다.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [fetchedProduct, rulesData] = await Promise.all([
          getProductById(id),
          getPriceRules(),
        ]);
        
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setPriceRules(rulesData);
          setIsWishlisted(wishlistState.items.some((item: Product) => item.id === fetchedProduct.id));
        } else {
          setError('상품을 찾을 수 없습니다.');
          toast.error('상품을 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('상품 정보를 불러오는 데 실패했습니다.');
        console.error(err);
        toast.error('상품 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRules();
  }, [id, wishlistState.items]);

  useEffect(() => {
    if (product && priceRules.length > 0) {
      const productsWithPricing = applyPriceRules([product], priceRules);
      setFinalPrice(productsWithPricing[0].price);
    } else if (product) {
      setFinalPrice(product.price);
    }
  }, [product, priceRules]);

  // Load product inquiries
  useEffect(() => {
    const loadInquiries = async () => {
      if (product?.id) {
        try {
          const inquiries = await getProductQuestions();
          const productInquiries = inquiries.filter(q => q.productId === product.id);
          setProductInquiries(productInquiries);
        } catch (error) {
          console.error('문의 불러오기 실패:', error);
        }
      }
    };

    loadInquiries();
  }, [product?.id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch({ type: 'ADD_ITEM', product, quantity });
      toast.success(`${product.name} ${quantity}개를 장바구니에 담았습니다.`);
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(product?.stock || 1, prev + delta)));
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    if (isWishlisted) {
      wishlistDispatch({ type: 'REMOVE_ITEM', productId: product.id });
      toast.error(`${product.name}을(를) 위시리스트에서 제거했습니다.`);
    } else {
      wishlistDispatch({ type: 'ADD_ITEM', product });
      toast.success(`${product.name}을(를) 위시리스트에 추가했습니다.`);
    }
    setIsWishlisted(!isWishlisted);
  };

  const handleSubmitInquiry = async () => {
    if (!product || !inquiryText.trim()) {
      toast.error('문의 내용을 입력해주세요.');
      return;
    }

    try {
      await addProductQuestion({
        productId: product.id,
        productName: product.name,
        userId: 'anonymous', // 실제로는 auth에서 가져와야 함
        question: inquiryText.trim(),
        userDisplayName: '사용자', // 실제로는 auth에서 가져와야 함
      });

      toast.success('문의가 성공적으로 등록되었습니다.');
      setInquiryText('');
      setIsInquiryModalOpen(false);

      // 문의 목록 새로고침
      const inquiries = await getProductQuestions();
      const productInquiries = inquiries.filter(q => q.productId === product.id);
      setProductInquiries(productInquiries);
    } catch (error) {
      console.error('문의 등록 실패:', error);
      toast.error('문의 등록에 실패했습니다.');
    }
  };

  const productImages = [
    '/placeholder-product.jpg',
    '/placeholder-product-2.jpg',
    '/placeholder-product-3.jpg',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Frown className="h-20 w-20 text-secondary-300 mx-auto mb-6" />
        <h3 className="text-2xl font-display font-bold text-secondary-900 mb-2">
          오류가 발생했습니다
        </h3>
        <p className="text-secondary-600 max-w-md mx-auto">
          {error}
        </p>
        <Link to="/products" className="mt-6 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl">
          상품 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Frown className="h-20 w-20 text-secondary-300 mx-auto mb-6" />
        <h3 className="text-2xl font-display font-bold text-secondary-900 mb-2">
          상품을 찾을 수 없습니다
        </h3>
        <p className="text-secondary-600 max-w-md mx-auto">
          요청하신 상품이 존재하지 않거나, 삭제되었을 수 있습니다.
        </p>
        <Link to="/products" className="mt-6 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl">
          상품 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm text-secondary-600 animate-fade-in-up">
        <Link to="/" className="hover:text-primary-600 transition-colors">홈</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link to="/products" className="hover:text-primary-600 transition-colors">상품</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-secondary-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Images */}
        <div className="space-y-6 animate-fade-in-up delay-100">
          <div className="relative aspect-square bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl overflow-hidden shadow-soft">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="h-32 w-32 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>';
                }
              }}
            />
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

          {/* Thumbnail Images */}
          <div className="flex space-x-3">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                  selectedImage === index
                    ? 'border-primary-500 shadow-glow scale-105'
                    : 'border-secondary-200 hover:border-primary-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="h-6 w-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>';
                    }
                  }}
                />
                {selectedImage === index && (
                  <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8 animate-fade-in-up delay-200">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {product.category}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleToggleWishlist}
                  className={`p-3 rounded-2xl transition-all duration-200 ${
                    isWishlisted
                      ? 'text-error-500 bg-error-50 shadow-soft'
                      : 'text-secondary-400 hover:text-error-500 hover:bg-error-50'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 rounded-2xl text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-all duration-200">
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex items-center mr-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-accent-400 fill-current" />
                ))}
              </div>
              <span className="text-secondary-600 font-medium">(4.8)</span>
              <span className="text-secondary-400 mx-2">·</span>
              <span className="text-secondary-600">127개 리뷰</span>
            </div>

            {/* Price */}
            <div className="mb-8">
              {finalPrice !== null && finalPrice !== product.price ? (
                <div className="flex items-baseline space-x-3">
                  <p className="text-2xl text-secondary-500 line-through">
                    ₩{product.price.toLocaleString()}
                  </p>
                  <p className="text-5xl font-bold text-error-600">
                    ₩{finalPrice.toLocaleString()}
                  </p>
                  <span className="px-3 py-1 bg-error-100 text-error-800 text-sm font-bold rounded-full">
                    {Math.round(((product.price - finalPrice) / product.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <p className="text-5xl font-bold text-primary-600">
                  ₩{product?.price.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-secondary-900 text-lg">수량</span>
              <div className="flex items-center bg-secondary-50 rounded-2xl border border-secondary-200">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-4 hover:bg-secondary-100 rounded-l-2xl transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="px-6 py-4 font-bold text-lg min-w-[60px] text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-4 hover:bg-secondary-100 rounded-r-2xl transition-colors disabled:opacity-50"
                  disabled={quantity >= product.stock}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center text-sm text-secondary-600">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
              재고: {product.stock}개 남음
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              id="add-to-cart-btn"
              onClick={handleAddToCart}
              className="w-full btn-primary group text-lg py-5"
            >
              <ShoppingCart className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              장바구니에 담기
            </button>
            <button className="w-full btn-secondary group text-lg py-5">
              바로 구매하기
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-secondary-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Truck className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-sm font-medium text-secondary-900">무료배송</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-success-600" />
              </div>
              <div className="text-sm font-medium text-secondary-900">품질보증</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <RotateCcw className="h-6 w-6 text-accent-600" />
              </div>
              <div className="text-sm font-medium text-secondary-900">30일 환불</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-20 pt-12 border-t border-secondary-200 animate-fade-in-up delay-300">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-secondary-900 mb-4">
            상품 상세정보
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            최고 품질의 제품으로 안정적인 성능을 제공합니다
          </p>
        </div>

        <div className="card p-8 lg:p-12">
          <div className="prose prose-lg max-w-none text-secondary-700">
            <p className="text-lg leading-relaxed mb-6">{product.description}</p>
            <p className="text-lg leading-relaxed mb-8">
              이 제품은 최신 기술로 생산된 고품질 에어컨 부품으로, 내구성과 성능을 동시에 갖추고 있습니다.
              산업 표준을 준수하며, 전문가들이 추천하는 제품입니다.
            </p>

            <h3 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-primary-600 font-bold text-sm">✓</span>
              </div>
              주요 특징
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center p-4 bg-success-50 rounded-2xl border border-success-200">
                <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-success-600 font-bold">🌱</span>
                </div>
                <span className="font-medium text-success-900">환경 친화적인 소재 사용</span>
              </div>
              <div className="flex items-center p-4 bg-primary-50 rounded-2xl border border-primary-200">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold">⚡</span>
                </div>
                <span className="font-medium text-primary-900">높은 에너지 효율</span>
              </div>
              <div className="flex items-center p-4 bg-accent-50 rounded-2xl border border-accent-200">
                <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-accent-600 font-bold">🔧</span>
                </div>
                <span className="font-medium text-accent-900">장기간 안정적인 성능</span>
              </div>
              <div className="flex items-center p-4 bg-secondary-50 rounded-2xl border border-secondary-200">
                <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-secondary-600 font-bold">🛠️</span>
                </div>
                <span className="font-medium text-secondary-900">쉬운 설치 및 유지보수</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-primary-600 font-bold text-sm">📋</span>
              </div>
              제품 사양
            </h3>
            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-8 rounded-3xl border border-secondary-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-soft">
                  <span className="font-semibold text-secondary-900">카테고리</span>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-soft">
                  <span className="font-semibold text-secondary-900">가격</span>
                  <span className="text-lg font-bold text-primary-600">
                    ₩{finalPrice?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-soft">
                  <span className="font-semibold text-secondary-900">재고</span>
                  <span className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium">
                    {product.stock}개
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-soft">
                  <span className="font-semibold text-secondary-900">출시일</span>
                  <span className="text-secondary-600">
                    {(product.createdAt as unknown as { toDate: () => Date }).toDate().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Inquiry Section */}
      <div className="mt-20 pt-12 border-t border-secondary-200 animate-fade-in-up delay-500">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-display font-bold text-secondary-900 mb-2">
              상품 문의
            </h2>
            <p className="text-secondary-600">궁금한 점이 있으시면 언제든 문의해주세요</p>
          </div>
          <button
            onClick={() => setIsInquiryModalOpen(true)}
            className="btn-primary group"
          >
            <MessageCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            문의하기
          </button>
        </div>

        {/* Recent Inquiries */}
        <div className="space-y-6">
          {productInquiries.length > 0 ? (
            productInquiries.slice(0, 3).map((inquiry, index) => (
              <div
                key={inquiry.id}
                className="card p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-secondary-900 mb-3 leading-relaxed">
                      {inquiry.question}
                    </p>
                    <div className="flex items-center text-sm text-secondary-600 mb-4">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">
                          {inquiry.userDisplayName.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium">{inquiry.userDisplayName}</span>
                      <span className="mx-2">·</span>
                      <span>{inquiry.createdAt.toDate().toLocaleDateString()}</span>
                    </div>
                    {inquiry.isAnswered && (
                      <div className="bg-gradient-to-r from-success-50 to-success-100 p-6 rounded-2xl border border-success-200 mt-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">✓</span>
                          </div>
                          <div>
                            <p className="font-semibold text-success-900 mb-2">관리자 답변</p>
                            <p className="text-success-800 leading-relaxed">{inquiry.answer}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ml-6 flex-shrink-0">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      inquiry.isAnswered
                        ? 'bg-success-100 text-success-800'
                        : 'bg-warning-100 text-warning-800'
                    }`}>
                      {inquiry.isAnswered ? '답변완료' : '대기중'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-secondary-400" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">아직 문의가 없습니다</h3>
              <p className="text-secondary-600 mb-6">첫 번째 문의를 남겨보세요!</p>
            </div>
          )}
        </div>
      </div>

      {/* Inquiry Modal */}
      {isInquiryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-secondary-900">상품 문의</h3>
                <p className="text-secondary-600 mt-1">궁금한 점을 자유롭게 물어보세요</p>
              </div>
              <button
                onClick={() => setIsInquiryModalOpen(false)}
                className="p-2 rounded-xl text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-all duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="p-4 bg-primary-50 rounded-2xl border border-primary-200 mb-4">
                <p className="text-sm text-primary-700">
                  <span className="font-medium">문의 상품:</span> {product?.name}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-900">문의 내용</label>
                <textarea
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  placeholder="문의하실 내용을 자세히 입력해주세요..."
                  className="input-primary h-40 resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-secondary-500 text-right">
                  {inquiryText.length}/500자
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setIsInquiryModalOpen(false)}
                className="flex-1 btn-ghost py-3"
              >
                취소
              </button>
              <button
                onClick={handleSubmitInquiry}
                className="flex-1 btn-primary py-3"
              >
                문의하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
