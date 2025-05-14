import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (isEdit) {
                response = await fetch(`http://127.0.0.1:8000/test/edit-task/${editTaskId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                });
            } else {
                response = await fetch('http://127.0.0.1:8000/test/create-task', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                });
            }
            if (response.ok) {
                const updatedTask = await response.json();
                if (isEdit) {
                    setTasks(tasks.map(t => t.id === editTaskId ? updatedTask : t));
                } else {
                    setTasks([updatedTask, ...tasks]);
                }
                setShowModal(false);
                setForm({ title: '', description: '', status: 'Pending', due_date: '' });
                setIsEdit(false);
                setEditTaskId(null);
            } else {
                alert('Failed to save task');
            }
        } catch (error) {
            alert('Error saving task');
        }
    };

    // Add this function inside your TasksPage component
    const handleDelete = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            const response = await fetch(`http://127.0.0.1:8000/test/task-delete/${taskId}`, {
                method: 'POST',
            });
            if (response.ok) {
                setTasks(tasks.filter(task => task.id !== taskId));
            } else {
                alert('Failed to delete task');
            }
        } catch (error) {
            alert('Error deleting task');
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
                                        <td>
                                        {task.description && task.description.length > 10
                                            ? `${task.description.slice(0, 10)}...`
                                            : task.description}
                                        </td>
                                        <td>{task.status}</td>
                                        <td>{task.due_date}</td>
                                        <td>{task.created_at}</td>
                                        <td>
                                            <div className='d-flex justify-content-center'>
                                                <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => {
                                                    setIsEdit(true);
                                                    setEditTaskId(task.id);
                                                    setForm({
                                                    title: task.title,
                                                    description: task.description,
                                                    status: task.status,
                                                    due_date: task.due_date,
                                                    });
                                                    setShowModal(true);
                                                }}
                                                >
                                                Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm ms-2"
                                                    onClick={() => handleDelete(task.id)}
                                                >
                                                    Delete
                                                </button>
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
            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setIsEdit(false);
                    setEditTaskId(null);
                    setForm({ title: '', description: '', status: 'Pending', due_date: '' });
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? "Edit Task" : "Create Task"}</Modal.Title>
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
                            {isEdit ? "Update Task" : "Create Task"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default TasksPage;