import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `fidora-nav-link ${isActive ? "active" : ""}`;

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="fidora-navbar">
      <NavLink to="/" className="fidora-brand" onClick={closeMenu}>
        <i className="bi bi-headphones headphones-experience"></i>   Fidora
      </NavLink>

      <button
        className="fidora-menu-toggle"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
      >
        <i className={menuOpen ? "bi bi-x-lg" : "bi bi-list"}></i>
      </button>

      <div className={`fidora-nav-links ${menuOpen ? "open" : ""}`}>
        <NavLink to="/" className={navClass} onClick={closeMenu}>
          Home
        </NavLink>

        <NavLink to="/spaces" className={navClass} onClick={closeMenu}>
          Our Spaces
        </NavLink>

        <NavLink to="/book" className={navClass} onClick={closeMenu}>
          Book a Session
        </NavLink>

        <NavLink to="/my-booking" className={navClass} onClick={closeMenu}>
          My Booking
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;