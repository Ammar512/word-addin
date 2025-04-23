import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/global.css"; // Import global styles

const container = document.getElementById("container");
const root = createRoot(container!);
root.render(<App />);

Office.onReady(() => { console.log("Office.js is ready."); });
