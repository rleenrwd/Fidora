import { Link } from "react-router-dom";
import "./HomePage.css";
import focusLoungeImg from "../../assets/focus-lounge.png";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import LocalPress from "../../components/LocalPress/LocalPress";
import FeaturedSpaces from "../../components/FeaturedSpaces/FeaturedSpaces";
import StudentCommunity from "../../components/StudentCommunity/StudentCommunity";


function HomePage() {
  return (
    <main className="home-page">
       {/* MAIN HERO */}
      <section className="hero">
        <div className="container-fluid hero-container">
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
                  Book a Session <i className="bi bi-backpack"></i>
                </Link>

                <Link to="/spaces" className="btn btn-outline-light">
                  Explore Our Spaces <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
        </div>
      </section>

       {/* EXPERIENCE */}
      <section className="experience-section">
        <div className="experience-container">

          <div className="experience-image">
            <img
              src={focusLoungeImg}
              alt="Students studying together at Fidora"
            />
          </div>

          <div className="experience-content">
            <p className="experience-eyebrow">
      
              THE FIDORA EXPERIENCE.
            </p>

            <h2>
              An Immersive Lofi-Inspired Atmosphere.
            </h2>

            <h3>
              Your New Spot for Social Studying
            </h3>

            <p className="experience-description">
              Choose the aura that fits your night, reserve your spot,
              and plug into curated lofi through silent-disco headphones.
              Each room brings its own atmosphere, playlist, and energy —
              giving you a new way to study around others without giving
              up focus.
            </p>
          </div>

        </div>
      </section>

      {/* LOCAL PRESS */}
      <LocalPress />

      {/* SPACES */}
      <FeaturedSpaces />

    {/* STUDENT COMMUNITY */}
    <StudentCommunity />

    {/* FOOTER */}
      <Footer />
    </main>

  );
}

export default HomePage;
