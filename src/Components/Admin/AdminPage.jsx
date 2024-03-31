import React, { useState, useEffect } from 'react';
import { Button, Typography, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import CourseCard from '../Feed Page/CourseCard';
import BannerBackground from "../../Assets/home-banner-background.png";
import AboutBackground from "../../Assets/about-background.png";
import Logo from "../../Assets/inelogo.png";
import DeleteIcon from '@material-ui/icons/Delete';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import LoadingPage from '../LoadingPage';
import { getToken } from '../../utils/TokenContext';
import baseURL from '../../utils/fetchConfig';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2),

  },
  courseListContainer: {
    position: 'relative',
    width: '100%',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -2,

  },
  homeBannerBackground: {
    position: 'fixed',
    top: 0,
    right: -170,
    maxWidth: 620,
  },

  aboutBackground: {
    position: 'fixed',
    left: -150,
  },
  courseList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(2),
  },
  courseCard: {
    maxWidth: 300,
    margin: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  titles: {
    color: '#401F71',
    fontWeight: 'bold',
  }
}));

const AdminPage = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [pendingCourses, setPendingCourses] = useState(null);
  const [approvedCourses, setApprovedCourses] = useState(null);
  const [error, setError] = useState(null);
  const [openApprovedSnackbar, setOpenApprovedSnackbar] = useState(false);
  const [openRejectedSnackbar, setOpenRejectedSnackbar] = useState(false);

  const setAuthToken = () => {
    const token = getToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const fetchPendingCourses = async () => {
    try {
      setAuthToken();
      const response = await axios.get(`${baseURL}/courses/pending`);
      setPendingCourses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses data:', error);
      setError('Error fetching data. Please try again later.');
      setLoading(false);
    }
  };

  const fetchApprovedCourses = async () => {
    try {
      setAuthToken();
      const response = await axios.get(`${baseURL}/courses`);
      setApprovedCourses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses data:', error);
      setError('Error fetching data. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Fetching courses...');
    fetchPendingCourses();
    fetchApprovedCourses();
  }, []);


  const handleApprove = async (courseId) => {
    try {
      setAuthToken();
      await axios.post(`${baseURL}/courses/${courseId}/approve`);
      const updatedApprovedCourses = approvedCourses.filter(course => course.courseId !== courseId);
      setApprovedCourses(updatedApprovedCourses);
      fetchPendingCourses();
      fetchApprovedCourses();
      setOpenApprovedSnackbar(true);
    } catch (error) {
      console.error('Error approving course:', error);
    }
  };

  const handleReject = async (courseId) => {
    try {
      await axios.delete(`${baseURL}/courses/${courseId}`);
      const updatedApprovedCourses = approvedCourses.filter(course => course.courseId !== courseId);
      setApprovedCourses(updatedApprovedCourses);
      fetchPendingCourses();
      fetchApprovedCourses();
      setOpenRejectedSnackbar(true);
    } catch (error) {
      console.error('Error rejecting course:', error);
    }
  };
  const handleSnackbarClose = () => {
    setOpenRejectedSnackbar(false);
    setOpenApprovedSnackbar(false);
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);
  return (
    <div className={classes.root}>
      <div>
        {loading && <LoadingPage loading={loading} />}
      </div>
      <div className="nav-logo-container">
        <img src={Logo} alt="" className="nav-logo-img" />
      </div>
      <h3 className='admin-title'>Admin Dashboard</h3>
      <div className={classes.courseListContainer}>
        <div className={classes.backgroundContainer}>
          <img src={BannerBackground} alt="Banner Background" className={classes.homeBannerBackground} />
          <img src={AboutBackground} alt="About Background" className={classes.aboutBackground} />
        </div>
        <Typography variant="h4" gutterBottom className={classes.titles}>
          Pending Courses
        </Typography>
        <div className={classes.courseList}>
          {pendingCourses &&
            pendingCourses.map(course => (
              <div key={course.courseId} className={classes.courseCard}>
                <CourseCard course={course} />
                <div className={classes.buttonContainer}>
                  <Button variant="contained" color="primary" startIcon={<ThumbUpAltIcon />} onClick={() => handleApprove(course.courseId)}>
                    Approve
                  </Button>
                  <Button variant="contained" color="secondary" startIcon={<DoNotDisturbIcon />} onClick={() => handleReject(course.courseId)}>
                    Reject
                  </Button>
                </div>
              </div>
            ))}
        </div>
        <Snackbar
          open={openApprovedSnackbar}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          message="Course Approved"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
        <Snackbar
          open={openRejectedSnackbar}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          message="Course Deleted"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </div>

      <div className={classes.courseListContainer}>
        <div className={classes.backgroundContainer}>
        </div>
        <Typography variant="h4" gutterBottom className={classes.titles}>
          Approved Courses
        </Typography>
        <div className={classes.courseList}>
          {approvedCourses &&
            approvedCourses.map(course => (
              <div key={course.courseId} className={classes.courseCard}>
                <CourseCard course={course} />
                <div className={classes.buttonContainer}>
                  <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={() => handleReject(course.courseId)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
        </div>
        <Snackbar
          open={openRejectedSnackbar}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          message="Course Deleted"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </div>

    </div>
  );
};

export default AdminPage;
