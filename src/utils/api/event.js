import { request } from "./request";

export const create = async (payload) =>
  await request.post("/api/event", payload);

export const update = async (id, payload) =>
  await request.put("/api/event/" + id, payload);

export const removeEvent = async (id) =>
  await request.delete("/api/event/" + id);

export const getListEvent = async (query) =>
  await request.get(
    "/api/event/search?" + new URLSearchParams(query).toString()
  );

export const getListEventById = async (id) =>
  await request.get("/api/event/" + id);

export const getListEventByUserId = async (id) =>
  await request.get("/api/event/user/" + id);

export const myEvent = async (id) =>
  await request.get("/api/event/my-event/" + id);

export const listApproveEvent = async () =>
  await request.get("/api/event/approve-event");

export const approveEvent = async (id) =>
  await request.put("/api/event/approve-event/" + id);
