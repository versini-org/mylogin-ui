import "./index.css";
import "@versini/ui-components/dist/style.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./modules/App/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
