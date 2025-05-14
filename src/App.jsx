import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TasksPage from "./components/tasksPage";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/tasks" element={<TasksPage />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;