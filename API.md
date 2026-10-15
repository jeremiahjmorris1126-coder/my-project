# API Documentation

Comprehensive API reference for the Node.js REST API service.

- **Base URL**: `http://localhost:3000`
- **Default Headers**:
  - `Content-Type: application/json`
  - `Accept: application/json`

---

## Table of Contents

- [Root Service Info (`GET /`)](#1-root-service-info)
- [Health Check (`GET /api/v1/health`)](#2-health-check)
- [List Items (`GET /api/v1/items`)](#3-list-items)
- [Get Item by ID (`GET /api/v1/items/:id`)](#4-get-item-by-id)
- [Create Item (`POST /api/v1/items`)](#5-create-item)
- [Update Item (`PUT /api/v1/items/:id`)](#6-update-item)
- [Delete Item (`DELETE /api/v1/items/:id`)](#7-delete-item)
- [Global Error Responses](#global-error-responses)
- [OpenAPI 3.0 Specification](#openapi-30-specification)

---

## 1. Root Service Info

### `GET /`

#### 1. Purpose
Returns the API service name, current version, running status, and root endpoint references.

#### 2. Parameters & Request Body
- **Path Parameters**: None.
- **Query Parameters**: None.
- **Request Body**: None.

#### 3. Response Shape and Status Codes
- **Status Code**: `200 OK`
- **Response Format**: `application/json`
- **Response Schema**:
  ```json
  {
    "name": "string",
    "version": "string",
    "status": "string",
    "endpoints": {
      "health": "string",
      "items": "string"
    }
  }
  ```

#### 4. Example Request & Response

##### Request (curl)
```bash
curl -X GET http://localhost:3000/ \
  -H "Accept: application/json"
```

##### Response (`200 OK`)
```json
{
  "name": "REST API with Node.js",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "health": "/api/v1/health",
    "items": "/api/v1/items"
  }
}
```

#### 5. Errors and Edge Cases
- **Unsupported HTTP Methods**: Submitting `POST`, `PUT`, or `DELETE` to `/` returns `404 Not Found` with the standard fallback payload.
- **Extraneous Inputs**: Any query parameters or request bodies sent to this endpoint are safely ignored.

---

## 2. Health Check

### `GET /api/v1/health`

#### 1. Purpose
Provides system availability status, process uptime in seconds, and the current server timestamp in ISO 8601 format.

#### 2. Parameters & Request Body
- **Path Parameters**: None.
- **Query Parameters**: None.
- **Request Body**: None.

#### 3. Response Shape and Status Codes
- **Status Code**: `200 OK`
- **Response Format**: `application/json`
- **Response Schema**:
  ```json
  {
    "status": "string",
    "uptime": "number (seconds)",
    "timestamp": "string (ISO 8601 datetime)"
  }
  ```

#### 4. Example Request & Response

##### Request (curl)
```bash
curl -X GET http://localhost:3000/api/v1/health \
  -H "Accept: application/json"
```

##### Response (`200 OK`)
```json
{
  "status": "ok",
  "uptime": 42.185203,
  "timestamp": "2026-10-15T19:47:38.123Z"
}
```

#### 5. Errors and Edge Cases
- **Uptime Precision**: Process uptime is returned as a floating-point number representing seconds since process start.
- **Server Degradation**: If the Node event loop or unhandled process errors occur, upstream proxies or reverse proxies return `502 Bad Gateway` / `503 Service Unavailable`.

---

## 3. List Items

### `GET /api/v1/items`

#### 1. Purpose
Retrieves all item records from the store with optional case-insensitive keyword search and completion status filtering.

#### 2. Parameters & Request Body
- **Path Parameters**: None.
- **Query Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `search` | `string` | Optional | Case-insensitive substring match against item `title` or `description`. |
  | `completed` | `string` / `boolean` | Optional | Filter by status (`"true"` returns completed items; any other value returns incomplete items). |
- **Request Body**: None.

#### 3. Response Shape and Status Codes
- **Status Code**: `200 OK`
- **Response Format**: `application/json`
- **Response Schema**:
  ```json
  {
    "success": "boolean (true)",
    "count": "integer",
    "data": [
      {
        "id": "integer",
        "title": "string",
        "description": "string",
        "completed": "boolean",
        "createdAt": "string (ISO 8601 datetime)",
        "updatedAt": "string (ISO 8601 datetime, optional)"
      }
    ]
  }
  ```

#### 4. Example Request & Response

##### Request 1: List all items (curl)
```bash
curl -X GET http://localhost:3000/api/v1/items \
  -H "Accept: application/json"
```

##### Response (`200 OK`)
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "title": "Set up Node.js REST API",
      "description": "Initialize project structure and configure Express",
      "completed": true,
      "createdAt": "2026-10-15T19:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Write API unit tests",
      "description": "Ensure all CRUD operations pass validation tests",
      "completed": false,
      "createdAt": "2026-10-15T19:00:00.000Z"
    },
    {
      "id": 3,
      "title": "Deploy API service",
      "description": "Deploy the application to cloud hosting",
      "completed": false,
      "createdAt": "2026-10-15T19:00:00.000Z"
    }
  ]
}
```

##### Request 2: Filter by keyword and completion (curl)
```bash
curl -X GET "http://localhost:3000/api/v1/items?search=deploy&completed=false" \
  -H "Accept: application/json"
```

##### Response (`200 OK`)
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 3,
      "title": "Deploy API service",
      "description": "Deploy the application to cloud hosting",
      "completed": false,
      "createdAt": "2026-10-15T19:00:00.000Z"
    }
  ]
}
```

#### 5. Errors and Edge Cases
- **No Matches Found**: Returns status `200 OK` with `"count": 0` and `"data": []`. It does not return 404 when filter criteria match no items.
- **`completed` Flag Evaluation**: Any query parameter value other than `"true"` (e.g. `completed=false`, `completed=0`, or `completed=no`) will evaluate to `completed === false`.
- **Empty `search` String**: Passing `search=` or omitting it results in no keyword filtering.

---

## 4. Get Item by ID

### `GET /api/v1/items/:id`

#### 1. Purpose
Retrieves details of a single item identified by its unique numeric ID.

#### 2. Parameters & Request Body
- **Path Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `integer` (numeric string) | Required | Unique identifier of the target item. |
- **Query Parameters**: None.
- **Request Body**: None.

#### 3. Response Shape and Status Codes
- **Status Codes**:
  - `200 OK`: Item found.
  - `404 Not Found`: Item not found or invalid ID.
- **Response Schema (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "integer",
      "title": "string",
      "description": "string",
      "completed": "boolean",
      "createdAt": "string (ISO 8601 datetime)",
      "updatedAt": "string (ISO 8601 datetime, optional)"
    }
  }
  ```
- **Response Schema (`404 Not Found`)**:
  ```json
  {
    "success": false,
    "error": "Not Found",
    "message": "Item with id <id> not found"
  }
  ```

#### 4. Example Request & Response

##### Request (curl)
```bash
curl -X GET http://localhost:3000/api/v1/items/1 \
  -H "Accept: application/json"
```

##### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Set up Node.js REST API",
    "description": "Initialize project structure and configure Express",
    "completed": true,
    "createdAt": "2026-10-15T19:00:00.000Z"
  }
}
```

##### Error Example (`404 Not Found`)
```bash
curl -X GET http://localhost:3000/api/v1/items/999 \
  -H "Accept: application/json"
```

```json
{
  "success": false,
  "error": "Not Found",
  "message": "Item with id 999 not found"
}
```

#### 5. Errors and Edge Cases
- **Unknown ID**: Returns `404 Not Found` with `error: "Not Found"`.
- **Non-Numeric ID**: Passing a non-numeric string (e.g. `GET /api/v1/items/abc`) converts `id` via `Number("abc") -> NaN`, which fails the match and returns `404 Not Found` (`"message": "Item with id abc not found"`).

---

## 5. Create Item

### `POST /api/v1/items`

#### 1. Purpose
Creates a new item record with an auto-incremented ID, trimmed input fields, and an automated creation timestamp.

#### 2. Parameters & Request Body
- **Path Parameters**: None.
- **Query Parameters**: None.
- **Headers**:
  - `Content-Type: application/json`
- **Request Body (JSON)**:
  | Field | Type | Required | Default | Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `title` | `string` | **Yes** | — | Non-empty string specifying the title. Trimming is applied. |
  | `description` | `string` | No | `""` | Optional description text. Trimming is applied. |
  | `completed` | `boolean` | No | `false` | Initial completion flag. Value is coerced to boolean. |

#### 3. Response Shape and Status Codes
- **Status Codes**:
  - `201 Created`: Item successfully created.
  - `400 Bad Request`: Validation failure on `title` or malformed JSON payload.
- **Response Schema (`201 Created`)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "integer",
      "title": "string",
      "description": "string",
      "completed": "boolean",
      "createdAt": "string (ISO 8601 datetime)"
    }
  }
  ```
- **Response Schema (`400 Bad Request`)**:
  ```json
  {
    "success": false,
    "error": "Bad Request",
    "message": "Field \"title\" is required and must be a non-empty string"
  }
  ```

#### 4. Example Request & Response

##### Request (curl)
```bash
curl -X POST http://localhost:3000/api/v1/items \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "title": "Add Swagger / OpenAPI UI",
    "description": "Serve interactive documentation using swagger-ui-express",
    "completed": false
  }'
```

##### Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "id": 4,
    "title": "Add Swagger / OpenAPI UI",
    "description": "Serve interactive documentation using swagger-ui-express",
    "completed": false,
    "createdAt": "2026-10-15T19:48:00.000Z"
  }
}
```

##### Error Example: Missing Title (`400 Bad Request`)
```bash
curl -X POST http://localhost:3000/api/v1/items \
  -H "Content-Type: application/json" \
  -d '{"description": "Missing title attribute"}'
```

```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Field \"title\" is required and must be a non-empty string"
}
```

#### 5. Errors and Edge Cases
- **Missing or Whitespace Title**: Omitting `title`, passing non-string values (e.g. number/null), or strings with only whitespace (e.g. `"   "`) triggers `400 Bad Request`.
- **Malformed JSON**: Malformed JSON bodies trigger Express's built-in body-parser syntax error with `400 Bad Request`.
- **Extra Fields**: Unexpected fields in the body are ignored and omitted from the saved item record.
- **Type Coercion for `completed`**: Any truthy value (e.g. `1`, `"true"`) evaluates to `true`; falsy values evaluate to `false`.

---

## 6. Update Item

### `PUT /api/v1/items/:id`

#### 1. Purpose
Updates an existing item's specified attributes by ID and appends or refreshes the `updatedAt` timestamp.

#### 2. Parameters & Request Body
- **Path Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `integer` (numeric string) | Required | Unique identifier of the item to update. |
- **Headers**:
  - `Content-Type: application/json`
- **Request Body (JSON)**:
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `title` | `string` | No | If provided, must be a non-empty trimmed string. |
  | `description` | `string` | No | If provided, replaces existing description (trimmed). |
  | `completed` | `boolean` | No | If provided, coerced to boolean to update completion state. |

#### 3. Response Shape and Status Codes
- **Status Codes**:
  - `200 OK`: Item updated successfully.
  - `400 Bad Request`: `title` field was supplied but was empty or not a string.
  - `404 Not Found`: Item with specified `id` does not exist.
- **Response Schema (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "integer",
      "title": "string",
      "description": "string",
      "completed": "boolean",
      "createdAt": "string (ISO 8601 datetime)",
      "updatedAt": "string (ISO 8601 datetime)"
    }
  }
  ```
- **Response Schema (`400 Bad Request`)**:
  ```json
  {
    "success": false,
    "error": "Bad Request",
    "message": "Field \"title\" must be a non-empty string if provided"
  }
  ```
- **Response Schema (`404 Not Found`)**:
  ```json
  {
    "success": false,
    "error": "Not Found",
    "message": "Item with id <id> not found"
  }
  ```

#### 4. Example Request & Response

##### Request (curl)
```bash
curl -X PUT http://localhost:3000/api/v1/items/2 \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "completed": true
  }'
```

##### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Write API unit tests",
    "description": "Ensure all CRUD operations pass validation tests",
    "completed": true,
    "createdAt": "2026-10-15T19:00:00.000Z",
    "updatedAt": "2026-10-15T19:50:00.000Z"
  }
}
```

##### Error Example: Empty Title (`400 Bad Request`)
```bash
curl -X PUT http://localhost:3000/api/v1/items/2 \
  -H "Content-Type: application/json" \
  -d '{"title": "   "}'
```

```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Field \"title\" must be a non-empty string if provided"
}
```

#### 5. Errors and Edge Cases
- **Partial Patching**: Fields not included in the payload retain their prior values.
- **Empty Title Validation**: Unlike `POST` where `title` is strictly mandatory, in `PUT` `title` is optional, but if provided, it must not be empty or whitespace-only.
- **Non-Existent Item**: Providing an unknown `id` returns `404 Not Found`.
- **Timestamp Tracking**: A new `updatedAt` field in ISO 8601 format is added or updated each time this endpoint is invoked.

---

## 7. Delete Item

### `DELETE /api/v1/items/:id`

#### 1. Purpose
Removes an item record permanently from the store by its ID.

#### 2. Parameters & Request Body
- **Path Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `integer` (numeric string) | Required | Unique identifier of the item to delete. |
- **Query Parameters**: None.
- **Request Body**: None.

#### 3. Response Shape and Status Codes
- **Status Codes**:
  - `200 OK`: Item deleted successfully.
  - `404 Not Found`: Item not found.
- **Response Schema (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Item with id <id> successfully deleted"
  }
  ```
- **Response Schema (`404 Not Found`)**:
  ```json
  {
    "success": false,
    "error": "Not Found",
    "message": "Item with id <id> not found"
  }
  ```

#### 4. Example Request & Response

##### Request (curl)
```bash
curl -X DELETE http://localhost:3000/api/v1/items/3 \
  -H "Accept: application/json"
```

##### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Item with id 3 successfully deleted"
}
```

##### Error Example: Non-Existent ID (`404 Not Found`)
```bash
curl -X DELETE http://localhost:3000/api/v1/items/999 \
  -H "Accept: application/json"
```

```json
{
  "success": false,
  "error": "Not Found",
  "message": "Item with id 999 not found"
}
```

#### 5. Errors and Edge Cases
- **Idempotency**: Deleting an item twice returns `404 Not Found` on subsequent calls since the entity has already been removed.
- **ID Type Cast**: Numeric comparison is performed; `id="abc"` returns `404 Not Found`.

---

## Global Error Responses

### 1. Route Not Found (`404 Not Found`)
Returned when an incoming request does not match any registered route or HTTP method.

```json
{
  "error": "Not Found",
  "message": "Cannot POST /api/v1/unknown"
}
```

### 2. Internal Server Error (`500 Internal Server Error`)
Returned when an uncaught exception is thrown in the application middleware or route handlers.

```json
{
  "error": "InternalServerError",
  "message": "An unexpected error occurred"
}
```
*(Note: If `NODE_ENV=development`, an additional `"stack"` property with the stack trace is included in the response payload).*

---

## OpenAPI 3.0 Specification

Copy-paste friendly OpenAPI 3.0.3 specification snippet in YAML:

```yaml
openapi: 3.0.3
info:
  title: Node.js REST API
  description: Comprehensive RESTful API service with Express
  version: 1.0.0
servers:
  - url: http://localhost:3000
    description: Local development server
paths:
  /:
    get:
      summary: Root service information
      description: Returns the API service status, version, and primary endpoint paths.
      responses:
        '200':
          description: Service information retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RootInfo'

  /api/v1/health:
    get:
      summary: Health check
      description: Provides system availability status, process uptime in seconds, and server timestamp.
      responses:
        '200':
          description: Health check status
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HealthResponse'

  /api/v1/items:
    get:
      summary: List items
      description: Retrieves all items with optional search and completion status filters.
      parameters:
        - name: search
          in: query
          required: false
          schema:
            type: string
          description: Keyword search on title or description
        - name: completed
          in: query
          required: false
          schema:
            type: string
            enum: ['true', 'false']
          description: Filter by completed status
      responses:
        '200':
          description: List of items
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ItemListResponse'
    post:
      summary: Create item
      description: Creates a new item record.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateItemRequest'
      responses:
        '201':
          description: Item created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ItemSingleResponse'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /api/v1/items/{id}:
    get:
      summary: Get item by ID
      description: Retrieves a single item by its numeric ID.
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
          description: Numeric ID of the item
      responses:
        '200':
          description: Item found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ItemSingleResponse'
        '404':
          description: Item not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
    put:
      summary: Update item
      description: Updates specified properties of an existing item.
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
          description: Numeric ID of the item
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateItemRequest'
      responses:
        '200':
          description: Item updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ItemSingleResponse'
        '400':
          description: Invalid title provided
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Item not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
    delete:
      summary: Delete item
      description: Permanently removes an item by ID.
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
          description: Numeric ID of the item
      responses:
        '200':
          description: Item deleted successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DeleteResponse'
        '404':
          description: Item not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

components:
  schemas:
    RootInfo:
      type: object
      properties:
        name:
          type: string
        version:
          type: string
        status:
          type: string
        endpoints:
          type: object
          properties:
            health:
              type: string
            items:
              type: string

    HealthResponse:
      type: object
      properties:
        status:
          type: string
        uptime:
          type: number
        timestamp:
          type: string
          format: date-time

    Item:
      type: object
      properties:
        id:
          type: integer
        title:
          type: string
        description:
          type: string
        completed:
          type: boolean
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    ItemListResponse:
      type: object
      properties:
        success:
          type: boolean
        count:
          type: integer
        data:
          type: array
          items:
            $ref: '#/components/schemas/Item'

    ItemSingleResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          $ref: '#/components/schemas/Item'

    CreateItemRequest:
      type: object
      required:
        - title
      properties:
        title:
          type: string
          example: Buy groceries
        description:
          type: string
          example: Milk, eggs, and bread
        completed:
          type: boolean
          default: false

    UpdateItemRequest:
      type: object
      properties:
        title:
          type: string
          example: Buy groceries and snacks
        description:
          type: string
          example: Milk, eggs, bread, and apples
        completed:
          type: boolean
          example: true

    DeleteResponse:
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string

    ErrorResponse:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: string
        message:
          type: string
```
