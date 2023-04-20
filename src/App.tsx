import React, { useState } from "react";
import { Footer, Features, WhatGPT3, Header } from "./containers";
import { Navbar } from "./components";
import "./App.css";

const App = () => {
  const [zipCode, setZipCode] = useState("");
  const [chatVisible, setChatVisible] = useState(false);

  const handleZipCodeSubmit = (zipCode) => {
    setZipCode(zipCode);
    setTimeout(() => {
      setChatVisible(true);
    }, 500);
  };
  return (
    <div className="App">
      <div className={`gradient__bg ${chatVisible ? "chat-visible" : ""}`}>
        <Navbar />
        {chatVisible && <WhatGPT3 zipCode={zipCode} />}
        <Header onZipCodeSubmit={handleZipCodeSubmit} />
      </div>
      <div className={`Features ${chatVisible ? "chat-visible" : ""}`}>
        <Features />
      </div>
      <div className={`Footer ${chatVisible ? "chat-visible" : ""}`}>
        <Footer />
      </div>
    </div>
  );
};

export default App;
