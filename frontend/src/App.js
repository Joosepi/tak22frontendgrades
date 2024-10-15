// src/App.js
import React, { useState } from 'react';
import Login from './components/Login';
import TodoApp from './components/TodoApp';
import WeatherApp from './components/WeatherApp';
import './App.css'; // Ensure you import your CSS for styling

function App() {
    const [token, setToken] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    return (
        <div className="App">
            {token ? (
                <div className="todo-weather-container">
                    <TodoApp token={token} />
                    <WeatherApp />
                </div>
            ) : (
                <div>
                    <Login setToken={setToken} />
                </div>
            )}
        </div>
    );
}

export default App;
