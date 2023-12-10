import { useState } from 'react'
import { useAuthUser, useIsAuthenticated } from "react-auth-kit";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from './pages/learner/homepage/HomePage';
import ExamPage from './pages/learner/exampage/ExamPage';
import CreateTest from './pages/admin/createTest/createTest';
function App() {

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route
          exact path="/"
          element={<HomePage />}
        />
        <Route
          exact path="/exam"
          element={<ExamPage />}
        />
        <Route
          exact path="/test"
          element={<CreateTest />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
