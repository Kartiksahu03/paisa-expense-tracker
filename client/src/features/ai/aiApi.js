import api from "../../services/axios.js";

export const aiApi = {
  add: (text) => api.post("/ai/add", { text }).then((r) => r.data),
  insight: () => api.get("/ai/insight").then((r) => r.data),
  chat: (messages) => api.post("/ai/chat", { messages }).then((r) => r.data),
};
