import { useEffect, useRef, useState } from "react";
import { Heading } from "./components/Heading";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Copy } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "./hooks/use-toast";

const App = () => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (joined) {
      ws.current = new WebSocket("ws://localhost:8080");

      ws.current.onopen = () => {
        ws.current?.send(JSON.stringify({ type: "join", roomId, userName }));
      };
    }
  });

  const generateRoomId = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";

    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setRoomId(result);
  };

  const joinRoom = () => {
    if (roomId && userName) {
      setJoined(true);
    }
  };

  return (
    <>
      <div className="bg-[#0A0A0A] h-screen w-full flex items-center justify-center">
        {!joined ? (
          <div className="w-1/3 space-y-6 border border-slate-500 m-4 p-6 rounded-lg bg-[#1f2937] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
            <Heading />
            <Button
              variant={"default"}
              className="bg-gray-200 text-black p-6 w-full font-jetbrains text-xl "
              onClick={generateRoomId}
            >
              Create New Room
            </Button>
            <form className="flex flex-col gap-5">
              <div className="relative w-full flex flex-row">
                <Input
                  type="text"
                  placeholder="Enter your Room Id"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="font-jetbrains h-12 text-lg text-white"
                />
                {roomId && (
                  <CopyToClipboard
                    text={roomId}
                    onCopy={() => {
                      toast({
                        title: "Copied to clipboard!",
                      });
                    }}
                  >
                    <Button
                      className="bg-gray-200 absolute m-1.5 right-1 cursor-pointer"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Copy size={"2rem"} className="text-black" />
                    </Button>
                  </CopyToClipboard>
                )}
              </div>
              <div className="flex flex-row gap-2">
                <Input
                  type="text"
                  placeholder="Enter your Name"
                  className="font-jetbrains h-12 text-lg text-white"
                  onChange={(e) => setUserName(e.target.value)}
                />
                <Button
                  className="font-jetbrains bg-gray-200 text-black px-8 py-2 h-12 text-lg"
                  onClick={joinRoom}
                >
                  Join Room
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-blue-100">Joined</div>
        )}
      </div>
    </>
  );
};

export default App;
