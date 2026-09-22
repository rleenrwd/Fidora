# Fidora — API Specification

## 1. Purpose

This document defines the HTTP API contract for the Fidora MVP.

The Fidora API is an ASP.NET Core Web API used by the React client to:

- retrieve study spaces
- retrieve upcoming study sessions
- view session availability
- create bookings
- retrieve existing bookings
- cancel bookings

The API is the authoritative source for booking rules, capacity enforcement, validation, and booking state.

---

## 2. Base Path

All MVP endpoints are exposed beneath:

```text
/api
```

Example:

```text
GET /api/spaces
```

The production host will be documented separately in `Deployment.md`.

---

## 3. Content Type

Requests and responses use JSON unless otherwise noted.

```http
Content-Type: application/json
Accept: application/json
```

---

## 4. Date and Time Format

API date and time values use ISO 8601.

Session start and end times include an offset:

```text
2026-10-16T19:00:00-07:00
```

UTC timestamps use `Z`:

```text
2026-10-10T03:14:22Z
```

The backend will use `DateTimeOffset` for scheduled session times and UTC timestamps for booking lifecycle events.

---

## 5. Endpoint Summary

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/spaces` | Retrieve all Fidora study spaces. |
| `GET` | `/api/spaces/{id}` | Retrieve one study space. |
| `GET` | `/api/sessions` | Retrieve upcoming sessions, optionally filtered. |
| `GET` | `/api/sessions/{id}` | Retrieve one session and current availability. |
| `POST` | `/api/bookings` | Create a booking. |
| `GET` | `/api/bookings/{bookingReference}` | Retrieve an existing booking. |
| `POST` | `/api/bookings/{bookingReference}/cancel` | Cancel an existing booking. |

The MVP intentionally does not expose create, update, or delete endpoints for spaces or sessions because administrative management is out of scope.

---

# Spaces

## 6. GET `/api/spaces`

Returns all Fidora study spaces.

### Request

```http
GET /api/spaces
```

No request body is required.

### Success Response

```text
200 OK
```

```json
[
  {
    "id": 1,
    "name": "Focus Lounge",
    "slug": "focus-lounge",
    "description": "A modern shared study environment for students who like focused energy around other people.",
    "aura": "Energetic & Social",
    "lofiStyle": "Lofi Hip-Hop",
    "capacity": 30,
    "imageUrl": "/images/spaces/focus-lounge.webp"
  },
  {
    "id": 2,
    "name": "Night Owl Room",
    "slug": "night-owl-room",
    "description": "A darker, calmer study environment designed for evening focus.",
    "aura": "Calm & Late-Night",
    "lofiStyle": "Lofi Jazz",
    "capacity": 16,
    "imageUrl": "/images/spaces/night-owl-room.webp"
  }
]
```

### Response DTO

```text
SpaceResponse
```

Fields:

```text
id
name
slug
description
aura
lofiStyle
capacity
imageUrl
```

---

## 7. GET `/api/spaces/{id}`

Returns one study space by internal ID.

### Request

```http
GET /api/spaces/1
```

### Success Response

```text
200 OK
```

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

### Not Found

```text
404 Not Found
```

Returned when the requested space does not exist.

---

# Sessions

## 8. GET `/api/sessions`

Returns upcoming bookable sessions.

The endpoint may be filtered using optional query parameters.

### Supported Query Parameters

| Parameter | Type | Required | Example | Purpose |
|---|---|---:|---|---|
| `spaceId` | `int` | No | `1` | Return sessions for a specific space. |
| `date` | `date` | No | `2026-10-16` | Return sessions occurring on a specific local calendar date. |
| `sessionType` | `string` | No | `Focus50_10` | Return a specific session type. |

### Example Requests

All upcoming sessions:

```http
GET /api/sessions
```

Sessions for one space:

```http
GET /api/sessions?spaceId=1
```

Sessions for a space on a selected date:

```http
GET /api/sessions?spaceId=1&date=2026-10-16
```

50/10 sessions:

```http
GET /api/sessions?sessionType=Focus50_10
```

### Success Response

```text
200 OK
```

```json
[
  {
    "id": 12,
    "spaceId": 1,
    "spaceName": "Focus Lounge",
    "startTime": "2026-10-16T19:00:00-07:00",
    "endTime": "2026-10-16T21:00:00-07:00",
    "capacity": 24,
    "remainingSeats": 18,
    "sessionType": "Focus50_10"
  }
]
```

An empty result is still successful:

```json
[]
```

### Response DTO

```text
SessionResponse
```

Fields:

```text
id
spaceId
spaceName
startTime
endTime
capacity
remainingSeats
sessionType
```

### Bad Request

```text
400 Bad Request
```

Returned when a query parameter is malformed or contains an unsupported session type.

---

## 9. GET `/api/sessions/{id}`

Returns one session and its current availability.

### Request

```http
GET /api/sessions/12
```

### Success Response

```text
200 OK
```

```json
{
  "id": 12,
  "spaceId": 1,
  "spaceName": "Focus Lounge",
  "startTime": "2026-10-16T19:00:00-07:00",
  "endTime": "2026-10-16T21:00:00-07:00",
  "capacity": 24,
  "remainingSeats": 18,
  "sessionType": "Focus50_10"
}
```

### Not Found

```text
404 Not Found
```

Returned when the session does not exist.

---

# Bookings

## 10. POST `/api/bookings`

Creates a new booking for a scheduled session.

### Request DTO

```text
CreateBookingRequest
```

### Request

```http
POST /api/bookings
Content-Type: application/json
```

```json
{
  "sessionId": 12,
  "customerName": "Alex Chen",
  "email": "alex@example.com",
  "seatCount": 1
}
```

### Request Fields

| Field | Type | Required | Validation |
|---|---|---:|---|
| `sessionId` | `int` | Yes | Must reference an existing session. |
| `customerName` | `string` | Yes | Must not be empty; maximum 120 characters. |
| `email` | `string` | Yes | Must be a valid email address; maximum 254 characters. |
| `seatCount` | `int` | Yes | Must be greater than zero and must not exceed remaining capacity. |

### Booking Validation Flow

Before creating a booking, the API must:

1. validate the request payload
2. verify the session exists
3. verify the session has not already started
4. calculate current remaining capacity
5. verify the requested seat count does not exceed remaining capacity
6. generate a unique booking reference
7. create the booking with `Confirmed` status
8. persist the booking
9. return the created reservation

### Success Response

```text
201 Created
```

The response should include a `Location` header:

```http
Location: /api/bookings/FD7K2M9Q
```

Response body:

```json
{
  "bookingReference": "FD7K2M9Q",
  "customerName": "Alex Chen",
  "email": "alex@example.com",
  "seatCount": 1,
  "status": "Confirmed",
  "createdAtUtc": "2026-10-10T03:14:22Z",
  "cancelledAtUtc": null,
  "session": {
    "id": 12,
    "startTime": "2026-10-16T19:00:00-07:00",
    "endTime": "2026-10-16T21:00:00-07:00",
    "sessionType": "Focus50_10",
    "space": {
      "id": 1,
      "name": "Focus Lounge",
      "slug": "focus-lounge",
      "aura": "Energetic & Social",
      "lofiStyle": "Lofi Hip-Hop",
      "imageUrl": "/images/spaces/focus-lounge.webp"
    }
  }
}
```

### Bad Request

```text
400 Bad Request
```

Examples:

- missing customer name
- invalid email
- `seatCount` is zero or negative
- malformed request body

### Not Found

```text
404 Not Found
```

Returned when `sessionId` does not reference an existing session.

### Conflict

```text
409 Conflict
```

Returned when the request is structurally valid but cannot be completed because of current application state.

Examples:

- session has already started
- session is full
- requested seats exceed remaining capacity

---

## 11. GET `/api/bookings/{bookingReference}`

Retrieves an existing booking using its customer-facing booking reference.

### Request

```http
GET /api/bookings/FD7K2M9Q
```

### Success Response

```text
200 OK
```

```json
{
  "bookingReference": "FD7K2M9Q",
  "customerName": "Alex Chen",
  "email": "alex@example.com",
  "seatCount": 1,
  "status": "Confirmed",
  "createdAtUtc": "2026-10-10T03:14:22Z",
  "cancelledAtUtc": null,
  "session": {
    "id": 12,
    "startTime": "2026-10-16T19:00:00-07:00",
    "endTime": "2026-10-16T21:00:00-07:00",
    "sessionType": "Focus50_10",
    "space": {
      "id": 1,
      "name": "Focus Lounge",
      "slug": "focus-lounge",
      "aura": "Energetic & Social",
      "lofiStyle": "Lofi Hip-Hop",
      "imageUrl": "/images/spaces/focus-lounge.webp"
    }
  }
}
```

### Not Found

```text
404 Not Found
```

Returned when the booking reference does not exist.

### Booking Reference Behavior

The booking reference acts as the customer's lookup token for the MVP.

It should:

- be generated by the server
- be unique
- be non-sequential
- be difficult to guess
- remain unchanged for the lifetime of the booking

Authentication is intentionally out of scope for the MVP.

---

## 12. POST `/api/bookings/{bookingReference}/cancel`

Cancels an existing confirmed booking.

Cancellation is modeled as an explicit business operation rather than as a generic update to the booking resource.

This avoids exposing arbitrary booking-status modification through the API.

### Request

```http
POST /api/bookings/FD7K2M9Q/cancel
```

No request body is required.

### Cancellation Flow

The API must:

1. locate the booking by `bookingReference`
2. verify the booking exists
3. verify the booking is currently `Confirmed`
4. change the status to `Cancelled`
5. set `CancelledAtUtc`
6. save the change
7. return the updated booking

Because availability is derived from confirmed bookings, the cancelled seats automatically become available again.

### Success Response

```text
200 OK
```

```json
{
  "bookingReference": "FD7K2M9Q",
  "customerName": "Alex Chen",
  "email": "alex@example.com",
  "seatCount": 1,
  "status": "Cancelled",
  "createdAtUtc": "2026-10-10T03:14:22Z",
  "cancelledAtUtc": "2026-10-12T01:42:11Z",
  "session": {
    "id": 12,
    "startTime": "2026-10-16T19:00:00-07:00",
    "endTime": "2026-10-16T21:00:00-07:00",
    "sessionType": "Focus50_10",
    "space": {
      "id": 1,
      "name": "Focus Lounge",
      "slug": "focus-lounge",
      "aura": "Energetic & Social",
      "lofiStyle": "Lofi Hip-Hop",
      "imageUrl": "/images/spaces/focus-lounge.webp"
    }
  }
}
```

### Not Found

```text
404 Not Found
```

Returned when the booking reference does not exist.

### Conflict

```text
409 Conflict
```

Returned when the booking cannot transition to `Cancelled`.

Example:

```text
Booking is already cancelled.
```

---

# DTOs

## 13. SpaceResponse

```text
SpaceResponse
```

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

---

## 14. SessionResponse

```text
SessionResponse
```

```json
{
  "id": 12,
  "spaceId": 1,
  "spaceName": "Focus Lounge",
  "startTime": "2026-10-16T19:00:00-07:00",
  "endTime": "2026-10-16T21:00:00-07:00",
  "capacity": 24,
  "remainingSeats": 18,
  "sessionType": "Focus50_10"
}
```

`remainingSeats` is derived at request time and is not stored as an independent database value.

---

## 15. CreateBookingRequest

```text
CreateBookingRequest
```

```json
{
  "sessionId": 12,
  "customerName": "Alex Chen",
  "email": "alex@example.com",
  "seatCount": 1
}
```

The client cannot provide:

```text
status
bookingReference
createdAtUtc
cancelledAtUtc
remainingSeats
```

These values are controlled by the server.

---

## 16. BookingResponse

```text
BookingResponse
```

```json
{
  "bookingReference": "FD7K2M9Q",
  "customerName": "Alex Chen",
  "email": "alex@example.com",
  "seatCount": 1,
  "status": "Confirmed",
  "createdAtUtc": "2026-10-10T03:14:22Z",
  "cancelledAtUtc": null,
  "session": {
    "id": 12,
    "startTime": "2026-10-16T19:00:00-07:00",
    "endTime": "2026-10-16T21:00:00-07:00",
    "sessionType": "Focus50_10",
    "space": {
      "id": 1,
      "name": "Focus Lounge",
      "slug": "focus-lounge",
      "aura": "Energetic & Social",
      "lofiStyle": "Lofi Hip-Hop",
      "imageUrl": "/images/spaces/focus-lounge.webp"
    }
  }
}
```

The nested session and space information allows the booking confirmation and `My Booking` page to render the reservation without requiring multiple additional API requests.

---

# Error Responses

## 17. Error Format

The API should use ASP.NET Core `ProblemDetails` or `ValidationProblemDetails` for standardized error responses.

Example:

```json
{
  "type": "https://httpstatuses.com/409",
  "title": "Booking conflict",
  "status": 409,
  "detail": "Only 2 seats remain for this session.",
  "instance": "/api/bookings"
}
```

Validation errors may include field-specific errors.

Example:

```json
{
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "email": [
      "A valid email address is required."
    ],
    "seatCount": [
      "Seat count must be greater than zero."
    ]
  }
}
```

---

## 18. Status Code Guidelines

### `200 OK`

Used when:

- retrieving spaces
- retrieving sessions
- retrieving a booking
- successfully cancelling a booking

### `201 Created`

Used when:

- a booking is successfully created

### `400 Bad Request`

Used when:

- request data is malformed
- required fields are missing
- field validation fails
- query parameters are invalid

### `404 Not Found`

Used when:

- a requested space does not exist
- a requested session does not exist
- a requested booking does not exist

### `409 Conflict`

Used when:

- a session is full
- requested seats exceed current availability
- a session has already started
- a booking is already cancelled
- another current resource state prevents the requested operation

---

# Business Rules

## 19. Server-Side Authority

The React client may display availability and perform client-side validation for usability.

However, the backend must always independently verify:

```text
session existence
session time
current capacity
seat count
booking status
cancellation eligibility
```

Frontend state must never be treated as authoritative.

---

## 20. Capacity Enforcement

At booking time:

```text
Remaining Seats =
Session Capacity
-
Sum of SeatCount for Confirmed Bookings
```

The API must calculate this value using current database state immediately before creating the booking.

Example:

```text
Remaining Seats: 2
Requested Seats: 3

Result:
409 Conflict
```

---

## 21. Cancellation

Cancellation is an explicit application action:

```text
POST /api/bookings/{bookingReference}/cancel
```

The API does not expose:

```text
PUT /api/bookings/{bookingReference}
PATCH /api/bookings/{bookingReference}
DELETE /api/bookings/{bookingReference}
```

for the MVP.

This prevents the client from arbitrarily editing customer details, reservation state, seat counts, or server-controlled fields after creation.

---

# Manual Development Requests

## 22. `.http` File

Development requests will be maintained in:

```text
Fidora.Api.http
```

The file should contain representative requests for every endpoint.

Example:

```http
@Fidora_Api_HostAddress = https://localhost:7001

GET {{Fidora_Api_HostAddress}}/api/spaces
Accept: application/json

###

GET {{Fidora_Api_HostAddress}}/api/sessions?spaceId=1
Accept: application/json

###

POST {{Fidora_Api_HostAddress}}/api/bookings
Content-Type: application/json

{
  "sessionId": 12,
  "customerName": "Alex Chen",
  "email": "alex@example.com",
  "seatCount": 1
}

###

GET {{Fidora_Api_HostAddress}}/api/bookings/FD7K2M9Q
Accept: application/json

###

POST {{Fidora_Api_HostAddress}}/api/bookings/FD7K2M9Q/cancel
```

The `.http` file is intended for manual development and endpoint verification. Automated business-rule testing is defined separately in `Test-Plan.md`.

---

## 23. API Scope Summary

The Fidora MVP deliberately exposes a small API surface:

```text
Spaces
  ↓
Sessions
  ↓
Bookings
```

The API allows customers to discover Fidora study experiences and complete the full reservation lifecycle without introducing administrative or account-management endpoints.

The design prioritizes:

- clear REST-style resource retrieval
- explicit business operations
- predictable status codes
- server-side validation
- capacity integrity
- readable request and response contracts
- a small surface area appropriate for the MVP
