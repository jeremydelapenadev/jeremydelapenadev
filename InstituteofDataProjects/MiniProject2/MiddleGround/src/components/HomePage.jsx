import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { NavLink } from "react-router-dom";
import Footer from "./Footer";
import ImageScroller from "./ImageScroller";

function HomePage() {

  return (
    <>
      <Typography variant="h1" sx={{ mt: 8}}>Welcome to</Typography>
      <Typography variant="h1" sx={{ fontWeight: 900, background: "linear-gradient(90deg, #21e4d3, #f1bb0b)", WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent", letterSpacing: -5}}>MiddleGround</Typography><br/>
      <Typography variant="h5" sx={{ mb: 2}}>
      MiddleGround helps you find local leisure spaces that fit who you are and what you need in the moment.
        Whether you're looking for something low-cost, age-appropriate, sensory-considerate, or simply aligned with your interests,
        MiddleGround makes it easier to discover spaces that feel accessible, inclusive, and supportive. <br/><br/>

        Instead of searching endlessly, you can filter by features like accessibility, autism-friendly supports, cost, and activity type,
        so you can choose places that truly meet you where you are.</Typography>
        <Button variant="contained" color="primary" component={NavLink}
            to="/spaces" sx={{mt:3,mb:5}}>
          Click here to start
        </Button>
        <ImageScroller></ImageScroller>
      <Footer></Footer>
    </>
  );
}

export default HomePage;
