VastuSoundarya
A complete full-stack MERN web application for VastuSoundarya --- an
architecture, civil consultancy, interior design, and Vastu-based design
firm.

Client Website: React → Express REST API → MongoDB
Admin Dashboard: JWT Authentication → CRUD APIs → MongoDB
Tech Stack
  Layer   Technology
  Frontend    React.js, React Router, Tailwind CSS, Axios
Backend     Node.js, Express.js
Database    MongoDB, Mongoose
Auth        JWT, bcryptjs
Images      Cloudinary
Email       Nodemailer
Folder Structure
vastusoundarya/
├── client/                          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   └── admin/               # Admin-specific components
│   │   ├── pages/                   # Public pages
│   │   │   └── admin/               # Admin dashboard pages
│   │   ├── layouts/                 # MainLayout, AdminLayout
│   │   ├── services/                # API client & service functions
│   │   ├── context/                 # AuthContext (JWT)
│   │   ├── App.js                   # Routes
│   │   └── index.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                          # Express backend
│   ├── config/                      # DB & Cloudinary config
│   ├── controllers/                 # Route handlers
│   ├── models/                      # Mongoose schemas
│   ├── routes/                      # API routes
│   ├── middleware/                  # Auth, upload, error handling
│   ├── utils/                       # JWT, email, Cloudinary helpers
│   ├── seed/                        # Sample data seeder
│   ├── server.js                    # Entry point
│   └── package.json
│
├── package.json                     # Root scripts (run both)
└── README.md
Database Schemas
users
  Field   Type   Description
  name        String     Admin name
email       String     Unique, lowercase
password    String     Hashed (bcrypt)
role        String     admin
projects
  Field        Type   Description
  name             String     Project name
category         String     Managed via categories collection
location         String     City/region
description      String     Full description
images           Array      { url, publicId }
status           Enum       Ongoing, Completed, Upcoming
completionInfo   String     e.g. "Completed March 2025"
featured         Boolean    Show on homepage
categories
  Field     Type   Description
  name          String     Unique display name
slug          String     URL-friendly identifier
description   String     Optional notes
isActive      Boolean    Visible for new projects
services
  Field          Type   Description
  title              String     Service name
slug               String     URL-friendly identifier
description        String     Full description
shortDescription   String     Card summary
icon               String     Icon key
image              Object     { url, publicId }
order              Number     Display order
isActive           Boolean    Visible on website
appointments
  Field            Type   Description
  name, email, phone   String     Client contact
projectType          Enum       Residential, Commercial, etc.
preferredDate        Date       Requested date
preferredTime        String     Time slot
message              String     Optional notes
status               Enum       Pending, Confirmed, Completed, Cancelled
enquiries
  Field            Type   Description
  name, email, phone   String     Client contact
subject              String     Enquiry subject
message              String     Message body
status               Enum       New, In Progress, Resolved
API Endpoints
Public
  Method              Endpoint            Description
  GET                     /api/health           Health check

  GET                     /api/projects         List projects
(?category,
?featured, ?status)

  GET                     /api/projects/:id     Single project

  GET                     /api/categories       List active categories

  GET                     /api/services         List active services

  GET                     /api/services/:slug   Service by slug

  POST                    /api/appointments     Book appointment (+
email to admin)

  POST                    /api/enquiries        Submit contact enquiry

  POST                    /api/auth/register    Create first admin
(one-time)
POST                    /api/auth/login       Admin login
Protected (Bearer JWT + admin role)
  Method              Endpoint                           Description
  GET                     /api/auth/me                         Current admin profile

  GET                     /api/dashboard/stats                 Dashboard analytics
(counts, chart series,
recent items)

  GET                     /api/categories?all=true             All categories
(incl. inactive)

  POST                    /api/categories                      Create category

  PUT                     /api/categories/:id                  Update category

  DELETE                  /api/categories/:id                  Delete category

  POST                    /api/projects                        Create project
(multipart)

  PUT                     /api/projects/:id                    Update project

  DELETE                  /api/projects/:id                    Delete project

  DELETE                  /api/projects/:id/images?publicId=   Delete project image

  POST                    /api/services                        Create service

  PUT                     /api/services/:id                    Update service

  DELETE                  /api/services/:id                    Delete service

  GET                     /api/appointments                    List appointments

  PUT                     /api/appointments/:id                Update appointment
status

  DELETE                  /api/appointments/:id                Delete appointment

  GET                     /api/enquiries                       List enquiries

  PUT                     /api/enquiries/:id                   Update enquiry status
DELETE                  /api/enquiries/:id                   Delete enquiry
Frontend-Backend Data Flow
┌─────────────────┐     Axios REST      ┌─────────────────┐     Mongoose     ┌──────────┐
│  React Client   │ ──────────────────► │  Express API    │ ───────────────► │ MongoDB  │
│  (port 3000)    │ ◄────────────────── │  (port 5000)    │ ◄─────────────── │          │
└─────────────────┘     JSON / JWT      └─────────────────┘                  └──────────┘
                                                │
                                                ├── Cloudinary (image uploads)
                                                └── Nodemailer (appointment emails)
1. Public pages fetch projects/services via GET on load.
2. Forms (appointment, contact) POST data to API; server
   validates, saves to MongoDB.
3. Admin login returns JWT; stored in localStorage, sent as
   Authorization: Bearer header.
4. Admin CRUD uses multipart forms for image uploads → Cloudinary →
   URLs saved in MongoDB.
MongoDB Setup
Option A: Local MongoDB
1. Install MongoDB Community
   Server.
2. Start MongoDB:
   # Windows (if installed as service, it may auto-start)
   net start MongoDB
   
   # Or run manually
   mongod
3. Default URI: mongodb://127.0.0.1:27017/vastusoundarya
Option B: MongoDB Atlas (Cloud)
1. Create a free cluster at
   mongodb.com/atlas.
2. Create a database user and whitelist your IP (or 0.0.0.0/0 for
   development, if appropriate).
3. Add the Atlas connection string to server/.env as MONGODB_URI.
   Use a placeholder in documentation; never publish the real
   connection string.
Cloudinary Setup
1. Sign up at cloudinary.com.
2. From the Dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
3. Add the values to your local server/.env file:
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
Note: Seed data uses Unsplash URLs directly. Cloudinary is
required when uploading new project/service images from the admin
panel.

Environment Configuration
Environment files contain private credentials and must remain local. The
example files should contain placeholders only.
server/.env
Copy the example file:
cp server/.env.example server/.env
On Windows CMD, you can also use:
copy server\.env.example server\.env
Edit server/.env and provide your own local values:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=7d

ADMIN_NAME=your_admin_name
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=replace_with_a_strong_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
ADMIN_NOTIFICATION_EMAIL=your_notification_email

CLIENT_URL=http://localhost:3000
client/.env
Copy the example file:
cp client/.env.example client/.env
On Windows CMD:
copy client\.env.example client\.env
Set the API URL:
REACT_APP_API_URL=http://localhost:5000/api
Email (Gmail App Password)
1. Enable 2-Step Verification on your Google account.
2. Open Google Account → Security → App passwords.
3. Generate an app password for Mail.
4. Store it in SMTP_PASS inside your local server/.env file.
Email is optional for local development --- appointments still save to
MongoDB if email fails.

Security rules: - Never commit .env files or paste their contents
into public issues or messages. - Keep real MongoDB connection strings,
JWT secrets, Cloudinary API secrets, SMTP passwords and admin passwords
private. - Keep .env.example files in the repository only when all
values are placeholders. - If a credential has already been pushed
publicly, rotate or revoke it. Removing it from the latest README does
not remove it from Git history.
Installation & Run
Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
Steps
# 1. Clone and enter project
git clone <repository-url>
cd vastusoundarya

# 2. Install all dependencies
npm run install-all

# 3. Configure environment
# Create server/.env from server/.env.example
# Create client/.env from client/.env.example
# Add your own local credentials to server/.env

# 4. Seed database (admin + sample services & projects)
npm run seed

# 5. Run both frontend and backend
npm run dev
Or run separately:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
URLs
  App                             URL
  Website                             http://localhost:3000

  Admin Login                         http://localhost:3000/admin/login
API Health                          http://localhost:5000/api/health
Create First Admin Account
Option 1 --- Seed script (recommended):
npm run seed
The seed script uses administrator configuration from server/.env. Set
your own admin name, email and password in that file before running the
seed script.

Option 2 --- API register (one-time only):
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Your Admin Name","email":"your-admin@example.com","password":"use-a-strong-password"}'
Only works if no admin exists yet. Do not use real passwords in
documentation or commit them to Git.

Deployment
Backend (Render / Railway / Heroku)
1. Push code to GitHub.
2. Create a new Web Service.
3. Set root directory to server.
4. Build command: npm install.
5. Start command: npm start.
6. Add all required environment variables from your local server/.env
   through the hosting platform's environment settings. Do not upload
   the .env file itself.
7. Use MongoDB Atlas for the production database.
Frontend (Vercel / Netlify)
1. Set root directory to client.
2. Build command: npm run build.
3. Publish directory: build.
4. Add the production API URL as an environment variable:
   REACT_APP_API_URL=https://your-api-domain.com/api
5. Update CLIENT_URL on the server to your frontend production URL.
