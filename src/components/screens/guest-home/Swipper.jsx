import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { Box, styled } from "@mui/material";

const SwipperCustom = styled(Swiper)({
  paddingBottom: 24,
  "& .swiper-slide ": {
    textAlign: "center !important",
  },
  "& .swiper-button-prev": {
    width: 50,
    height: 50,
    borderRadius: "50%",
    border: "2px solid #C0ECD5",
    "&::after": {
      fontSize: 22,
      color: "#2DC275",
    },
  },

  "& .swiper-button-next": {
    width: 50,
    height: 50,
    borderRadius: "50%",
    border: "2px solid #C0ECD5",
    "&::after": {
      fontSize: 22,
      color: "#2DC275",
    },
  },

  "& .swiper-pagination": {
    bottom: 0,
  },

  "& .swiper-pagination-bullet": {
    height: "6px",
    width: "30px",
    borderRadius: "4px",
    background: "#2DC275",
  },
});

export default function Swipper() {
  return (
    <>
      <SwipperCustom
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <Box
            component={"img"}
            borderRadius={"8px"}
            src={"/img/swipper4.jpg"}
            width={"86%"}
            height={384}
            sx={{ objectFit: "cover", objectPosition: "center" }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Box
            component={"img"}
            borderRadius={"8px"}
            src={"/img/swipper5.jpg"}
            width={"86%"}
            height={384}
            sx={{ objectFit: "cover", objectPosition: "center" }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Box
            component={"img"}
            borderRadius={"8px"}
            width={"86%"}
            height={384}
            sx={{ objectFit: "cover", objectPosition: "center" }}
            src={"/img/swipper6.jpg"}
          />
        </SwiperSlide>
      </SwipperCustom>
    </>
  );
}
