# Task Management API

A Node.js REST API for user and task management with authentication, role-based authorization, and file upload support.

---

## 🚀 Setup Instructions

### 1. **Clone the Repository**
```sh
git clone <your-repo-url>
cd project
```

### 2. **Install Dependencies**
```sh
npm install
```

### 3. **Configure Environment Variables**

Create a `.env` file in the root directory with the following:
```
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
JWT_SECRET=your_jwt_secret
```

### 4. **Create Uploads Directory**
```sh
mkdir uploads
```

### 5. **Run Database Migrations**

If you need to add the `image` column to the `users` table:
```sql
ALTER TABLE users ADD COLUMN image TEXT;
```

### 6. **Start the Server**
```sh
npm start
```
The server will run on `http://localhost:3000` by default.

---

## 📚 API Documentation

### **Authentication**

#### Register a User (with Image Upload)
`POST /register`

- **Content-Type:** `multipart/form-data`
- **Fields:**
  - `name` (string, required)
  - `email` (string, required)
  - `password` (string, required)
  - `gender` (string, required)
  - `role` (string, required: `Super-admin`, `Admin`, `Manager`)
  - `image` (file, optional)

**Example (using Postman):**
- Set body type to `form-data`
- Add fields as key-value pairs, and select a file for `image`

#### Login
`POST /login`

- **Body:** JSON
  - `email` (string, required)
  - `password` (string, required)

**Response:**  
Returns a JWT token and user info.

---

### **Task Management**

#### Create Task
`POST /api/tasks`

- **Headers:**  
  `Authorization: Bearer <JWT_TOKEN>`
- **Body:** JSON
  - `title` (string, required)
  - `description` (string, optional)
  - `type` (array of string, required; allowed: `a-task`, `b-task`, `c-task`, `d-task`, `e-task`)
  - `startDate` (ISO date string, required)
  - `endDate` (ISO date string, required)

**Example:**
```json
{
  "title": "Sample Task",
  "description": "This is a sample task",
  "type": ["a-task", "b-task"],
  "startDate": "2025-07-01T09:00:00Z",
  "endDate": "2025-07-02T17:00:00Z"
}
```

#### Get All Tasks
`GET /api/tasks`

- **Headers:**  
  `Authorization: Bearer <JWT_TOKEN>`

#### Delete Task
`DELETE /api/tasks/:id`

- **Headers:**  
  `Authorization: Bearer <JWT_TOKEN>`

---

### **User Images**

- Uploaded images are stored in `/uploads`.
- Access via: `GET /uploads/<filename>`

---

## 👤 Role Descriptions & Access Rules

| Role         | Add User | Add Task | View User | View Task | Delete User | Delete Task |
|--------------|:--------:|:--------:|:---------:|:---------:|:-----------:|:-----------:|
| Super-admin  |    ❌    |    ❌    |    ✅     |    ✅     |     ✅      |     ✅      |
| Admin        |    ✅    |    ✅    |    ✅     |    ✅     |     ✅      |     ✅      |
| Manager      |    ❌    |    ✅    |    ✅     |    ❌     |     ❌      |     ✅      |

- **Super-admin:** Can view and delete users and tasks.
- **Admin:** Full access to users and tasks (add, view, update, delete).
- **Manager:** Can add and delete tasks, view users.

---

## 🛠️ Development Notes

- All protected endpoints require a valid JWT in the `Authorization` header.
- Use `multipart/form-data` for registration if uploading an image.
- For any issues, check the server logs for error details.

---

## 📬 Example Workflow

1. **Register** a user named `raj` as Admin:
   - POST `/register` with `name=raj`, `role=Admin`, etc.
2. **Login** as `raj` to get a JWT.
3. Use the JWT to **create**, **view**, or **delete** tasks via `/api/tasks` endpoints.

---
(also import this database file in the current database)