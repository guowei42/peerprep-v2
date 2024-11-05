import { Container } from "@mui/material";
// import React from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <Container className="outlet">
        <Outlet />
      </Container>
    </div>
  );
}

export default App;
