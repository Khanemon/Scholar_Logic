import { useState } from "react";
import "../styles/home.css";

// ── Icons ──────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const BookmarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const ExternalIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const DocIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const EyeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const DotIcon = () => (
  <span style={{ color: "#4caf50", fontSize: 10 }}>●</span>
);

// ── Data ───────────────────────────────────────────────────────────────────
const recentPapers = [
  {
    title: "Climate Adaptation Strategies in Sub-Saharan Coastal Cities",
    field: "Environmental Science",
    uploaded: "2 hours ago",
    views: "428 Views",
    downloads: "12 Downloads",
  },
  {
    title: "Polycrystalline Thin-Film Solar Cells: Efficiency Limits",
    field: "Materials Engineering",
    uploaded: "5 hours ago",
    views: "1.2k Views",
    downloads: "89 Downloads",
  },
  {
    title: "Linguistic Drift in Decentralized Digital Communities",
    field: "Sociology",
    uploaded: "8 hours ago",
    views: "94 Views",
    downloads: "4 Downloads",
  },
];

// ── Component ──────────────────────────────────────────────────────────────
export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <div className="sl-root">

      {/* ── Navbar ── */}
      <nav className="sl-nav">
        <span className="sl-logo ">
          Scholar<strong>Logic</strong>
        </span>

        <ul className="sl-nav-links">
          <li><a href="#" className="active">Journals</a></li>
          <li><a href="#">Archives</a></li>
          <li><a href="#">Collections</a></li>
        </ul>

        <div className="sl-nav-right">
          <div className="sl-search-mini">
            <SearchIcon />
            <span>Quick find...</span>
          </div>
          <div className="sl-nav-icons">
            <button className="sl-icon-btn"><BellIcon /></button>
            <button className="sl-icon-btn"><BookmarkIcon /></button>
            <div className="sl-avatar" />
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="sl-hero">
        <h1>
          Discovery for the<br />
          <span>Next Generation.</span>
        </h1>
        <p className="sl-hero-sub">
          Access millions of peer-reviewed papers with AI-powered insights and semantic indexing.
        </p>

        <div className="sl-search-bar">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search papers, authors, keywords"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="sl-search-btn">Search</button>
        </div>

        <div className="sl-trending-tags">
          <strong>Trending:</strong>
          <span className="sl-tag">Quantum Computing</span>
          <span className="sl-tag">CRISP Ethics</span>
          <span className="sl-tag">Urban Ecology</span>
        </div>
      </section>

      {/* ── Trending Papers ── */}
      <section className="sl-section">
        <div className="sl-section-header">
          <div>
            <h2>Trending Papers</h2>
            <p>Highly cited research from the last 30 days.</p>
          </div>
          <a href="#" className="sl-view-all">
            View All <ArrowRight />
          </a>
        </div>

        <div className="sl-papers-grid">
          {/* Featured card */}
          <div className="sl-paper-featured">
            <div>
              <span className="sl-paper-category">Neuroscience</span>
              <span className="sl-ai-badge"><DotIcon /> 98 AI Score</span>
            </div>
            <h3>Neural Plasticity and the Architecture of Modern Large Language Models</h3>
            <p className="sl-paper-desc">
              An investigation into the comparative structures of biological neural networks and
              transformer-based architectures in generative AI systems.
            </p>
            <div className="sl-paper-author">
              <div className="sl-author-info">
                <div className="sl-author-avatar">EV</div>
                <div>
                  <div className="sl-author-name">Dr. Elena</div>
                  <div className="sl-author-affil">Harvard Medical School • 2024</div>
                </div>
              </div>
              <button className="sl-bookmark-btn"><BookmarkIcon /></button>
            </div>
          </div>

          {/* Small card 1 */}
          <div className="sl-paper-small">
            <div>
              <span className="sl-paper-category">Economics</span>
              <span className="sl-ai-badge-sm">84 AI Score</span>
            </div>
            <h4>Micro-transactions and the Future of Digital Governance</h4>
            <p className="sl-paper-meta-small">Chen, L. &amp; Miller, R. • 2024</p>
            <div className="sl-external-btn"><ExternalIcon /></div>
          </div>

          {/* Small card 2 */}
          <div className="sl-paper-small">
            <div>
              <span className="sl-paper-category">Physics</span>
              <span className="sl-ai-badge-sm">92 AI Score</span>
            </div>
            <h4>Room-Temperature Superconductors: A Meta-Analysis</h4>
            <p className="sl-paper-meta-small">Sago, H. et al. • 2023</p>
            <div className="sl-external-btn"><ExternalIcon /></div>
          </div>
        </div>
      </section>

      <div className="sl-divider" />

      {/* ── Recently Uploaded ── */}
      <section className="sl-section">
        <div className="sl-recent-grid">
          {/* Sidebar */}
          <div className="sl-recent-sidebar">
            <h2>Recently Uploaded</h2>
            <p>
              Stay updated with the latest submissions from across the global academic network.
              Updated every 15 minutes.
            </p>
            <div className="sl-publish-card">
              <h4>Publish your work</h4>
              <p>Join over 50,000 researchers sharing their findings open-access.</p>
              <button className="sl-submit-btn">Submit Manuscript</button>
            </div>
          </div>

          {/* Paper list */}
          <div className="sl-recent-list">
            {recentPapers.map((paper, i) => (
              <div className="sl-recent-item" key={i}>
                <div className="sl-recent-icon"><DocIcon /></div>
                <div className="sl-recent-content">
                  <div className="sl-recent-title">{paper.title}</div>
                  <div className="sl-recent-meta">
                    {paper.field} • Uploaded {paper.uploaded}
                  </div>
                  <div className="sl-recent-stats">
                    <span className="sl-stat"><EyeIcon />{paper.views}</span>
                    <span className="sl-stat"><DownloadIcon />{paper.downloads}</span>
                  </div>
                </div>
                <div className="sl-chevron"><ChevronRight /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="sl-footer">
        <div>
          <div style={{ marginBottom: 8 }}>
            © 2025 THE ACADEMIC EDITORIAL. ALL RIGHTS RESERVED.
          </div>
          <div className="sl-footer-links">
            <a href="#">Open Access Policy</a>
            <a href="#">Peer Review Process</a>
            <a href="#">Ethics &amp; Integrity</a>
          </div>
        </div>
        <div className="sl-footer-right">
          <a href="#">Institutional Access</a>
          <a href="#">API Documentation</a>
        </div>
      </footer>

    </div>
  );
}
