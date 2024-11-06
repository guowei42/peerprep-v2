// LandingPage.js
import React from "react";
import { Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <Container
      maxWidth="lg"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Animated Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <Typography
          variant="h2"
          style={{
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#1976d2",
          }}
        >
          Welcome to PeerPrep
        </Typography>
      </motion.div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <Typography
          variant="h5"
          style={{
            marginBottom: "30px",
            color: "#555",
          }}
        >
          Master technical interviews with real-time peer collaboration.
        </Typography>
      </motion.div>

      {/* Call to Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, delay: 1 }}
      >
        <Link to="/signup" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{ marginRight: "10px" }}
          >
            Get Started
          </Button>
        </Link>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <Button variant="outlined" color="primary" size="large">
            Log In
          </Button>
        </Link>
      </motion.div>
    </Container>
  );
};

export default LandingPage;

