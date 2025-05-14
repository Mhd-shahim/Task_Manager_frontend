import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [form, setForm] = useState({
        title: '',
        description: '',
        status: 'Pending',
        due_date: ''
    });

    // Fetch tasks from API
    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://127.0.0.1:8000/test/tasks');
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            }
            setLoading(false);
        };
        fetchTasks();
    }, []);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 10;

    // Calculate pagination
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(tasks.length / tasksPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Replace with your API POST endpoint
        try {
            const response = await fetch('http://127.0.0.1:8000/test/create-task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (response.ok) {
                const newTask = await response.json();
                setTasks([newTask, ...tasks]);
                setShowModal(false);
                setForm({ title: '', description: '', status: 'Pending', due_date: '' });
            } else {
                alert('Failed to create task');
            }
        } catch (error) {
            alert('Error creating task');
        }
    };

    return (
        <>
            <h1 className="text-center">Tasks</h1>
            <hr />
            <div className="container">
                <div className='d-flex justify-content-end'>
                    <button
                        className="btn btn-primary mb-3"
                        onClick={() => setShowModal(true)}
                    >
                        Add Task
                    </button>
                </div>
                <div className="table-responsive">
                    <Table striped bordered hover className="w-100">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Due Date</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80px" }}>
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : currentTasks.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center">No tasks found.</td>
                                </tr>
                            ) : (
                                currentTasks.map((task, idx) => (
                                    <tr key={task.id}>
                                        <td>{indexOfFirstTask + idx + 1}</td>
                                        <td>{task.title}</td>
                                        <td>{task.description}</td>
                                        <td>{task.status}</td>
                                        <td>{task.due_date}</td>
                                        <td>{task.created_at}</td>
                                        <td>
                                            <div className='d-flex justify-content-center'>
                                                <button className="btn btn-primary btn-sm">Edit</button>
                                                <button className="btn btn-danger btn-sm ms-2">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
                {/* Pagination Controls */}
                <nav>
                    <ul className="pagination justify-content-center mt-3">
                        <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                Previous
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, idx) => (
                            <li key={idx + 1} className={`page-item${currentPage === idx + 1 ? ' active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(idx + 1)}>
                                    {idx + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Bootstrap Modal with Form */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Task</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDueDate">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="due_date"
                                value={form.due_date}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{width:"100%"}} variant="primary" type="submit">
                            Create Task
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default TasksPage;