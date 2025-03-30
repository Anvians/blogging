import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css'
const Registration = () => {

    const navigate = useNavigate();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('')
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstname, lastname, username, password, email }),
        });
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                alert('Registration successful');
                navigate('/login');

            } else {
                alert('Registration failed');
            }
        } else {
            const errorText = await response.text();
            alert(`Registration failed: ${errorText}`);
        }
    };

    return (
        <div className='register_container'>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        className='firstname'
                        type="text"
                        placeholder='First Name'
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <input
                        className='lastname'
                        type="text"
                        placeholder='Last Name'
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        required
                    />
                </div>

                
                <div>
                    <input
                        className='username'
                        placeholder='Username'
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        className='input_box'
                        placeholder='Password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        className='email'
                        placeholder='Email'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            <p>Already an user <Link to={'/login'}>Login</Link></p>
        </div>
    );
};

export default Registration;

