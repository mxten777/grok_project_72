import { useState, useEffect } from 'react';
import { getPriceRules, addPriceRule, updatePriceRule, deletePriceRule, getProducts } from '../../utils/firestore';
import type { PriceRule, Product } from '../../types';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';

const PriceManagement = () => {
  const [rules, setRules] = useState<PriceRule[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PriceRule | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rulesData, productsData] = await Promise.all([
        getPriceRules(),
        getProducts(),
      ]);
      // 더미 데이터 추가 (실제 데이터가 없을 경우)
      const mockRules: PriceRule[] = [
        {
          id: 'rule-001',
          name: '겨울 성수기 할인',
          type: 'percentage',
          value: 15,
          targetType: 'category',
          targetId: '냉매가스',
          startDate: Timestamp.fromDate(new Date('2025-12-01')),
          endDate: Timestamp.fromDate(new Date('2026-02-28')),
          isExclusive: false,
          priority: 1,
          createdAt: Timestamp.fromDate(new Date('2025-11-15'))
        },
        {
          id: 'rule-002',
          name: '신제품 출시 할인',
          type: 'fixed',
          value: 10000,
          targetType: 'product',
          targetId: 'prod-002',
          startDate: Timestamp.fromDate(new Date('2025-12-01')),
          endDate: Timestamp.fromDate(new Date('2025-12-31')),
          isExclusive: true,
          priority: 2,
          createdAt: Timestamp.fromDate(new Date('2025-11-20'))
        },
        {
          id: 'rule-003',
          name: '대량 구매 할인',
          type: 'percentage',
          value: 20,
          targetType: 'all',
          targetId: '',
          startDate: Timestamp.fromDate(new Date('2025-12-01')),
          endDate: null,
          isExclusive: false,
          priority: 3,
          createdAt: Timestamp.fromDate(new Date('2025-11-25'))
        },
        {
          id: 'rule-004',
          name: '특별 프로모션 가격',
          type: 'set',
          value: 30000,
          targetType: 'product',
          targetId: 'prod-007',
          startDate: Timestamp.fromDate(new Date('2025-12-15')),
          endDate: Timestamp.fromDate(new Date('2025-12-25')),
          isExclusive: true,
          priority: 4,
          createdAt: Timestamp.fromDate(new Date('2025-12-01'))
        }
      ];
      const mockProducts: Product[] = [
        { id: 'prod-001', name: '에어컨 냉매 R-410A', category: '냉매가스', price: 45000, stock: 150, description: '', imageUrl: '', createdAt: new Date() },
        { id: 'prod-002', name: '냉매 충전기 PRO-2000', category: '장비', price: 120000, stock: 25, description: '', imageUrl: '', createdAt: new Date() },
        { id: 'prod-007', name: '친환경 냉매 R-32', category: '냉매가스', price: 52000, stock: 18, description: '', imageUrl: '', createdAt: new Date() }
      ];
      setRules((rulesData.length > 0 ? rulesData : mockRules).sort((a, b) => (b.createdAt as Timestamp).toMillis() - (a.createdAt as Timestamp).toMillis()));
      setProducts(productsData.length > 0 ? productsData : mockProducts);
    } catch {
      toast.error('데이터를 불러오는 데 실패했습니다.');
      // 에러 시에도 더미 데이터 표시
      setRules([
        {
          id: 'rule-001',
          name: '겨울 성수기 할인',
          type: 'percentage',
          value: 15,
          targetType: 'category',
          targetId: '냉매가스',
          startDate: Timestamp.fromDate(new Date('2025-12-01')),
          endDate: Timestamp.fromDate(new Date('2026-02-28')),
          isExclusive: false,
          priority: 1,
          createdAt: Timestamp.fromDate(new Date('2025-11-15'))
        }
      ]);
      setProducts([
        { id: 'prod-001', name: '에어컨 냉매 R-410A', category: '냉매가스', price: 45000, stock: 150, description: '', imageUrl: '', createdAt: new Date() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (rule: PriceRule | null = null) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRule(null);
  };

  const handleSave = async (rule: Omit<PriceRule, 'id' | 'createdAt'>) => {
    try {
      if (editingRule) {
        await updatePriceRule(editingRule.id!, rule);
        toast.success('가격 정책이 수정되었습니다.');
      } else {
        await addPriceRule(rule);
        toast.success('새 가격 정책이 추가되었습니다.');
      }
      fetchData();
      handleCloseModal();
    } catch {
      toast.error('저장에 실패했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말로 이 정책을 삭제하시겠습니까?')) {
      try {
        await deletePriceRule(id);
        toast.success('가격 정책이 삭제되었습니다.');
        fetchData();
      } catch {
        toast.error('삭제에 실패했습니다.');
      }
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage': return '할인(%)';
      case 'fixed': return '고정 할인';
      case 'set': return '고정 가격';
      default: return type;
    }
  };

  const isRuleActive = (rule: PriceRule) => {
    const now = new Date();
    const startDate = (rule.startDate as Timestamp).toDate();
    const endDate = rule.endDate ? (rule.endDate as Timestamp).toDate() : null;
    return startDate <= now && (!endDate || endDate >= now);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">가격 정책 관리</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          새 정책 추가
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">정책명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">유형</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">할인값</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">적용 범위</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">기간</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-4">로딩 중...</td></tr>
            ) : rules.map(rule => (
              <tr key={rule.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rule.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTypeLabel(rule.type)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rule.type === 'percentage' ? `${rule.discountValue}%` : `₩${rule.discountValue.toLocaleString()}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rule.category === 'all' ? '전체' : rule.category}
                  {rule.productIds.length > 0 && ` (${rule.productIds.length}개 상품)`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(rule.startDate as Timestamp).toDate().toLocaleDateString()}
                  {rule.endDate && ` ~ ${(rule.endDate as Timestamp).toDate().toLocaleDateString()}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    isRuleActive(rule) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isRuleActive(rule) ? '활성' : '비활성'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(rule)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(rule.id!)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <PriceRuleModal
          rule={editingRule}
          products={products}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const PriceRuleModal = ({ 
  rule, 
  onClose, 
  onSave 
}: { 
  rule: PriceRule | null;
  products: Product[];
  onClose: () => void;
  onSave: (data: Omit<PriceRule, 'id' | 'createdAt'>) => void;
}) => {
  const [formData, setFormData] = useState({
    name: rule?.name || '',
    type: rule?.type || 'percentage' as 'percentage' | 'fixed' | 'set',
    discountValue: rule?.discountValue || 0,
    category: rule?.category || 'all',
    productIds: rule?.productIds || [] as string[],
    startDate: rule?.startDate ? (rule.startDate as Timestamp).toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: rule?.endDate ? (rule.endDate as Timestamp).toDate().toISOString().split('T')[0] : '',
    priority: rule?.priority || 100,
    exclusive: rule?.exclusive ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Omit<PriceRule, 'id' | 'createdAt'> = {
      name: formData.name,
      type: formData.type,
      discountValue: formData.discountValue,
      category: formData.category,
      productIds: formData.productIds,
      startDate: Timestamp.fromDate(new Date(formData.startDate)),
      endDate: formData.endDate ? Timestamp.fromDate(new Date(formData.endDate)) : undefined,
      priority: formData.priority,
      exclusive: formData.exclusive,
    };
    onSave(data);
  };

  const categories = ['all', '냉매가스', '부품', '장비'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{rule ? '정책 수정' : '새 정책 추가'}</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">정책명</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2" 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">유형</label>
                <select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value as 'percentage' | 'fixed' | 'set'})} 
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2"
                >
                  <option value="percentage">할인율 (%)</option>
                  <option value="fixed">고정 할인 (원)</option>
                  <option value="set">고정 가격 (원)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {formData.type === 'percentage' ? '할인율 (%)' : '금액 (원)'}
                </label>
                <input 
                  type="number" 
                  value={formData.discountValue} 
                  onChange={e => setFormData({...formData, discountValue: Number(e.target.value)})} 
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">카테고리</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? '전체' : cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">시작일</label>
                <input 
                  type="date" 
                  value={formData.startDate} 
                  onChange={e => setFormData({...formData, startDate: e.target.value})} 
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">종료일 (선택)</label>
                <input 
                  type="date" 
                  value={formData.endDate} 
                  onChange={e => setFormData({...formData, endDate: e.target.value})} 
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">우선순위</label>
                <input 
                  type="number" 
                  value={formData.priority} 
                  onChange={e => setFormData({...formData, priority: Number(e.target.value)})} 
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2" 
                  placeholder="낮을수록 우선"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData.exclusive} 
                    onChange={e => setFormData({...formData, exclusive: e.target.checked})} 
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded" 
                  />
                  <span className="ml-2 text-sm text-gray-900">배타적 적용</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">취소</button>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700">저장</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PriceManagement;
