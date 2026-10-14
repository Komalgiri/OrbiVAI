import { useState } from 'react'
import {
  FaArrowRight,
  FaCheck,
  FaCircleCheck,
  FaChevronDown,
  FaCircle,
  FaCode,
  FaCodeBranch,
  FaLayerGroup,
  FaBars,
  FaXmark,
  FaTrophy,
  FaBolt,
  FaBrain,
  FaGithub,
  FaStar,
  FaShieldHalved,
  FaLocationDot,
  FaUsers,
  FaArrowTrendUp,
  FaRocket,
  FaLightbulb,
  FaSquareCheck,
  FaUser,
  FaUserPlus,
  FaClipboardCheck
} from 'react-icons/fa6'
import { HiOutlineSparkles, HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2'
import { Link, useNavigate } from 'react-router-dom'
import './Landing.css'

interface IntelligenceTouchpoint {
  id: string
  kicker: string
  title: string
  description: string
  icon: any
  badge: string
  previewTitle: string
  previewSubtitle: string
  previewTags: string[]
  route: string
}

const intelligenceTouchpoints: IntelligenceTouchpoint[] = [
  {
    id: 'personal',
    kicker: 'PERSONAL PROFILE & CAREER HUB',
    title: 'Your Personal Technical DNA',
    description: 'Inspect your own deterministic Developer Score (0-100), byte-weighted language distributions, and AI-curated strategic growth tips right from your personal profile.',
    icon: FaUser,
    badge: 'Personal View',
    previewTitle: 'Komal giri (@Komalgiri)',
    previewSubtitle: 'Score: 39/100 • The Pragmatic Full-Stack Builder • 3.9 Years Active',
    previewTags: ['38 Repos (37 Source)', 'JavaScript 54%', '3 Growth Tips', 'Recruiter Outlook'],
    route: '/profile'
  },
  {
    id: 'invite',
    kicker: 'POD RECRUITING & TALENT SCOUT',
    title: 'Invite Members with AI Synergy',
    description: 'Search any GitHub handle when expanding your Pod. The AI Talent Scout evaluates candidate repositories and reveals synergy match before you send an invite.',
    icon: FaUserPlus,
    badge: 'Invite Member',
    previewTitle: 'Candidate Dossier Preview',
    previewSubtitle: 'Pod Synergy Match: 94% • High Velocity Committer',
    previewTags: ['React & Firebase DNA', '0.4 Stars/Repo', 'Deterministic Match', '1-Click Invite'],
    route: '/explore'
  },
  {
    id: 'requests',
    kicker: 'JOIN REQUEST APPLICANT REVIEW',
    title: '1-Click Applicant Dossier',
    description: 'No more guessing who to accept into your Pod. Review incoming join requests with instantaneous 1-click dossiers covering archetypes, velocity, and recruiter outlooks.',
    icon: FaClipboardCheck,
    badge: 'Pod Join Requests',
    previewTitle: 'Pending Join Request Review',
    previewSubtitle: 'Applicant: @Komalgiri • Verified Full-Stack Footprint',
    previewTags: ['1-Click DNA Inspect', 'Tenure: 3.9 Years', 'Accept / Reject Decision', 'Audit Trail'],
    route: '/explore'
  },
  {
    id: 'tasks',
    kicker: 'SMART TASK ALLOCATION',
    title: 'AI Task-to-Engineer Matching',
    description: 'Assign complex features and issues to the right pod member automatically based on their verified language footprints and demonstrated architectural strengths.',
    icon: FaBolt,
    badge: 'Task Board',
    previewTitle: 'Smart Task Auto-Match',
    previewSubtitle: 'Task: Build Gemini AI Endpoint • Recommended: Komal giri',
    previewTags: ['Full-Stack Synergy', 'Optimal Skill Alignment', 'Zero Guesswork', 'Live Velocity'],
    route: '/explore'
  }
]

const features = [
  { icon: FaLayerGroup, number: '01', title: 'Collaborative Pods', description: 'Focused workspaces where ideas, tasks, and your best work come together.', className: 'md:col-span-2' },
  { icon: FaCodeBranch, number: '02', title: 'Deep GitHub Sync', description: 'Every commit and pull request, automatically organized around what matters.', className: '' },
  { icon: HiOutlineSparkles, number: '03', title: 'AI-Powered Roadmaps', description: 'Turn ambitious goals into a clear, achievable path with Gemini AI.', className: '' },
  { icon: FaBrain, number: '04', title: 'GitHub Analytics Intelligence', description: 'Uncover deep behavioral patterns, deterministic Developer Scores (0-100), and AI technical DNA.', className: '' },
  { icon: FaTrophy, number: '05', title: 'Developer Rewards & Milestones', description: 'Make progress visible and celebrate the people moving your team forward.', className: 'md:col-span-2' },
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
            <div className="sidebar-item active"><FaLayerGroup /> Launch Week</div>
            <div className="sidebar-item"><FaCircle /> Product Hunt</div>
            <div className="sidebar-label">YOUR SPACE</div>
            <div className="sidebar-item"><FaCode /> My activity</div>
            <div className="sidebar-item"><FaTrophy /> Rewards</div>
            <div className="sidebar-bottom"><div className="mini-avatar">AM</div><span>Alex Morgan</span><FaChevronDown /></div>
          </aside>
          <div className="dashboard-main">
            <div className="dashboard-heading"><div><div className="eyebrow">POD / LAUNCH WEEK</div><h3>Ship the new experience</h3></div><button className="invite-button">Invite <FaArrowRight /></button></div>
            <div className="dashboard-stats"><div><span>Progress</span><strong>68%</strong><div className="progress"><i /></div></div><div><span>Contributors</span><strong>12</strong><small>+3 this week</small></div><div><span>Points earned</span><strong>2,480</strong><small className="amber-text">↑ 18.4%</small></div></div>
            <div className="roadmap-card"><div className="card-title"><div><HiOutlineSparkles className="green-icon" /><strong>AI Roadmap</strong><span className="success-pill"><FaCircleCheck /> Generated</span></div><span className="muted">Updated just now</span></div><div className="roadmap-line"><div className="timeline-dot done"><FaCheck /></div><div><strong>Define launch narrative</strong><span>Completed by Olivia · 2h ago</span></div><em>+120 pts</em></div><div className="roadmap-line"><div className="timeline-dot current"><span /></div><div><strong>Polish onboarding flow</strong><span>In progress · 3 subtasks</span></div><em>+80 pts</em></div><div className="roadmap-line"><div className="timeline-dot"><span /></div><div><strong>Share with the community</strong><span>Up next · 2 subtasks</span></div><em>+160 pts</em></div></div>
            <div className="activity-row"><div className="activity-icon"><FaCode /></div><div><strong>Sam committed to <span>feat/onboarding</span></strong><small>“Add guided setup states” · 8 min ago</small></div><div className="activity-badge">+40</div></div>
          </div>
        </div>
      </div>
      <div className="floating-notification"><div className="notification-icon"><FaBolt /></div><div><strong>Nice momentum!</strong><span>Pod is 24% faster this week</span></div><button aria-label="Dismiss notification"><FaXmark /></button></div>
    </div>
  )
}

function CommitFlow() {
  return <div className="flow-visual"><div className="flow-glow" /><div className="flow-card commit-card"><div className="flow-card-head"><div className="flow-icon github-icon"><FaCode /></div><div><span className="flow-kicker">GITHUB COMMIT</span><strong>feat: guided setup states</strong></div><span className="flow-time">8m</span></div><div className="commit-branch"><FaCodeBranch /><span>alex/feat-onboarding</span><code>4f8a2c</code></div></div><div className="flow-connector"><span /><span /><span /></div><div className="flow-card task-card"><div className="task-check"><FaCheck /></div><div><span className="flow-kicker">ROADMAP TASK · COMPLETED</span><strong>Polish onboarding flow</strong><span className="task-meta">3 / 3 subtasks complete</span></div><span className="task-points">+80 pts</span></div><div className="flow-caption"><FaCircleCheck /> Automatically checked off by OrbiVAI</div></div>
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scannerInput, setScannerInput] = useState('')
  const [selectedTouchpointId, setSelectedTouchpointId] = useState<string>('personal')
  const navigate = useNavigate()

  const currentTouchpoint = intelligenceTouchpoints.find(t => t.id === selectedTouchpointId) || intelligenceTouchpoints[0]

  return <main className="site-shell">
    <nav className="site-nav">
      <Link to="/" className="brand"><LogoMark /><span>OrbiVAI</span></Link>
      <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
        <a href="#features">Product</a>
        <a href="#intelligence-everywhere">Developer Intelligence</a>
        <a href="#workflow">How it works</a>
        <a href="#rewards">Rewards</a>
        <Link to="/analytics">Live Scanner</Link>
        <Link to="/about">About</Link>
      </div>
      <div className="nav-actions">
        <Link to="/auth" className="signin">Sign in</Link>
        <Link to="/auth" className="v0-button button-small">Join the Pod <HiOutlineArrowTopRightOnSquare /></Link>
      </div>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        {menuOpen ? <FaXmark /> : <FaBars />}
      </button>
    </nav>

    <section className="hero section-container" id="top">
      <div className="hero-copy">
        <div className="announcement"><span className="announcement-dot" /> The calm way to ship better <FaArrowRight /></div>
        <h1>Always stay<br /><span>in-tune</span> with OrbiVAI.</h1>
        <p>Turn GitHub activity into AI-powered team execution. OrbiVAI keeps your engineers aligned, your roadmap clear, and your momentum visible.</p>
        <div className="hero-actions">
          <Link to="/auth" className="v0-button">Start building smarter <FaArrowRight /></Link>
          <a href="#workflow" className="text-link">See how it works <span>↓</span></a>
        </div>
        <div className="hero-proof">
          <div className="proof-avatars"><span>AM</span><span>JL</span><span>RK</span><span>+2k</span></div>
          <div><strong>Trusted by 2,000+ builders</strong><small>Shipping with more clarity every day.</small></div>
        </div>
      </div>
      <DashboardMockup />
    </section>

    {/* 🧠 Developer Intelligence Across CodePods (Personal, Invite Member, Requests, Tasks) */}
    <section className="section-container" id="intelligence-everywhere" style={{ margin: '40px auto 70px' }}>
      <div
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f9fbf8 100%)',
          border: '1px solid #dbe6d9',
          borderRadius: '20px',
          padding: '44px clamp(20px, 4vw, 54px)',
          boxShadow: '0 20px 60px rgba(120, 155, 115, 0.08)',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '780px', margin: '0 auto 32px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px', background: '#edf4eb', border: '1px solid #dce8da', padding: '5px 14px', borderRadius: '99px' }}>
            <FaBrain style={{ color: 'var(--sage-dark)', fontSize: '13px' }} />
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--sage-dark)' }}>
              AI DEVELOPER INTELLIGENCE
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.05em', margin: '0 0 14px', lineHeight: 1.15 }}>
            One technical DNA engine.<br />
            <span style={{ color: 'var(--sage)' }}>Connected everywhere you collaborate.</span>
          </h2>

          <p style={{ color: 'var(--muted-text)', fontSize: '15px', lineHeight: 1.6, margin: '0 auto', maxWidth: '640px' }}>
            From your personal career hub to member invites, pod join requests, and task auto-matching—see how developer intelligence powers every step of team building.
          </p>
        </div>

        {/* 4 Interactive Touchpoint Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '10px',
            marginBottom: '30px'
          }}
        >
          {intelligenceTouchpoints.map((t) => {
            const isSelected = selectedTouchpointId === t.id
            const Icon = t.icon
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTouchpointId(t.id)}
                style={{
                  background: isSelected ? 'white' : '#f8faf7',
                  border: isSelected ? '2px solid var(--sage)' : '1px solid var(--line)',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 8px 24px rgba(120, 155, 115, 0.12)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isSelected ? '#edf4eb' : '#f0f3ef',
                      color: isSelected ? 'var(--sage-dark)' : 'var(--muted-text)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '14px'
                    }}
                  >
                    <Icon />
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      background: isSelected ? '#edf4eb' : 'transparent',
                      color: isSelected ? 'var(--sage-dark)' : 'var(--muted-text)',
                      padding: '2px 8px',
                      borderRadius: '99px'
                    }}
                  >
                    {t.badge}
                  </span>
                </div>
                <strong style={{ fontSize: '13px', display: 'block', color: 'var(--ink)' }}>{t.title}</strong>
              </button>
            )
          })}
        </div>

        {/* Selected Touchpoint Spotlight Card */}
        <div
          style={{
            background: 'white',
            border: '1px solid #dce8da',
            borderRadius: '16px',
            padding: 'clamp(20px, 3vw, 36px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            alignItems: 'center',
            boxShadow: '0 12px 36px rgba(0,0,0,0.03)',
            marginBottom: '32px'
          }}
        >
          <div>
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--sage-dark)', display: 'block', marginBottom: '6px' }}>
              {currentTouchpoint.kicker}
            </span>
            <h3 style={{ margin: '0 0 12px', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.04em' }}>
              {currentTouchpoint.title}
            </h3>
            <p style={{ margin: '0 0 20px', color: 'var(--muted-text)', fontSize: '14px', lineHeight: 1.6 }}>
              {currentTouchpoint.description}
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link
                to="/analytics"
                className="v0-button"
                style={{ padding: '10px 18px', fontSize: '12px' }}
              >
                <HiOutlineSparkles /> Open Live DNA Scanner <FaArrowRight />
              </Link>
              <Link
                to={currentTouchpoint.route}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  border: '1px solid var(--line)',
                  borderRadius: '7px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  textDecoration: 'none',
                  background: 'white'
                }}
              >
                View Feature Area <HiOutlineArrowTopRightOnSquare />
              </Link>
            </div>
          </div>

          {/* Interactive Feature Mockup Pill Box */}
          <div
            style={{
              background: '#f8faf7',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '22px',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--sage)' }} />
                <strong style={{ fontSize: '13px' }}>{currentTouchpoint.previewTitle}</strong>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, background: '#edf4eb', color: 'var(--sage-dark)', padding: '2px 8px', borderRadius: '99px' }}>
                Live Integration
              </span>
            </div>

            <p style={{ margin: '0 0 14px', fontSize: '12px', color: 'var(--muted-text)', lineHeight: 1.5 }}>
              {currentTouchpoint.previewSubtitle}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {currentTouchpoint.previewTags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: 'white',
                    border: '1px solid #dce8da',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--ink)'
                  }}
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Direct Scanner Quick Bar */}
        <div
          style={{
            background: 'white',
            border: '1px solid var(--line)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaGithub style={{ fontSize: '20px', color: 'var(--ink)' }} />
            <div>
              <strong style={{ fontSize: '13px', display: 'block' }}>Want to scan any GitHub developer directly?</strong>
              <span style={{ fontSize: '11px', color: 'var(--muted-text)' }}>
                Inspect scores (0-100), AI archetypes, language bars, and recruiter dossiers in seconds.
              </span>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const clean = scannerInput.trim().replace(/^@/, '');
              if (clean) navigate(`/u/${encodeURIComponent(clean)}`);
              else navigate('/analytics');
            }}
            style={{ display: 'flex', gap: '8px', flex: '1 1 300px', maxWidth: '420px' }}
          >
            <input
              type="text"
              placeholder="e.g. Komalgiri"
              value={scannerInput}
              onChange={(e) => setScannerInput(e.target.value)}
              style={{
                border: '1px solid var(--line)',
                borderRadius: '7px',
                padding: '8px 12px',
                fontSize: '12px',
                outline: 0,
                flex: 1
              }}
            />
            <button
              type="submit"
              className="v0-button"
              style={{ padding: '8px 16px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Analyze Profile <FaArrowRight />
            </button>
          </form>
        </div>
      </div>
    </section>

    <section className="logo-strip section-container">
      <p>Integrated with the tools you love</p>
      <div className="logo-cloud">
        <span><FaCode /> GitHub</span>
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
            <HiOutlineArrowTopRightOnSquare className="feature-arrow" />
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
          <div><span>02</span><div><strong>Synthesize Developer DNA</strong><small>Compute deterministic scores, language distributions &amp; AI strengths.</small></div></div>
          <div><span>03</span><div><strong>Let AI map the path</strong><small>Turn big ideas into focused, actionable tasks.</small></div></div>
          <div><span>04</span><div><strong>Ship with your Pod</strong><small>Auto-match tasks &amp; celebrate every win, together.</small></div></div>
        </div>
        <a href="#analytics-intelligence" className="text-link dark-link">Explore the workflow <FaArrowRight /></a>
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
          <div className="reward-orbit"><FaTrophy /></div>
          <span className="reward-kicker">POD MILESTONE</span>
          <h3>Ship together.<br />Celebrate together.</h3>
          <p>Unlock team rewards as your Pod reaches meaningful milestones, from first commit to launch day.</p>
          <a href="#join" className="text-link">See your potential <FaArrowRight /></a>
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
        <Link to="/auth" className="v0-button">Join the Pod <FaArrowRight /></Link>
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
