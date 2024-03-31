import React, { useState } from 'react';
import ProfilePic1 from "../../Assets/sajid.png";
import ProfilePic2 from "../../Assets/rida.jpeg";
import { AiFillStar } from "react-icons/ai";
import { FaArrowCircleRight } from "react-icons/fa";
import { FaArrowCircleLeft } from "react-icons/fa";


const Testimonial = () => {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const testimonials = [
    {
      name: 'Sajid Abderrahmane',
      text: 'I used INElearning for almost 6 months now and I have got the best experience ever! INElearning transformed my career trajectory – unlocking new skills and opportunities!',
      stars: 5
    },
    {
      name: 'Tahir Rida',
      text: "I can't recommend INElearning highly enough. If you're looking to elevate your skills, expand your professional horizons, and unlock new career possibilities, this platform is undoubtedly the way to go.",
      stars: 4
    },
  ];


  const profilePics = [
    ProfilePic1, ProfilePic2
  ];

  const handleNextTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  return (
    <div className="work-section-wrapper" id="testimonial">
      <div className="work-section-top">
        <p className="primary-subheading">Testimonial</p>
        <h1 className="primary-heading">What They Are Saying</h1>
        <p className="primary-text">
          Several INEs have used our platform INElearning and they left us a review.
        </p>
      </div>
      <div className="testimonial-section-bottom">
        <img src={profilePics[currentTestimonialIndex]} alt="" style={{ borderRadius: '50%', width: '300px', height: '300px' }} />
        <p>{testimonials[currentTestimonialIndex].text}</p>
        <div className="testimonials-stars-container">
          {Array.from({ length: testimonials[currentTestimonialIndex].stars }, (_, index) => (
            <AiFillStar key={index} />
          ))}
        </div>
        <h2>{testimonials[currentTestimonialIndex].name}</h2>
        <div className='arrow-bttn-container'>
          <button onClick={handlePrevTestimonial} className="arrow-bttn"><FaArrowCircleLeft /></button>
          <button onClick={handleNextTestimonial} className="arrow-bttn"><FaArrowCircleRight /></button>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
