import { useState, useEffect } from 'react'; 
import axios from 'axios';
import './index.css';

function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState('');
    const [filter, setFilter] = useState('All');
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    // Fetch tasks from the backend
    useEffect(() => {
        axios.get('https://mindful-enchantment-production.up.railway.app/tasks')
            .then((response) => setTasks(response.data))
            .catch((error) => console.error('Error fetching tasks:', error));
    }, []);

    // Add a new task
    const addTask = async () => {
        if (newTask.trim()) {
            try {
                const response = await axios.post('https://mindful-enchantment-production.up.railway.app/tasks', {
                    text: newTask,
                    completed: false
                });
                setTasks([...tasks, response.data]);
                setNewTask('');
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    };

    // Delete a task
    const deleteTask = async (index) => {
        try {
            await axios.delete(`https://mindful-enchantment-production.up.railway.app/tasks/${index}`);
            setTasks(tasks.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Edit a task
    const saveEdit = async (index) => {
        try {
            await axios.put(`https://mindful-enchantment-production.up.railway.app/tasks/${index}`, {
                text: editText
            });
            const updatedTasks = [...tasks];
            updatedTasks[index].text = editText;
            setTasks(updatedTasks);
            setEditingIndex(null);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const toggleCompletion = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        setTasks(updatedTasks);
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
                {filteredTasks.map((task, index) => (
                    <li key={index} className="task-item">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleCompletion(index)}
                        />
                        {editingIndex === index ? (
                            <>
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                                <button onClick={() => saveEdit(index)}>Save</button>
                                <button onClick={() => setEditingIndex(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span className="task-text">{task.text}</span>
                                <div className="task-buttons">
                                    <button className="edit-btn" onClick={() => setEditingIndex(index)}>Edit</button>
                                    <button className="delete-btn" onClick={() => deleteTask(index)}>Delete</button>
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
