# TaskFlow - Project & Task Management Tool

A simple yet powerful internal tool for managing projects and tasks with a clean, modern UI. Built with Node.js + Express backend, React frontend, and MongoDB database.

## 🎯 Features

- **User Authentication**
  - User registration with email & password
  - Secure JWT-based login
  - Password hashing with bcryptjs
  - Protected routes & API endpoints

- **Project Management**
  - Create projects with title and description
  - View all personal projects
  - Delete projects
  - Real-time project updates

- **Task Management**
  - Add tasks within projects
  - Update task status (Todo → In Progress → Done)
  - Delete tasks
  - View all tasks in a project
  - Task statistics (completed, in-progress, pending)

- **UI/UX**
  - Clean, modern interface with Tailwind CSS
  - Reusable components (Button, Input, ProjectCard, TaskCard)
  - Loading states & error handling
  - Responsive design for mobile & desktop
  - Beautiful project cards with accent colors

## 📊 User Flow

```
1. Authentication
   ├─ Register → Create account → Login page
   ├─ Login → JWT token stored → Dashboard
   └─ Session persisted in localStorage

2. Projects Dashboard
   ├─ View all personal projects
   ├─ Create new project (modal form)
   ├─ Project card shows task count & stats
   └─ Delete project

3. Task Management (within Project Card)
   ├─ Add task → Real-time update
   ├─ Click task to toggle status
   ├─ Delete task → Remove from UI
   └─ View task statistics
```

## 🛠 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **Zod** - Input validation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Client-side routing

## 📁 Folder Structure

### Backend
```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js       # Auth logic
│   │   ├── project.controller.js    # Project CRUD
│   │   └── task.controller.js       # Task CRUD
│   ├── routes/
│   │   ├── auth.routes.js           # Auth endpoints
│   │   ├── project.routes.js        # Project endpoints
│   │   └── task.routes.js           # Task endpoints
│   ├── models/
│   │   ├── user.model.js            # User schema
│   │   ├── project.model.js         # Project schema
│   │   └── task.model.js            # Task schema
│   ├── middlewares/
│   │   ├── auth.middleware.js       # JWT verification
│   │   └── validate.middleware.js   # Request validation
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── utils/
│   │   └── generateTokens.js        # JWT generation
│   ├── validations/
│   │   └── auth.validation.js       # Zod schemas
│   ├── app.js                       # Express app setup
│   └── server.js                    # Server entry point
├── .env                             # Environment variables
├── package.json
└── .gitignore

### Frontend
frontend/
├── src/
│   ├── api/
│   │   ├── project.api.js           # Axios instance & auth
│   │   └── task.api.js              # Task API calls
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx           # Reusable button
│   │   │   ├── Input.jsx            # Reusable input
│   │   │   └── ProjectCard.jsx      # Project card with tasks
│   │   └── tasks/
│   │       ├── TaskForm.jsx         # Task creation form
│   │       └── TaskCard.jsx         # Individual task card
│   ├── pages/
│   │   ├── Login.jsx                # Login page
│   │   ├── Register.jsx             # Registration page
│   │   ├── Projects.jsx             # Projects dashboard
│   │   ├── Tasks.jsx                # Tasks view (standalone)
│   │   └── Home.jsx                 # Home page
│   ├── routes/
│   │   └── AppRoutes.jsx            # Route definitions
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # Entry point
│   ├── index.css                    # Global styles
│   ├── vite.config.js
│   └── package.json
└── .gitignore
```

## 🚀 Local Setup

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- Git
- npm or yarn

### Backend Setup

1. **Clone & Navigate**
```bash
cd backend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Create .env file**
```env
PORT=5009
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

4. **Start Server**
```bash
npm run dev
```
Server runs on `http://localhost:5009`

### Frontend Setup

1. **Navigate to frontend**
```bash
cd frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Create .env file**
```env
VITE_API_BASE_URL=http://localhost:5009/api
```

4. **Start Dev Server**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
```

### Projects (Protected)
```
POST   /api/projects          - Create project
GET    /api/projects          - Get all user's projects
DELETE /api/projects/:id      - Delete project
```

### Tasks (Protected)
```
POST   /api/tasks             - Create task
GET    /api/tasks/project/:projectId   - Get project tasks
GET    /api/tasks/:id         - Get single task
PUT    /api/tasks/:id         - Update task (status, etc)
DELETE /api/tasks/:id         - Delete task
```

### Request/Response Examples

**Register**
```bash
curl -X POST http://localhost:5009/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

**Create Project**
```bash
curl -X POST http://localhost:5009/api/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Project",
    "description": "Project description"
  }'
```

**Create Task**
```bash
curl -X POST http://localhost:5009/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Task Title",
    "project": "<projectId>",
    "description": "Task details"
  }'
```

## 🔐 Security Features

- **JWT Authentication** - Stateless, secure token-based auth
- **Password Hashing** - bcryptjs with salt rounds
- **Protected Routes** - Auth middleware on all sensitive endpoints
- **Authorization** - Users can only access their own projects/tasks
- **Input Validation** - Zod schemas for request validation
- **CORS** - Configured for frontend origin
- **Error Handling** - Centralized error responses

## 🎨 UI Components

### Reusable Components

**Button**
- Props: `text`, `type`
- Styled with Tailwind CSS
- Hover effects & transitions

**Input**
- Props: `label`, `type`, `name`, `placeholder`, `value`, `onChange`
- Form validation support
- Accessible labels

**ProjectCard**
- Displays project details
- Shows task statistics
- Inline task management
- Delete functionality
- Colored accent bars

**TaskCard**
- Task title & description
- Status badge
- Update/Delete buttons
- Task assignment display

## 🧪 Input Validations

### User Registration
- Email: Valid email format
- Password: Min 6 characters
- Name: Required, max 50 chars

### Project Creation
- Title: Required, max 100 chars
- Description: Required, max 500 chars

### Task Creation
- Title: Required, max 150 chars
- Project ID: Valid MongoDB ObjectId
- Status: One of [todo, in-progress, done]

### Task Updates
- Status: Valid enum value only

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)

**Vercel Steps:**
1. Push code to GitHub
2. Connect repo on vercel.com
3. Set environment variables in Vercel dashboard:
   ```
   VITE_API_BASE_URL=https://taskflow-api.onrender.com/api
   ```
4. Deploy automatically on push

**Netlify Steps:**
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables
5. Deploy

### Backend Deployment (Render)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Create Render Account** - render.com

3. **New Web Service:**
   - Connect GitHub repository
   - Runtime: Node
   - Build command: `npm install`
   - Start command: `npm run dev` (or `node src/server.js` for prod)

4. **Environment Variables:**
   ```
   PORT=5009
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/taskflow
   JWT_SECRET=your_production_secret
   NODE_ENV=production
   ```

5. **Deploy & Get URL** - e.g., `https://taskflow-api.onrender.com`

## 📝 Validations & Error Handling

### Backend Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

Status Codes:
- `201` - Created successfully
- `200` - Success
- `400` - Bad request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (no permission)
- `404` - Not found
- `500` - Server error

### Frontend Error Display
- Toast notifications for errors
- Console logging for debugging
- Error states in UI
- Retry mechanisms

## 🎯 Key Assumptions

1. Users want single-page dashboard for projects
2. Tasks are scoped to projects (not user-wide)
3. Users can only see/edit their own data
4. Task status is a linear flow (todo → in-progress → done)
5. Project deletion cascades to tasks
6. Authentication token valid for session
7. MongoDB auto-generates ObjectIds
8. UTC timestamps for all records

## 📦 Build & Run

**Development:**
```bash
# Backend
cd backend && npm run dev

# Frontend (in new terminal)
cd frontend && npm run dev
```

**Production Build:**
```bash
# Frontend
npm run build    # Creates dist/ folder
npm run preview  # Preview production build
```

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| CORS errors | Check backend CORS config, ensure frontend URL is allowed |
| MongoDB connection fails | Verify MONGO_URI in .env, check Atlas IP whitelist |
| Token not being sent | Check localStorage, verify Authorization header in API |
| 404 on routes | Ensure routes are mounted in app.js |
| Tasks not showing | Verify projectId in URL, check API response structure |

## 📚 Additional Notes

- All timestamps use ISO 8601 format
- Passwords are never returned in API responses
- JWT expiry can be configured in `generateTokens.js`
- Task filters can be extended (priority, assignee, etc)
- Rate limiting not implemented (add for production)

## 👨‍💻 Developer Info

- **Framework:** Express.js with modular architecture
- **Authentication:** JWT with secure token handling
- **Database:** MongoDB with Mongoose ODM
- **Frontend:** React with Vite for fast builds
- **Styling:** Tailwind CSS for utility-first design
- **Validation:** Zod for type-safe validation

---

**Built with ❤️ for TaskFlow**

Last Updated: May 22, 2026
