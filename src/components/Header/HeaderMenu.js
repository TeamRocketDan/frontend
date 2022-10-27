import { Link } from "react-router-dom"

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
  // 로그인 상태 확인
  let userValid = false
  if (localStorage.getItem("token") !== null) userValid = true
  console.log(localStorage.getItem("token"))

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
            <Link to="/" className={menuStyle}>
              로그아웃
            </Link>
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
