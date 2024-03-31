import React, { useState } from "react";
import Logo from "../../Assets/inelogo.png";
import { Paper, IconButton, Stack, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "../../styles/searchbar.css";
import LogoutIcon from '@mui/icons-material/Logout';

const SearchBar = ({ handleViewOwnProfile }) => {
    const [openPopDialog, setOpenPopDialog] = useState(false);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const username = localStorage.getItem('username');

    const onhandleSubmit = (event) => {
        event.preventDefault();
        if (searchTerm) {
            navigate(`/searchFeed`, { state: { searchTerm } });
            setSearchTerm("");
        }
    };

    const handleLogout = () => {
        setOpenPopDialog(false);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-logo-container">
                <img src={Logo} alt="Logo" className="nav-logo-img" />
            </div>
            <div className="navbar-middle">
                <Stack direction="row" alignItems="center">
                    <Paper
                        component="form"
                        onSubmit={onhandleSubmit}
                        className="search-input"
                        sx={{
                            borderRadius: "35px",
                            padding: "3px",
                            border: "0.5px solid #A367B1",
                            fontSize: "14px",
                            width: "80%",
                            marginRight: "8px"
                        }}
                    >
                        <input
                            className="search-input2"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search Here..."
                            sx={{
                                border: "none",
                                flex: 1,
                                outline: "none",
                                fontSize: "medium",
                                marginLeft: "8px"
                            }}
                        />
                        <IconButton type="submit" sx={{ p: "10px", color: "#A367B1" }}>
                            <Search />
                        </IconButton>
                    </Paper>
                </Stack>
            </div>
            <div className="navbar-right">
                <div className="hello-rida-container">
                    <p>Hello<button sx={{ p: "10px", color: "#A367B1" }} onClick={handleViewOwnProfile}>{username}</button> </p>
                </div>
                <div className="logout" onClick={() => setOpenPopDialog(true)}>
                    <LogoutIcon color="#A367B1" />
                </div>
                <Dialog open={openPopDialog} onClose={() => setOpenPopDialog(false)}>
                    <DialogTitle>Confirm Logout</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to Log Out?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenPopDialog(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleLogout} color="primary">
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </nav>
    );
};

export default SearchBar;
