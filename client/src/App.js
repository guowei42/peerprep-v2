import React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";

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
