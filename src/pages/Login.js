import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext'; 
import { showSuccessNotification, showErrorNotification } from '../utils/NotificationUtils';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'notyf/notyf.min.css';

export default function Login() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(true);

    function authenticate(e) {
        e.preventDefault();

        fetch('https://fitnessapp-api-ln8u.onrender.com/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.access !== undefined) {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);

                setEmail('');
                setPassword('');

                showSuccessNotification('You are now logged in');
                navigate('/workouts');
            } else if (data.error == "No Email Found") {
                showErrorNotification('Email does not exist');
            } else {
                showErrorNotification(`${email} does not exist`);
            }
        })
        .catch(error => {
            showErrorNotification('Login failed');
        });
    }

    function retrieveUserDetails(token) {
        fetch('https://fitnessapp-api-ln8u.onrender.com/users/details', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setUser({
                id: data._id,
                isAdmin: data.isAdmin
            })
        })
    }

    useEffect(() => {
        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }
    }, [email, password]);

    return (
        user.id !== null ?
            <Navigate to="/workouts" />
        :
        <Form onSubmit={(e) => authenticate(e)}>
            <h1 className="my-5 text-center">Login</h1>
            <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                    type="email" 
                    placeholder="Enter email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            { 
                isActive ? 
                    <Button variant="primary" type="submit" id="loginBtn">
                        Login
                    </Button>
                : 
                    <Button variant="danger" type="submit" id="loginBtn" disabled>
                        Login
                    </Button>
            }
        </Form>       
    )
}
