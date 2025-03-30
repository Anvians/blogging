import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./index.css";
const TabMedia = () => {
  const [userPost, setUserPost] = useState([]); //  Initialize as an array
  const token = Cookies.get("auth_token");

  const userData = async () => {
    try {
      const response = await fetch("http://localhost:5000/media", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setUserPost(data.posts || []); // Ensure it's always an array
        console.log(data.posts)
      } else {
        console.log("Error fetching data");
      }
    } catch (error) {
      console.log("Error Fetching data", error);
    }
  };

  useEffect(() => {
    userData();
  }, []);

  return (
    <div >
      <div className="post-tab-content">
     
      {Array.isArray(userPost) && userPost.length > 0 ? (
        userPost.map((post) => (
          <div className="post-content" key={post._id}>
            {post.media && (
              <img 
                src='https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg'
                // {post.media} 
                alt="User Post" 
                style={{ width: "100%", height: "auto" }} 
              />
              
            )}
            <p> Likes:{post.likes.length}</p>
          </div>
        ))
      ) : (
        <p>No posts found.</p> //  Handle empty state
      )}
</div>
    </div>
  );
};

export default TabMedia;


