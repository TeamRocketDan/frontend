import { useRef, useState } from "react"
import { useRecoilState } from "recoil"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import SearchModal from "./SearchModal"
import { selectedRegion01, selectedRegion02 } from "../../recoil/regionState"

function SearchForm() {
  const [searchModalOpen, setSearchModalOpen] = useState(false)

  const [depth01, setDepth01] = useRecoilState(selectedRegion01)
  const [depth02, setDepth02] = useRecoilState(selectedRegion02)

  // 지역 선택 리셋
  function clickReset(event) {
    event.preventDefault()
    setDepth01("")
    setDepth02("")
    setSearchModalOpen(false)
  }

  return (
    <div className="ml-4">
      <form>
        <span
          onClick={() => {
            setSearchModalOpen(!searchModalOpen)
          }}
        >
          <input
            type="text"
            placeholder="지역 검색"
            value={depth01 === "" ? "" : `${depth01} ${depth02}`}
            className="border rounded py-1 px-2 cursor-pointer"
            disabled
          />
        </span>

        {/* 검색 클리어 */}
        <button
          type="reset"
          className={`ml-1 align-middle ${depth01 === "" ? "hidden" : ""}`}
          onClick={clickReset}
        >
          <FontAwesomeIcon icon={faXmark} className="text-2xl text-rose-300" />
        </button>

        {/* 지역 선택 모달 */}
        <SearchModal
          searchModalOpen={searchModalOpen}
          setSearchModalOpen={setSearchModalOpen}
        />
      </form>
    </div>
  )
}

export default SearchForm
