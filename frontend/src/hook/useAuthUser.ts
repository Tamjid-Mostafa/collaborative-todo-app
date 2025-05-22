import { useUserStore } from "@/lib/stores/user"
import { useEffect } from "react"

export const useAuthUser = () => {
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const clearUser = useUserStore((state) => state.clearUser)

  // Optional: sync or update based on token later
  useEffect(() => {
    const stored = localStorage.getItem("user-storage")
    if (stored && !user) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed?.state?.user) setUser(parsed.state.user)
      } catch (e) {
        console.error("Failed to load user from localStorage", e)
      }
    }
  }, [user, setUser])

  return { user, setUser, clearUser }
}
