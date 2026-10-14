import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { githubService, type DeveloperIntelligenceData } from '../services/githubService';
import { DeveloperIntelligenceDossier } from '../components/DeveloperIntelligenceDossier';
import {
    FaGithub,
    FaArrowLeft,
    FaMagnifyingGlass,
    FaBolt,
    FaBrain,
    FaStar,
    FaCodeBranch,
    FaUsers,
    FaLocationDot
} from 'react-icons/fa6';
import { HiOutlineSparkles, HiOutlineArrowPath, HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2';

export const GitHubAnalyticsIntelligence: React.FC = () => {
    const { username: paramUsername } = useParams<{ username?: string }>();
    const navigate = useNavigate();

    const [searchInput, setSearchInput] = useState(paramUsername || '');
    const [currentUsername, setCurrentUsername] = useState(paramUsername || '');
    const [data, setData] = useState<DeveloperIntelligenceData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchIntelligence = async (targetUser?: string, isBackgroundRefresh = false) => {
        if (!isBackgroundRefresh) {
            setIsLoading(true);
        } else {
            setIsRefreshing(true);
        }
        setError(null);

        try {
            // Determine target: param > localStorage user > fallback to Komalgiri
            let userToAnalyze = targetUser || paramUsername;
            if (!userToAnalyze) {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        const parsed = JSON.parse(storedUser);
                        userToAnalyze = parsed.githubUsername || parsed.githubId;
                    } catch {}
                }
            }
            if (!userToAnalyze) {
                userToAnalyze = 'Komalgiri';
            }

            setCurrentUsername(userToAnalyze);
            setSearchInput(userToAnalyze);

            const result = await githubService.getIntelligence(userToAnalyze);
            setData(result);
        } catch (err: any) {
            console.error('Failed to fetch intelligence:', err);
            setError(err?.message || 'Failed to load GitHub intelligence. Please check the username.');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchIntelligence(paramUsername);
    }, [paramUsername]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = searchInput.trim().replace(/^@/, '');
        if (!trimmed) return;
        navigate(`/u/${encodeURIComponent(trimmed)}`);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--ink)' }}>
            {/* Top Navigation Bar */}
            <header
                style={{
                    height: '74px',
                    borderBottom: '1px solid var(--line)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(16px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 clamp(16px, 4vw, 48px)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            border: 0,
                            background: 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: 'var(--muted-text)',
                            fontSize: '12px',
                            fontWeight: 700
                        }}
                    >
                        <FaArrowLeft /> Back
                    </button>
                    <Link
                        to="/"
                        style={{
                            textDecoration: 'none',
                            color: 'var(--ink)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '16px',
                            fontWeight: 700,
                            letterSpacing: '-0.03em'
                        }}
                    >
                        <span style={{ color: 'var(--sage)' }}>CodePods</span>
                        <span style={{ fontSize: '11px', color: '#9aa59d', fontWeight: 600 }}>/ Intelligence</span>
                    </Link>
                </div>

                {/* Instant Search Bar */}
                <form
                    onSubmit={handleSearchSubmit}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--soft)',
                        border: '1px solid var(--line)',
                        borderRadius: '8px',
                        padding: '4px 6px 4px 12px',
                        width: 'min(420px, 45vw)'
                    }}
                >
                    <FaGithub style={{ color: '#9aa59d', fontSize: '14px' }} />
                    <input
                        type="text"
                        placeholder="Analyze any GitHub username..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        style={{
                            border: 0,
                            outline: 0,
                            background: 'transparent',
                            color: 'var(--ink)',
                            fontSize: '12px',
                            flex: 1
                        }}
                    />
                    <button
                        type="submit"
                        className="v0-button"
                        style={{
                            padding: '6px 14px',
                            fontSize: '11px',
                            background: 'var(--sage)',
                            boxShadow: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <FaMagnifyingGlass style={{ fontSize: '10px' }} /> Analyze
                    </button>
                </form>
            </header>

            {/* Main Content Area */}
            <main style={{ maxWidth: '1180px', margin: '0 auto', padding: '36px clamp(16px, 3vw, 40px) 80px' }}>
                {/* 🧠 LIVE DEVELOPER INTELLIGENCE Hero Section */}
                <section
                    style={{
                        background: 'linear-gradient(180deg, #ffffff 0%, #f9fbf8 100%)',
                        border: '1px solid #dbe6d9',
                        borderRadius: '16px',
                        padding: '36px clamp(20px, 4vw, 48px)',
                        boxShadow: '0 20px 60px rgba(120, 155, 115, 0.08)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '36px',
                        alignItems: 'center',
                        marginBottom: '36px'
                    }}
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--sage-dark)' }}>
                                LIVE DEVELOPER INTELLIGENCE
                            </span>
                            <span style={{ fontSize: '10px', background: '#edf4eb', color: 'var(--sage-dark)', padding: '2px 8px', borderRadius: '99px', fontWeight: 800 }}>
                                AI Engine
                            </span>
                        </div>

                        <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', letterSpacing: '-0.05em', margin: '0 0 12px', lineHeight: 1.1 }}>
                            Uncover deep behavioral patterns &amp; <span style={{ color: 'var(--sage)' }}>technical DNA with AI.</span>
                        </h1>

                        <p style={{ color: 'var(--muted-text)', fontSize: '13px', lineHeight: 1.6, margin: '0 0 20px', maxWidth: '520px' }}>
                            Analyze any public GitHub profile in seconds. Get deterministic Developer Scores (0-100), AI Archetypes, byte-weighted language distributions, and executive recruiter dossiers.
                        </p>

                        <form
                            onSubmit={handleSearchSubmit}
                            style={{
                                display: 'flex',
                                gap: '10px',
                                maxWidth: '480px',
                                flexWrap: 'wrap'
                            }}
                        >
                            <div
                                style={{
                                    flex: '1 1 220px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    background: 'white',
                                    border: '1px solid var(--line)',
                                    borderRadius: '8px',
                                    padding: '0 14px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                                }}
                            >
                                <FaGithub style={{ color: '#9aa59d', fontSize: '16px' }} />
                                <input
                                    type="text"
                                    placeholder="Enter GitHub handle (e.g. Komalgiri)"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    style={{
                                        border: 0,
                                        outline: 0,
                                        width: '100%',
                                        padding: '12px 0',
                                        fontSize: '13px',
                                        color: 'var(--ink)'
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                className="v0-button"
                                style={{
                                    padding: '12px 20px',
                                    fontSize: '13px',
                                    background: 'var(--sage)',
                                    cursor: 'pointer'
                                }}
                            >
                                <FaBrain /> Analyze Profile
                            </button>
                        </form>

                        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', color: 'var(--muted-text)' }}>Quick samples:</span>
                            {['Komalgiri', 'torvalds', 'shadcn'].map((h) => (
                                <button
                                    key={h}
                                    type="button"
                                    onClick={() => navigate(`/u/${h}`)}
                                    style={{
                                        border: '1px solid var(--line)',
                                        background: currentUsername.toLowerCase() === h.toLowerCase() ? '#edf4eb' : 'white',
                                        color: currentUsername.toLowerCase() === h.toLowerCase() ? 'var(--sage-dark)' : 'var(--ink)',
                                        borderRadius: '99px',
                                        padding: '3px 10px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                    }}
                                >
                                    @{h}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Live Preview Teaser Card */}
                    <div
                        style={{
                            background: 'white',
                            border: '1px solid var(--line)',
                            borderRadius: '12px',
                            padding: '22px',
                            boxShadow: '0 12px 35px rgba(0,0,0,0.04)',
                            position: 'relative'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#edf4eb', color: 'var(--sage-dark)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '13px' }}>
                                    KG
                                </div>
                                <div>
                                    <strong style={{ fontSize: '14px', display: 'block' }}>Komal giri</strong>
                                    <span style={{ fontSize: '10px', color: '#88948b' }}>3.9 Years Active • New Delhi</span>
                                </div>
                            </div>
                            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--sage-dark)' }}>
                                39 <small style={{ fontSize: '10px', color: '#88948b' }}>/ 100</small>
                            </span>
                        </div>

                        <div style={{ background: 'var(--soft)', borderRadius: '8px', padding: '10px 12px', fontSize: '11px', marginBottom: '12px' }}>
                            <span style={{ color: 'var(--muted-text)', display: 'block', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em' }}>ARCHETYPE</span>
                            <strong style={{ color: 'var(--ink)' }}>The Pragmatic Full-Stack Builder</strong>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', fontSize: '11px' }}>
                            <div style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '6px' }}>
                                <span style={{ color: '#88948b', fontSize: '9px', display: 'block' }}>Stars</span>
                                <strong>15 (0.4/repo)</strong>
                            </div>
                            <div style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '6px' }}>
                                <span style={{ color: '#88948b', fontSize: '9px', display: 'block' }}>Repos</span>
                                <strong>38 (37 Source)</strong>
                            </div>
                            <div style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '6px' }}>
                                <span style={{ color: '#88948b', fontSize: '9px', display: 'block' }}>Followers</span>
                                <strong>9</strong>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate('/u/Komalgiri')}
                            style={{
                                marginTop: '14px',
                                width: '100%',
                                border: '1px solid var(--line)',
                                background: '#f8faf7',
                                borderRadius: '6px',
                                padding: '9px',
                                fontSize: '11px',
                                fontWeight: 700,
                                color: 'var(--sage-dark)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                            }}
                        >
                            <HiOutlineSparkles /> View Live Interactive Dossier
                        </button>
                    </div>
                </section>

                {/* Loading State */}
                {isLoading && (
                    <div
                        style={{
                            background: 'white',
                            border: '1px solid var(--line)',
                            borderRadius: '14px',
                            padding: '80px 20px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px'
                        }}
                    >
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                border: '3px solid #edf4eb',
                                borderTopColor: 'var(--sage)',
                                animation: 'spin 0.9s linear infinite'
                            }}
                        />
                        <div>
                            <strong style={{ fontSize: '16px', display: 'block', color: 'var(--ink)' }}>
                                Synthesizing Technical DNA for @{currentUsername}...
                            </strong>
                            <span style={{ fontSize: '12px', color: 'var(--muted-text)', marginTop: '4px', display: 'block' }}>
                                Parsing repositories, calculating language distributions, and running AI archetype modeling.
                            </span>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {!isLoading && error && (
                    <div
                        style={{
                            background: '#fcf0ed',
                            border: '1px solid #f6cfc7',
                            borderRadius: '12px',
                            padding: '30px',
                            textAlign: 'center',
                            color: '#9e3b2b'
                        }}
                    >
                        <h3 style={{ margin: '0 0 8px', fontSize: '18px' }}>Analysis Failed</h3>
                        <p style={{ margin: '0 0 16px', fontSize: '13px' }}>{error}</p>
                        <button
                            onClick={() => fetchIntelligence(currentUsername)}
                            className="v0-button"
                            style={{ background: 'var(--sage)', border: 0, padding: '8px 16px', fontSize: '12px' }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Render Dossier */}
                {!isLoading && data && (
                    <DeveloperIntelligenceDossier
                        data={data}
                        onRefresh={() => fetchIntelligence(currentUsername, true)}
                        isRefreshing={isRefreshing}
                    />
                )}
            </main>
        </div>
    );
};

export default GitHubAnalyticsIntelligence;
