import { Link } from "react-router-dom";
import "./HomePage.css";
// import communityImage from "../../assets/fidora-community.png";
import Navbar from "../../components/Navbar/Navbar";

function HomePage() {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="container-fluid hero-container">
            {/* MAIN HERO */}

            <div className="hero-main">
              <Navbar />
              <p className="hero-eyebrow">FIND YOUR AURA.</p>

              <h1 className="hero-title">
                Fidora
                <span>Your study night out.</span>
              </h1>

              <p className="hero-description">
                Fidora turns a study session into somewhere you actually want to be. Come solo or with your crew, find your vibe, and make your night out productive.
              </p>

              <div className="hero-features">
                <span><i className="bi bi-soundwave"></i> Curated Lofi</span>
                <span><i className="bi bi-water"></i> Different Auras</span>
                <span><i className="bi bi-people-fill"></i> Social Studying</span>
                <span><i className="bi bi-laptop"></i> Spaces Built to Focus</span>
              </div>

              <div className="hero-actions">
                <Link to="/book" className="btn btn-primary">
                  Book a Session <i class="bi bi-backpack"></i>
                </Link>

                <Link to="/spaces" className="btn btn-outline-light">
                  Explore Our Spaces <i class="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
