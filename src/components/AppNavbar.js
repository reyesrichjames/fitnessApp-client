import { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function AppNavbar() {
    const { user, unsetUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleBrandClick = (e) => {
        e.preventDefault();
        if (user.id !== null) {
            navigate('/workouts');
        } else {
            navigate('/login');
        }
    }

    const handleLogout = () => {
        unsetUser();
        navigate('/login');
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand onClick={handleBrandClick} style={{cursor: 'pointer'}}>Fitness Tracker</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {user.id !== null ? (
                            <>
                                <Nav.Link as={Link} to="/workouts">Workouts</Nav.Link>
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}


