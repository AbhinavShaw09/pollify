# Pollify Frontend

Next.js frontend for the Pollify polling application with modern UI and real-time updates.

## Features

- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Authentication**: JWT-based login/register with persistent sessions
- **Real-time Updates**: Automatic polling for live data
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes with persistence
- **Interactive Polls**: Vote, like, and comment on polls
- **User Profiles**: View poll creators and commenters

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **Lucide React** - Icon library
- **shadcn/ui** - UI component library

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── login/             # Login page
│   ├── polls/[id]/        # Poll detail page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── poll-card.tsx     # Poll card component
│   ├── create-poll-dialog.tsx
│   └── likes-modal.tsx
└── lib/                  # Utilities
    └── utils.ts
```

## Installation

1. **Install Node.js** (v18 or higher)

2. **Install dependencies**
   ```bash
   npm install
   ```

## Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features Overview

### Authentication
- Login/Register forms with validation
- JWT token storage in localStorage
- Automatic redirect to login when not authenticated
- Persistent sessions across browser refreshes

### Poll Management
- Create polls with multiple options
- View all polls on homepage
- Click polls to view details and vote
- Real-time vote count updates

### Voting System
- Vote on polls (one vote per user per poll)
- Visual progress bars showing results
- Highlight user's selected option
- Real-time result updates

### Social Features
- Like/unlike polls
- View list of users who liked a poll
- Comment on polls
- View comments with usernames and timestamps

### UI/UX
- Dark theme by default
- Theme toggle in user dropdown
- Responsive design for mobile/desktop
- Loading states and error handling
- Toast notifications for actions

## Components

### Core Components
- **PollCard** - Displays poll summary with voting options
- **CreatePollDialog** - Modal for creating new polls
- **LikesModal** - Shows users who liked a poll
- **ToastProvider** - Global notification system
- **DropdownMenu** - User menu with theme toggle and logout

### UI Components (shadcn/ui)
- Button, Card, Dialog, Input
- Toast notifications
- Dropdown menus

## State Management

- **React Query** for server state management
- **localStorage** for authentication persistence
- **React hooks** for local component state

## API Integration

All API calls include JWT authentication headers:

```typescript
const token = localStorage.getItem("token")
fetch(url, {
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }
})
```

## Styling

- **Tailwind CSS** for utility-first styling
- **CSS Variables** for theme colors
- **Dark mode** support with class-based toggling
- **Responsive breakpoints** for mobile-first design

## Real-time Updates

- Polls refetch every 3 seconds for live updates
- Vote results update immediately after voting
- Like counts update in real-time
- Comments appear instantly after posting

## Development

1. Start the backend server first
2. Run `npm run dev` to start frontend
3. Make changes and see live updates
4. Use browser dev tools for debugging

## Build and Deploy

```bash
npm run build
npm run start
```

## Environment Variables

No environment variables required. Backend URL is hardcoded to `http://localhost:8000` for development.
