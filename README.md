# Ad Campaign Manager

A full-stack application for managing advertising campaigns built with Angular and NestJS.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ad-campaign-manager
```

2. Install dependencies for both frontend and backend:
```bash
npm run install:all
```

## Running the Application

Start both the frontend and backend servers with a single command:

```bash
npm start
```

This will start:
- Frontend server at http://localhost:4200
- Backend server at http://localhost:3000

## Project Structure

- `/frontend` - Angular frontend application
- `/backend` - NestJS backend application

## Available Scripts

- `npm run install:all` - Install dependencies for both frontend and backend
- `npm run start:frontend` - Start only the frontend server
- `npm run start:backend` - Start only the backend server
- `npm run test:frontend` - Run frontend tests
- `npm run test:backend` - Run backend tests

## Environment Variables

Create a `.env` file in the `/backend` directory with the following variables:

```env
API_KEY=your_api_key_here
PORT=3000
```

## Features

- View all advertising campaigns
- Add new campaigns
- Sort and filter campaigns
- Real-time form validation
- Responsive design