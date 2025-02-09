import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";
import TypeWriterCom from "./TypeWriterCom";

const Banner = () => {
  const [toggler, setToggler] = useState(false);

  useEffect(() => {
    setToggler(true);
  }, []);

  return (
    <>
      <div className="it-banner" style={{backgroundColor:"#f9f9f9"}}>
        <div className="d-table">
          <div className="d-table-cell">
            <div className="container mt-50">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="banner-content">
                    <h1
                      data-aos="fade-up"
                      data-aos-duration="800"
                      data-aos-delay="100"
                      className="animated-text"
                      style={{textSize:"10px"}}
                    >
                      Empowering Young Minds 
                    </h1>
                    <p
                      data-aos="fade-up"
                      data-aos-duration="800"
                      data-aos-delay="200"
                    >
                      Join our platform where we, as experienced educators, guide and inspire students on their journey of discovery. Parents can book courses and mock tests to help their children succeed on their journey to academic success.
                    </p>

                    <div
                      className="banner-btn"
                      data-aos="fade-up"
                      data-aos-duration="800"
                      data-aos-delay="300"
                    >
                      <Link href="/course" className="default-btn-course mr-3">
                        11+ COURSES <span></span>
                      </Link>
                      <Link
                        href="/mockTest"
                        className="default-btn-mocktest mr-3"
                      >
                        11+ MOCK TESTS
                        <span></span>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 swiper-container">
                  <Swiper
                    navigation={true}
                    modules={[Autoplay, Navigation]}
                    autoplay={{
                      delay: 6500,
                      disableOnInteraction: true,
                      pauseOnMouseEnter: true,
                    }}
                    className="it-banner-image"
                  >
                    <SwiperSlide>
                      <div className="animate-image">
                        <Image
                          src="https://res.cloudinary.com/qualifier/image/upload/v1725734488/LearnPivot/animate-img_lca0b4.png"
                          alt="animate image 1"
                          width={650}
                          height={650}
                          priority
                          quality={75}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </SwiperSlide>

                    <SwiperSlide>
                      <div className="animate-image">
                        <Image
                          src="https://res.cloudinary.com/qualifier/image/upload/v1725734488/LearnPivot/animate-img2_n11uku.jpg"
                          alt="animate image 2"
                          width={650}
                          height={650}
                          priority
                          quality={75}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Mobile styles */
        @media (max-width: 768px) {
          .banner-btn a {
            display: block;
            margin-bottom: 15px;
          }
          .it-banner {
            background-color: #f9f9f9;
          }
          .banner-btn a:last-child {
            margin-bottom: 0;
          }

          /* Hide the swiper container on mobile */
          .swiper-container {
            display: none !important;
          }
        }

        /* Desktop styles */
        @media (min-width: 769px) {
          .swiper-container {
            display: block;
          }
        }
      `}</style>
    </>
  );
};

export default Banner;