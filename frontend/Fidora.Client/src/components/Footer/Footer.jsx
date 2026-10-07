import { NavLink } from "react-router-dom";

import "./Footer.css";

function Footer() {
  return (
    <footer className="fidora-footer">
      <div className="fidora-footer-container">

        <div className="fidora-footer-brand">
          <h2>Fidora</h2>

          <p className="fidora-footer-tagline">
            Your study night out.
          </p>

          <p className="fidora-footer-copy">
            Different auras. Same Vision.
          </p>
        </div>

        <nav
          className="fidora-footer-nav"
          aria-label="Footer navigation"
        >
          <NavLink to="/">
            Home
          </NavLink>

          <NavLink to="/spaces">
            Our Spaces
          </NavLink>

          <NavLink to="/book">
            Book a Session
          </NavLink>

          <NavLink to="/my-booking">
            My Booking
          </NavLink>
        </nav>

        <div className="fidora-footer-bottom">
          <p>
            © {new Date().getFullYear()} Fidora. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;