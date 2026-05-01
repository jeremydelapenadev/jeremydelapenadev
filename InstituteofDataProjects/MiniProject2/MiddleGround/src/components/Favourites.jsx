import { useContext } from "react";
import { UserFavourites } from "../context/UserFavourites";
import { useNavigate } from "react-router-dom";
import { userContext } from "../context/UserProvider";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";

function Favourites() {
  const { favourites, removeFavourite } = useContext(UserFavourites);
  const { currentUser } = useContext(userContext);
  const navigate = useNavigate();

  return (
    <div style={{ padding: "50px" }}>
      <Typography variant="h2" gutterBottom sx={{ fontWeight: 600 }}>
        My Favourite Spaces
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600, mb:3 }}>
        Welcome, <span style={{ color: "blue" }}>{currentUser}</span>!
      </Typography>
      <Button
        variant="outlined"
        onClick={() => navigate("/spaces")}
        style={{ marginBottom: "20px" }}
      >
        Go to Spaces
      </Button>

      {favourites.length === 0 ? (
        <Typography>No favourites added yet.</Typography>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {favourites.map((space) => (
            <Card key={space.id}>
              <CardMedia
                component="img"
                height="200"
                image={space.image}
                alt={space.name}
              />
              <CardContent>
                <Typography variant="h6">{space.name}</Typography>
                <Typography variant="body2">{space.description}</Typography>

                <Button
                  color="error"
                  onClick={() => removeFavourite(space.id)}
                  style={{ marginTop: "10px" }}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favourites;
