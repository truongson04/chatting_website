import axios from "axios";
const clientApi = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});
export default clientApi;
