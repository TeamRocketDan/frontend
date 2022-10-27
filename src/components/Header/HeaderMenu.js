import { Link, useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import axios from "axios"

import { isUserLoggedIn } from "../../recoil/userAuth"
import { DEFAULT_API } from "../../apis"

// 메뉴 리스트
const menuList = [
  { title: "회원 상세", path: "/mypage" },
  { title: "채팅 목록", path: "/chatlist" },
  { title: "피드 생성", path: "/createfeed" },
  { title: "문의하기", path: "/qna" },
]

// 링크 메뉴 스타일 클래스
const menuStyle =
  "flex w-full justify-center items-center py-2 border-l-4 border-white hover:text-rose-400 hover:border-l-4 hover:border-rose-400"

function HeaderMenu({ modalOpen }) {
  const navigate = useNavigate()

  // 로그인 상태 확인
  const [userValid, setUserValid] = useRecoilState(isUserLoggedIn)

  // 로그아웃
  function handleLogout(event) {
    event.preventDefault()
    const token = localStorage.getItem("token")

    axios
      .post(
        `${DEFAULT_API}/api/v1/auth/logout`,
        {},
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        },
      )
      .then(function (response) {
        console.log(response.data)
        if (response.data.success) {
          localStorage.removeItem("token")
          setUserValid(false)
          navigate("/", { replace: true })
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }


  return (
    <div className={`absolute right-0 ${modalOpen ? "" : "hidden"}`}>
      <ul className="w-40 bg-white shadow-lg overflow-hidden">
        {menuList.map((menu) => (
          <li key={menu.path}>
            <Link to={menu.path} className={menuStyle}>
              {menu.title}
            </Link>
          </li>
        ))}

        {userValid ? (
          <li>
            <button className={menuStyle} onClick={handleLogout}>
              로그아웃
            </button>
          </li>
        ) : (
          <li>
            <Link to="/login" className={menuStyle}>
              로그인
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default HeaderMenu
