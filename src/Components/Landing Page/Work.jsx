import React from "react";
import CreateAccount from "../../Assets/create-account.png";
import Post from "../../Assets/post.png";
import Check from "../../Assets/consult.png";

const Work = () => {
  const workInfoData = [
    {
      image: CreateAccount,
      title: "Create your account",
      text: "Start by creating your account on the platforme.",
    },
    {
      image: Post,
      title: "Share your Skills",
      text: "Videos, documents that shows off your skills ",
    },
    {
      image: Check,
      title: "Learn Skills",
      text: "Check other INEs skills in multiple fields",
    },
  ];
  return (
    <div className="work-section-wrapper" id="work">
      <div className="work-section-top">
        <p className="primary-subheading">How</p>
        <h1 className="primary-heading">How It Works</h1>
        <p className="primary-text">
          INElearning a platform to exchange knowledge. Friendly UI , easy to use !
        </p>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" className="work-img" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
