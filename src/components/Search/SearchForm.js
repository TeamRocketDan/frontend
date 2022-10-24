import { useRef, useState } from "react"
import SearchModal from "./SearchModal"

function SearchForm() {
  // 선택된 지역
  const [selectedRegion, setSelectedRegion] = useState()
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const searchRef = useRef()

  // 인풋에 선택한 지역 표시하기
  // searchRef.current.value = "선택한 지역"

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
            className="border rounded py-1 px-2 cursor-pointer"
            disabled
            ref={searchRef}
          />
        </span>

        {/* 지역 선택 모달 */}
        <SearchModal searchModalOpen={searchModalOpen} />
      </form>
    </div>
  )
}

export default SearchForm
