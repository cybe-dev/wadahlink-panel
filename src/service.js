import axios from "axios";
import { baseURL } from "./config";

const service = axios.create({ baseURL });

export default service;
