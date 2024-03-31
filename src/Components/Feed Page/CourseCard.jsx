import React, { useState } from 'react';
import '../../styles/card.css';

const CourseCard = ({ course, handleCourseView, handleProfileView, handleViewOwnProfile }) => {
  const usernameStored = localStorage.getItem('username');
  return (
    <div className="course-card-item">
      <img className="course-thumbnail" src={course.thumbnail} alt={course.title} onClick={() => handleCourseView(course)} />
      <div className="card-content">
        <h3 onClick={() => handleCourseView(course)}>{course.title}</h3>
        <p onClick={
          course.courseOwnerId === usernameStored
            ? handleViewOwnProfile
            : () => handleProfileView(course.courseOwnerId)
        }>
          {course.courseOwnerId}</p>
      </div>
    </div>
  );
};

export default CourseCard;
