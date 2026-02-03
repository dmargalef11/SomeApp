# RoomFlow ERP

**Inventory and Project Management System built with layered architecture.**

This Full Stack ERP allows construction companies to manage a polymorphic catalog of materials (Paints, Tiles, Cement) and track their usage across different renovation projects. It features real-time cost calculation and strict data integrity rules.

## Tech Stack

*   **Backend:** C# / .NET 8 Web API
*   **Database:** SQL Server + Entity Framework Core
*   **Frontend:** React (Vite) + TypeScript
*   **Architecture:** N-Layer / Clean Architecture
*   **Styling:** CSS Modules / Custom UI Components

## Key Features

### Polymorphic Material Management
Uses **Table-Per-Hierarchy (TPH)** strategy to handle different material types with specific attributes in a single database context:
*   **Paints:** Tracks color (Hex), finish (Matte/Gloss), and water-base properties.
*   **Tiles:** Tracks dimensions, material type (Ceramic/Porcelain), and anti-slip rating.
*   **Cement:** Tracks weight, strength class, and color.

### Project & Cost Tracking
*   Create and manage renovation projects with dates and descriptions.
*   **Many-to-Many Relationship:** Link materials to projects with specific quantities and usage notes.
*   **Auto-Calculation:** Real-time calculation of total project costs based on material unit prices.

### Business Rules & Integrity
*   **Protective Deletion:** Implements a strict `Restrict` deletion behavior. The system prevents the deletion of any material currently assigned to an active project, returning a `409 Conflict` to the frontend with a user-friendly alert.

## Architecture Overview

The solution follows a strict **Clean Architecture (N-Layer)** pattern, separating concerns into distinct projects to ensure maintainability and scalability:

*   **Domain:** The core of the system. Contains enterprise entities (`Material`, `Project`, `Distributor`) and repository interfaces (`IMaterialRepository`). It has no dependencies on other layers.
*   **Application:** Contains the business logic and service layer (`MaterialService`). It orchestrates data flow between the API and the Domain.
*   **Infrastructure:** Handles external concerns. Implements the data access layer using **Entity Framework Core** (`EfMaterialRepository`, `AppDbContext`).
*   **API:** The entry point. A .NET 8 Web API with RESTful controllers that exposes endpoints to the client.
*   **Frontend:** A React (Vite) + TypeScript Single Page Application (SPA) that consumes the API.
*   **Migrations:** Manages database schema evolution and versioning.
*   **Tests:** Unit and integration tests to ensure system reliability.


### Prerequisites
*   .NET 8 SDK
*   Node.js & npm
*   SQL Server (LocalDB or Express)

