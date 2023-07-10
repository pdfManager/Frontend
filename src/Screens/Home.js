import React from 'react';
import FileUpload from '../Components/FileUpload';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';



export default function Home() {
  const navigate = useNavigate();
  

  function handleViewFiles() {
    navigate('/files');
  }
  return (
    <>
      <div className="navbar navbar-expand-lg navbar-dark bg-info">
        <h1 className="navbar-brand m-2 fw-bold ms-auto" style={{ fontSize: '35px' }}>Welcome to PDF MANAGER</h1>
        <div className="ms-auto">

          <Link to="/" className="btn btn-danger me-3">
            Logout
          </Link>
        </div>
      </div>

      <Card className="vh-100 d-flex justify-content-center align-items-center ">
            <Button variant="danger" onClick={handleViewFiles} className="btn-lg mb-4 w-50  fw-bold ">
              My Files
            </Button>
            <FileUpload />
      </Card>

    </>

  )
}


