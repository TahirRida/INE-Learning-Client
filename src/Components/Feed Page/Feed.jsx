import React, { useState, useEffect, CSSProperties } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CourseCard from './CourseCard';
import SearchBar from './SearchBar';
import Sidebar from './Sidebar';
import '../../styles/card.css';
import '../../styles/feed.css';
import BannerBackground from "../../Assets/home-banner-background.png";
import AboutBackground from "../../Assets/about-background.png";
import IosShareIcon from '@mui/icons-material/IosShare';
import LoadingPage from '../LoadingPage';
import baseURL from '../../utils/fetchConfig';
import { getToken } from '../../utils/TokenContext';
const Feed = () => {
  const [courses, setCourses] = useState(null);
  const categories = ["All Skills", "Academic", "Arts and Creativity", "Technology and Coding", "Lifestyle and Hobbie", "Personal Growth and Wellness", "Professional Development", "Sports and Fitness", "Health and Nutrition"];
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const token = getToken();

  const setAuthToken = () => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const fetchCourses = async () => {
    try {
      console.log('Authorization header set:', axios.defaults.headers.common['Authorization']);
      const response = await axios.get(`${baseURL}/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Courses data:', response.data);
      setCourses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response && error.response.status === 401) {
      } else {
        setError('Error fetching data. Please try again later.');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Fetching courses...');
    console.log('tokenFeed', token);
    fetchCourses();
  }, []);

  const handleViewOwnProfile = () => {
    const userOwnedCourses = courses
      ? courses.filter(course => course.courseOwnerId === username).map(course => ({ ...course }))
      : [];
    navigate(`/profile?username=${username}`, { state: { userOwnedCourses } });
  };
  const handleProfileView = (usernameClicked) => {
    const userClickedOwnedCourses = courses
      ? courses.filter(course => course.courseOwnerId === usernameClicked).map(course => ({ ...course }))
      : [];
    navigate(`/profile?username=${usernameClicked}`, { state: { usernameClicked, userClickedOwnedCourses } });
  };

  const handleViewCourseForm = () => {
    navigate('/courseForm');
  };
  const handleCourseView = (courseToPass) => {
    const coursePassed = courseToPass
    const suggestedCourses = courses
      ? courses.filter(course => course.category === coursePassed.category && course.courseOwnerId != coursePassed.courseOwnerId).map(course => ({ ...course }))
      : [];
    navigate(`/coursePage?courseTitle=${coursePassed.title}&courseOwner=${coursePassed.courseOwnerId}`, { state: { coursePassed, suggestedCourses } });
  };
  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
    setSelectedCategory(category);
    navigate(`/feed?category=${category}`);
  };
  const filteredCourses = selectedCategory
    ? courses.filter(course => course.category === selectedCategory)
    : courses;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);




  return (
    <div>
      <div>
        {loading && <LoadingPage loading={loading} />}
      </div>
      <div className="feed">
        <div className="searchbar-fixed">
          <SearchBar handleViewOwnProfile={handleViewOwnProfile} />
        </div>
        <div className="home-container" id="home">
          <div className="home-banner-container">
            <div className="home-bannerImage-container">
              <img src={BannerBackground} alt="" />
            </div>
          </div>
        </div>
        <div className="about-background-image-container2">
          <img src={AboutBackground} alt="" />
        </div>
        <div className='sideAndCourses'>
          <div className="sidebar">
            <Sidebar categories={categories} handleCategoryClick={handleCategoryClick} selectedCategory={selectedCategory} /></div>
          <button className='post-button' onClick={handleViewCourseForm}><IosShareIcon className='sharebutton' /><span>Share Skills</span></button>
          <div className="feed-container">
            <h2>{selectedCategory ? selectedCategory : "All Skills"}</h2>
            <div className="course-list">
              {courses &&
                (selectedCategory === categories[0]
                  ? courses.map(course => (
                    <div key={course.courseId} >
                      <CourseCard course={course} handleCourseView={handleCourseView} handleProfileView={handleProfileView} handleViewOwnProfile={handleViewOwnProfile} />
                    </div>
                  ))
                  : filteredCourses.map(course => (
                    <div key={course.courseId} >
                      <CourseCard course={course} handleCourseView={handleCourseView} handleProfileView={handleProfileView} handleViewOwnProfile={handleViewOwnProfile} />
                    </div>
                  )))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Feed;
