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
import { DataProvider } from './utils/dataContext';
import HomePage from './pages/learner/homepage/HomePage';
import ExamPage from './pages/learner/exampage/ExamPage';
import CreateTest from './pages/admin/createTest/CreateTest';
import AllMocksPage from './pages/learner/allMocksPage/AllMocksPage';
import ResultPage from './pages/learner/resultPage/ResultPage';
import CreateListening from './pages/admin/createLevel/CreateListening';
import ListeningPage from './pages/learner/exampage/ListeningPage';
import ReadingPage from './pages/learner/exampage/ReadingPage';
import CreateReading from './pages/admin/createLevel/CreateReading';
import AllSelfLearn from './pages/learner/allSelfLearn/AllSelfLearn';
import AdminDashboard from './pages/admin/adminDashboard/AdminDashboard';
import ImageSearch from './components/textToSpeech/ImageSearchAPI';
import Vocabulary from './pages/learner/allSelfLearn/Vocabulary';
function App() {

  return (
    <DataProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route
            exact path="/"
            element={<HomePage />}
          />
          <Route
            exact path="/mocks"
            element={<AllMocksPage />}
          />
          <Route
            exact path="/exam/:id/:partName"
            element={<ExamPage />}
          />
          <Route
            exact path="/result/:id/:partName"
            element={<ResultPage />}
          />
          <Route
            exact path="/test"
            element={<CreateTest />}
          />
          <Route
            exact path="/listening"
            element={<CreateListening />}
          />
          <Route
            exact path="/listening/:id/:level"
            element={<ListeningPage />}
          />
          <Route
            exact path="/reading"
            element={<CreateReading />}
          />
          <Route
            exact path="/reading/:id/:level"
            element={<ReadingPage />}
          />
          <Route
            exact path="/vocabulary"
            element={<AllSelfLearn />}
          />
          <Route
            exact path="/vocabulary/:topicName"
            element={<Vocabulary />}
          />
          <Route
            exact path="/admin"
            element={<AdminDashboard />}
          />
          <Route
            exact path="/photos"
            element={<ImageSearch />}
          />
        </Routes>
      </BrowserRouter>
    </DataProvider>

  )
}

export default App;
