# Fidora — UI Specification

## 1. Purpose

This document defines the user interface structure, visual direction, interaction behavior, and responsive expectations for the Fidora MVP.

Fidora is the customer-facing booking application for a fictional lofi study-lounge startup.

The UI should communicate the Fidora brand clearly:

> **Fidora**  
> *Your study night out.*

The interface should feel modern, immersive, polished, and memorable while keeping the booking experience simple and easy to understand.

The MVP is intentionally small, but the visual execution should feel complete rather than like a generic CRUD application.

---

## 2. UX Goals

The Fidora interface should help users:

1. Quickly understand what Fidora is.
2. Discover the available study spaces and their different auras.
3. Understand the lofi style and intended experience of each room.
4. Find an available study session.
5. Reserve seats with minimal friction.
6. Clearly understand whether a booking succeeded or failed.
7. Retrieve an existing booking.
8. Cancel an existing booking confidently.

The UI should support these goals without adding unnecessary screens or interactions.

---

## 3. Primary Navigation

Fidora uses a compact multi-page React interface.

### Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | Introduce Fidora and surface featured spaces and primary calls to action. |
| `/spaces` | Our Spaces | Browse all Fidora study spaces and compare their auras. |
| `/book` | Book a Session | Select a space, date, session, and number of seats, then create a booking. |
| `/my-booking` | My Booking | Retrieve and cancel an existing booking. |

React Router will provide client-side routing.

---

## 4. Global Layout

Every page should include:

- top navigation
- main content area
- footer

The interface should use a consistent maximum content width and spacing system across all routes.

Suggested page structure:

```text
┌───────────────────────────────────────────────┐
│ Navbar                                        │
├───────────────────────────────────────────────┤
│                                               │
│ Main Page Content                             │
│                                               │
├───────────────────────────────────────────────┤
│ Footer                                        │
└───────────────────────────────────────────────┘
```

---

## 5. Navbar

The navbar should feel minimal and premium.

### Content

Left:

```text
Fidora
```

Primary links:

```text
Home
Our Spaces
Book a Session
My Booking
```

Primary action:

```text
Book a Session
```

The current route should have a clear active state.

### Desktop Behavior

Desktop navigation may display all links inline.

Example:

```text
Fidora     Home   Our Spaces   Book a Session   My Booking
```

The primary booking action may use a more prominent button style.

### Mobile Behavior

On smaller screens:

- collapse navigation into a menu
- preserve clear access to the booking page
- avoid horizontal overflow
- maintain comfortable touch targets

---

## 6. Footer

The footer should visually complete the application without becoming a large secondary navigation area.

Recommended content:

```text
Fidora
Your study night out.

Home
Our Spaces
Book a Session
My Booking
```

Optional secondary links may include:

```text
About
Contact
Privacy
```

These links may remain non-functional placeholders only if clearly excluded from the MVP implementation. Prefer omitting dead links from the final application.

A short brand line may also appear:

> Different auras. Same goal: lock in.

---

## 7. Visual Direction

The Fidora interface should reflect the atmosphere of a modern nighttime study lounge.

### Brand Characteristics

The interface should feel:

- modern
- hip
- calm
- immersive
- social
- focused
- premium
- student-oriented

It should not feel:

- corporate
- childish
- overly playful
- cluttered
- like a school assignment
- like a generic Bootstrap demo

---

## 8. Color Direction

The primary visual direction is a dark interface using:

- deep navy
- charcoal
- black
- purple
- indigo
- subtle neon accents

Accent colors should be used intentionally rather than across every element.

Typical usage:

```text
Backgrounds:
Deep navy / charcoal

Primary actions:
Purple / indigo

Secondary actions:
Dark neutral with border

Status:
Green for confirmed
Red or muted warning tone for destructive actions
```

The final palette should maintain sufficient text contrast.

---

## 9. Typography

Use a modern sans-serif typeface suitable for a technology and lifestyle brand.

Typography should establish a clear hierarchy:

```text
Hero Heading
Page Heading
Section Heading
Card Heading
Body Text
Metadata / Labels
```

Hero typography may be more expressive, but forms and data should remain highly readable.

The tagline:

> **Your study night out.**

should have strong visual prominence on the Home page.

---

## 10. Iconography

Icons should make the interface feel more complete and easier to scan.

Possible icon categories:

- headphones
- calendar
- clock
- users
- coffee
- moon
- sparkles
- location
- reservation / ticket
- check
- close / cancel

Icons should support meaning rather than decorate every line of text.

A single consistent icon library should be used throughout the application.

---

# Home Page

## 11. Home Page Purpose

The Home page should immediately answer:

```text
What is Fidora?
Why is it different?
What can I do here?
```

It should establish the brand before asking the user to book.

---

## 12. Hero Section

The hero should be visually strong without requiring complex functionality.

### Required Content

Brand:

```text
Fidora
```

Tagline:

```text
Your study night out.
```

Supporting copy should communicate that Fidora is a modern lofi study-lounge experience built around distinct study environments.

Example direction:

> Book curated lofi study sessions in spaces designed around different auras, moods, and ways to focus.

Primary CTA:

```text
Book a Session
```

Secondary CTA:

```text
Explore Spaces
```

### Visual

The hero may include a cinematic Fidora study-lounge image.

The image should:

- feel realistic
- match the Fidora dark visual identity
- avoid visible AI-generated text
- avoid distracting faces or unrealistic details
- represent the physical startup concept rather than the software itself

---

## 13. Featured Spaces Section

The Home page should display three featured space cards.

Initial examples:

```text
Focus Lounge
Night Owl Room
Deep Work Booth
```

Each card should contain:

- image
- space name
- aura
- lofi style
- short description
- capacity
- CTA

Example:

```text
Focus Lounge
Energetic & Social
Lofi Hip-Hop
30 seats

Explore Space
```

Clicking the card or CTA should lead to either:

```text
/spaces
```

or a preselected booking flow where appropriate.

---

## 14. Booking Preview / CTA

The Home page may include a compact booking-oriented section to reinforce the product purpose.

This should not duplicate the full booking form.

Possible content:

```text
Pick your space.
Choose your session.
Reserve your seat.
```

CTA:

```text
Book a Session
```

---

# Our Spaces Page

## 15. Our Spaces Purpose

The Our Spaces page allows users to compare the available Fidora study environments.

The page should emphasize that every room is lofi-based, but each offers a distinct aura.

---

## 16. Space Cards

Each space should be represented using a larger visual card.

Required information:

- room image
- room name
- aura
- lofi style
- description
- capacity
- supported session style

Example metadata:

```text
Aura: Calm & Late-Night
Lofi: Jazz
Capacity: 16
Session: Standard / 50-10
```

Primary CTA:

```text
Book This Space
```

The CTA should navigate to `/book` with the selected space preselected when practical.

---

## 17. Room Imagery

Each room should have its own visual identity.

### Focus Lounge

Visual direction:

- shared tables
- purple / indigo lighting
- social energy
- lofi hip-hop
- modern lounge feel

### Night Owl Room

Visual direction:

- warm or dim lighting
- darker environment
- relaxed seating
- lofi jazz
- late-night mood

### Deep Work Booth

Visual direction:

- private or semi-private seating
- minimal visual noise
- darker focused atmosphere
- ambient / minimalist lofi
- high-concentration feel

All room images should feel like spaces within the same Fidora brand.

---

# Book a Session Page

## 18. Booking Page Purpose

The booking page is the primary functional workflow of the application.

The interface should make the sequence obvious:

```text
Choose Space
    ↓
Choose Date
    ↓
Choose Session
    ↓
Choose Seats
    ↓
Enter Contact Information
    ↓
Reserve
```

---

## 19. Booking Form

The form should contain:

### Study Space

```text
Select a study space
```

### Date

```text
Select a date
```

### Available Session

Session options should display:

- start time
- end time
- session type
- remaining seats

Example:

```text
7:00 PM – 9:00 PM
50/10 Focus Session
18 seats remaining
```

### Seat Count

The user selects:

```text
1 or more seats
```

The interface should not allow a user to intentionally select more seats than currently displayed as available.

The API must still validate capacity independently.

### Customer Name

```text
Full name
```

### Email

```text
Email address
```

### Submit

Primary action:

```text
Reserve Seat
```

or:

```text
Reserve Seats
```

based on the selected quantity.

---

## 20. Availability States

Sessions should visually communicate availability.

Suggested states:

```text
Available
Limited
Full
```

Example:

```text
18 seats remaining
```

```text
Only 3 seats left
```

```text
Fully booked
```

Fully booked sessions should not be selectable.

---

## 21. 50/10 Session Presentation

The 50/10 session should be visually distinguishable from a standard session.

Badge:

```text
50/10
```

Supporting text:

```text
50 min focus
10 min optional social break
```

The user should understand the concept before reserving the session.

---

## 22. Booking Submission State

When the booking form is submitted:

- disable the primary submit action
- show a visible loading state
- prevent accidental duplicate submissions

Example:

```text
Reserving...
```

---

## 23. Booking Success State

After a successful booking, show a dedicated confirmation state.

Required information:

- booking reference
- space
- date
- time
- session type
- seat count
- confirmation status

Example:

```text
You're booked.

Booking Reference
FD7K2M9Q

Focus Lounge
Friday, October 16
7:00 PM – 9:00 PM
1 seat
Confirmed
```

The booking reference should be visually prominent because the user needs it to retrieve the reservation later.

Suggested secondary action:

```text
View My Booking
```

---

# My Booking Page

## 24. My Booking Purpose

The My Booking page allows users to retrieve an existing reservation without authentication.

---

## 25. Booking Lookup

Initial state:

```text
Find your booking
```

Input:

```text
Booking Reference
```

Action:

```text
Find Booking
```

Example:

```text
FD7K2M9Q
```

---

## 26. Booking Detail State

Once a booking is found, display:

- status
- booking reference
- space name
- room image
- aura
- lofi style
- date
- time
- session type
- seat count
- customer name
- email

Confirmed status should be easy to identify.

Example:

```text
Confirmed
```

---

## 27. Cancellation

Confirmed bookings should display:

```text
Cancel Booking
```

Cancellation is a destructive action and should not occur from a single accidental click.

Use a confirmation step such as:

```text
Cancel this booking?

This will release your reserved seat(s).

Keep Booking
Cancel Booking
```

After successful cancellation:

```text
Booking Cancelled
```

The booking remains visible with its updated status.

---

# Shared Components

## 28. Component Inventory

Likely reusable components include:

```text
Navbar
Footer
Hero
SpaceCard
SessionCard
BookingForm
AvailabilityBadge
SessionTypeBadge
BookingSummary
BookingStatusBadge
LoadingIndicator
ErrorMessage
EmptyState
ConfirmationDialog
```

Components should be reused where behavior and visual structure are genuinely shared.

---

## 29. API Service Layer

Frontend API calls should be separated from page components.

Suggested structure:

```text
src/
└── services/
    ├── spacesApi.js
    ├── sessionsApi.js
    └── bookingsApi.js
```

This keeps request logic separate from rendering logic.

---

# Application States

## 30. Loading States

Pages that depend on API data should not appear frozen while loading.

Examples:

```text
Loading spaces...
Loading sessions...
Finding your booking...
Reserving...
Cancelling...
```

Skeleton cards or subtle loading indicators may be used where visually appropriate.

---

## 31. Error States

User-facing errors should explain what happened in plain language.

Examples:

### Network Error

```text
We couldn't load Fidora right now.
Please try again.
```

### Booking Conflict

```text
Those seats are no longer available.
Choose another session or reduce the number of seats.
```

### Booking Not Found

```text
We couldn't find a booking with that reference.
```

### Already Cancelled

```text
This booking has already been cancelled.
```

Avoid displaying raw server exceptions to users.

---

## 32. Empty States

Empty states should be intentional.

Examples:

### No Sessions

```text
No sessions are available for this date.
Try another day.
```

### No Search Result

```text
No booking found.
Check your reference and try again.
```

---

## 33. Validation States

Client-side validation should improve usability but must not replace server validation.

Examples:

```text
Name is required.
Enter a valid email address.
Choose a session.
Choose at least one seat.
```

Errors should appear near the relevant field.

---

# Responsive Design

## 34. Responsive Requirements

Fidora should be fully usable on:

- desktop
- tablet
- mobile

The interface should adapt rather than simply shrink.

---

## 35. Desktop

Desktop layouts may use:

- multi-column hero sections
- three-column room grids
- booking forms with grouped fields
- wider cards

---

## 36. Tablet

Tablet layouts may reduce:

```text
3 columns → 2 columns
```

Form groups may begin stacking vertically.

---

## 37. Mobile

Mobile layouts should:

- use a collapsed navbar
- stack cards vertically
- use full-width form controls
- use full-width primary actions where appropriate
- maintain readable spacing
- avoid horizontal scrolling

The booking workflow must remain easy to complete with one hand.

---

# Accessibility

## 38. Accessibility Requirements

The MVP should follow basic accessibility practices.

Include:

- semantic HTML
- associated form labels
- keyboard-accessible controls
- sufficient color contrast
- visible focus states
- descriptive button labels
- alternative text for meaningful images
- status messages that are not communicated by color alone

Room imagery used purely for decoration may use empty alternative text where appropriate.

---

# Interaction and Motion

## 39. Hover and Focus States

Interactive elements should have visible states for:

```text
default
hover
focus
active
disabled
```

Examples include:

- nav links
- cards
- buttons
- session selectors
- form controls

---

## 40. Motion

Subtle motion may be used to make Fidora feel polished.

Acceptable examples:

- gentle card hover elevation
- button transitions
- fade or slide transitions for confirmation states
- subtle image scale on hover

Avoid:

- excessive animation
- long transitions
- distracting background movement
- effects that interfere with booking tasks

---

# Imagery

## 41. Image Strategy

Fidora represents a fictional physical startup, so custom concept imagery may be used to visualize the study spaces.

Images should be consistent in:

- photographic style
- lighting quality
- color treatment
- aspect ratio
- overall brand identity

AI-generated imagery may be used for the fictional venue concept, but final assets should avoid common generation artifacts.

Avoid:

- malformed hands
- distorted furniture
- unreadable generated signage
- fake embedded text
- inconsistent architecture between room images

Any visible Fidora text, badges, or room labels should be rendered by the application rather than baked into the image.

---

# Visual Reference

## 42. UI Concept Direction

The approved visual direction is based on the Fidora concept mockup created during project planning.

Key characteristics to preserve:

- dark premium interface
- purple / indigo accents
- strong hero presentation
- visually rich study-space cards
- compact booking panel
- clear navigation
- modern iconography
- cinematic room imagery
- polished footer

The implementation should simplify the concept mockup to the actual MVP functionality rather than reproducing unsupported features.

The following concept-only elements are not required:

- music player
- community feed
- membership system
- user profile dashboard
- social networking
- complex account controls

---

# MVP UI Boundaries

## 43. Included

The Fidora MVP UI includes:

```text
Navbar
Footer
Home page
Our Spaces page
Book a Session page
My Booking page
Space cards
Session selection
Booking form
Booking confirmation
Booking lookup
Booking cancellation
Loading states
Error states
Empty states
Responsive behavior
Icons
Room imagery
```

---

## 44. Excluded

The MVP UI does not include:

```text
Sign Up
Login
User Profile
Admin Dashboard
Payment Checkout
Membership Management
Music Playback
Playlist Selection
Chat
Community Feed
Notifications Center
Waitlist Interface
```

These should not appear as fake or non-functional controls in the finished application.

---

## 45. UI Completion Criteria

The Fidora UI is considered complete when:

1. All four primary routes are implemented.
2. Navigation and footer are consistent across pages.
3. Users can browse all study spaces.
4. Users can understand each room's aura and lofi style.
5. Users can complete the booking flow from the interface.
6. Success and failure states are clearly displayed.
7. Users can retrieve an existing booking.
8. Users can cancel a confirmed booking.
9. The application is responsive across desktop and mobile layouts.
10. Loading, empty, error, validation, and disabled states are implemented.
11. The final interface visually reflects the Fidora brand and does not resemble a generic starter template.
12. The interface remains aligned with the MVP API defined in `API-Specification.md`.

---

## 46. UI Summary

Fidora's interface should make a small application feel like a complete product.

The design should support the core journey:

```text
Discover Fidora
      ↓
Explore an Aura
      ↓
Choose a Session
      ↓
Reserve a Seat
      ↓
Receive Confirmation
      ↓
Retrieve or Cancel Booking
```

The visual experience is intentionally important because Fidora represents a lifestyle-oriented physical study-lounge concept.

The UI should therefore balance:

```text
Brand
+
Atmosphere
+
Usability
+
Clear booking behavior
```

without expanding the application beyond its intended MVP scope.
