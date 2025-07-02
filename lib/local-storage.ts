export const LocalStorage = {
  getSidebarState: (): boolean => {
    if (typeof window === "undefined") return false
    const state = localStorage.getItem("sidebar-collapsed")
    return state ? JSON.parse(state) : false
  },

  setSidebarState: (collapsed: boolean): void => {
    if (typeof window === "undefined") return
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed))
  },

  getTheme: (): "light" | "dark" => {
    if (typeof window === "undefined") return "light"
    const theme = localStorage.getItem("theme")
    return (theme as "light" | "dark") || "light"
  },

  setTheme: (theme: "light" | "dark"): void => {
    if (typeof window === "undefined") return
    localStorage.setItem("theme", theme)
  },

  getLastProject: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("last-project")
  },

  setLastProject: (projectId: string): void => {
    if (typeof window === "undefined") return
    localStorage.setItem("last-project", projectId)
  },
}
