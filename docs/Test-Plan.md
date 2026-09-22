# Fidora — Test Plan

## 1. Purpose

This document defines the testing approach for the Fidora MVP.

Fidora is a small full-stack booking application, so testing will focus on the behaviors most likely to affect reservation accuracy, capacity integrity, and the customer booking experience.

The goal is not to create an oversized enterprise QA process. The goal is to provide clear evidence that the important workflows and business rules work correctly.

---

## 2. Testing Goals

Testing should verify that:

1. Customers can browse study spaces and sessions.
2. Valid bookings can be created successfully.
3. Invalid bookings are rejected.
4. Session capacity is enforced correctly.
5. Cancelled bookings release capacity.
6. Booking retrieval works using the booking reference.
7. The React client handles loading, success, empty, validation, and error states correctly.
8. The application behaves correctly across desktop and mobile layouts.

---

## 3. Testing Scope

The MVP testing strategy includes:

- unit tests
- service/business-rule tests
- API integration tests where appropriate
- manual endpoint testing through `Fidora.Api.http`
- frontend workflow testing
- responsive UI verification

Testing will prioritize business behavior over achieving an arbitrary code-coverage percentage.

---

## 4. Automated Test Project

Automated tests will live in:

```text
Fidora.Tests
```

The primary test framework will be:

```text
xUnit
```

Additional ASP.NET Core testing packages may be used for integration testing where they provide clear value.

---

## 5. Unit and Business-Rule Tests

The highest-priority automated tests cover booking behavior.

### Booking Creation

#### Valid booking succeeds

Given:

```text
Session Capacity: 20
Confirmed Seats: 10
Requested Seats: 2
```

Expected:

```text
Booking is created.
Status = Confirmed.
SeatCount = 2.
```

---

#### Booking fails when requested seats exceed availability

Given:

```text
Session Capacity: 20
Confirmed Seats: 18
Remaining Seats: 2
Requested Seats: 3
```

Expected:

```text
Booking is rejected.
No booking is created.
```

The API should eventually represent this condition as:

```text
409 Conflict
```

---

#### Booking fails when session is full

Given:

```text
Session Capacity: 20
Confirmed Seats: 20
Remaining Seats: 0
```

Expected:

```text
Booking is rejected.
```

---

#### Booking fails when seat count is zero

Input:

```text
SeatCount = 0
```

Expected:

```text
Validation fails.
```

---

#### Booking fails when seat count is negative

Input:

```text
SeatCount = -1
```

Expected:

```text
Validation fails.
```

---

#### Booking fails when session does not exist

Input:

```text
SessionId = invalid ID
```

Expected:

```text
Booking is rejected.
```

The API should eventually represent this as:

```text
404 Not Found
```

---

#### Booking fails for a session that has already started

Given:

```text
Current Time > Session.StartTime
```

Expected:

```text
Booking is rejected.
```

The API should eventually represent this as:

```text
409 Conflict
```

---

## 6. Booking Reference Tests

### Booking reference is generated

Expected:

```text
A successful booking receives a non-empty booking reference.
```

### Booking reference is unique

Expected:

```text
Two separate bookings do not receive the same booking reference.
```

### Booking reference remains unchanged

Expected:

```text
Cancellation does not replace or regenerate the booking reference.
```

---

## 7. Cancellation Tests

### Confirmed booking can be cancelled

Given:

```text
Booking Status = Confirmed
```

Expected:

```text
Status = Cancelled
CancelledAtUtc is populated.
```

---

### Cancelled booking cannot be cancelled again

Given:

```text
Booking Status = Cancelled
```

Expected:

```text
Second cancellation is rejected.
```

The API should eventually represent this as:

```text
409 Conflict
```

---

### Cancellation releases reserved capacity

Given:

```text
Session Capacity: 20
Confirmed Seats: 18

Booking to cancel:
SeatCount = 2
```

Before cancellation:

```text
Remaining Seats = 2
```

After cancellation:

```text
Remaining Seats = 4
```

---

### Cancellation does not delete booking

Expected:

```text
Cancelled booking remains retrievable.
Status = Cancelled.
```

---

## 8. Availability Tests

### Remaining seats are calculated from confirmed bookings

Formula:

```text
Remaining Seats =
Session Capacity
-
Sum of SeatCount for Confirmed Bookings
```

Expected:

```text
Cancelled bookings are excluded.
```

---

### Availability never becomes negative

Expected:

```text
The system must reject any booking that would cause confirmed seat totals to exceed session capacity.
```

---

## 9. Session Tests

### Session returns current availability

Expected response includes:

```text
capacity
remainingSeats
sessionType
```

### Session capacity cannot exceed space capacity

Example:

```text
Space Capacity = 20
Session Capacity = 25
```

Expected:

```text
Invalid configuration is rejected.
```

---

## 10. Space Tests

### Spaces can be retrieved

Expected:

```text
GET /api/spaces
returns available Fidora spaces.
```

### Space lookup returns correct data

Expected fields:

```text
name
slug
description
aura
lofiStyle
capacity
imageUrl
```

### Invalid space ID returns not found

Expected:

```text
404 Not Found
```

---

## 11. API Integration Tests

Where appropriate, integration tests should verify the API boundary rather than only the service layer.

Priority scenarios:

```text
POST /api/bookings
GET /api/bookings/{bookingReference}
POST /api/bookings/{bookingReference}/cancel
GET /api/sessions
GET /api/sessions/{id}
```

Integration tests should verify:

- HTTP status code
- serialized response body
- validation response behavior
- database state after the request

---

## 12. HTTP Status Verification

The API should return the status codes defined in `API-Specification.md`.

### Expected mappings

```text
200 OK
Successful retrieval or cancellation.

201 Created
Booking successfully created.

400 Bad Request
Request validation failed.

404 Not Found
Requested resource does not exist.

409 Conflict
Current application state prevents the operation.
```

---

## 13. Error Response Verification

Error responses should use ASP.NET Core `ProblemDetails` or `ValidationProblemDetails`.

Tests should verify that errors are:

- structured
- readable
- appropriate to the HTTP status
- safe for the client to display

Raw exception details should not be exposed to users.

---

## 14. Manual API Testing

Manual endpoint checks will be maintained in:

```text
Fidora.Api.http
```

The `.http` file should include requests for:

```text
GET /api/spaces
GET /api/spaces/{id}

GET /api/sessions
GET /api/sessions/{id}

POST /api/bookings
GET /api/bookings/{bookingReference}
POST /api/bookings/{bookingReference}/cancel
```

Manual requests should cover both successful and unsuccessful scenarios.

Examples:

```text
valid booking
over-capacity booking
invalid email
missing booking reference
already-cancelled booking
```

---

## 15. Frontend Functional Testing

The React client should be manually verified against the complete customer journey.

### Home

Verify:

- page loads correctly
- Fidora branding is visible
- featured spaces render
- navigation works
- CTA buttons route correctly

### Our Spaces

Verify:

- all spaces render
- images display correctly
- aura and lofi style are shown
- booking CTA routes correctly

### Book a Session

Verify:

- space can be selected
- date can be selected
- sessions load correctly
- availability is visible
- fully booked sessions cannot be selected
- valid booking submits successfully
- invalid input displays useful validation
- duplicate submissions are prevented while loading

### My Booking

Verify:

- valid booking reference retrieves booking
- invalid reference shows not-found state
- confirmed booking can be cancelled
- cancelled booking remains visible
- cancelled booking cannot be cancelled again

---

## 16. UI State Testing

The following states should be deliberately tested.

### Loading

```text
Loading spaces...
Loading sessions...
Reserving...
Finding your booking...
Cancelling...
```

### Empty

```text
No sessions available.
No booking found.
```

### Error

```text
Network failure
API validation failure
Booking conflict
Resource not found
```

### Success

```text
Booking confirmed
Booking retrieved
Booking cancelled
```

---

## 17. Responsive Testing

The application should be checked at representative viewport sizes.

Suggested categories:

```text
Desktop
Tablet
Mobile
```

Verify:

- navigation remains usable
- no horizontal overflow occurs
- forms remain readable
- cards stack correctly
- primary actions remain easy to tap
- text and controls do not overlap
- images crop intentionally

---

## 18. Accessibility Checks

Basic accessibility verification should include:

- keyboard navigation
- visible focus states
- associated form labels
- sufficient contrast
- descriptive button text
- image alternative text where needed
- validation messages near relevant fields
- status not communicated by color alone

---

## 19. Test Data

Seed data should include enough variation to test realistic states.

Recommended examples:

### Spaces

```text
Focus Lounge
Night Owl Room
Deep Work Booth
```

### Sessions

Include:

```text
available session
nearly full session
fully booked session
50/10 session
standard session
future session
past session
```

### Bookings

Include or create during testing:

```text
confirmed booking
cancelled booking
multi-seat booking
```

---

## 20. Definition of Done for Testing

Testing for the MVP is complete when:

1. Core booking business rules have automated coverage.
2. Capacity enforcement has automated coverage.
3. Cancellation behavior has automated coverage.
4. Booking retrieval has been verified.
5. API status codes match the API specification.
6. Representative endpoints have been exercised through `Fidora.Api.http`.
7. The complete frontend booking journey works.
8. Error and empty states have been verified.
9. Desktop and mobile layouts have been checked.
10. No known defect prevents the primary reservation workflow.

---

## 21. Test Summary

Fidora's testing strategy focuses on the workflows where defects would matter most:

```text
Discover
   ↓
Select Session
   ↓
Reserve
   ↓
Enforce Capacity
   ↓
Retrieve
   ↓
Cancel
   ↓
Restore Availability
```

The project should demonstrate that even a small application can have deliberate, meaningful automated and manual testing without introducing unnecessary QA overhead.
