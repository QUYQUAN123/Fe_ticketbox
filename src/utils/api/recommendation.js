import { request } from "./request";

/**
 * Get personalized recommendations for a user
 * @param {string} userId - The ID of the user to get recommendations for
 * @returns {Promise} - Response containing recommended events
 */
export const getPersonalizedRecommendations = async (userId) =>
  await request.get(`/api/recommendations/user/${userId}`);

/**
 * Get similar events to a specific event
 * @param {string} eventId - The ID of the event to find similar events for
 * @param {number} limit - The maximum number of recommendations to return
 * @returns {Promise} - Response containing similar events
 */
export const getSimilarEvents = async (eventId, limit = 5) =>
  await request.get(`/api/recommendations/similar/${eventId}?limit=${limit}`);

/**
 * Get trending events based on ticket sales
 * @param {number} limit - The maximum number of trending events to return
 * @returns {Promise} - Response containing trending events
 */
export const getTrendingEvents = async (limit = 5) =>
  await request.get(`/api/recommendations/trending?limit=${limit}`);

/**
 * Update user preferences based on user activity
 * @param {object} data - Object containing userId, eventId, and action
 * @returns {Promise} - Response indicating success or failure
 */
export const updateUserPreferences = async (data) =>
  await request.post("/api/recommendations/preferences", data);

/**
 * Get user preferences
 * @param {string} userId - The ID of the user to get preferences for
 * @returns {Promise} - Response containing user preferences
 */
export const getUserPreferences = async (userId) =>
  await request.get(`/api/recommendations/preferences/${userId}`);
