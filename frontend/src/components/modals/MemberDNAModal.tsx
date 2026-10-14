import React, { useEffect, useState } from 'react';
import { DeveloperIntelligenceDossier } from '../DeveloperIntelligenceDossier';
import { githubService, type DeveloperIntelligenceData } from '../../services/githubService';
import { FaXmark, FaBrain } from 'react-icons/fa6';
import { HiOutlineSparkles } from 'react-icons/hi2';

interface MemberDNAModalProps {
    isOpen: boolean;
    onClose: () => void;
    username: string;
    memberName?: string;
}

export const MemberDNAModal: React.FC<MemberDNAModalProps> = ({
    isOpen,
    onClose,
    username,
    memberName
}) => {
    const [data, setData] = useState<DeveloperIntelligenceData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !username) return;

        const loadDNA = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const cleanUser = username.replace(/^@/, '');
                const result = await githubService.getIntelligence(cleanUser);
                setData(result);
            } catch (err: any) {
                console.error("Failed to load member DNA:", err);
                setError(err?.message || "Could not retrieve GitHub intelligence for this member.");
            } finally {
                setIsLoading(false);
            }
        };

        loadDNA();
    }, [isOpen, username]);

    if (!isOpen) return null;

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
                    width: 'min(980px, 94vw)',
                    maxHeight: '88vh',
                    overflowY: 'auto',
                    boxShadow: '0 24px 70px rgba(0, 0, 0, 0.25)',
                    padding: '28px clamp(16px, 3vw, 36px)',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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
                            <FaBrain style={{ fontSize: '16px' }} />
                        </div>
                        <div>
                            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--sage-dark)' }}>
                                POD MEMBER INTELLIGENCE
                            </span>
                            <h2 style={{ margin: 0, fontSize: '20px', letterSpacing: '-0.04em' }}>
                                Technical DNA: {memberName || username}
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
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer',
                            color: 'var(--muted-text)'
                        }}
                    >
                        <FaXmark style={{ fontSize: '14px' }} />
                    </button>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '3px solid #edf4eb',
                                borderTopColor: 'var(--sage)',
                                animation: 'spin 0.9s linear infinite',
                                margin: '0 auto 16px'
                            }}
                        />
                        <strong style={{ fontSize: '15px', color: 'var(--ink)', display: 'block' }}>
                            Uncovering Technical DNA for @{username}...
                        </strong>
                        <span style={{ fontSize: '12px', color: 'var(--muted-text)', marginTop: '4px', display: 'block' }}>
                            Parsing repositories, calculating developer score, and loading AI archetype.
                        </span>
                    </div>
                )}

                {/* Error State */}
                {!isLoading && error && (
                    <div
                        style={{
                            background: '#fcf0ed',
                            border: '1px solid #f6cfc7',
                            borderRadius: '10px',
                            padding: '24px',
                            textAlign: 'center',
                            color: '#9e3b2b'
                        }}
                    >
                        <p style={{ margin: '0 0 12px', fontSize: '13px' }}>{error}</p>
                        <button
                            onClick={onClose}
                            className="v0-button"
                            style={{ background: 'var(--sage)', border: 0, padding: '7px 14px', fontSize: '11px' }}
                        >
                            Close
                        </button>
                    </div>
                )}

                {/* Content */}
                {!isLoading && data && (
                    <DeveloperIntelligenceDossier data={data} compact={true} />
                )}
            </div>
        </div>
    );
};
