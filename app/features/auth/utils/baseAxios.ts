import axios from "axios";
import { API_CONFIG } from "../../../common/config/constants";

const instance = axios.create({
  baseURL: API_CONFIG.FULL_URL,
  timeout: 5000,
});

export default instance;
