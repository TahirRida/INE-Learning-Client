import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Select, MenuItem, Snackbar } from '@material-ui/core';
import '../../styles/courseform.css';
import BannerBackground from "../../Assets/home-banner-background.png";
import AboutBackground from "../../Assets/about-background.png";
import FileUploader from './FileUploader';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import LoadingPage from '../LoadingPage';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import baseURL from '../../utils/fetchConfig';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useDropzone } from 'react-dropzone';

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../firbase";
import { v4 } from "uuid";
import { getToken } from '../../utils/TokenContext';
const CourseForm = () => {
  const [videoSelected, setVideoSelected] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const formData = new FormData();
  const [videoUrl, setVideoUrl] = useState('');
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
  };
  const { getRootProps } = useDropzone({
    onDrop,
    accept: 'video/*',
    maxFiles: 1,
  });
  const uploadFile = async () => {
    try {
      const videoRef = ref(storage, `videos/${file.name + v4()}`);
      const snapshot = await uploadBytes(videoRef, file);
      const vidurl = await getDownloadURL(snapshot.ref);
      console.log('videourl:', vidurl);
      return vidurl; // Return the video URL after upload and URL retrieval
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; // Throw the error to be caught by the caller
    }
  };
  const handleImageUpload = async (event) => {
    setImageSelected(true);
    const imageUploaded = event.target.files[0];
    const imageRef = ref(storage, `images/${imageUploaded.name + v4()}`);
    const snapshot = await uploadBytes(imageRef, imageUploaded);
    const imurl = await getDownloadURL(snapshot.ref);
    setImageUrl(imurl);
  };
  useEffect(() => {
    if (file) {
      setVideoSelected(true);
    }
  }, [file]);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    formData.set(name, value);
  };
  const setAuthToken = () => {
    const token = getToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      setLoading(true);
      setAuthToken();
      const vidurl = await uploadFile(); 
      setVideoUrl(vidurl);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('video', vidurl);
      formData.append('category', category);
      formData.append('thumbnail', imageUrl);
      console.log('fronted Response:', formData.get('video'));
      const response = await axios.post(`${baseURL}/courses`, {
        title: formData.get('title'),
        description: formData.get('description'),
        video: formData.get('video'),
        category: formData.get('category'),
        thumbnail: formData.get('thumbnail')
      });
      setLoading(false);
      console.log('Backend Response:', response.data);
      setTitle('');
      setDescription('');
      setCategory('');
      setImageUrl('');
      setImage(null);
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
    }
  };
  
  
  
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  const navigateToFeed = () => {
    navigate('/feed');
  };
  return (
    <div className="container1">
      <div>
        {loading && <LoadingPage loading={loading} />}
      </div>
      <button className='feed-button' onClick={() => { console.log('Button clicked'); navigateToFeed(); }}>        <FiArrowLeft />
        Feed
      </button>
      <div className="content">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="Banner Background" />
        </div>
        <div className="about-background-image-container">
          <img src={AboutBackground} alt="About Background" />
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <Typography variant="h3" className="entryTitle">
            Share Your <span className="skills">Skills </span>!
          </Typography>
          <Typography variant="h6" className="formField">
            Title:
          </Typography>
          <TextField
            id="title"
            name="title"
            className="inputForm"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              handleInputChange(event);
            }}
            variant="outlined"
            fullWidth
            required
          />
          <Typography variant="h6" className="formField">
            Category:
          </Typography>
          <Select
            id="category"
            name="category"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              handleInputChange(event);
            }}
            variant="outlined"
            fullWidth
            required
          >
            <MenuItem value="Academic">Academic</MenuItem>
            <MenuItem value="Arts and Creativity">Arts and Creativity</MenuItem>
            <MenuItem value="Technology and Coding">Technology and Coding</MenuItem>
            <MenuItem value="Lifestyle and Hobbie">Lifestyle and Hobbie</MenuItem>
            <MenuItem value="Personal Growth and Wellness">Personal Growth and Wellness</MenuItem>
            <MenuItem value="Professional Development">Professional Development</MenuItem>
            <MenuItem value="Sports and Fitness">Sports and Fitness</MenuItem>
            <MenuItem value="Health and Nutrition">Health and Nutrition</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
          </Select>
          <Typography variant="h6" className="formField">
            Description:
          </Typography>
          <TextField
            id="description"
            name="description"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              handleInputChange(event);
            }}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            required
          />
          <div className="image-upload-section">
            <Typography variant="h6" className="formField">
              Upload Image:
            </Typography>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(event) => {
                setImage(event.target.value);
                handleImageUpload(event);
              }}
              style={{
                display: 'none',
              }}
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="custom-file-upload"
              style={{
                marginTop: '10px',
                cursor: 'pointer',
                padding: '4px',
                border: '8px solid #A367B1',
                borderRadius: '5px',
                backgroundColor: '#A367B1',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                width: '200px',
                gap: '8px'
              }}

            >
              <span>Choose a Thumbnail</span>
<FileUploadIcon />
            </label>


            {image && (
              <img src={imageUrl} style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '10px' }} />
            )}
          </div>

          <Typography variant="h6" className="formField">
            Upload:
          </Typography>
          <div className="file-uploader-container" {...getRootProps()}>
      <CloudUploadIcon style={{ fontSize: 60, color: '#5D3587' }} />
      <p className="upload-text">Add or drag your videos</p> </div>
          <Button type="submit" variant="contained" className="submitButton1" disabled={!imageSelected || !videoSelected} >
            Submit
          </Button>
        </form>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          message="Submitted Successfully"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </div>


      <div className="backgroundLayer" />
    </div >
  );
};

export default CourseForm;
