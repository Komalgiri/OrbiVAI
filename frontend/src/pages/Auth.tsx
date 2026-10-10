import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Code2 } from 'lucide-react';
import { authService } from '../services/authService';
import GitHubConnectModal from '../components/GitHubConnectModal';
import './Landing.css';

function LogoMark() {
    return <span className="logo-mark" aria-hidden="true"><span /><span /><span /></span>
}

const Auth = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showGitHubModal, setShowGitHubModal] = useState(false);
    const [authToken, setAuthToken] = useState<string | null>(null);

    useEffect(() => {
        const mode = searchParams.get('mode');
        if (mode === 'signup') {
            setIsSignUp(true);
        } else if (mode === 'connect_github') {
            const token = localStorage.getItem('token');
            if (token) {
                setAuthToken(token);
                setShowGitHubModal(true);
            }
        } else {
            setIsSignUp(false);
        }
    }, [searchParams]);

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError(null);
        setFormData({ name: '', email: '', password: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            let data;
            if (!isSignUp) {
                data = await authService.login(formData);
            } else {
                data = await authService.signup(formData);
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (!data.user.githubId) {
                setAuthToken(data.token);
                setShowGitHubModal(true);
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnectGitHub = () => {
        if (!authToken) return;
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        window.location.href = `${apiUrl}/api/auth/github/login?token=${authToken}`;
    };

    // GitHub OAuth direct login
    const handleGitHubLogin = () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        window.location.href = `${apiUrl}/api/auth/github/login`;
    };

    return (
        <main className="auth-shell">
            <header className="auth-nav">
                <Link to="/" className="brand"><LogoMark /><span>OrbiVAI</span></Link>
                <Link to="/" className="auth-back"><ArrowLeft /> Back to home</Link>
            </header>
            <section className="auth-layout">
                <div className="auth-intro">
                    <span className="section-label">WELCOME TO THE POD</span>
                    <h1>Good work<br /><span>feels better</span> together.</h1>
                    <p>Join builders who are turning scattered activity into clear momentum, one focused Pod at a time.</p>
                    <div className="auth-note"><span className="announcement-dot" /><span>Free to get started. Built for teams that care.</span></div>
                </div>
                <div className="auth-card">
                    <div className="auth-card-heading">
                        <span className="auth-kicker">{isSignUp ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}</span>
                        <h2>{isSignUp ? 'Join the Pod.' : 'Sign in to OrbiVAI.'}</h2>
                        <p>{isSignUp ? "Start making your team's momentum visible." : 'Pick up where your team left off.'}</p>
                    </div>
                    
                    <button type="button" onClick={handleGitHubLogin} className="github-button">
                        <Code2 /> Continue with GitHub
                    </button>
                    
                    <div className="auth-divider"><span>or continue with email</span></div>
                    
                    {error && (
                        <div style={{ marginBottom: '16px', padding: '10px', borderRadius: '8px', background: 'rgba(217, 119, 70, 0.1)', color: 'var(--amber)', fontSize: '12px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {isSignUp && (
                            <label htmlFor="name">Your name
                                <input id="name" name="name" type="text" placeholder="Alex Morgan" value={formData.name} onChange={handleChange} required />
                            </label>
                        )}
                        <label htmlFor="email">Email address
                            <input id="email" name="email" type="email" placeholder="you@company.com" value={formData.email} onChange={handleChange} required />
                        </label>
                        <label htmlFor="password">Password
                            <input id="password" name="password" type="password" placeholder="At least 8 characters" minLength={8} value={formData.password} onChange={handleChange} required />
                        </label>
                        <button type="submit" disabled={isLoading} className="v0-button auth-submit">
                            {isLoading ? 'Processing...' : (isSignUp ? 'Create account' : 'Sign in')} <ArrowRight />
                        </button>
                    </form>
                    
                    <p className="auth-switch">
                        {isSignUp ? 'Already have an account?' : 'New to OrbiVAI?'} 
                        <button type="button" onClick={toggleMode}>{isSignUp ? 'Sign in' : 'Join the Pod'}</button>
                    </p>
                    <p className="auth-legal">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
                </div>
            </section>

            <GitHubConnectModal
                isOpen={showGitHubModal}
                onClose={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setAuthToken(null);
                    setShowGitHubModal(false);
                    navigate('/auth');
                }}
                onConnect={handleConnectGitHub}
            />
        </main>
    )
}

export default Auth;
