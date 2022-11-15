import { useState } from "react"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Container from "../Layout/Container"
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
      <Container className="container mx-auto">
        <div className="flex items-center">
          {/* 로고 */}
          <Logo />

          {/* 지역 검색 */}
          <SearchForm />

          {/* 메뉴 버튼 */}
          <div
            className="header-menu ml-auto cursor-pointer p-2 relative"
            onClick={() => setModalOpen(!modalOpen)}
          >
            <FontAwesomeIcon icon={faBars} className="text-2xl text-rose-500" />

            {/* 메뉴 모달 */}
            {modalOpen && (
              <HeaderMenu modalOpen={modalOpen} setModalOpen={setModalOpen} />
            )}
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header
