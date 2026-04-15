import AppRoutes from "./routes/AppRoutes";

function App() {
  // ✅ Let Tailwind dark mode handle theme via document root class
  // Theme is controlled by ThemeContext which adds/removes 'dark' class
  return (
    <div className="min-h-screen bg-background dark:bg-dark text-text dark:text-light transition-colors duration-300">
      <AppRoutes />
    </div>
  );
}

export default App;
