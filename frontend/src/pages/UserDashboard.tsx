import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { podService } from '../services/podService';
import ExplorePodsModal from '../components/ExplorePodsModal';

interface User {
    id: string;
    name: string;
    email: string;
}

interface Pod {
    id: string;
    name: string;
    role: string;
    status: string;
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

    return (
        <div className="flex flex-col h-full bg-background">
            <header className="px-10 pt-12 pb-6">
                <div className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-2">
                    Your Workspace
                </div>
                <h1 className="text-2xl font-semibold text-text-primary mb-1">
                    Good morning
                </h1>
                <p className="text-sm text-text-secondary">
                    Here's what's happening across your Pods.
                </p>
            </header>

            <div className="px-10 pb-10">
                <div className="grid grid-cols-4 gap-4 mb-10">
                    <div className="p-4 border border-background-border rounded-lg bg-background-surface">
                        <div className="text-xs font-medium text-text-secondary mb-1">Pods</div>
                        <div className="text-2xl text-text-primary">—</div>
                    </div>
                    <div className="p-4 border border-background-border rounded-lg bg-background-surface">
                        <div className="text-xs font-medium text-text-secondary mb-1">Open tasks</div>
                        <div className="text-2xl text-text-primary">—</div>
                    </div>
                    <div className="p-4 border border-background-border rounded-lg bg-background-surface">
                        <div className="text-xs font-medium text-text-secondary mb-1">In progress</div>
                        <div className="text-2xl text-text-primary">—</div>
                    </div>
                    <div className="p-4 border border-background-border rounded-lg bg-background-surface">
                        <div className="text-xs font-medium text-text-secondary mb-1">Completed</div>
                        <div className="text-2xl text-text-primary">—</div>
                    </div>
                </div>

                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-text-primary">Recent Pods</h2>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsExploreModalOpen(true)}
                            className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
                        >
                            Explore Pods
                        </button>
                        <button 
                            onClick={() => navigate('/create-pod')}
                            className="text-xs font-medium bg-primary text-white px-3 py-1.5 rounded hover:opacity-90 transition-opacity"
                        >
                            Create Pod
                        </button>
                    </div>
                </div>

                {pods.length === 0 ? (
                    <div className="border border-background-border border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center">
                        <div className="text-sm text-text-primary font-medium mb-1">No active pods</div>
                        <p className="text-xs text-text-secondary max-w-sm mb-4">
                            You aren't participating in any Pods yet. Create a new workspace or explore existing ones.
                        </p>
                        <button
                            onClick={() => navigate('/create-pod')}
                            className="text-xs font-medium bg-primary text-white px-4 py-2 rounded hover:opacity-90 transition-opacity"
                        >
                            Create Workspace
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pods.map(pod => (
                            <div 
                                key={pod.id}
                                onClick={() => navigate(`/pod/${pod.id}`)}
                                className="group p-4 rounded-lg border border-background-border bg-background-surface hover:border-primary/50 cursor-pointer transition-all"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-semibold text-text-primary">{pod.name}</h3>
                                    {pod.status === 'pending' && (
                                        <span className="text-[10px] bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded font-medium">
                                            Invited
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-text-secondary capitalize mb-4">
                                    Role: {pod.role}
                                </div>
                                <div className="pt-3 border-t border-background-border/50 flex items-center justify-between">
                                    <span className="text-[10px] text-text-secondary group-hover:text-primary transition-colors">
                                        Open workspace →
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <ExplorePodsModal isOpen={isExploreModalOpen} onClose={() => setIsExploreModalOpen(false)} />
        </div>
    );
};

export default UserDashboard;
