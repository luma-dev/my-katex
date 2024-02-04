import React from "react";
import ReactDOM from "react-dom/client";
import { renderKatex } from "../src/main.js";
import { toReactStyle } from "../src/react.js";

const App = () => {
  const [value, setValue] = React.useState("x^2 + 2x + 1 = 0");
  const k = renderKatex<React.ReactNode>(
    value,
    (props) => {
      const asReact = toReactStyle(props);
      switch (asReact.type) {
        case "text":
          return asReact.rendered;
        case "root":
          return asReact.rendered;
        case "element": {
          const { Tag, props, renderedChildren } = asReact;
          return <Tag {...props}>{renderedChildren}</Tag>;
        }
      }
    },
    {
      throwOnError: false,
      trust: true,
      displayMode: true,
    },
  );
  return (
    <div>
      <h1>@luma-dev/my-katex Example</h1>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ width: "100%", height: "100px" }}
      />
      <div>{k}</div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
