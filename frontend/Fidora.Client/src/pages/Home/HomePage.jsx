import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <div className="row align-items-stretch">

            {/* Main hero */}
            <div className="col-lg-9">
              <div className="hero-main">
                <p className="hero-eyebrow">FIND YOUR AURA.</p>

                <h1 className="hero-title">
                  Fidora
                  <span>Your study night out.</span>
                </h1>

                <p className="hero-description">
                  Step into curated lofi spaces built for focus, energy,
                  and connection. Pick your aura, plug into the vibe,
                  and make studying somewhere you actually want to be.
                </p>

                <div className="hero-features">
                  <span>🎧 Curated Lofi</span>
                  <span>✨ Different Auras</span>
                  <span>👥 Social Studying</span>
                  <span>🌙 Spaces Built to Focus</span>
                </div>

                <div className="hero-actions">
                  <Link to="/book" className="btn btn-primary">
                    Book a Session
                  </Link>

                  <Link to="/spaces" className="btn btn-outline-light">
                    Explore Our Spaces
                  </Link>
                </div>
              </div>
            </div>

            {/* Community card */}
            <div className="col-lg-3">
              <aside className="community-card">
                <h2>A Community That Studies Differently</h2>

                <p className="community-tagline">
                  Same goals. Better atmosphere.
                </p>

                <p>
                  Study around people who came to lock in too.
                  Different rooms, different playlists, different
                  energy — all built around getting focused without
                  feeling stuck in a library.
                </p>
              </aside>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;