import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './Views/HomePage/HomePage';
import DetailsPage from './Views/DetailsPage/DetailsPage';
import AboutPage from './Views/AboutPage/AboutPage';
import GetInsightsPage from './Views/GetInsightsPage/GetInsightsPage';
import LoginPage from './Views/LoginPage/LoginPage';
import REvaluatePlusPage from './Views/REvaluatePlusPage/REvaluatePlusPage';
import NotFoundPage from './Views/NotFoundPage/NotFoundPage';

//Main component that encapsulate all other components
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
          <Route path='/revaluate+' element={<REvaluatePlusPage />} />
          <Route path='/nodata' element={<NotFoundPage />} />
          <Route path='/*' element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
