import { User } from "@/Store/UserStore/Authentication/Interfaces";
import React, { createContext, useState, ReactNode } from "react";

interface OnlineContextType {
  online: User[];
  setOnline: React.Dispatch<React.SetStateAction<User[]>>;
}

export const OnlineContext = createContext<OnlineContextType | undefined>(
  undefined
);

export default function OnlineProvider({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState<User[]>([]);

  return (
    <OnlineContext.Provider value={{ online, setOnline }}>
      {children}
    </OnlineContext.Provider>
  );
}
