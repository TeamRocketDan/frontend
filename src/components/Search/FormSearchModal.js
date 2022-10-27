import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import axios from "axios"

import { cityData } from "../../recoil/areaData"

function FormSearchModal({
  searchModalOpen,
  setSearchModalOpen,
  depth01,
  depth02,
  setDepth01,
  setDepth02,
}) {
  const [cityList, setCityList] = useRecoilState(cityData)
  const [currentDistricts, setCurrentDistricts] = useState([])

  function clickDepth01(event) {
    // depth2 불러오기
    const city = cityList.filter((cityItem) => {
      return cityItem.cityName === event.target.textContent
    })[0]

    axios
      .get(
        `http://Teamrocket-1780545001.ap-northeast-2.elb.amazonaws.com/api/v1/areas/${city.id}/district`,
      )
      .then((response) => {
        setCurrentDistricts(response.data.result)
      })
      .catch(function (error) {
        console.log(error)
      })

    setDepth01(event.target.textContent)
  }
  function clickDepth02(event) {
    // 클릭한 지역명 저장
    setDepth02(event.target.textContent)
    // 모달 닫기
    setSearchModalOpen(false)
  }

  return (
    <div
      className={`border w-64 absolute bg-white ${
        searchModalOpen ? "" : "hidden"
      }`}
    >
      {/* depth 01 */}
      <ul className="flex w-64 flex-wrap">
        {cityList.map((city) => (
          <li key={city.id}>
            <span
              onClick={clickDepth01}
              className={`py-1 px-2 w-32 cursor-pointer flex hover:text-rose-400 ${
                city.cityName === depth01 ? "text-rose-400" : ""
              }`}
            >
              {city.cityName}
            </span>
          </li>
        ))}
      </ul>
      {/* depth 02 */}
      <ul
        className={`searchDepth02 absolute left-64 w-80 top-0 flex flex-wrap bg-white border ${
          currentDistricts.length === 0 ? "hidden" : ""
        }`}
      >
        {currentDistricts.map((district) => (
          <li
            key={district.id}
            className={`py-1 px-2 w-36 grow-0 cursor-pointer flex hover:text-rose-400 ${
              district.districtName === depth02 ? "text-rose-400" : ""
            }`}
            onClick={clickDepth02}
          >
            {district.districtName}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FormSearchModal
