import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Container from "../components/Layout/Container"
import { useRecoilState } from "recoil"
import axios from "axios"

import { DEFAULT_API } from "../apis"

import { isUserLoggedIn, currentUserName } from "../recoil/userAuth"

import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function LoginRedirect() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [message, setMessage] = useState("")
  const [userValid, setUserValid] = useRecoilState(isUserLoggedIn)
  const [userName, setUserName] = useRecoilState(currentUserName)

  console.log("{{LOGIN ERROR}} " + searchParams.get("error"))

  const token = "Bearer " + searchParams.get("token")

  // token 저장
  localStorage.setItem("token", token)

  useEffect(() => {
    // 메세지
    setMessage(`${token === null ? "실패" : "성공"}`)

    // 유저 로그인 여부 상태 저장
    if (token !== null) {
      setUserValid(true)
    } else {
      setUserValid(false)
    }

    // 페이지 이동
    setTimeout(() => {
      navigate("/", { replace: true })
    }, 1500)

    // 유저 이름 저장
    axios
      .get(`${DEFAULT_API}/api/v1/users/mypage`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setUserName(
          response.data.result.nickname === ""
            ? response.data.result.username
            : response.data.result.nickname,
        )
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [])

  return (
    <Container>
      <h2 className="text-rose-400 font-bold text-2xl text-center pt-2">
        로그인 {message}! 페이지 이동중
        <FontAwesomeIcon
          icon={faSpinner}
          className="ml-1 text-2xl text-rose-500 fa-spin"
        />
      </h2>
    </Container>
  )
}

export default LoginRedirect
