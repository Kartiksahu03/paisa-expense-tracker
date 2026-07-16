import api from "../../services/axios.js";

export const budgetApi = {
  get: (month) =>
    api.get("/budget", { params: month ? { month } : {} }).then((r) => r.data),
  set: (data) => api.put("/budget", data).then((r) => r.data),
};
