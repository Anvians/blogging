import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import './login.css'
import Cookies from "js-cookie";
const Login = () =>{
    const navigate = useNavigate();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    const token = Cookies.get('auth_token')
    useEffect(() => {
        if (token) {
          navigate('/');
        }
      }, [token, navigate]);


    const handleSubmit = async(e) =>{
        e.preventDefault();
        try{

        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })

        if (response.ok){
            const data = await response.json()
            if(data.success){
                Cookies.set('auth_token', data.token, {expires: 7})
                
                localStorage.setItem("userData", JSON.stringify(data));
                navigate('/profile');
            } else {
                alert('login Failed')
            }
        }
    } catch (error){
        console.log(error)
    }

    }

    
    return(
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Password</label>
                    <input
                        placeholder="username"
                        type="text"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Username</label>
                    <input
                        placeholder="password"
                        type="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login

