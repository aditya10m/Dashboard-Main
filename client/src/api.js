import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getDevices = (params) =>
  API.get("/devices", { params });

export const getSummary = () =>
  API.get("/devices/summary");
