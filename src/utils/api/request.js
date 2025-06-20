import axios from "axios";
let baseURL;

if (process.env.NODE_ENV === "production") {
  baseURL = "https://be-ticketbox-x7hu.onrender.com";
} else {
  baseURL = "https://be-ticketbox-x7hu.onrender.com";
}

export const request = axios.create({
  baseURL,
});
