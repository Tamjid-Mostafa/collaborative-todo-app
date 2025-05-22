import { create } from "zustand"

type User = {
  _id: string
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

export const useUser = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
