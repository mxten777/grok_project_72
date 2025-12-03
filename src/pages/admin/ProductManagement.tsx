import { useState, useEffect } from 'react';
import { getProducts, updateProduct, addProduct, deleteProduct } from '../../utils/firestore';
import type { Product } from '../../types';
import { Plus, Edit, Trash, Package, Search, Sparkles, Shield, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';

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
      setProducts(products);
    } catch (err) {
      toast.error('상품 목록을 불러오는 데 실패했습니다.');
      console.error(err);
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
      <div className="flex items-center justify-between mb-12 animate-fade-in-up">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl flex items-center justify-center mr-6 shadow-large animate-float">
            <Package className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-secondary-900 mb-2">
              상품 관리
            </h1>
            <p className="text-secondary-600 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-accent-500" />
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
              <h2 className="text-2xl font-display font-bold text-secondary-900">상품 목록</h2>
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
                <th className="px-8 py-6 text-left text-xs font-display font-bold text-secondary-600 uppercase tracking-wider">상품명</th>
                <th className="px-8 py-6 text-left text-xs font-display font-bold text-secondary-600 uppercase tracking-wider">카테고리</th>
                <th className="px-8 py-6 text-left text-xs font-display font-bold text-secondary-600 uppercase tracking-wider">가격</th>
                <th className="px-8 py-6 text-left text-xs font-display font-bold text-secondary-600 uppercase tracking-wider">재고</th>
                <th className="px-8 py-6 text-right text-xs font-display font-bold text-secondary-600 uppercase tracking-wider">관리</th>
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
                          <div className="text-sm font-display font-bold text-secondary-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-display font-bold bg-info-100 text-info-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-lg font-display font-bold text-secondary-900">
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
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">상품이 없습니다</h3>
                    <p className="text-secondary-600">검색 조건에 맞는 상품이 없습니다.</p>
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
                <h2 className="text-2xl font-display font-bold text-secondary-900">
                  {product ? '상품 수정' : '새 상품 추가'}
                </h2>
                <p className="text-secondary-600">상품 정보를 입력해주세요</p>
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
              <label className="block text-sm font-display font-bold text-secondary-700 mb-2">상품명</label>
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
              <label className="block text-sm font-display font-bold text-secondary-700 mb-2">카테고리</label>
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
              <label className="block text-sm font-display font-bold text-secondary-700 mb-2">가격</label>
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
              <label className="block text-sm font-display font-bold text-secondary-700 mb-2">재고</label>
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
              <label className="block text-sm font-display font-bold text-secondary-700 mb-2">설명</label>
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
              <label className="block text-sm font-display font-bold text-secondary-700 mb-2">이미지 URL</label>
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
