import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  DialogContentText,
} from "@mui/material";
import CourseCard from "../Feed Page/CourseCard";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../../styles/profile.css";
import BannerBackground from "../../Assets/home-banner-background.png";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firbase";
import { v4 } from "uuid";
import { getToken } from "../../utils/TokenContext";
import LoadingPage from "../LoadingPage";
import baseURL from "../../utils/fetchConfig";

const ProfilePage = () => {
  const location = useLocation();
  const usernameClicked =
    location.state && location.state.usernameClicked
      ? location.state.usernameClicked
      : "";
  const userClickedOwnedCourses =
    location.state && location.state.userClickedOwnedCourses
      ? location.state.userClickedOwnedCourses
      : [];
  const usernameStored = localStorage.getItem("username");
  const [userOwnedCourses, setUserOwnedCourses] = useState(
    location.state && location.state.userOwnedCourses
      ? location.state.userOwnedCourses
      : []
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [updatedValues, setUpdatedValues] = useState({});
  const [updatedProfileValues, setUpdatedProfileValues] = useState({});
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
  const [openUpdatedSnackbar, setOpenUpdatedSnackbar] = useState(false);
  const [openUpdatedProfileSnackbar, setOpenUpdatedProfileSnackbar] =
    useState(false);
  const [openDeletedSnackbar, setOpenDeletedSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openPopDialog, setOpenPopDialog] = useState(false);
  const [user, setUser] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const token = getToken();
  const navigate = useNavigate();
  useEffect(() => {
    setIsCurrentUserProfile(
      usernameClicked ? usernameStored === usernameClicked : usernameStored
    );
  }, [usernameClicked]);

  const setAuthToken = () => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };
  const handleClickOpen = (courseId) => {
    setSelectedCourseId(courseId);
    const selectedCourse = userOwnedCourses.find(
      (course) => course.courseId === courseId
    );
    setUpdatedValues(selectedCourse);
    setOpenDialog(true);
  };

  const handleEditProfileOpen = () => {
    console.log("Edit profile button clicked");
    setOpenProfileDialog(true);
  };
  const handleClose = () => {
    setOpenDialog(false);
    setUpdatedValues({});
    setSelectedCourseId("");
  };
  const handleProfileClose = () => {
    setOpenProfileDialog(false);
    setUpdatedProfileValues({});
  };

  const handleChange = (event, attribute) => {
    const { value } = event.target;
    if (attribute === "title" || attribute === "description") {
      setUpdatedValues((prevState) => ({
        ...prevState,
        [attribute]: value,
      }));
    }
  };
  const handleProfileChange = (event, attribute) => {
    const { value } = event.target;
    if (
      attribute === "username" ||
      attribute === "email" ||
      attribute === "password"
    ) {
      setUpdatedProfileValues((prevState) => ({
        ...prevState,
        [attribute]: value,
      }));
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      if (!token) {
        throw new Error("Unauthorized");
      }

      await axios.delete(`${baseURL}/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedCourses = userOwnedCourses.filter(
        (course) => course.courseId !== courseId
      );
      setUserOwnedCourses(updatedCourses);
      setOpenDeletedSnackbar(true);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!token) {
        throw new Error("Unauthorized");
      }

      const updatedCourse = await axios.put(
        `${baseURL}/courses/${selectedCourseId}`,
        {
          ...updatedValues,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedCourses = userOwnedCourses.map((course) => {
        if (course.courseId === selectedCourseId) {
          return updatedCourse.data;
        }
        return course;
      });

      setUserOwnedCourses(updatedCourses);
      handleClose();
      setOpenUpdatedSnackbar(true);
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleSnackbarClose = () => {
    setOpenDeletedSnackbar(false);
    setOpenUpdatedSnackbar(false);
    setOpenUpdatedProfileSnackbar(false);
  };
  const handleProfileUpdate = async () => {
    try {
      if (!token) {
        throw new Error("Unauthorized: Token not found in local storage");
      }
      setOpenPopDialog(true);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleConfirmation = async (confirmed) => {
    if (confirmed) {
      try {
        const url = `${baseURL}/users/${usernameStored}`;
        console.log("URL:", url);
        console.log("Updated Profile Values:", updatedProfileValues);

        const response = await axios.put(url, updatedProfileValues, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("New user:", response.data);
        const { username: updatedUsername, password: updatedPassword } =
          response.data;
        setUsername(updatedUsername);
        setPassword(updatedPassword);
        localStorage.setItem("username", updatedUsername);
        handleProfileClose();
        setOpenUpdatedProfileSnackbar(true);
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/login");
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    } else {
      setOpenPopDialog(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const access = getToken();
        const response = await axios.get(`${baseURL}/users/${usernameStored}`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        console.log("User:", response.data);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token, usernameStored, updatedProfileValues]);

  const handleButtonClick = async () => {
    try {
      const inputElement = document.createElement("input");
      inputElement.type = "file";
      inputElement.accept = "image/*";

      inputElement.onchange = async (event) => {
        setLoading(true);
        const imageUploaded = event.target.files[0];
        const imageRef = ref(storage, `images/${imageUploaded.name + v4()}`);
        const snapshot = await uploadBytes(imageRef, imageUploaded);
        const imageUrl = await getDownloadURL(snapshot.ref);
        setImageUrl(imageUrl);

        try {
          const access = getToken();
          if (access) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
          } else {
            delete axios.defaults.headers.common["Authorization"];
          }
          console.log("username", user.username);
          const response = await axios.put(
            `${baseURL}/users/${user.username}/picture`,
            {
              profilePicture: imageUrl,
            }
          );
          setLoading(false);
          console.log("POST response:", response.data);
          setUser((prevUser) => ({
            ...prevUser,
            profilePicture: imageUrl,
          }));
        } catch (error) {
          console.error("Error posting data:", error);
          setLoading(false);
        }
      };

      inputElement.click();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="profile-containerAll">
      {loading && <LoadingPage loading={loading} />}
      <div className="profile-container">
        <div className="home-banner-container">
          <div className="home-bannerImage-container">
            <img src={BannerBackground} alt="" />
          </div>
        </div>
        <div className="profile-info">
          <div className="profilepicture">
            <Avatar
              alt="User Avatar"
              src={user.profilePicture}
              sx={{ width: 120, height: 120 }}
            />
            {isCurrentUserProfile && (
              <Button className="profile1-button" onClick={handleButtonClick}>
                <EditIcon color="#392467" className="profile1-button" />
              </Button>
            )}
          </div>
          <h2>
            {isCurrentUserProfile
              ? `Welcome ${usernameClicked ? usernameClicked : usernameStored}`
              : `${usernameClicked}'s Profile`}
          </h2>
          <>
            {isCurrentUserProfile && (
              <>
                <button
                  style={{
                    display: "none",
                  }}
                  id="fileInput"
                  onClick={handleEditProfileOpen}
                ></button>
                <label
                  htmlFor="fileInput"
                  className="custom-file-upload"
                  style={{
                    marginTop: "10px",
                    cursor: "pointer",
                    padding: "4px",
                    border: "8px solid #A367B1",
                    borderRadius: "5px",
                    backgroundColor: "#A367B1",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    width: "140px",
                    gap: "0px",
                    marginLeft: "58%",
                  }}
                >
                  <span>Edit Account</span>
                  <EditIcon />
                </label>
              </>
            )}
          </>

          <Dialog
            open={openPopDialog}
            onClose={() => handleConfirmation(false)}
          >
            <DialogTitle>Confirm Profile Update</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to update your profile? You will be
                redirected to the Login Page to re-sign in.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleConfirmation(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={() => handleConfirmation(true)} color="primary">
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <h3>
          {isCurrentUserProfile
            ? "Here are your posted videos"
            : `Here are ${usernameClicked}'s posts`}
        </h3>
        {isCurrentUserProfile ? (
          <div className="course-list">
            {userOwnedCourses.map((course) => (
              <div key={course.courseId} className="course-card">
                <CourseCard course={course} />
                <Button
                  className="update-button"
                  onClick={() => handleClickOpen(course.courseId)}
                >
                  <EditIcon color="#392467" />
                </Button>
                <Button
                  className="delete-button"
                  onClick={() => handleDeleteCourse(course.courseId)}
                >
                  <DeleteIcon /> Delete
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="course-list">
            {userClickedOwnedCourses.map((course) => (
              <div key={course.courseId} className="course-card">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}

        <Dialog open={openDialog} onClose={handleClose}>
          <DialogTitle>Update Course</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Title"
              value={updatedValues.title || ""}
              onChange={(event) => handleChange(event, "title")}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Description"
              value={updatedValues.description || ""}
              onChange={(event) => handleChange(event, "description")}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openProfileDialog} onClose={handleProfileClose}>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Username"
              value={updatedProfileValues.username || ""}
              onChange={(event) => handleProfileChange(event, "username")}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Email"
              value={updatedProfileValues.email || ""}
              onChange={(event) => handleProfileChange(event, "email")}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={updatedProfileValues.password || ""}
              onChange={(event) => handleProfileChange(event, "password")}
              fullWidth
            />

            <Button onClick={handleTogglePasswordVisibility}>
              {showPassword ? "Hide Password" : "Show Password"}
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleProfileClose}>Cancel</Button>
            <Button onClick={handleProfileUpdate}>Update</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Snackbar
        open={openDeletedSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message="Course Deleted"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
      <Snackbar
        open={openUpdatedSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message="Course Updated"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
      <Snackbar
        open={openUpdatedProfileSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message="Profile Updated"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
};

export default ProfilePage;
