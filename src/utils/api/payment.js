import { request } from "./request";

export const list = async () => await request.get("/api/payment");

export const create = async (payload) =>
  await request.post("/api/payment", payload);

export const getByUserId = async (id) =>
  await request.get("/api/payment/user/" + id);

export const getByEventId = async (payload) =>
  await request.post("/api/payment/event/", payload);

export const numberTicketSell = async (payload) =>
  await request.post("/api/payment/count-ticket-sell/", payload);

// VNPay API methods
export const createVnPayUrl = async (payload) =>
  await request.post("/api/payment/create-vnpay-url", payload);

export const checkVnPayStatus = async (paymentId) =>
  await request.get(`/api/payment/check-vnpay-status/${paymentId}`);

// Cancel a pending payment
export const cancelPendingPayment = async (paymentId) =>
  await request.post(`/api/payment/cancel-payment/${paymentId}`);
