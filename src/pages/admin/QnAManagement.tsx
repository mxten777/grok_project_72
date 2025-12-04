import React, { useState, useEffect, useCallback } from 'react';
import { getProductQuestions, answerProductQuestion, getProducts } from '../../utils/firestore';
import type { ProductQuestion, Product } from '../../types';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

const QnAManagement: React.FC = () => {
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<ProductQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [productMap, setProductMap] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedQuestions, fetchedProducts] = await Promise.all([
        getProductQuestions(),
        getProducts(),
      ]);

      // 더미 데이터 추가 (실제 데이터가 없을 경우)
      const mockQuestions: ProductQuestion[] = [
        {
          id: 'q-001',
          productId: 'prod-001',
          productName: '에어컨 냉매 R-410A',
          userId: 'user-001',
          userDisplayName: '김철수',
          question: '이 냉매의 호환성은 어떻게 되나요? 기존 에어컨에 사용할 수 있나요?',
          answer: '네, R-410A는 대부분의 현대 에어컨과 호환됩니다. 구형 모델의 경우 호환성을 확인해주세요.',
          isAnswered: true,
          createdAt: Timestamp.fromDate(new Date('2025-12-01T10:30:00')),
          answeredAt: Timestamp.fromDate(new Date('2025-12-01T14:15:00'))
        },
        {
          id: 'q-002',
          productId: 'prod-002',
          productName: '냉매 충전기 PRO-2000',
          userId: 'user-002',
          userDisplayName: '박영희',
          question: '충전기 사용법에 대한 매뉴얼이 있나요?',
          answer: '',
          isAnswered: false,
          createdAt: Timestamp.fromDate(new Date('2025-12-02T09:45:00')),
          answeredAt: undefined
        },
        {
          id: 'q-003',
          productId: 'prod-005',
          productName: '에어컨 실외기 팬 모터',
          userId: 'user-003',
          userDisplayName: '이민수',
          question: '팬 모터의 소음 수준은 어느 정도인가요?',
          answer: '저소음 설계로 일반 가정용 에어컨 수준의 소음을 유지합니다.',
          isAnswered: true,
          createdAt: Timestamp.fromDate(new Date('2025-12-03T16:20:00')),
          answeredAt: Timestamp.fromDate(new Date('2025-12-03T17:30:00'))
        },
        {
          id: 'q-004',
          productId: 'prod-007',
          productName: '친환경 냉매 R-32',
          userId: 'user-004',
          userDisplayName: '정수진',
          question: 'R-32 냉매의 장점은 무엇인가요?',
          answer: 'R-32는 친환경 냉매로 에너지 효율이 높고 온실가스 배출이 적습니다.',
          isAnswered: true,
          createdAt: Timestamp.fromDate(new Date('2025-12-04T11:15:00')),
          answeredAt: Timestamp.fromDate(new Date('2025-12-04T13:45:00'))
        },
        {
          id: 'q-005',
          productId: 'prod-012',
          productName: '고진공 배기 펌프',
          userId: 'user-005',
          userDisplayName: '홍길동',
          question: '배기 펌프의 유지보수 주기는 어떻게 되나요?',
          answer: '',
          isAnswered: false,
          createdAt: Timestamp.fromDate(new Date('2025-12-05T08:30:00')),
          answeredAt: undefined
        }
      ];
      const mockProducts: Product[] = [
        { id: 'prod-001', name: '에어컨 냉매 R-410A', category: '냉매가스', price: 45000, stock: 150, description: '', imageUrl: '', createdAt: Timestamp.now() },
        { id: 'prod-002', name: '냉매 충전기 PRO-2000', category: '장비', price: 120000, stock: 25, description: '', imageUrl: '', createdAt: Timestamp.now() },
        { id: 'prod-005', name: '에어컨 실외기 팬 모터', category: '부품', price: 85000, stock: 12, description: '', imageUrl: '', createdAt: Timestamp.now() },
        { id: 'prod-007', name: '친환경 냉매 R-32', category: '냉매가스', price: 52000, stock: 18, description: '', imageUrl: '', createdAt: Timestamp.now() },
        { id: 'prod-012', name: '고진공 배기 펌프', category: '장비', price: 180000, stock: 5, description: '', imageUrl: '', createdAt: Timestamp.now() }
      ];

      // Sort questions by creation date, newest first
      const allQuestions = fetchedQuestions.length > 0 ? fetchedQuestions : mockQuestions;
      const sortedQuestions = allQuestions.sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime());
      setQuestions(sortedQuestions);

      const allProducts = fetchedProducts.length > 0 ? fetchedProducts : mockProducts;
      const newProductMap = allProducts.reduce((acc, product) => {
        acc[product.id] = product.name;
        return acc;
      }, {} as Record<string, string>);
      setProductMap(newProductMap);

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error('데이터를 불러오는 중 오류가 발생했습니다.');
      // 에러 시에도 더미 데이터 표시
      setQuestions([
        {
          id: 'q-001',
          productId: 'prod-001',
          productName: '에어컨 냉매 R-410A',
          userId: 'user-001',
          userDisplayName: '김철수',
          question: '이 냉매의 호환성은 어떻게 되나요?',
          answer: '네, R-410A는 대부분의 현대 에어컨과 호환됩니다.',
          isAnswered: true,
          createdAt: Timestamp.fromDate(new Date('2025-12-01T10:30:00')),
          answeredAt: Timestamp.fromDate(new Date('2025-12-01T14:15:00'))
        }
      ]);
      setProductMap({ 'prod-001': '에어컨 냉매 R-410A' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (question: ProductQuestion) => {
    setSelectedQuestion(question);
    setAnswer(question.answer || '');
  };

  const handleCloseModal = () => {
    setSelectedQuestion(null);
    setAnswer('');
  };

  const handleSubmitAnswer = async () => {
    if (!selectedQuestion || !selectedQuestion.id || !answer.trim()) {
      toast.error('답변 내용을 입력해주세요.');
      return;
    }

    try {
      await answerProductQuestion(selectedQuestion.id, answer);
      toast.success('답변이 성공적으로 등록되었습니다.');
      handleCloseModal();
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error('답변 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container-custom py-8 sm:py-12 lg:py-16">
      <h1 className="text-3xl admin-heading mb-6 text-gray-800">상품 문의 관리</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        {loading ? (
          <p>데이터를 불러오는 중입니다...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left admin-table-header">상품명</th>
                  <th scope="col" className="px-6 py-3 text-left admin-table-header">작성자</th>
                  <th scope="col" className="px-6 py-3 text-left admin-table-header">질문</th>
                  <th scope="col" className="px-6 py-3 text-left admin-table-header">작성일</th>
                  <th scope="col" className="px-6 py-3 text-left admin-table-header">상태</th>
                  <th scope="col" className="px-6 py-3 text-left admin-table-header">관리</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.map((q) => (
                  <tr key={q.id}>
                    <td className="px-6 py-4 whitespace-nowrap admin-table-cell font-medium text-gray-900">{productMap[q.productId] || '알 수 없는 상품'}</td>
                    <td className="px-6 py-4 whitespace-nowrap admin-body text-gray-500">{q.userDisplayName}</td>
                    <td className="px-6 py-4 whitespace-nowrap admin-body text-gray-500 truncate max-w-xs">{q.question}</td>
                    <td className="px-6 py-4 whitespace-nowrap admin-body text-gray-500">{format(q.createdAt.toDate(), 'yyyy-MM-dd HH:mm')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        q.isAnswered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {q.isAnswered ? '답변 완료' : '답변 대기'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleOpenModal(q)} className="text-indigo-600 hover:text-indigo-900">
                        {q.isAnswered ? '답변 보기' : '답변하기'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedQuestion && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative mx-auto p-8 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <h3 className="text-xl admin-heading mb-4">문의 답변</h3>
            
            <div className="mb-4">
              <p className="admin-table-header text-gray-700">질문:</p>
              <p className="mt-1 p-3 bg-gray-100 rounded-md text-gray-800">{selectedQuestion.question}</p>
            </div>

            {selectedQuestion.isAnswered ? (
              <div>
                <p className="admin-table-header text-gray-700">등록된 답변:</p>
                <p className="mt-1 p-3 bg-blue-50 rounded-md text-gray-800">{selectedQuestion.answer}</p>
              </div>
            ) : (
              <div>
                <label htmlFor="answer" className="admin-table-header text-gray-700">답변 작성:</label>
                <textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                  rows={5}
                  placeholder="답변을 입력하세요..."
                />
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                닫기
              </button>
              {!selectedQuestion.isAnswered && (
                <button onClick={handleSubmitAnswer} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  답변 등록
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QnAManagement;
