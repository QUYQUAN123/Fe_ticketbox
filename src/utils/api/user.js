import { request } from "./request";

export const login = async (payload) =>
  await request.post("/api/user/login", payload);

export const create = async (payload) =>
  await request.post("/api/user", payload);

export const update = async (id, payload) =>
  await request.put("/api/user/" + id, payload);

export const list = async () => await request.get("/api/user");

export const getListTeacher = async () =>
  await request.get("/api/user/get-list-teacher");

export const getListTeacherReview = async (id) =>
  await request.get("/api/user/list-teacher-review/" + id);

export const deleteUser = async (id) => await request.delete("/api/user/" + id);

export const findUser = async (id) => await request.get("/api/user/" + id);

// API cho đăng ký Organizer
export const registerOrganizer = async (payload) =>
  await request.post("/api/user/register-organizer", payload);

export const verifyOTP = async (payload) =>
  await request.post("/api/user/verify-otp", payload);

export const resendOTP = async (payload) =>
  await request.post("/api/user/resend-otp", payload);
