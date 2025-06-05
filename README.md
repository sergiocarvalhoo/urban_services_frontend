# Urban Services Frontend

React application for managing urban service requests using Material-UI, React Hook Form, and Vite.

## Prerequisites

- Node.js >= 20
- Docker and Docker Compose (for containerized setup)
- Backend service running (see backend README)

## Environment Setup

Copy the example environment file and adjust the values:

```bash
cp .env.example .env
```

The main environment variable is:
- `VITE_API_URL`: Backend API URL (default: http://localhost:3000)

## Running Locally (Without Docker)

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:80

## Running with Docker

1. Build and start the container:
```bash
npm run docker:up
# or
docker-compose up -d
```

2. View logs:
```bash
npm run docker:logs
# or
docker-compose logs -f
```

3. Stop container:
```bash
npm run docker:down
# or
docker-compose down
```

The application will be available at http://localhost:80

## Available Scripts

```bash
# development
npm run dev

# production build
npm run build
npm run preview

# linting
npm run lint

# docker commands
npm run docker:build  # build image
npm run docker:up     # start container
npm run docker:down   # stop container
npm run docker:logs   # view logs
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/        # React contexts
├── pages/           # Application pages/routes
├── services/        # API services
├── types/           # TypeScript type definitions
├── constants/       # Constants and labels
└── theme/          # Material-UI theme configuration
```

## Features

- Service request creation form
- Service request list with filtering
- Admin authentication
- Status management for requests
- Responsive design
- Form validation
- Error handling
- Loading states
- Material-UI components
- Docker support
- Environment configuration

## Tech Stack

- React 19
- TypeScript
- Material-UI
- React Hook Form
- Axios
- React Router
- Zod
- Vite
- Docker
- Nginx

## Development Features

- Hot Module Replacement (HMR)
- ESLint configuration
- TypeScript strict mode
- Environment variables
- Docker development setup
- Nginx production setup

## Production Build

The production build:
1. Uses multi-stage Docker build
2. Implements Nginx for static file serving
3. Includes health checks
4. Configures CORS headers
5. Enables security headers
6. Handles SPA routing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
