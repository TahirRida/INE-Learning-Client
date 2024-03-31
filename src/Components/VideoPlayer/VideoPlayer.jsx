import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player';
import CourseCard from '../Feed Page/CourseCard';
import { Avatar } from '@mui/material';
import { getToken } from '../../utils/TokenContext';
import axios from 'axios';
import baseURL from '../../utils/fetchConfig';

const VideoPlayer = () => {
  const location = useLocation();
  const coursePassed = location.state && location.state.coursePassed ? location.state.coursePassed : [];
  const suggestedCourses = location.state && location.state.suggestedCourses ? location.state.suggestedCourses : [];
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [user, setUser] = useState({})
  const token = getToken();
  const usernameStored = localStorage.getItem('username');
  const handlePlay = () => {
    setShowThumbnail(false);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/users/${coursePassed.courseOwnerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("user: ", response.data);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();

  }, [token, usernameStored]);

  return (
    <div className='player-wrapper'>
      <div className="video-player-container">
        <div className="video-player-container1">
          <ReactPlayer
            className="reactplayer"
            url={coursePassed.video}
            playing={isPlaying}
            controls
            width="100%"
            height="auto"
            onPlay={handlePlay}
            onPause={handlePause}
            light={showThumbnail ? <img src={coursePassed.thumbnail} alt='Thumbnail' className='thumbnail' /> : null}
          /></div>

        <div className="video-info">
          <h1 className="video-title">{coursePassed.title}</h1>
          <div className="avatar-username-container">
            <Avatar alt="User Avatar" src={user.profilePicture} sx={{ width: 60, height: 60 }} />
            <h2 className="username">{coursePassed.courseOwnerId}</h2>
          </div>
          <h2 className="description">Description:</h2>
          <div className="description-container">
            <div className="video-description">{coursePassed.description}</div></div>
        </div>

      </div>
      <div className="suggested-courses-container">
        <h3>Suggested Courses</h3>
        {suggestedCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;