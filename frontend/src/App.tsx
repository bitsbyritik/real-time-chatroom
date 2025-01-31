import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);
  }, []);

  return (
    <>
      <div className="">Hello World!</div>
    </>
  );
}

export default App;
