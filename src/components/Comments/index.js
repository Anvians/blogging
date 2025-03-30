import React, { useState, useEffect } from "react";
import "./comments.css"; // Add styles if needed
import Cookies from "js-cookie";
import axios from "axios";
import { set } from "mongoose";

const Comments = ({ closeModal, post_data }) => {
  const [addComments, setAddComments] = useState("");
  const [comments, setComments] = useState([]); // State to store comments
  const [userDp, setUserDp] = useState(null);
  const token = Cookies.get("auth_token");
  console.log("Comments", comments);
  // Fetch comments for the selected post
  useEffect(() => {
      // Disable scrolling on the body when the modal is open
      document.body.style.overflow = "hidden";
  
      const fetchComments = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/comments/${post_data._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = response.data;
          if (data.success) {
            setComments(data.comments);
            setUserDp(data.user.dp);
          } else {
            console.error("Failed to fetch comments");
          }
        } catch (e) {
          console.error("Error fetching comments", e);
        }
      };
  
      fetchComments();
  
      // Re-enable scrolling on the body when the modal is closed
      return () => {
        document.body.style.overflow = "auto";
      };
    }, [post_data._id, token]);

  // Function to add a new comment
  const CommentFunction = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/comment",
        { postId: post_data._id, comment: addComments },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;

      if (data.success) {
        // Update the comments list with the new comment
        setComments((prevComments) => [...prevComments, data.comment]);
        setAddComments(""); // Clear the input field
      } else {
        console.error("Failed to add comment");
      }
    } catch (e) {
      console.error("Server Error", e);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="cross-container">
          <div onClick={closeModal} className="cross">
            X
          </div>
        </div>

        {/* Display the post content */}
        <div className="post-details">
          <p>
            <strong> {post_data.user.username.charAt(0).toUpperCase() + post_data.user.username.slice(1)}'s Post</strong>
          </p>
          <p>{post_data.content}</p>
          {/* Display the post media (image or video) */}
          {post_data.media.endsWith(".mp4") ||
          post_data.media.endsWith(".webm") ? (
            <video controls className="post-media">
              <source src={post_data.media} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              crossOrigin="anonymous"
              src={post_data.media}
              alt={post_data.user.username}
              className="post-media"
            />
          )}
        </div>
        {/* {post_data.media}  */}
        {/* /* Comments Section*/}
        <div className="comments-section">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="comment-item">
                <div className="comment-header">
                  <img
                    crossOrigin="anonymous"
                    src={comment.user.dp}
                    alt={comment.user.username}
                    className="comment-user-dp"
                  />
                </div>
                <div className="username-comments">
                  
                    <p className="username">  {comment.user.username}</p>
                  
                  <p className="user-comment">{comment.text}</p>
                </div>

              </div>
              
            ))
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
          
        </div>

        {/* Add Comment Input */}
        <div className="add-comment">
        
          <textarea
            value={addComments}
            onChange={(e) => setAddComments(e.target.value)}
            placeholder="Add a comment..."
          />
           <button className="comment-btn" onClick={CommentFunction}>Post Comment</button>
         
        </div>
      </div>
    </div>
  );
};

export default Comments;
