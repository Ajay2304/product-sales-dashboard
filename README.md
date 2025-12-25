# Product & Sales Management Dashboard

Full-Stack Intern Assignment

## Features
- JWT Authentication (admin / password)
- Dashboard with summary cards (products, orders, revenue)
- Product Management (create, edit, soft-delete, search, pagination)
- Sales Order Management (create with product selection & live total, list, search)
- Protected routes
- Responsive & professional UI

## Tech Stack
- Frontend: React + TypeScript + Axios
- Backend: Node.js + Express + Mongoose
- Database: MongoDB
- Auth: JSON Web Tokens

## How to Run Locally

1. Start MongoDB (`mongod`)
    1.Start MongoDB Server
        "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"
    2.Verify MongoDB Is Running
        tasklist | findstr mongod
    3.AFTER STARTING MONGODB (Important)
        cd backend
        npm run dev

2. Backend
   ```bash
   cd backend
   npm install
   npm run dev
3. Frontend
   ```Bash
    cd frontend
    npm install
    npm start
