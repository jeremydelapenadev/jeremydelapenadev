import { useState } from "react";
import { useFormInput } from "../Hooks/useFormInput";
import { useContext } from "react";
import { userContext } from "../context/UserProvider";
import { useNavigate } from "react-router-dom";

// Exercise 5 requirement - Use MUI form components for the form inputs
import { TextField, Button, Box, Typography, Paper } from "@mui/material";

function LoginForm() {
  const navigate = useNavigate(); // <-- get navigate function
  const [result, setResult] = useState("");

  const [emailInputProps, resetEmail] = useFormInput("");
  const [passInputProps, resetPassword] = useFormInput("");

  // STEP 3: Use the Context.
  const { currentUser, handleUpdateUser } = useContext(userContext);

  async function FormSubmitted(e) {
    e.preventDefault();

    if (emailInputProps.value.length < 5) {
      setResult("Email cannot be less than 5 characters");
      return;
    }

    if (passInputProps.value.length < 4) {
      setResult("Password cannot be less than 4 characters");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInputProps.value,
          password: passInputProps.value,
        }),
      });

      const data = await response.json();

      console.log("Login response data:", data);
      console.log("User being stored in context:", data.user);
      console.log("User _id:", data.user?._id);

      if (!response.ok) {
        setResult(data.message);
        return;
      }

      handleUpdateUser(data.user); // store the user information in the context

      // <-- Immediately redirect to home
      navigate("/favourites");
      setResult("User logged in successfully.");
    } catch (err) {
      setResult("Server error. Try again.");
    }
  }

  function logout() {
    handleUpdateUser(null); // pass empty data to the user that will log out the user
    setResult("");
  }

  return (
    <>
      {" "}
      {/* used the Button prop */}
      {currentUser ? (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Are you sure you want to logout?
          </Typography>
          <Button variant="contained" color="error" onClick={logout}>
            Logout
          </Button>{" "}
        </>
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
          >
            <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
              <Typography variant="h5" gutterBottom>
                {" "}
                Login{" "}
              </Typography>

              <Box component="form" onSubmit={FormSubmitted}>
                <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  {...emailInputProps}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  {...passInputProps}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Submit
                </Button>
              </Box>

              {result && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {result}{" "}
                </Typography>
              )}
            </Paper>
          </Box>
        </>
      )}
    </>
  );
}

export default LoginForm;
