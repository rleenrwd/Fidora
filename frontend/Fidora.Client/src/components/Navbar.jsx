import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          Fidora
        </NavLink>

        <div className="navbar-nav ms-auto">
          <NavLink className="nav-link" to="/">
            Home
          </NavLink>

          <NavLink className="nav-link" to="/spaces">
            Our Spaces
          </NavLink>

          <NavLink className="nav-link" to="/book">
            Book a Session
          </NavLink>

          <NavLink className="nav-link" to="/my-booking">
            My Booking
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;