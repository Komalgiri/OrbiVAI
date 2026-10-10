import { NavLink } from 'react-router-dom';
import { HiOutlineHome, HiOutlineCube, HiOutlineClipboardList, HiOutlineGlobeAlt, HiOutlineGift } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';

export default function Sidebar() {
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: HiOutlineHome },
        { name: 'My Pods', path: '/explore', icon: HiOutlineCube }, // Update with real path if needed
        { name: 'My Tasks', path: '/tasks', icon: HiOutlineClipboardList }, // Might not exist yet
        { name: 'GitHub Activity', path: '/github', icon: FaGithub },
        { name: 'Achievements', path: '/achievements', icon: HiOutlineGift }
    ];

    return (
        <aside className="w-60 bg-background border-r border-background-border h-screen flex flex-col fixed left-0 top-0">
            <div className="h-14 flex items-center px-6 border-b border-background-border/50">
                <span className="text-sm font-bold tracking-tight text-text-primary">OrbiVAI</span>
            </div>

            <nav className="flex-1 py-4 px-3 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                    ? 'bg-background-surface text-primary font-semibold shadow-sm border border-background-border/50'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-background-surface/50'
                                }`
                            }
                        >
                            <Icon className="w-4 h-4 opacity-70" />
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-background-border/50">
                <div className="flex items-center gap-3 px-2 py-1.5 cursor-pointer hover:bg-background-surface/50 rounded-md transition-colors">
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        U
                    </div>
                    <span className="text-sm font-medium text-text-secondary">Workspace</span>
                </div>
            </div>
        </aside>
    );
}
