import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Dialog, DialogContent } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import './global.css';

const FileUploader = ({ file, setFile }) => {
  const [open, setOpen] = useState(false);

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
  };

  const { getRootProps } = useDropzone({
    onDrop,
    accept: 'video/*',
    maxFiles: 1,
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="file-uploader-container" {...getRootProps()}>
      <CloudUploadIcon style={{ fontSize: 60, color: '#5D3587' }} />
      <p className="upload-text">Add or drag your videos</p>

      {/* {fileUrl && (
        <div className="video-preview">
          <Button onClick={handleOpen} variant="outlined" color="primary">
            View Video
          </Button>
          <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth={true}>
            <DialogContent>
              <video src={fileUrl} className="video-player" controls></video>
            </DialogContent>
          </Dialog>
        </div>
      )}
    
 */} </div>);
};

export default FileUploader;
