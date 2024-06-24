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
import ListeningPage from './pages/learner/exampage/ListeningPage';
import ReadingPage from './pages/learner/exampage/ReadingPage';
import AllSelfLearn from './pages/learner/allSelfLearn/AllSelfLearn';
import AdminDashboard from './pages/admin/adminDashboard/AdminDashboard';
import ImageSearch from './components/textToSpeech/ImageSearchAPI';
import Vocabulary from './pages/learner/allSelfLearn/Vocabulary';
import RoadMap from './pages/learner/roadMap/RoadMap';
import LoginPage from './pages/common/LoginPage';
import AllPartsPage from './pages/learner/allPartsPage/AllPartsPage';
import PartResultPage from './pages/learner/resultPage/PartResultPage';
import ReviewPart from './pages/learner/reviewPage/ReviewPart';
import ReviewMock from './pages/learner/reviewPage/ReviewMock';
import NewRoadMap from './pages/learner/roadMap/NewRoadMap';
import EntranceExam from './pages/learner/roadMap/EntranceExam';
import EntranceResultPage from './pages/learner/roadMap/EntranceResultPage';
import ReviewVocabulary from './pages/learner/allSelfLearn/ReviewVocabulary';
import SpeakingExam from './pages/learner/speakingPage/SpeakingExam';
import WrittingExam from './pages/learner/writtingPage/WritingExam';
import AllGrammarsPage from './pages/learner/grammarPage/AllGrammarsPage';
import GrammarExam from './pages/learner/grammarPage/GrammarExam';
import AllSpeaking from './pages/learner/speakingPage/AllSpeaking';
import AllWritting from './pages/learner/writtingPage/AllWritting';
import BlogPage from './pages/learner/blogPage/BlogPage';
import SinglePostPage from './pages/learner/blogPage/SinglePostPage';
import AuthCallback from './pages/common/AuthCallBack';
function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route
            path="/auth-callback/*"
            element={<AuthCallback />}
          />
          <Route
            exact path="/blog"
            element={<BlogPage />}
          />
          <Route
            exact path="/posts/:id"
            element={<SinglePostPage />}
          />
          <Route
            exact path="/grammars/:testName"
            element={<GrammarExam />}
          />
          <Route
            exact path="/grammars"
            element={<AllGrammarsPage />}
          />
          <Route
            exact path="/speakings/practice/:id/"
            element={<AllSpeaking />}
          />
          <Route
            exact path="/speakings/practice/:id/:partName"
            element={<SpeakingExam />}
          />
          <Route
            exact path="/writtings/practice/:id/"
            element={<AllWritting />}
          />
          <Route
            exact path="/writtings/practice/:id/:partName"
            element={<WrittingExam />}
          />
          <Route
            exact path="/"
            element={<HomePage />}
          />
          <Route
            exact path="/roadmap"
            element={<RoadMap />}
          />
          <Route
            exact path="/mocks"
            element={<AllMocksPage />}
          />
          <Route
            exact path="/entrance/:id"
            element={<EntranceExam />}
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
            exact path="/result/EntranceTest"
            element={<EntranceResultPage />}
          />
          <Route
            exact path="/listenings/:id/:partName"
            element={<PartResultPage />}
          />
          <Route
            exact path="/readings/:id/:partName"
            element={<PartResultPage />}
          />
          <Route
            exact path="/review/:type/:testName/:partName/:id"
            element={<ReviewPart />}
          />
          <Route
            exact path="/review/:testName/:id"
            element={<ReviewMock />}
          />
          <Route
            exact path="/test"
            element={<CreateTest />}
          />

          <Route
            exact path="/listenings/practice/:id/:testName"
            element={<ListeningPage />}
          />

          <Route
            exact path="/readings/practice/:id/:testName"
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
            exact path="/vocabulary/review/:topicName"
            element={<ReviewVocabulary />}
          />
          <Route
            path="/admin/*"
            element={<AdminDashboard />}
          />
          <Route
            exact path="/photos"
            element={<ImageSearch />}
          />
          <Route
            exact path="/login"
            element={<LoginPage />}
          />
          <Route
            exact path="/listenings/practice/:id"
            element={<AllPartsPage />}
          />
          <Route
            exact path="/readings/practice/:id"
            element={<AllPartsPage />}
          />
          <Route
            exact path="/roadmap/create"
            element={<NewRoadMap />}
          />

        </Routes>
      </BrowserRouter>
    </DataProvider>

  )
}

export default App;
