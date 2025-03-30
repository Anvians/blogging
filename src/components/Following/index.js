import React, { useState, useEffect } from "react";
import "./index.css"; // Add styles if needed
import Cookies from "js-cookie";
import axios from "axios";

const Following = ({ closeModal, post_data }) => {
  const [followingData, setFollowingData] = useState([]); // Corrected state name
  const token = Cookies.get("auth_token");
  console.log("Following Data", followingData);
  // Extract following IDs from post_data

  const followingSearch = () => {};

  const followingIds = React.useMemo(
    () => post_data.map((each) => each.followingId),
    [post_data]
  );

  useEffect(() => {
    const fetchFollowingData = async () => {
      if (!token) {
        console.warn("No authentication token found");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/get-following-data",
          { followingIds },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFollowingData(response.data.users); // Set the fetched following data
      } catch (error) {
        console.error("Error fetching following data:", error);
      }
    };

    fetchFollowingData();
  }, [followingIds, token]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="cross-container">
          <div onClick={closeModal} className="cross">
            X
          </div>
        </div>

        <div className="post-details">
        <div className="fix-searchbar">
            <p>
                <strong>Following Data:</strong>
            </p>
            {/* Render each object in followingData */}
            <input
                onChange={followingSearch}
                type="search"
                className="search-input"
            />
        </div>
          {followingData.length > 0 ? (
            followingData.map((each, index) => (
              <div key={index} className="following-item">
                <img
                  src={each.dp || "default-dp.png"} // Display default image if dp is not available
                  alt={`${each.username}`}
                  className="profile-picture"
                />
                <div className="btn-user">
                  <div className="user-name">
                    <p className="username">{each.username}</p>
                    <p className="name">
                      {each.firstname} {each.lastname}
                    </p>
                  </div>
                </div>
                <button>search</button>
              </div>
            ))
          ) : (
            <p>No following data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Following;
