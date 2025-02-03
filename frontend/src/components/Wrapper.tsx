import React from "react";

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-1/3 space-y-6 border border-slate-500 m-4 p-6 rounded-lg bg-[#1f2937] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
      {children}
    </div>
  );
};
