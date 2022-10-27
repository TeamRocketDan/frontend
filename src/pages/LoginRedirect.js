import { useNavigate, useSearchParams } from "react-router-dom"
import Container from "../components/Layout/Container"

function LoginRedirect() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  console.log(searchParams.get("error"))

  const token = searchParams.get("token")
  console.log(token)

  // token 저장
  localStorage.setItem("token", token)

  setTimeout(() => {
    navigate("/", { replace: true })
  }, 3000)

  return (
    <Container>
      <h2>로그인 완료? 페이지 이동중</h2>
    </Container>
  )
}

export default LoginRedirect
