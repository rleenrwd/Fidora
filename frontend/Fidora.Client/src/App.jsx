import {Routes, Route} from "react-router-dom";

import HomePage from "./pages/Home/HomePage";
import SpacesPage from "./pages/Spaces/SpacesPage";
import BookPage from "./pages/Book/BookPage";
import MyBookingPage from "./pages/MyBooking/MyBookingPage";
import Navbar from "./components/Navbar";

function App() {
  return (

    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/spaces" element={<SpacesPage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/my-booking" element={<MyBookingPage />} />
      </Routes>

    </>
  );
}

export default App;