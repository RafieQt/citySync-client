# CitySync — Client

CitySync is a full-stack public infrastructure issue reporting platform where citizens can report real-world city problems, staff can manage and resolve them, and admins oversee the entire system.

🌐 **Live Site:** [https://citysync-client.web.app/](https://citysync-client.web.app/)

---

## 🔐 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | cityadmin@gmail.com | 123456 |
| Staff | micro@gmail.com | 123456 |
| Citizen | citizen@gmail.com | 123456 |

---

## ✨ Features

### 🏠 Public Pages
- **Home Page** — Banner, How It Works, Categories Showcase, Recently Resolved Issues, CTA Banner
- **All Issues Page** — Browse all reported issues with server-side search, filter by category/status/priority, and pagination
- **Issue Details Page** — Full issue info, upvoting, timeline tracking (private route)

### 👤 Citizen Dashboard
- Submit up to 3 issues (free) or unlimited (premium)
- View and manage own issues
- Upvote other citizens' issues
- Boost issue priority to High by paying ৳100 via Stripe
- Upgrade to Premium for ৳500 via Stripe hosted checkout
- Edit or delete own pending issues
- View full issue timeline

### 🛠️ Staff Dashboard
- View all assigned issues
- Update issue status (Pending → In Progress → Resolved)
- Each status change is recorded in the issue timeline

### 🔧 Admin Dashboard
- Overview stats (total issues, resolved, pending, rejected, revenue)
- Manage all issues — assign staff, change status, reject
- Manage Users — block/unblock citizens, grant premium
- Manage Staff — create staff accounts (Firebase + DB), edit, delete
- View all payments with transaction history

---

## 🛡️ Role-Based Access

- **Citizen** — Can only access citizen dashboard routes
- **Staff** — Can only access staff dashboard routes
- **Admin** — Has full access to all admin routes
- All dashboard routes are protected with JWT token verification

---

## 🧰 Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | Frontend framework |
| Vite | Build tool |
| Tailwind CSS + DaisyUI | Styling |
| React Router v7 | Routing |
| TanStack Query | Server state management |
| Axios | HTTP client |
| Firebase Auth | Authentication |
| Stripe Hosted Checkout | Payments |
| React Hook Form | Form handling |
| Lottie React | Animations |
| Lucide React | Icons |
| React Hot Toast | Notifications |

---

## 📁 Project Structure

```
src/
├── assets/          # Lottie animations, images
├── components/      # Shared components (Navbar, Footer, Loading, etc.)
├── Contexts/        # Firebase AuthContext & AuthProvider
├── firebase/        # Firebase init & secondary app
├── hooks/           # useAuth, useUser
├── Layouts/         # RootLayout, DashboardLayout
├── pages/
│   ├── homePage/
│   ├── allIssues/
│   ├── issueDetails/
│   ├── submitIssue/
│   ├── signIn/
│   ├── register/
│   └── dashboard/
│       ├── citizen/
│       ├── staff/
│       └── admin/
├── routes/          # router.jsx, PrivateRoute, RoleRoute
└── utils/           # axiosSecure.js
```

---

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/RafieQt/citySync-client
cd citySync-client

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in your Firebase and API keys

# Start dev server
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the root with the following:

```env
VITE_API_URL=http://localhost:3000
VITE_image_host=your_imgbb_api_key

# Firebase
VITE_apiKey=
VITE_authDomain=
VITE_projectId=
VITE_storageBucket=
VITE_messagingSenderId=
VITE_appId=
```

---

## 🔗 Server Repo

[https://github.com/RafieQt/cictysync-server](https://github.com/RafieQt/cictysync-server)