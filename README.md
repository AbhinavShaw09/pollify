# Pollify

[![CI](https://github.com/AbhinavShaw09/pollify/actions/workflows/ci.yml/badge.svg)](https://github.com/AbhinavShaw09/pollify/actions/workflows/ci.yml)

A real-time polling application built with Next.js and FastAPI that allows users to create polls, vote, comment, and interact with each other's content.

## Screenshots

### Login Page
![Login Page](images/login-page.png)
*Modern login interface with animated ripple background effect*

### Home Page
![Home Page](images/home-page.png)
*Clean dashboard showing all polls with real-time updates*

### Poll Details
![Poll Details](images/post-page.png)
*Interactive poll page with voting, comments, and live results*

## System Design and Architecture

### Architecture Overview
Pollify follows a modern full-stack architecture with clear separation between frontend and backend services:

```
┌─────────────────┐    HTTP/REST API   ┌─────────────────┐
│   Frontend      │◄──────────────────►│   Backend       │
│   (Next.js)     │   /api/v1/*        │   (FastAPI)     │
│   Port: 3000    │                    │   Port: 8000    │
└─────────────────┘                    └─────────────────┘
                                                │
                                                ▼
                                       ┌─────────────────┐
                                       │   Database      │
                                       │   (SQLite)      │
                                       └─────────────────┘
```

### Frontend Architecture (Next.js 16)
- **Framework**: Next.js 16 with TypeScript and App Router
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Query (@tanstack/react-query) for server state
- **Authentication**: JWT tokens stored in localStorage
- **UI Components**: Radix UI primitives with custom styling
- **Real-time Updates**: Polling every 3 seconds for live data

### Backend Architecture (FastAPI)
- **Framework**: FastAPI with Python 3.12+ following professional structure
- **Database**: SQLAlchemy ORM with SQLite
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **API Design**: RESTful endpoints with Pydantic validation at `/api/v1/*`
- **Architecture**: Layered architecture with separation of concerns
- **Real-time**: WebSocket support for future real-time features

### Professional Backend Structure
```
backend/
├── app/
│   ├── api/v1/endpoints/     # API route handlers
│   ├── core/                 # Configuration & security
│   ├── db/                   # Database session management
│   ├── models/               # SQLAlchemy ORM models
│   ├── schemas/              # Pydantic validation schemas
│   ├── services/             # Business logic layer
│   ├── repositories/         # Data access layer (ready for scaling)
│   ├── middleware/           # Custom middleware (ready for scaling)
│   ├── utils/                # Helper functions
│   └── tests/                # Comprehensive test suite
├── alembic/                  # Database migrations
├── scripts/                  # Utility scripts
└── .env.example             # Environment configuration template
```

### Database Schema
```sql
Users: id, username, password_hash
Polls: id, question, options (JSON), creator_id, created_at
Votes: id, poll_id, user_id, option, created_at
Comments: id, poll_id, user_id, content, created_at
Likes: id, poll_id, user_id, created_at
```

### API Endpoints
- **Authentication**: `/api/v1/register`, `/api/v1/login`
- **Polls**: `/api/v1/polls/*` (CRUD operations, voting, comments, likes)
- **WebSocket**: `/ws` (real-time communication)
- **Health Check**: `/` (API status)

### Key Features
- **User Authentication**: JWT-based login/register system
- **Poll Management**: Create polls with multiple options
- **Real-time Voting**: Vote on polls with live result updates
- **Social Features**: Like polls, comment system, view poll statistics
- **Responsive Design**: Mobile-first design with dark/light theme support
- **Professional Architecture**: Scalable, maintainable codebase structure

## How to Run the Project

### Prerequisites
- Docker and Docker Compose (for staging/production)
- Python 3.12+ and Node.js 18+ (for local development)
- Git

### Quick Start

#### 1. Clone the repository
```bash
git clone https://github.com/AbhinavShaw09/pollify.git
cd Pollify
```

#### 2. Choose your environment

**Local Development (Recommended for development)**
```bash
# Setup dependencies (run once)
./local-setup/dev-setup.sh

# Start both servers
./start.sh dev

# Or start individually
./start.sh backend    # Backend only (now uses uvicorn with reload)
./start.sh frontend   # Frontend only
```

**Staging (Docker)**
```bash
./start.sh staging
```

**Production (Docker Swarm)**
```bash
./start.sh production
```

#### 3. Stop services
```bash
# Stop development servers
./stop.sh dev

# Stop staging
./stop.sh staging

# Stop production
./stop.sh production
```

#### 4. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- API v1 Endpoints: http://localhost:8000/api/v1/*

### Manual Setup (Alternative)

#### Local Development Setup
```bash
# Backend
cd backend
pip3 install -r requirements.txt
# Or with poetry: poetry install
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

#### Docker Setup
```bash
# Staging
docker-compose up --build

# Production
docker swarm init
docker stack deploy -c docker-compose.swarm.yml pollify
```

### Environment Configuration
Create `.env` file in backend directory based on `.env.example`:
```bash
cp backend/.env.example backend/.env
```

Default configurations:
- Database: SQLite file (`polls.db`) created automatically
- CORS: Configured for localhost:3000
- JWT: Uses default secret (change for production)
- API Base URL: `http://localhost:8000/api/v1`

## Research and APIs/Resources Used

### Frontend Technologies
- **Next.js 16**: Latest React framework with App Router for modern development
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Radix UI**: Accessible, unstyled UI primitives for building design systems
- **React Query**: Powerful data synchronization for React applications
- **Lucide React**: Beautiful & consistent icon library
- **Aceternity UI**: Background ripple effect component for enhanced UX

### Backend Technologies
- **FastAPI**: Modern, fast web framework for building APIs with Python
- **SQLAlchemy**: Python SQL toolkit and Object-Relational Mapping library
- **Pydantic**: Data validation using Python type annotations
- **Pydantic Settings**: Configuration management with environment variables
- **python-jose**: JavaScript Object Signing and Encryption library for JWT
- **passlib**: Password hashing library with bcrypt support
- **uvicorn**: Lightning-fast ASGI server implementation
- **Alembic**: Database migration tool for SQLAlchemy

### Development Tools
- **Docker**: Containerization for consistent development and deployment
- **Poetry**: Dependency management and packaging for Python
- **TypeScript**: Type-safe JavaScript development
- **ESLint**: Code linting and formatting

### Design Resources
- **Color Palette**: Blue gradient theme (blue-600 to blue-700)
- **Typography**: Geist font family for modern, clean text
- **Icons**: TrendingUp icon for branding, various Lucide icons for UI
- **Layout**: Card-based design with responsive grid layouts

### API Design Patterns
- **RESTful Architecture**: Standard HTTP methods and status codes
- **API Versioning**: Structured versioning with `/api/v1` prefix
- **JWT Authentication**: Stateless authentication with Bearer tokens
- **Pydantic Models**: Request/response validation and serialization
- **Error Handling**: Consistent error responses with proper HTTP status codes
- **Layered Architecture**: Separation of API, business logic, and data layers

### Performance Optimizations
- **React Query Caching**: Intelligent caching and background updates
- **Docker Multi-stage Builds**: Optimized container images
- **SQLite**: Lightweight database perfect for development and small deployments
- **Real-time Polling**: 3-second intervals for live updates without WebSocket complexity
- **Hot Reload**: Development server with automatic reload on changes

## Future Work and Improvements

### Testing
- **Backend Testing**: Implement comprehensive test suite using pytest
  - Unit tests for all service functions
  - Integration tests for API endpoints
  - Database testing with test fixtures
  - Authentication and authorization tests
- **Frontend Testing**: Add React testing framework
  - Component unit tests with Jest and React Testing Library
  - End-to-end tests with Playwright or Cypress
  - Visual regression testing
  - Performance testing

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and deployment
  - Run tests on pull requests
  - Build and push Docker images
  - Automated security scanning
  - Code quality checks with ESLint and Black
- **ArgoCD Pipeline**: GitOps deployment strategy
  - Kubernetes deployment manifests
  - Automated rollbacks on failure
  - Multi-environment promotion (dev → staging → production)
  - Blue-green deployments

### Scaling and Performance
- **Backend Scaling**:
  - Database optimization with proper indexing
  - Query optimization and caching with Redis
  - Connection pooling for database
  - API rate limiting and throttling
  - Horizontal scaling with load balancers
- **Frontend Scaling**:
  - Code splitting and lazy loading
  - CDN integration for static assets
  - Service Worker for offline functionality
  - Image optimization and compression
  - Bundle size optimization

### Database Improvements
- **Migration to PostgreSQL**: For production scalability
- **Indexing Strategy**:
  - Add indexes on frequently queried columns (user_id, poll_id, created_at)
  - Composite indexes for complex queries
  - Full-text search indexes for poll questions
- **Query Optimization**:
  - Implement database query profiling
  - Add pagination for large result sets
  - Optimize N+1 query problems
  - Database connection pooling

### Architecture Enhancements
- **Repository Pattern**: Complete implementation of data access layer
- **Microservices**: Split into separate services
  - User service for authentication
  - Poll service for poll management
  - Notification service for real-time updates
- **Real-time Features**: WebSocket implementation
  - Live poll results updates
  - Real-time comments and notifications
  - User presence indicators
- **Caching Layer**: Redis integration
  - Cache frequently accessed polls
  - Session management
  - Rate limiting storage

### Security Improvements
- **Authentication**: Enhanced security measures
  - OAuth integration (Google, GitHub)
  - Multi-factor authentication
  - Password strength requirements
  - Session timeout management
- **API Security**:
  - Input validation and sanitization
  - SQL injection prevention
  - XSS protection
  - CORS policy refinement
  - Rate limiting middleware

### Monitoring and Observability
- **Logging**: Structured logging implementation
  - Centralized log aggregation
  - Error tracking with Sentry
  - Performance monitoring
- **Metrics**: Application performance monitoring
  - Custom metrics for business logic
  - Database performance metrics
  - User engagement analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `./scripts/test.sh` (backend) or `npm test` (frontend)
5. Submit a pull request

## License

MIT License
