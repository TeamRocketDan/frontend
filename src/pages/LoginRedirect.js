import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Container from "../components/Layout/Container"

import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function LoginRedirect() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [message, setMessage] = useState("")

  console.log(searchParams.get("error"))

  const token = searchParams.get("token")
  console.log(token)

  // token 저장
  localStorage.setItem("token", token)

  useEffect(() => {
    // 메세지
    setMessage(`${token === null ? "실패" : "성공"}`)
    // 페이지 이동
    setTimeout(() => {
      navigate("/", { replace: true })
    }, 2000)
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
