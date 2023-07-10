
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Screens/Login';
import { Route } from 'react-router-dom';
import SignUp from './Screens/SignUp';
import { Routes } from 'react-router-dom';
import Home from './Screens/Home';
import File from './Components/File';


function App() {
  return (
    
    <Router>
    <div>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/files" element={<File />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;