# Pollify Backend

FastAPI backend for the Pollify polling application with JWT authentication and SQLite database.

## Features

- JWT-based authentication
- User registration and login
- Poll CRUD operations
- Voting system with user tracking
- Like/unlike functionality
- Comment system
- Real-time data updates

## Tech Stack

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **Pydantic** - Data validation
- **Python-Jose** - JWT token handling
- **Poetry** - Dependency management

## Project Structure

```
backend/
├── models/           # Database models
│   ├── user.py      # User model
│   ├── polls.py     # Poll model
│   ├── vote.py      # Vote model
│   ├── comment.py   # Comment model
│   └── like.py      # Like model
├── schemas/         # Pydantic schemas
│   ├── auth_schema.py
│   └── poll_schema.py
├── services/        # Business logic
│   ├── auth_service.py
│   └── poll_service.py
├── utils/           # Utilities
│   ├── jwt_utils.py
│   └── dependencies.py
├── config/          # Configuration
│   └── database.py
└── main.py         # FastAPI application
```

## Installation

1. **Install Poetry** (if not already installed)
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

2. **Install dependencies**
   ```bash
   poetry install
   ```

3. **Activate virtual environment**
   ```bash
   poetry shell
   ```

## Running the Application

```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user

### Polls
- `GET /polls/` - Get all polls
- `POST /polls/` - Create poll (requires auth)
- `GET /polls/{id}` - Get specific poll
- `GET /polls/{id}/results` - Get poll results

### Voting
- `POST /polls/{id}/vote` - Vote on poll (requires auth)
- `GET /polls/{id}/vote-status` - Check user vote status (requires auth)

### Likes
- `POST /polls/{id}/like` - Like/unlike poll (requires auth)
- `GET /polls/{id}/like-status` - Check user like status (requires auth)
- `GET /polls/{id}/likes` - Get users who liked poll

### Comments
- `POST /polls/{id}/comments` - Add comment (requires auth)
- `GET /polls/{id}/comments` - Get poll comments

## Database Models

### User
- `id` - Primary key
- `username` - Unique username
- `password` - Hashed password

### Poll
- `id` - Primary key
- `question` - Poll question
- `options` - JSON array of options
- `creator_id` - Foreign key to User
- `likes` - Like count

### Vote
- `id` - Primary key
- `poll_id` - Foreign key to Poll
- `user_id` - Foreign key to User
- `option` - Selected option

### Comment
- `id` - Primary key
- `poll_id` - Foreign key to Poll
- `user_id` - Foreign key to User
- `content` - Comment text
- `created_at` - Timestamp

### Like
- `id` - Primary key
- `poll_id` - Foreign key to Poll
- `user_id` - Foreign key to User

## Authentication

The API uses JWT tokens for authentication. Include the token in requests:

```
Authorization: Bearer <your-jwt-token>
```

## Environment Variables

No environment variables required for basic setup. Uses SQLite database by default.

## Development

1. Make changes to the code
2. The server will auto-reload with changes
3. Run tests: `poetry run pytest`

## Database

The application uses SQLite with automatic table creation. Database file: `polls.db`
