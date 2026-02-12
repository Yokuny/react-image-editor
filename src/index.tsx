import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import "./styles/main.scss";
import App from "./App";
import { StoreProvider } from "./helpers/storeProvider";
import rootStore from "./stores/rootStore";

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider value={rootStore}>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
