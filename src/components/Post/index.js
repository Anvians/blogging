import React, { useState } from "react";
import "./index.css"; // Add styles if needed
import Cookies from "js-cookie";
import axios from "axios";

const UploadModal = ({ closeModal }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log("Form data:", formData);
  
    const token = Cookies.get("auth_token");
    if (!token) {
      alert("You are not authorized to upload files.");
      return;
    }
  
    try {
      console.log("Uploading file:", selectedFile);
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Response:", response.data);
  
      if (response.data.success) {
        console.log("File uploaded successfully");
        closeModal(); // Close the modal after uploading
      } else {
        console.error("File upload failed:", response.data.message || "Unknown error");
        alert(response.data.message || "File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
  
      if (error.response) {
        if (error.response.status === 403) {
          alert("You are not authorized to upload files.");
        } else if (error.response.status === 400) {
          alert("Bad request. Please check the file and try again.");
        }
      } else {
        alert("File upload failed. Please try again later.");
      }
    }
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="cross-container">
        <div onClick={closeModal} className="cross">X</div>
        </div>
        
        <h2>Upload File</h2>
        <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
          {selectedFile ? selectedFile.name : "Click here to upload a file"}
        </div>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <div className="modal-buttons">
          {selectedFile && <button onClick={handleUpload}>Post</button>}
          {!selectedFile && <button className="newButton">Post</button>}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
