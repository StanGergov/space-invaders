import { Routes, Route } from 'react-router-dom';

import './App.css';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import Logout from './Components/Logout/Logout';
import { AuthProvider } from './Contexts/authContext';
import GuardRoute from './Components/Common/GuardRoute/GuardRoute';


function App() {
  return (
    <AuthProvider>
      <div className="App">
        <main className="site-content">
          <Routes>
            < Route exact path="/register" element={<Register />} />
            < Route path="/login" element={<Login />} />
            <Route element={<GuardRoute />}>
              < Route path='/' element={<Home />} />
              < Route path="/logout" element={<Logout />} />
            </Route>
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;