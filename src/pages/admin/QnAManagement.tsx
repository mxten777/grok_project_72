import React, { useState, useEffect, useCallback } from 'react';
import { getProductQuestions, answerProductQuestion, getProducts } from '../../utils/firestore';
import type { ProductQuestion } from '../../types';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

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
      
      // Sort questions by creation date, newest first
      const sortedQuestions = fetchedQuestions.sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime());
      setQuestions(sortedQuestions);

      const newProductMap = fetchedProducts.reduce((acc, product) => {
        acc[product.id] = product.name;
        return acc;
      }, {} as Record<string, string>);
      setProductMap(newProductMap);

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error('데이터를 불러오는 중 오류가 발생했습니다.');
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
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">상품 문의 관리</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        {loading ? (
          <p>데이터를 불러오는 중입니다...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">질문</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.map((q) => (
                  <tr key={q.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{productMap[q.productId] || '알 수 없는 상품'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.userDisplayName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{q.question}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(q.createdAt.toDate(), 'yyyy-MM-dd HH:mm')}</td>
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
            <h3 className="text-xl font-bold mb-4">문의 답변</h3>
            
            <div className="mb-4">
              <p className="font-semibold text-gray-700">질문:</p>
              <p className="mt-1 p-3 bg-gray-100 rounded-md text-gray-800">{selectedQuestion.question}</p>
            </div>

            {selectedQuestion.isAnswered ? (
              <div>
                <p className="font-semibold text-gray-700">등록된 답변:</p>
                <p className="mt-1 p-3 bg-blue-50 rounded-md text-gray-800">{selectedQuestion.answer}</p>
              </div>
            ) : (
              <div>
                <label htmlFor="answer" className="font-semibold text-gray-700">답변 작성:</label>
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
