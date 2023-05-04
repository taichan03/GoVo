import React, { useState } from "react";
import "./header.css";
import people from "../../assets/people.png";
import ai from "../../assets/ai.png";

interface HeaderProps {
  onZipCodeSubmit: (zipCode: string) => void;
}
const Header = ({ onZipCodeSubmit }: HeaderProps) => {
  const [zipCode, setZipCode] = useState("");
  const [showChatButton, setShowChatButton] = useState(true);

  const handleZipCodeSubmit = () => {
    onZipCodeSubmit(zipCode);
    setZipCode("");
    setShowChatButton(false);
  };

  return (
    <div className="gpt3__header section__padding" id="home">
      <div className="gpt3__header-content">
        <h1 className="gradient__text">
          A non-partisan app to help you connect the dots
        </h1>
        <p>
          Enter your zip code for a tailored voting plan for the your next
          upcoming election. Remember, there can be up to 3 elections on any
          given year and we encourage participation in your local elections for
          maximum impact.
        </p>

        <div className="gpt3__header-content__input">
          <input
            type="text"
            placeholder="Enter your Zip Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
          <button type="button" onClick={handleZipCodeSubmit}>
            Get Started
          </button>
        </div>

        {/* {showChatButton && (
          <button
            type="button"
            className="gpt3__header-chat-button"
            onClick={() => setShowChatButton(false)}
          >
            Click here to start a chat
          </button>
        )} */}

        {/* <div className="gpt3__header-content__people">
          <img src={people} />
          <p>1,600 people requested access a visit in last 24 hours</p>
        </div> */}
      </div>

      {/* <div className="gpt3__header-image">
        <img src={ai} />
      </div>
      <div className="gpt3__header-image">
        <img src={ai} />
      </div> */}
    </div>
  );
};

export default Header;
