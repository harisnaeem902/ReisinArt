import React from "react";
import { Container, Typography, Grid, Box, Link } from "@mui/material";
import Appbar from "../components/mui/Appbar";


const AboutPage = ({ cartItems }) => {
  const getCartItemCount = () => {
    return cartItems.length;
  };
  return (
    <Container>
      <Appbar cartItemCount={getCartItemCount()} navbarBackground={"white"} />
      <Grid container spacing={3} marginTop={20}>
        <Grid item xs={12} md={6}>
          <Box marginBottom={3} marginTop={5}>
            <Typography variant="body1">
              Explore a curated collection of unique and inspiring artworks,
              showcasing the talent and creativity of artists from around the
              world. Our platform offers a diverse range of styles, from
              contemporary to classic, ensuring there’s something for every art
              lover. Discover, appreciate, and purchase art that resonates with
              your personal taste, while supporting emerging and established
              artists.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginBottom={3}
          >
            <img
              src="https://t4.ftcdn.net/jpg/03/20/46/13/360_F_320461388_5Snqf6f2tRIqiWlaIzNWrCUm1Ocaqhfm.jpg"
              alt="About"
              style={{ width: "100%", height: "auto", borderRadius: 8 }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AboutPage;
