# Collaborative ToDo Application

A full-stack collaborative ToDo application built with **Next.js (frontend)** and **NestJS (backend)**. Designed to support **real-time collaboration**, **role-based access**, and **task management** with a clean, responsive UI.

## Features

### 🔐 Authentication

* User sign up, login, and logout
* JWT-based authentication for secure API access

### 📂 ToDo App Management

* Create and manage multiple ToDo apps (e.g., *Work Tasks*, *Project Alpha*)
* Each app contains its own list of tasks

### ✅ Task Management

* Add, update, delete, and mark tasks (`in-progress`, `completed`, `stale`)
* Support for task priorities (`low`, `medium`, `high`) and optional due dates

### 👥 Collaboration & Permissions

* Invite users to collaborate on a ToDo app
* Assign roles:

  * **Owner**: Full control, including deleting the ToDo app and managing users
  * **Editor**: Can add, update, and delete tasks
  * **Viewer**: Can view tasks only

### 🗂️ Persistent Storage

* MongoDB for data persistence
* Clear schema relationships:

  * Users ↔️ ToDo Apps ↔️ Tasks

### 🖥️ Frontend UX (Next.js)

* Dashboard showing all ToDo apps a user has access to
* Task list view within each ToDo app, with role-based controls:

  * Editors can manage tasks
  * Viewers have read-only access
* Collaborator management UI:

  * Invite users by selecting roles
  * See current collaborators and their roles

### 🔄 Real-Time Updates (WebSockets)

* Task updates (e.g., add, delete, edit) reflect live across connected clients
* Role changes and ToDo app deletion notify collaborators in real time

### 🚀 Deployment

* **Frontend:** [https://collaborative-todo-app-frontend.vercel.app/](https://collaborative-todo-app-frontend.vercel.app/)
* **Backend:** [https://halting-need-production.up.railway.app/](https://halting-need-production.up.railway.app/)

## Getting Started

### Backend (NestJS)

1. Install dependencies:

   ```bash
   npm install
   ```
2. Configure environment variables:

   ```bash
   cp .env.example .env
   ```
3. Start the server:

   ```bash
   npm run start:dev
   ```

### Frontend (Next.js)

1. Install dependencies:

   ```bash
   npm install
   ```
2. Configure environment variables:

   ```bash
   cp .env.example .env
   ```
3. Run the development server:

   ```bash
   npm run dev
   ```

## Future Improvements

* Notifications for task changes
* Advanced filters and search
* Optimized mobile experience
