// src/components/TodoApp.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoApp.css'; // Import the CSS file for styles

const TodoApp = ({ token }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoStatus, setNewTodoStatus] = useState('pending');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoTitle, setEditTodoTitle] = useState('');
  const [editTodoDescription, setEditTodoDescription] = useState('');
  const [editTodoStatus, setEditTodoStatus] = useState('pending');

  const statusOptions = ['pending', 'in-progress', 'completed', 'on-hold'];

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await axios.get('http://localhost:3001/todos', {
        headers: { 'x-access-token': token },
      });
      setTodos(response.data);
    };

    fetchTodos();
  }, [token]);

  const addTodo = async () => {
    if (!newTodo) return;
    const response = await axios.post('http://localhost:3001/todos', {
      title: newTodo,
      description: newTodoDescription,
      status: newTodoStatus,
    }, {
      headers: { 'x-access-token': token },
    });
    setTodos([...todos, response.data]);
    setNewTodo('');
    setNewTodoDescription('');
    setNewTodoStatus('pending');
  };

  const editTodo = async (id, title, description, status) => {
    setEditTodoId(id);
    setEditTodoTitle(title);
    setEditTodoDescription(description);
    setEditTodoStatus(status);
  };

  const updateTodo = async () => {
    if (!editTodoTitle) return;
    const response = await axios.put(`http://localhost:3001/todos/${editTodoId}`, {
      title: editTodoTitle,
      description: editTodoDescription,
      status: editTodoStatus,
    }, {
      headers: { 'x-access-token': token },
    });
    setTodos(todos.map(todo => (todo.id === editTodoId ? response.data : todo)));
    setEditTodoId(null);
    setEditTodoTitle('');
    setEditTodoDescription('');
    setEditTodoStatus('pending');
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:3001/todos/${id}`, {
      headers: { 'x-access-token': token },
    });
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="todo-container">
      <h1 className="header">Todo List</h1>
      <div className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo"
          className="input-field"
        />
        <input
          type="text"
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
          placeholder="Add description"
          className="input-field"
        />
        <select
          value={newTodoStatus}
          onChange={(e) => setNewTodoStatus(e.target.value)}
          className="input-field"
        >
          {statusOptions.map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button onClick={addTodo} className="add-button">Add Todo</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            {editTodoId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editTodoTitle}
                  onChange={(e) => setEditTodoTitle(e.target.value)}
                  placeholder="Edit todo"
                  className="input-field"
                />
                <input
                  type="text"
                  value={editTodoDescription}
                  onChange={(e) => setEditTodoDescription(e.target.value)}
                  placeholder="Edit description"
                  className="input-field"
                />
                <select
                  value={editTodoStatus}
                  onChange={(e) => setEditTodoStatus(e.target.value)}
                  className="input-field"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button onClick={updateTodo} className="update-button">Update</button>
              </>
            ) : (
              <>
                <span className="todo-text">{todo.title} - {todo.description} - {todo.status}</span>
                <div className="todo-buttons">
                  <button onClick={() => editTodo(todo.id, todo.title, todo.description, todo.status)} className="edit-button">Edit</button>
                  <button onClick={() => deleteTodo(todo.id)} className="delete-button">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
