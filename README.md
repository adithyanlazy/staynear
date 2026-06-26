# StayNear - PG Accommodation Finder for Mangalore

A modern full-stack web application for students to find PG accommodations near their colleges in Mangalore.

## Features

- **Search System**: Search by college, area, or PG name
- **Advanced Filters**: Budget, gender, food, AC, sharing type
- **User Authentication**: JWT-based auth with email/password or phone/password
- **Favorites**: Save and manage favorite PGs
- **Reviews**: Star ratings and written reviews
- **Admin Panel**: Manage PG listings, reviews, users, and site settings
- **Responsive Design**: Mobile-first with dark mode support
- **Modern UI**: Glassmorphism, animations, and smooth transitions

## Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS 3, React Router 6, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: JWT (httpOnly cookies + Bearer tokens), bcryptjs
- **Email**: Nodemailer (Gmail SMTP)
- **Icons**: Lucide React

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)

## Quick Start

### 1. Backend Setup

```bash
cd backend
cp .env.example .env   # Configure your environment variables
npm install
node seed.js            # Seed sample PG data
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## Environment Variables

### Backend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret key for JWT signing |
| `CLIENT_URL` | No | Frontend URL for CORS (comma-separated) |
| `EMAIL_USER` | No | Gmail address for OTP emails |
| `EMAIL_PASS` | No | Gmail app password |
| `NODE_ENV` | No | `development` or `production` |

### Frontend

API URL is hardcoded in `src/utils/api.js` for production. Vite proxy handles `/api` -> `localhost:5001` in development.

## Admin Access

- **Email**: admin@staynear.com
- **Password**: admin123

## Project Structure

```
staynear/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route handlers (auth, admin, pg, review)
│   ├── middleware/       # Auth (JWT + role), error handler
│   ├── models/          # Mongoose schemas (User, PG, Review, Settings)
│   ├── routes/          # API routes
│   ├── utils/           # Email OTP, phone OTP
│   ├── seed.js          # Database seeder
│   └── server.js        # Express server
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   │   └── admin/   # Admin-specific components
│   │   ├── context/     # React context (AuthContext)
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   │   └── admin/   # Admin panel pages
│   │   └── utils/       # API config, constants
│   └── index.html
├── render.yaml          # Render deployment config
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register with email
- `POST /api/auth/register-phone` - Register with phone
- `POST /api/auth/login` - Login with email
- `POST /api/auth/login-phone` - Login with phone
- `GET /api/auth/me` - Get current user
- `POST /api/auth/favorites/:pgId` - Add favorite
- `DELETE /api/auth/favorites/:pgId` - Remove favorite
- `GET /api/auth/favorites` - Get favorites

### PGs
- `GET /api/pgs` - Get all PGs (with filters)
- `GET /api/pgs/:id` - Get single PG
- `POST /api/pgs` - Create PG (admin)
- `PUT /api/pgs/:id` - Update PG (admin)
- `DELETE /api/pgs/:id` - Delete PG (admin)
- `GET /api/pgs/featured` - Get featured PGs
- `GET /api/pgs/college/:college` - Get PGs by college
- `GET /api/pgs/:id/similar` - Get similar PGs
- `GET /api/pgs/stats` - Get statistics

### Reviews
- `GET /api/reviews/pg/:pgId` - Get reviews for PG
- `POST /api/reviews/pg/:pgId` - Add review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/reviews` - List all reviews
- `DELETE /api/admin/reviews/:id` - Delete review

## Features in Detail

### Search & Filters
- College-based search (NITK, St Aloysius, Yenepoya, etc.)
- Area-based search (Surathkal, Hampankatta, Kadri, etc.)
- Budget range filter
- Gender preference (Boys/Girls/Co-Ed)
- Food included filter
- AC available filter
- Sharing type filter
- Multiple sorting options

### UI Components
- Glassmorphism navbar
- Animated hero section
- Responsive card grid
- Image carousel
- Star rating system
- Loading skeletons
- Empty states
- Toast notifications

### Dark Mode
- Toggle in navbar
- System preference detection
- Persistent preference storage

## Deployment

- **Frontend**: Vercel (`https://staynear-fine.vercel.app`)
- **Backend**: Render (`https://staynear-davp.onrender.com`)
- **Database**: MongoDB Atlas

## License

MIT License
