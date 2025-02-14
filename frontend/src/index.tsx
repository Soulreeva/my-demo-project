import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";

const root = document.getElementById("root");
if (root) {
  const _root = ReactDOM.createRoot(root);
  _root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
