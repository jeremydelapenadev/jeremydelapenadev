import { useContext, useEffect, useState } from "react";
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
  Paper,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";

import ForumIcon from "@mui/icons-material/Forum";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CelebrationIcon from "@mui/icons-material/Celebration";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const tagStyles = {
  Experiences: {
    icon: <ForumIcon sx={{ fontSize: 16 }} />,
    sx: {
      backgroundColor: "#e3f2fd",
      color: "#1565c0",
      border: "1px solid #90caf9",
    },
  },
  Tips: {
    icon: <LightbulbIcon sx={{ fontSize: 16 }} />,
    sx: {
      backgroundColor: "#fff9c4",
      color: "#8d6e00",
      border: "1px solid #fdd835",
    },
  },
  Questions: {
    icon: <HelpOutlineIcon sx={{ fontSize: 16 }} />,
    sx: {
      backgroundColor: "#ffebee",
      color: "#c62828",
      border: "1px solid #ef9a9a",
    },
  },
  Celebrations: {
    icon: <CelebrationIcon sx={{ fontSize: 16 }} />,
    sx: {
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
      border: "1px solid #a5d6a7",
    },
  },
  Resources: {
    icon: <MenuBookIcon sx={{ fontSize: 16 }} />,
    sx: {
      backgroundColor: "#f3e5f5",
      color: "#7b1fa2",
      border: "1px solid #ce93d8",
    },
  },
};

function Favourites() {
  const { currentUser } = useContext(userContext);
  const { removeFavourite } = useContext(UserFavourites);
  const navigate = useNavigate();

  const [favourites, setFavourites] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);

  const getLoggedInUserId = async () => {
    if (!currentUser?.email) return null;

    const response = await fetch("http://localhost:8080/api/users");
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Unable to fetch users.");
    }

    const matchedUser = (data.data || []).find(
      (user) => user.email === currentUser.email
    );

    return matchedUser?._id || null;
  };

  const getPostCategory = (post) => {
    if (!post) return "Uncategorised";

    if (typeof post.category === "string" && post.category.trim()) {
      return post.category;
    }

    if (typeof post.tag === "string" && post.tag.trim()) {
      return post.tag;
    }

    if (typeof post.title === "string" && post.title.trim()) {
      return post.title;
    }

    if (Array.isArray(post.tags) && post.tags.length > 0) {
      if (typeof post.tags[0] === "string") return post.tags[0];
      if (post.tags[0]?.name) return post.tags[0].name;
      if (post.tags[0]?.label) return post.tags[0].label;
    }

    return "Uncategorised";
  };

  const formatDateOnly = (dateValue) => {
    if (!dateValue) return "No date";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "No date";

    return date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const userId = await getLoggedInUserId();
        if (!userId) return;

        const response = await fetch(
          `http://localhost:8080/api/users/${userId}/favourites`
        );
        const data = await response.json();

        setFavourites(data.data || []);
      } catch (err) {
        console.error("Error fetching favourites:", err);
      }
    };

    fetchFavourites();
  }, [currentUser]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const userId = await getLoggedInUserId();
        if (!userId) return;

        const possibleReviewEndpoints = [
          `http://localhost:8080/api/reviews/user/${userId}`,
          `http://localhost:8080/api/reviews/author/${userId}`,
          `http://localhost:8080/api/reviews?author_id=${userId}`,
        ];

        let reviewData = [];

        for (const endpoint of possibleReviewEndpoints) {
          try {
            const response = await fetch(endpoint);
            if (!response.ok) continue;

            const data = await response.json();
            reviewData = data.data || [];

            if (Array.isArray(reviewData)) break;
          } catch (err) {
            console.log(`Review endpoint failed: ${endpoint}`, err);
          }
        }

        setUserReviews(reviewData);
      } catch (err) {
        console.error("Error fetching user reviews:", err);
      }
    };

    fetchUserReviews();
  }, [currentUser]);

  useEffect(() => {
    const fetchCommunityPosts = async () => {
      try {
        const userId = await getLoggedInUserId();
        if (!userId) return;

        const possibleCommunityEndpoints = [
          `http://localhost:8080/api/posts/user/${userId}`,
          `http://localhost:8080/api/posts/author/${userId}`,
          `http://localhost:8080/api/posts?author_id=${userId}`,
          `http://localhost:8080/api/community/user/${userId}`,
        ];

        let postData = [];

        for (const endpoint of possibleCommunityEndpoints) {
          try {
            const response = await fetch(endpoint);
            if (!response.ok) continue;

            const data = await response.json();
            postData = data.data || [];

            if (Array.isArray(postData)) break;
          } catch (err) {
            console.log(`Community endpoint failed: ${endpoint}`, err);
          }
        }

        console.log("Community posts from backend:", postData);
        setCommunityPosts(postData);
      } catch (err) {
        console.error("Error fetching community posts:", err);
      }
    };

    fetchCommunityPosts();
  }, [currentUser]);

  const handleViewSpace = (spaceId) => {
    navigate(`/spaces/${spaceId}`);
  };

  const handleRemoveFavourite = async (spaceId) => {
    try {
      const userId = await getLoggedInUserId();
      if (!userId) return;

      const response = await fetch(
        `http://localhost:8080/api/users/${userId}/favourites/${spaceId}`,
        {
          method: "DELETE",
        }
      );

      await response.json();

      setFavourites((prev) => prev.filter((space) => space._id !== spaceId));
      removeFavourite(spaceId);
    } catch (err) {
      console.error("Error removing favourite:", err);
    }
  };

  const getCategoryCounts = () => {
    const counts = {};

    communityPosts.forEach((post) => {
      const category = getPostCategory(post);
      counts[category] = (counts[category] || 0) + 1;
    });

    return counts;
  };

  const categoryCounts = getCategoryCounts();

  return (
    <Box
      className="fade-in"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        backgroundColor: "#ffffff",
      }}
    >
      {/* LEFT SIDE */}
      <Box
        sx={{
          width: { xs: "100%", md: "350px" },
          backgroundColor: "#010e29",
          color: "white",
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          boxShadow: { md: 4 },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar
            sx={{
              width: 90,
              height: 90,
              mb: 2,
              bgcolor: "#6c63ff",
              fontSize: "2rem",
              fontWeight: 700,
            }}
          >
            {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>

          <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "center" }}>
            {currentUser?.username || "User"}
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#d0d0d0", textAlign: "center", mt: 0.5 }}
          >
            {currentUser?.email || "No email available"}
          </Typography>

          {currentUser?.role && (
            <Chip
              label={currentUser.role}
              sx={{
                mt: 2,
                backgroundColor: "#6c63ff",
                color: "white",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            />
          )}
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.06)",
            color: "white",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Profile Overview
          </Typography>

          <Typography variant="body2" sx={{ mb: 1.2, color: "#d6d6d6" }}>
            <strong>Username:</strong> {currentUser?.username || "N/A"}
          </Typography>

          <Typography variant="body2" sx={{ mb: 1.2, color: "#d6d6d6" }}>
            <strong>Email:</strong> {currentUser?.email || "N/A"}
          </Typography>

          <Typography variant="body2" sx={{ color: "#d6d6d6" }}>
            <strong>Favourite Spaces:</strong> {favourites.length}
          </Typography>
        </Paper>

        {/* REVIEWS */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.06)",
            color: "white",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            My Reviews
          </Typography>

          {userReviews.length === 0 ? (
            <Typography variant="body2" sx={{ color: "#d6d6d6" }}>
              No reviews added yet.
            </Typography>
          ) : (
            <>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {userReviews.slice(0, 3).map((review) => (
                  <Box
                    key={review._id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {review.title || "Untitled Review"}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#d6d6d6",
                        mt: 0.5,
                        mb: 0.75,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {review.content || "No content available."}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{ display: "block", color: "#bdbdbd", mb: 0.4 }}
                    >
                      Space:{" "}
                      {review.space_name ||
                        review.space?.name ||
                        review.space_id?.name ||
                        "Unknown Space"}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{ display: "block", color: "#9e9e9e" }}
                    >
                      {formatDateOnly(review.created_at || review.createdAt)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Button
                variant="outlined"
                onClick={() => navigate("/spaces")}
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.4)",
                  "&:hover": {
                    borderColor: "#fff",
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                See more reviews
              </Button>
            </>
          )}
        </Paper>

        {/* COMMUNITY POSTS */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.06)",
            color: "white",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            My Community Posts
          </Typography>

          {communityPosts.length === 0 ? (
            <Typography variant="body2" sx={{ color: "#d6d6d6" }}>
              No community posts added yet.
            </Typography>
          ) : (
            <>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {communityPosts.slice(0, 3).map((post) => {
                  const category = getPostCategory(post);
                  const style = tagStyles[category] || {};

                  return (
                    <Box
                      key={post._id}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.08)",
                      }}
                    >

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#d6d6d6",
                          mt: 0.5,
                          mb: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {post.content || "No content available."}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          icon={style.icon}
                          label={category}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            borderRadius: "8px",
                            ...style.sx,
                          }}
                        />

                        <Typography variant="caption" sx={{ color: "#9e9e9e" }}>
                          {formatDateOnly(post.created_at || post.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Button
                variant="outlined"
                onClick={() => navigate("/community")}
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.4)",
                  "&:hover": {
                    borderColor: "#fff",
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                See more posts
              </Button>
            </>
          )}
        </Paper>

        {/* CATEGORY SUMMARY */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.06)",
            color: "white",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Community Category Summary
          </Typography>

          {Object.keys(categoryCounts).length === 0 ? (
            <Typography variant="body2" sx={{ color: "#d6d6d6" }}>
              No categories to show yet.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {Object.entries(categoryCounts).map(([category, count]) => {
                const style = tagStyles[category] || {};

                return (
                  <Box
                    key={category}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1.2,
                      borderRadius: 2,
                      ...style.sx,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {style.icon}
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {category}
                      </Typography>
                    </Box>

                    <Chip
                      label={count}
                      size="small"
                      sx={{
                        backgroundColor: "#fff",
                        color: "#222",
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>
      </Box>

      {/* RIGHT SIDE */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 3, md: 5 },
          backgroundColor: "#ffffff",
        }}
      >
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
              My Favourite Spaces
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 500, color: "#555" }}>
              Saved places you can revisit anytime
            </Typography>
          </Box>

          {favourites.length > 0 && (
            <Button
              variant="outlined"
              onClick={() => navigate("/spaces")}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                color: "#010e29",
                borderColor: "#010e29",
                "&:hover": {
                  borderColor: "#010e29",
                  backgroundColor: "rgba(1, 14, 41, 0.06)",
                },
              }}
            >
              Browse More Spaces
            </Button>
          )}
        </Box>

        {favourites.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: "center",
              backgroundColor: "#ffffff",
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              No favourites added yet.
            </Typography>
            <Typography variant="body1" sx={{ color: "#666", mb: 2 }}>
              Start exploring spaces and save the ones that suit your needs.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate("/spaces")}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                color: "#010e29",
                borderColor: "#010e29",
                "&:hover": {
                  borderColor: "#010e29",
                  backgroundColor: "rgba(1, 14, 41, 0.06)",
                },
              }}
            >
              Go to Spaces
            </Button>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                xl: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {favourites.map((space) => (
              <Card
                key={space._id}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "0.25s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#fff",
                  border: "1px solid #e8e8e8",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 8,
                  },
                }}
              >
                <Box className="image-container">
                  <CardMedia
                    component="img"
                    height="220"
                    image={space.image_url}
                    alt={space.name}
                    className="space-image"
                    onClick={() => handleViewSpace(space._id)}
                    sx={{ objectFit: "cover" }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {space.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#555",
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {space.about}
                  </Typography>

                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => handleRemoveFavourite(space._id)}
                    sx={{
                      mt: 1,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Favourites;