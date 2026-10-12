import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Activity,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import '../pages/Landing.css';

function LogoMark() {
  return <span className="logo-mark" aria-hidden="true"><span /><span /><span /></span>
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const location = useLocation();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'User', email: '' };
  
  // Extract initials
  const initials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  const isActive = (path: string) => location.pathname === path;

  return (
    <main className="dashboard-shell">
      <header className="dashboard-topbar">
        <Link to="/" className="brand"><LogoMark /><span>OrbiVAI</span></Link>
        
        <div className="dashboard-search">
            <Search aria-hidden="true" />
            <input aria-label="Search your workspace" placeholder="Search your workspace..." />
            <kbd>⌘ K</kbd>
        </div>
        
        <div className="dashboard-top-actions">
            <button className="icon-button" aria-label="Notifications">
                <Bell />
                <span className="notification-dot" />
            </button>
            <button className="dashboard-profile" aria-label="Open profile menu">
                <span className="profile-avatar">{initials}</span>
                <span className="profile-name">{user?.name}</span>
                <ChevronDown />
            </button>
            <button className="mobile-nav-button icon-button" aria-label="Toggle navigation" onClick={() => setMobileNav(!mobileNav)}>
                {mobileNav ? <X /> : <Menu />}
            </button>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className={`dashboard-nav ${collapsed ? 'is-collapsed' : ''} ${mobileNav ? 'is-mobile-open' : ''}`}>
          <div className="dashboard-nav-section">
            <span className="dashboard-nav-label">WORKSPACE</span>
            <Link to="/dashboard" className={`dashboard-nav-link ${isActive('/dashboard') ? 'is-active' : ''}`}>
                <LayoutDashboard /><span>Overview</span>
            </Link>
            <Link to="/explore" className={`dashboard-nav-link ${isActive('/explore') ? 'is-active' : ''}`}>
                <Search /><span>Explore Pods</span>
            </Link>
            <Link to="#" className="dashboard-nav-link">
                <CheckCircle2 /><span>My Tasks</span>
            </Link>
            <Link to="#" className="dashboard-nav-link">
                <Activity /><span>Activity Feed</span>
            </Link>
            <Link to="#" className="dashboard-nav-link">
                <Trophy /><span>Rewards</span>
            </Link>
          </div>
          <div className="dashboard-nav-section dashboard-nav-secondary">
            <span className="dashboard-nav-label">ACCOUNT</span>
            <Link to="/profile" className={`dashboard-nav-link ${isActive('/profile') ? 'is-active' : ''}`}>
                <Users /><span>Profile</span>
            </Link>
            <Link to="#" className="dashboard-nav-link">
                <Settings /><span>Settings</span>
            </Link>
          </div>
          
          <div className="dashboard-nav-footer">
            <div className="nav-avatar">{initials}</div>
            <div className="nav-user-copy">
                <strong>{user?.name}</strong>
                <span>{user?.inferredRole || 'Builder'}</span>
            </div>
            <ChevronDown />
          </div>
          
          <button className="collapse-button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? <ChevronsRight /> : <ChevronsLeft />}
            <span>{collapsed ? 'Expand' : 'Collapse'}</span>
          </button>
        </aside>

        <section className="dashboard-content" id="overview">
          <Outlet />
        </section>
      </div>
    </main>
  );
}
