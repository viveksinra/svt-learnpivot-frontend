import React, { useState } from "react";
import FsLightbox from "fslightbox-react";
import Image from "next/image";

const AboutArea = () => {
  // To open the lightbox change the value of the "toggler" prop.
  const [toggler, setToggler] = useState(false);

  return (
    <>
      <FsLightbox
        toggler={toggler}
        sources={["https://youtu.be/KZ8wOl9vIvE?si=M_BWYzgyMqoluXkn"]}
      />

      <div className="about-area-two ptb-10">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 col-md-12">
              <div className="about-image">
                <Image
                  src="/images/MyImage/About/student-online.png"
                  alt="image"
                  className="rounded-10"
                  width={500}
                  height={750}
                  loading="lazy"
                />

                {/* <div className="solution-video">
                  <div
                    onClick={() => setToggler(!toggler)}
                    className="video-btn"
                  >
                    <i className="flaticon-play-button"></i>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="col-lg-7 col-md-12">
              <div className="about-content">
                <div className="section-title text-left">
                  <span className="sub-title">About Our Teaching Platform</span>
                  <h2>We are a Dynamic Team of Educators</h2>
                  <p>
                    Welcome to our teaching platform!
                  </p>
                </div>

                <div className="about-text">
                  <h4>Who We Are</h4>
                  <p>
                    We are passionate educators dedicated to providing quality education to students.
                    Our goal is to inspire and empower young minds to reach their full potential.
                  </p>
                </div>

                <div className="about-text">
                  <h4>Our History</h4>
                  <p>
                    Our journey began with a vision to transform education and make learning engaging and accessible for all students.
                    Over the years, we have honed our skills and methodologies to create a dynamic learning environment.
                  </p>
                </div>

                <div className="about-text">
                  <h4>Our Mission</h4>
                  <p>
                    Our mission is to foster a love for learning and nurture the intellectual, social, and emotional growth of our students.
                    We strive to provide innovative and personalized education that prepares students for success in the modern world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutArea;
