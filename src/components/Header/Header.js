import { useState } from "react"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import HeaderMenu from "./HeaderMenu"
import Logo from "./Logo"
import SearchForm from "../Search/SearchForm"
import { useLocation } from "react-router-dom"

function Header() {
  const [modalOpen, setModalOpen] = useState(false)

  const location = useLocation()
  if (location.pathname.indexOf("/chatroom") >= 0) return null

  return (
    <header className="border-b z-20 relative">
      <div className="container mx-auto">
        <div className="flex items-center">
          {/* 로고 */}
          <Logo />

          {/* 지역 검색 */}
          <SearchForm />

          {/* 메뉴 버튼 */}
          <div
            className="ml-auto cursor-pointer p-2 relative"
            onClick={() => setModalOpen(!modalOpen)}
          >
            <FontAwesomeIcon icon={faBars} className="text-2xl text-rose-500" />

            {/* 메뉴 모달 */}
            <HeaderMenu modalOpen={modalOpen} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
