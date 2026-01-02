import { useState } from 'react';
import '../styles/LandingPage.css';

function LandingPage({ onGetStarted }) {
    const [isVisible, setIsVisible] = useState(true);

    const handleGetStarted = () => {
        setIsVisible(false);
        setTimeout(() => {
            onGetStarted();
        }, 600);
    };

    return (
        <div className={`landing-page ${!isVisible ? 'fade-out' : ''}`}>
            <div className="landing-container">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <span className="badge-dot"></span>
                            <span>Real-time Multiplayer</span>
                        </div>

                        <h1 className="hero-title">
                            Chess.
                            <br />
                            <span className="hero-subtitle">Reimagined.</span>
                        </h1>

                        <p className="hero-description">
                            Experience the timeless game with modern elegance.
                            <br />
                            Play with friends. Anytime. Anywhere.
                        </p>

                        <div className="cta-group">
                            <button className="btn-primary" onClick={handleGetStarted}>
                                Get Started
                                <svg className="btn-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className="btn-secondary">
                                Learn More
                            </button>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="chess-piece-container">
                            <div className="chess-piece king">♔</div>
                            <div className="chess-piece queen">♕</div>
                        </div>
                        <div className="visual-glow"></div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <path d="M16 4L4 10L16 16L28 10L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4 22L16 28L28 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4 16L16 22L28 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3>Real-time Play</h3>
                            <p>Instant moves with WebSocket technology. Zero lag, pure strategy.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
                                    <path d="M16 8V16L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3>Timed Matches</h3>
                            <p>Classic time controls. Every second counts in your pursuit of victory.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <rect x="6" y="6" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
                                    <path d="M6 12H26" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 6V26" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3>Clean Interface</h3>
                            <p>Beautifully minimal. Focus on what matters—the game.</p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="landing-footer">
                    <p>Designed with precision. Built for perfection.</p>
                </footer>
            </div>
        </div>
    );
}

export default LandingPage;
