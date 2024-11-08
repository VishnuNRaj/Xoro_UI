import { OnlineContext } from "@/Context/OnlineProvider";
import { useContext } from "react";

export default function useOnline() {
  const context = useContext(OnlineContext);
  if (!context) {
    throw new Error("useOnline must be used within an OnlineProvider");
  }
  return context;
}
