import { useState } from "preact/hooks";

export function App() {
  const [count, setCount] = useState(0);

  console.log("version 25.7.8k");

  return (
    <div className="app">
      <header className="app-header">
        <h1>🦬 Bison </h1>
        <p>Welcome to the Bison section of theron.dev</p>
        <p>v 25.7.8k</p>
        <button
          className="counter-btn"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
        <p className="read-the-docs">
          Ready to build something awesome with Preact!
        </p>
      </header>
    </div>
  );
}
