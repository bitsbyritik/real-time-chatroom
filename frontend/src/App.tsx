import { useEffect, useRef, useState } from "react";
import { Heading } from "./components/Heading";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Wrapper } from "./components/Wrapper";
import { CopyBtn } from "./components/CopyBtn";
import { toast } from "./hooks/use-toast";

interface Message {
  text: string;
  sender: string;
}

const App = () => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomSize, setRoomSize] = useState(0);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (joined) {
      ws.current = new WebSocket("ws://localhost:8080");

      ws.current.onopen = () => {
        ws.current?.send(JSON.stringify({ type: "join", roomId, userName }));
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "notification") {
          toast({
            title: data.text,
          });
          setRoomSize(data.size);
        }

        if (data.type === "message") {
          setMessages((prevMessage) => [
            ...prevMessage,
            { text: data.text, sender: data.sender },
          ]);
        }
      };

      ws.current.onclose = () => {
        toast({
          title: "Connection disconnected!",
        });
      };

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [joined, roomId, userName]);

  const generateRoomId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
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

  const sendMessage = () => {
    if (ws.current && inputValue) {
      ws.current.send(
        JSON.stringify({ type: "message", roomId: roomId, text: inputValue }),
      );

      setMessages((prevMessage) => [
        ...prevMessage,
        { text: inputValue, sender: "me" },
      ]);

      setInputValue("");
    }
  };

  return (
    <>
      <div className="bg-[#0A0A0A] h-screen w-full flex items-center justify-center">
        {!joined ? (
          <Wrapper>
            <Heading />
            <Button
              variant={"default"}
              className="bg-gray-200  text-black p-6 w-full font-jetbrains text-xl "
              onClick={generateRoomId}
            >
              Create New Room
            </Button>
            <form className="flex flex-col gap-5 mt-8">
              <div className="relative w-full flex flex-row">
                <Input
                  type="text"
                  placeholder="Enter your Room Id"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="font-jetbrains h-12 text-lg text-white"
                />
                {roomId && <CopyBtn text={roomId} />}
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
          </Wrapper>
        ) : (
          <Wrapper>
            <Heading />
            <div className="font-jetbrains text-gray-200 bg-gray-700 py-2 px-4 rounded-lg flex justify-between">
              <div>
                Room Id: <span>{roomId}</span>
              </div>
              <div>
                Users: <span>{roomSize}</span>
              </div>
            </div>
            <div className="font-jetbrains border border-gray-500 rounded-lg h-96 overflow-x-hidden overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`m-2 max-w-60 w-fit p-2 flex flex-col rounded-lg text-gray-200 bg-gray-700 break-words whitespace-normal ${msg.sender === "me" ? "ml-auto bg-gray-700" : "mr-auto bg-blue-900"} `}
                >
                  {msg.sender !== "me" ? (
                    <span className="text-red-400">~ {msg.sender}</span>
                  ) : (
                    ""
                  )}
                  <span className="whitespace-normal w">{msg.text}</span>
                </div>
              ))}
            </div>
            <div className="font-jetbrains flex gap-x-2">
              <Input
                placeholder={"Enter your message here"}
                className="text-gray-200 py-2 text-sm"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button
                className="bg-gray-200 text-black px-6 text-sm"
                onClick={sendMessage}
                disabled={!inputValue}
              >
                Send
              </Button>
            </div>
          </Wrapper>
        )}
      </div>
    </>
  );
};

export default App;
