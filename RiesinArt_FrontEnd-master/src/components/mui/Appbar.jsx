import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
  ShoppingBag as ShoppingBagIcon,
  Login as LoginIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const pages = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const ResponsiveAppBar = ({ cartItemCount, navbarBackground }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const token = localStorage.getItem("x-auth-token");
  const navigate = useNavigate();

  const handleNavMenuOpen = (event) => setAnchorElNav(event.currentTarget);
  const handleNavMenuClose = () => setAnchorElNav(null);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const renderPages = (isMobile = false) => (
    <>
      {pages.map((page) => (
        <MenuItem key={page.label} onClick={handleNavMenuClose}>
          <Link
            to={page.path}
            style={{
              textDecoration: "none",
              color: isMobile ? "inherit" : "white",
            }}
          >
            {page.label}
          </Link>
        </MenuItem>
      ))}
    </>
  );

  const renderAuthButtons = (isMobile = false) => (
    <Stack direction="row" spacing={2}>
      {token ? (
        <Button
          variant="outlined"
          onClick={handleLogout}
          sx={{
            color: navbarBackground === "transparent" ? "white" : "black",
            borderColor: navbarBackground === "transparent" ? "white" : "black",
            "@media (max-width:600px)": {
              color: "black",
              borderColor: "black",
            },
          }}
          startIcon={<LoginIcon />}
        >
          Logout
        </Button>
      ) : (
        <Link to="/login">
          <Button
            variant="outlined"
            sx={{
              color: navbarBackground === "transparent" ? "white" : "black",
              borderColor:
                navbarBackground === "transparent" ? "white" : "black",
              "@media (max-width:600px)": {
                color: "black",
                borderColor: "black",
              },
            }}
            startIcon={<LoginIcon />}
          >
            Login
          </Button>
        </Link>
      )}
      <Link to="/cart">
        <Button
          variant="outlined"
          sx={{
            color: navbarBackground === "transparent" ? "white" : "black",
            borderColor: navbarBackground === "transparent" ? "white" : "black",
            "@media (max-width:600px)": {
              color: "black",
              borderColor: "black",
            },
          }}
          startIcon={<ShoppingCartOutlinedIcon />}
        >
          Cart ({cartItemCount})
        </Button>
      </Link>
    </Stack>
  );

  return (
    <AppBar
      sx={{
        background: navbarBackground === "transparent" ? "transparent" : "white",
        color: navbarBackground === "transparent" ? "white" : "black",
      }}
      elevation={0}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ShoppingBagIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Reisin Art
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleNavMenuOpen}
              sx={{
                color: navbarBackground === "transparent" ? "white" : "black",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleNavMenuClose}
              sx={{ display: { xs: "block", md: "none" } }}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              {renderPages(true)}
              {renderAuthButtons(true)}
            </Menu>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              color: navbarBackground === "transparent" ? "white" : "black",
            }}
          >
            {pages.map((page) => (
              <Link
                key={page.label}
                to={page.path}
                style={{ textDecoration: "none", marginTop: "20px" }}
              >
                <Button
                  sx={{
                    my: 2,
                    color:
                      navbarBackground === "transparent" ? "white" : "black",
                  }}
                >
                  {page.label}
                </Button>
              </Link>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0, display: { xs: "none", sm: "flex" } }}>
            {renderAuthButtons()}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;