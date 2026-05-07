# Paytm Clone

A full-stack web application replicating the core functionalities of Paytm. It features user authentication, a dashboard to view your balance, and a system to search for users and securely transfer money.

## 🚀 Features

- **User Authentication:** Secure Signup and Signin using JWT.
- **Dashboard:** View current account balance and search for other registered users.
- **Money Transfer:** Send money securely to other users with database transaction support to prevent partial updates.
- **Responsive UI:** Clean and modern interface built with React and Tailwind CSS.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React with Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router (implied from pages like Signin, Signup, Dashboard, SendMoney)

### Backend
- **Environment:** Node.js
- **Framework:** Express.js
- **Database ORM:** Prisma
- **Authentication:** JSON Web Tokens (JWT)

## 📁 Project Structure

```bash
build_paytm/
├── backend/          # Node.js + Express backend
│   ├── controller/   # API logic controllers
│   ├── jwt_secret/   # JWT configuration
│   ├── prisma/       # Database schemas & migrations
│   ├── routes/       # Express API routes
│   └── index.js      # Backend entry point
├── frontend/         # React + Vite frontend
│   ├── src/          # React components and pages
│   ├── public/       # Static assets
│   ├── tailwind.config.js 
│   └── vite.config.js
└── package.json
```

## 🏗️ Local Development Setup

### Prerequisites
- Node.js installed
- A relational database (PostgreSQL/MySQL based on your Prisma config)

### 1. Backend Setup

```bash
cd backend
npm install
```

Configure Environment Variables:
Create a `.env` file in the `backend` directory and add your database URL:
```env
DATABASE_URL="your_database_connection_string"
JWT_SECRET="your_jwt_secret"
```

Run Database Migrations:
```bash
npx prisma migrate dev
```

Start the Backend Server:
```bash
node index.js
```

### 2. Frontend Setup

Open a new terminal window:
```bash
cd frontend
npm install
```

Start the Frontend Development Server:
```bash
npm run dev
```

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
