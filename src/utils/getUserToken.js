import axios from "axios"
import jwt_decode from "jwt-decode"

import { DEFAULT_API } from "../apis"

export const getUserToken = async () => {
  let token = localStorage.getItem("token")
  const decoded = jwt_decode(token.split("Bearer ")[1])

  if (decoded.exp * 1000 - Date.now() <= 300000) {
    try {
      const response = await axios.get(`${DEFAULT_API}/api/v1/auth/refresh`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
      token = "Bearer " + response.data.result.token
      localStorage.setItem("token", token)
      console.log("토큰 재발급 받음 " + token)
      return token
    } catch (error) {
      console.log(error)
    }
  } else {
    console.log("만료되지 않은 토큰 " + token)
    return token
  }
}
