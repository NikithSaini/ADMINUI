import React from "react";
import ReactDOM from "react-dom/client";
import "./global-styles.css";
import ReactApp from "./ReactApp";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ReactApp />
  </React.StrictMode>
);

reportWebVitals();
