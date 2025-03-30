import React, { useEffect, useState } from "react";
import "./index.css";
import Cookies from "js-cookie";
import axios from "axios";
import Comments from "../Comments";
import { Link } from "react-router-dom";

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [content, setContent] = useState(null);
  const [showComment, setShowComment] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // Track the selected post
  const token = Cookies.get("auth_token");

  const homeData = async () => {
    console.log("Fetching content...");
    try {
      const response = await axios.get("http://localhost:5000/home", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      if (data.success) {
        setUserData(data.user);
        setContent(data.posts);
      } else {
        console.log("Error fetching data");
      }
    } catch (error) {
      console.log("Error Fetching data", error);
    }
  };

  const likeUser = async (postId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/like",
        { postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;

      if (data.success) {
        // Update the likes in the content state
        setContent((prevContent) =>
          prevContent.map((post) =>
            post._id === postId ? { ...post, likes: data.likes } : post
          )
        );
      } else {
        console.log("Something went wrong");
      }
    } catch (e) {
      console.error("Error liking/disliking post", e);
    }
  };

  useEffect(() => {
    homeData();
  }, []);

  const loggedUserId = userData ? userData._id : null;

  if (!token) {
    return <div>Please log in to view this content.</div>;
  }

  return (
    <div className="home-container">
      <div className="fitness-section">
        {content &&
          content.map((cont, index) => (
            <div className="post-container" key={index}>
              <Link to={`/postuser/${cont.user.username}`}>
                <div className="dp-username">
                  <img
                    crossorigin="anonymous"
                    src={cont.user.dp}
                    alt={cont.user.username}
                    className="user-dp"
                  />
                  <div>
                    <p>{cont.user.username}</p>
                  </div>
                </div>
              </Link>
              {cont.media.endsWith(".mp4") || cont.media.endsWith(".webm") ? (
                <video
                  crossorigin="anonymous"
                  controls
                  className="post-content"
                  src={cont.media}
                  type="video/mp4"
                ></video>
              ) : (
                <img
                  crossorigin="anonymous"
                  src={cont.media}
                  alt={cont.user.username}
                  className="post-content"
                />
              )}
              <div className="like-comments">
                <div className="like-cont">
                  <svg
                    onClick={() => likeUser(cont._id)}
                    className={
                      loggedUserId && cont.likes.includes(loggedUserId)
                        ? "liked"
                        : "not-liked"
                    }
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                    />
                  </svg>
                  <p>{cont.likes.length}</p>
                </div>

                <div className="comment-cont">
                  <svg
                    onClick={() => {
                      setShowComment(true);
                      setSelectedPost(cont); // Set the selected post
                    }}
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>{cont.comments.length > 0 ? cont.comments.length : 0}</p>
                </div>
              </div>

              <div>
                <p className="time-date">
                  {new Date(cont.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  {new Date(cont.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

        <div>
          {showComment && selectedPost && (
            <Comments
              closeModal={() => setShowComment(false)}
              post_data={selectedPost} // Pass the selected post data
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
