import React from "react";
import Feature from "../../components/feature/Feature";
import "./features.css";

const featuresData = [
  {
    title: "Tailored voting plan",
    text: "Our app will ask for your zip code and generate a personalized voting plan for you based on your location and the upcoming elections in your area.",
  },
  {
    title: "Non-partisan",
    text: "Our app is non-partisan and doesn't endorse any political party or candidate.",
  },
  {
    title: "Connect the dots",
    text: "Our app helps you connect the dots between your values and the issues that matter most to you, and the candidates and policies that align with those values.",
  },
  {
    title: "Encourage participation",
    text: "We encourage participation in all elections, including local ones. We believe that every election, no matter how small, has the potential to make a big impact on your community and the world at large.",
  },
];

const Features = () => (
  <div className="gpt3__features section__padding" id="features">
    <div className="gpt3__features-heading">
      <h1 className="gradient__text">Be Part of the Change. Vote Today!</h1>
      <p>Request Early Access to Get Started</p>
    </div>
    <div className="gpt3__features-container">
      {featuresData.map((item, index) => (
        <Feature {...item} key={item.title + index} />
      ))}
    </div>
  </div>
);

export default Features;
