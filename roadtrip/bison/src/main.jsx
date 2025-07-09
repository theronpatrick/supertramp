import { render } from "preact";
import { HashRouter, Routes, Route } from "react-router-dom";
import { App } from "./App.jsx";
import { Menu } from "./Menu.jsx";
import "./index.css";

function Main() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/game" element={<App />} />
      </Routes>
    </HashRouter>
  );
}

render(<Main />, document.getElementById("app"));
