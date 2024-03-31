import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from './CourseCard';
import SearchBar from './SearchBar';
import '../../styles/card.css';
import BannerBackground from "../../Assets/home-banner-background.png";
import AboutBackground from "../../Assets/about-background.png";
import { useLocation } from 'react-router-dom';
import { getToken, setToken, removeToken } from '../../utils/TokenContext';
import baseURL from '../../utils/fetchConfig';
import LoadingPage from '../LoadingPage';
const SearchFeed = () => {
    const [courses, setCourses] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courseId, setCourseId] = useState('');
    const location = useLocation();

    const searchTerm = location.state && location.state.searchTerm ? location.state.searchTerm : '';
    const setAuthToken = () => {
        const token = getToken();
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    const fetchCourses = async () => {
        try {
            setAuthToken();
            const response = await axios.get(`${baseURL}/courses`);
            setCourses(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses data:', error);
            setError('Error fetching data. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('Fetching courses...');
        fetchCourses();
    }, [courseId]);



    if (loading) {
        return       <div> <LoadingPage loading={loading} />
      </div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="feed">
            <div className="searchbar-fixed">
                <SearchBar />
            </div>
            <div className="home-container" id="home">
                <div className="home-banner-container">
                    <div className="home-bannerImage-container">
                        <img src={BannerBackground} alt="" />
                    </div>
                </div>
            </div>
            <div className="about-background-image-container">
                <img src={AboutBackground} alt="" />
            </div>
            <div className="feed-container">
                <h2>
                    Results for <span style={{ color: '#5D3587', fontStyle: 'italic' }}>{`''${searchTerm}''  `}</span>:
                </h2>                <div className="course-list">
                    {courses && courses
                        .filter(course => course.title && course.title.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(course => (
                            <CourseCard key={course.courseId} course={course} />
                        ))}

                </div>
            </div>
        </div>
    );
};

export default SearchFeed;
