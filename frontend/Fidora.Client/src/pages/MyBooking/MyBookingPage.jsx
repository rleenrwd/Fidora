import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { getBooking, cancelBooking } from "../../services/api";

import focusLoungeImage from "../../assets/spaces/focus-lounge.png";
import nightOwlRoomImage from "../../assets/spaces/night-owl-room.png";
import deepWorkBoothImage from "../../assets/spaces/deep-work-booth.png";

import "./MyBookingPage.css";

const roomDetails = {
  "Focus Lounge": {
    image: focusLoungeImage,
    accent: "6, 182, 212",
    description:
      "A social, energetic study space designed for focused work around others.",
    capacity: 30,
  },
  "Night Owl Room": {
    image: nightOwlRoomImage,
    accent: "249, 115, 22",
    description:
      "A darker, calmer study environment built for relaxed late-night focus.",
    capacity: 20,
  },
  "Deep Work Booth": {
    image: deepWorkBoothImage,
    accent: "236, 72, 153",
    description:
      "A minimal-distraction space for concentrated individual work.",
    capacity: 10,
  },
};

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatSessionType(value) {
  if (value === "Focus50_10") return "50/10 Focus Session";
  if (value === "Standard") return "Standard Session";

  return value;
}

function MyBookingPage() {
  const [reference, setReference] = useState("");
  const [booking, setBooking] = useState(null);
  const [isFinding, setIsFinding] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [showCancelConfirmation, setShowCancelConfirmation] =
    useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const session = booking?.session;
  const space = session?.space;
  const room = roomDetails[space?.name];
  const isConfirmed = booking?.status === "Confirmed";
  const isBusy = isFinding || isCancelling;

  async function handleLookup(event) {
    event.preventDefault();

    if (isBusy) return;

    const bookingReference = reference.trim();

    setLookupError("");
    setCancelError("");
    setSuccessMessage("");
    setShowCancelConfirmation(false);

    if (!bookingReference) {
      setLookupError("Enter your booking reference.");
      return;
    }

    setBooking(null);
    setIsFinding(true);

    try {
      const foundBooking = await getBooking(bookingReference);
      setBooking(foundBooking);
    } catch (error) {
      setLookupError(error.message || "Unable to find your booking.");
    } finally {
      setIsFinding(false);
    }
  }

  async function handleCancellation() {
    if (!booking || !isConfirmed || isBusy) return;

    setIsCancelling(true);
    setCancelError("");
    setSuccessMessage("");

    try {
      const cancelledBooking = await cancelBooking(
        booking.bookingReference
      );

      setBooking(cancelledBooking);
      setShowCancelConfirmation(false);
      setSuccessMessage(
        "Your booking has been cancelled. Your reserved seats have been released."
      );
    } catch (error) {
      setCancelError(
        error.message || "Unable to cancel your booking."
      );
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div className="my-booking-page">
      <main className="my-booking-main">
        <div className="my-booking-nav">
          <Navbar />
        </div>

        <header className="my-booking-heading">
          <p className="my-booking-eyebrow">YOUR STUDY NIGHT.</p>

          <h1>
            My <span>Booking</span>
          </h1>

          <p className="my-booking-description">
            Enter your booking reference to view or cancel your session.
          </p>
        </header>

        <div
          className={`my-booking-layout ${
            booking ? "my-booking-layout-found" : ""
          }`}
        >
          <section
            className="my-booking-lookup"
            aria-labelledby="booking-lookup-title"
          >
            <h2 id="booking-lookup-title">Find Your Booking</h2>

            <p className="my-booking-lookup-description">
              Use the reference shown on your booking confirmation.
            </p>

            <form
              className="my-booking-lookup-form"
              onSubmit={handleLookup}
              noValidate
            >
              <div className="my-booking-field">
                <label htmlFor="booking-reference">
                  Booking reference
                </label>

                <input
                  id="booking-reference"
                  name="bookingReference"
                  type="text"
                  value={reference}
                  onChange={(event) => {
                    setReference(event.target.value);
                    setLookupError("");
                  }}
                  placeholder="Enter your booking reference"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  disabled={isBusy}
                  aria-invalid={Boolean(lookupError)}
                  aria-describedby={
                    lookupError ? "booking-lookup-error" : undefined
                  }
                />
              </div>

              <button
                type="submit"
                className="my-booking-find-button"
                disabled={isBusy}
              >
                {isFinding ? "Finding your booking..." : "Find Booking"}

                {!isFinding && (
                  <i className="bi bi-arrow-right" aria-hidden="true" />
                )}
              </button>

              {lookupError && (
                <p
                  id="booking-lookup-error"
                  className="my-booking-error"
                  role="alert"
                >
                  {lookupError}
                </p>
              )}
            </form>
          </section>

          {booking && (
            <div
              className="my-booking-result"
              style={{
                "--room-accent": room?.accent ?? "168, 85, 247",
              }}
            >
              <section
                className="my-booking-preview"
                aria-labelledby="booked-room-title"
              >
                {room?.image && (
                  <div className="my-booking-room-image">
                    <img src={room.image} alt={space.name} />
                  </div>
                )}

                <div className="my-booking-room-content">
                  <p className="my-booking-eyebrow">
                    YOUR BOOKED AURA
                  </p>

                  <div className="my-booking-room-heading">
                    <h2 id="booked-room-title">{space.name}</h2>

                    <span className="my-booking-aura">
                      {space.aura}
                    </span>
                  </div>

                  {room && (
                    <p className="my-booking-room-description">
                      {room.description}
                    </p>
                  )}
                </div>

                <dl className="my-booking-room-meta">
                  <div className="my-booking-meta-item">
                    <i
                      className="bi bi-music-note-beamed"
                      aria-hidden="true"
                    />
                    <div>
                      <dt>Playlist</dt>
                      <dd>{space.lofiStyle}</dd>
                    </div>
                  </div>

                  {room && (
                    <div className="my-booking-meta-item">
                      <i
                        className="bi bi-people"
                        aria-hidden="true"
                      />
                      <div>
                        <dt>Capacity</dt>
                        <dd>{room.capacity} seats</dd>
                      </div>
                    </div>
                  )}

                  <div className="my-booking-meta-item">
                    <i className="bi bi-clock" aria-hidden="true" />
                    <div>
                      <dt>Session Style</dt>
                      <dd>
                        {formatSessionType(session.sessionType)}
                      </dd>
                    </div>
                  </div>
                </dl>
              </section>

              <section
                className="my-booking-details"
                aria-labelledby="booking-details-title"
              >
                <div className="my-booking-details-heading">
                  <h2 id="booking-details-title">Your Session</h2>

                  <span
                    className={`my-booking-status ${
                      isConfirmed
                        ? "my-booking-status-confirmed"
                        : "my-booking-status-cancelled"
                    }`}
                  >
                    <i
                      className={
                        isConfirmed
                          ? "bi bi-check-circle-fill"
                          : "bi bi-x-circle-fill"
                      }
                      aria-hidden="true"
                    />
                    {booking.status}
                  </span>
                </div>

                <dl className="my-booking-session-details">
                  <div>
                    <dt>Booking reference</dt>
                    <dd>{booking.bookingReference}</dd>
                  </div>

                  <div>
                    <dt>Name</dt>
                    <dd>{booking.customerName}</dd>
                  </div>

                  <div>
                    <dt>Date</dt>
                    <dd>{formatDate(session.startTime)}</dd>
                  </div>

                  <div>
                    <dt>Time</dt>
                    <dd>
                      {formatTime(session.startTime)} –{" "}
                      {formatTime(session.endTime)}
                    </dd>
                  </div>

                  <div>
                    <dt>Seats</dt>
                    <dd>
                      {booking.seatCount}{" "}
                      {booking.seatCount === 1 ? "seat" : "seats"}
                    </dd>
                  </div>

                  <div>
                    <dt>Session type</dt>
                    <dd>
                      {formatSessionType(session.sessionType)}
                    </dd>
                  </div>
                </dl>

                {successMessage && (
                  <p className="my-booking-success" role="status">
                    {successMessage}
                  </p>
                )}

                {!isConfirmed && !successMessage && (
                  <p className="my-booking-cancelled-message">
                    This booking has been cancelled.
                  </p>
                )}

                {isConfirmed && (
                  <div className="my-booking-cancellation">
                    {showCancelConfirmation ? (
                      <div className="my-booking-cancel-confirmation">
                        <h3>Cancel this booking?</h3>

                        <p>
                          Your reserved seats will be released.
                        </p>

                        <div className="my-booking-cancel-actions">
                          <button
                            type="button"
                            className="my-booking-keep-button"
                            onClick={() => {
                              setShowCancelConfirmation(false);
                              setCancelError("");
                            }}
                            disabled={isBusy}
                          >
                            Keep Booking
                          </button>

                          <button
                            type="button"
                            className="my-booking-cancel-button"
                            onClick={handleCancellation}
                            disabled={isBusy}
                          >
                            {isCancelling
                              ? "Cancelling..."
                              : "Yes, Cancel Booking"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="my-booking-cancel-button"
                          onClick={() =>
                            setShowCancelConfirmation(true)
                          }
                          disabled={isBusy}
                        >
                          <i
                            className="bi bi-trash"
                            aria-hidden="true"
                          />
                          Cancel Booking
                        </button>

                        <p className="my-booking-cancel-note">
                          Cancelling releases your reserved seats.
                        </p>
                      </>
                    )}

                    {cancelError && (
                      <p className="my-booking-error" role="alert">
                        {cancelError}
                      </p>
                    )}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MyBookingPage;