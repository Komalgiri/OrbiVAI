import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { githubService } from '../services/githubService';
import { Users, Settings, Activity, Trophy } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

interface UserProfileProps {
    embed?: boolean;
}

const UserProfile = ({ embed = false }: UserProfileProps) => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', location: '', website: '' });
    const [activeTab, setActiveTab] = useState('profile');

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
            } catch (error) {
                console.error("Failed to fetch profile", error);
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setProfileData({ user: JSON.parse(storedUser), pods: [], rewards: [], activities: [], totalPoints: 0, badgeCount: 0 });
                }
            } finally {
                setIsLoading(false);
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
            const result = await githubService.analyzeProfile();
            await userService.updateProfile({
                techStack: result.techStack,
                inferredRole: result.inferredRole,
                roleAnalysis: result.roleAnalysis
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
                    <span className="section-label">YOUR PROFILE</span>
                    <h1>Account Settings.</h1>
                    <p>Manage your identity, view your AI analysis, and see your reward history.</p>
                </div>
                {user.githubId && (
                    <button className="v0-button dashboard-action" onClick={handleRescanProfile} disabled={isAnalyzing}>
                        <FaGithub /> {isAnalyzing ? 'Analyzing...' : 'Rescan Profile'}
                    </button>
                )}
            </div>

            <div className="settings-layout">
                <div className="settings-tabs">
                    <a href="#" className={activeTab === 'profile' ? 'is-active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}><Users /> <span>Profile Details</span></a>
                    <a href="#" className={activeTab === 'activity' ? 'is-active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('activity'); }}><Activity /> <span>Activity & Pods</span></a>
                    <a href="#" className={activeTab === 'rewards' ? 'is-active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('rewards'); }}><Trophy /> <span>Rewards</span></a>
                </div>

                <div className="settings-card">
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

                                <div style={{ gridColumn: '1 / -1', padding: '20px', borderRadius: '10px', background: '#f7faf6', border: '1px solid var(--line)' }}>
                                    <h3 style={{ fontSize: '13px', color: 'var(--sage-dark)', marginBottom: '5px' }}>AI Profile Insights</h3>
                                    {user.roleAnalysis ? (
                                        <>
                                            <p style={{ fontSize: '12px', color: 'var(--muted-text)', fontStyle: 'italic', marginBottom: '10px' }}>"{user.roleAnalysis.reason}"</p>
                                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                {user.roleAnalysis.languages.map((lang: any) => (
                                                    <span key={lang.name} className="filter-pill">{lang.name} <b>{lang.percentage}%</b></span>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                            {(user.techStack || ['React', 'TypeScript']).map((tech: string) => (
                                                <span key={tech} className="filter-pill is-active">{tech}</span>
                                            ))}
                                        </div>
                                    )}
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

                    {activeTab === 'activity' && (
                        <>
                            <h2>Recent Activity</h2>
                            <p className="settings-muted mb-4">View your recent contributions and active pods.</p>
                            
                            <div className="activity-list" style={{ marginTop: '0', border: 'none', padding: '0' }}>
                                {activities.length === 0 ? <p className="settings-muted">No recent activity found.</p> : (
                                    activities.slice(0, 8).map((activity: any) => (
                                        <div className="activity-item" key={activity.id}>
                                            <div className="activity-type sage"><Activity /></div>
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

                    {activeTab === 'rewards' && (
                        <>
                            <h2>Rewards & Badges</h2>
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
                                <div className="milestone-icon" title="Gold Contributor" style={{ background: '#fcf0e9', color: 'var(--amber)' }}><Trophy /></div>
                                <div className="milestone-icon" title="Mentor" style={{ background: '#edf4eb', color: 'var(--sage-dark)' }}><Activity /></div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserProfile;
