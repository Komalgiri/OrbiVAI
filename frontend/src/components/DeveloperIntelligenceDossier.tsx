import React, { useState } from 'react';
import type { DeveloperIntelligenceData } from '../services/githubService';
import {
    FaGithub,
    FaStar,
    FaCodeBranch,
    FaShareNodes,
    FaCopy,
    FaCheck,
    FaLocationDot,
    FaBrain,
    FaChartLine,
    FaLightbulb,
    FaUserTie,
    FaShieldHalved
} from 'react-icons/fa6';
import {
    HiOutlineSparkles,
    HiOutlineArrowTopRightOnSquare,
    HiOutlineArrowPath,
    HiOutlineBolt
} from 'react-icons/hi2';

interface DossierProps {
    data: DeveloperIntelligenceData;
    onRefresh?: () => void;
    isRefreshing?: boolean;
    compact?: boolean;
}

export const DeveloperIntelligenceDossier: React.FC<DossierProps> = ({
    data,
    onRefresh,
    isRefreshing = false,
    compact = false
}) => {
    const [copied, setCopied] = useState(false);
    const [completedTips, setCompletedTips] = useState<Record<number, boolean>>({});

    const { profile, metrics, languageDistribution, projectScale, aiIntelligence } = data;

    const handleCopyShareLink = () => {
        const url = `${window.location.origin}/u/${encodeURIComponent(profile.username)}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const toggleTip = (index: number) => {
        setCompletedTips(prev => ({ ...prev, [index]: !prev[index] }));
    };

    // Score meter color calculation
    const score = metrics.developerScore;
    const scoreColor = score >= 75 ? 'var(--sage-dark)' : score >= 40 ? 'var(--amber)' : '#526057';
    const scoreTier = score >= 80 ? 'Master Architect' : score >= 60 ? 'Senior Polyglot' : score >= 35 ? 'Product Builder' : 'Rising Contributor';

    return (
        <div className={`intelligence-dossier-wrap ${compact ? 'is-compact' : ''}`} style={{ width: '100%' }}>
            {/* Header Hero Profile Card */}
            <div
                style={{
                    background: 'white',
                    border: '1px solid var(--line)',
                    borderRadius: '12px',
                    padding: compact ? '20px' : '30px',
                    boxShadow: '0 8px 30px #42513e08',
                    marginBottom: '20px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Subtle Decorative Aura */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-80px',
                        right: '-80px',
                        width: '240px',
                        height: '240px',
                        background: 'radial-gradient(circle, #edf4eb 0%, rgba(255,255,255,0) 70%)',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <img
                                src={profile.avatarUrl}
                                alt={profile.name}
                                style={{
                                    width: compact ? '64px' : '84px',
                                    height: compact ? '64px' : '84px',
                                    borderRadius: '50%',
                                    border: '3px solid white',
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                                    objectFit: 'cover'
                                }}
                            />
                            <span
                                style={{
                                    position: 'absolute',
                                    bottom: '2px',
                                    right: '2px',
                                    width: '18px',
                                    height: '18px',
                                    background: 'var(--sage)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    display: 'grid',
                                    placeItems: 'center',
                                    fontSize: '10px',
                                    border: '2px solid white'
                                }}
                                title="Verified GitHub Profile"
                            >
                                <FaCheck style={{ width: '8px', height: '8px' }} />
                            </span>
                        </div>

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                <h2 style={{ margin: 0, fontSize: compact ? '20px' : '28px', letterSpacing: '-0.05em' }}>
                                    {profile.name}
                                </h2>
                                <span
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        color: 'var(--sage-dark)',
                                        background: '#edf4eb',
                                        padding: '4px 10px',
                                        borderRadius: '99px',
                                        letterSpacing: '0.02em'
                                    }}
                                >
                                    {profile.yearsActive}
                                </span>
                            </div>

                            <p style={{ margin: '6px 0 10px', color: 'var(--muted-text)', fontSize: '13px', maxWidth: '620px', lineHeight: 1.5 }}>
                                {profile.bio}
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', fontSize: '12px', color: '#7a857e' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <FaLocationDot style={{ color: 'var(--sage)', fontSize: '12px' }} />
                                    {profile.location}
                                </span>
                                <a
                                    href={profile.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        color: 'var(--sage-dark)',
                                        textDecoration: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    <FaGithub style={{ fontSize: '13px' }} />
                                    View GitHub Profile
                                    <HiOutlineArrowTopRightOnSquare style={{ fontSize: '12px' }} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {onRefresh && (
                            <button
                                onClick={onRefresh}
                                disabled={isRefreshing}
                                className="v0-button"
                                style={{
                                    background: 'white',
                                    color: 'var(--ink)',
                                    border: '1px solid var(--line)',
                                    padding: '9px 14px',
                                    fontSize: '12px',
                                    cursor: isRefreshing ? 'wait' : 'pointer'
                                }}
                                title="Re-sync GitHub and re-run AI intelligence"
                            >
                                <HiOutlineArrowPath style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
                                {isRefreshing ? 'Analyzing...' : 'Re-analyze'}
                            </button>
                        )}
                        <button
                            onClick={handleCopyShareLink}
                            className="v0-button dashboard-action"
                            style={{
                                padding: '9px 16px',
                                fontSize: '12px',
                                background: copied ? 'var(--sage-dark)' : 'var(--sage)',
                                cursor: 'pointer'
                            }}
                        >
                            {copied ? <FaCheck /> : <FaShareNodes />}
                            {copied ? 'Link Copied!' : 'Share Dossier'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Core Scorecards Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: compact ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                    gap: '14px',
                    marginBottom: '20px'
                }}
            >
                {/* 1. Developer Score Card */}
                <div
                    style={{
                        background: 'white',
                        border: '1px solid var(--line)',
                        borderRadius: '10px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 16px #42513e06'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#9aa59d' }}>DEVELOPER SCORE</span>
                        <FaShieldHalved style={{ color: scoreColor, fontSize: '14px' }} />
                    </div>
                    <div style={{ margin: '14px 0 8px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <strong style={{ fontSize: '38px', lineHeight: 1, letterSpacing: '-0.07em', color: scoreColor }}>
                            {metrics.developerScore}
                        </strong>
                        <span style={{ fontSize: '13px', color: '#9aa59d', fontWeight: 600 }}>/ 100</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: 'var(--sage-dark)', fontWeight: 700, background: '#edf4eb', padding: '2px 8px', borderRadius: '4px' }}>
                            {scoreTier}
                        </span>
                        <small style={{ fontSize: '10px', color: '#9aa59d' }}>AI Composite</small>
                    </div>
                </div>

                {/* 2. Stars Card */}
                <div
                    style={{
                        background: 'white',
                        border: '1px solid var(--line)',
                        borderRadius: '10px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 16px #42513e06'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#9aa59d' }}>TOTAL STARS</span>
                        <FaStar style={{ color: 'var(--amber)', fontSize: '14px' }} />
                    </div>
                    <div style={{ margin: '14px 0 8px' }}>
                        <strong style={{ fontSize: '32px', lineHeight: 1, letterSpacing: '-0.06em' }}>
                            {metrics.totalStars}
                        </strong>
                    </div>
                    <div style={{ fontSize: '11px', color: '#88948b' }}>
                        <strong style={{ color: 'var(--amber)' }}>{metrics.starsPerRepo}</strong>
                    </div>
                </div>

                {/* 3. Repositories Card */}
                <div
                    style={{
                        background: 'white',
                        border: '1px solid var(--line)',
                        borderRadius: '10px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 16px #42513e06'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#9aa59d' }}>REPOSITORIES</span>
                        <FaCodeBranch style={{ color: 'var(--sage)', fontSize: '14px' }} />
                    </div>
                    <div style={{ margin: '14px 0 8px' }}>
                        <strong style={{ fontSize: '32px', lineHeight: 1, letterSpacing: '-0.06em' }}>
                            {metrics.totalRepos}
                        </strong>
                    </div>
                    <div style={{ fontSize: '11px', color: '#88948b' }}>
                        <b>{metrics.sourceRepos} Source</b> / {metrics.forkedRepos} Fork
                    </div>
                </div>

                {/* 4. Community Traction Card */}
                <div
                    style={{
                        background: 'white',
                        border: '1px solid var(--line)',
                        borderRadius: '10px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 16px #42513e06'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#9aa59d' }}>COMMUNITY & FORKS</span>
                        <HiOutlineBolt style={{ color: 'var(--sage-dark)', fontSize: '15px' }} />
                    </div>
                    <div style={{ margin: '14px 0 8px' }}>
                        <strong style={{ fontSize: '32px', lineHeight: 1, letterSpacing: '-0.06em' }}>
                            {metrics.totalForks}
                        </strong>
                        <span style={{ fontSize: '12px', color: '#9aa59d', marginLeft: '6px' }}>Total Forks</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#88948b' }}>
                        <b>{metrics.followers}</b> Followers / <b>{metrics.following}</b> Following
                    </div>
                </div>
            </div>

            {/* Split Content: Language Distribution & Project Scale */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: compact ? '1fr' : '1fr 1fr',
                    gap: '20px',
                    marginBottom: '20px'
                }}
            >
                {/* Language Distribution */}
                <div
                    style={{
                        background: 'white',
                        border: '1px solid var(--line)',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 4px 16px #42513e06'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                        <div>
                            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: '#9aa59d' }}>TECHNICAL STACK</span>
                            <h3 style={{ margin: '4px 0 0', fontSize: '18px', letterSpacing: '-0.04em' }}>Language Distribution</h3>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--sage-dark)', fontWeight: 700 }}>Weighted by bytes</span>
                    </div>

                    {/* Multi-segment Progress Bar */}
                    <div
                        style={{
                            height: '10px',
                            borderRadius: '99px',
                            display: 'flex',
                            overflow: 'hidden',
                            background: '#edf1ed',
                            marginBottom: '18px'
                        }}
                    >
                        {languageDistribution.map((lang, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: `${lang.percentage}%`,
                                    background: lang.color,
                                    height: '100%'
                                }}
                                title={`${lang.name}: ${lang.percentage}%`}
                            />
                        ))}
                    </div>

                    {/* Breakdown Badges */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                        {languageDistribution.map((lang, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '8px 12px',
                                    background: 'var(--soft)',
                                    borderRadius: '7px',
                                    fontSize: '12px'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: lang.color
                                        }}
                                    />
                                    <strong>{lang.name}</strong>
                                </div>
                                <span style={{ color: 'var(--muted-text)', fontWeight: 600 }}>{lang.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Project Scale & Impact */}
                <div
                    style={{
                        background: 'white',
                        border: '1px solid var(--line)',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 4px 16px #42513e06'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                        <div>
                            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: '#9aa59d' }}>CODEBASE MATURITY</span>
                            <h3 style={{ margin: '4px 0 0', fontSize: '18px', letterSpacing: '-0.04em' }}>Project Scale & Impact</h3>
                        </div>
                        <span style={{ fontSize: '11px', color: '#88948b' }}>
                            {projectScale.totalSource} Original Repos
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {projectScale.notableProjects.map((project, idx) => (
                            <div
                                key={idx}
                                style={{
                                    border: '1px solid var(--line)',
                                    borderRadius: '8px',
                                    padding: '12px 14px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <a
                                            href={project.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                                fontWeight: 700,
                                                fontSize: '13px',
                                                color: 'var(--ink)',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            {project.name}
                                        </a>
                                        <span
                                            style={{
                                                fontSize: '10px',
                                                padding: '2px 6px',
                                                background: '#f0f3ef',
                                                borderRadius: '4px',
                                                color: 'var(--sage-dark)',
                                                fontWeight: 600
                                            }}
                                        >
                                            {project.language}
                                        </span>
                                    </div>
                                    <p
                                        style={{
                                            margin: '4px 0 0',
                                            fontSize: '11px',
                                            color: 'var(--muted-text)',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {project.description}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: '#88948b' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        <FaStar style={{ color: 'var(--amber)', fontSize: '10px' }} />
                                        {project.stars}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        <FaCodeBranch style={{ fontSize: '10px' }} />
                                        {project.forks}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Intelligence Section 🧠 */}
            <div
                style={{
                    background: '#fcfdfb',
                    border: '1px solid #dbe5d8',
                    borderRadius: '14px',
                    padding: compact ? '20px' : '32px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 8px 30px rgba(120, 155, 115, 0.08)'
                }}
            >
                {/* AI Aura Watermark */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-30px',
                        right: '-30px',
                        width: '260px',
                        height: '260px',
                        background: 'radial-gradient(circle, #e6f0e3 0%, rgba(255,255,255,0) 70%)',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: 'var(--sage)',
                            color: 'white',
                            display: 'grid',
                            placeItems: 'center'
                        }}
                    >
                        <FaBrain style={{ fontSize: '18px' }} />
                    </div>
                    <div>
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--sage-dark)' }}>
                            DEEP TECHNICAL DNA & BEHAVIORAL PATTERNS
                        </span>
                        <h2 style={{ margin: 0, fontSize: '24px', letterSpacing: '-0.05em' }}>
                            AI Intelligence 🧠
                        </h2>
                    </div>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: compact ? '1fr' : '1.2fr 0.8fr',
                        gap: '24px'
                    }}
                >
                    {/* Left Column: Archetype, Technical Strength, Career Trajectory */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {/* Archetype */}
                        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: '10px', padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <HiOutlineSparkles style={{ color: 'var(--sage-dark)', fontSize: '16px' }} />
                                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#9aa59d' }}>DEVELOPER ARCHETYPE</span>
                            </div>
                            <strong style={{ display: 'block', fontSize: '18px', color: 'var(--ink)', marginBottom: '6px' }}>
                                {aiIntelligence.archetype}
                            </strong>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted-text)', lineHeight: 1.55 }}>
                                {aiIntelligence.archetypeSummary}
                            </p>
                        </div>

                        {/* Technical Strength */}
                        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: '10px', padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <FaChartLine style={{ color: 'var(--sage)', fontSize: '14px' }} />
                                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#9aa59d' }}>TECHNICAL STRENGTH</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted-text)', lineHeight: 1.6 }}>
                                {aiIntelligence.technicalStrength}
                            </p>
                        </div>

                        {/* Career Trajectory */}
                        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: '10px', padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <FaUserTie style={{ color: 'var(--amber)', fontSize: '14px' }} />
                                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#9aa59d' }}>CAREER TRAJECTORY</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted-text)', lineHeight: 1.6 }}>
                                {aiIntelligence.careerTrajectory}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Strategic Growth Tips & Recruiter Outlook */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {/* Strategic Growth Tips (Interactive Checklist) */}
                        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: '10px', padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                                <FaLightbulb style={{ color: 'var(--amber)', fontSize: '14px' }} />
                                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#9aa59d' }}>STRATEGIC GROWTH TIPS</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {aiIntelligence.strategicGrowthTips.map((tip, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => toggleTip(idx)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '10px',
                                            padding: '9px 11px',
                                            background: completedTips[idx] ? '#edf6ec' : 'var(--soft)',
                                            borderRadius: '7px',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={!!completedTips[idx]}
                                            onChange={() => {}}
                                            style={{ marginTop: '2px', accentColor: 'var(--sage)' }}
                                        />
                                        <span
                                            style={{
                                                fontSize: '12px',
                                                color: completedTips[idx] ? '#7c8a7e' : 'var(--ink)',
                                                textDecoration: completedTips[idx] ? 'line-through' : 'none',
                                                lineHeight: 1.5
                                            }}
                                        >
                                            {tip}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recruiter Outlook */}
                        <div
                            style={{
                                background: '#f5f7f3',
                                border: '1px solid #d8e2d6',
                                borderRadius: '10px',
                                padding: '20px',
                                position: 'relative'
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    letterSpacing: '0.12em',
                                    color: 'var(--sage-dark)',
                                    display: 'block',
                                    marginBottom: '6px'
                                }}
                            >
                                RECRUITER & LEAD OUTLOOK
                            </span>
                            <strong style={{ fontSize: '14px', display: 'block', marginBottom: '8px', color: 'var(--ink)' }}>
                                Executive Talent Dossier
                            </strong>
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted-text)', lineHeight: 1.6 }}>
                                "{aiIntelligence.recruiterOutlook}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
