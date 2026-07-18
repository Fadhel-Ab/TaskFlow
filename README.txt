# TaskFlow - Full Stack Task Management System

A full-stack internal task management tool built for the SpotOn Full Stack Developer Internship assessment.

TaskFlow allows managers to create and assign work items, while members can track assigned tasks through a controlled workflow lifecycle with activity tracking.

Assumptions & Tradeoffs

Due to the limited assessment timeframe:

Workflow rules are implemented on the backend as the source of truth.
Frontend hides unavailable actions based on role and status.
Single assignee support was implemented initially.
File uploads and additional attachments were not prioritized over core workflow functionality.
UI focuses on clarity and functionality.


Future Improvements

Given more time:

Multiple assignees
File upload handling
Drag and drop timeline board
Advanced filtering
Pagination
Notifications
Automated frontend tests
CI/CD pipeline
Docker setup
Swagger API documentation

Development Notes

The application was built with focus on:

Clean separation of concerns
Secure authentication
Server-side authorization
Maintainable backend structure
Clear workflow rules
Production-style project organization


The application is built with:

- Next.js + React + TypeScript
- NestJS
- PostgreSQL
- Prisma ORM
- REST API
- JWT Authentication
- shadcn/ui

---

# Features

## Authentication & Authorization

- User registration and login
- Password hashing
- JWT based authentication
- Role based authorization:
  - Manager
  - Member

Server-side permission enforcement ensures users can only perform allowed actions.

---

# Roles

## Manager

Managers can:

- View tasks
- Create tasks
- Assign tasks to members
- Cancel tasks
- Reopen cancelled tasks
- Accept completed work
- Send tasks back for revision

## Member

Members can:

- View assigned tasks
- Start assigned work
- Submit tasks for review

---

# Task Management

Supported task fields:

- Title
- Description
- Priority
- Category
- Due date
- Status
- Assignee

Implemented functionality:

- Create tasks
- View tasks
- View task details
- Assign tasks
- Track task progress

---

# Workflow System

TaskFlow uses a controlled lifecycle:

BACKLOG
   |
   ↓
IN_PROGRESS
   |
   ↓
IN_REVIEW
   |
   ↓
DONE

CANCELLED
   |
   ↓
BACKLOG

Valid transitions are enforced on the backend.

Example:

- Members can start work
- Members can submit for review
- Managers can approve or send back
- Managers can cancel or reopen tasks

Invalid transitions are rejected by the API.

---

# Activity Timeline

Every important action is recorded:

Examples:
CREATED

STATUS_CHANGED_TO_IN_PROGRESS

STATUS_CHANGED_TO_IN_REVIEW

STATUS_CHANGED_TO_DONE

STATUS_CHANGED_TO_CANCELLED


Timeline records:

- Action performed
- User responsible
- Timestamp

---

# Project Structure

## Backend

backend/
│
├── src/
│ ├── auth/
│ │ ├── JWT authentication
│ │ ├── Guards
│ │ └── Role authorization
│ │
│ ├── tasks/
│ │ ├── Controllers
│ │ ├── Services
│ │ ├── DTO validation
│ │ └── Workflow logic
│ │
│ ├── prisma/
│ │ └── Prisma service
│
└── prisma/
└── schema.prisma


---

## Frontend

frontend/
│
├── app/
│ ├── login
│ ├── tasks
│ └── task details
│
├── components/
│ └── shadcn/ui components
│
├── lib/
│ ├── API client
│ ├── Authentication helpers
│ └── Task actions


---

# Requirements

Before running:

Install:

- Node.js 20+
- PostgreSQL
- npm

---

# Backend Setup

Navigate:

```bash
cd backend
npm install

Create environment file:

.env

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/taskflow"

JWT_SECRET="your_secret_key"
PORT=3001

Database Setup

Run Prisma migration:

npx prisma migrate dev

Generate Prisma client:

npx prisma generate

(Optional)

Open Prisma Studio:

npx prisma studio

Start Backend

Development:

npm run start:dev

Backend runs on:

http://localhost:3001


Frontend Setup

Navigate:

cd frontend

Install dependencies:

npm install

Create:

.env.local

Example:

NEXT_PUBLIC_API_URL=http://localhost:3000

Start frontend:

npm run dev

Frontend runs on:

http://localhost:3000


Demo Users

Manager
Email:
manager@test.com
Role:
MANAGER

Member
Email:
member@test.com
Role:
MEMBER

If running on a fresh database, create these users through the registration endpoint.

API Overview
Authentication
POST /auth/register

POST /auth/login


Tasks

Get tasks:

GET /tasks

Get assigned tasks:

GET /tasks/my

Create task:

POST /tasks

Assign task:

PATCH /tasks/:id/assign

Update workflow:

PATCH /tasks/:id/action

Get timeline:

GET /tasks/:id/timeline


Environment Variables

Never commit real secrets.

Example:

.env.example

should contain:

DATABASE_URL=
JWT_SECRET=
NEXT_PUBLIC_API_URL=

# Testing

Automated tests were not added due to the limited assessment timeframe.

Manual testing was performed using postman for:

- JWT authentication flow
- Role-based permissions
- Task creation
- Task assignment
- Workflow transitions
- Invalid status transitions
- Activity timeline updates