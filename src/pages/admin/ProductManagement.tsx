import { useState, useEffect } from 'react';
import { getProducts, updateProduct, addProduct, deleteProduct } from '../../utils/firestore';
import type { Product } from '../../types';
import { Plus, Edit, Trash, Package, Search, Sparkles, Shield, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';

type ProductFormData = Omit<Product, 'id' | 'createdAt'>;

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const products = await getProducts();
      // 더미 데이터 추가 (실제 데이터가 없을 경우)
      const mockProducts: Product[] = [
        { id: 'prod-001', name: '에어컨 냉매 R-410A', category: '냉매가스', price: 45000, stock: 150, description: '고효율 에어컨용 냉매 가스', imageUrl: '', createdAt: Timestamp.fromDate(new Date('2025-01-01')) },
        { id: 'prod-002', name: '냉매 충전기 PRO-2000', category: '장비', price: 120000, stock: 25, description: '자동 냉매 충전 및 회수 장비', imageUrl: '', createdAt: Timestamp.fromDate(new Date('2025-01-02')) },
        { id: 'prod-003', name: '에어컨 필터 세트 (10개입)', category: '부품', price: 25000, stock: 80, description: '표준 크기 에어컨 필터 교체 세트', imageUrl: '', createdAt: Timestamp.fromDate(new Date('2025-01-03')) },
        { id: 'prod-004', name: '배관 클리너 슈퍼', category: '부품', price: 35000, stock: 45, description: '강력한 에어컨 배관 세정제', imageUrl: '', createdAt: Timestamp.fromDate(new Date('2025-01-04')) },
        { id: 'prod-005', name: '에어컨 실외기 팬 모터', category: '부품', price: 85000, stock: 12, description: '고용량 실외기용 팬 모터', imageUrl: '', createdAt: Timestamp.fromDate(new Date('2025-01-05')) },
        { id: 'prod-006', name: '디지털 온도 센서', category: '부품', price: 15000, stock: 200, description: '정밀 온도 감지 및 제어 센서', imageUrl: '', createdAt: Timestamp.fromDate(new Date('2025-01-06')) },
        { id: 'prod-007', name: '친환경 냉매 R-32', category: '냉매가스', price: 52000, stock: 18, description: '저전력 친환경 냉매 가스', imageUrl: '', createdAt: Timestamp.fromDate(new Date('2025-01-07')) },
        { id: 'prod-008', name: '디지털 압력 게이지', category: '장비', price: 45000, stock: 35, description: '고정밀 압력 측정 장비', imageUrl: '', createdAt: Timestamp.fromDate(new Date('2025-01-08')) },
        { id: 'prod-009', name: '에어컨 드레인 호스 (5m)', category: '부품', price: 8000, stock: 120, description: '내구성 좋은 배수 호스', imageUrl: '', createdAt: Timestamp.fromDate(new Date('2025-01-09')) },
        { id: 'prod-010', name: '배관 단열 테이프', category: '부품', price: 3000, stock: 300, description: '고품질 단열 테이프 10m', imageUrl: '', createdAt: Timestamp.fromDate(new Date('2025-01-10')) },
        { id: 'prod-011', name: '컴프레서 윤활유', category: '부품', price: 28000, stock: 8, description: '에어컨 컴프레서 전용 윤활유', imageUrl: '', createdAt: Timestamp.fromDate(new Date('2025-01-11')) },
        { id: 'prod-012', name: '고진공 배기 펌프', category: '장비', price: 180000, stock: 5, description: '산업용 고진공 배기 장비', imageUrl: '', createdAt: Timestamp.fromDate(new Date('2025-01-12')) },
        { id: 'prod-013', name: '에어컨 리모컨 세트', category: '부품', price: 12000, stock: 150, description: '범용 에어컨 리모컨', imageUrl: '', createdAt: Timestamp.fromDate(new Date('2025-01-13')) },
        { id: 'prod-014', name: '냉매 누출 탐지제', category: '부품', price: 18000, stock: 90, description: '냉매 누출 감지 용액', imageUrl: '', createdAt: Timestamp.fromDate(new Date('2025-01-14')) },
        { id: 'prod-015', name: '에어컨 케이블 세트', category: '부품', price: 22000, stock: 75, description: '에어컨 배선 케이블 모음', imageUrl: '', createdAt: Timestamp.fromDate(new Date('2025-01-15')) }
      ];
      setProducts(products.length > 0 ? products : mockProducts);
    } catch (err) {
      toast.error('상품 목록을 불러오는 데 실패했습니다.');
      console.error(err);
      // 에러 시에도 더미 데이터 표시
      setProducts([
        { id: 'prod-001', name: '에어컨 냉매 R-410A', category: '냉매가스', price: 45000, stock: 150, description: '고효율 에어컨용 냉매', imageUrl: '', createdAt: Timestamp.now() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product: Product | null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleSaveProduct = async (productData: ProductFormData) => {
    const action = selectedProduct ? '수정' : '추가';
    const promise = selectedProduct
      ? updateProduct(selectedProduct.id, productData)
      : addProduct(productData).then(() => Promise.resolve()); // Ensure promise resolves to void

    toast.promise(promise, {
      loading: `상품 정보를 ${action}하는 중입니다...`,
      success: () => {
        fetchProducts();
        handleCloseModal();
        return `상품이 성공적으로 ${action}되었습니다.`;
      },
      error: `상품 ${action}에 실패했습니다.`,
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      toast.promise(deleteProduct(productId), {
        loading: '상품을 삭제하는 중입니다...',
        success: () => {
          fetchProducts();
          return '상품이 성공적으로 삭제되었습니다.';
        },
        error: '상품 삭제에 실패했습니다.',
      });
    }
  };

  const filteredProducts = products
    .filter(p => filterCategory === 'all' || p.category === filterCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container-custom py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-16 animate-fade-in-up">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 rounded-3xl flex items-center justify-center mr-8 shadow-2xl animate-float group-hover:shadow-3xl transition-all duration-300">
            <Package className="h-10 w-10 text-white drop-shadow-sm" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 bg-clip-text text-transparent drop-shadow-sm mb-3">
              상품 관리
            </h1>
            <p className="text-lg text-secondary-600 flex items-center font-medium tracking-wide">
              <Sparkles className="h-5 w-5 mr-3 text-accent-500 drop-shadow-sm" strokeWidth={2} />
              상품 정보를 추가, 수정, 삭제하는 관리 시스템
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card p-8 mb-8 animate-fade-in-up delay-200">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <input
                type="text"
                placeholder="상품명 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-primary pl-12"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-secondary-500" />
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="input-primary"
              >
                <option value="all">모든 카테고리</option>
                <option value="냉매가스">냉매가스</option>
                <option value="부품">부품</option>
                <option value="장비">장비</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal(null)}
            className="btn-primary px-6 py-3 font-medium shadow-large hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            새 상품 추가
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="card animate-fade-in-up delay-300">
        <div className="p-8 border-b border-secondary-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl admin-heading">상품 목록</h2>
            </div>
            <div className="text-sm text-secondary-600">
              총 {filteredProducts.length}개 상품
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200/30">
            <thead className="bg-secondary-50/50">
              <tr>
                <th className="px-8 py-6 text-left admin-table-header">상품명</th>
                <th className="px-8 py-6 text-left admin-table-header">카테고리</th>
                <th className="px-8 py-6 text-left admin-table-header">가격</th>
                <th className="px-8 py-6 text-left admin-table-header">재고</th>
                <th className="px-8 py-6 text-right admin-table-header">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200/30">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="ml-3 text-secondary-600">상품 목록을 불러오는 중...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className="hover:bg-secondary-50/30 transition-all duration-200 animate-fade-in-up"
                    style={{animationDelay: `${index * 50}ms`}}
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center shadow-soft">
                          <Package className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="admin-table-cell text-sm font-bold">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-display font-bold bg-info-100 text-info-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-lg admin-heading">
                      ₩{product.price.toLocaleString()}
                    </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-display font-bold ${
                        product.stock > 20 ? 'bg-success-100 text-success-800' :
                        product.stock > 0 ? 'bg-warning-100 text-warning-800' : 'bg-error-100 text-error-800'
                      }`}>
                        {product.stock > 0 ? `${product.stock}개 남음` : '품절'}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="btn-ghost p-2 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          title="수정"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="btn-ghost p-2 hover:bg-error-50 hover:text-error-600 transition-colors"
                          title="삭제"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <Package className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
                    <h3 className="admin-subheading mb-2">상품이 없습니다</h3>
                    <p className="admin-caption">검색 조건에 맞는 상품이 없습니다.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

const ProductModal = ({ product, onClose, onSave }: { product: Product | null, onClose: () => void, onSave: (data: ProductFormData) => void }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    category: product?.category || '부품',
    price: product?.price || 0,
    stock: product?.stock || 0,
    description: product?.description || '',
    imageUrl: product?.imageUrl || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
      <div className="card m-4 max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="p-8 border-b border-secondary-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mr-4 shadow-soft">
                {product ? <Edit className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h2 className="text-2xl admin-heading">
                  {product ? '상품 수정' : '새 상품 추가'}
                </h2>
                <p className="admin-caption">상품 정보를 입력해주세요</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn-ghost p-2 hover:bg-error-50 hover:text-error-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm admin-table-header mb-2">상품명</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-primary"
                required
                placeholder="상품명을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm admin-table-header mb-2">카테고리</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-primary"
              >
                <option value="냉매가스">냉매가스</option>
                <option value="부품">부품</option>
                <option value="장비">장비</option>
              </select>
            </div>
            <div>
              <label className="block text-sm admin-table-header mb-2">가격</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input-primary"
                required
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm admin-table-header mb-2">재고</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="input-primary"
                required
                placeholder="0"
                min="0"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm admin-table-header mb-2">설명</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input-primary resize-none"
                placeholder="상품에 대한 자세한 설명을 입력하세요"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm admin-table-header mb-2">이미지 URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="input-primary"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-secondary-200/50">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-6 py-3 font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="btn-primary px-6 py-3 font-medium shadow-large hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {product ? '수정하기' : '추가하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductManagement;
