import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { store } from "./app/store.js";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: "#1c2129", color: "#f2f4f7", border: "1px solid rgba(255,255,255,0.08)" },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
