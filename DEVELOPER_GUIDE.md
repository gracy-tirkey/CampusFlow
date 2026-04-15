# CampusFlow - Developer Quick Reference Guide

## 🚀 Quick Start Commands

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

**Frontend:** http://localhost:5173  
**Backend:** http://localhost:6090  
**API Base:** http://localhost:6090/api

---

## 📦 Component Usage Examples

### Button Component

```jsx
import Button from "@/components/Button";

// Primary button
<Button variant="primary" size="md" onClick={handleClick}>
  Upload Note
</Button>

// Outline button
<Button variant="outline" size="lg">
  Learn More
</Button>

// Danger button
<Button variant="danger" disabled>
  Delete
</Button>
```

### Input Component

```jsx
import Input from "@/components/Input";
import { FaBook } from "react-icons/fa";

// Text input
<Input
  label="Subject"
  placeholder="Enter subject"
  value={subject}
  onChange={(e) => setSubject(e.target.value)}
  required
/>

// With icon
<Input
  icon={FaBook}
  label="Category"
  type="select"
  required
>
  <option>Math</option>
  <option>Physics</option>
</Input>

// With error
<Input
  label="Email"
  error="Invalid email format"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Card Component

```jsx
import Card from "@/components/Card";

// Basic card
<Card>
  <h3>Note Title</h3>
  <p>Note content</p>
</Card>

// Elevated with hover
<Card elevated hoverable delay={0.1}>
  <h3>Hover me!</h3>
</Card>
```

### Badge Component

```jsx
import Badge from "@/components/Badge";

// Success badge
<Badge variant="success" size="md">
  Approved
</Badge>

// Danger badge
<Badge variant="danger">
  Urgent
</Badge>
```

---

## 🎨 Theme System

### Using Theme Context

```jsx
import { useTheme } from "@/context/ThemeContext";

function MyComponent() {
  const { isDarkMode, toggleTheme, theme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Toggle {isDarkMode ? "Light" : "Dark"} Mode
      </button>
    </div>
  );
}
```

### Tailwind Dark Mode Classes

```html
<!-- Light mode (default) -->
<div class="bg-background text-text">Light mode</div>

<!-- Dark mode -->
<div class="dark:bg-dark dark:text-light">Dark mode</div>

<!-- Both modes with transition -->
<div
  class="bg-background dark:bg-dark text-text dark:text-light transition-colors duration-300"
>
  Both modes
</div>
```

---

## 🔐 Authentication

### Getting Auth Token

```jsx
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <p>Please login first</p>;
  }

  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

```jsx
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <div>Protected content</div>;
}
```

---

## 📤 API Usage with Authentication

### API Interceptor (Automatic Token)

```jsx
import API from "@/api/axios";

// Token is automatically added to all requests
const response = await API.get("/notes");

// POST with FormData
const formData = new FormData();
formData.append("file", file);
formData.append("title", title);

const response = await API.post("/notes/upload", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

---

## 🧪 Upload Form Best Practices

```jsx
export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const validateFile = (selectedFile) => {
    const maxSize = 15 * 1024 * 1024; // 15MB
    const allowedTypes = ["application/pdf", "image/jpeg"];

    if (selectedFile.size > maxSize) {
      showError("File too large");
      return false;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      showError("Invalid file type");
      return false;
    }

    return true;
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!validateFile(file)) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await API.post("/notes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        showSuccess("Upload successful!");
        setFile(null);
      }
    } catch (error) {
      showError(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      <Button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
}
```

---

## 🔄 Common API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": "123",
    "title": "Note Title"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

### Consistent Handling

```jsx
try {
  const response = await API.get("/endpoint");

  if (response.data.success) {
    // Use response.data.data
    console.log(response.data.data);
  }
} catch (error) {
  const errorMsg = error.response?.data?.message || "Unknown error";
  showError(errorMsg);
}
```

---

## 🎯 Best Practices

### ✅ DO

- Use theme-aware classes (`dark:` prefix)
- Wrap protected routes in parent component
- Validate files on frontend before upload
- Use API interceptor for auth token
- Show clear success/error messages
- Add loading states to buttons
- Use reusable components
- Check `isAuthenticated` before rendering

### ❌ DON'T

- Hardcode theme classes
- Manually add auth headers (use interceptor)
- Skip file validation
- Leave forms without validation
- Use hardcoded colors
- Forget to handle error responses
- Mix dark mode class strategies
- Store sensitive data in localStorage (except token)

---

## 🚨 Troubleshooting

### Socket.io Connection Failed

```
Error: WebSocket connection to 'ws://localhost:5001' failed
Solution: Update Chat.jsx to use port 5036
```

### Notes not loading

```
Error: notes.filter is not a function
Solution: Ensure API response is in {success, data: []} format
```

### Dark mode not working

```
Solution 1: Check if <div class="dark"> is on document root
Solution 2: Verify tailwind.config.js has darkMode: "class"
Solution 3: Reload page to apply theme
```

### File upload failing

```
Solution 1: Check file size (max 15MB)
Solution 2: Check file type (PDF, JPG, PNG, GIF only)
Solution 3: Check Cloudinary credentials in .env
Solution 4: Check MongoDB connection
```

---

## 📚 File Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   └── Badge.jsx
│   ├── pages/            # Page components
│   ├── context/          # Context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── api/
│   │   └── axios.js      # API instance with interceptor
│   ├── App.jsx           # Root component
│   └── main.jsx          # Entry point
├── tailwind.config.js    # Tailwind configuration
└── .env                  # Environment variables

backend/
├── controllers/          # Route controllers
├── routes/              # Route handlers
├── models/              # MongoDB models
├── middleware/          # Custom middleware
├── services/            # Business logic
└── server.js            # Entry point
```

---

## 🔗 Useful Links

- **Tailwind Dark Mode:** https://tailwindcss.com/docs/dark-mode
- **React Context API:** https://react.dev/reference/react/useContext
- **Socket.io CORS:** https://socket.io/docs/v4/cors/
- **Cloudinary Upload:** https://cloudinary.com/documentation/upload_widget

---

## 📞 Support Contacts

- **Backend Issues:** Check backend logs with `npm run dev`
- **Frontend Issues:** Check browser console (F12)
- **Database Issues:** Check MongoDB Atlas connection string
- **Upload Issues:** Check Cloudinary API keys

---

**Last Updated:** April 11, 2026  
**Status:** ✅ All systems operational
