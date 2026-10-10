import { ArrowRight, CheckCircle2, GitBranch, Heart, Sparkles, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Landing.css'

function LogoMark() {
  return <span className="logo-mark" aria-hidden="true"><span /><span /><span /></span>
}

export default function About() {
  return <main className="site-shell about-page">
    <nav className="site-nav">
      <Link to="/" className="brand"><LogoMark /><span>OrbiVAI</span></Link>
      <div className="nav-links">
        <Link to="/#features">Product</Link>
        <Link to="/#workflow">How it works</Link>
        <Link to="/#rewards">Rewards</Link>
        <Link to="/about">About</Link>
      </div>
      <div className="nav-actions">
        <a href="#story" className="signin">Our story</a>
        <Link to="/auth" className="v0-button button-small">Join the Pod <ArrowRight /></Link>
      </div>
    </nav>

    <section className="about-hero section-container">
      <div>
        <span className="section-label">THE ORBIVAI STORY</span>
        <h1>Built for the people<br /><span>behind the progress.</span></h1>
        <p>OrbiVAI started with a simple belief: great work feels better when everyone can see how their contribution moves the team forward.</p>
        <a href="#story" className="v0-button">Read our story <ArrowRight /></a>
      </div>
      <div className="about-hero-card">
        <div className="about-card-icon"><Heart /></div>
        <span>OUR NORTH STAR</span>
        <strong>Make meaningful work<br />feel <em>visible.</em></strong>
        <small>Since day one · 2024</small>
      </div>
    </section>

    <section className="about-story section-container" id="story">
      <div className="about-story-intro">
        <span className="section-label">HOW WE STARTED</span>
        <h2>From a messy<br /><span>Monday morning.</span></h2>
      </div>
      <div className="about-story-copy">
        <p>We were a small team shipping quickly, but spending too much time asking what was happening instead of doing the work. Progress was scattered across commits, standups, and spreadsheets.</p>
        <p>So we built the layer we wished we had: a calm, shared view of the work that connects the dots between a GitHub commit, a roadmap goal, and the people who made it happen.</p>
        <p>That little internal tool became OrbiVAI. Today, we are building it for every team that wants to move with more clarity and celebrate the work along the way.</p>
      </div>
    </section>

    <section className="about-values section-container">
      <span className="section-label">WHAT WE BELIEVE</span>
      <div className="values-grid">
        <article>
          <GitBranch />
          <h3>Progress is a team sport.</h3>
          <p>The best work happens when people can see how their effort connects.</p>
        </article>
        <article>
          <Sparkles />
          <h3>Clarity creates momentum.</h3>
          <p>AI should remove noise and give teams a better next step.</p>
        </article>
        <article>
          <Trophy />
          <h3>Every win deserves a moment.</h3>
          <p>Recognition is not a distraction from the work. It is fuel for it.</p>
        </article>
      </div>
    </section>

    <section className="about-join section-container">
      <CheckCircle2 />
      <div>
        <span className="section-label">COME BUILD WITH US</span>
        <h2>The next chapter<br /><span>is yours too.</span></h2>
      </div>
      <Link to="/auth" className="v0-button">Join the Pod <ArrowRight /></Link>
    </section>

    <footer className="footer section-container">
      <div className="footer-brand">
        <Link to="/" className="brand"><LogoMark /><span>OrbiVAI</span></Link>
        <p>The calm way to ship better.<br />Made for teams that care.</p>
      </div>
      <div className="footer-bottom">
        <span>© 2024 OrbiVAI, Inc.</span>
        <span>Built for the builders.</span>
        <div><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div>
      </div>
    </footer>
  </main>
}
