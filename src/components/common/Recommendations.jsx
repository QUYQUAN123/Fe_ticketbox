import React, { useEffect, useState } from "react";
import { request } from "../../utils/api/request";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { Box, Typography, Card, CardContent, CardMedia, Chip } from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import "./recommendations.css"; // Add this import for custom navigation styles

const Recommendations = ({ typeEvent }) => {
  const [recommendations, setRecommendations] = useState([]);
  // Fisher-Yates shuffle algorithm for randomizing array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await request.get("/api/recommendations", {
          params: { typeEvent },
        });
        // Randomize recommendations order before setting state
        setRecommendations(shuffleArray(response.data.data));
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [typeEvent]);

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    } catch (error) {
      return dateString;
    }
  };

  if (!recommendations.length) return null;

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", padding: "24px", borderRadius: "8px", marginBottom: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#2DC275",
          position: "relative",
          "&:after": {
            content: '""',
            position: "absolute",
            bottom: "-10px",
            left: "50%",
            width: "50px",
            height: "3px",
            backgroundColor: "#2DC275",
            transform: "translateX(-50%)",
          },
        }}
      >
        Đề xuất sự kiện cho bạn
      </Typography>

      <Swiper
        slidesPerView={1}
        spaceBetween={24}
        loop={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        style={{ padding: "20px 10px 40px" }}
        className="recommendations-swiper"
      >
        {recommendations.map((event) => {
          const normalizedEvent = {
            ...event,
            name: event.eventName || event.name,
            image: event.eventImage || event.image,
            typeEvent: event.typeEvent || 1,
            startDate: event.timeStart,
            endDate: event.timeEnd
          };

          return (
            <SwiperSlide key={normalizedEvent._id}>
              <Link
                to={`/event/${normalizedEvent._id}-${normalizedEvent.typeEvent}`}
                style={{ textDecoration: "none" }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
                    },
                    borderRadius: "12px",
                    overflow: "hidden",
                    position: "relative",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={normalizedEvent.image || "/img/event.png"}
                      alt={normalizedEvent.name}
                      sx={{
                        objectFit: "cover",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
                        padding: "30px 16px 8px",
                      }}
                    >
                      {/* <Chip
                        label={normalizedEvent.typeEvent === 1 ? "Event" : "Sport"}
                        size="small"
                        sx={{
                          backgroundColor: "#2DC275",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                        }}
                      /> */}
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, padding: "16px", paddingTop: "12px" }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: "600",
                        fontSize: "1.1rem",
                        lineHeight: "1.3",
                        height: "2.6rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        color: "#1a1a1a",
                        mb: 1.5,
                      }}
                    >
                      {normalizedEvent.name}
                    </Typography>

                    {/* Date information with fixed height */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        height: "24px", // Fixed height to prevent layout shift
                        width: "100%"
                      }}
                    >
                      <EventIcon sx={{ color: "text.secondary", fontSize: "0.9rem", mr: 0.5, flexShrink: 0 }} />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "100%"
                        }}
                      >
                        {normalizedEvent.startDate ? formatDate(normalizedEvent.startDate) : "TBA"}
                        {normalizedEvent.endDate ? ` - ${formatDate(normalizedEvent.endDate)}` : ""}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        height: "3rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        marginBottom: "12px",
                        lineHeight: "1.15",
                      }}
                    >
                      {normalizedEvent.infoEvent || "No description available"}
                    </Typography>

                    {/* Category/Type chip */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#2DC275",
                          fontWeight: "medium",
                          fontSize: "0.8rem",
                        }}
                      >
                        Xem chi tiết
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
};

export default Recommendations;
