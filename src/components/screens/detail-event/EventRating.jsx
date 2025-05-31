import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Rating,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Grid,
  Alert,
  Snackbar,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { createRating, getEventRatings } from "../../../utils/api/rating";
import moment from "moment";
import "moment/locale/vi";
import { getByUserId } from "../../../utils/api/payment";

function EventRating({ event }) {
  const [user, setUser] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [canRate, setCanRate] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [listPayment, setListPayment] = useState([]);

  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    if (event && event.timeEnd) {
      const currentDate = new Date();
      const eventEndDate = new Date(event.timeEnd);
      setCanRate(currentDate > eventEndDate);
    }
  }, [event]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    if (userData) {
      userData._id && LisData();
    }

    if (event && event._id) {
      fetchRatings();
    }
  }, [event]);
  useEffect(() => {
    if (listPayment.length > 0 && event?._id) {
      const isPurchased = listPayment.some(
        (payment) => payment.event?._id === event._id
      );
      setHasPurchased(isPurchased);
    }
  }, [listPayment, event]);

  const LisData = async () => {
    try {
      const res = await getByUserId(user?._id);
      setListPayment(res.data?.map((i) => ({ id: i._id, ...i })));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    user?._id && LisData();
  }, [user]);

  useEffect(() => {
    if (user && ratings.length > 0) {
      const userRating = ratings.find((rating) => rating.user._id === user._id);
      if (userRating) {
        setHasRated(true);
        setUserRating(userRating.rating);
        setComment(userRating.comment || "");
      } else {
        setHasRated(false);
      }
    }
  }, [user, ratings]);
  const fetchRatings = async () => {
    try {
      const res = await getEventRatings(event._id);
      if (res.data) {
        // Filter out ratings with deleted users (where user is null or undefined)
        const validRatings = res.data.data.filter(
          (rating) => rating.user != null
        );
        setRatings(validRatings);

        // Recalculate average rating based on valid ratings only
        if (validRatings.length > 0) {
          const totalRating = validRatings.reduce(
            (sum, rating) => sum + rating.rating,
            0
          );
          const avgRating = totalRating / validRatings.length;
          setAverageRating(avgRating);
        } else {
          setAverageRating(0);
        }
      }
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };
  const handleRatingSubmit = async () => {
    if (!user) {
      setSnackbarMessage("Vui lòng đăng nhập để đánh giá sự kiện");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }
    if (!hasPurchased) {
    setSnackbarMessage('Bạn cần mua vé sự kiện này để có thể đánh giá.');
    setSnackbarSeverity('warning');
    setOpenSnackbar(true);
    return;
  }

    if (userRating === 0) {
      setSnackbarMessage("Vui lòng chọn số sao để đánh giá");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    try {
      setIsSubmitting(true);

      await createRating({
        eventId: event._id,
        userId: user._id,
        rating: userRating,
        comment: comment.trim() || null,
      });

      setSnackbarMessage("Đã gửi đánh giá thành công");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Refresh ratings
      fetchRatings();
      setComment("");
    } catch (err) {
      console.error("Error submitting rating:", err);

      setSnackbarMessage(
        err.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  return (
    <Box mt={8} id="ratings">
      <Paper>
        <Box p={2}>
          <Typography variant="h6">ĐÁNH GIÁ SỰ KIỆN</Typography>
          {averageRating > 0 && (
            <Box display="flex" alignItems="center" mt={1}>
              <Rating value={averageRating} precision={0.1} readOnly />
              <Typography variant="body1" ml={1} fontWeight="bold">
                {averageRating.toFixed(1)}/5
              </Typography>
              <Typography variant="body2" ml={1} color="text.secondary">
                ({ratings.length} đánh giá)
              </Typography>
            </Box>
          )}
        </Box>
        <Divider />

       {canRate ? (
          <Box p={2}>
            {!hasRated ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center">
                    <Typography mr={2}>Đánh giá sự kiện:</Typography>
                    <Rating
                      value={userRating}
                      onChange={(event, newValue) => {
                        setUserRating(newValue);
                      }}
                      emptyIcon={
                        <StarOutlineIcon
                          style={{ opacity: 0.55 }}
                          fontSize="inherit"
                        />
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nhận xét của bạn"
                    multiline
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn về sự kiện này..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRatingSubmit}
                    disabled={isSubmitting || userRating === 0}
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Alert severity="info">Bạn đã đánh giá sự kiện này</Alert>
            )}
          </Box>
        ) : (
          <Box p={2}>
            <Alert severity="info">
              Bạn chỉ có thể đánh giá sự kiện sau khi sự kiện kết thúc
            </Alert>
          </Box>
        )}

        <Divider />

        <Box p={2}>
          <Typography variant="h6" mb={2}>
            Nhận xét ({ratings.length})
          </Typography>
          {ratings.length > 0 ? (
            <List>
              {ratings.map((rating) => (
                <React.Fragment key={rating._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt={rating.user?.name || "User"}
                        src={rating.user?.image}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="subtitle1" fontWeight="bold">
                            {rating.user?.name || "Anonymous User"}
                          </Typography>{" "}
                          <Typography variant="body2" color="text.secondary">
                            {moment(rating.createdAt)
                              .locale("vi")
                              .format("DD/MM/YYYY HH:mm")}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Box mt={0.5} mb={1}>
                            <Rating
                              value={rating.rating}
                              size="small"
                              readOnly
                            />
                          </Box>
                          {rating.comment && (
                            <Typography variant="body2" color="text.primary">
                              {rating.comment}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              py={2}
            >
              Chưa có đánh giá nào cho sự kiện này
            </Typography>
          )}
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EventRating;
