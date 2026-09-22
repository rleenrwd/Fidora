# Fidora — Deployment

## 1. Purpose

This document defines the deployment architecture for the Fidora MVP.

Fidora will be deployed to Azure using a deliberately lightweight architecture that fits the size of the application while still demonstrating a complete production-style deployment.

The production stack is:

```text
React Client
    ↓
Azure Static Web Apps

ASP.NET Core Web API
    ↓
Azure App Service

Entity Framework Core
    ↓
Azure SQL Database
```

The deployment is intentionally simpler than the infrastructure planned for larger projects such as Signaled. Fidora does not require containers, messaging infrastructure, distributed tracing, or other enterprise-scale cloud components.

---

## 2. Deployment Goals

The Fidora deployment should:

1. Make the React application publicly accessible.
2. Make the ASP.NET Core API publicly accessible.
3. Use a persistent Azure SQL database.
4. Allow the frontend to communicate securely with the API.
5. Keep production secrets outside source control.
6. Use HTTPS.
7. Support Entity Framework Core migrations.
8. Remain inexpensive and simple to maintain.
9. Demonstrate a complete React + ASP.NET Core + Azure SQL deployment.

---

## 3. Production Architecture

```text
                    GitHub Repository
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       Fidora.Client               Fidora.Api
        React + Vite              ASP.NET Core
              │                         │
              ▼                         ▼
   Azure Static Web Apps        Azure App Service
              │                         │
              │      HTTPS / JSON       │
              └────────────►────────────┘
                                        │
                                        │ EF Core
                                        ▼
                              Azure SQL Database
```

### Responsibilities

**Azure Static Web Apps**
- hosts the React production build
- serves the customer-facing Fidora interface
- provides the public frontend URL
- supports SPA routing

**Azure App Service**
- hosts the ASP.NET Core Web API
- executes booking business logic
- performs validation and capacity checks
- communicates with Azure SQL through Entity Framework Core

**Azure SQL Database**
- persists spaces, sessions, and bookings
- provides the relational database used by the production API

---

## 4. Frontend Deployment — Azure Static Web Apps

`Fidora.Client` will be deployed to **Azure Static Web Apps**.

### Production Build

```bash
npm install
npm run build
```

Vite produces the production files in:

```text
dist/
```

Azure Static Web Apps will serve these files publicly.

### Required Behavior

The deployment must support:

- HTTPS
- React Router SPA fallback
- environment-specific API configuration
- public access
- responsive application assets

### Production URL

To be added after deployment:

```text
Frontend URL:
```

---

## 5. API Deployment — Azure App Service

`Fidora.Api` will be deployed to **Azure App Service**.

The App Service will run the project's selected .NET runtime and host the ASP.NET Core API.

### Responsibilities

The deployed API will expose:

```text
GET    /api/spaces
GET    /api/spaces/{id}

GET    /api/sessions
GET    /api/sessions/{id}

POST   /api/bookings
GET    /api/bookings/{bookingReference}
POST   /api/bookings/{bookingReference}/cancel
```

### Production Configuration

The production environment should:

- run with `ASPNETCORE_ENVIRONMENT=Production`
- use the Azure SQL production connection
- disable development exception pages
- use HTTPS
- return structured API errors
- allow requests only from the expected frontend origin where practical

### Production URL

To be added after deployment:

```text
API URL:
```

---

## 6. Database Deployment — Azure SQL Database

Fidora will use **Azure SQL Database** for production persistence.

The database contains:

```text
Spaces
Sessions
Bookings
```

Entity Framework Core will map the application entities to Azure SQL.

### Production Requirements

The database should include:

- primary keys
- foreign keys
- unique indexes
- enum conversions
- configured string lengths
- restrictive delete behavior
- required fields

The schema must remain aligned with:

```text
Data-Model.md
ERD.md
```

---

## 7. Entity Framework Core Migrations

Database schema changes will be managed through Entity Framework Core migrations.

Typical development flow:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Migration files should be committed to Git.

### Production Deployment

Before applying migrations to Azure SQL:

1. Confirm the production connection is correct.
2. Review the generated migration.
3. Build and test the API.
4. Apply the migration to Azure SQL.
5. Verify the expected tables and constraints.

The exact production migration command or deployment mechanism will be documented once the Azure resources are created.

---

## 8. Seed Data

Fidora requires initial data so the deployed application immediately represents the fictional business.

Production seed data should include the core Fidora spaces:

```text
Focus Lounge
Night Owl Room
Deep Work Booth
```

Each space should include:

- name
- slug
- description
- aura
- lofi style
- capacity
- image URL

The database should also contain representative future sessions so the booking flow can be used after deployment.

Seed logic must avoid creating duplicate records every time the API starts.

---

## 9. Environment Configuration

Development and production settings must remain separate.

### Development

Typical local configuration may use:

```text
appsettings.Development.json
local SQL Server connection
local Vite frontend
```

### Production

Production configuration should use:

```text
Azure App Service application settings
Azure SQL connection configuration
Fidora production frontend origin
```

Sensitive values must not be hardcoded into source files.

---

## 10. Connection String

The production SQL connection string must not be committed to Git.

The API should retrieve the production database connection from Azure App Service configuration.

Conceptually:

```text
ConnectionStrings__FidoraDatabase
```

ASP.NET Core can then read:

```csharp
builder.Configuration.GetConnectionString("FidoraDatabase")
```

The final secret-bearing connection string should never appear in repository documentation.

---

## 11. Frontend API Configuration

The React application must know the public URL of `Fidora.Api`.

Use a Vite environment variable:

```text
VITE_API_BASE_URL
```

### Development

Example:

```text
VITE_API_BASE_URL=https://localhost:7001
```

### Production

Example:

```text
VITE_API_BASE_URL=https://<fidora-api>.azurewebsites.net
```

The frontend API service layer should use this configuration rather than hardcoding URLs in React components.

---

## 12. CORS

Because Azure Static Web Apps and Azure App Service will normally use different origins, the API must allow requests from the deployed Fidora frontend.

### Development Example

```text
http://localhost:5173
```

### Production Example

```text
https://<fidora-frontend>.azurestaticapps.net
```

Production CORS should not use an unrestricted allow-any-origin policy unless there is a specific reason to do so.

---

## 13. HTTPS

Production communication must use HTTPS.

Traffic flow:

```text
Browser
   │ HTTPS
   ▼
Azure Static Web Apps
   │ HTTPS
   ▼
Azure App Service
   │ encrypted SQL connection
   ▼
Azure SQL Database
```

The frontend should never call the production API over plain HTTP.

---

## 14. GitHub Integration

The project repository is hosted on GitHub.

Azure Static Web Apps may use GitHub-based deployment for the React client.

The API may also be deployed from GitHub using an App Service deployment workflow.

The final CI/CD workflow may be added during implementation, but deployment automation should remain proportionate to the project size.

The MVP does not require a large custom pipeline.

---

## 15. Build Verification

Before deployment:

### Frontend

```bash
npm install
npm run build
```

### Backend

```bash
dotnet restore
dotnet build
dotnet test
```

Deployment should not proceed while automated tests are failing.

---

## 16. Production Verification

After deployment, verify the complete Fidora flow using the Azure-hosted application.

### Frontend

Verify:

- the site loads over HTTPS
- navbar routing works
- room images load
- mobile layout works
- booking forms render correctly

### API

Verify:

```text
GET /api/spaces
GET /api/sessions
```

return expected production data.

### Booking Workflow

Perform one end-to-end booking test:

```text
Browse Space
    ↓
Select Session
    ↓
Reserve Seat
    ↓
Receive Booking Reference
    ↓
Retrieve Booking
    ↓
Cancel Booking
    ↓
Verify Capacity Is Restored
```

---

## 17. Production Error Handling

The production API must not expose:

- development stack traces
- local paths
- database credentials
- detailed internal exceptions

Errors should use the structured responses defined in:

```text
API-Specification.md
```

Examples include:

```text
400 Bad Request
404 Not Found
409 Conflict
500 Internal Server Error
```

where appropriate.

---

## 18. Logging

Fidora will use standard ASP.NET Core logging.

Useful events may include:

- API startup failures
- unexpected exceptions
- database connection failures
- booking operation failures

The MVP does not require Application Insights, distributed tracing, OpenTelemetry, or a dedicated observability stack.

Those capabilities would add unnecessary infrastructure for the size of Fidora.

---

## 19. Azure Resource Naming

Final names may depend on Azure availability, but resources should use a consistent naming pattern.

Example:

```text
Frontend:
fidora-web

API:
fidora-api

Database:
fidora-db
```

Azure-generated hostnames may differ from these logical names.

---

## 20. Production Resource Record

Complete this section after Azure resources are created.

### Azure Static Web Apps

```text
Resource Name:
Region:
Frontend URL:
GitHub Deployment:
```

### Azure App Service

```text
Resource Name:
App Service Plan:
Region:
API URL:
Runtime:
```

### Azure SQL Database

```text
Server:
Database:
Region:
Service Tier:
```

Do not record passwords or secret-bearing connection strings in this file.

---

## 21. README Integration

Once deployment is complete, `README.md` should include:

- live Fidora frontend link
- screenshots
- technology stack
- project overview
- key features
- architecture summary
- links to project documentation

The documentation section should link to:

```text
Product Brief
Architecture
Data Model
ERD
API Specification
UI Specification
Test Plan
Deployment
```

---

## 22. Deployment Completion Criteria

Fidora's deployment is complete when:

1. `Fidora.Client` is hosted on Azure Static Web Apps.
2. `Fidora.Api` is hosted on Azure App Service.
3. Azure SQL Database stores persistent production data.
4. The frontend communicates successfully with the deployed API.
5. HTTPS is used throughout public traffic.
6. Production secrets are excluded from Git.
7. EF Core migrations have been applied successfully.
8. Production seed data is available.
9. CORS is configured correctly.
10. The complete booking lifecycle works in production.
11. The final Azure URLs are documented.
12. The public README links to the live application.

---

## 23. Deployment Summary

The locked Fidora production architecture is:

```text
GitHub
   │
   ├── React + Vite
   │       ↓
   │   Azure Static Web Apps
   │
   └── ASP.NET Core
           ↓
       Azure App Service
           ↓
       Azure SQL Database
```

This deployment gives Fidora a real cloud-hosted production environment while keeping the infrastructure appropriate for a small full-stack application.

The project demonstrates deployment of a modern React frontend, ASP.NET Core API, Entity Framework Core data layer, and relational Azure database without introducing unnecessary enterprise infrastructure.
