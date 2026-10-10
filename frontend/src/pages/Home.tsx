import { useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Code2,
  GitBranch,
  Layers3,
  Menu,
  Sparkles,
  Trophy,
  X,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import './Landing.css'

const features = [
  { icon: Layers3, number: '01', title: 'Collaborative Pods', description: 'Focused workspaces where ideas, tasks, and your best work come together.', className: 'md:col-span-2' },
  { icon: GitBranch, number: '02', title: 'Deep GitHub Sync', description: 'Every commit and pull request, automatically organized around what matters.', className: '' },
  { icon: Sparkles, number: '03', title: 'AI-Powered Roadmaps', description: 'Turn ambitious goals into a clear, achievable path with Gemini AI.', className: '' },
  { icon: Trophy, number: '04', title: 'Developer Rewards', description: 'Make progress visible and celebrate the people moving your team forward.', className: 'md:col-span-2' },
]

function LogoMark() {
  return <span className="logo-mark" aria-hidden="true"><span /><span /><span /></span>
}

function DashboardMockup() {
  return (
    <div className="dashboard-wrap" aria-label="OrbiVAI product dashboard preview">
      <div className="dashboard-window">
        <div className="window-topbar">
          <div className="window-dots"><span /><span /><span /></div>
          <div className="window-url">app.orbivai.com / pods / launch-week</div>
          <div className="window-avatar">AR</div>
        </div>
        <div className="dashboard-body">
          <aside className="dashboard-sidebar">
            <div className="sidebar-brand"><LogoMark /><strong>OrbiVAI</strong></div>
            <div className="sidebar-label">WORKSPACE</div>
            <div className="sidebar-item active"><Layers3 /> Launch Week</div>
            <div className="sidebar-item"><Circle /> Product Hunt</div>
            <div className="sidebar-label">YOUR SPACE</div>
            <div className="sidebar-item"><Code2 /> My activity</div>
            <div className="sidebar-item"><Trophy /> Rewards</div>
            <div className="sidebar-bottom"><div className="mini-avatar">AM</div><span>Alex Morgan</span><ChevronDown /></div>
          </aside>
          <div className="dashboard-main">
            <div className="dashboard-heading"><div><div className="eyebrow">POD / LAUNCH WEEK</div><h3>Ship the new experience</h3></div><button className="invite-button">Invite <ArrowRight /></button></div>
            <div className="dashboard-stats"><div><span>Progress</span><strong>68%</strong><div className="progress"><i /></div></div><div><span>Contributors</span><strong>12</strong><small>+3 this week</small></div><div><span>Points earned</span><strong>2,480</strong><small className="amber-text">↑ 18.4%</small></div></div>
            <div className="roadmap-card"><div className="card-title"><div><Sparkles className="green-icon" /><strong>AI Roadmap</strong><span className="success-pill"><CheckCircle2 /> Generated</span></div><span className="muted">Updated just now</span></div><div className="roadmap-line"><div className="timeline-dot done"><Check /></div><div><strong>Define launch narrative</strong><span>Completed by Olivia · 2h ago</span></div><em>+120 pts</em></div><div className="roadmap-line"><div className="timeline-dot current"><span /></div><div><strong>Polish onboarding flow</strong><span>In progress · 3 subtasks</span></div><em>+80 pts</em></div><div className="roadmap-line"><div className="timeline-dot"><span /></div><div><strong>Share with the community</strong><span>Up next · 2 subtasks</span></div><em>+160 pts</em></div></div>
            <div className="activity-row"><div className="activity-icon"><Code2 /></div><div><strong>Sam committed to <span>feat/onboarding</span></strong><small>“Add guided setup states” · 8 min ago</small></div><div className="activity-badge">+40</div></div>
          </div>
        </div>
      </div>
      <div className="floating-notification"><div className="notification-icon"><Zap /></div><div><strong>Nice momentum!</strong><span>Pod is 24% faster this week</span></div><button aria-label="Dismiss notification"><X /></button></div>
    </div>
  )
}

function CommitFlow() {
  return <div className="flow-visual"><div className="flow-glow" /><div className="flow-card commit-card"><div className="flow-card-head"><div className="flow-icon github-icon"><Code2 /></div><div><span className="flow-kicker">GITHUB COMMIT</span><strong>feat: guided setup states</strong></div><span className="flow-time">8m</span></div><div className="commit-branch"><GitBranch /><span>alex/feat-onboarding</span><code>4f8a2c</code></div></div><div className="flow-connector"><span /><span /><span /></div><div className="flow-card task-card"><div className="task-check"><Check /></div><div><span className="flow-kicker">ROADMAP TASK · COMPLETED</span><strong>Polish onboarding flow</strong><span className="task-meta">3 / 3 subtasks complete</span></div><span className="task-points">+80 pts</span></div><div className="flow-caption"><CheckCircle2 /> Automatically checked off by OrbiVAI</div></div>
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  return <main className="site-shell">
    <nav className="site-nav">
      <Link to="/" className="brand"><LogoMark /><span>OrbiVAI</span></Link>
      <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
        <a href="#features">Product</a>
        <a href="#workflow">How it works</a>
        <a href="#rewards">Rewards</a>
        <Link to="/about">About</Link>
      </div>
      <div className="nav-actions">
        <Link to="/auth" className="signin">Sign in</Link>
        <Link to="/auth" className="v0-button button-small">Join the Pod <ArrowUpRight /></Link>
      </div>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        {menuOpen ? <X /> : <Menu />}
      </button>
    </nav>

    <section className="hero section-container" id="top">
      <div className="hero-copy">
        <div className="announcement"><span className="announcement-dot" /> The calm way to ship better <ArrowRight /></div>
        <h1>Always stay<br /><span>in-tune</span> with OrbiVAI.</h1>
        <p>Turn GitHub activity into AI-powered team execution. OrbiVAI keeps your engineers aligned, your roadmap clear, and your momentum visible.</p>
        <div className="hero-actions">
          <Link to="/auth" className="v0-button">Start building smarter <ArrowRight /></Link>
          <a href="#workflow" className="text-link">See how it works <span>↓</span></a>
        </div>
        <div className="hero-proof">
          <div className="proof-avatars"><span>AM</span><span>JL</span><span>RK</span><span>+2k</span></div>
          <div><strong>Trusted by 2,000+ builders</strong><small>Shipping with more clarity every day.</small></div>
        </div>
      </div>
      <DashboardMockup />
    </section>

    <section className="logo-strip section-container">
      <p>Integrated with the tools you love</p>
      <div className="logo-cloud">
        <span><Code2 /> GitHub</span>
        <span><span className="react-logo">◌</span> React</span>
        <span><span className="node-logo">⬡</span> Node.js</span>
        <span><span className="vercel-logo">▲</span> Vercel</span>
      </div>
    </section>

    <section className="features section-container" id="features">
      <div className="section-intro">
        <div><span className="section-label">THE ORBIVAI SYSTEM</span><h2>Everything your team needs<br /><span>to move as one.</span></h2></div>
        <p>Less status chasing. More meaningful work. OrbiVAI brings the whole picture into focus so your team can do its best work.</p>
      </div>
      <div className="feature-grid">
        {features.map(({ icon: Icon, number, title, description, className }) => 
          <article className={`feature-card ${className}`} key={title}>
            <div className="feature-top"><div className="feature-icon"><Icon /></div><span>{number}</span></div>
            <div><h3>{title}</h3><p>{description}</p></div>
            <ArrowUpRight className="feature-arrow" />
          </article>
        )}
      </div>
    </section>

    <section className="workflow section-container" id="workflow">
      <div className="workflow-copy">
        <span className="section-label">FROM COMMIT TO COMPLETION</span>
        <h2>Make progress<br /><span>feel effortless.</span></h2>
        <p>Connect the dots between the work happening in your repo and the goals your team is chasing. Every commit becomes a visible step forward.</p>
        <div className="workflow-list">
          <div><span>01</span><div><strong>Connect your GitHub</strong><small>Plug in your repos in under a minute.</small></div></div>
          <div><span>02</span><div><strong>Let AI map the path</strong><small>Turn big ideas into focused, actionable tasks.</small></div></div>
          <div><span>03</span><div><strong>Ship with your Pod</strong><small>Celebrate every win, together.</small></div></div>
        </div>
        <a href="#join" className="text-link dark-link">Explore the workflow <ArrowRight /></a>
      </div>
      <CommitFlow />
    </section>

    <section className="rewards section-container" id="rewards">
      <div className="section-intro">
        <div><span className="section-label">RECOGNITION THAT MOVES WITH YOU</span><h2>Reward the work<br /><span>behind the wins.</span></h2></div>
        <p>Make every contribution count. OrbiVAI turns meaningful progress into recognition your team can see, share, and celebrate.</p>
      </div>
      <div className="rewards-grid">
        <article className="reward-highlight">
          <div className="reward-orbit"><Trophy /></div>
          <span className="reward-kicker">POD MILESTONE</span>
          <h3>Ship together.<br />Celebrate together.</h3>
          <p>Unlock team rewards as your Pod reaches meaningful milestones, from first commit to launch day.</p>
          <a href="#join" className="text-link">See your potential <ArrowRight /></a>
        </article>
        <div className="reward-list">
          <div className="reward-row"><span className="reward-number">01</span><div><strong>Earn points for impact</strong><small>Commits, reviews, mentorship, and shipped work all add up.</small></div><b>+120</b></div>
          <div className="reward-row"><span className="reward-number">02</span><div><strong>Unlock new tiers</strong><small>Move from Starter to Momentum to Orbit as you grow.</small></div><b>LVL 03</b></div>
          <div className="reward-row"><span className="reward-number">03</span><div><strong>Share the spotlight</strong><small>Give teammates the recognition they deserve, right where work happens.</small></div><b>+40</b></div>
        </div>
      </div>
    </section>

    <section className="cta section-container" id="join">
      <div className="cta-pattern" />
      <div className="cta-content">
        <span className="section-label">YOUR NEXT CHAPTER</span>
        <h2>Build smarter.<br /><span>Ship together.</span></h2>
        <p>Join the teams turning their best ideas into their best work.</p>
        <Link to="/auth" className="v0-button">Join the Pod <ArrowRight /></Link>
      </div>
      <div className="cta-stats">
        <div><strong>2,000+</strong><span>active builders</span></div>
        <div><strong>42k</strong><span>tasks completed</span></div>
        <div><strong>4.9/5</strong><span>team satisfaction</span></div>
      </div>
    </section>

    <footer className="footer section-container" id="footer">
      <div className="footer-brand">
        <Link to="/" className="brand"><LogoMark /><span>OrbiVAI</span></Link>
        <p>The calm way to ship better.<br />Made for teams that care.</p>
      </div>
      <div className="footer-links">
        <div><strong>Product</strong><a href="#features">Features</a><a href="#workflow">How it works</a><a href="#rewards">Rewards</a></div>
        <div><strong>Resources</strong><a href="#docs">Documentation</a><a href="#changelog">Changelog</a><a href="#community">Community</a></div>
        <div><strong>Company</strong><Link to="/about">About us</Link><a href="#careers">Careers</a><a href="#contact">Contact</a></div>
      </div>
      <div className="footer-bottom">
        <span>© 2024 OrbiVAI, Inc.</span>
        <span>Built for the builders.</span>
        <div><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div>
      </div>
    </footer>
  </main>
}
