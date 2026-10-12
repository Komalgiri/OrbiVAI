import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { podService, type Pod, type PodStats } from '../services/podService';
import { Code2, CircleCheck, Sparkles, Activity } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import GitHubActivity from './GitHubActivity';

const PodOverview = () => {
    const navigate = useNavigate();
    const { id: podId } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('roadmap');
    const [pod, setPod] = useState<Pod | null>(null);
    const [stats, setStats] = useState<PodStats | null>(null);
    const [loading, setLoading] = useState(true);

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
                        <Sparkles style={{ width: '15px', marginRight: '5px' }} /> Generate AI Roadmap
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
                                <div className="activity-type sage"><CircleCheck /></div>
                                <div className="activity-copy">
                                    <p><strong>Phase 1: Project Initialization</strong></p>
                                    <span>Repository setup, linting, and CI/CD pipelines.</span>
                                </div>
                                <time>Completed</time>
                            </div>
                            <div className="activity-item" style={{ borderLeft: '2px solid var(--sage)', marginLeft: '14px', paddingLeft: '20px' }}>
                                <div className="activity-type amber" style={{ marginLeft: '-36px' }}><Activity /></div>
                                <div className="activity-copy">
                                    <p><strong>Phase 2: Core Data Models</strong></p>
                                    <span>Prisma schema for Pods, Users, and Activity Sync.</span>
                                </div>
                                <time>In Progress</time>
                            </div>
                            <div className="activity-item" style={{ borderLeft: '2px solid #edf0ed', marginLeft: '14px', paddingLeft: '20px' }}>
                                <div className="activity-type" style={{ marginLeft: '-36px', background: 'white', border: '1px solid var(--line)', color: 'var(--muted-text)' }}><Code2 /></div>
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
                                <button className="task-check"><CircleCheck /></button>
                                <div className="task-copy">
                                    <strong>Setup PostgreSQL database</strong>
                                    <span>Assigned to Alex Morgan</span>
                                </div>
                                <div className="priority high">High</div>
                            </div>
                            <div className="task-row">
                                <button className="task-check" style={{ color: 'var(--line)' }}><CircleCheck /></button>
                                <div className="task-copy">
                                    <strong>Implement GitHub OAuth flow</strong>
                                    <span>Assigned to Sam Ortiz</span>
                                </div>
                                <div className="priority medium">Medium</div>
                            </div>
                            <div className="task-row">
                                <button className="task-check" style={{ color: 'var(--line)' }}><CircleCheck /></button>
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
                    <div className="members-heading">
                        <div>
                            <span className="section-label">TEAM DIRECTORY</span>
                            <h2>Pod Members</h2>
                        </div>
                    </div>
                    <div className="members-grid" style={{ marginTop: '20px' }}>
                        {pod.members?.map((member, i) => (
                            <div className="member-card" key={member.id || i}>
                                <div className={`member-avatar avatar-${(i % 3) + 1}`}>{member.user?.name ? member.user.name.split(' ').map((n: string) => n.charAt(0)).join('') : 'U'}</div>
                                <button className="member-more">•••</button>
                                <h3>{member.user?.name || 'User'}</h3>
                                <p>@{member.user?.githubId || 'github'}</p>
                                <span className="member-pod">{member.role}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

export default PodOverview;
