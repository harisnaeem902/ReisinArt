import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { ArrowDownward, ArrowUpward, ShoppingCart, PeopleAlt, Message } from '@mui/icons-material';
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
import GroupIcon from "@mui/icons-material/Group";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;
const handleLogout = () => {
  localStorage.removeItem("x-auth-token");
};

const pages = [
  {
    link: (
      <Link
        to="/admin/dashboard"
        style={{ textDecoration: "none", color: "black" }}
      >
        Dashboard
      </Link>
    ),
    icon: <DashboardIcon />,
  },
  {
    link: (
      <Link
        to="/admin/userList"
        style={{ textDecoration: "none", color: "black" }}
      >
        Total Users
      </Link>
    ),
    icon: <GroupIcon />,
  },
  {
    link: (
      <Link
        to="/admin/solditems"
        style={{ textDecoration: "none", color: "black" }}
      >
        Purchase List
      </Link>
    ),
    icon: <ShoppingCartIcon />,
  },
  {
    link: (
      <Link
        to="/login"
        style={{ textDecoration: "none", color: "black" }}
        onClick={handleLogout}
      >
        Logout
      </Link>
    ),
    icon: <LogoutIcon />,
  },
];


const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [products, setProducts] = useState([]);
  const [users, setusers] = useState([]);
  const [purchases, setPurchases] = useState([]);


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("x-auth-token");
      try {
        const response = await fetch("http://localhost:5000/api/products", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error(
            "Error fetching products or invalid response structure"
          );
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("x-auth-token");
      try {
        const response = await fetch("http://localhost:5000/api/users/userList", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setusers(data);
        } else {
          console.error(
            "Error fetching products or invalid response structure"
          );
          setusers([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setusers([]);
      }
    };

    fetchUsers();
  }, []);

    useEffect(() => {
      const fetchPurchaseList = async () => {
        const token = localStorage.getItem("x-auth-token");
        try {
          const response = await fetch("http://localhost:5000/api/purchases", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok && Array.isArray(data)) {
            setPurchases(data);
          } else {
            console.error(
              "Error fetching products or invalid response structure",
            );
            setPurchases([]);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
          setPurchases([]);
        }
      };
      fetchPurchaseList();
    }, []);
    const calculateTotalPrice = (purchases) => {
      return purchases.reduce((total, purchase) => {
        return total + purchase.product.price;
      }, 0);
    };
    
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ background: "white", color: "black", height: "73px" }}
        open={open}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {pages.map((page, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <Link
                  to={page.link.props.to}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                  onClick={page.link.props.onClick}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {page.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={page.link.props.children}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </Link>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Container>
      <Box sx={{ flexGrow: 1, padding: 3, marginTop: "80px" }}>
      <Grid container spacing={3}>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{
            backgroundColor: '#4e73df', 
            boxShadow: 3, 
            borderRadius: 2, 
            color: 'white', 
            '&:hover': { boxShadow: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {users.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{
            backgroundColor: '#e91e63', 
            boxShadow: 3, 
            borderRadius: 2, 
            color: 'white', 
            '&:hover': { boxShadow: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}>
            <CardContent>
              <Typography variant="h6">Total Items</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {products.length}
              </Typography>
        
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{
            backgroundColor: '#ba000d', 
            boxShadow: 3, 
            borderRadius: 2, 
            color: 'white', 
            '&:hover': { boxShadow: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}>
            <CardContent>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {calculateTotalPrice(purchases)}
              </Typography>
        
            </CardContent>
          </Card>
        </Grid>

        

      </Grid>
    </Box>
    
      </Container>
    </Box>
  );
}
