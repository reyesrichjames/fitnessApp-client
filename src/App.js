
import './App.css';

import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Workouts from './pages/Workouts';
import AppNavbar from './components/AppNavbar';
import { UserProvider } from './UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    
    const [user, setUser] = useState({
        id: null,
        isAdmin: null
    });

    function unsetUser() {
        localStorage.clear();
    }

    useEffect(() => {
        if(localStorage.getItem('token') !== null) {
            fetch('https://fitnessapp-api-ln8u.onrender.com/users/details', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if(data._id) {
                    setUser({
                        id: data._id,
                        isAdmin: data.isAdmin
                    });
                }
            });
        }
    }, []);

    return (
        <UserProvider value={{ user, setUser, unsetUser }}>
            <Router>
                <AppNavbar />
                <Container>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/workouts" element={<Workouts />} />
                        <Route path="/" element={user.id ? <Navigate to="/workouts" /> : <Navigate to="/login" />} />
                    </Routes>
                </Container>
            </Router>
        </UserProvider>
    );
}

export default App;



