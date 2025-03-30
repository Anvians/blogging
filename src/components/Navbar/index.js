import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Post from '../Post';

import './index.css';

const Navbar = () => {
    const [show, setShow] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [userDp, setUserDp] = useState(null);
    const [token, setToken] = useState(Cookies.get('auth_token') || null);
    let lastScrollY = window.scrollY;

    const signout = () => {
        Cookies.remove('auth_token');
        setToken(null); //  Ensure the state updates immediately
        localStorage.removeItem("userData")
        window.location.href = '/login';
    }
    

    useEffect(() =>{
        
        const userDp = async () => {
            const token = Cookies.get('auth_token');
            try {
                const response = await fetch('http://localhost:5000/userprofile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setUserDp(data.user.dp);
                    console.log('navbar',data.user);
                } else {
                    console.error('Failed to fetch user:', data.message);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        userDp();
    })

    const controlNavbar = () => {
        if (window.scrollY > lastScrollY) {
            setShow(false);
        } else {
            
            setShow(true);
        }
        lastScrollY = window.scrollY;
    };

    useEffect(() => {
        window.addEventListener('scroll', controlNavbar);
        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, []);

    // Detect changes in cookies and update token state
    useEffect(() => {
        const interval = setInterval(() => {
            setToken(Cookies.get('auth_token') || null);
        }, 1000); // Check every second

        return () => clearInterval(interval); // Cleanup
    }, []);


    return (
        <nav className={`navbar ${show ? 'navbar--visible' : 'navbar--hidden'}`}>

            {token ? <Link className='link-navbar' to={'/'}><h1 className="navbar-title">Vloggers</h1></Link> : <h1 className="navbar-title">Navbar</h1>}
            
            <ul className='navbar_items'>
            
                <li><Link to={'/'}>Home</Link></li>
                <li><Link>About</Link></li>
                <li><Link>Contact</Link></li>
                {token && <li><Link className="upload-btn" onClick={() => setShowUpload(true)}>Upload</Link></li>}
                {token && <li><Link to={'/signout'} onClick={signout}>SignOut</Link></li>}
                {token && <li><Link to={'/profile'}><img alt='user' className='user_photo' crossOrigin='anonymous' src={userDp}/></Link></li>}
                {!token && <li><Link to={'/login'}>Login</Link></li>}
                {!token && <li><Link to={'/register'}>Signup</Link></li>}
                {/* Upload Modal (Popup) */}
                {showUpload && <Post closeModal={() => setShowUpload(false)} />}
            </ul>
        </nav>
    );
};

export default Navbar;
