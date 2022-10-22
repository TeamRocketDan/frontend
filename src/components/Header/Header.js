import { useState } from "react"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import HeaderMenu from "./HeaderMenu"

function Header() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="container mx-auto">
        <div className="flex items-center">
          {/* 로고 */}
          <h1>
            Logo
            <span className="visuallyhidden">로켓단의 한국정복</span>
          </h1>

          {/* 메뉴 버튼 */}
          <div
            className="ml-auto cursor-pointer p-2 relative"
            onClick={() => setModalOpen(!modalOpen)}
          >
            <FontAwesomeIcon icon={faBars} />

            {/* 메뉴 모달 */}
            {modalOpen ? <HeaderMenu /> : ""}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
