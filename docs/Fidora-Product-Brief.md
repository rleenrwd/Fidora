# Fidora — Product Brief

## 1. Product Overview

**Fidora** is a fictional student-focused startup built around a modern lofi study-lounge concept.

The business is designed to make studying feel more engaging than simply sitting in a traditional library, coffee shop, or bedroom. Fidora offers modern, visually distinctive study spaces where students can reserve seats, study around other people, and choose an environment that matches the type of atmosphere they want.

The name **Fidora** combines the ideas of **lo-fidelity** and **aura**. Every Fidora room is built around lofi music, but each space has a different aura created through its music style, lighting, visual design, seating arrangement, and session format.

Examples may include:

- lofi hip-hop in a more energetic shared lounge
- lofi jazz in a calmer late-night room
- ambient or minimalist lofi in a deep-focus space

**Tagline:**  
*Your study night out.*

This software project is the **customer-facing booking application for the fictional Fidora startup**.

The application allows students to discover Fidora's study spaces, understand the experience offered by each room, view scheduled sessions and remaining capacity, reserve seats, retrieve existing bookings, and cancel reservations.

The software does not create the physical study experience itself. Instead, it provides the digital system students use to discover and book that experience.

---

## 2. Business Problem

Studying can become repetitive and boring quickly, especially when students repeatedly use the same types of environments.

Traditional study options may be:

- visually uninspiring
- overcrowded
- distracting
- isolating
- inconsistent in atmosphere
- poorly suited to different study styles
- lacking a sense of community or experience

Even motivated students may find it harder to remain engaged when the environment itself feels stale or disconnected from how they prefer to work.

Fidora addresses this problem through the **physical business experience**.

The startup provides modern, hip, intentionally designed study spaces built around curated lofi music, distinct room auras, and a social-but-focused atmosphere. The goal is to make studying feel like somewhere students intentionally want to go — a study night out rather than another routine study session.

Different rooms allow students to choose the atmosphere that best matches their mood, energy level, or study goals.

---

## 3. Software Problem

A business built around scheduled study experiences needs a reliable way for customers to discover available spaces and reserve seats before arriving.

Without a booking system, customers would have limited visibility into:

- available study spaces
- room atmosphere and lofi style
- scheduled session times
- remaining seating capacity
- whether a session is already full
- their existing reservation details

The Fidora application solves this operational problem by providing a simple digital booking experience.

The system also protects the business from reservation errors by enforcing capacity and booking rules on the server.

---

## 4. Target User

The primary application user is a student interested in booking a Fidora study session.

Typical users may be looking for:

- a modern alternative to a traditional library or coffee shop
- a curated lofi study atmosphere
- different room vibes depending on mood or study style
- a quiet deep-work environment
- structured focus sessions
- light social interaction between study periods
- confidence that a seat will be available when they arrive
- an environment that makes studying feel less repetitive

No user account is required for the MVP.

---

## 5. Product Goals

The Fidora booking application should allow users to:

1. Discover available Fidora study spaces.
2. Understand the atmosphere, lofi style, and intended experience of each space.
3. View scheduled study sessions.
4. See remaining availability for a session.
5. Reserve one or more seats.
6. Receive confirmation of a successful booking.
7. Retrieve an existing booking.
8. Cancel an existing booking.

The application should clearly communicate the Fidora brand and study-lounge concept while keeping the reservation workflow simple.

The software should feel polished and complete while remaining intentionally small in scope.

---

## 6. Study Spaces

The fictional Fidora venue will contain a small set of predefined study spaces represented in the application.

Every study space is lofi-based. Rooms differ through their musical style, atmosphere, lighting, visual identity, seating layout, and intended study experience.

Each space includes:

- name
- description
- atmosphere or "aura"
- lofi music style
- capacity
- image
- supported session style

Example spaces may include:

### Focus Lounge

A modern shared study environment with an energetic but focused atmosphere. The room may feature **lofi hip-hop**, communal seating, and a more social visual style for students who enjoy working around others.

### Night Owl Room

A darker, calmer environment designed for evening study. The room may feature **lofi jazz**, warm lighting, and a slower, more relaxed atmosphere.

### Deep Work Booth

A high-focus environment designed for minimal distraction. The room may feature **ambient or minimalist lofi** with private or semi-private seating.

Final room names, lofi styles, and descriptions may change during UI implementation, but all spaces should remain consistent with Fidora's lofi-centered identity.

---

## 7. Session Types

Sessions represent scheduled opportunities to reserve seats within a Fidora study space.

Each session includes:

- study space
- date
- start time
- end time
- capacity
- remaining seats
- session type

### Standard Focus Session

A traditional study session where students independently use the space while experiencing the room's curated lofi atmosphere.

### 50/10 Focus Session

A structured study experience built around repeating focus and social periods.

Example:

- 50 minutes of focused study
- 10-minute optional social break
- repeat for the duration of the session

During focus periods, students study within the room's curated lofi environment. During breaks, conversation and light social interaction are encouraged but not required.

The 50/10 session is intended to provide accountability and community without requiring continuous social interaction.

---

## 8. MVP Features

### Home

The home page introduces Fidora and provides:

- hero section
- Fidora business concept
- featured study spaces
- primary booking call-to-action
- clear presentation of the lofi-centered study experience

### Our Spaces

Users can browse Fidora study spaces and view:

- space name
- image
- description
- atmosphere
- lofi style
- capacity
- supported session type

### Book a Session

Users can:

- choose a study space
- select an available session
- view remaining capacity
- select number of seats
- enter their name
- enter their email
- submit a booking

### Booking Confirmation

After a successful reservation, users receive:

- booking identifier
- study space
- date
- time
- number of seats
- confirmation status

### My Booking

Users can retrieve an existing booking and:

- view booking details
- cancel the booking

---

## 9. Core Business Rules

The application must enforce the following rules:

1. A booking cannot exceed the remaining capacity of a session.
2. A session cannot contain more reserved seats than its configured capacity.
3. A booking cannot be created for a session that has already occurred.
4. The number of seats requested must be greater than zero.
5. Required booking information must be valid before a reservation is created.
6. Cancelling a booking releases its reserved seats back into session availability.
7. A cancelled booking cannot be cancelled again.
8. Fully booked sessions must indicate that no seats remain.

Capacity enforcement is one of the primary business behaviors demonstrated by the application.

---

## 10. MVP Navigation

Fidora will use a small multi-page React interface.

Primary routes:

- `/` — Home
- `/spaces` — Our Spaces
- `/book` — Book a Session
- `/my-booking` — View or cancel a booking

A consistent navbar and footer will appear throughout the application.

---

## 11. User Experience Direction

The Fidora application should visually represent the fictional startup's physical experience.

It should feel modern, hip, social, and intentionally designed rather than like a generic CRUD application.

The interface should reinforce the idea that Fidora is a destination students would actively choose for a study night out.

The interface will use:

- dark visual theme
- navy, purple, and indigo accents
- modern typography
- rounded cards and controls
- room imagery
- icons
- clear availability indicators
- subtle hover and interaction states
- responsive layouts
- distinct visual identities for different room auras

The visual design should communicate the atmosphere of the fictional venue while keeping the booking flow simple and intuitive.

---

## 12. Out of Scope for MVP

The following features will not be implemented in the initial version:

- user registration
- authentication
- user profiles
- memberships or subscriptions
- payment processing
- email or SMS notifications
- waitlists
- administrator dashboard
- room management interface
- real-time chat
- social networking features
- music streaming
- in-app audio playback
- headphone/audio channel management
- recommendation systems
- recurring bookings
- complex scheduling tools

The lofi music styles are part of the fictional venue and each room's identity, but the MVP does not need to stream or control music inside the application.

These features may be considered future enhancements but are intentionally excluded from the MVP.

---

## 13. Success Criteria

The Fidora MVP is complete when a user can:

1. Open the application and understand what the fictional Fidora business offers.
2. Browse the available lofi study spaces.
3. Understand the aura and music style of each space.
4. View available study sessions.
5. Reserve a seat in a session.
6. Be prevented from exceeding session capacity.
7. Receive confirmation of the reservation.
8. Retrieve the booking.
9. Cancel the booking.
10. See released capacity reflected after cancellation.

The application should also include automated tests for important booking rules and a polished, responsive user interface.

---

## 14. Technology Direction

The planned implementation uses:

- React
- Vite
- ASP.NET Core Web API
- C#
- Entity Framework Core
- SQL Server
- xUnit
- Git and GitHub

API endpoints will also be exercised manually through an `.http` request file during development.

---

## 15. Project Scope

Fidora is intentionally designed as a compact full-stack project representing the customer booking system for a fictional startup.

The objective is not to simulate every feature required by a production booking platform or fully model the operations of a real physical venue.

The objective is to build a focused application with:

- clear business context
- clear software requirements
- meaningful booking rules
- a complete frontend-to-database workflow
- automated testing
- clean documentation
- polished presentation
- a distinct product identity

Fidora should demonstrate that a small software product can be thoughtfully designed, implemented, tested, and completed without unnecessary complexity while still feeling like software built for a believable real-world business.
