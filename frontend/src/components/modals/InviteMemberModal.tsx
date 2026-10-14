import React, { useState } from 'react';
import { podService } from '../../services/podService';
import { githubService, type DeveloperIntelligenceData } from '../../services/githubService';
import {
    FaGithub,
    FaUserPlus,
    FaXmark,
    FaCheck,
    FaBrain,
    FaStar,
    FaCodeBranch,
    FaShieldHalved,
    FaLocationDot
} from 'react-icons/fa6';
import { HiOutlineSparkles, HiOutlineBolt } from 'react-icons/hi2';

interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    podId: string;
    podName: string;
    podDescription?: string;
    onMemberAdded: () => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
    isOpen,
    onClose,
    podId,
    podName,
    podDescription,
    onMemberAdded
}) => {
    const [usernameInput, setUsernameInput] = useState('');
    const [role, setRole] = useState('member');
    const [candidateData, setCandidateData] = useState<DeveloperIntelligenceData | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isInviting, setIsInviting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleScanUser = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = usernameInput.trim().replace(/^@/, '');
        if (!trimmed) return;

        setIsScanning(true);
        setError(null);
        setCandidateData(null);
        setSuccessMessage(null);

        try {
            const data = await githubService.getIntelligence(trimmed);
            setCandidateData(data);
        } catch (err: any) {
            console.error('Scan error:', err);
            setError(err?.message || 'Could not find or analyze this GitHub user.');
        } finally {
            setIsScanning(false);
        }
    };

    // Calculate Pod Compatibility Score (0 - 100)
    const calculateCompatibility = () => {
        if (!candidateData) return 75;
        const podKeywords = `${podName} ${podDescription || ''}`.toLowerCase();
        let overlap = 0;

        const candidateLangs = candidateData.languageDistribution.map(l => l.name.toLowerCase());
        candidateLangs.forEach(lang => {
            if (podKeywords.includes(lang)) overlap += 20;
        });

        // Boost based on dev score
        const scoreBonus = Math.round((candidateData.metrics.developerScore / 100) * 25);
        const baseMatch = 65 + overlap + scoreBonus;
        return Math.min(98, Math.max(55, baseMatch));
    };

    const handleInvite = async () => {
        const trimmed = usernameInput.trim().replace(/^@/, '');
        if (!trimmed) return;

        setIsInviting(true);
        setError(null);
        try {
            await podService.addMember(podId, trimmed, role);
            setSuccessMessage(`Successfully invited @${trimmed} to ${podName}!`);
            setTimeout(() => {
                onMemberAdded();
                onClose();
            }, 1200);
        } catch (err: any) {
            console.error('Invite error:', err);
            setError(err?.message || 'Failed to invite member. They may already be a member of this Pod.');
        } finally {
            setIsInviting(false);
        }
    };

    const compatibility = calculateCompatibility();

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                background: 'rgba(21, 33, 26, 0.55)',
                backdropFilter: 'blur(8px)',
                display: 'grid',
                placeItems: 'center',
                padding: '20px'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--cream)',
                    border: '1px solid var(--line)',
                    borderRadius: '16px',
                    width: 'min(580px, 94vw)',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 24px 70px rgba(0, 0, 0, 0.25)',
                    padding: '30px',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                            style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '8px',
                                background: 'var(--sage)',
                                color: 'white',
                                display: 'grid',
                                placeItems: 'center'
                            }}
                        >
                            <FaUserPlus style={{ fontSize: '15px' }} />
                        </div>
                        <div>
                            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--sage-dark)' }}>
                                AI TALENT SCOUT
                            </span>
                            <h2 style={{ margin: 0, fontSize: '19px', letterSpacing: '-0.04em' }}>
                                Invite Member to Pod
                            </h2>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            border: 0,
                            background: 'white',
                            borderStyle: 'solid',
                            borderColor: 'var(--line)',
                            borderWidth: '1px',
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer',
                            color: 'var(--muted-text)'
                        }}
                    >
                        <FaXmark style={{ fontSize: '13px' }} />
                    </button>
                </div>

                <p style={{ margin: '0 0 20px', color: 'var(--muted-text)', fontSize: '12px', lineHeight: 1.5 }}>
                    Enter any developer's GitHub handle to instantly preview their <strong>Technical DNA</strong> and compatibility with <strong>{podName}</strong>.
                </p>

                {/* Search Form */}
                <form onSubmit={handleScanUser} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                    <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'white',
                            border: '1px solid var(--line)',
                            borderRadius: '8px',
                            padding: '0 12px'
                        }}
                    >
                        <FaGithub style={{ color: '#9aa59d', fontSize: '15px' }} />
                        <input
                            type="text"
                            placeholder="GitHub username (e.g. Komalgiri)"
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            style={{
                                width: '100%',
                                border: 0,
                                outline: 0,
                                padding: '11px 0',
                                fontSize: '12px',
                                color: 'var(--ink)'
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isScanning || !usernameInput.trim()}
                        className="v0-button"
                        style={{
                            background: 'var(--sage)',
                            padding: '11px 18px',
                            fontSize: '12px',
                            cursor: isScanning ? 'wait' : 'pointer'
                        }}
                    >
                        <HiOutlineSparkles />
                        {isScanning ? 'Scanning...' : 'Scan DNA'}
                    </button>
                </form>

                {/* Error */}
                {error && (
                    <div
                        style={{
                            background: '#fcf0ed',
                            border: '1px solid #f6cfc7',
                            borderRadius: '8px',
                            padding: '12px 14px',
                            color: '#9e3b2b',
                            fontSize: '12px',
                            marginBottom: '16px'
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Success */}
                {successMessage && (
                    <div
                        style={{
                            background: '#edf6ec',
                            border: '1px solid #d4e8d2',
                            borderRadius: '8px',
                            padding: '12px 14px',
                            color: 'var(--sage-dark)',
                            fontSize: '12px',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <FaCheck />
                        {successMessage}
                    </div>
                )}

                {/* AI Talent Match Preview Card */}
                {candidateData && (
                    <div
                        style={{
                            background: 'white',
                            border: '1px solid var(--line)',
                            borderRadius: '12px',
                            padding: '18px',
                            marginBottom: '20px',
                            boxShadow: '0 8px 24px #42513e08'
                        }}
                    >
                        {/* Candidate Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img
                                    src={candidateData.profile.avatarUrl}
                                    alt={candidateData.profile.name}
                                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <strong style={{ fontSize: '15px' }}>{candidateData.profile.name}</strong>
                                        <span style={{ fontSize: '10px', color: 'var(--sage-dark)', background: '#edf4eb', padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>
                                            {candidateData.profile.yearsActive}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '11px', color: 'var(--muted-text)' }}>
                                        @{candidateData.profile.username} • {candidateData.profile.location}
                                    </span>
                                </div>
                            </div>

                            {/* Dev Score Gauge */}
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '9px', fontWeight: 700, color: '#9aa59d', letterSpacing: '0.1em' }}>DEV SCORE</span>
                                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--sage-dark)', lineHeight: 1 }}>
                                    {candidateData.metrics.developerScore}
                                    <small style={{ fontSize: '11px', color: '#9aa59d', fontWeight: 600 }}>/100</small>
                                </div>
                            </div>
                        </div>

                        {/* Pod Compatibility Meter */}
                        <div
                            style={{
                                background: '#f7faf6',
                                border: '1px solid #e3ebe2',
                                borderRadius: '8px',
                                padding: '12px',
                                marginBottom: '14px'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--sage-dark)' }}>
                                    POD TECH STACK SYNERGY
                                </span>
                                <strong style={{ fontSize: '12px', color: 'var(--sage-dark)' }}>
                                    {compatibility}% Match
                                </strong>
                            </div>
                            <div style={{ height: '6px', background: '#edf1ed', borderRadius: '99px', overflow: 'hidden' }}>
                                <div
                                    style={{
                                        width: `${compatibility}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, var(--sage) 0%, var(--sage-dark) 100%)',
                                        borderRadius: 'inherit'
                                    }}
                                />
                            </div>
                            <small style={{ display: 'block', marginTop: '6px', fontSize: '10px', color: '#7a877e' }}>
                                Matches core technologies and demonstrated shipping velocity.
                            </small>
                        </div>

                        {/* Archetype & Top Stack */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                            <div>
                                <span style={{ color: '#9aa59d', fontWeight: 600 }}>Archetype: </span>
                                <strong style={{ color: 'var(--ink)' }}>{candidateData.aiIntelligence.archetype}</strong>
                            </div>
                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '4px' }}>
                                {candidateData.languageDistribution.slice(0, 4).map((lang, idx) => (
                                    <span
                                        key={idx}
                                        style={{
                                            fontSize: '10px',
                                            padding: '2px 8px',
                                            background: 'var(--soft)',
                                            border: '1px solid var(--line)',
                                            borderRadius: '4px',
                                            fontWeight: 600
                                        }}
                                    >
                                        {lang.name} <b>{lang.percentage}%</b>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Role Selection & Invite Action */}
                        <div style={{ borderTop: '1px solid var(--line)', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '11px', color: '#7a877e', fontWeight: 600 }}>Assign Role:</span>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    style={{
                                        border: '1px solid var(--line)',
                                        borderRadius: '6px',
                                        padding: '4px 8px',
                                        fontSize: '11px',
                                        background: 'white',
                                        color: 'var(--ink)'
                                    }}
                                >
                                    <option value="member">Member</option>
                                    <option value="maintainer">Maintainer</option>
                                </select>
                            </div>

                            <button
                                onClick={handleInvite}
                                disabled={isInviting}
                                className="v0-button dashboard-action"
                                style={{
                                    padding: '8px 18px',
                                    fontSize: '12px',
                                    background: 'var(--sage)',
                                    cursor: isInviting ? 'wait' : 'pointer'
                                }}
                            >
                                <FaCheck />
                                {isInviting ? 'Sending Invite...' : 'Confirm Invite'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
