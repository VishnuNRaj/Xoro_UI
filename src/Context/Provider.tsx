import { ReactNode } from "react"
import { ThemeProvider } from "./ThemeProvider"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import UserRoutes from "@/Routes/UserRouter"
import { Provider as StoreProvider } from "react-redux"
import store from "@/Store/Store"

function Provider({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider defaultTheme={localStorage.getItem("theme") as "dark" | "light" || "system"} storageKey="theme">
            <StoreProvider store={store}>
                <div style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }} className="bg-surface w-full h-screen p-0 m-0 overflow-y-scroll dark:bg-darken">
                    <Router>
                        <Routes>
                            <Route path="/*" element={<UserRoutes />} />
                        </Routes>
                        {children}
                    </Router>
                </div>
            </StoreProvider>
        </ThemeProvider>
    )
}

export default Provider
