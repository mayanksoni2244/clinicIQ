import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Update if your backend runs on a different port
  withCredentials: true, // Optional: if you're using cookies or sessions
});

export default API;
