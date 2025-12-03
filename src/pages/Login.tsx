import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, ArrowRight, UserPlus, Sparkles, Shield } from 'lucide-react';
import { FirebaseError } from 'firebase/app';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // 로그인 성공 후 사용자 상태가 업데이트되면 리다이렉트
  useEffect(() => {
    if (user) {
      console.log('Login: User authenticated, redirecting to home');
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Login: Attempting to sign in with', email);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login: Sign in request sent');
      toast.success('로그인 되었습니다.');
    } catch (error) {
      console.error('Login: Sign in failed', error);
      let errorMessage = '로그인 중 오류가 발생했습니다.';
      if (error instanceof FirebaseError) {
        console.log('Login: Firebase error code:', error.code);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
        }
      }
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50/30 to-secondary-50 flex items-center justify-center p-4 animate-fade-in-up">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-200/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent-200/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-md w-full">
        <div className="glass rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
          <div className="px-8 py-12">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float">
                <LogIn className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-display font-bold text-secondary-900 mb-3">
                로그인
              </h1>
              <p className="text-xl text-secondary-600 leading-relaxed">
                서비스를 이용하시려면 로그인해주세요.
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
                    placeholder="비밀번호"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-primary pl-14 text-lg py-4"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded-lg"
                  />
                  <label htmlFor="remember-me" className="ml-3 text-secondary-700 font-medium">
                    로그인 상태 유지
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                    비밀번호를 잊으셨나요?
                  </a>
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
                      <Shield className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                      로그인
                      <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 px-8 py-6 text-center border-t border-secondary-200/50">
            <p className="text-secondary-600 mb-4">
              계정이 없으신가요?
            </p>
            <Link
              to="/signup"
              className="btn-secondary group text-lg py-3 px-6"
            >
              <UserPlus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              회원가입하기
              <Sparkles className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;