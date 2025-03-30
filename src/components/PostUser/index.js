import React, { useEffect, useState } from "react";
import "./index.css";
import UploadDp from "../UploadDp";
import Cookies from "js-cookie";
import TabMedia from "../Tabs/TabMedia";
import axios from "axios";
import Following from "../Following";
import { useParams } from "react-router-dom";
import { param } from "express-validator";

const Profile = () => {
  const [followingClick, setFollowingClick] = useState(false);
  const [followerClick, setFollowerClick] = useState(false);
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const [userId, setUserId] = useState(null);
  const [searchedId, setSearchedId] = useState(null)
  const [showUpload, setShowUpload] = useState(false);
  const [userDataPass, setUserDataPass] = useState(null);
  const [followersLen, setFollowersLen] = useState(null)
  const [followerPass, setFollowerPass] = useState(null);
  const [seachedfollowerLen, setSearchedFollowerLen] = useState(null);
  const [userPostData, setUserPostData] = useState(null);
  const token = Cookies.get("auth_token");

  useEffect(() => {
    const userData = async () => {
      if (!token) {
        console.warn("No authentication token found");
        return;
      }
      try {
        console.log("Fetching user data...");
        const response = await fetch(`http://localhost:5000/user/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          console.error("Failed to fetch user:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    userData();
  }, [username]); 

  useEffect(() => {
    if (user) {
      setUserId(user._id); 
    }
  }, [user]);

  useEffect(() => {
    const getFollowing = async () => {
      if (!token || !userId) return;

      try {
        const request = await axios.get("http://localhost:5000/postfollowing", {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId },
        });

        const data = request.data;

        if (data.success) {
          setUserDataPass(data.following);
          setUserPostData(data.following.length);
        }
      } catch (error) {
        console.error("Error fetching following data:", error);
      }
    };

    getFollowing();
  }, [userId]); 


  // useEffect(() => {
  //   const getFollowinglen = async () => {
  //     if (!token || !userId) return;

  //     try {
  //       const request = await axios.get("http://localhost:5000/postfollowers", {
  //         headers: { Authorization: `Bearer ${token}` },
  //         params: { userId }, 
  //       });

  //       const data = request.data;
  //       console.log("followersData_data", data);

  //       if (data.success) {
  //         setUserDataPass(data.followers);
  //         setFollowersLen(data.followers.length);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching following data:", error);
  //     }
  //   };

  //   getFollowinglen();
  // }, [userId]); 

  useEffect(() => {
    const usernameToId = async () => {
      if (!username || !token) return;
  
      try {
        const request = await axios.get(`http://localhost:5000/searchedfollowers/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = request.data;
        if (data.success) {
          setSearchedId(data.searchedId);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
  
    usernameToId();
  }, [username, token]);  
  
  
  useEffect(() => {
    const fetchFollowers = async () => {
      if (!searchedId || !token) return;  
      try {
        const request = await axios.get(`http://localhost:5000/followers/${searchedId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = request.data;
  
        if (data.success) {
          setSearchedFollowerLen(data.followersCount);  
        }
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };
  
    fetchFollowers();
  }, [searchedId, token]);  
  

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <div className="img-name">
        <img
          // onClick={() => setShowUpload(true)}
          src={user.dp || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
          alt="User Avatar"
          className="profile-image"
        />
        {showUpload && <UploadDp closeModal={() => setShowUpload(false)} />}
        <p className="user-email-username">@{user.username}</p>
        <h2 className="user-email">{user.firstname} {user.lastname}</h2>
        <p className="user-email-bio">{user.bio}</p>
      </div>
      <div className="following-followers">
        <p className="following-class" onClick={() => setFollowingClick(true)}>
          Following {userPostData}
        </p>
        <p className="follower-class" onClick={() => setFollowerClick(true)}>
          Followers {seachedfollowerLen}
        </p>
      </div>
      <hr className="horizontal-line"></hr>
      <div className="tabs-container"><TabMedia /></div>
      <div>
        {followingClick && (
          <Following closeModal={() => setFollowingClick(false)} post_data={userDataPass} />
        )}
        {followerClick && (
          <Following closeModal={() => setFollowerClick(false)} post_data={followerPass} />
        )}
      </div>
    </div>
  );
};

export default Profile;
