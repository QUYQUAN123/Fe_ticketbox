import { request } from "./request";

export const createRating = async (payload) =>
  await request.post("/api/ratings", payload);

export const getEventRatings = async (eventId) =>
  await request.get(`/api/ratings/event/${eventId}`);

export const updateRating = async (ratingId, payload) =>
  await request.put(`/api/ratings/${ratingId}`, payload);

export const deleteRating = async (ratingId) =>
  await request.delete(`/api/ratings/${ratingId}`);
