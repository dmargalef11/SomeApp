# 🏗️ Construction Materials ERP

**Inventory and Project Management System built with layered architecture.**

This Full Stack ERP allows construction companies to manage a polymorphic catalog of materials (Paints, Tiles, Cement) and track their usage across different renovation projects. It features real-time cost calculation and strict data integrity rules.

## 🚀 Tech Stack

*   **Backend:** C# / .NET 8 Web API
*   **Database:** SQL Server + Entity Framework Core
*   **Frontend:** React (Vite) + TypeScript
*   **Architecture:** N-Layer / Clean Architecture
*   **Styling:** CSS Modules / Custom UI Components

## ✨ Key Features

### 📦 Polymorphic Material Management
Uses **Table-Per-Hierarchy (TPH)** strategy to handle different material types with specific attributes in a single database context:
*   **Paints:** Tracks color (Hex), finish (Matte/Gloss), and water-base properties.
*   **Tiles:** Tracks dimensions, material type (Ceramic/Porcelain), and anti-slip rating.
*   **Cement:** Tracks weight, strength class, and color.

### 📋 Project & Cost Tracking
*   Create and manage renovation projects with dates and descriptions.
*   **Many-to-Many Relationship:** Link materials to projects with specific quantities and usage notes.
*   **Auto-Calculation:** Real-time calculation of total project costs based on material unit prices.

### 🛡️ Business Rules & Integrity
*   **Protective Deletion:** Implements a strict `Restrict` deletion behavior. The system prevents the deletion of any material currently assigned to an active project, returning a `409 Conflict` to the frontend with a user-friendly alert.

## 🏗️ Architecture Overview

The solution follows a clean separation of concerns:

1.  **Domain:** Core entities (`Project`, `Material`, `ProjectMaterial`) and interfaces.
2.  **Infrastructure:** EF Core implementation, Repositories (`EfMaterialRepository`), and SQL migrations.
3.  **Application:** Services (`MaterialService`) containing business logic.
4.  **API:** RESTful controllers handling HTTP requests and DTOs.
5.  **Client:** React SPA consuming the API via Axios.

## 🛠️ How to Run

### Prerequisites
*   .NET 8 SDK
*   Node.js & npm
*   SQL Server (LocalDB or Express)

### 1. Backend Setup
Navigate to the root folder and restore dependencies:
```bash
dotnet restore
