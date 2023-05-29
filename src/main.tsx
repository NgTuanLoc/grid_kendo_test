import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@progress/kendo-theme-default/dist/all.css";
import "./index.css";
import { BulkUserGridProvider } from "./context.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <BulkUserGridProvider>
            <App />
        </BulkUserGridProvider>
    </React.StrictMode>
);
