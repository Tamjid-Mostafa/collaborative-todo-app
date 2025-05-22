import { create } from "zustand"
import { persist } from "zustand/middleware"

type User = {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  role: string
}

type UserStore = {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", // key in localStorage
    }
  )
)
