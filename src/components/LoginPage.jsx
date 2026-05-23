import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight, Activity } from 'lucide-react';

const LoginPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(username, password);
            navigate('/dashboard');
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-slate-50">
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute top-0 right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 -left-40 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-2">
                        <img src="/logo.png" alt="Joyson logo" className="w-12 h-12" />
                        <span className="text-xl font-bold tracking-wider">JOYSON SAFETY SYSTEMS</span>
                    </div>
                </div>
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-5xl font-extrabold mb-6 leading-tight">
                        Manpower <br />
                        <span className="text-blue-400">Dashboard</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">Monitoring of manpower availability and skill distribution. Streamline your industrial operations with data-driven insights.</p>
                    <div className="flex items-center space-x-4 text-sm font-medium text-slate-500">
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            System Operational
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            v1.2.0
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-slate-600">© 2026 Joyson Safety Systems. All rights reserved.</div>
            </div>
            <div className="flex-1 flex items-center justify-center p-8 bg-white lg:bg-transparent">
                <div className="w-full max-w-md bg-white p-10 lg:rounded-2xl lg:shadow-2xl shadow-none">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-4">
                            <Activity className="h-10 w-10 text-blue-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h3>
                        <p className="text-slate-500">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out hover:bg-white focus:bg-white" placeholder="Type your username" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out hover:bg-white focus:bg-white" placeholder="Type your password" />
                            </div>
                        </div>
                        {error && (
                            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">{error}</div>
                        )}
                        <button type="submit" disabled={isLoading} className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (<>Sign In<ArrowRight className="ml-2 h-4 w-4" /></>)}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;