import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { showSuccessNotification, showErrorNotification } from '../utils/NotificationUtils';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'notyf/notyf.min.css';

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [registered, setRegistered] = useState(false);

    function registerUser(e) {
        e.preventDefault();

        fetch('https://fitnessapp-api-ln8u.onrender.com/users/register', {
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
            if(data.message === "Registered Successfully") {
                setRegistered(true);
                showSuccessNotification("Registration successful!");
            } else {
                showErrorNotification("Registration failed");
            }
        })
        .catch(error => {
            showErrorNotification("Registration failed");
        });
    }

    useEffect(() => {
        if(email !== '' && password !== '') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password]);

    return (
        registered ? 
            <Navigate to="/login" />
        :
        <Form onSubmit={(e) => registerUser(e)}>
            <h1 className="my-5 text-center">Register</h1>
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
                    <Button variant="primary" type="submit" id="registerBtn">
                        Register
                    </Button>
                : 
                    <Button variant="danger" type="submit" id="registerBtn" disabled>
                        Register
                    </Button>
            }
        </Form>
    );
}
