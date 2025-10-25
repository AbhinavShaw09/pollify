# Pollify

A real-time polling application built with Next.js and FastAPI that allows users to create polls, vote, comment, and interact with each other's content.

## Features

- **User Authentication**: JWT-based authentication with login/register
- **Poll Management**: Create polls with multiple options
- **Real-time Voting**: Vote on polls and see live results
- **Social Features**: Like polls, comment on polls, view who liked posts
- **Dark/Light Theme**: Toggle between themes
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

### Frontend
- Next.js 16 with TypeScript
- Tailwind CSS for styling
- React Query for data fetching
- Lucide React for icons

### Backend
- FastAPI with Python
- SQLAlchemy ORM
- SQLite database
- JWT authentication
- Pydantic for data validation

## Project Structure

```
Pollify/
├── frontend/          # Next.js frontend application
├── backend/           # FastAPI backend application
└── README.md         # This file
```

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Pollify
   ```

2. **Start the backend**
   ```bash
   cd backend
   poetry install
   python main.py
   ```

3. **Start the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Usage

1. Register/Login to create an account
2. Create polls with multiple options
3. Vote on other users' polls
4. Like and comment on polls
5. View poll results and statistics
6. Toggle between dark/light themes

## API Endpoints

- `POST /register` - User registration
- `POST /login` - User login
- `GET /polls/` - Get all polls
- `POST /polls/` - Create a new poll
- `POST /polls/{id}/vote` - Vote on a poll
- `POST /polls/{id}/like` - Like/unlike a poll
- `GET /polls/{id}/likes` - Get users who liked a poll
- `POST /polls/{id}/comments` - Add a comment
- `GET /polls/{id}/comments` - Get poll comments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
