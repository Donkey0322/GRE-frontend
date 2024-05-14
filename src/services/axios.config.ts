import axios from "axios";

const instance = axios.create({
  baseURL: String(import.meta.env.VITE_API_ENDPOINT),
});

export default instance;
