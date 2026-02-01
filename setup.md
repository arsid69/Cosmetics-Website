# Chic Boutique Online - Setup Guide

## Prerequisites
- Node.js 18.x or higher
- npm, bun, or yarn package manager

## Quick Setup

### 1. Install Node.js (if not already installed)
```bash
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download from https://nodejs.org/
```

### 2. Set up environment variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual Supabase credentials
# VITE_SUPABASE_PROJECT_ID="your_project_id"
# VITE_SUPABASE_PUBLISHABLE_KEY="your_key"
# VITE_SUPABASE_URL="https://your_project.supabase.co"
```

### 3. Install dependencies
```bash
# Using npm (standard)
npm install

# OR using bun (faster)
bun install

# OR using yarn
yarn install
```

### 4. Start development server
```bash
# Using npm
npm run dev

# OR using bun
bun run dev

# OR using yarn
yarn dev
```

### 5. Open in browser
Navigate to `http://localhost:5173`

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure
- `/src/pages/` - Route pages
- `/src/components/` - Reusable UI components
- `/src/contexts/` - React context providers
- `/src/hooks/` - Custom React hooks
- `/src/lib/` - Utility functions
- `/supabase/` - Database configuration

## Environment Variables
The project uses Vite's environment variable system. All environment variables must be prefixed with `VITE_` to be available in the browser.

## Database Setup
This project uses Supabase as the backend. Make sure to:
1. Create a Supabase project
2. Set up the required tables
3. Update your .env file with the Supabase credentials
