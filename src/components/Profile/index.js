import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom'
import "./index.css";
import UploadDp from "../UploadDp";
import Cookies from "js-cookie";
import TabMedia from "../Tabs/TabMedia";
import TabPosts from "../Tabs/TabPosts";
import axios from "axios";
import Following from "../Following";

const Profile = () => {
  const [followingClick, setFollowingClick] = useState(false);
  const [followerClick, setFollowerClick] = useState(false);
  const [user, setUser] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [userDataPass, setUserDataPass] = useState(null);
  const [followerPass, setFollowerPass] = useState(null);
  const [followerLen, setFollowerLen] = useState(null);
  const [userPostData, setUserPostData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const userData = async () => {
    const token = Cookies.get("auth_token");
    if (!token) {
      console.warn("No authentication token found");
      return;
    }

    try {
      console.log("Fetching user data...");
      const response = await fetch("http://localhost:5000/userprofile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data.user)
      if (data.success) {
        setUser(data.user); // Store fetched user data in state
        setAvatar(data.user.dp);
      } else {
        console.error("Failed to fetch user:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

 
  const getFollowing = async () => {
    const token = Cookies.get("auth_token");
    if (!token) {
      console.warn("No authentication token found");
      return;
    }
    try {
      const request = await axios.get("http://localhost:5000/following", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = request.data;
      if (data.success) {
        setUserDataPass(data.following);
        setUserPostData(data.following.length);
      }
    } catch (e) {
      console.log("Something error", e);
    }
  };
  const getFollowers = async () => {
    const token = Cookies.get("auth_token");
    if (!token) {
      console.warn("No authentication token found");
      return;
    }
    try {
      const request = await axios.get("http://localhost:5000/followers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = request.data;
      if (data.success) {
        setFollowerPass(data.followers);
        setFollowerLen(data.followers.length);
      }
    } catch (e) {
      console.log("Something error", e);
    }
  };

 
  const posts = async () => {
    const token = Cookies.get("auth_token");
    if (!token) {
      console.warn("No authentication token found");
      return;
    }

    try {
      console.log("Fetching user data...");
      const response = await fetch("http://localhost:5000/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.user); // Store fetched user data in state
        setAvatar(data.user.dp);
      } else {
        console.error("Failed to fetch user:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }



  useEffect(() => {
    userData(); // Call API on mount
    getFollowing();
    getFollowers();
  }, []);
  if (!user) {
    return <div>Loading...</div>;
  }

  //Code to handle Tabs

  return (
    <div className="user-profile">
      <div className="img-name">
        {avatar ? 

          <img
            onClick={() => setShowUpload(true)}
            crossorigin="anonymous"
            src={avatar}
            alt="User Avatar"
            className="profile-image"
          />
         : <img
            onClick={() => setShowUpload(true)}
            crossorigin="anonymous"
            src='https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
            alt="User Avatar"
            className="profile-image"
          />}
        {showUpload && <UploadDp closeModal={() => setShowUpload(false)} />}
        <p className="user-email-username">@{user.username}</p>
        
        <h2 className="user-email">
          {user.firstname} {user.lastname}
        </h2>
        <p className="user-email-bio">{user.bio}</p>
      </div>
      <div className="following-followers">
        <p
          className="following-class"
          onClick={() => {
            setFollowingClick(true);
          }}
        >
          {" "}
          Following {userPostData}
        </p>
        <p
          className="follower-class"
          onClick={() => {
            setFollowerClick(true);
          }}
        >
          Followers {followerLen}
        </p>
      </div>
      <hr className="horizontal-line"></hr>
      <div className="tabs-container">{<TabMedia />}</div>
      <div>
        {followingClick && (
          <Following
            closeModal={() => setFollowingClick(false)}
            post_data={userDataPass} // Pass the selected post data
          />
        )}

        {followerClick && (
          <Following
            closeModal={() => setFollowerClick(false)}
            post_data={followerPass} // Pass the selected post data
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
