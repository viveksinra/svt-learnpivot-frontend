// ImageCarousel.jsx
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import FsLightbox from "fslightbox-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Box } from "@mui/material";

const ImageCarousel = ({ 
  images = [], 
  title = "", 
  height = "200px",
  autoplayDelay = 3000,
  showNavigation = true,
  showPagination = true,
  showAutoplay = true
}) => {
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1
  });

  // Function to handle image click and open lightbox
  const openLightboxOnSlide = (index) => {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: index + 1
    });
  };

  // Make sure images is always an array
  const safeImages = Array.isArray(images) ? images : [];

  return (
    <Box sx={{ 
      width: "100%", 
      position: "relative",
      "& .swiper": {
        width: "100%",
        height: height,
        borderRadius: "8px",
        overflow: "hidden",
      },
      "& .swiper-slide": {
        width: "100%",
        height: "100%",
        position: "relative",
      }
    }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={showNavigation}
        pagination={showPagination ? { clickable: true } : false}
        autoplay={showAutoplay ? {
          delay: autoplayDelay,
          disableOnInteraction: false,
        } : false}
      >
        {safeImages.map((url, index) => (
          <SwiperSlide key={index}>
            <Box
              component="img"
              src={url}
              alt={`${title} - Image ${index + 1}`}
              onClick={() => openLightboxOnSlide(index)}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                aspectRatio: "16/9",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <FsLightbox
        toggler={lightboxController.toggler}
        sources={safeImages}
        slide={lightboxController.slide}
        type="image"
        loadOnlyCurrentSource={true}
        slideDistance={0.3}
      />

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.3);
          width: 35px;
          height: 35px;
          border-radius: 50%;
          --swiper-navigation-size: 20px;
          transition: background-color 0.3s ease;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.5);
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 15px;
          font-weight: bold;
        }

        .swiper-pagination-bullet {
          background: white;
          opacity: 0.7;
        }

        .swiper-pagination-bullet-active {
          background: white;
          opacity: 1;
        }

        .fslightbox-container {
          background: rgba(0, 0, 0, 0.9);
        }

        .fslightbox-slide-btn {
          background: rgba(255, 255, 255, 0.1);
          padding: 12px;
          border-radius: 50%;
        }

        .fslightbox-slide-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </Box>
  );
};

export default ImageCarousel;