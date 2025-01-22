import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Appbar from "../components/mui/Appbar";
import { Link } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" to="/">
        Reisin Art
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Album({ onAddToCart, cartItems }) {
  const [search, setSearch] = useState("");
  const [navbarBackground, setNavbarBackground] = useState("transparent");
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);

  const isProductInCart = (product) => {
    return cartItems.some((item) => item._id === product._id);
  };

  const getCartItemCount = () => {
    return cartItems.length;
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const imageHeight =
        document.getElementById("hero-image")?.clientHeight || 0;
      setNavbarBackground(scrollTop > imageHeight ? "white" : "transparent");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navbarBackground]);

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
            "Error fetching products or invalid response structure",
          );
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [cartItems]);

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <main>
          <Appbar
            cartItemCount={getCartItemCount()}
            navbarBackground={navbarBackground}
          />

          <div
            style={{
              position: "relative",
              textAlign: "center",
              color: "white",
            }}
          >
            <div style={{ width: "100%", height: "70vh", overflow: "hidden" }}>
              <img
                id="hero-image"
                src="https://c4.wallpaperflare.com/wallpaper/908/653/66/digital-art-smoke-minimalism-simple-background-wallpaper-preview.jpg"
                alt="Hero"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
            </div>

            <p
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "2rem",
                fontWeight: "bold",
                textShadow: "0 0 5px rgba(0,0,0,0.5)",
              }}
            >
              In recent years, resin art has become increasingly popular due to
              its vibrant colors and unique aesthetic appeal.
            </p>
          </div>

          <Container sx={{ py: 8 }} maxWidth="lg">
            <Box sx={{ textAlign: "center" }}>
              <TextField
                sx={{ marginBottom: "2rem", width: "50%" }}
                fullWidth
                label="Search Product"
                id="fullWidth"
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>

            <Grid container spacing={4}>
              {products
                .filter((product) => {
                  return search.toLowerCase() === ""
                    ? product
                    : product.name.toLowerCase().includes(search);
                })
                .map((product) => (
                  <Grid item key={product} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <img
                        src={`http://localhost:5000/${product.image}`}
                        style={{ height: "18rem" }}
                        alt=""
                      />

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {product.name}
                        </Typography>
                        <Typography gutterBottom>${product.price}</Typography>
                        <Typography>{product.description}</Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "center", mb: "5px" }}>
                        {isProductInCart(product) ? (
                          <Button
                            variant="outlined"
                            sx={{
                              color: "gray",
                              borderColor: "gray",
                            }}
                            disabled
                          >
                            Already Added
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            sx={{
                              color: "black",
                              borderColor: "black",
                              marginLeft: "2px",
                            }}
                            startIcon={<ShoppingCartOutlinedIcon />}
                            onClick={() => onAddToCart(product)}
                          >
                            Add to Cart
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Container>
        </main>

        <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
          <Copyright />
        </Box>
      </ThemeProvider>
    </>
  );
}