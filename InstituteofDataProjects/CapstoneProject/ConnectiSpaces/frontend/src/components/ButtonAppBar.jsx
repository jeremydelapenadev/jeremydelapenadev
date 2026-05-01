import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../context/UserProvider";

export default function ButtonAppBar() {
  const { currentUser } = useContext(userContext);

  return (
    <>
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#010e29", // dark background colour
      }}
    >
      <Toolbar>
        {/* Left side (Icon + Title) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            component={NavLink}
            to="/"
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 0 }}
          >
            <HomeIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 900,
              letterSpacing: -1,
              background: "linear-gradient(90deg, #390564, #c363e0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ConnectiSpaces
          </Typography>
        </Box>
        {/* This pushes the contents below to the right. */}
        <Box sx={{ flexGrow: 1 }} /> {/* Right side buttons */}{" "}
        {currentUser ? (
          <>
            <Box sx={{ display: "flex" }}>
              <Button
                component={NavLink}
                to="/spaces"
                color="inherit"
                sx={{ mr: 3 }}
              >
                Spaces
              </Button>

              <Button
                component={NavLink}
                to="/community"
                color="inherit"
                sx={{ mr: 3 }}
              >
                Community
              </Button>

              <Button
                component={NavLink}
                to="/favourites"
                color="inherit"
                sx={{ mr: 3 }}
              >
                Favourites
              </Button>

              <Button component={NavLink} to="/login" color="inherit">
                Logout
              </Button>
            </Box>
          </>
        ) : (
          <Box>
            <Button
              component={NavLink}
              to="/spaces"
              color="inherit"
              sx={{ mr: 3 }}
            >
              Spaces
            </Button>
            <Button component={NavLink} to="/login" color="inherit">
              Login
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
    <Toolbar />
    </>
  );
}
