import {Routes, Route} from "react-router-dom";

import HomePage from "./pages/HomePage";
import SpacesPage from "./pages/SpacesPage";
import BookPage from "./pages/BookPage";
import MyBookingPage from "./pages/MyBookingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/spaces" element={<SpacesPage />} />
      <Route path="/book" element={<BookPage />} />
      <Route path="/my-booking" element={<MyBookingPage />} />
    </Routes>
  );
}

export default App;