# Fidora — Data Model

## 1. Purpose

This document defines the data model for the Fidora MVP.

Fidora is a customer-facing booking application for a fictional lofi study-lounge startup. The MVP requires only the data necessary to represent study spaces, scheduled sessions, and customer bookings.

The model is intentionally small. It should support the complete booking workflow without introducing entities that are not required by the MVP.

---

## 2. Core Entities

The MVP contains three primary entities:

```text
Space
Session
Booking
```

Their relationships are:

```text
Space 1 ──────── * Session 1 ──────── * Booking
```

- One `Space` can have many `Session` records.
- One `Session` belongs to one `Space`.
- One `Session` can have many `Booking` records.
- One `Booking` belongs to one `Session`.

No `User` entity is required for the MVP because authentication and customer accounts are intentionally out of scope.

---

## 3. Space

A `Space` represents one physical study environment offered by Fidora.

Examples include:

- Focus Lounge
- Night Owl Room
- Deep Work Booth

Each space has its own visual identity, lofi style, aura, and physical capacity.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `Id` | `int` | Yes | Internal primary key. |
| `Name` | `string` | Yes | Display name of the study space. |
| `Slug` | `string` | Yes | URL-friendly unique identifier. |
| `Description` | `string` | Yes | Short description of the space and intended experience. |
| `Aura` | `string` | Yes | Short label describing the room's overall feel. |
| `LofiStyle` | `string` | Yes | Curated lofi style associated with the room. |
| `Capacity` | `int` | Yes | Maximum physical seating capacity of the space. |
| `ImageUrl` | `string` | Yes | Path or URL for the space image used by the frontend. |

### Example

```json
{
  "id": 1,
  "name": "Focus Lounge",
  "slug": "focus-lounge",
  "description": "A modern shared study environment for students who like focused energy around other people.",
  "aura": "Energetic & Social",
  "lofiStyle": "Lofi Hip-Hop",
  "capacity": 30,
  "imageUrl": "/images/spaces/focus-lounge.webp"
}
```

### Constraints

- `Name` must not be empty.
- `Slug` must be unique.
- `Capacity` must be greater than zero.
- `Description`, `Aura`, and `LofiStyle` must not be empty.
- `ImageUrl` must not be empty.

### Suggested Length Limits

```text
Name          100 characters
Slug           80 characters
Description   500 characters
Aura           80 characters
LofiStyle      80 characters
ImageUrl      500 characters
```

---

## 4. Session

A `Session` represents a scheduled opportunity to book seats in a Fidora study space.

A space may host multiple sessions on different dates and times.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `Id` | `int` | Yes | Internal primary key. |
| `SpaceId` | `int` | Yes | Foreign key referencing `Space`. |
| `StartTime` | `DateTimeOffset` | Yes | Date and time the session begins. |
| `EndTime` | `DateTimeOffset` | Yes | Date and time the session ends. |
| `Capacity` | `int` | Yes | Number of seats available for this specific session. |
| `SessionType` | `SessionType` | Yes | Type of study session being offered. |

### Navigation Properties

```csharp
public Space Space { get; set; }
public ICollection<Booking> Bookings { get; set; }
```

### Example

```json
{
  "id": 12,
  "spaceId": 1,
  "startTime": "2026-10-16T19:00:00-07:00",
  "endTime": "2026-10-16T21:00:00-07:00",
  "capacity": 24,
  "sessionType": "Focus50_10"
}
```

### Constraints

- `SpaceId` must reference an existing `Space`.
- `StartTime` must be earlier than `EndTime`.
- `Capacity` must be greater than zero.
- `Capacity` should not exceed the physical capacity of the associated space.
- New bookings cannot be created after the session has started.

The rule that session capacity cannot exceed space capacity is enforced by application logic because it depends on data from another table.

---

## 5. SessionType

`SessionType` represents the format of a scheduled study session.

The MVP supports two values:

```text
StandardFocus
Focus50_10
```

### StandardFocus

A standard study session where customers independently use the room during the scheduled period.

### Focus50_10

A structured study session built around repeating periods of:

```text
50 minutes focused study
10 minutes optional social break
```

The enum may be stored as a string in SQL Server so database values remain readable.

Example:

```csharp
public enum SessionType
{
    StandardFocus,
    Focus50_10
}
```

---

## 6. Booking

A `Booking` represents a customer's reservation for one scheduled session.

Bookings are not physically deleted when cancelled. Cancellation changes the booking status so reservation history is preserved.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `Id` | `int` | Yes | Internal primary key. |
| `BookingReference` | `string` | Yes | Unique customer-facing reference used to retrieve the booking. |
| `SessionId` | `int` | Yes | Foreign key referencing `Session`. |
| `CustomerName` | `string` | Yes | Name entered by the customer. |
| `Email` | `string` | Yes | Customer email address. |
| `SeatCount` | `int` | Yes | Number of seats reserved by the booking. |
| `Status` | `BookingStatus` | Yes | Current booking state. |
| `CreatedAtUtc` | `DateTime` | Yes | UTC timestamp for booking creation. |
| `CancelledAtUtc` | `DateTime?` | No | UTC timestamp recorded when the booking is cancelled. |

### Navigation Property

```csharp
public Session Session { get; set; }
```

### Example

```json
{
  "id": 42,
  "bookingReference": "FD7K2M9Q",
  "sessionId": 12,
  "customerName": "Alex Chen",
  "email": "alex@example.com",
  "seatCount": 1,
  "status": "Confirmed",
  "createdAtUtc": "2026-10-10T03:14:22Z",
  "cancelledAtUtc": null
}
```

### Constraints

- `BookingReference` must be unique.
- `SessionId` must reference an existing `Session`.
- `CustomerName` must not be empty.
- `Email` must contain a valid email address.
- `SeatCount` must be greater than zero.
- `Status` must contain a valid `BookingStatus`.
- `CreatedAtUtc` must be populated when the booking is created.
- `CancelledAtUtc` remains null until the booking is cancelled.

### Suggested Length Limits

```text
BookingReference   12 characters
CustomerName      120 characters
Email             254 characters
```

---

## 7. BookingStatus

The MVP supports two booking states:

```text
Confirmed
Cancelled
```

Example:

```csharp
public enum BookingStatus
{
    Confirmed,
    Cancelled
}
```

### Confirmed

The booking currently reserves seats in the session.

### Cancelled

The booking remains stored for history but no longer consumes session capacity.

A cancelled booking cannot be cancelled again.

The enum may be stored as a string in SQL Server for readability.

---

## 8. Booking Reference

Because the MVP does not include authentication or customer accounts, customers need a simple way to retrieve an existing reservation.

Each booking will therefore receive a unique customer-facing `BookingReference`.

Example:

```text
FD7K2M9Q
```

The reference should:

- be generated by the server
- be unique
- be difficult to guess sequentially
- remain unchanged for the lifetime of the booking
- be returned in the booking confirmation response

The internal database `Id` remains separate from the customer-facing booking reference.

---

## 9. Capacity and Availability

Remaining availability is **derived data** and is not stored as a separate database column.

The application calculates remaining seats as:

```text
Remaining Seats =
Session Capacity
-
Sum of SeatCount for Confirmed Bookings
```

Example:

```text
Session Capacity:        24

Confirmed Booking A:      2
Confirmed Booking B:      1
Confirmed Booking C:      3

Reserved Seats:           6
Remaining Seats:         18
```

Cancelled bookings do not consume capacity.

### Why RemainingSeats Is Not Stored

Persisting `RemainingSeats` separately would duplicate information that can already be calculated from the session and bookings.

Deriving the value avoids synchronization problems such as:

```text
Session says 5 seats remain
but
Booking records indicate 4 seats remain
```

The database remains the source of truth.

---

## 10. Booking Capacity Rule

Before creating a booking, the API must calculate current remaining capacity.

Conceptually:

```text
requestedSeats <= remainingSeats
```

If the request exceeds remaining capacity, the booking is rejected.

Example:

```text
Remaining Seats:  2
Requested Seats:  3

Result:
Booking rejected.
```

The API should return an HTTP `409 Conflict` for this condition.

Capacity must be validated again on the server when the booking is submitted even if the frontend previously displayed available seats.

---

## 11. Cancellation Behavior

Cancelling a booking does not delete the row.

Instead:

```text
Status = Cancelled
CancelledAtUtc = current UTC timestamp
```

Because availability calculations include only confirmed bookings, the cancelled booking's seats automatically become available again.

Example:

```text
Before cancellation:
Capacity = 20
Confirmed reserved seats = 18
Remaining = 2

Cancel booking containing 2 seats

After cancellation:
Capacity = 20
Confirmed reserved seats = 16
Remaining = 4
```

---

## 12. Relationship Rules

### Space → Session

```text
Space.Id
   ↓
Session.SpaceId
```

Relationship:

```text
One Space
to
Many Sessions
```

A session cannot exist without a valid space.

### Session → Booking

```text
Session.Id
   ↓
Booking.SessionId
```

Relationship:

```text
One Session
to
Many Bookings
```

A booking cannot exist without a valid session.

---

## 13. Delete Behavior

The MVP does not expose API endpoints for deleting spaces or sessions.

Database relationships should use restrictive delete behavior so that a parent record with dependent data cannot be accidentally removed.

Recommended behavior:

```text
Space → Sessions
DeleteBehavior.Restrict

Session → Bookings
DeleteBehavior.Restrict
```

Bookings are cancelled rather than deleted.

---

## 14. Indexes

The following indexes are recommended.

### Space

```text
UNIQUE INDEX
Space.Slug
```

Purpose:

- guarantees unique URLs/identifiers
- supports efficient space lookup

### Session

```text
INDEX
Session.SpaceId
Session.StartTime
```

Purpose:

- supports session lookup by space
- supports chronological session queries

A combined index may also be used:

```text
(SpaceId, StartTime)
```

### Booking

```text
UNIQUE INDEX
Booking.BookingReference
```

Purpose:

- guarantees unique booking references
- supports fast customer booking lookup

Additional index:

```text
Booking.SessionId
```

Purpose:

- supports capacity calculations and booking retrieval by session

---

## 15. Entity Framework Core Configuration

The model may use a combination of:

- entity classes
- Data Annotations
- Fluent API configuration

Fluent API should be used where relationship behavior, indexes, enum conversion, or database constraints need to be explicit.

Examples include:

```text
unique indexes
foreign-key relationships
delete behavior
enum-to-string conversion
maximum lengths
required fields
```

The final EF Core configuration should reflect the rules defined in this document.

---

## 16. Example Entity Shape

The following examples illustrate the expected entity structure. They are not intended to be copied blindly during implementation.

### Space

```csharp
public class Space
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Aura { get; set; } = string.Empty;
    public string LofiStyle { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string ImageUrl { get; set; } = string.Empty;

    public ICollection<Session> Sessions { get; set; } = [];
}
```

### Session

```csharp
public class Session
{
    public int Id { get; set; }

    public int SpaceId { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public int Capacity { get; set; }
    public SessionType SessionType { get; set; }

    public Space Space { get; set; } = null!;
    public ICollection<Booking> Bookings { get; set; } = [];
}
```

### Booking

```csharp
public class Booking
{
    public int Id { get; set; }

    public string BookingReference { get; set; } = string.Empty;
    public int SessionId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int SeatCount { get; set; }
    public BookingStatus Status { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? CancelledAtUtc { get; set; }

    public Session Session { get; set; } = null!;
}
```

---

## 17. Intentionally Excluded Entities

The following entities are not required for the MVP:

```text
User
Role
Membership
Payment
Notification
Waitlist
MusicTrack
Playlist
Venue
Staff
AuditLog
```

They should not be added unless the MVP scope changes.

The application should remain centered on the minimum domain required to support:

```text
Spaces
   ↓
Sessions
   ↓
Bookings
```

---

## 18. Data Model Summary

The Fidora MVP uses a deliberately small relational model:

```text
SPACE
- describes the physical study environment
- defines the room's aura, lofi style, and physical capacity

SESSION
- schedules a specific study experience inside a space
- defines time, session type, and bookable capacity

BOOKING
- reserves seats in a session
- stores customer information
- tracks confirmation or cancellation
```

Availability is derived from confirmed bookings rather than stored independently.

This model provides enough structure to support Fidora's full MVP booking workflow while remaining simple, understandable, and maintainable.
