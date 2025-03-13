import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3000/tasks")
            .then((response) => setTasks(response.data))
            .catch((error) => console.error("Error fetching tasks:", error));
    }, []);

    const addTask = () => {
        if (newTask.trim()) {
            axios.post("http://localhost:3000/tasks", { text: newTask, completed: false })
                .then((response) => setTasks([...tasks, response.data]))
                .catch((error) => console.error("Error adding task:", error));
            setNewTask("");
        }
    };

    const deleteTask = (id) => {
        axios.delete(`http://localhost:3000/tasks/${id}`)
            .then(() => setTasks(tasks.filter((task) => task.id !== id)))
            .catch((error) => console.error("Error deleting task:", error));
    };

    return (
        <div>
            <h2>Todo List</h2>
            <input
                type="text"
                placeholder="Add new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={addTask}>Add</button>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {task.text}
                        <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;
