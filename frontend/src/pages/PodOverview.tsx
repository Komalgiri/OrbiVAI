import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { podService, type Pod, type PodStats } from '../services/podService';
import {
    FaGithub,
    FaCode,
    FaCircleCheck,
    FaChartLine,
    FaUserPlus,
    FaBrain
} from 'react-icons/fa6';
import { HiOutlineSparkles } from 'react-icons/hi2';
import GitHubActivity from './GitHubActivity';
import { MemberDNAModal } from '../components/modals/MemberDNAModal';
import { InviteMemberModal } from '../components/modals/InviteMemberModal';

const PodOverview = () => {
    const navigate = useNavigate();
    const { id: podId } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('roadmap');
    const [pod, setPod] = useState<Pod | null>(null);
    const [stats, setStats] = useState<PodStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMemberDNA, setSelectedMemberDNA] = useState<{ username: string; name: string } | null>(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const refreshData = async () => {
        if (!podId) return;
        try {
            const [podResponse, statsResponse] = await Promise.all([
                podService.getPod(podId),
                podService.getPodStats(podId)
            ]);
            setPod(podResponse.pod);
            setStats(statsResponse.stats);
        } catch (error) {
            console.error("Failed to fetch pod data", error);
        }
    };

    useEffect(() => {
        const fetchPodData = async () => {
            setLoading(true);
            await refreshData();
            setLoading(false);
        };
        fetchPodData();
    }, [podId]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: 'var(--muted-text)' }}>Loading pod...</div>;
    if (!pod) return <div style={{ padding: '50px', textAlign: 'center', color: 'var(--muted-text)' }}>Pod not found.</div>;

    const initials = pod?.name ? pod.name.substring(0, 2).toUpperCase() : 'P';

    return (
        <>
            <div className="dashboard-heading-row" style={{ alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div className="pod-icon" style={{ width: '48px', height: '48px', fontSize: '20px', fontWeight: 'bold' }}>{initials}</div>
                    <div>
                        <span className="section-label" style={{ marginBottom: '4px', display: 'block' }}>ACTIVE POD</span>
                        <h1 style={{ margin: 0 }}>{pod.name}</h1>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="v0-button" style={{ background: 'white', color: 'var(--ink)', border: '1px solid var(--line)' }}>
                        <FaGithub style={{ width: '15px', marginRight: '5px' }} /> Sync GitHub
                    </button>
                    <button className="v0-button dashboard-action">
                        <HiOutlineSparkles style={{ width: '15px', marginRight: '5px' }} /> Generate AI Roadmap
                    </button>
                </div>
            </div>

            <div className="page-toolbar">
                <div className="filter-pills">
                    <span className={`filter-pill ${activeTab === 'overview' ? 'is-active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</span>
                    <span className={`filter-pill ${activeTab === 'roadmap' ? 'is-active' : ''}`} onClick={() => setActiveTab('roadmap')}>Roadmap & Tasks</span>
                    <span className={`filter-pill ${activeTab === 'github' ? 'is-active' : ''}`} onClick={() => setActiveTab('github')}>GitHub Activity</span>
                    <span className={`filter-pill ${activeTab === 'members' ? 'is-active' : ''}`} onClick={() => setActiveTab('members')}>Members</span>
                </div>
            </div>

            {activeTab === 'overview' && (
                <div className="dashboard-summary">
                    <div>
                        <span>Pod Health</span>
                        <strong className="summary-up">{stats?.health || 100}%</strong>
                        <small>Excellent</small>
                    </div>
                    <div>
                        <span>Commits</span>
                        <strong>{stats?.commits?.value || 0}</strong>
                        <small><span className="summary-up">{stats?.commits?.trend || '+0%'}</span> this week</small>
                    </div>
                    <div>
                        <span>Pull Requests</span>
                        <strong>{stats?.prs?.value || 0}</strong>
                        <small><span className="summary-up">{stats?.prs?.trend || '+0%'}</span> this week</small>
                    </div>
                    <div>
                        <span>Active Members</span>
                        <strong>{pod.members?.length || 0}</strong>
                        <small>Collaborating now</small>
                    </div>
                </div>
            )}

            {activeTab === 'roadmap' && (
                <div className="dashboard-lower-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '0' }}>
                    <section className="activity-panel">
                        <div className="dashboard-section-heading">
                            <div>
                                <span className="section-label">AI ROADMAP</span>
                                <h2>Project Timeline</h2>
                            </div>
                        </div>
                        <div className="activity-list" style={{ marginTop: '20px' }}>
                            <div className="activity-item">
                                <div className="activity-type sage"><FaCircleCheck /></div>
                                <div className="activity-copy">
                                    <p><strong>Phase 1: Project Initialization</strong></p>
                                    <span>Repository setup, linting, and CI/CD pipelines.</span>
                                </div>
                                <time>Completed</time>
                            </div>
                            <div className="activity-item" style={{ borderLeft: '2px solid var(--sage)', marginLeft: '14px', paddingLeft: '20px' }}>
                                <div className="activity-type amber" style={{ marginLeft: '-36px' }}><FaChartLine /></div>
                                <div className="activity-copy">
                                    <p><strong>Phase 2: Core Data Models</strong></p>
                                    <span>Prisma schema for Pods, Users, and Activity Sync.</span>
                                </div>
                                <time>In Progress</time>
                            </div>
                            <div className="activity-item" style={{ borderLeft: '2px solid #edf0ed', marginLeft: '14px', paddingLeft: '20px' }}>
                                <div className="activity-type" style={{ marginLeft: '-36px', background: 'white', border: '1px solid var(--line)', color: 'var(--muted-text)' }}><FaCode /></div>
                                <div className="activity-copy">
                                    <p style={{ color: 'var(--muted-text)' }}><strong>Phase 3: Real-time Collaboration</strong></p>
                                    <span>WebSocket integration for live cursor tracking.</span>
                                </div>
                                <time>Pending</time>
                            </div>
                        </div>
                    </section>

                    <section className="activity-panel">
                        <div className="dashboard-section-heading">
                            <div>
                                <span className="section-label">TEAM TASKS</span>
                                <h2>Task Board</h2>
                            </div>
                            <button className="text-link">View all <span>→</span></button>
                        </div>
                        <div className="task-list" style={{ marginTop: '20px' }}>
                            <div className="task-row">
                                <button className="task-check"><FaCircleCheck /></button>
                                <div className="task-copy">
                                    <strong>Setup PostgreSQL database</strong>
                                    <span>Assigned to Alex Morgan</span>
                                </div>
                                <div className="priority high">High</div>
                            </div>
                            <div className="task-row">
                                <button className="task-check" style={{ color: 'var(--line)' }}><FaCircleCheck /></button>
                                <div className="task-copy">
                                    <strong>Implement GitHub OAuth flow</strong>
                                    <span>Assigned to Sam Ortiz</span>
                                </div>
                                <div className="priority medium">Medium</div>
                            </div>
                            <div className="task-row">
                                <button className="task-check" style={{ color: 'var(--line)' }}><FaCircleCheck /></button>
                                <div className="task-copy">
                                    <strong>Design system tokens migration</strong>
                                    <span>Assigned to Olivia Chen</span>
                                </div>
                                <div className="priority low">Low</div>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'github' && (
                <div style={{ marginTop: '20px' }}>
                    <GitHubActivity podId={podId!} />
                </div>
            )}

            {activeTab === 'members' && (
                <>
                    {/* 1. Pending Join Requests Review Section */}
                    {pod.members?.some(m => m.status === 'requested' || m.status === 'pending') && (
                        <div
                            style={{
                                background: '#fbfcf9',
                                border: '1px solid #dbe6d9',
                                borderRadius: '12px',
                                padding: '24px',
                                marginBottom: '32px',
                                boxShadow: '0 8px 25px rgba(120, 155, 115, 0.08)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <HiOutlineSparkles style={{ color: 'var(--sage-dark)' }} />
                                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--sage-dark)' }}>
                                    1-CLICK APPLICANT DOSSIER REVIEW
                                </span>
                            </div>
                            <h2 style={{ margin: '0 0 6px', fontSize: '20px', letterSpacing: '-0.04em' }}>
                                Pending Join Requests ({pod.members.filter(m => m.status === 'requested' || m.status === 'pending').length})
                            </h2>
                            <p style={{ margin: '0 0 18px', color: 'var(--muted-text)', fontSize: '12px' }}>
                                Review developers requesting to join this pod. Inspect their live Technical DNA, Developer Score, and strengths before approving.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                                {pod.members.filter(m => m.status === 'requested' || m.status === 'pending').map((member, i) => {
                                    const applicantUsername = member.user?.githubUsername || (member.user as any)?.githubId || member.user?.name || 'applicant';
                                    return (
                                        <div
                                            key={member.id || i}
                                            style={{
                                                background: 'white',
                                                border: '1px solid var(--line)',
                                                borderRadius: '10px',
                                                padding: '16px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                                <div className={`member-avatar avatar-${(i % 3) + 1}`} style={{ width: '36px', height: '36px', fontSize: '12px' }}>
                                                    {member.user?.name ? member.user.name.split(' ').map((n: string) => n.charAt(0)).join('') : 'A'}
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <strong style={{ fontSize: '14px', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                        {member.user?.name || 'Applicant'}
                                                    </strong>
                                                    <span style={{ fontSize: '11px', color: '#88948b' }}>@{applicantUsername}</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--soft)', padding: '6px 10px', borderRadius: '6px', marginBottom: '12px', fontSize: '11px' }}>
                                                <span style={{ color: 'var(--muted-text)' }}>Role / Archetype</span>
                                                <strong style={{ color: 'var(--sage-dark)' }}>{member.user?.inferredRole || 'Developer'}</strong>
                                            </div>

                                            {/* Action Bar */}
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => setSelectedMemberDNA({
                                                        username: applicantUsername,
                                                        name: member.user?.name || 'Applicant'
                                                    })}
                                                    style={{
                                                        flex: 1,
                                                        border: '1px solid var(--line)',
                                                        background: '#f8faf7',
                                                        borderRadius: '6px',
                                                        padding: '7px 8px',
                                                        fontSize: '11px',
                                                        fontWeight: 700,
                                                        color: 'var(--sage-dark)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '5px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <FaBrain /> Inspect DNA
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await podService.respondToInvite(podId!, 'accepted', member.userId);
                                                            refreshData();
                                                        } catch (e: any) {
                                                            alert(e?.message || 'Failed to accept request');
                                                        }
                                                    }}
                                                    className="v0-button dashboard-action"
                                                    style={{ padding: '7px 12px', fontSize: '11px', background: 'var(--sage)', cursor: 'pointer' }}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await podService.respondToInvite(podId!, 'rejected', member.userId);
                                                            refreshData();
                                                        } catch (e: any) {
                                                            alert(e?.message || 'Failed to reject request');
                                                        }
                                                    }}
                                                    style={{
                                                        border: '1px solid var(--line)',
                                                        background: 'white',
                                                        borderRadius: '6px',
                                                        padding: '7px 10px',
                                                        fontSize: '11px',
                                                        color: 'var(--muted-text)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 2. Active Pod Members Directory */}
                    <div className="members-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span className="section-label">TEAM DIRECTORY</span>
                            <h2>Active Pod Members</h2>
                        </div>
                        <button
                            onClick={() => setIsInviteModalOpen(true)}
                            className="v0-button dashboard-action"
                            style={{ fontSize: '12px', padding: '9px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                        >
                            <FaUserPlus /> Invite Member
                        </button>
                    </div>
                    <div className="members-grid" style={{ marginTop: '20px' }}>
                        {pod.members?.filter(m => m.status === 'accepted').map((member, i) => {
                            const memberUsername = member.user?.githubUsername || (member.user as any)?.githubId || member.user?.name || 'developer';
                            return (
                                <div className="member-card" key={member.id || i} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div className={`member-avatar avatar-${(i % 3) + 1}`}>
                                        {member.user?.name ? member.user.name.split(' ').map((n: string) => n.charAt(0)).join('') : 'U'}
                                    </div>
                                    <button className="member-more">•••</button>
                                    <h3>{member.user?.name || 'User'}</h3>
                                    <p>@{memberUsername}</p>
                                    <span className="member-pod">{member.role}</span>

                                    {/* AI Technical DNA Inspect Button */}
                                    <button
                                        onClick={() => setSelectedMemberDNA({
                                            username: memberUsername,
                                            name: member.user?.name || 'Pod Member'
                                        })}
                                        style={{
                                            marginTop: '14px',
                                            border: '1px solid var(--line)',
                                            background: '#f8faf7',
                                            borderRadius: '6px',
                                            padding: '8px 10px',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            color: 'var(--sage-dark)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#edf4eb';
                                            e.currentTarget.style.borderColor = 'var(--sage)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#f8faf7';
                                            e.currentTarget.style.borderColor = 'var(--line)';
                                        }}
                                    >
                                        <FaBrain style={{ fontSize: '12px' }} /> Inspect DNA
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Member DNA Inspect Modal */}
            {selectedMemberDNA && (
                <MemberDNAModal
                    isOpen={!!selectedMemberDNA}
                    onClose={() => setSelectedMemberDNA(null)}
                    username={selectedMemberDNA.username}
                    memberName={selectedMemberDNA.name}
                />
            )}

            {/* Invite Member Modal */}
            {isInviteModalOpen && pod && (
                <InviteMemberModal
                    isOpen={isInviteModalOpen}
                    onClose={() => setIsInviteModalOpen(false)}
                    podId={pod.id}
                    podName={pod.name}
                    podDescription={pod.description || ''}
                    onMemberAdded={() => refreshData()}
                />
            )}
        </>
    );
};

export default PodOverview;
