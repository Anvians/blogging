import React, { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import Cookies from "js-cookie";

const EditProfile = () => {
  const [activeTab, setActiveTab] = useState("Edit Profile");
  const [name, setName] = useState("");
  const [dp, setDp] = useState(null);
  const [userDp, setUserDp] = useState(null);
  const [bio, setBio] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("dp", dp);
    formData.append("bio", bio);
    formData.append("details", details);

    // Assuming you have the token stored in localStorage or sessionStorage
    const token = Cookies.get("auth_token");

    try {
      const request = await axios.post(
        "http://localhost:5000/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );
    } catch (error) {
      console.log(error.response.data); // This will give you more details on the error from the backend
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("auth_token");
      try {
        const request = await axios.get("http://localhost:5000/userprofile", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
        const data = request.data;

        setUserDp(data.user.dp);
      } catch (error) {
        console.log(error.response.data); // This will give you more details on the error from the backend
      }
    };
    fetchData();
  }, []);

  const handleDpChange = (e) => {
    setDp(e.target.files[0]);
  };

  return (
    <div className="editprofile">
      <div className="tabs">
      <h1>Details</h1>
        <button
          className={activeTab === "Edit Profile" ? "tab active" : "tab"}
          onClick={() => setActiveTab("Edit Profile")}
        >
          Edit Profile
        </button>
        <button
          className={activeTab === "Work and Education" ? "tab active" : "tab"}
          onClick={() => setActiveTab("Work and Education")}
        >
          Work and Education
        </button>
        <button
          className={
            activeTab === "Contact and Basic Info" ? "tab active" : "tab"
          }
          onClick={() => setActiveTab("Contact and Basic Info")}
        >
          Contact and Basic Info
        </button>
        <button
          className={
            activeTab === "Family and Relationships" ? "tab active" : "tab"
          }
          onClick={() => setActiveTab("Family and Relationships")}
        >
          Family and Relationships
        </button>
        <button
          className={activeTab === "Achievements" ? "tab active" : "tab"}
          onClick={() => setActiveTab("Achievements")}
        >
          Achievements
        </button>
        <button
          className={activeTab === "Life Events" ? "tab active" : "tab"}
          onClick={() => setActiveTab("Life Events")}
        >
          Life Events
        </button>
      </div>
      <div className="edit-content">
        <form onSubmit={handleSubmit}>
          {activeTab === "Edit Profile" && (
            <div className="form-group">
              <div className="details">\
                <img 
                
                  crossOrigin="anonymous" 
                  src={userDp} 
                  alt="dp" 
                  className="profile-image"
                  />
                <label htmlFor="Dp">Profile Picture</label>
                <input type="file" id="dp" onChange={handleDpChange} />
              </div>
              <div  className="details">
                <label htmlFor="Change name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="details">
                <label htmlFor="Bio">Bio</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>
            </div>
          )}
          {activeTab === "Work and Education" && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          {activeTab === "Contact and Basic Info" && (
            <div className="form-group">
              <label htmlFor="dp">Profile Picture</label>
              <input type="file" id="dp" onChange={handleDpChange} />
              <img src={userDp} alt="dp" />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
