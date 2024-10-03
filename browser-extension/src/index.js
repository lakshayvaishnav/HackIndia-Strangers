import React from "react";
import ReactDOM from "react-dom";
import WalletApp from "./App";
import "./index.css";

// root container
const rootElement = document.createElement("div");
rootElement.id = "react-root";
document.body.appendChild(rootElement);

// added scripts
const script = document.createElement("script");
script.src = chrome.runtime.getURL("pageScript.js");

// removing the script after loading from dom
script.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(script);

ReactDOM.render(<WalletApp />, rootElement);
