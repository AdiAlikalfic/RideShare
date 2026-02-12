import './App.css';
import AuthPage from "./pages/auth/AuthPage";
import HomePage from "./pages/home/HomePage";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="*" element={<Navigate to ="/auth" />} />
    </Routes>
  )
}

export default App;