# Fidora — Architecture

## 1. Architecture Overview

Fidora is a small full-stack web application consisting of a React frontend, an ASP.NET Core Web API, and a SQL Server database accessed through Entity Framework Core.

The application is intentionally designed as a modular monolith rather than a distributed system. The goal is to keep the architecture easy to understand and maintain while still separating user interface, API, business logic, and data-access responsibilities.

### High-Level Architecture

```text
┌──────────────────────────────┐
│        React Client          │
│       Fidora.Client           │
│                              │
│  Pages / Components / UI     │
└──────────────┬───────────────┘
               │
               │ HTTP / JSON
               ▼
┌──────────────────────────────┐
│     ASP.NET Core Web API     │
│         Fidora.Api            │
│                              │
│ Controllers                  │
│ DTOs                         │
│ Services / Business Logic    │
│ EF Core                      │
└──────────────┬───────────────┘
               │
               │ EF Core
               ▼
┌──────────────────────────────┐
│         SQL Server           │
│                              │
│ Spaces                       │
│ Sessions                     │
│ Bookings                     │
└──────────────────────────────┘
```

Automated tests are maintained separately in `Fidora.Tests`.

---

## 2. Technology Stack

### Frontend

- React
- Vite
- React Router
- JavaScript
- HTML
- CSS
- Bootstrap or lightweight custom styling
- Icon library

### Backend

- C#
- ASP.NET Core Web API
- Entity Framework Core
- LINQ
- Dependency Injection
- async/await

### Database

- SQL Server

### Testing

- xUnit
- ASP.NET Core integration testing where appropriate
- `.http` request file for manual API testing

### Development Tools

- Visual Studio
- Visual Studio Code
- Git
- GitHub

---

## 3. Solution Structure

The repository will contain three primary application projects and supporting documentation.

```text
fidora/
│
├── Fidora.Api/
│   ├── Controllers/
│   ├── Data/
│   ├── DTOs/
│   ├── Models/
│   ├── Services/
│   ├── Program.cs
│   └── Fidora.Api.http
│
├── Fidora.Client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── Fidora.Tests/
│
├── docs/
│   ├── Product-Brief.md
│   ├── Architecture.md
│   ├── Data-Model.md
│   ├── API-Design.md
│   └── Test-Plan.md
│
└── README.md
```

The structure may evolve slightly during implementation, but the separation between client, API, tests, and documentation will remain.

---

## 4. Frontend Architecture

`Fidora.Client` is responsible for presentation and user interaction.

The frontend will not contain booking business rules that must be enforced by the system. Rules such as capacity enforcement and whether a session can still be booked will be enforced by the API.

The client is responsible for:

- displaying study spaces
- displaying available sessions
- collecting booking information
- sending API requests
- displaying validation messages
- showing booking confirmations
- retrieving existing bookings
- requesting booking cancellation
- reflecting remaining session availability

### Primary Routes

```text
/              Home
/spaces        Our Spaces
/book          Book a Session
/my-booking    View or cancel a booking
```

React Router will provide client-side navigation.

---

## 5. Frontend Components

Reusable components may include:

```text
Navbar
Footer
Hero
SpaceCard
SessionCard
BookingForm
AvailabilityBadge
BookingConfirmation
LoadingIndicator
ErrorMessage
```

Pages should compose reusable components rather than duplicating interface logic.

---

## 6. API Architecture

`Fidora.Api` exposes the application's REST endpoints and contains the core booking behavior.

The API is organized into several responsibilities:

### Controllers

Controllers receive HTTP requests and return HTTP responses.

Controllers should remain relatively thin and delegate business operations to services rather than containing significant booking logic.

Example:

```text
POST /api/bookings
        ↓
BookingsController
        ↓
BookingService
        ↓
Application rules + EF Core
        ↓
SQL Server
```

### DTOs

Data Transfer Objects define the information accepted from and returned to the frontend.

DTOs prevent API consumers from directly interacting with database entities and allow request and response models to evolve independently from the persistence model.

Example DTOs may include:

```text
CreateBookingRequest
BookingResponse
SpaceResponse
SessionResponse
```

### Services

Services contain the application's primary business logic.

Examples include:

```text
BookingService
SessionService
SpaceService
```

The `BookingService` will be responsible for rules such as:

- validating requested seat count
- verifying the session exists
- preventing bookings for past sessions
- checking remaining capacity
- creating reservations
- cancelling reservations
- restoring capacity after cancellation

### Data Layer

Entity Framework Core handles persistence between the API and SQL Server.

`FidoraDbContext` will expose entity collections and configure relationships between the primary domain models.

---

## 7. Request Flow

A typical booking request follows this path:

```text
User selects a session
        ↓
React BookingForm
        ↓
POST /api/bookings
        ↓
BookingsController
        ↓
CreateBookingRequest DTO
        ↓
BookingService
        ↓
Validate session and capacity
        ↓
Entity Framework Core
        ↓
SQL Server
        ↓
Booking saved
        ↓
201 Created
        ↓
BookingResponse DTO
        ↓
React displays confirmation
```

The API remains the authoritative source for whether a booking is valid.

---

## 8. Data Model

The initial domain consists of three primary entities:

```text
Space
Session
Booking
```

### Relationship Overview

```text
Space
  │
  │ 1
  │
  └──────────── *
             Session
                │
                │ 1
                │
                └──────────── *
                           Booking
```

A study space may contain many scheduled sessions.

A session belongs to one study space and may contain many bookings.

A booking belongs to one session.

Detailed fields and constraints are defined in `Data-Model.md`.

---

## 9. Availability and Capacity

Remaining capacity will be derived from the session capacity and active reservations rather than being treated as independently editable data.

Conceptually:

```text
Remaining Seats =
Session Capacity - Active Reserved Seats
```

Example:

```text
Session Capacity:        20
Active Reserved Seats:   16
Remaining Seats:          4
```

If a user attempts to reserve five seats, the API rejects the request.

If a booking containing two seats is cancelled, those two seats become available again.

The server will always enforce this rule even if the frontend previously displayed available capacity.

---

## 10. Booking Status

Bookings will maintain a simple status indicating their current state.

Initial statuses:

```text
Confirmed
Cancelled
```

A cancelled booking remains stored rather than being physically deleted from the database.

This preserves booking history while allowing availability calculations to ignore cancelled reservations.

---

## 11. API Communication

The frontend communicates with the backend using HTTP and JSON.

Example:

```text
React
  ↓
POST /api/bookings
Content-Type: application/json
```

Example request:

```json
{
  "sessionId": 12,
  "customerName": "Robert Norwood",
  "email": "robert@example.com",
  "seatCount": 1
}
```

Example response:

```json
{
  "id": 42,
  "sessionId": 12,
  "customerName": "Robert Norwood",
  "seatCount": 1,
  "status": "Confirmed"
}
```

Exact contracts will be defined in `API-Design.md`.

---

## 12. Error Handling

The API should return meaningful HTTP status codes rather than generic success or failure responses.

Examples:

```text
200 OK
Successful retrieval or cancellation.

201 Created
Booking successfully created.

400 Bad Request
Invalid request or business rule violation.

404 Not Found
Requested session or booking does not exist.

409 Conflict
Booking cannot be completed because session capacity is no longer available.
```

The frontend should display clear user-facing messages based on these responses.

---

## 13. Dependency Injection

ASP.NET Core dependency injection will be used to provide services and infrastructure dependencies.

Conceptually:

```text
BookingsController
        ↓
IBookingService
        ↓
BookingService
        ↓
FidoraDbContext
```

Interfaces may be used where they provide clear value for separation and testing.

The project will avoid unnecessary abstractions solely for the purpose of increasing architectural complexity.

---

## 14. Asynchronous Operations

Database and API operations that perform I/O will use asynchronous APIs.

Examples:

```csharp
ToListAsync()
FirstOrDefaultAsync()
SaveChangesAsync()
```

Service and controller methods will use `Task` and `async/await` where appropriate.

---

## 15. Testing Architecture

Automated testing will live in `Fidora.Tests`.

Priority will be given to behavior that could cause incorrect reservations or inconsistent availability.

Examples include:

```text
Valid booking succeeds.

Booking fails when requested seats exceed remaining capacity.

Booking fails for a past session.

Cancelling a confirmed booking succeeds.

Cancelling an already cancelled booking fails.

Cancelled seats become available again.
```

Manual API requests will also be maintained in `Fidora.Api.http` during development.

Detailed testing strategy will be defined in `Test-Plan.md`.

---

## 16. Authentication

Authentication and user accounts are intentionally excluded from the MVP.

Users will provide identifying information when creating a booking.

The application architecture should not prevent authentication from being added later, but no authentication infrastructure will be introduced solely for hypothetical future requirements.

---

## 17. Deployment

The application will be developed so the frontend, API, and relational database can be deployed independently.

The exact hosting platform is not required to be finalized before development begins.

The deployment target should support:

```text
React static frontend
ASP.NET Core API
SQL Server-compatible relational database
```

Deployment configuration will remain intentionally lightweight for the MVP.

---

## 18. Architectural Principles

Fidora will follow several simple architectural principles:

### Keep controllers thin

Controllers coordinate HTTP requests and responses. Business logic belongs in services.

### Keep business rules on the server

The frontend may improve usability, but the API remains responsible for enforcing booking rules.

### Keep the data model small

Only entities required by the MVP will be introduced.

### Prefer clear code over unnecessary abstraction

Patterns and interfaces should solve real problems rather than exist only to make the project appear more sophisticated.

### Build for completion

Architectural decisions should support a polished, maintainable application without expanding Fidora beyond its intended scope.

---

## 19. Future Extensibility

The architecture could later support additional features such as:

- authentication
- user profiles
- administrator tools
- memberships
- payments
- waitlists
- notifications
- recurring sessions
- real-world venue management
- analytics

These capabilities are not required for the MVP and will not influence implementation unless necessary.

---

## 20. Architecture Summary

Fidora uses a straightforward full-stack architecture:

```text
React
   ↓
ASP.NET Core Web API
   ↓
Application Services
   ↓
Entity Framework Core
   ↓
SQL Server
```

This structure provides enough separation to demonstrate modern full-stack development practices while remaining appropriately sized for a small, complete application.
