import React, { useState } from "react";
import { Features, WhatGPT3, Header } from "./containers";
import { Navbar } from "./components";
import "./App.css";

const App = () => {
  const [zipCode, setZipCode] = useState("");
  const [chatVisible, setChatVisible] = useState(false);

  const handleZipCodeAndAPIKeySubmit = (zipCode: string) => {
    setZipCode(zipCode);
    setChatVisible(true);
  };

  return (
    <div className="App">
      <div className={`gradient__bg ${chatVisible ? "chat-visible" : ""}`}>
        <Navbar />
        {chatVisible && <WhatGPT3 zipCode={zipCode} />}
        {!chatVisible && (
          <Header onZipCodeAndAPIKeySubmit={handleZipCodeAndAPIKeySubmit} />
        )}
      </div>
      <div className={`Features ${chatVisible ? "chat-visible" : ""}`}>
        <Features />
      </div>
      <div className={`Footer ${chatVisible ? "chat-visible" : ""}`}></div>
    </div>
  );
};

export default App;
