import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Analysis from './Pages/Analysis';
import LoginSignup from './Pages/LoginSignup';
import Admin from './Pages/Admin';
import CreatePage from './Pages/Create';
import ReadPage from './Pages/Read';
import UpdatePage from './Pages/Update'
import DeletePage from './Pages/Delete'
import DisplayPage from './Pages/DisplayPage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/style-your-outfit' element={<Analysis category="style-your-outfit" />} />
        <Route path='/login-signup' element={<LoginSignup />} />
        <Route path='/admin' element={<Admin category="admin" />} />
        <Route path='/create' element={<CreatePage />} /> {/* Add Create route */}
        <Route path='/read' element={<ReadPage />} /> {/* Add Read route */}
        <Route path='/update' element={<UpdatePage />} /> {/* Add Update route */}
        <Route path='/delete' element={<DeletePage />} /> {/* Add Delete route */}
        <Route path='/display' element={<DisplayPage />} /> {/* Add Delete route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
