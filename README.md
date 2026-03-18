# 📝 NotesProvider

A full-stack **MERN (MongoDB, Express, React, Node.js)** based Notes Management Web Application that allows users to securely create, manage, and organize their notes with a clean and responsive UI.

---

## 🚀 Features

* 🔐 User Authentication (JWT-based)
* 📝 Create, Read, Update, Delete (CRUD) Notes
* 📌 Pin Important Notes
* 🏷️ Add Tags/Categories to Notes
* 🔍 Search & Filter Notes
* 📱 Fully Responsive Design
* 🎨 Custom UI Theme
* ⚡ Fast and Scalable Backend

---

## 🎨 UI Theme Colors

| Purpose     | Color Code |
| ----------- | ---------- |
| Background  | `#F5E3E0`  |
| Secondary   | `#E8B4BC`  |
| Primary     | `#D282A6`  |
| Accent Dark | `#6E4555`  |
| Text Color  | `#3A3238`  |

---

## 🛠️ Tech Stack

### Frontend:

* React.js
* Tailwind CSS
* Axios

### Backend:

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcryptjs

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/gracy-tirkey/NotesProvider.git
cd NotesProvider
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the backend server:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Authentication Flow

* User registers/login
* Server returns JWT token
* Token stored in localStorage
* Token sent in headers for protected routes

---

## 📡 API Endpoints

### Auth Routes

```
POST /api/auth/register
POST /api/auth/login
```

### Notes Routes

```
GET    /api/notes
POST   /api/notes
PUT    /api/notes/:id
DELETE /api/notes/:id
```

---

## 📱 Responsive Design

* Mobile-first approach
* Grid & Flexbox layouts
* Optimized for all screen sizes

---

## ✨ Future Enhancements

* 🌙 Dark Mode
* 🧠 AI Note Summarization
* 📎 File/Image Uploads
* 🔔 Notifications
* 📊 Analytics Dashboard

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 👩‍💻 Author

**Gracy Tirkey**

---

## ⭐ Show Your Support

If you like this project, please give it a ⭐ on GitHub!

---
