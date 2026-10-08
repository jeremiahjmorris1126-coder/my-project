# Node.js REST API

A clean, modular RESTful API built with Node.js and Express 5.

## Features

- **ES Modules**: Modern `import`/`export` syntax.
- **Express 5**: Fast and robust web framework.
- **Security & Utilities**: Configured with `helmet` for security headers, `cors` for cross-origin requests, and `morgan` for HTTP request logging.
- **Modular Architecture**: Clean separation between server bootstrap, app configuration, routes, controllers, data models, and error handling middleware.
- **Comprehensive Testing**: Built-in Node.js test runner (`node:test`) and `supertest` covering all endpoints, query filtering, and validation error cases.
- **Watch Mode**: Integrated `node --watch` development server without external watchers.

---

## Project Structure

```text
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore rules (node_modules, .env, etc.)
├── package.json                # Project dependencies and npm scripts
├── README.md                   # Project documentation
├── src/
│   ├── app.js                  # Express application setup and middleware
│   ├── server.js               # Server entry point and graceful shutdown
│   ├── config/
│   │   └── index.js            # Environment configuration loader
│   ├── controllers/
│   │   └── items.controller.js # Request handlers & validation logic
│   ├── data/
│   │   └── items.js            # In-memory data store with seed items
│   ├── middleware/
│   │   └── errorHandler.js     # Centralized error handler & 404 handler
│   └── routes/
│       ├── health.routes.js    # Health check route (/api/v1/health)
│       ├── items.routes.js     # CRUD routes for items (/api/v1/items)
│       └── index.js            # API router aggregator
└── tests/
    └── api.test.js             # Automated unit & integration test suite
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher, tested with v22+)
- npm (v9+)

### Installation

1. Clone or navigate to the repository:
   ```bash
   cd my-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

---

## Running the Application

### Development Mode (with hot reloading / watch)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start at `http://localhost:3000`.

---

## Running Tests

Run the automated test suite using Node's native test runner:

```bash
npm test
```

---

## API Endpoints

### Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status and available root endpoints |
| `GET` | `/api/v1/health` | Health check and server uptime |
| `GET` | `/api/v1/items` | Retrieve all items (supports `?search=` and `?completed=`) |
| `GET` | `/api/v1/items/:id` | Retrieve an item by ID |
| `POST` | `/api/v1/items` | Create a new item |
| `PUT` | `/api/v1/items/:id` | Update an existing item |
| `DELETE` | `/api/v1/items/:id` | Delete an item by ID |

---

## Example Requests

### Health Check

```bash
curl http://localhost:3000/api/v1/health
```

### List All Items

```bash
curl http://localhost:3000/api/v1/items
```

### Search & Filter Items

```bash
# Filter by completion status
curl "http://localhost:3000/api/v1/items?completed=true"

# Search by keyword
curl "http://localhost:3000/api/v1/items?search=deploy"
```

### Create an Item

```bash
curl -X POST http://localhost:3000/api/v1/items \
  -H "Content-Type: application/json" \
  -d '{"title": "Explore Docker containerization", "description": "Add Dockerfile and compose setup", "completed": false}'
```

### Update an Item

```bash
curl -X PUT http://localhost:3000/api/v1/items/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete an Item

```bash
curl -X DELETE http://localhost:3000/api/v1/items/1
```
