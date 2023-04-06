import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './screens/HomePage/HomePage';
import DetailsPage from './screens/DetailsPage/DetailsPage';
import AboutPage from './screens/AboutPage/AboutPage';
import GetInsightsPage from './screens/GetInsightsPage/GetInsightsPage';
import LoginPage from './screens/LoginPage/LoginPage';
import NotFoundPage from './screens/NotFoundPage/NotFoundPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/details' element={<DetailsPage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/insights' element={<GetInsightsPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/*' element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
