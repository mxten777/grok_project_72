import { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { getProducts, getPriceRules } from '../utils/firestore';
import { Link } from 'react-router-dom';
import { ShoppingCart, TrendingUp, Search, Filter, Frown, Package, Star, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { applyPriceRules } from '../utils/pricing';
import type { Product, PriceRule } from '../types';

const ProductCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="relative pt-[100%] overflow-hidden rounded-t-2xl bg-secondary-100"></div>
    <div className="p-6">
      <div className="h-4 bg-secondary-200 rounded w-1/4 mb-3"></div>
      <div className="h-6 bg-secondary-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-secondary-200 rounded w-full mb-4"></div>
      <div className="h-8 bg-secondary-200 rounded w-1/2 mb-4"></div>
      <div className="h-12 bg-secondary-200 rounded w-full"></div>
    </div>
  </div>
);

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [priceRules, setPriceRules] = useState<PriceRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('전체');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { dispatch } = useCart();

  const categories = ['전체', '냉매가스', '부품', '장비'];

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [productsData, rulesData] = await Promise.all([
          getProducts(),
          getPriceRules(),
        ]);
        setProducts(productsData);
        setPriceRules(rulesData);
      } catch (error) {
        toast.error('상품 및 가격 정보를 불러오는 데 실패했습니다.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleAddToCart = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', product, quantity: 1 });
    toast.success(`${product.name} 상품을 장바구니에 담았습니다.`);
  };

  // 가격 규칙 적용
  const productsWithPricing = applyPriceRules(products, priceRules);

  const sortedProducts = [...productsWithPricing].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  const filteredProducts = sortedProducts.filter(product => {
    const matchesCategory = category === '전체' || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="container-custom">
        {/* Header Skeleton */}
        <div className="mb-12 text-center animate-pulse">
          <div className="h-6 bg-secondary-200 rounded-full w-48 mx-auto mb-6"></div>
          <div className="h-12 bg-secondary-200 rounded w-96 mx-auto mb-4"></div>
          <div className="h-6 bg-secondary-200 rounded w-80 mx-auto"></div>
        </div>

        {/* Filter Skeleton */}
        <div className="mb-12 card animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2 h-12 bg-secondary-200 rounded-xl"></div>
            <div className="h-12 bg-secondary-200 rounded-xl"></div>
            <div className="h-12 bg-secondary-200 rounded-xl"></div>
          </div>
        </div>

        {/* Products Skeleton */}
        <div className="grid-responsive">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mb-6 animate-fade-in-up">
          <Package className="mr-2 h-4 w-4" strokeWidth={2} />
          스마트 유통 플랫폼
        </div>
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-4 animate-fade-in-up delay-100">
          전체 상품
        </h1>
        <p className="text-xl text-secondary-600 max-w-2xl mx-auto animate-fade-in-up delay-200">
          총 <span className="font-bold text-primary-600">{filteredProducts.length}개</span>의 고품질 상품을 만나보세요
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-12 card animate-fade-in-up delay-300">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" strokeWidth={2} />
            <input
              type="text"
              placeholder="상품명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-primary pl-12"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" strokeWidth={2} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-primary pl-12 appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <TrendingUp className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" strokeWidth={2} />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="input-primary pl-12 appearance-none"
            >
              <option value="asc">가격 낮은 순</option>
              <option value="desc">가격 높은 순</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="card text-center py-20 animate-fade-in-up">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-3xl flex items-center justify-center">
            <Frown className="h-12 w-12 text-secondary-400" strokeWidth={2} />
          </div>
          <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
            검색된 상품이 없습니다
          </h2>
          <p className="text-secondary-600 mb-8 max-w-md mx-auto leading-relaxed">
            다른 검색어나 필터로 다시 시도해보세요. 다양한 상품이 준비되어 있습니다.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setCategory('전체'); }}
            className="btn-secondary group"
          >
            <X className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-200" strokeWidth={2} />
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid-responsive">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="card card-hover group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link to={`/products/${product.id}`} className="block">
                <div className="relative pt-[100%] overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary-50 to-secondary-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="h-20 w-20 text-primary-300 group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
                  </div>
                  {/* Stock Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.stock > 50
                        ? 'bg-success-100 text-success-800'
                        : product.stock > 20
                        ? 'bg-warning-100 text-warning-800'
                        : 'bg-error-100 text-error-800'
                    }`}>
                      재고 {product.stock}개
                    </span>
                  </div>
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 text-xs font-medium bg-primary-500 text-white rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-secondary-500">
                      <div className="flex text-accent-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="font-medium">4.8</span>
                      <span className="text-secondary-400 ml-1">(127)</span>
                    </div>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-lg font-bold text-secondary-900 group-hover:text-primary-700 transition-colors duration-200 line-clamp-2 mb-3 leading-tight">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-secondary-600 line-clamp-2 mb-4 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </Link>

              {/* Price and Action */}
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    {product.originalPrice && product.price !== product.originalPrice ? (
                      <>
                        <p className="text-sm text-secondary-500 line-through">
                          ₩{product.originalPrice.toLocaleString()}
                        </p>
                        <div className="flex items-center space-x-2">
                          <p className="text-2xl font-bold text-error-600">
                            ₩{product.price.toLocaleString()}
                          </p>
                          <span className="px-2 py-1 text-xs font-bold bg-error-100 text-error-800 rounded-full">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-2xl font-bold text-primary-600">
                        ₩{product.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full btn-primary group/btn"
                >
                  <ShoppingCart className="mr-2 h-5 w-5 group-hover/btn:scale-110 transition-transform" strokeWidth={2} />
                  장바구니 담기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;