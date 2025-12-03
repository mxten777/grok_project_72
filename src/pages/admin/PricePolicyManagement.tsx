import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import type { User } from '../../types';
import toast from 'react-hot-toast';
import { Tag, Edit, X, Save } from 'lucide-react';

interface PricePolicy {
    id: 'A' | 'B' | 'C';
    name: string;
    discount: string;
}

// Mock function, replace with actual firestore call
const getPricePolicies = async (): Promise<PricePolicy[]> => {
    // In a real app, this would fetch policies from Firestore
    return [
        { id: 'A', name: 'A등급', discount: '10%' },
        { id: 'B', name: 'B등급', discount: '5%' },
        { id: 'C', name: 'C등급', discount: '0%' },
    ];
};


const PricePolicyManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [policies, setPolicies] = useState<PricePolicy[]>([]);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsersAndPolicies = async () => {
            setLoading(true);
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const usersData = usersSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as User));
                setUsers(usersData);

                const policiesData = await getPricePolicies();
                setPolicies(policiesData);

            } catch (err) {
                toast.error('고객 및 정책 정보를 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsersAndPolicies();
    }, []);

    const handleGradeChange = async (userId: string, newGrade: 'A' | 'B' | 'C') => {
        const userDocRef = doc(db, 'users', userId);
        try {
            await updateDoc(userDocRef, { customerGrade: newGrade });
            setUsers(users.map(u => u.uid === userId ? { ...u, customerGrade: newGrade } : u));
            toast.success('고객 등급이 업데이트되었습니다.');
            setEditingUserId(null);
        } catch (err) {
            toast.error('등급 업데이트에 실패했습니다.');
            console.error(err);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
        </div>;
    }

    return (
        <div className="p-6 bg-secondary-50 min-h-screen">
            <div className="container">
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2 flex items-center">
                        <Tag className="mr-3 h-8 w-8 text-primary-600" />
                        가격 정책 관리
                    </h1>
                    <p className="text-secondary-600">
                        고객 등급별 가격 정책을 설정하고 관리합니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {policies.map(policy => (
                        <div key={policy.id} className="bg-white p-6 rounded-xl shadow-md border border-secondary-100">
                            <h3 className="text-lg font-semibold text-secondary-900">{policy.name}</h3>
                            <p className="text-2xl font-bold text-primary-600">{policy.discount} 할인</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white shadow-lg rounded-xl border border-secondary-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-secondary-200">
                            <thead className="bg-secondary-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">고객명</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">이메일</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">현재 등급</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">등급 변경</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-secondary-200">
                                {users.map(user => (
                                    <tr key={user.uid}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">{user.displayName || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.customerGrade === 'A' ? 'bg-yellow-100 text-yellow-800' :
                                                user.customerGrade === 'B' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {user.customerGrade || '미지정'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {editingUserId === user.uid ? (
                                                <GradeEditor 
                                                    currentUser={user}
                                                    onSave={handleGradeChange}
                                                    onCancel={() => setEditingUserId(null)}
                                                />
                                            ) : (
                                                <button onClick={() => setEditingUserId(user.uid)} className="text-primary-600 hover:text-primary-800 flex items-center">
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    수정
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GradeEditor = ({ currentUser, onSave, onCancel }: { currentUser: User, onSave: (userId: string, newGrade: 'A' | 'B' | 'C') => void, onCancel: () => void }) => {
    const [selectedGrade, setSelectedGrade] = useState(currentUser.customerGrade || 'C');

    return (
        <div className="flex items-center gap-2">
            <select 
                value={selectedGrade} 
                onChange={(e) => setSelectedGrade(e.target.value as 'A' | 'B' | 'C')}
                className="px-3 py-1 border border-secondary-300 rounded-lg text-sm"
            >
                <option value="A">A등급</option>
                <option value="B">B등급</option>
                <option value="C">C등급</option>
            </select>
            <button onClick={() => onSave(currentUser.uid, selectedGrade)} className="p-1 text-green-600 hover:text-green-800">
                <Save className="h-5 w-5" />
            </button>
            <button onClick={onCancel} className="p-1 text-red-600 hover:text-red-800">
                <X className="h-5 w-5" />
            </button>
        </div>
    );
};

export default PricePolicyManagement;
