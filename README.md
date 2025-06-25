# Notes App - Full Stack Application

A beautiful and functional notes-taking application built with React, TypeScript, and Express.js. Features include text notes, checklists, archiving, dark mode, and more.

## Features

- 📝 Create and edit text notes and checklists
- 🎨 Color-coded notes with multiple themes
- 📱 Responsive design with grid and list views
- 🌙 Dark mode support
- 📁 Archive and trash functionality
- 🔍 Search functionality
- ⚙️ Font customization (size and family)
- 💾 Persistent data storage
- 🐳 Docker support

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls

### Backend
- Node.js with Express.js
- File-based JSON storage
- CORS enabled
- RESTful API design

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (optional, for containerized deployment)

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notes-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start them separately
   npm run backend  # Backend on port 3001
   npm run dev      # Frontend on port 5173
   ```

5. **Access the application**
   - Frontend: http://localhost:8002
   - Backend API: http://localhost:8002/api

## Production Build

```bash
# Build the frontend
npm run build

# Start the backend server
npm run backend
```

## Docker Deployment

### Option 1: Docker Build and Run

1. **Build the Docker image**
   ```bash
   docker build -t notes-app .
   ```

2. **Run the container**
   ```bash
   docker run -p 8002:8002 -v notes_data:/app/backend/data notes-app
   ```

3. **Access the application**
   - Application: http://localhost:8002

### Option 2: Docker Compose (Recommended)

1. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f
   ```

3. **Stop the application**
   ```bash
   docker-compose down
   ```

4. **Access the application**
   - Application: http://localhost:8002

## API Endpoints

### Notes Management
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Move note to trash
- `DELETE /api/notes/:id/permanent` - Permanently delete note

### Archive Management
- `PUT /api/notes/:id/archive` - Archive a note
- `PUT /api/notes/:id/unarchive` - Unarchive a note

### Trash Management
- `PUT /api/notes/:id/restore` - Restore note from trash
- `DELETE /api/notes/trash/empty` - Empty trash

### System
- `GET /api/health` - Health check

## Environment Variables

### Development (.env)
```env
VITE_API_URL=http://localhost:8002/api
NODE_ENV=development
```

### Production
```env
NODE_ENV=production
PORT=8002
```

## Docker Configuration

### Dockerfile Features
- Multi-stage build for optimized image size
- Non-root user for security
- Health checks
- Proper volume mounting for data persistence
- Alpine Linux base for minimal footprint

### Docker Compose Features
- Automatic restart policies
- Volume persistence
- Health checks
- Environment configuration

## Data Storage

- Development: `backend/data/notes.json`
- Docker: `/app/backend/data/notes.json` (mounted as volume)

## Troubleshooting

### Common Issues

1. **Port conflicts**
   - Frontend dev server: Change port in `vite.config.ts`
   - Backend server: Set `PORT` environment variable
   - Docker: Modify port mapping in `docker-compose.yml`

2. **API connection issues**
   - Ensure backend server is running
   - Check `VITE_API_URL` in `.env` file
   - Verify CORS configuration

3. **Docker build issues**
   - Ensure Docker daemon is running
   - Check available disk space
   - Clear Docker cache: `docker system prune`

### Logs

- **Development**: Check browser console and terminal
- **Docker**: `docker-compose logs -f notes-app`
- **Production**: Check application logs in container

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Author

**Akari** - Version 1.0

---

For more information or support, please check the application's About section in the settings panel.
