import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Post from './components/Post'
import Login from './components/Login/login'
import Registration from './components/Registration'
import Layout from './components/Layout';
import SearchedUser from './components/SearchedUser';
import TabMedia from './components/Tabs/TabMedia';
import TabPosts from './components/Tabs/TabPosts';
import UserProfile from './components/UserProfile';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Comments from './components/Comments'
import Following from './components/Following';
import Followers from './components/Followers'
import PostUser from './components/PostUser'

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
      <Navbar />
        <Routes>
        <Route path='/login' element={<Login />} />

        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/register" element={<Registration />} />

          <Route element={<Layout />}>
          
          <Route path="/post" element={<Post />} />
            <Route path="/" element={<Home />} />
            {/* <Route path="/userprofile" element={<UserProfile />} /> */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<PostUser />} />
            <Route path='/following' element={<Following/>}/>
            <Route path='/followers' element={<Followers/>}/>
            {/* <Route path='/searcheduser' element={<SearchedUser/>}/> */}
            <Route path="/tabmedia" element={<TabMedia />} />
            <Route path="/tabposts" element={<TabPosts />} />
            <Route path ='/comments' element={<Comments/>}/>
            <Route path='/postuser/:username' element={<PostUser/>}/>
         </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
