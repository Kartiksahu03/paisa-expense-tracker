import api from "../../services/axios.js";

export const transactionApi = {
  list: (month) =>
    api.get("/transactions", { params: month ? { month } : {} }).then((r) => r.data),
  summary: (month) =>
    api.get("/transactions/summary", { params: month ? { month } : {} }).then((r) => r.data),
  add: (data) => api.post("/transactions", data).then((r) => r.data),
  remove: (id) => api.delete(`/transactions/${id}`).then((r) => r.data),
};
