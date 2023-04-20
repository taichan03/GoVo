import React from "react";

import { Features, Header } from "./containers";
import { Navbar } from "./components";

import "./App.css";

const App = () => (
  <div className="App">
    <div className="gradient__bg">
      <Navbar />
      <Header />
    </div>
    <Features />
  </div>
);

export default App;
