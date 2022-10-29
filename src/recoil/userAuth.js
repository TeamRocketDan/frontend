import { atom } from "recoil"
import { recoilPersist } from "recoil-persist"

const { persistAtom } = recoilPersist()

export const isUserLoggedIn = atom({
  key: "isUserLoggedIn",
  default: false,
  effects_UNSTABLE: [persistAtom],
})

export const currentUserName = atom({
  key: "currentUserName",
  default: "",
  effects_UNSTABLE: [persistAtom],
})

export const currentUserProf = atom({
  key: "currentUserProf",
  default: "",
  effects_UNSTABLE: [persistAtom],
})
