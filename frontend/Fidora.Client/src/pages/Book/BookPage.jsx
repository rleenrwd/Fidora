import { useEffect, useState } from "react";
import { DayPicker } from "@daypicker/react";

import "@daypicker/react/style.css";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  getSpaces,
  getSessions,
  createBooking,
} from "../../services/api";

import "./BookPage.css";
import focusLoungeImage from "../../assets/spaces/focus-lounge.png";
import deepWorkBoothImage from "../../assets/spaces/deep-work-booth.png";
import nightOwlRoomImage from "../../assets/spaces/night-owl-room.png";

function parseDateString(value) {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateForApi(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

const roomImages = {
  "Focus Lounge": focusLoungeImage,
  "Night Owl Room": nightOwlRoomImage,
  "Deep Work Booth": deepWorkBoothImage,
};

const roomAccentColors = {
  "Focus Lounge": "6, 182, 212",
  "Night Owl Room": "249, 115, 22",
  "Deep Work Booth": "236, 72, 153",
};

function BookPage() {
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [spacesLoading, setSpacesLoading] = useState(true);
  const [spacesError, setSpacesError] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState("");

  const [seatCount, setSeatCount] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [createdBooking, setCreatedBooking] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSpaces() {
      try {
        const data = await getSpaces();

        if (cancelled) {
          return;
        }

        setSpaces(data);

        if (data.length > 0) {
          setSelectedSpace(data[0]);
        }
      } catch (err) {
        if (!cancelled) {
          setSpacesError(err.message);
        }
      } finally {
        if (!cancelled) {
          setSpacesLoading(false);
        }
      }
    }

    loadSpaces();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedSpace || !selectedDate) {
      return;
    }

    let cancelled = false;

    async function loadSessions() {
      setSessionsLoading(true);
      setSessionsError("");

      try {
        const data = await getSessions(
          selectedSpace.id,
          selectedDate
        );

        if (!cancelled) {
          setSessions(data);
        }
      } catch (err) {
        if (!cancelled) {
          setSessionsError(err.message);
        }
      } finally {
        if (!cancelled) {
          setSessionsLoading(false);
        }
      }
    }

    loadSessions();

    return () => {
      cancelled = true;
    };
  }, [selectedSpace, selectedDate]);

  const selectedSession =
    sessions.find(
      (session) => String(session.id) === selectedSessionId
    ) ?? null;

  const calendarDate = parseDateString(selectedDate);

  function handleSpaceSelect(space) {
    if (selectedSpace?.id === space.id) {
      return;
    }

    setSelectedSpace(space);
    setSessions([]);
    setSelectedSessionId("");
    setSeatCount(1);
    setSessionsError("");
    setBookingError("");

    if (selectedDate) {
      setSessionsLoading(true);
    }
  }

  function handleDateSelect(date) {
    if (!date) {
      return;
    }

    const nextDate = formatDateForApi(date);

    if (nextDate === selectedDate) {
      return;
    }

    setSelectedDate(nextDate);
    setSessions([]);
    setSelectedSessionId("");
    setSeatCount(1);
    setSessionsError("");
    setBookingError("");

    if (selectedSpace) {
      setSessionsLoading(true);
    }
  }

  async function handleBookingSubmit(event) {
    event.preventDefault();

    if (!selectedSession) {
      setBookingError("Please select a session.");
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError("");

      const booking = await createBooking({
        sessionId: selectedSession.id,
        customerName,
        email,
        seatCount,
      });

      setCreatedBooking(booking);
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  }

  async function handleMakeAnotherBooking() {
    setCreatedBooking(null);
    setCustomerName("");
    setEmail("");
    setSeatCount(1);
    setSelectedSessionId("");
    setBookingError("");
    setSessionsError("");

    if (selectedSpace && selectedDate) {
      try {
        setSessionsLoading(true);

        const data = await getSessions(
          selectedSpace.id,
          selectedDate
        );

        setSessions(data);
      } catch (err) {
        setSessionsError(err.message);
      } finally {
        setSessionsLoading(false);
      }
    }
  }

  return (
    <div className="book-page">
      <main className="book-page-main">
        <div className="book-page-nav">
          <Navbar />
        </div>

        <section className="booking-page-layout">
          {/* ROOM SHOWCASE */}
          <div className="booking-showcase">
            <section className="book-page-heading">
              <p className="book-page-eyebrow">
                DIFFERENT AURAS. SAME VISION.
              </p>

              <h1>
                Book Your <span>Session</span>
              </h1>

              <p className="book-page-description">
                Choose an Aura. Find a session that fits your
                schedule. Reserve your seat.
              </p>
            </section>

            {/* AURA SELECTOR */}
            <section className="booking-aura-section">
              <div className="booking-aura-heading">
                <p className="booking-panel-eyebrow">STEP 01</p>

                <h2>Choose Your Aura</h2>

                <p>
                  Each space brings its own atmosphere,
                  playlist, and energy.
                </p>
              </div>

              <div className="booking-space-list">
                {spacesLoading && <p>Loading spaces...</p>}

                {spacesError && (
                  <p className="booking-field-error">
                    {spacesError}
                  </p>
                )}

                {!spacesLoading &&
                  !spacesError &&
                  spaces.map((space) => (
                    <button
                      key={space.id}
                      type="button"
                      className={`booking-space-card ${
                        selectedSpace?.id === space.id
                          ? "booking-space-card-active"
                          : ""
                      }`}
                      aria-pressed={
                        selectedSpace?.id === space.id
                      }
                      onClick={() => handleSpaceSelect(space)}
                      style={{
                        "--room-accent":
                          roomAccentColors[space.name] ?? "168, 85, 247",
                      }}
                    >
                      <div>
                        <span>{space.aura}</span>
                        <h3>{space.name}</h3>
                        <p>{space.lofiStyle}</p>
                      </div>

                      <i
                        className="bi bi-arrow-right"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
              </div>
            </section>

            {/* SELECTED ROOM */}
            <section className="booking-space-preview"
              style={{
              "--room-accent":
                roomAccentColors[selectedSpace?.name] ?? "168, 85, 247",
              }}
            >
              <div className="booking-space-main-image">
                {selectedSpace && roomImages[selectedSpace.name] && (
                  <img 
                    src={roomImages[selectedSpace.name]}
                    alt={`${selectedSpace.name} study room`}
                  />
                )}
              </div>

              <div className="booking-space-preview-heading">
                <div>
                  <p className="booking-panel-eyebrow">
                    YOUR SELECTED AURA
                  </p>

                  <h2>{selectedSpace?.name}</h2>
                </div>

                {selectedSpace && (
                  <span className="booking-space-aura-badge">
                    {selectedSpace.aura}
                  </span>
                )}
              </div>

              <p className="booking-space-preview-description">
                {selectedSpace?.description}
              </p>
            </section>

            {/* ROOM DETAILS */}
            <div className="booking-space-details">
              <div className="booking-space-detail">
                <i
                  className="bi bi-music-note-beamed"
                  aria-hidden="true"
                />

                <div>
                  <span>Playlist</span>
                  <strong>{selectedSpace?.lofiStyle}</strong>
                </div>
              </div>

              <div className="booking-space-detail">
                <i
                  className="bi bi-people"
                  aria-hidden="true"
                />

                <div>
                  <span>Capacity</span>
                  <strong>{selectedSpace?.capacity}</strong>
                </div>
              </div>

              <div className="booking-space-detail">
                <i
                  className="bi bi-clock"
                  aria-hidden="true"
                />

                <div>
                  <span>Session Style</span>
                  <strong>
                    {selectedSession?.sessionType ??
                      "Select a session"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* BOOKING FORM */}
          <aside className="booking-form-panel booking-rail">
            <div className="booking-panel-heading">
              <p className="booking-panel-eyebrow">STEP 02</p>

              <h2>
                {createdBooking
                  ? "Your Seat is Confirmed"
                  : "Book Your Session"}
              </h2>

              <p>
                {createdBooking
                  ? "Your study night is set. Save your booking reference to view or cancel your reservation."
                  : "Choose a date and session, then reserve your seat."}
              </p>
            </div>

            {createdBooking ? (
              <div className="booking-confirmation">
                <div className="booking-confirmation-icon">
                  <i
                    className="bi bi-check-lg"
                    aria-hidden="true"
                  />
                </div>

                <div className="booking-reference-card">
                  <span>Booking Reference</span>
                  <strong>
                    {createdBooking.bookingReference}
                  </strong>
                </div>

                <div className="booking-confirmation-details">
                  <div className="booking-summary-row">
                    <span>Space</span>
                    <strong>
                      {createdBooking.session.space.name}
                    </strong>
                  </div>

                  <div className="booking-summary-row">
                    <span>Date</span>
                    <strong>
                      {new Date(
                        createdBooking.session.startTime
                      ).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </strong>
                  </div>

                  <div className="booking-summary-row">
                    <span>Session</span>
                    <strong>
                      {formatTime(
                        createdBooking.session.startTime
                      )}
                      {" - "}
                      {formatTime(
                        createdBooking.session.endTime
                      )}
                    </strong>
                  </div>

                  <div className="booking-summary-row">
                    <span>Style</span>
                    <strong>
                      {createdBooking.session.sessionType}
                    </strong>
                  </div>

                  <div className="booking-summary-row">
                    <span>Seats</span>
                    <strong>{createdBooking.seatCount}</strong>
                  </div>

                  <div className="booking-summary-row">
                    <span>Status</span>
                    <strong className="booking-confirmation-status">
                      {createdBooking.status}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="booking-submit-button"
                  onClick={handleMakeAnotherBooking}
                >
                  Make Another Booking
                  <i
                    className="bi bi-arrow-right"
                    aria-hidden="true"
                  />
                </button>
              </div>
            ) : (
              <form
                className="booking-form"
                onSubmit={handleBookingSubmit}
              >
                {/* CALENDAR */}
                <div className="booking-field">
                  <span
                    id="booking-date-label"
                    className="booking-field-label"
                  >
                    Choose a date
                  </span>

                  <div
                    className="booking-calendar"
                    role="group"
                    aria-labelledby="booking-date-label"
                  >
                    <DayPicker
                      mode="single"
                      selected={calendarDate}
                      showOutsideDays
                      disabled={{ before: new Date() }}
                      onSelect={handleDateSelect}
                    />
                  </div>
                </div>

                {/* SESSION */}
                <div className="booking-field">
                  <label htmlFor="booking-session">
                    Available session
                  </label>

                  <select
                    id="booking-session"
                    name="sessionId"
                    value={selectedSessionId}
                    onChange={(event) => {
                      setSelectedSessionId(event.target.value);
                      setSeatCount(1);
                      setBookingError("");
                    }}
                    disabled={
                      !selectedDate ||
                      !selectedSpace ||
                      sessionsLoading
                    }
                  >
                    <option value="">
                      {!selectedDate
                        ? "Choose a date first"
                        : sessionsLoading
                          ? "Loading sessions..."
                          : "Select a session"}
                    </option>

                    {sessions.map((session) => (
                      <option
                        key={session.id}
                        value={session.id}
                        disabled={session.remainingSeats === 0}
                      >
                        {formatTime(session.startTime)}
                        {" - "}
                        {formatTime(session.endTime)}
                        {" · "}
                        {session.sessionType}
                        {" · "}
                        {session.remainingSeats} seats left
                      </option>
                    ))}
                  </select>

                  {sessionsError && (
                    <p className="booking-field-message booking-field-error">
                      {sessionsError}
                    </p>
                  )}

                  {selectedDate &&
                    !sessionsLoading &&
                    !sessionsError &&
                    sessions.length === 0 && (
                      <p className="booking-field-message">
                        No sessions are available for this date.
                      </p>
                    )}
                </div>

                {/* SEATS */}
                <div className="booking-field">
                  <span
                    id="booking-seats-label"
                    className="booking-field-label"
                  >
                    Number of seats
                  </span>

                  <div
                    className="booking-seat-picker"
                    role="group"
                    aria-labelledby="booking-seats-label"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setSeatCount((count) => count - 1)
                      }
                      disabled={seatCount <= 1}
                      aria-label="Remove one seat"
                    >
                      <i
                        className="bi bi-dash-lg"
                        aria-hidden="true"
                      />
                    </button>

                    <span aria-live="polite">{seatCount}</span>

                    <button
                      type="button"
                      onClick={() =>
                        setSeatCount((count) => count + 1)
                      }
                      disabled={
                        !selectedSession ||
                        seatCount >= selectedSession.remainingSeats
                      }
                      aria-label="Add one seat"
                    >
                      <i
                        className="bi bi-plus-lg"
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  <p className="booking-seat-availability">
                    {selectedSession
                      ? `${selectedSession.remainingSeats} seats available`
                      : "Select a session first"}
                  </p>
                </div>

                {/* NAME */}
                <div className="booking-field booking-field-name">
                  <label htmlFor="booking-name">Name</label>

                  <input
                    id="booking-name"
                    name="customerName"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={customerName}
                    onChange={(event) =>
                      setCustomerName(event.target.value)
                    }
                  />
                </div>

                {/* EMAIL */}
                <div className="booking-field booking-field-email">
                  <label htmlFor="booking-email">Email</label>

                  <input
                    id="booking-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                  />
                </div>

                {bookingError && (
                  <p
                    className="booking-field-message booking-field-error"
                    role="alert"
                  >
                    {bookingError}
                  </p>
                )}

                <button
                  type="submit"
                  className="booking-submit-button"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? "Booking..." : "Book Session"}

                  {!bookingLoading && (
                    <i
                      className="bi bi-arrow-right"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </form>
            )}
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default BookPage;