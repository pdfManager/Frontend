import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Row, Col, Button, Card, Modal, Form } from 'react-bootstrap';
import { BsFilePdf } from 'react-icons/bs';
import { Link } from 'react-router-dom';



pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function File() {
  const [files, setFiles] = useState([]);
  const authToken = localStorage.getItem('token');
  const [selectedFile, setSelectedFile] = useState(null);
  const [shareableLink, setShareableLink] = useState('');
  const [numPages, setNumPages] = useState(0);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [fname, setFname] = useState('')
  const [RecievedFiles, setRecievedFiles] = useState();
  const [showShareModal, setShowShareModal] = useState(false);
  const [email, setEmail] = useState();
  const [senderEmail, setSenderEmail] = useState('');
  // useEffect(() => {
  //   fetchFiles();
  // }, []);
  
  useEffect(() => {
    const authToken = localStorage.getItem('token');
    const fetchFiles = async () => {
      try {
        const response = await axios.get('https://121e-122-168-41-54.ngrok-free.app/getFiles', {
          headers: {
            authorization: `${authToken}`,
            'origin' :'*',
          },
        });
        const filesData = response.data.files[0]?.file || [];
        const recievedData = response.data.Recievedfiles[0].Recievedfiles || [];
        setFiles(filesData);
        setRecievedFiles(recievedData);
        setSenderEmail(response.data.files[0]?.email)
        // console.log(recievedData);
        // console.log(RecievedFiles);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
    // console.log(senderEmail);
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('https://121e-122-168-41-54.ngrok-free.app/getFiles', {
        headers: {
          authorization: `${authToken}`,
        },
      });
      const filesData = response.data[0]?.file || [];
      setFiles(filesData);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const deleteFile = async (fileName) => {
    try {
      await axios.delete(`/deleteFile/${selectedFile}`, {
        headers: {
          authorization: `${authToken}`,
          
        },
      });
      setSelectedFile(null);
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const generateShareableLink = async (fileName) => {
    try {
      const response = await axios.post(
        '/generateShareLink',
        { fileName },
        {
          headers: {
            authorization: `${authToken}`,
          },
        }
      );
      setShareableLink(response.data.shareableLink);
      setShowLinkModal(true);
    } catch (error) {
      console.error('Error generating shareable link:', error);
    }
  };

  // const email = "hariompatel127@gmail.com";
  const handleShareFile = async (fileName) => {
    try {
      console.log("trying", senderEmail)
      await axios.post('/share', { email, fileName, senderEmail },
        {
          headers: {
            authorization: `${authToken}`,
          },
        }
      );
      console.log('File shared successfully');
      setEmail('');
      setShowShareModal(false);
    } catch (error) {
      console.error('Error sharing file:', error);
    }
    // window.location.reload();
  };


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };



  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    setShowLinkModal(false);
  };

  const handleCloseLinkModal = () => {
    setShowLinkModal(false);
  };

  const handleViewPdf = (fileName) => {
    setSelectedFile(fileName);
    setShowPdfModal(true);
  };

  const handleClosePdfModal = () => {
    setShowPdfModal(false);
  };
  function handlePrivateShare() {
    console.log("clicked", showShareModal)
    setShowShareModal(true);
  }
  return (

    <div className='bg-secondary  '>

      <div className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <h1 className="navbar-brand fw-bold" style={{ fontSize: '35px', marginLeft: '15px' }}>
          Files
        </h1>
        <div className="ms-auto">
          <Link to="/home" className="btn btn-secondary me-3">
            Home
          </Link>
          <Link to="/" className="btn btn-danger me-3">
            Logout
          </Link>
        </div>
      </div>

      <div className="navbar navbar-expand-lg navbar-dark bg-secondary">
        <h1 className="navbar-brand  fw-bold ms-auto text-center" style={{ fontSize: '35px', width: '100%' }}>
          My Files
        </h1>
      </div>


      <Row className="justify-content-center">
        {files && files.map((file, index) => (
          <Col sm={6} md={4} lg={3} key={index} className="mb-4">
            <Card className="h-100">
              <Card.Body className="d-flex flex-column align-items-center">
                <BsFilePdf size={64} className="mb-3" />
                <Card.Title className="mb-3 small  text-center">{file}</Card.Title>
                <div className="mt-auto">
                  <Button variant="primary" className="mb-2 text-center w-100 " onClick={() => handleViewPdf(file)}>View</Button>
                  <Button variant="secondary" className='w-100 mb-2 text-center' onClick={() => generateShareableLink(file)}>Share Public</Button>
                  <Button variant="danger" className='w-100 mb-2 text-center' onClick={() => {
                    handlePrivateShare();
                    setFname(file);
                  }}>Share Private</Button>

                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="navbar navbar-expand-lg navbar-dark bg-secondary">
        <h1 className="navbar-brand  fw-bold ms-auto text-center" style={{ fontSize: '35px', width: '100%' }}>
          Recieved Files
        </h1>
      </div>

      <Row className="justify-content-center">
        {RecievedFiles && RecievedFiles.map((file, index) => (
          <Col sm={6} md={4} lg={3} key={index} className="mb-4">
            <Card className="h-100">
              <Card.Title className=" small bg-primary text-white text-center">
                <h6 className='mb-0'>Received From:</h6>
                <h6 style={{ fontWeight: 'bold' }}>{file.senderEmail}</h6>
              </Card.Title>

              <Card.Body className="d-flex flex-column align-items-center">
                <BsFilePdf size={64} className="mb-3" />
                <Card.Title className="mb-3 small  text-center">{file.files}</Card.Title>
                <div className="mt-auto">
                  <Button variant="primary" className="mb-2 text-center w-100 " onClick={() => handleViewPdf(file.files)}>View</Button>
                  <Button variant="secondary" className='w-100 mb-2 text-center' onClick={() => generateShareableLink(file.files)}>Share Public</Button>
                  <Button variant="danger" className='w-100 mb-2 text-center' onClick={() => {
                    handlePrivateShare();
                    setFname(file.files);
                  }}>Share Private</Button>

                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>





      <Modal show={showLinkModal} onHide={handleCloseLinkModal} centered className='display-7'>
        <Modal.Body className="bg-primary text-light d-flex flex-column align-items-center justify-content-center">
          <div className="text-center">
            <a href={shareableLink}>
              <p className="text-light">{shareableLink}</p>
            </a>
            <Button onClick={copyToClipboard} className="btn-secondary">Copy</Button>
          </div>
        </Modal.Body>
      </Modal>

      {selectedFile && (
        <Modal centered show={showPdfModal} onHide={handleClosePdfModal} size="lg">
          <Modal.Header closeButton className=" justify-content-center bg-primary">
            <Modal.Title className="text-light">{selectedFile}
            </Modal.Title>
            <Button className="m-1 w-25" variant="danger" onClick={() => deleteFile(selectedFile)}>Delete</Button>
          </Modal.Header>

          <div className=" justify-content-center">
            <Modal.Body>



              {/* <h3 className="text-center">{selectedFile}</h3> */}

              <Document file={`/upload/${selectedFile}`} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={index} pageNumber={index + 1} />
                ))}
              </Document>

            </Modal.Body>
          </div>
        </Modal>
      )}

      <Modal centered show={showShareModal} onHide={handleCloseShareModal}>
        <Modal.Header closeButton>
          <Modal.Title>Share Private</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={handleEmailChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseShareModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleShareFile(fname)}>
            Share
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

  );
}

export default File;

