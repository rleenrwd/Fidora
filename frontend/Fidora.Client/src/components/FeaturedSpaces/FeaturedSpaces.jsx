import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import { getSpaces, getApiAssetUrl } from "../../services/api";
import "./FeaturedSpaces.css";

function FeaturedSpaces() {
    const [spaces, setSpaces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");


    function getAuraIcon(slug) {
        switch(slug) {
            case "focus-lounge":
                return "bi bi-people-fill";
            case "night-owl-room":
                return "bi bi-moon-fill";
            case "deep-work-booth":
                return "bi bi-headphones";
            default:
                return "bi-stars";
        }
    }

    useEffect(() => {
        async function loadSpaces() {
            try {
                const data = await getSpaces();
                setSpaces(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadSpaces();
    }, []);
        
    return (
        <section className="featured-spaces">
            <div className="featured-spaces-container">

                <div className="featured-spaces-intro">
                <p className="featured-spaces-eyebrow">
                    CHOOSE YOUR AURA
                </p>

                <h2 className="featured-spaces-title">
                    Different <span>Auras.</span>
                    <br />
                    Same Vision.
                </h2>

                <p className="featured-spaces-description">
                    From collaborative to focused, each space is curated with its own
                    atmosphere, playlist, and energy — so you can study in a way
                    that matches your night's vibe.
                </p>

                <Link
                    to="/spaces"
                    className="featured-spaces-cta"
                >
                    Explore All Spaces
                    <i className="bi bi-arrow-right"></i>
                </Link>
                </div>

                <div className="featured-spaces-grid">

                {isLoading && (
                    <p className="featured-spaces-status">
                    Loading spaces...
                    </p>
                )}

                {error && (
                    <p className="featured-spaces-status featured-spaces-error">
                    {error}
                    </p>
                )}

                {!isLoading &&
                    !error &&
                    spaces.slice(0, 3).map((space, index) => (
                    <article
                        key={space.id}
                        className={`featured-space-card ${space.slug}`}
                    >
                        <div className="featured-space-image">
                        <img
                            src={getApiAssetUrl(space.imageUrl)}
                            alt={space.name}
                        />

                        <div className="featured-space-badge">
                            <i className={`${getAuraIcon(space.slug)}`}></i>
                            <span>{space.aura}</span>
                        </div>
                        </div>

                        <div className="featured-space-content">

                        <div className="featured-space-heading">
                            <h3>{space.name}</h3>

                            <span className="featured-space-number">
                            {String(index + 1).padStart(2, "0")}
                            </span>
                        </div>

                        <p className="featured-space-vibe">
                            {space.aura}
                        </p>

                        <p className="featured-space-description">
                            {space.description}
                        </p>

                        <div className="featured-space-meta">

                            <div className="featured-space-detail">
                            <i className="bi bi-music-note-beamed"></i>

                            <div>
                                <span className="featured-space-detail-value">
                                {space.lofiStyle}
                                </span>

                                <span className="featured-space-detail-label">
                                PLAYLIST
                                </span>
                            </div>
                            </div>

                            <div className="featured-space-detail">
                            <i className="bi bi-people-fill"></i>

                            <div>
                                <span className="featured-space-detail-value">
                                {space.capacity}
                                </span>

                                <span className="featured-space-detail-label">
                                CAPACITY
                                </span>
                            </div>
                            </div>

                            <Link
                            to="/spaces"
                            className="featured-space-link"
                            aria-label={`Explore ${space.name}`}
                            >
                            <i className="bi bi-arrow-right"></i>
                            </Link>

                        </div>
                        </div>
                    </article>
                    ))}

                </div>

            </div>
        </section>
    );




}

export default FeaturedSpaces;



