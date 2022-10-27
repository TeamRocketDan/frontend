import { atom } from "recoil"

export const isUserLoggedIn = atom({
  key: "isUserLoggedIn",
  default: false,
})
