import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import axios from "axios"

import {
  isUserLoggedIn,
  currentUserName,
  currentUserProf,
  currentUserId,
} from "../../recoil/userAuth"
import { DEFAULT_API } from "../../apis"
import { getUserToken } from "../../utils/getUserToken"

// 메뉴 리스트
const menuList = [
  { title: "회원 상세", path: "/mypage", requireLogin: true },
  { title: "피드 목록", path: "/", requireLogin: false },
  { title: "내 피드 목록", path: "/myfeedlist", requireLogin: true },
  { title: "피드 생성", path: "/createfeed", requireLogin: true },
  { title: "채팅 목록", path: "/chatlist", requireLogin: false },
  // { title: "문의하기", path: "/qna" },
]

// 링크 메뉴 스타일 클래스
const menuStyle =
  "flex w-full justify-center items-center py-2 border-l-4 border-white hover:text-rose-400 hover:border-l-4 hover:border-rose-400"

function HeaderMenu({ modalOpen, setModalOpen }) {
  const navigate = useNavigate()

  // 로그인 상태 확인
  const [userValid, setUserValid] = useRecoilState(isUserLoggedIn)
  const [userName, setUserName] = useRecoilState(currentUserName)
  const [userProf, setUserProf] = useRecoilState(currentUserProf)
  const [userId, setUserId] = useRecoilState(currentUserId)

  // 로그아웃
  async function handleLogout(event) {
    event.preventDefault()
    const token = await getUserToken()
    try {
      const response = await axios.post(
        `${DEFAULT_API}/api/v1/auth/logout`,
        {},
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        },
      )
      console.log(response.data)
      if (response.data.success) {
        localStorage.removeItem("token")
        setUserValid(false)
        setUserName(null)
        setUserProf(null)
        setUserId(null)
        navigate("/", { replace: true })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCloseModal = ({ target }) => {
    if (!target.closest(".header-menu")) {
      setModalOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener("click", handleCloseModal)
    return () => {
      window.removeEventListener("click", handleCloseModal)
    }
  }, [])

  return (
    <div className={`absolute right-0`}>
      <ul className="w-40 bg-white shadow-lg overflow-hidden">
        {menuList.map(
          (menu) =>
            (userValid || !menu.requireLogin) && (
              <li key={menu.path}>
                <Link to={menu.path} className={menuStyle}>
                  {menu.title}
                </Link>
              </li>
            ),
        )}

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
