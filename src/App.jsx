import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = "https://mindful-enchantment-production.up.railway.app/tasks";

function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState('');
    const [filter, setFilter] = useState('All');
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    // Fetch tasks from Railway backend
    useEffect(() => {
        axios.get(API_URL)
            .then((response) => {
                setTasks(response.data);
            })
            .catch((error) => {
                console.error("Error fetching tasks:", error);
            });
    }, []);

    // Add a new task
    const addTask = () => {
        if (newTask.trim()) {
            axios.post(API_URL, { text: newTask, completed: false })
                .then((response) => {
                    setTasks([...tasks, response.data]);
                    setNewTask('');
                })
                .catch((error) => {
                    console.error("Error adding task:", error);
                });
        }
    };

    // Delete a task
    const deleteTask = (id) => {
        axios.delete(`${API_URL}/${id}`)
            .then(() => {
                setTasks(tasks.filter((task) => task.id !== id));
            })
            .catch((error) => {
                console.error("Error deleting task:", error);
            });
    };

    // Edit a task
    const saveEdit = (id) => {
        axios.put(`${API_URL}/${id}`, { text: editText })
            .then(() => {
                const updatedTasks = tasks.map((task) =>
                    task.id === id ? { ...task, text: editText } : task
                );
                setTasks(updatedTasks);
                setEditingIndex(null);
                setEditText('');
            })
            .catch((error) => {
                console.error("Error editing task:", error);
            });
    };

    // Toggle completion status
    const toggleCompletion = (id) => {
        const task = tasks.find((t) => t.id === id);
        axios.put(`${API_URL}/${id}`, { completed: !task.completed })
            .then(() => {
                const updatedTasks = tasks.map((t) =>
                    t.id === id ? { ...t, completed: !t.completed } : t
                );
                setTasks(updatedTasks);
            })
            .catch((error) => {
                console.error("Error toggling completion:", error);
            });
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'Completed') return task.completed;
        if (filter === 'Pending') return !task.completed;
        return true;
    });

    return (
        <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
            <h2>Todo List</h2>
            <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            <div className="add-task">
                <input
                    type="text"
                    placeholder="Add new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button onClick={addTask}>Add Task</button>
            </div>

            <div className="filter-buttons">
                <button onClick={() => setFilter('All')}>All</button>
                <button onClick={() => setFilter('Completed')}>Completed</button>
                <button onClick={() => setFilter('Pending')}>Pending</button>
            </div>

            <ul className="task-list">
                {filteredTasks.map((task) => (
                    <li key={task.id} className="task-item">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleCompletion(task.id)}
                        />
                        {editingIndex === task.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                                <button onClick={() => saveEdit(task.id)}>Save</button>
                                <button onClick={() => setEditingIndex(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span className="task-text">{task.text}</span>
                                <div className="task-buttons">
                                    <button onClick={() => {
                                        setEditingIndex(task.id);
                                        setEditText(task.text);
                                    }}>Edit</button>
                                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;
