import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"

import { isUserLoggedIn } from "../recoil/userAuth"

export function useCheckLogin() {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isUserLoggedIn)
  const navigate = useNavigate()
  useEffect(() => {
    if (!isLoggedIn) {
      window.alert("먼저 로그인 해주세요!")
      navigate("/login", { replace: true })
    }
  }, [])
}
