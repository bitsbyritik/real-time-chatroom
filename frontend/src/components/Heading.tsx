import { MessageCircleCode } from "lucide-react";

export const Heading = () => {
  return (
    <div>
      <div className="font-jetbrains text-slate-100 font-semibold text-3xl flex gap-x-3">
        <span className="flex items-center ">
          <MessageCircleCode size={"2rem"} />
        </span>
        Real Time ChatRoom
      </div>
      <div className="text-md text-slate-400 mt-2">
        A temporary chat room that expires after all user exist.
      </div>
    </div>
  );
};
