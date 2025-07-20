# Real-Time Analytics Dashboard

A modern real-time analytics dashboard built with React, Vite, and Node.js.

## Features

- 📊 Real-time visitor tracking
- 🔄 Live WebSocket updates
- 📱 Responsive design with Tailwind CSS
- 🎯 Session monitoring
- 🌍 Geographic tracking
- 📈 Live event streaming
- 🔧 Multi-dashboard support

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing

### Backend
- **Node.js** with **Bun** runtime
- **Express.js** - Web framework
- **WebSocket** - Real-time communication
- **MongoDB** with **Mongoose** - Database
- **TypeScript** - Type safety

## Getting Started

### Prerequisites
- Bun runtime
- MongoDB (local or remote)

### Installation

1. Install dependencies for both client and server:
   ```bash
   bun run install:all
   ```

2. Set up environment variables:
   ```bash
   # Copy server environment file
   cp server/.env.example server/.env
   
   # Copy client environment file  
   cp client/.env.example client/.env
   ```
   Edit the `.env` files with your configuration.

### Development

Run both the server and client in development mode:
```bash
bun run dev
```

This will start:
- Backend server on `http://localhost:3000`
- Vite dev server on `http://localhost:5173`
- WebSocket server on `ws://localhost:3000/ws`

### Individual Commands

- Start only the server: `bun run dev:server`
- Start only the client: `bun run dev:client`
- Build for production: `bun run build`
- Type checking: `bun run type-check`

### Production Build

1. Build the application:
   ```bash
   bun run build
   ```

2. Start the production server:
   ```bash
   NODE_ENV=production bun start
   ```

## Usage

1. **Access the application**
   - Main page: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard
   - Health check: http://localhost:3000/health

2. **Send visitor events**
   Use POST requests to `/api/events` with the following format:
   \`\`\`json
   {
     "type": "pageview",
     "page": "/products",
     "sessionId": "user-123",
     "timestamp": "2025-07-19T10:30:00Z",
     "country": "India",
     "metadata": {
       "device": "mobile",
       "referrer": "google.com"
     }
   }
   \`\`\`

3. **Test with multiple dashboards**
   - Open multiple browser tabs to http://localhost:3000/dashboard
   - Send events via Postman or curl
   - Watch real-time updates across all dashboards

## API Endpoints

### POST /api/events
Receive visitor events from websites.

### GET /api/analytics/summary
Get current analytics summary with filters.

### GET /api/analytics/sessions
Get active sessions with optional country filter.

### GET /api/analytics/events
Get recent events with pagination and filters.

## WebSocket Events

### Server → Client
- `visitor_update`: New visitor event with updated stats
- `user_connected`: New dashboard connected
- `user_disconnected`: Dashboard disconnected
- `session_activity`: Real-time session updates
- `alert`: System alerts and milestones

### Client → Server
- `request_detailed_stats`: Request filtered analytics
- `track_dashboard_action`: Track dashboard user actions

## Demo Script

For a comprehensive demo, follow these steps:

1. **Start both server and client**: `bun run dev`
2. **Open dashboard**: Navigate to http://localhost:3000/dashboard
3. **Open second dashboard**: New browser tab with same URL
4. **Send events**: Use Postman to send visitor events
5. **Test filters**: Apply country/page filters in dashboard
6. **Test reconnection**: Stop and restart server to test auto-reconnect

## Environment Variables

### Server (.env)
- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/visitor-analytics)
- `NODE_ENV`: Environment mode (development/production)

### Client (.env)
- `VITE_API_URL`: Backend API URL (default: http://localhost:3000)
- `VITE_WS_URL`: WebSocket URL (default: ws://localhost:3000/ws)

## Project Structure

```
├── client/               # React frontend
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript types
│   ├── public/           # Static assets
│   ├── .env              # Client environment variables
│   ├── .env.example      # Client environment template
│   ├── package.json      # Client dependencies
│   ├── vite.config.ts    # Vite configuration
│   └── main.tsx          # Entry point
├── server/               # Backend source
│   ├── services/         # Business logic
│   ├── models/           # Database models
│   ├── .env              # Server environment variables
│   ├── .env.example      # Server environment template
│   ├── package.json      # Server dependencies
│   ├── tsconfig.json     # TypeScript config
│   └── app.ts            # Express server
├── package.json          # Root package with scripts
└── dist/                 # Build output
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
