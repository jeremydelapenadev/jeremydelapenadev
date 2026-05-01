import { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Divider,
  CardMedia,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CelebrationIcon from "@mui/icons-material/Celebration";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ForumIcon from "@mui/icons-material/Forum";
import { userContext } from "../context/UserProvider";

const TAGS = [
  "All",
  "Experiences",
  "Tips",
  "Questions",
  "Celebrations",
  "Resources",
];

export default function Community() {
  const { currentUser } = useContext(userContext);
  const isLoggedIn = !!currentUser;

  const [selectedTag, setSelectedTag] = useState("All");
  const [newPost, setNewPost] = useState("");
  const [newTag, setNewTag] = useState("Experiences");
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [likedPosts, setLikedPosts] = useState({});
  const [likedComments, setLikedComments] = useState({});
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentCounts, setCommentCounts] = useState({});
  const [commentLikeCounts, setCommentLikeCounts] = useState({});
  const [postLikeCounts, setPostLikeCounts] = useState({});

  useEffect(() => {
    fetchPosts();

    if (currentUser?._id) {
      fetchUserLikes();
    } else {
      setLikedPosts({});
      setLikedComments({});
    }
  }, [currentUser]);

  const getUserId = (obj) => {
    if (!obj) return null;
    return obj._id || obj;
  };

  const closeSelectedPost = () => {
    setSelectedPost(null);
    setComments([]);
    setNewComment("");
    setCommentLikeCounts({});
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/posts");

      if (!res.ok) {
        const text = await res.text();
        console.error("Posts fetch failed:", text);
        throw new Error("Failed to fetch posts");
      }

      const data = await res.json();
      const fetchedPosts = data.data || [];
      setPosts(fetchedPosts);

      fetchCommentCountsForPosts(fetchedPosts);
      fetchPostLikeCounts(fetchedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setPosts([]);
      setCommentCounts({});
      setPostLikeCounts({});
    }
  };

  const fetchCommentCountsForPosts = async (postsList) => {
    try {
      const countsEntries = await Promise.all(
        postsList.map(async (post) => {
          try {
            const res = await fetch(
              `http://localhost:8080/api/comments/post/${post._id}`,
            );

            if (!res.ok) return [post._id, 0];

            const data = await res.json();
            return [post._id, (data.data || []).length];
          } catch (err) {
            console.error(
              `Error fetching comment count for post ${post._id}:`,
              err,
            );
            return [post._id, 0];
          }
        }),
      );

      setCommentCounts(Object.fromEntries(countsEntries));
    } catch (err) {
      console.error("Error fetching comment counts:", err);
      setCommentCounts({});
    }
  };

  const fetchPostLikeCounts = async (postsList) => {
    try {
      const entries = await Promise.all(
        postsList.map(async (post) => {
          try {
            const res = await fetch(
              `http://localhost:8080/api/likes/post/${post._id}`,
            );

            if (!res.ok) return [post._id, 0];

            const data = await res.json();
            return [post._id, (data.data || []).length];
          } catch (err) {
            console.error(
              `Error fetching like count for post ${post._id}:`,
              err,
            );
            return [post._id, 0];
          }
        }),
      );

      setPostLikeCounts(Object.fromEntries(entries));
    } catch (err) {
      console.error("Error fetching post like counts:", err);
      setPostLikeCounts({});
    }
  };

  const fetchUserLikes = async () => {
    if (!currentUser?._id) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/likes/user/${currentUser._id}`,
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("User likes fetch failed:", text);
        throw new Error("Failed to fetch likes");
      }

      const data = await res.json();

      const likedPostMap = {};
      const likedCommentMap = {};

      (data.data || []).forEach((like) => {
        const likedPostId = like.post_id?._id || like.post_id;
        const likedCommentId = like.comment_id?._id || like.comment_id;

        if (likedPostId) likedPostMap[likedPostId] = true;
        if (likedCommentId) likedCommentMap[likedCommentId] = true;
      });

      setLikedPosts(likedPostMap);
      setLikedComments(likedCommentMap);
    } catch (err) {
      console.error("Error fetching user likes:", err);
      setLikedPosts({});
      setLikedComments({});
    }
  };

  const fetchCommentsByPost = async (postId) => {
    try {
      setLoadingComments(true);

      const res = await fetch(
        `http://localhost:8080/api/comments/post/${postId}`,
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Comments fetch failed:", text);
        throw new Error("Failed to fetch comments");
      }

      const data = await res.json();
      const fetchedComments = data.data || [];
      setComments(fetchedComments);

      setCommentCounts((prev) => ({
        ...prev,
        [postId]: fetchedComments.length,
      }));

      fetchCommentLikeCounts(fetchedComments);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
      setCommentLikeCounts({});
    } finally {
      setLoadingComments(false);
    }
  };

  const fetchCommentLikeCounts = async (commentsList) => {
    try {
      const entries = await Promise.all(
        commentsList.map(async (comment) => {
          try {
            const res = await fetch(
              `http://localhost:8080/api/likes/comment/${comment._id}`,
            );

            if (!res.ok) return [comment._id, 0];

            const data = await res.json();
            return [comment._id, (data.data || []).length];
          } catch (err) {
            console.error(
              `Error fetching like count for comment ${comment._id}:`,
              err,
            );
            return [comment._id, 0];
          }
        }),
      );

      setCommentLikeCounts(Object.fromEntries(entries));
    } catch (err) {
      console.error("Error fetching comment like counts:", err);
      setCommentLikeCounts({});
    }
  };

  const refreshAfterPostLikeChange = async () => {
    await fetchUserLikes();
    await fetchPostLikeCounts(posts);
  };

  const refreshAfterCommentLikeChange = async () => {
    await fetchUserLikes();
    await fetchCommentLikeCounts(comments);
  };

  const handleCreatePost = async () => {
    if (!isLoggedIn) {
      alert("Please log in first to create a post.");
      return;
    }

    if (!currentUser?._id) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    if (!newPost.trim()) {
      alert("Please write something before posting.");
      return;
    }

    try {
      const payload = {
        title: newTag,
        content: newPost,
        status: "published",
        author_id: currentUser._id,
      };

      const res = await fetch("http://localhost:8080/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Create post failed:", text);
        throw new Error("Failed to create post");
      }

      const data = await res.json();

      if (data.result === 200) {
        setNewPost("");
        setNewTag("Experiences");
        fetchPosts();
      } else {
        alert(data.message || data.error || "Failed to create post.");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Something went wrong while creating the post.");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!isLoggedIn) {
      alert("Please log in first.");
      return;
    }

    const confirmDelete = window.confirm("Delete this post?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Delete post failed:", text);
        throw new Error("Failed to delete post");
      }

      const data = await res.json();

      if (data.result === 200) {
        if (selectedPost?._id === postId) {
          closeSelectedPost();
        }
        fetchPosts();
      } else {
        alert(data.message || data.error || "Failed to delete post.");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Something went wrong while deleting the post.");
    }
  };

  const handleToggleLike = async (postId) => {
    if (!isLoggedIn) {
      alert("Please log in first to like a post.");
      return;
    }

    if (!currentUser?._id) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    const isCurrentlyLiked = !!likedPosts[postId];

    console.log("POST LIKE PAYLOAD", {
      post_id: postId,
      user_id: currentUser._id,
    });

    try {
      if (!isCurrentlyLiked) {
        const res = await fetch("http://localhost:8080/api/likes/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: postId,
            user_id: currentUser._id,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Create like failed:", text);
          throw new Error("Failed to create like");
        }

        const data = await res.json();

        if (data.result !== 200) {
          throw new Error(
            data.error || data.message || "Failed to create like",
          );
        }
      } else {
        const res = await fetch("http://localhost:8080/api/likes/remove", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: postId,
            user_id: currentUser._id,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Remove like failed:", text);
          throw new Error("Failed to remove like");
        }

        const data = await res.json();

        if (data.result !== 200) {
          throw new Error(
            data.error || data.message || "Failed to remove like",
          );
        }
      }

      await refreshAfterPostLikeChange();
    } catch (err) {
      console.error("Error toggling like:", err);
      alert("Something went wrong while updating the like.");
    }
  };

  const handleToggleCommentLike = async (commentId) => {
    if (!isLoggedIn) {
      alert("Please log in first to like a comment.");
      return;
    }

    if (!currentUser?._id) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    const isCurrentlyLiked = !!likedComments[commentId];

    console.log("COMMENT LIKE PAYLOAD", {
      comment_id: commentId,
      user_id: currentUser._id,
    });

    try {
      if (!isCurrentlyLiked) {
        const res = await fetch("http://localhost:8080/api/likes/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment_id: commentId,
            user_id: currentUser._id,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Create comment like failed:", text);
          throw new Error("Failed to create comment like");
        }

        const data = await res.json();

        if (data.result !== 200) {
          throw new Error(
            data.error || data.message || "Failed to create comment like",
          );
        }
      } else {
        const res = await fetch("http://localhost:8080/api/likes/remove", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment_id: commentId,
            user_id: currentUser._id,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Remove comment like failed:", text);
          throw new Error("Failed to remove comment like");
        }

        const data = await res.json();

        if (data.result !== 200) {
          throw new Error(
            data.error || data.message || "Failed to remove comment like",
          );
        }
      }

      await refreshAfterCommentLikeChange();
    } catch (err) {
      console.error("Error toggling comment like:", err);
      alert("Something went wrong while updating the comment like.");
    }
  };

  const handleOpenComments = (post) => {
    if (!isLoggedIn) {
      alert("Please log in first to comment on a post.");
      return;
    }

    if (selectedPost?._id === post._id) {
      closeSelectedPost();
      return;
    }

    setSelectedPost(post);
    setNewComment("");
    fetchCommentsByPost(post._id);
  };

  const handleSubmitComment = async () => {
    if (!isLoggedIn) {
      alert("Please log in first to comment.");
      return;
    }

    if (!currentUser?._id) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    if (!newComment.trim()) {
      alert("Please write a comment before submitting.");
      return;
    }

    if (!selectedPost?._id) {
      alert("No post selected.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/comments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          post_id: selectedPost._id,
          user_id: currentUser._id,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Create comment failed:", text);
        throw new Error("Failed to create comment");
      }

      const data = await res.json();

      if (data.result === 200) {
        setNewComment("");
        fetchCommentsByPost(selectedPost._id);
        setCommentCounts((prev) => ({
          ...prev,
          [selectedPost._id]: (prev[selectedPost._id] || 0) + 1,
        }));
      } else {
        alert(data.message || data.error || "Failed to submit comment.");
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Something went wrong while submitting the comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm("Delete this comment?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Delete comment failed:", text);
        throw new Error("Failed to delete comment");
      }

      const data = await res.json();

      if (data.result === 200) {
        if (selectedPost?._id) {
          fetchCommentsByPost(selectedPost._id);
          setCommentCounts((prev) => ({
            ...prev,
            [selectedPost._id]: Math.max(0, (prev[selectedPost._id] || 0) - 1),
          }));
        }
      } else {
        alert(data.message || data.error || "Failed to delete comment.");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Something went wrong while deleting the comment.");
    }
  };

  const filteredPosts =
    selectedTag === "All"
      ? posts
      : posts.filter((post) => post.title === selectedTag);

  const getRelativeTime = (date) => {
    if (!date) return "";

    const now = new Date();
    const diffMs = now - new Date(date);
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) {
      return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

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

  return (
    <div className="fade-in" style={{ padding: "0px" }}>
      <Box sx={{ p: 3, maxWidth: "1400px", margin: "0 auto" }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 600, mt: 0 }}>
          Community
        </Typography>

        <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
          A safe place to share, ask, and celebrate.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {TAGS.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "contained" : "outlined"}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </Stack>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "flex-start",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box
            sx={{
              flex: selectedPost ? 1 : "unset",
              width: "100%",
              maxWidth: { xs: "100%", md: selectedPost ? "650px" : "1000px" },
              transition: "all 0.35s ease",
            }}
          >
            {isLoggedIn && (
              <Card sx={{ mb: 4, borderRadius: 3 }}>
                <CardContent>
                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Write your post here..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <Stack direction="row" spacing={2}>
                    <Select
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      size="small"
                    >
                      {TAGS.filter((t) => t !== "All").map((tag) => (
                        <MenuItem key={tag} value={tag}>
                          {tag}
                        </MenuItem>
                      ))}
                    </Select>

                    <Button variant="contained" onClick={handleCreatePost}>
                      Post
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            )}

            <Stack spacing={2}>
              {filteredPosts.map((post) => {
                const isLiked = !!likedPosts[post._id];
                const isSelected = selectedPost?._id === post._id;
                const postAuthorId = getUserId(post.author_id);
                const canDeletePost =
                  currentUser?._id &&
                  postAuthorId &&
                  currentUser._id === postAuthorId;
                const postCommentCount = commentCounts[post._id] || 0;
                const postLikes = postLikeCounts[post._id] || 0;

                return (
                  <Card
                    key={post._id}
                    sx={{
                      position: "relative",
                      borderRadius: 3,
                      transition: "all 0.35s ease",
                      border: isSelected
                        ? "2px solid #7b61ff"
                        : "1px solid transparent",
                    }}
                  >
                    {post.image_url && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={post.image_url}
                        alt={post.title}
                      />
                    )}

                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "text.secondary", mb: 1 }}
                      >
                        {post.author_id?.username || "Anonymous"} •{" "}
                        {post.created_at
                          ? new Date(post.created_at).toLocaleString()
                          : getRelativeTime(post.created_at || post.createdAt)}
                      </Typography>

                      <Typography variant="body1">{post.content}</Typography>
                    </CardContent>

                    <Divider />

                    <CardActions sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <IconButton
                          disabled={!isLoggedIn}
                          onClick={() => handleToggleLike(post._id)}
                          sx={{
                            color: isLiked ? "red" : "inherit",
                            transform: isLiked ? "scale(1.18)" : "scale(1)",
                            transition: "transform 0.2s ease, color 0.2s ease",
                          }}
                        >
                          <FavoriteIcon />
                        </IconButton>

                        {postLikes > 0 && (
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {postLikes}
                          </Typography>
                        )}
                      </Box>

                      <Button
                        disabled={!isLoggedIn}
                        onClick={() => handleOpenComments(post)}
                        startIcon={<CommentIcon />}
                        sx={{
                          textTransform: "none",
                          minWidth: "auto",
                        }}
                      >
                        {postCommentCount > 0 ? `${postCommentCount}` : ""}
                      </Button>

                      {canDeletePost && (
                        <IconButton
                          onClick={() => handleDeletePost(post._id)}
                          sx={{
                            ml: "auto",
                            color: "error.main",
                            "&:hover": {
                              backgroundColor: "rgba(255,0,0,0.08)",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </CardActions>

                    <Chip
                      icon={tagStyles[post.title || "Experiences"]?.icon}
                      label={post.title || "Experiences"}
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                        fontWeight: "bold",
                        ...tagStyles[post.title || "Experiences"]?.sx,
                        "& .MuiChip-icon": {
                          color: "inherit",
                          ml: 0.5,
                        },
                      }}
                    />
                  </Card>
                );
              })}
            </Stack>
          </Box>

          {selectedPost && (
            <Box
              sx={{
                flex: 1,
                minWidth: { xs: "100%", md: "350px" },
                width: "100%",
                position: { xs: "static", md: "sticky" },
                top: "90px",
              }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 4,
                  maxHeight: { xs: "none", md: "85vh" },
                  overflowY: { xs: "visible", md: "auto" },
                }}
              >
                {selectedPost.image_url && (
                  <CardMedia
                    component="img"
                    height="240"
                    image={selectedPost.image_url}
                    alt={selectedPost.title}
                  />
                )}

                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {selectedPost.title || "Post"}
                    </Typography>

                    <IconButton onClick={closeSelectedPost}>
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  <Typography
                    variant="subtitle2"
                    sx={{ color: "text.secondary", mb: 2 }}
                  >
                    {selectedPost.author_id?.username || "Anonymous"} •{" "}
                    {selectedPost.created_at
                      ? new Date(selectedPost.created_at).toLocaleString()
                      : getRelativeTime(
                          selectedPost.created_at || selectedPost.createdAt,
                        )}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {selectedPost.content}
                  </Typography>

                  <Divider sx={{ mb: 3 }} />

                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Comments
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    {loadingComments ? (
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Loading comments...
                      </Typography>
                    ) : comments.length === 0 ? (
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        No comments yet.
                      </Typography>
                    ) : (
                      <Stack spacing={2}>
                        {comments.map((comment) => {
                          const commentUserId = getUserId(comment.user_id);
                          const canDeleteComment =
                            currentUser?._id &&
                            commentUserId &&
                            currentUser._id === commentUserId;
                          const isCommentLiked = !!likedComments[comment._id];
                          const commentLikes =
                            commentLikeCounts[comment._id] || 0;

                          return (
                            <Card
                              key={comment._id}
                              sx={{ borderRadius: 2, boxShadow: 1 }}
                            >
                              <CardContent sx={{ pb: 1 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    gap: 2,
                                  }}
                                >
                                  <Box sx={{ flex: 1 }}>
                                    <Typography
                                      variant="subtitle2"
                                      sx={{ color: "text.secondary", mb: 0.5 }}
                                    >
                                      {comment.user_id?.username || "Anonymous"}{" "}
                                      •{" "}
                                      {comment.created_at
                                        ? new Date(
                                            comment.created_at,
                                          ).toLocaleString()
                                        : ""}
                                    </Typography>

                                    <Typography
                                      variant="body2"
                                      sx={{ mb: 1.5 }}
                                    >
                                      {comment.content}
                                    </Typography>

                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleToggleCommentLike(comment._id)
                                        }
                                        sx={{
                                          color: isCommentLiked
                                            ? "red"
                                            : "inherit",
                                          transform: isCommentLiked
                                            ? "scale(1.12)"
                                            : "scale(1)",
                                          transition:
                                            "transform 0.2s ease, color 0.2s ease",
                                        }}
                                      >
                                        <FavoriteIcon fontSize="small" />
                                      </IconButton>

                                      {commentLikes > 0 && (
                                        <Typography
                                          variant="body2"
                                          sx={{ color: "text.secondary" }}
                                        >
                                          {commentLikes}
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>

                                  {canDeleteComment && (
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleDeleteComment(comment._id)
                                      }
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                </Box>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </Stack>
                    )}
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Write your comment here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <Button variant="contained" onClick={handleSubmitComment}>
                    Submit Comment
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}
