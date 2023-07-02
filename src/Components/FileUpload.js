import React, { useState, useEffect, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { AiOutlinePlus } from 'react-icons/ai';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const authToken = localStorage.getItem('token');
  const handleFileChange = (e) => {
    console.log("handleFilechange");
    const selectedFile = e.target.files[0];
    // Validate file type
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }
    setFile(selectedFile);
    console.log("file:", file);

  };

  const handleUpload = async () => {
    console.log("handleUpload");
    if (!file) {
      return; // No file selected, handle this error as needed
    }
    // const authToken = localStorage.getItem('token');

    if (!authToken) {
      alert('Please log in to upload files');
      return;
    }

    const formData = new FormData();
    formData.append("name", "filename");
    formData.append('file', file);

    try {
      console.log("file", file);
      console.log("Auth:", authToken);
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          authorization: `${authToken}`,
        },
      });
      //  setFiles([...files , response.data.filename]);
      console.log("Data", response.data.filename);

    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error
    }
    window.location.reload()
  };
  ;

  return (
    <>
      <div>

        <h1 className="d-flex justify-content-center">File Upload</h1>
        <div className="d-flex justify-content-center mt-4">
          <input variant="danger" className="btn-lg" type="file" accept="application/pdf" onChange={handleFileChange} id="fileInput" />
          {/* <button type="button" onClick={handleUpload} id="uploadButton">Upload</button> */}

          <div>
            <Button variant="danger" type="button" onClick={handleUpload} id="uploadButton" className="btn-lg">
              <AiOutlinePlus className="mr-2" /> Import PDF
            </Button>
          </div>
        </div>
      </div>
      <div>
        {/* <File></File> */}
      </div>
    </>
  );
}

export default FileUpload;
