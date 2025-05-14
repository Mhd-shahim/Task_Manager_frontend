import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';

function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch tasks from API
    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                // Replace the URL below with your actual API endpoint
                const response = await fetch('http://127.0.0.1:8000/test/tasks');
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            }
            setLoading(false); // <-- Move this here
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

  return (
    <>
      <h1 className="text-center">Tasks</h1>
      <hr />
      <div className="container">
        <div className='d-flex justify-content-end'>
          <button className="btn btn-primary mb-3" onClick={() => alert("Add Task")}>
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
            {loading == true ? (
                <tr>
                <td colSpan={7} className="text-center">
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80px" }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    </div>
                </td>
                </tr>
            ) : tasks.length === 0 ? (
                <tr>
                <td colSpan={7} className="text-center">No tasks found.</td>
                </tr>
            ) : (
                tasks.map((task, idx) => (
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
    </>
  );
}

export default TasksPage;