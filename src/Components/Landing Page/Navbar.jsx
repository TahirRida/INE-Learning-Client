import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Logo from "../../Assets/inelogo.png";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuOptions = [
    {
      text: "About",
      event: "about",
      path: "#about",
    },
    {
      text: "How it works",
      event: "work",
      path: "#work",
    },
    {
      text: "Testimonials",
      event: "testimonial",
      path: "#testimonial",
    },

  ];

  function handleNavLinkClick(event, id) {
    event.preventDefault();
    scrollToSection(id);
  }

  return (
    <nav>
      <div className="nav-logo-container">
        <img src={Logo} alt="" className="nav-logo-img" />
      </div>
      <div className="navbar-links-container">
        <a href="#about" onClick={(event) => handleNavLinkClick(event, 'about')}>About</a>
        <a href="#work" onClick={(event) => handleNavLinkClick(event, 'work')}>How it works</a>
        <a href="#testimonial" onClick={(event) => handleNavLinkClick(event, 'testimonial')}>Testimonials</a>
        <Link to={'/login'}><button className="primary-button">Get Started</button></Link>
      </div>

      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton >
                  <a href={item.path} onClick={(event) => handleNavLinkClick(event, item.event)}>
                    <ListItemText primary={item.text} class="item-navbar" /> </a>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;
