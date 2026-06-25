# StayNear - PG Accommodation Finder for Mangalore

A modern full-stack web application for students to find PG accommodations near their colleges in Mangalore.

## Features

- **Search System**: Search by college, area, or PG name
- **Advanced Filters**: Budget, gender, food, AC, sharing type
- **User Authentication**: JWT-based auth with secure password hashing
- **Favorites**: Save and manage favorite PGs
- **Reviews**: Star ratings and written reviews
- **Admin Panel**: Manage PG listings, reviews, and users
- **Responsive Design**: Mobile-first with dark mode support
- **Modern UI**: Glassmorphism, animations, and smooth transitions
- **No Database Required**: Runs with mock data (no MongoDB needed!)

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Data**: In-memory mock data (JSON file)
- **Authentication**: JWT with bcryptjs
- **Icons**: Lucide React

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

**Note: MongoDB is NOT required!** The app uses in-memory mock data.

## Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 3. Start the Backend

```bash
cd ../backend
npm run dev
```

### 4. Start the Frontend (in a new terminal)

```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## Admin Access

- **Email**: admin@staynear.com
- **Password**: admin123

Register a new account or use the admin credentials to access the admin panel.

## Project Structure

```
staynear/
├── backend/
│   ├── config/          # Configuration (not used in mock mode)
│   ├── controllers/     # Route handlers
│   ├── data/            # Mock data storage
│   │   ├── mockDb.js    # In-memory database
│   │   └── pgs.json     # Sample PG data
│   ├── middleware/       # Auth & error handlers
│   ├── models/          # (Not used in mock mode)
│   ├── routes/          # API routes
│   ├── seed.js          # (Not needed in mock mode)
│   └── server.js        # Express server
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   └── utils/       # Utilities & constants
│   └── index.html
└── README.md
```

## Sample Data

The app comes pre-loaded with 10 sample PGs across Mangalore:

| Name | Area | Gender | Rent |
|------|------|--------|------|
| Sunshine Boys Hostel | Surathkal | Boys | ₹8,000 |
| Green Valley Ladies Hostel | Hampankatta | Girls | ₹7,500 |
| City Center PG | Mangalore City | Co-Ed | ₹6,000 |
| AK Residency | Kankanady | Boys | ₹10,000 |
| Lakshmi Ladies PG | Bejai | Girls | ₹6,500 |
| Nearby Boys Hostel | Surathkal | Boys | ₹5,500 |
| Cozy Corners PG | Kadri | Co-Ed | ₹7,000 |
| Mangalore Homes | Falnir | Co-Ed | ₹8,500 |
| Students Inn | Kapikad | Boys | ₹5,000 |
| Rose Garden Ladies PG | Boloor | Girls | ₹7,000 |

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
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

## Data Persistence

**Note**: This app uses in-memory storage. Data will reset when the server restarts. For production use, integrate with MongoDB or another database.

## License

MIT License
