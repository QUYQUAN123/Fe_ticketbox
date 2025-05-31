import { request } from "./request";

export const getTicketStats = async () =>
  await request.get("/api/event/ticket-stats");

export const getEventTicketDetail = async (id) =>
  await request.get("/api/event/ticket-stats/" + id);
