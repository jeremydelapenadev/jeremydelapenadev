import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userContext } from "../context/UserProvider";
import {
  Box,
  Typography,
  Chip,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  TextField,
  IconButton,
  Divider,
  Stack,
  Rating,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function SpaceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(userContext);

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDescription, setReviewDescription] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);

  const getUserId = (obj) => {
    if (!obj) return null;
    return obj._id || obj;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString();
  };

  const fetchSpace = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/spaces/${id}`);
      const data = await res.json();

      if (data.result !== 200 || !data.data) {
        setError("Space not found.");
        setLoading(false);
        return;
      }

      setSpace(data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching space:", err);
      setError("Unable to load this space.");
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/reviews/space/${id}`);
      const data = await res.json();

      if (data.result === 200) {
        setReviews(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchSpace();
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!currentUser?._id) {
      alert("Please log in first to submit a review.");
      return;
    }

    if (!reviewTitle.trim() || !reviewDescription.trim()) {
      alert("Please complete both the title and description.");
      return;
    }

    if (!reviewRating) {
      alert("Please select a rating from 1 to 5 stars.");
      return;
    }

    try {
      setSubmittingReview(true);

      const response = await fetch("http://localhost:8080/api/reviews/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          space_id: id,
          author_id: currentUser._id,
          title: reviewTitle,
          content: reviewDescription,
          rating: reviewRating,
          status: "published",
        }),
      });

      const data = await response.json();

      if (data.result === 200) {
        setReviewTitle("");
        setReviewDescription("");
        setReviewRating(0);
        fetchReviews();
      } else {
        alert(data.message || data.error || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Error creating review:", err);
      alert("Something went wrong while submitting the review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm("Delete this review?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.result === 200) {
        fetchReviews();
      } else {
        alert(data.message || data.error || "Failed to delete review.");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Something went wrong while deleting the review.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !space) {
    return (
      <Box
        sx={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          p: 3,
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate("/spaces")}>
          Back to Spaces
        </Button>
      </Box>
    );
  }

  return (
    <div className="fade-in">
      <Box sx={{ maxWidth: "1400px", margin: "0 auto", p: 3 }}>
        <Button
          variant="outlined"
          sx={{ mb: 3 }}
          onClick={() => navigate("/spaces")}
        >
          Back to Spaces
        </Button>

        <Typography
          variant="h3"
          sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
        >
          {space.name}
        </Typography>

        {/* TOP SECTION */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "flex-start",
            mb: 6,
          }}
        >
          {/* LEFT COLUMN */}
          <Box sx={{ flex: 1, width: "100%" }}>
            <Card sx={{ borderRadius: 3, overflow: "hidden", p: 2 }}>
              <CardMedia
                component="img"
                image={space.image_url}
                alt={space.name}
                sx={{
                  width: "100%",
                  height: { xs: "250px", md: "450px" },
                  objectFit: "cover",
                  borderRadius: 2,
                  mb: 2,
                }}
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5 }}>
                    Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {space.type || "N/A"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5 }}>
                    Council
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {space.council || "N/A"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5 }}>
                    Verified
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {space.verified ? "Yes" : "No"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5 }}>
                    Author Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {space.author_type || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>

          {/* RIGHT COLUMN */}
          <Box sx={{ flex: 1, width: "100%" }}>
            <Card
              sx={{
                borderRadius: 3,
                p: 3,
                boxShadow: 2,
                backgroundColor: "#fff",
              }}
            >
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {space.tags?.length > 0 ? (
                  space.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      variant="outlined"
                      color="primary"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No tags available
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box sx={{ pb: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
                  <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5 }}>
                    About
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {space.about || "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ pb: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
                  <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5 }}>
                    Autism Friendly Features
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {space.autism_friendly_features?.length > 0
                      ? space.autism_friendly_features.join(", ")
                      : "N/A"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5 }}>
                      Cost
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {space.cost || "N/A"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5 }}>
                      Age Suitability
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {space.age_suitability || "N/A"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5 }}>
                      Noise Level
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {space.noise_level || "N/A"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5 }}>
                      Quiet Hours
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {space.quiet_hours || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ pt: 1.5, borderTop: "1px solid", borderColor: "divider" }}>
                  <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5 }}>
                    Accessibility Features
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {space.accessibility_features?.length > 0
                      ? space.accessibility_features.join(", ")
                      : "N/A"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5 }}>
                    Address
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {space.address || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>

        {/* REVIEWS SECTION */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          User Reviews on {space.name}
        </Typography>

        {currentUser && (
          <Card sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Write a Review
            </Typography>

            <TextField
              fullWidth
              label="Title"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={reviewDescription}
              onChange={(e) => setReviewDescription(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Rate this space
              </Typography>
              <Rating
                name="review-rating"
                value={reviewRating}
                onChange={(event, newValue) => setReviewRating(newValue)}
              />
            </Box>

            <Button
              variant="contained"
              onClick={handleSubmitReview}
              disabled={submittingReview}
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </Card>
        )}

        {!currentUser ? (
          <Card sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              You must be logged in to use this feature.
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Sign up or log in to get more access to reviews and insights from other families and community members.
            </Typography>
          </Card>
        ) : reviews.length === 0 ? (
          <Typography>No reviews yet.</Typography>
        ) : (
          <Stack spacing={2}>
            {reviews.map((review) => {
              const reviewAuthorId = getUserId(review.author_id);
              const canDeleteReview =
                currentUser?._id &&
                reviewAuthorId &&
                currentUser._id === reviewAuthorId;

              return (
                <Card key={review._id} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "text.secondary", mb: 1, textAlign: "left" }}
                    >
                      {review.author_id?.username || "Unknown User"} •{" "}
                      {formatDate(review.created_at || review.createdAt)}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{ mt: 1, textAlign: "left", fontWeight: 700 }}
                    >
                      {review.title}
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}>
                      <Rating value={review.rating || 0} readOnly size="small" />
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{ mt: 1, mb: 2, textAlign: "left" }}
                    >
                      {review.content}
                    </Typography>
                  </CardContent>

                  <Divider />

                  <Box sx={{ p: 1, display: "flex", justifyContent: "flex-end" }}>
                    {canDeleteReview && (
                      <IconButton onClick={() => handleDeleteReview(review._id)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Card>
              );
            })}
          </Stack>
        )}
      </Box>
    </div>
  );
}

export default SpaceView;