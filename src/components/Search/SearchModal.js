import { useRecoilState } from "recoil"

import { selectedRegion01, selectedRegion02 } from "../../recoil/regionState"

function SearchModal({ searchModalOpen, setSearchModalOpen }) {
  // 지역 이름 데이터 받아올 예정
  const REGIONS = [
    { depth01: "서울", depth02: ["강서구", "강남구"] },
    { depth01: "인천", depth02: ["남동구", "연수구"] },
  ]

  const [depth01, setDepth01] = useRecoilState(selectedRegion01)
  const [depth02, setDepth02] = useRecoilState(selectedRegion02)

  function clickDepth01(event) {
    // 클릭한 지역명 저장
    setDepth01(event.target.textContent)
    // depth2 비우기
    setDepth02("")
  }
  function clickDepth02(event) {
    // 클릭한 지역명 저장
    setDepth02(event.target.textContent)
    // 모달 닫기
    setSearchModalOpen(false)
  }

  return (
    <div
      className={`border w-80 absolute bg-white ${
        searchModalOpen ? "" : "hidden"
      }`}
    >
      {/* depth 01 */}
      <ul>
        {REGIONS.map((region) => (
          <li
            key={region.depth01}
            className="py-2 px-4 w-20 cursor-pointer border-r"
          >
            <span onClick={clickDepth01}>{region.depth01}</span>
            {/* depth 02 */}
            <ul
              className={`searchDepth02 absolute left-20 w-20 top-0 flex flex-wrap ${
                region.depth01 === depth01 ? "" : "hidden"
              }`}
            >
              {region.depth02.map((depth02) => (
                <li
                  key={depth02}
                  className="py-2 py-2 px-4"
                  onClick={clickDepth02}
                >
                  {depth02}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SearchModal
