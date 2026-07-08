import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import useThemeStore from "./stores/themeStore";
import { useEffect } from "react";
import useAuthStore from "./stores/authStore";
import { Loader2 } from "lucide-react";

// Auth Pages
import LoginPage from "./pages/auth/client/Login.page";
import RegisterPage from "./pages/auth/client/Register.page";

// Main Pages
import HomePage from "./pages/home/Home.page";
import DashboardPage from "./pages/dashboard/Dashboard.page";
import SetListPage from "./pages/flashcard/SetList.page";
import SetDetailPage from "./pages/flashcard/SetDetail.page";
import CreateSetPage from "./pages/flashcard/CreateSet.page";

// Study Modes
import FlashcardModePage from "./pages/learning/FlashcardMode.page";
import LearnModePage from "./pages/learning/LearnMode.page";
import WriteModePage from "./pages/learning/WriteMode.page";
import TestModePage from "./pages/learning/TestMode.page";
import MatchGamePage from "./pages/learning/MatchGame.page";
import SpeedChallengePage from "./pages/learning/SpeedChallenge.page";

// Profile Pages
import ProfilePage from "./pages/profile/Profile.page";
import SettingsPage from "./pages/profile/Settings.page";

// Dashboard Pages
import LeaderboardPage from "./pages/dashboard/Leaderboard.page";
import StatsPage from "./pages/dashboard/Stats.page";
import AdminPage from "./pages/dashboard/Admin.page";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { theme } = useThemeStore();
  const { checkAuth } = useAuthStore();

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    checkAuth().catch(() => {});
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Toaster richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/sets" element={<SetListPage />} />
        <Route path="/sets/:id" element={<SetDetailPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateSetPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Study Modes */}
        <Route
          path="/study/:id/flashcard"
          element={
            <ProtectedRoute>
              <FlashcardModePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study/:id/learn"
          element={
            <ProtectedRoute>
              <LearnModePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study/:id/write"
          element={
            <ProtectedRoute>
              <WriteModePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study/:id/test"
          element={
            <ProtectedRoute>
              <TestModePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study/:id/match"
          element={
            <ProtectedRoute>
              <MatchGamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study/:id/speed"
          element={
            <ProtectedRoute>
              <SpeedChallengePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <StatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
