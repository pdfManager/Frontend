import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function File() {
  const [files, setFiles] = useState([]);
  const authToken = localStorage.getItem('token');
  const [selectedFile, setSelectedFile] = useState(null);
  const [shareableLink, setShareableLink] = useState('');
  const [numPages, setNumPages] = useState(0);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // useEffect(() => {
  //   fetchFiles();
  // }, []);

  useEffect(() => {
    const authToken = localStorage.getItem('token');
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getFiles', {
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
  
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getFiles', {
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
      await axios.delete(`http://localhost:5000/deleteFile/${selectedFile}`, {
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
        'http://localhost:5000/generateShareLink',
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

  return (
    <>
      <Container>
        <h1 className="text-center mt-4">Files</h1>
        <Row className="justify-content-center">
          {files.map((file, index) => (
            <Col sm={6} md={4} lg={3} key={index} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{file}</Card.Title>
                  <Button onClick={() => handleViewPdf(file)}>View</Button>
                  <Button onClick={() => generateShareableLink(file)}>Generate Shareable Link</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal show={showLinkModal} onHide={handleCloseLinkModal}>
          <Modal.Body>
            <div className="text-center">
              <h2>{shareableLink}</h2>
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
          </Modal.Body>
        </Modal>

        {selectedFile && (
          <Modal show={showPdfModal} onHide={handleClosePdfModal} size="lg">
            <Modal.Body>
              <div className="mt-4">
                <h4 className="text-center">Viewing: {selectedFile}</h4>
                <Button variant="danger" onClick={() => deleteFile(selectedFile)}>Delete</Button>
                <Document file={`http://localhost:5000/upload/${selectedFile}`} onLoadSuccess={onDocumentLoadSuccess}>
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page key={index} pageNumber={index + 1} />
                  ))}
                </Document>
              </div>
            </Modal.Body>
          </Modal>
        )}
      </Container>
    </>
  );
}

export default File;

