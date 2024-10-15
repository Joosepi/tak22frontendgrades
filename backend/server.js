const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs'); // Add this import
require('dotenv').config();

const app = express();
const port = 3001;
const secretKey = process.env.SECRET_KEY || 'admin';

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Load todos from todos.json
const loadTodos = () => {
    try {
        const data = fs.readFileSync('todos.json', 'utf8'); // Ensure you're reading the file as utf8
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading todos.json:', error);
        return []; // Return an empty array if there's an error
    }
};

// Save todos to todos.json
const saveTodos = (todos) => {
    try {
        fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2)); // Format the JSON for readability
    } catch (error) {
        console.error('Error writing to todos.json:', error);
    }
};

let todos = loadTodos(); // Load initial todos

// Token verification middleware
function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        req.userId = decoded.id;
        next();
    });
}

// POST: Create a new TODO
app.post('/todos', verifyToken, (req, res) => {
    const todo = {
        id: todos.length ? todos[todos.length - 1].id + 1 : 1, // Generate new ID
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || 'pending', // Default to 'pending' if not provided
        createdAt: new Date().toISOString(), // Store date as ISO string
        updatedAt: new Date().toISOString(),
    };
    todos.push(todo);
    saveTodos(todos); // Save todos after adding a new one
    res.status(201).json(todo);
});

// GET: Retrieve all TODOs
app.get('/todos', verifyToken, (req, res) => {
    res.json(todos);
});

// GET: Retrieve a single TODO by ID
app.get('/todos/:id', verifyToken, (req, res) => {
    const todo = todos.find(t => t.id === Number(req.params.id));
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
});

// PUT: Update a TODO by ID
app.put('/todos/:id', verifyToken, (req, res) => {
    const todo = todos.find(t => t.id === Number(req.params.id));
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    // Update properties
    todo.title = req.body.title || todo.title; // Keep existing value if not provided
    todo.description = req.body.description || todo.description; // Keep existing if not provided
    todo.status = req.body.status || todo.status; // Keep existing if not provided
    todo.updatedAt = new Date().toISOString(); // Update the timestamp

    saveTodos(todos); // Save updated todos
    res.json(todo);
});

// DELETE: Remove a TODO by ID
app.delete('/todos/:id', verifyToken, (req, res) => {
    const index = todos.findIndex(t => t.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Todo not found' });
    todos.splice(index, 1);
    saveTodos(todos); // Save todos after deletion
    res.status(204).end();
});

// Mock user data
const users = [
    { id: 1, username: 'user', password: 'password' },
    { id: 2, username: 'user2', password: 'password2' }
];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Received request:', username, password); // Debugging log

    const user = users.find(u => u.username === username && u.password === password);
    console.log('User found:', user); // Debugging log

    if (!user) {
        console.log('Invalid username or password'); // Debugging log
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
