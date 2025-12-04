import { useState, useEffect } from 'react';
import { getProducts, updateStock, getInventoryHistory } from '../../utils/firestore';
import type { Product, InventoryHistory } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Package, AlertTriangle, History, X, Sparkles, Shield, TrendingUp, BarChart3, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';

const LOW_STOCK_THRESHOLD = 20;

const InventoryManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedProductHistory, setSelectedProductHistory] = useState<InventoryHistory[]>([]);
  const [selectedProductName, setSelectedProductName] = useState('');
  const user = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productsData = await getProducts();
      // 더미 데이터 추가 (실제 데이터가 없을 경우)
      const mockProducts: Product[] = [
        { id: 'prod-001', name: '에어컨 냉매 R-410A', category: '냉매가스', price: 45000, stock: 150, description: '고효율 에어컨용 냉매', imageUrl: '', createdAt: Timestamp.now() },
        { id: 'prod-002', name: '냉매 충전기', category: '장비', price: 120000, stock: 25, description: '자동 냉매 충전 장비', imageUrl: '', createdAt: Timestamp.now() },
        { id: 'prod-003', name: '에어컨 필터 세트', category: '부품', price: 25000, stock: 80, description: '표준 필터 교체 세트', imageUrl: '', createdAt: Timestamp.now() },
        { id: 'prod-004', name: '배관 클리너', category: '부품', price: 35000, stock: 45, description: '에어컨 배관 세정제', imageUrl: '', createdAt: Timestamp.now() },
        { id: 'prod-005', name: '에어컨 실외기 팬', category: '부품', price: 85000, stock: 12, description: '고용량 실외기 팬 모터', imageUrl: '', createdAt: Timestamp.now() },
        { id: 'prod-006', name: '온도 센서', category: '부품', price: 15000, stock: 200, description: '정밀 온도 감지 센서', imageUrl: '', createdAt: Timestamp.now() },
        { id: 'prod-007', name: '냉매 R-32', category: '냉매가스', price: 52000, stock: 18, description: '친환경 냉매 R-32', imageUrl: '', createdAt: Timestamp.now() },
        { id: 'prod-008', name: '압력 게이지', category: '장비', price: 45000, stock: 35, description: '디지털 압력 측정기', imageUrl: '', createdAt: Timestamp.now() },
        { id: 'prod-009', name: '에어컨 드레인 호스', category: '부품', price: 8000, stock: 120, description: '배수 호스 5m', imageUrl: '', createdAt: Timestamp.now() },
        { id: 'prod-010', name: '단열 테이프', category: '부품', price: 3000, stock: 300, description: '배관 단열 테이프', imageUrl: '', createdAt: Timestamp.now() },
        { id: 'prod-011', name: '컴프레서 오일', category: '부품', price: 28000, stock: 8, description: '에어컨 컴프레서 윤활유', imageUrl: '', createdAt: Timestamp.now() },
        { id: 'prod-012', name: '진공 펌프', category: '장비', price: 180000, stock: 5, description: '고진공 배기 펌프', imageUrl: '', createdAt: Timestamp.now() }
      ];
      setProducts((productsData.length > 0 ? productsData : mockProducts).sort((a, b) => a.stock - b.stock));
    } catch (err) {
      toast.error('재고 목록을 불러오는 데 실패했습니다.');
      console.error(err);
      // 에러 시에도 더미 데이터 표시
      setProducts([
        { id: 'prod-001', name: '에어컨 냉매 R-410A', category: '냉매가스', price: 45000, stock: 150, description: '고효율 에어컨용 냉매', imageUrl: '', createdAt: Timestamp.now() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (productId: string, newStock: number, reason: string) => {
    if (newStock < 0) {
      toast.error('재고는 0 이상이어야 합니다.');
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const quantityChange = newStock - product.stock;
    if (quantityChange === 0) return;

    const originalProducts = [...products];
    const updatedProducts = products.map(p => p.id === productId ? { ...p, stock: newStock } : p);
    setProducts(updatedProducts);

    try {
      await updateStock(productId, quantityChange, 'adjustment', user?.user?.uid || 'unknown', reason);
      toast.success('재고가 업데이트되었습니다.');
      // To reflect sorted order correctly after update, we refetch
      fetchProducts();
    } catch (err) {
      toast.error('재고 업데이트에 실패했습니다.');
      console.error(err);
      setProducts(originalProducts);
    }
  };

  const handleShowHistory = async (product: Product) => {
    setSelectedProductName(product.name);
    try {
      const history = await getInventoryHistory(product.id);
      setSelectedProductHistory(history);
      setIsHistoryModalOpen(true);
    } catch {
      toast.error('재고 이력을 불러오는 데 실패했습니다.');
    }
  };

  const lowStockCount = products.filter(p => p.stock < LOW_STOCK_THRESHOLD).length;

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => !showOnlyLowStock || p.stock < LOW_STOCK_THRESHOLD);

  return (
    <div className="container-custom py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-12 animate-fade-in-up">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl flex items-center justify-center mr-6 shadow-large animate-float">
            <Package className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl admin-heading mb-2">
              재고 관리
            </h1>
            <p className="admin-caption flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-accent-500" />
              실시간 재고 현황 및 관리 시스템
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="glass p-8 rounded-3xl animate-fade-in-up delay-100 hover:scale-105 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="admin-caption mb-2">총 상품 종류</p>
              <p className="text-4xl admin-heading mb-2">{products.length}</p>
              <p className="admin-caption text-success-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                상품 다양성 확보
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-large transition-shadow">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl animate-fade-in-up delay-200 hover:scale-105 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="admin-caption mb-2">총 재고 수량</p>
              <p className="text-4xl admin-heading mb-2">{products.reduce((acc, p) => acc + p.stock, 0)}</p>
              <p className="admin-caption text-info-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                재고 최적화 진행 중
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-info-400 to-info-600 rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-large transition-shadow">
              <Package className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className={`glass p-8 rounded-3xl animate-fade-in-up delay-300 hover:scale-105 transition-all duration-300 cursor-pointer group ${lowStockCount > 0 ? 'ring-2 ring-error-200' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="admin-caption mb-2">재고 부족 상품</p>
              <p className={`text-4xl admin-heading mb-2 ${lowStockCount > 0 ? 'text-error-900' : 'text-secondary-900'}`}>{lowStockCount}</p>
              <p className={`admin-caption flex items-center ${lowStockCount > 0 ? 'text-error-600' : 'text-success-600'}`}>
                <AlertTriangle className="w-4 h-4 mr-1" />
                {lowStockCount > 0 ? '긴급 확인 필요' : '안전 재고 수준'}
              </p>
            </div>
            <div className={`w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-large transition-shadow ${lowStockCount > 0 ? 'from-error-400 to-error-600' : 'from-success-400 to-success-600'}`}>
              <AlertTriangle className={`w-8 h-8 text-white ${lowStockCount > 0 ? 'animate-pulse' : ''}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card p-8 mb-8 animate-fade-in-up delay-400">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
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
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-secondary-500" />
            <label htmlFor="low-stock-filter" className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                id="low-stock-filter"
                checked={showOnlyLowStock}
                onChange={e => setShowOnlyLowStock(e.target.checked)}
                className="h-5 w-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 focus:ring-2"
              />
              <span className="ml-3 admin-caption text-secondary-700 group-hover:text-primary-600 transition-colors">
                재고 부족 상품만 보기
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card animate-fade-in-up delay-500">
        <div className="p-8 border-b border-secondary-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl admin-heading">재고 목록</h2>
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
                <th className="px-8 py-6 text-left admin-table-header">상품</th>
                <th className="px-8 py-6 text-left admin-table-header">카테고리</th>
                <th className="px-8 py-6 text-left admin-table-header">현재 재고</th>
                <th className="px-8 py-6 text-left admin-table-header">재고 수정</th>
                <th className="px-8 py-6 text-left admin-table-header">이력</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200/30">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="ml-3 text-secondary-600">로딩 중...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-secondary-50/30 transition-all duration-200 animate-fade-in-up ${product.stock < LOW_STOCK_THRESHOLD ? 'bg-error-50/30' : ''}`}
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
                      <span className="inline-flex px-3 py-1 rounded-full text-xs admin-table-header bg-secondary-100 text-secondary-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-lg admin-heading ${product.stock < LOW_STOCK_THRESHOLD ? 'text-error-600' : 'text-secondary-900'}`}>
                          {product.stock}
                        </span>
                        {product.stock < LOW_STOCK_THRESHOLD && (
                          <AlertTriangle className="h-5 w-5 text-error-500 ml-3 animate-pulse" aria-label="재고 부족" />
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <StockInput key={product.id} product={product} onUpdate={handleStockUpdate} />
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <button
                        onClick={() => handleShowHistory(product)}
                        className="btn-ghost p-2 hover:bg-primary-50 transition-colors"
                      >
                        <History className="h-5 w-5 text-secondary-500 hover:text-primary-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <Package className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
                    <h3 className="admin-subheading mb-2">표시할 상품이 없습니다</h3>
                    <p className="admin-caption">검색 조건에 맞는 상품이 없습니다.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Modal */}
      {isHistoryModalOpen && (
        <InventoryHistoryModal
          productName={selectedProductName}
          history={selectedProductHistory}
          onClose={() => setIsHistoryModalOpen(false)}
        />
      )}
    </div>
  );
};

const StockInput = ({ product, onUpdate }: { product: Product, onUpdate: (id: string, stock: number, reason: string) => void }) => {
  const [stock, setStock] = useState(product.stock);

  const handleBlur = () => {
    if (stock !== product.stock) {
      const reason = prompt('재고 변경 사유를 입력하세요 (예: 수동 조정, 재고 실사 등):');
      if (reason) {
        onUpdate(product.id, stock, reason);
      } else {
        // If user cancels prompt, revert the change
        setStock(product.stock);
      }
    }
  };

  return (
    <input
      type="number"
      value={stock}
      onChange={e => setStock(Number(e.target.value))}
      onBlur={handleBlur}
      className="input-primary w-24 text-center"
    />
  );
};

const InventoryHistoryModal = ({ productName, history, onClose }: { productName: string, history: InventoryHistory[], onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
      <div className="card m-4 max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="p-8 border-b border-secondary-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mr-4 shadow-soft">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl admin-heading">재고 이력</h2>
                <p className="admin-caption">{productName}</p>
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

        <div className="max-h-[60vh] overflow-y-auto">
          <table className="min-w-full divide-y divide-secondary-200/30">
            <thead className="bg-secondary-50/50 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left admin-table-header">일시</th>
                <th className="px-6 py-4 text-left admin-table-header">유형</th>
                <th className="px-6 py-4 text-left admin-table-header">변경 수량</th>
                <th className="px-6 py-4 text-left admin-table-header">변경 후 재고</th>
                <th className="px-6 py-4 text-left admin-table-header">사유</th>
                <th className="px-6 py-4 text-left admin-table-header">담당자</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200/30">
              {history.length > 0 ? history.map((entry, index) => (
                <tr key={entry.id} className="hover:bg-secondary-50/30 transition-colors animate-fade-in-up" style={{animationDelay: `${index * 50}ms`}}>
                  <td className="px-6 py-4 whitespace-nowrap admin-body text-sm">
                    {(entry.timestamp as Timestamp)?.toDate().toLocaleString() ?? 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs admin-table-header bg-info-100 text-info-800">
                      {entry.changeType}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap admin-body text-sm font-bold ${entry.quantityChange > 0 ? 'text-success-600' : 'text-error-600'}`}>
                    {entry.quantityChange > 0 ? `+${entry.quantityChange}` : entry.quantityChange}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap admin-body text-sm font-bold text-secondary-900">
                    {entry.newStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap admin-body text-sm">
                    {entry.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap admin-body text-sm">
                    {entry.changedBy}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <History className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
                    <h3 className="admin-subheading mb-2">이력 정보가 없습니다</h3>
                    <p className="admin-caption">이 상품의 재고 변경 이력이 없습니다.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
