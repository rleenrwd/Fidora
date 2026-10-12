import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import { getSpaces } from "../../services/api";

import focusLoungeImage from "../../assets/spaces/focus-lounge.png";
import nightOwlRoomImage from "../../assets/spaces/night-owl-room.png";
import deepWorkBoothImage from "../../assets/spaces/deep-work-booth.png";

import "./SpacesPage.css";

const roomDetails = {
  "Focus Lounge": {
    image: focusLoungeImage,
    accent: "6, 182, 212",
    experience: "Bring a friend or settle in alongside other people working toward their own goals. Lofi hip-hop and vibrant lighting give the room an upbeat rhythm, with space for conversation and shared momentum. It’s a place to make progress while still feeling part of a night out.",
    bestFor: "Studying with friends or working alongside others.",
    etiquette: [
      "Keep conversations respectful",
      "Headphones optional while collaborating",
      "Keep shared tables clear",
    ],
  },
  "Night Owl Room": {
    image: nightOwlRoomImage,
    accent: "249, 115, 22",
    experience: "Warm lighting, mellow jazz, and a slower pace create an atmosphere you can ease into. Come alone or with a friend to read, review notes, or work through an assignment without the energy of a busier room. Quiet company makes a late study session feel a little less solitary.",
    bestFor:
      "Reading, reviewing notes, and settling into a slower pace.",
    etiquette: [
      "Keep voices low",
      "Take calls outside the room",
      "Respect others’ study time",
    ],
  },
  "Deep Work Booth": {
    image: deepWorkBoothImage,
    accent: "236, 72, 153",
    experience: "Settle into your own space, put on your headphones, and give one task your attention. Ambient lofi and a quiet room support individual work, while the presence of other students keeps you connected to a shared sense of purpose. A good fit for when you want company without conversation.",
    bestFor:
      "Solo assignments and work that needs sustained attention.",
    etiquette: [
      "Keep the room quiet",
      "Silence device notifications",
      "Take conversations outside",
    ],
  },
};

function SpacesPage() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSpaces() {
      try {
        const data = await getSpaces();

        if (!cancelled) {
          setSpaces(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load our spaces.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSpaces();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
      });
    }, []);

  return (
    <div className="spaces-page">
      <main className="spaces-page-main">
        <div className="spaces-page-nav">
          <Navbar />
        </div>

        <header className="spaces-page-heading">
          <p className="spaces-page-eyebrow">
            DIFFERENT AURAS. SAME VISION.
          </p>

          <h1>
            Our <span>Spaces</span>
          </h1>

          <p className="spaces-page-description">
            Find your atmosphere. Know what to expect.
            Book your study night.
          </p>
        </header>

        {loading && (
          <p className="spaces-page-message" role="status">
            Loading spaces...
          </p>
        )}

        {error && (
          <p
            className="spaces-page-message spaces-page-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {!loading && !error && spaces.length === 0 && (
          <p className="spaces-page-message">
            No spaces are available right now.
          </p>
        )}

        {!loading && !error && spaces.length > 0 && (
          <>
            <section
              className="spaces-page-grid"
              aria-label="Our study spaces"
            >
              {spaces.map((space) => {
                const details = roomDetails[space.name];

                return (
                  <article
                    key={space.id}
                    className="spaces-room-card"
                    style={{
                      "--room-accent":
                        details?.accent ?? "168, 85, 247",
                    }}
                    aria-labelledby={`space-title-${space.id}`}
                  >
                    <div className="spaces-room-image">
                      {details?.image && (
                        <img
                          src={details.image}
                          alt={`${space.name} study room`}
                        />
                      )}

                      <span className="spaces-room-aura">
                        {space.aura}
                      </span>
                    </div>

                    <div className="spaces-room-content">
                      <div className="spaces-room-heading">
                        <h2 id={`space-title-${space.id}`}>
                          {space.name}
                        </h2>

                        <p><i>{space.description}</i></p>
                      
                      </div>
                      {details?.experience && (
                        <p className="spaces-room-experience">
                          {details.experience}
                        </p>
                      )}
                      <dl className="spaces-room-meta">
                        <div className="spaces-room-meta-item">
                          <i
                            className="bi bi-music-note-beamed"
                            aria-hidden="true"
                          />

                          <div>
                            <dt>Playlist</dt>
                            <dd>{space.lofiStyle}</dd>
                          </div>
                        </div>

                        <div className="spaces-room-meta-item">
                          <i
                            className="bi bi-people-fill"
                            aria-hidden="true"
                          />

                          <div>
                            <dt>Capacity</dt>
                            <dd>{space.capacity} seats</dd>
                          </div>
                        </div>
                      </dl>
                      <p className="spaces-room-amenity">
                        <i className="bi bi-headphones" aria-hidden="true" />
                        <span>Silent disco headphones provided</span>
                      </p>
                      {details && (
                        <>
                          <section className="spaces-room-detail">
                            <h3>Best For</h3>
                            <p>{details.bestFor}</p>
                          </section>

                          <section className="spaces-room-detail etiquette">
                            <h3>Room Etiquette</h3>

                            <ul className="spaces-room-rules">
                              {details.etiquette.map((rule) => (
                                <li key={rule}>
                                  <i
                                    className="bi bi-check-circle-fill"
                                    aria-hidden="true"
                                  />

                                  <span>{rule}</span>
                                </li>
                              ))}
                            </ul>
                          </section>
                        </>
                      )}

                      <div className="spaces-room-action">
                        <Link
                          to={`/book?spaceId=${encodeURIComponent(
                            space.id
                          )}`}
                          className="spaces-room-book-button"
                          aria-label={`Book ${space.name}`}
                        >
                          Book This Space

                          <i
                            className="bi bi-arrow-right"
                            aria-hidden="true"
                          />
                        </Link>

                        <p>
                          Choose your date and session next.
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default SpacesPage;