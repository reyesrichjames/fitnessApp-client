import { useState, useEffect, useContext } from 'react';
import { Button, Card, Modal, Form, Row, Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';
import { showSuccessNotification, showErrorNotification } from '../utils/NotificationUtils';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'notyf/notyf.min.css';

export default function Workouts() {
    const { user } = useContext(UserContext);
    const [workouts, setWorkouts] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [currentWorkout, setCurrentWorkout] = useState(null);

    const fetchWorkouts = () => {
        fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setWorkouts(data.workouts || []);
        })
        .catch(error => {
            showErrorNotification('Failed to fetch workouts');
        });
    };

    useEffect(() => {
        if(user.id !== null) {
            fetchWorkouts();
        }
    }, [user.id]);

    useEffect(() => {
        if(name !== '' && duration !== '') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [name, duration]);

    const addWorkout = (e) => {
        e.preventDefault();
        
        fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/addWorkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: name,
                duration: duration
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data._id) {
                fetchWorkouts();
                setShowAddModal(false);
                setName('');
                setDuration('');
                showSuccessNotification('Workout added successfully!');
            } else {
                showErrorNotification('Failed to add workout');
            }
        })
        .catch(error => {
            showErrorNotification('Error adding workout');
        });
    };

    const deleteWorkout = (id) => {
        if(window.confirm('Are you sure you want to delete this workout?')) {
            fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/deleteWorkout/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if(data.message === "Workout deleted successfully") {
                    fetchWorkouts();
                    showSuccessNotification('Workout deleted successfully!');
                } else {
                    showErrorNotification('Failed to delete workout');
                }
            })
            .catch(error => {
                showErrorNotification('Error deleting workout');
            });
        }
    };

    const completeWorkout = (id) => {
        fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/completeWorkoutStatus/${id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.message === "Workout status updated successfully") {
                fetchWorkouts();
                showSuccessNotification('Workout completed!');
            } else {
                showErrorNotification('Failed to complete workout');
            }
        })
        .catch(error => {
            showErrorNotification('Error completing workout');
        });
    };

    const openEditModal = (workout) => {
        setCurrentWorkout(workout);
        setName(workout.name);
        setDuration(workout.duration);
        setShowEditModal(true);
    };

    const updateWorkout = (e) => {
        e.preventDefault();
        
        fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/updateWorkout/${currentWorkout._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: name,
                duration: duration
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.message === "Workout updated successfully" || data.updatedWorkout) {
                fetchWorkouts();
                setShowEditModal(false);
                setName('');
                setDuration('');
                setCurrentWorkout(null);
                showSuccessNotification('Workout updated successfully!');
            } else {
                showErrorNotification('Failed to update workout');
            }
        })
        .catch(error => {
            showErrorNotification('Error updating workout');
        });
    };

    return (
        user.id === null ?
            <Navigate to="/login" />
        :
        <>
            <Row className="my-5 align-items-center">
                <Col xs={12} md={4}>
                    {/* Empty column for spacing on larger screens */}
                </Col>
                <Col xs={12} md={4} className="text-center">
                    <h1>My Workouts</h1>
                </Col>
                <Col xs={12} md={4} className="text-center text-md-end">
                    <Button 
                        variant="primary" 
                        id="addWorkout"
                        onClick={() => setShowAddModal(true)}
                    >
                        Add Workout
                    </Button>
                </Col>
            </Row>
            
            <div className="row">
                {workouts.map(workout => (
                    <div className="col-12 col-lg-4 mb-4" key={workout._id}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{workout.name}</Card.Title>
                                <Card.Text>
                                    Duration: {workout.duration}<br/>
                                    Status: {workout.status}<br/>
                                    Date Added: {new Date(workout.dateAdded).toLocaleDateString()}
                                </Card.Text>
                                <div className="d-flex justify-content-between">
                                    {workout.status === "pending" && (
                                        <Button 
                                            variant="success" 
                                            onClick={() => completeWorkout(workout._id)}
                                        >
                                            Complete
                                        </Button>
                                    )}
                                    <Button 
                                        variant="primary" 
                                        onClick={() => openEditModal(workout)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        onClick={() => deleteWorkout(workout._id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Add Workout Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Workout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addWorkout}>
                        <Form.Group className="mb-3">
                            <Form.Label>Workout Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter workout name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Duration</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="e.g. 30 mins" 
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button 
                            variant={isActive ? "primary" : "danger"} 
                            type="submit"
                            disabled={!isActive}
                        >
                            Add Workout
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Workout Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Workout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={updateWorkout}>
                        <Form.Group className="mb-3">
                            <Form.Label>Workout Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter workout name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Duration</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="e.g. 30 mins" 
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button 
                            variant={isActive ? "primary" : "danger"} 
                            type="submit"
                            disabled={!isActive}
                        >
                            Update Workout
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}




