# Order Management System

A full-stack web application for managing restaurant orders, built with React (frontend) and NestJS (backend).

## Features
- Browse menu items with images and categories
- Add items to cart and checkout
- User authentication (register/login)
- View and track orders
- Admin: manage menu, offers, and orders
- Responsive UI for desktop and mobile

## Tech Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeORM, PostgreSQL
- **Testing:** Vitest, Testing Library, Jest

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL

### Setup

#### 1. Clone the repository
```sh
git clone <your-repo-url>
cd Order-managment
```

#### 2. Install dependencies
```sh
cd backend
npm install
cd ../frontend
npm install
```

#### 3. Configure environment variables
- Copy `.env.example` to `.env` in both `backend` and `frontend` folders and update values as needed.

#### 4. Set up the database
- Create a PostgreSQL database.
- Update the connection string in `backend/.env`.
- Run migrations and seed data:
```sh
cd backend
npm run typeorm:migration:run
npm run seed
```

#### 5. Start the development servers
- **Backend:**
  ```sh
  cd backend
  npm run start:dev
  ```
- **Frontend:**
  ```sh
  cd frontend
  npm run dev
  ```

Visit [http://localhost:5173](http://localhost:5173) to view the app.

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests

## Folder Structure
- `backend/` - NestJS API
- `frontend/` - React client

## License
MIT
