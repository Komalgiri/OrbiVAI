import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { podService } from '../services/podService';
import { Code2, ChevronDown, GitCommitHorizontal, CircleCheck, Trophy } from 'lucide-react';
import ExplorePodsModal from '../components/ExplorePodsModal';

interface User {
    id: string;
    name: string;
    email: string;
    githubId?: string;
}

interface Pod {
    id: string;
    name: string;
    description: string;
    role: string;
    status: string;
    progress?: number;
    points?: number;
    members?: any[];
}

function AvatarStack({ members }: { members: string[] }) {
    if (!members || members.length === 0) return <div className="dash-avatar-stack"></div>;
    return (
        <div className="dash-avatar-stack" aria-label={`${members.length} pod members`}>
            {members.slice(0, 3).map((member, index) => (
                <span className={`dash-avatar avatar-${(index % 3) + 1}`} key={index}>{member}</span>
            ))}
        </div>
    );
}

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [pods, setPods] = useState<Pod[]>([]);
    const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            navigate('/auth');
            return;
        }

        setUser(JSON.parse(storedUser));

        const fetchPods = async () => {
            try {
                const podsData = await podService.getUserPods();
                setPods(podsData.pods);
            } catch (error) {
                console.error('Failed to fetch pods:', error);
            }
        };

        fetchPods();
    }, [navigate]);

    if (!user) return null;

    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const todayStr = new Date().toLocaleDateString('en-US', dateOptions).toUpperCase();
    const firstName = user.name ? user.name.split(' ')[0] : 'Builder';

    // Mock Activity Feed (can be replaced with real backend data later)
    const activity = [
        { icon: GitCommitHorizontal, tone: 'sage', name: 'Sam Ortiz', action: 'committed to', target: 'feat/onboarding', detail: 'Add guided setup states', time: '8 min ago' },
        { icon: CircleCheck, tone: 'amber', name: 'Olivia Chen', action: 'completed', target: 'Define launch narrative', detail: '+120 points earned', time: '2 hours ago' },
        { icon: Trophy, tone: 'amber', name: 'Your Pod', action: 'unlocked', target: 'Momentum tier', detail: 'Team milestone reached', time: 'Yesterday' },
    ];

    return (
        <>
            <div className="dashboard-heading-row">
                <div>
                    <span className="section-label">{todayStr}</span>
                    <h1>Good morning, {firstName}.</h1>
                    <p>Here's what's moving across your Pods.</p>
                </div>
                {!user.githubId && (
                    <button className="v0-button dashboard-action" onClick={() => navigate('/auth?mode=connect_github')}>
                        <Code2 /> Connect GitHub
                    </button>
                )}
            </div>

            <div className="dashboard-summary">
                <div>
                    <span>Active pods</span>
                    <strong>{pods.length}</strong>
                    <small><span className="summary-up">Live</span> now</small>
                </div>
                <div>
                    <span>Tasks in progress</span>
                    <strong>—</strong>
                    <small>Loading...</small>
                </div>
                <div>
                    <span>Total points</span>
                    <strong>0</strong>
                    <small>Keep building</small>
                </div>
                <div>
                    <span>Pod rank</span>
                    <strong>—</strong>
                    <small>Join a pod to rank</small>
                </div>
            </div>

            <div className="dashboard-section-heading">
                <div>
                    <span className="section-label">YOUR WORKSPACES</span>
                    <h2>Active Pods</h2>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="text-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }} onClick={() => setIsExploreModalOpen(true)}>Explore</button>
                    <Link className="text-link" to="/create-pod">Create New <span>→</span></Link>
                </div>
            </div>

            {pods.length === 0 ? (
                <div style={{ border: '1px dashed var(--line)', padding: '50px', textAlign: 'center', borderRadius: '12px', marginTop: '20px' }}>
                    <p style={{ color: 'var(--muted-text)', fontSize: '14px', marginBottom: '15px' }}>You aren't participating in any Pods yet.</p>
                    <button className="v0-button" onClick={() => navigate('/create-pod')}>Create Workspace</button>
                </div>
            ) : (
                <div className="pods-grid" id="pods">
                    {pods.map((pod) => (
                        <article className="pod-card" key={pod.id} onClick={() => navigate(`/pod/${pod.id}`)} style={{ cursor: 'pointer' }}>
                            <div className="pod-card-top">
                                <div className="pod-icon"><Code2 /></div>
                                <button className="pod-more" aria-label={`More options for ${pod.name}`}>•••</button>
                            </div>
                            <span className="pod-kicker" style={{ color: pod.status === 'pending' ? 'var(--amber)' : 'var(--sage-dark)' }}>
                                {pod.status === 'pending' ? 'INVITED' : 'ACTIVE POD'}
                            </span>
                            <h3>{pod.name}</h3>
                            <p style={{ minHeight: '30px' }}>{pod.description || 'No description provided.'}</p>
                            
                            <div className="pod-progress-meta">
                                <span>Progress</span>
                                <strong>{pod.progress || 0}%</strong>
                            </div>
                            <div className="pod-progress">
                                <span style={{ width: `${pod.progress || 0}%` }} />
                            </div>
                            
                            <div className="pod-card-footer">
                                <AvatarStack members={pod.members?.map(m => m.user?.name ? m.user.name.split(' ').map((n: string) => n[0]).join('') : 'U') || ['U']} />
                                <span className="points-badge">+{pod.points || 0} pts</span>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            <div className="dashboard-lower-grid" id="activity">
                <section className="activity-panel">
                    <div className="dashboard-section-heading">
                        <div>
                            <span className="section-label">LIVE FROM YOUR PODS</span>
                            <h2>Recent activity</h2>
                        </div>
                        <button className="panel-filter">All activity <ChevronDown /></button>
                    </div>
                    <div className="activity-list">
                        {activity.map((item, idx) => { 
                            const Icon = item.icon; 
                            return (
                                <div className="activity-item" key={idx}>
                                    <div className={`activity-type ${item.tone}`}><Icon /></div>
                                    <div className="activity-copy">
                                        <p><strong>{item.name}</strong> {item.action} <b>{item.target}</b></p>
                                        <span>{item.detail}</span>
                                    </div>
                                    <time>{item.time}</time>
                                </div>
                            )
                        })}
                    </div>
                </section>
                
                <aside className="points-panel" id="rewards">
                    <div className="points-panel-orbit"><Trophy /></div>
                    <span className="section-label">YOUR REWARDS</span>
                    <h2>Keep the<br /><em>momentum.</em></h2>
                    <p>Earn points by committing code and completing tasks.</p>
                    <div className="tier-progress">
                        <div><span>Starter</span><strong>0 / 100</strong></div>
                        <div className="pod-progress"><span style={{ width: '0%' }} /></div>
                    </div>
                    <Link className="text-link" to="#">Explore rewards <span>→</span></Link>
                </aside>
            </div>

            <ExplorePodsModal isOpen={isExploreModalOpen} onClose={() => setIsExploreModalOpen(false)} />
        </>
    );
};

export default UserDashboard;
