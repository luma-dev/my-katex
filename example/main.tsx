import React from "react";
import ReactDOM from "react-dom/client";
import { renderKatex } from "../src/main.js";
import { toReactStyle } from "../src/react.js";

const examples = [
  String.raw`
    \begin{matrix*}[l]
      \begin{pmatrix}
        a\\
      \end{pmatrix}
      \\
      \kern{0.2em}\href{a}{a}
    \end{matrix*}
  `,
];

const Render: React.FC<{ value: string }> = ({ value }) => {
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
  return <div>{k}</div>;
};

const App = () => {
  const [value, setValue] = React.useState("x^2 + 2x + 1 = 0");
  return (
    <div>
      <h1>@luma-dev/my-katex Example</h1>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ width: "100%", height: "100px" }}
      />
      <Render value={value} />
      <h2>Examples</h2>
      {examples.map((value, i) => (
        <div key={i}>
          <h3>Example {i + 1}</h3>
          <Render value={value} />
        </div>
      ))}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
