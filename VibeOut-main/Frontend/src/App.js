import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login';
import Home from './dashboard'; // Ensure the file names match
import Dashboard from './analytics'; // Ensure the file names match
import Profile from './profile'; // Ensure the file names match
import FaceCapture from './FaceCapture'; // Ensure the file names match

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/analytics" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/faceCapture" element={<FaceCapture />} />
            </Routes>
        </Router>
    );
}

export default App;