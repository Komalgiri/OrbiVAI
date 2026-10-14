import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { githubService, type DeveloperIntelligenceData } from '../services/githubService';
import { DeveloperIntelligenceDossier } from '../components/DeveloperIntelligenceDossier';
import {
    FaUser,
    FaChartLine,
    FaTrophy,
    FaBrain,
    FaGithub,
    FaShareNodes
} from 'react-icons/fa6';
import { HiOutlineSparkles } from 'react-icons/hi2';

interface UserProfileProps {
    embed?: boolean;
}

const UserProfile = ({ embed = false }: UserProfileProps) => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<any>(null);
    const [intelligenceData, setIntelligenceData] = useState<DeveloperIntelligenceData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isIntelligenceLoading, setIsIntelligenceLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', location: '', website: '' });
    const [activeTab, setActiveTab] = useState('intelligence');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userService.getProfile();
                setProfileData(data);
                setEditForm({
                    name: data.user.name || '',
                    location: data.user.location || 'Remote',
                    website: data.user.website || 'orbivai.com'
                });

                // Load intelligence dossier for user
                const targetUser = data.user.githubUsername || data.user.githubId || 'Komalgiri';
                loadIntelligence(targetUser);
            } catch (error) {
                console.error("Failed to fetch profile", error);
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsed = JSON.parse(storedUser);
                    setProfileData({ user: parsed, pods: [], rewards: [], activities: [], totalPoints: 0, badgeCount: 0 });
                    loadIntelligence(parsed.githubUsername || parsed.githubId || 'Komalgiri');
                }
            } finally {
                setIsLoading(false);
            }
        };

        const loadIntelligence = async (userHandle: string) => {
            setIsIntelligenceLoading(true);
            try {
                const result = await githubService.getIntelligence(userHandle);
                setIntelligenceData(result);
            } catch (e) {
                console.warn("Could not load intelligence:", e);
            } finally {
                setIsIntelligenceLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (isLoading) return <div style={{ padding: '50px', textAlign: 'center', color: 'var(--muted-text)' }}>Loading profile...</div>;
    if (!profileData) return null;

    const { user, pods = [], totalPoints = 0, activities = [], badgeCount = 0 } = profileData;
    const initials = user?.name ? user.name.split(' ').map((n: string) => n.charAt(0)).join('').substring(0, 2).toUpperCase() : 'U';

    const handleEditProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await userService.updateProfile({ name: editForm.name });
            const data = await userService.getProfile();
            setProfileData(data);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    const handleRescanProfile = async () => {
        setIsAnalyzing(true);
        try {
            const result = await githubService.getIntelligence(user.githubUsername || user.githubId);
            setIntelligenceData(result);
            await userService.updateProfile({
                techStack: result.languageDistribution.map(l => l.name).slice(0, 10),
                inferredRole: result.aiIntelligence?.archetype,
                roleAnalysis: result.aiIntelligence
            });
            const data = await userService.getProfile();
            setProfileData(data);
        } catch (error) {
            console.error("Failed to rescan profile", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <>
            <div className="dashboard-heading-row">
                <div>
                    <span className="section-label">YOUR PROFILE &amp; INTELLIGENCE</span>
                    <h1>Account Settings.</h1>
                    <p>Manage your identity, view your AI analysis, and track your developer DNA.</p>
                </div>
                {user.githubId && (
                    <button className="v0-button dashboard-action" onClick={handleRescanProfile} disabled={isAnalyzing}>
                        <FaGithub /> {isAnalyzing ? 'Analyzing DNA...' : 'Rescan Profile'}
                    </button>
                )}
            </div>

            <div className="settings-layout">
                <div className="settings-tabs">
                    <a href="#" className={activeTab === 'intelligence' ? 'is-active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('intelligence'); }}>
                        <FaBrain /> <span>Developer DNA</span>
                    </a>
                    <a href="#" className={activeTab === 'profile' ? 'is-active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}>
                        <FaUser /> <span>Profile Details</span>
                    </a>
                    <a href="#" className={activeTab === 'activity' ? 'is-active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('activity'); }}>
                        <FaChartLine /> <span>Activity &amp; Pods</span>
                    </a>
                    <a href="#" className={activeTab === 'rewards' ? 'is-active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('rewards'); }}>
                        <FaTrophy /> <span>Rewards</span>
                    </a>
                </div>

                <div className="settings-card">
                    {/* 1. Developer DNA Intelligence Tab */}
                    {activeTab === 'intelligence' && (
                        <div>
                            {isIntelligenceLoading ? (
                                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #edf4eb', borderTopColor: 'var(--sage)', animation: 'spin 0.9s linear infinite', margin: '0 auto 16px' }} />
                                    <strong style={{ fontSize: '15px' }}>Loading your GitHub Technical DNA...</strong>
                                </div>
                            ) : intelligenceData ? (
                                <DeveloperIntelligenceDossier
                                    data={intelligenceData}
                                    onRefresh={handleRescanProfile}
                                    isRefreshing={isAnalyzing}
                                    compact={false}
                                />
                            ) : (
                                <div style={{ padding: '40px', textAlign: 'center' }}>
                                    <p>Connect your GitHub account to uncover your behavioral patterns and technical DNA with AI.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 2. Profile Details Tab */}
                    {activeTab === 'profile' && (
                        <>
                            <h2>Profile Details</h2>
                            <p className="settings-muted">Update your personal information and view your AI-inferred role.</p>

                            <div className="settings-avatar-row">
                                <div className="profile-avatar" style={{ width: '56px', height: '56px', fontSize: '18px' }}>{initials}</div>
                                <div>
                                    <strong style={{ display: 'block', fontSize: '15px' }}>{user.name}</strong>
                                    <span style={{ color: 'var(--muted-text)', fontSize: '11px' }}>@{user.githubId || 'username'} • {user.inferredRole || 'Developer'}</span>
                                </div>
                            </div>

                            <form onSubmit={handleEditProfile} className="settings-form">
                                <label>
                                    <strong>Full Name</strong>
                                    <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} disabled={!isEditing} />
                                </label>
                                <label>
                                    <strong>Location</strong>
                                    <input type="text" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} disabled={!isEditing} />
                                </label>
                                <label style={{ gridColumn: '1 / -1' }}>
                                    <strong>Email Address</strong>
                                    <input type="email" value={user.email} disabled />
                                </label>

                                <div style={{ gridColumn: '1 / -1', padding: '20px', borderRadius: '10px', background: '#f7faf6', border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ fontSize: '13px', color: 'var(--sage-dark)', marginBottom: '4px' }}>AI Technical DNA Ready</h3>
                                        <p style={{ fontSize: '12px', color: 'var(--muted-text)', margin: 0 }}>
                                            Developer Score, Archetype, Language Distribution, and Recruiter Outlook are available.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('intelligence')}
                                        className="v0-button"
                                        style={{ fontSize: '11px', padding: '8px 14px' }}
                                    >
                                        <FaBrain /> View Dossier
                                    </button>
                                </div>

                                <div className="settings-footer" style={{ gridColumn: '1 / -1' }}>
                                    <span style={{ color: 'var(--muted-text)' }}>Last updated recently</span>
                                    {isEditing ? (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <span style={{ cursor: 'pointer', padding: '10px' }} onClick={() => setIsEditing(false)}>Cancel</span>
                                            <button type="submit" className="v0-button" style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '11px' }}>Save Changes</button>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => setIsEditing(true)} className="v0-button" style={{ background: 'white', color: 'var(--ink)', border: '1px solid var(--line)', padding: '8px 16px', borderRadius: '6px', fontSize: '11px' }}>Edit Profile</button>
                                    )}
                                </div>
                            </form>
                        </>
                    )}

                    {/* 3. Activity & Pods Tab */}
                    {activeTab === 'activity' && (
                        <>
                            <h2>Recent Activity</h2>
                            <p className="settings-muted mb-4">View your recent contributions and active pods.</p>
                            
                            <div className="activity-list" style={{ marginTop: '0', border: 'none', padding: '0' }}>
                                {activities.length === 0 ? <p className="settings-muted">No recent activity found.</p> : (
                                    activities.slice(0, 8).map((activity: any) => (
                                        <div className="activity-item" key={activity.id}>
                                            <div className="activity-type sage"><FaChartLine /></div>
                                            <div className="activity-copy">
                                                <p><strong>{(activity.type || 'unknown').replace('_', ' ')}</strong> in <b>{activity.meta?.repoName || 'repository'}</b></p>
                                                <span>{activity.meta?.message || 'Activity synchronized from GitHub.'}</span>
                                            </div>
                                            <time>{new Date(activity.createdAt).toLocaleDateString()}</time>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}

                    {/* 4. Rewards Tab */}
                    {activeTab === 'rewards' && (
                        <>
                            <h2>Rewards &amp; Badges</h2>
                            <p className="settings-muted mb-4">Track your earned points and achievements.</p>
                            
                            <div className="reward-balance-card" style={{ marginBottom: '20px' }}>
                                <p>Total Points Earned</p>
                                <strong>{totalPoints.toLocaleString()} <small>PTS</small></strong>
                                <div className="reward-balance-meta">
                                    <span>Rank: <b>#08</b> in Network</span>
                                    <span>Top 10% of Builders</span>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '14px', marginTop: '30px', marginBottom: '15px' }}>Earned Badges ({badgeCount})</h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className="milestone-icon" title="Gold Contributor" style={{ background: '#fcf0e9', color: 'var(--amber)' }}><FaTrophy /></div>
                                <div className="milestone-icon" title="Mentor" style={{ background: '#edf4eb', color: 'var(--sage-dark)' }}><FaChartLine /></div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserProfile;
