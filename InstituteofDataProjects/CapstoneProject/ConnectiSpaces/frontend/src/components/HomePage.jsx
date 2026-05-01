import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { NavLink } from "react-router-dom";
import Footer from "./Footer";
import ImageScroller from "./ImageScroller";

function HomePage() {
  return (
    <>
      <div className="fade-in" style={{ padding: "0px" }}>
        <Typography
          variant="h1"
          sx={{
            mt: 8,
            fontWeight: 900,
            background: "linear-gradient(90deg, #390564, #c363e0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: -5,
          }}
        >
          ConnectiSpaces
        </Typography>
        <br />
        <Typography variant="h2" sx={{ mt: 2, fontWeight: 900 }}>
          Where neurodivergent families connect through shared spaces
        </Typography>
        <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
          Discover autism-friendly spaces, connect with understanding families,
          and build a community where every child can thrive — at their own
          pace.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={NavLink}
          to="/spaces"
          sx={{ mt: 3, mb: 5 }}
        >
          Explore Spaces
        </Button>
        <Button
          variant="contained"
          color="primary"
          component={NavLink}
          to="/community"
          sx={{ ml: 2, mt: 3, mb: 5 }}
        >
          Explore the Community
        </Button>
        <ImageScroller></ImageScroller>
        <Footer></Footer>
      </div>
    </>
  );
}

export default HomePage;
