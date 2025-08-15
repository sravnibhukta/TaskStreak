# TaskStreak - Study Progress Tracker

## Overview

A full-stack web application for tracking daily study tasks and habits. TaskStreak helps users monitor their progress on various learning activities with motivational feedback, progress visualization, streak tracking, and completion statistics. The application features task management with custom categories, emojis, and time slots, allowing users to build and maintain study streaks while visualizing their weekly progress through a color-coded calendar interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**React Single Page Application**: Built with React 18 using TypeScript for type safety and modern development practices. The frontend utilizes Vite for fast development builds and hot module replacement. The application follows a component-based architecture with functional components and React hooks for state management.

**Component Design System**: Implements shadcn/ui component library built on top of Radix UI primitives, providing accessible and customizable UI components. The design system includes comprehensive styling with Tailwind CSS, CSS variables for theming, and custom fonts (Inter, Poppins, Geist Mono) loaded from Google Fonts.

**Routing and Navigation**: Uses Wouter for lightweight client-side routing, handling navigation between the main application views and deployment guide pages. The routing system is configured to support both development and production environments.

**State Management**: Employs TanStack Query (React Query) for server state management, providing efficient data fetching, caching, synchronization, and optimistic updates. Local component state is managed through React's built-in useState and useEffect hooks.

**Build System**: Configured with Vite for modern bundling, featuring path aliases for clean imports, development plugins for error overlays, and optimized production builds. The build system supports both client and server builds with ESModule format.

### Backend Architecture

**Express.js REST API**: TypeScript-based Express server providing RESTful endpoints for task management and daily progress tracking. The API follows RESTful conventions with proper HTTP status codes and error handling.

**Storage Abstraction**: Implements an IStorage interface with modular storage implementations. Currently uses in-memory storage (MemStorage) for development, designed to be easily extended for database integration with PostgreSQL through Drizzle ORM.

**API Endpoints**: Well-structured endpoints including:
- GET /api/tasks - Retrieve all available tasks
- POST /api/tasks - Create new tasks with validation
- GET /api/progress/:date - Get daily progress for specific dates
- POST /api/progress/:date - Update daily progress with completed tasks
- PATCH operations for updates

**Data Validation**: Uses Zod schemas for runtime type checking and request validation, ensuring data integrity and providing clear error messages for invalid requests.

### Database Schema and Data Storage

**PostgreSQL with Drizzle ORM**: Configured for PostgreSQL database using Drizzle ORM for type-safe database operations. The ORM provides migration support, connection pooling, and query building with TypeScript integration.

**Schema Design**: 
- Users table: Basic user authentication and identification
- Tasks table: Stores task definitions with metadata (emoji, time slots, descriptions, categories, colors)
- Daily Progress table: Tracks completed tasks per date with streak counting and progress metrics

**Development Storage**: Currently implements in-memory storage with pre-populated study tasks for rapid development iteration, allowing the application to run without database dependencies during development.

## External Dependencies

**Database and ORM**:
- Neon Database (PostgreSQL) for production data storage
- Drizzle ORM (@drizzle-team/drizzle-orm) for type-safe database queries
- @neondatabase/serverless for connection pooling and serverless database access

**Frontend Libraries**:
- Radix UI components (@radix-ui/*) for accessible primitive components
- Tailwind CSS for utility-first styling
- date-fns for comprehensive date manipulation and formatting
- Wouter for lightweight client-side routing
- TanStack Query for server state management

**Development and Build Tools**:
- Vite for fast development and optimized builds
- TypeScript for type safety across the application
- ESBuild for efficient server bundling
- PostCSS with Autoprefixer for CSS processing

**Deployment Configuration**:
- Vercel platform support with serverless functions
- Environment variable configuration for different deployment environments
- Static asset optimization and CDN integration