import CopyToClipboard from "react-copy-to-clipboard";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

interface CopyBtnProps {
  text: string;
}

export const CopyBtn = ({ text }: CopyBtnProps) => {
  return (
    <CopyToClipboard
      text={text}
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
  );
};
