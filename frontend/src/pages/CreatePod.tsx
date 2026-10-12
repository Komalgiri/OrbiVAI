import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { podService } from '../services/podService';
import { Code2 } from 'lucide-react';

const CreatePod = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        techStack: [] as string[],
        techStackInput: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/auth');
        }
    }, [navigate]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && formData.techStackInput.trim()) {
            e.preventDefault();
            if (!formData.techStack.includes(formData.techStackInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    techStack: [...prev.techStack, prev.techStackInput.trim()],
                    techStackInput: ''
                }));
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            techStack: prev.techStack.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await podService.createPod({
                name: formData.name,
                description: formData.description
            });
            navigate(`/pod/${response.pod.id}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGitHubConnect = () => {
        const token = localStorage.getItem('token');
        window.location.href = `http://localhost:5000/api/auth/github/login?token=${token}`;
    };

    if (!user) return null;

    return (
        <>
            <div className="dashboard-heading-row">
                <div>
                    <span className="section-label">NEW WORKSPACE</span>
                    <h1>Create a Pod.</h1>
                    <p>Set up your collaborative workspace and link your repository.</p>
                </div>
            </div>

            <div className="settings-layout" style={{ marginTop: '20px' }}>
                <div className="settings-tabs">
                    <a href="#" className="is-active"><Code2 /> <span>General</span></a>
                </div>

                <div className="settings-card">
                    <h2>Pod Details</h2>
                    <p className="settings-muted mb-4">Unique identifier for your project workspace.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="settings-form">
                            <label>
                                <strong>Pod Name</strong>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. quantum-engine-alpha"
                                />
                            </label>

                            <label style={{ gridColumn: '1 / -1' }}>
                                <strong>Description (Optional)</strong>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe what your Pod is about..."
                                    style={{ border: '1px solid var(--line)', borderRadius: '5px', padding: '11px', color: 'var(--ink)', font: 'inherit', fontSize: '12px', background: 'var(--cream)', resize: 'none' }}
                                />
                            </label>

                            <label style={{ gridColumn: '1 / -1' }}>
                                <strong>Tech Stack</strong>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                                    {formData.techStack.map(tag => (
                                        <span key={tag} className="filter-pill is-active" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {tag}
                                            <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', fontSize: '14px', color: 'var(--sage-dark)' }}>×</button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={formData.techStackInput}
                                    onChange={(e) => setFormData({ ...formData, techStackInput: e.target.value })}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Add tech stack tags and press Enter..."
                                />
                            </label>

                            <div style={{ gridColumn: '1 / -1', padding: '20px', borderRadius: '10px', background: user.githubId ? '#edf4eb' : 'white', border: `1px solid ${user.githubId ? '#d8e6d5' : 'var(--line)'}` }}>
                                <h3 style={{ fontSize: '15px', color: user.githubId ? 'var(--sage-dark)' : 'var(--ink)' }}>
                                    {user.githubId ? 'GitHub Connected' : 'GitHub Integration Required'}
                                </h3>
                                <p style={{ fontSize: '12px', color: 'var(--muted-text)', marginTop: '5px' }}>
                                    {user.githubId
                                        ? 'Your GitHub account is connected. You can now create your Pod.'
                                        : 'To ensure proper synchronization, every Pod must be connected to a GitHub repository. Please connect your GitHub account to proceed.'}
                                </p>
                                {!user.githubId && (
                                    <button
                                        type="button"
                                        onClick={handleGitHubConnect}
                                        style={{ marginTop: '15px', padding: '10px 15px', background: 'white', border: '1px solid var(--line)', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                    >
                                        Connect GitHub Account →
                                    </button>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div style={{ padding: '15px', background: '#fcf0e9', color: 'var(--amber)', fontSize: '12px', borderRadius: '8px', marginTop: '20px' }}>
                                {error}
                            </div>
                        )}

                        <div className="settings-footer">
                            <span style={{ cursor: 'pointer', color: 'var(--muted-text)' }} onClick={() => navigate('/dashboard')}>Cancel</span>
                            <button
                                type="submit"
                                disabled={isLoading || !user.githubId || !formData.name}
                                className="v0-button"
                                style={{ padding: '10px 20px', borderRadius: '6px', fontSize: '12px', cursor: (isLoading || !user.githubId || !formData.name) ? 'not-allowed' : 'pointer', opacity: (isLoading || !user.githubId || !formData.name) ? 0.5 : 1 }}
                            >
                                {isLoading ? 'Creating...' : 'Create Pod'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreatePod;
