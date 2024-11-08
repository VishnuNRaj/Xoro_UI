import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoutes from "@/Routes/UserRouter";
import { Provider as StoreProvider } from "react-redux";
import store from "@/Store/Store";
import SocketProvider from "./SocketProvider";
import { Toaster } from "sonner";
import ProgressProvider from "./ProgressContext";
import OnlineProvider from "./OnlineProvider";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      defaultTheme={
        (localStorage.getItem("theme") as "dark" | "light") || "light"
      }
      storageKey="theme"
    >
      <Toaster duration={2000} richColors position="top-center" />
      <StoreProvider store={store}>
        <SocketProvider>
          <ProgressProvider>
            <div
              style={{
                scrollbarWidth: "none",
                WebkitOverflowScrolling: "touch",
              }}
              className="bg-surface w-full h-screen p-0 m-0 overflow-y-scroll dark:bg-darken"
            >
              <Router>
                <OnlineProvider>
                  <Routes>
                    <Route path="/*" element={<UserRoutes />} />
                  </Routes>
                  {children}
                </OnlineProvider>
              </Router>
            </div>
          </ProgressProvider>
        </SocketProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
