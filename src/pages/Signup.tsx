import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus, Mail, Lock, ArrowRight, LogIn, Sparkles, Shield, CheckCircle } from 'lucide-react';
import { FirebaseError } from 'firebase/app';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    setIsLoading(true);

    console.log('Signup: Attempting to create user with', email);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signup: User created successfully', userCredential.user.email);
      toast.success('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } catch (error) {
      console.error('Signup: User creation failed', error);
      let errorMessage = '회원가입 중 오류가 발생했습니다.';
      if (error instanceof FirebaseError) {
        console.log('Signup: Firebase error code:', error.code);
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = '이미 사용 중인 이메일입니다.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = '비밀번호는 6자리 이상이어야 합니다.';
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50/30 to-secondary-50 flex items-center justify-center p-4 animate-fade-in-up">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-accent-200/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary-200/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-md w-full">
        <div className="glass rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
          <div className="px-8 py-12">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float">
                <UserPlus className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-display font-bold text-secondary-900 mb-3">
                회원가입
              </h1>
              <p className="text-xl text-secondary-600 leading-relaxed">
                한국코프론 스마트 유통 플랫폼에 오신 것을 환영합니다.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="h-6 w-6 text-secondary-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="이메일 주소"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-primary pl-14 text-lg py-4"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="h-6 w-6 text-secondary-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="비밀번호 (6자리 이상)"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-primary pl-14 text-lg py-4"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <CheckCircle className="h-6 w-6 text-secondary-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="비밀번호 확인"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-primary pl-14 text-lg py-4"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary group text-xl py-5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                  ) : (
                    <>
                      <Sparkles className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                      가입하기
                      <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 px-8 py-6 text-center border-t border-secondary-200/50">
            <p className="text-secondary-600 mb-4">
              이미 계정이 있으신가요?
            </p>
            <Link
              to="/login"
              className="btn-secondary group text-lg py-3 px-6"
            >
              <LogIn className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              로그인하기
              <Shield className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
