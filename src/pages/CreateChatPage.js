import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Container from "../components/Layout/Container"
import { useRecoilState } from "recoil"

import { faComments } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import FormSearchModal from "../components/Search/FormSearchModal"

import { getUserToken } from "../utils/getUserToken"
import { CHAT_API, DEFAULT_API } from "../apis"
import { cityData } from "../recoil/areaData"
import { useCheckLogin } from "../hooks/useCheckLogin"

function CreateChatPage() {
  // 로그인 안했으면 로그인 페이지로
  useCheckLogin()

  // 스타일 클래스
  const forLabel = "w-40 font-bold mb-2 inline-block"
  const forInput = "bg-slate-100 mb-2 py-1 px-2"

  const [inputValues, setInputValues] = useState({})
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  // 지역 선택
  const [depth01, setDepth01] = useState("")
  const [depth02, setDepth02] = useState("")
  // 지역 인풋
  const regionInputRef = useRef()

  // 지역 선택
  const [depth01Data, setDepth01Data] = useRecoilState(cityData)

  // 타이틀 텍스트 글자 수
  const [textCount, setTextCount] = useState(0)

  const navigate = useNavigate()

  // 지역 인풋 직접 넣기
  useEffect(() => {
    async function getPositions() {
      try {
        const cityId = depth01Data.filter(
          (city) => city.cityName === depth01,
        )[0].id
        const response = await axios.get(
          `${DEFAULT_API}/api/v1/areas/${cityId}/district`,
        )
        const district = response.data.result.filter(
          (city) => city.districtName === depth02,
        )[0]
        setInputValues({
          ...inputValues,
          latitude: district.latitude,
          longitude: district.longitude,
          rcate1: depth01,
          rcate2: depth02,
        })
      } catch (error) {
        console.log(error)
      }
    }

    if (depth02 !== "") {
      getPositions()
    }
  }, [depth02])

  // 폼 제출
  async function handleSubmit(event) {
    event.preventDefault()
    const token = await getUserToken()

    if (validate() && token) {
      try {
        const response = await axios.post(
          `${CHAT_API}/api/v1/chat/room`,
          inputValues,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          },
        )
        const roomId = response.data.result.id
        navigate(`/chatroom/${roomId}`, { replace: true })
      } catch (error) {
        console.log(error)
      }
    }
  }

  function onChange(event) {
    if (event.target.name === "maxParticipant") {
      const name = "maxParticipant"
      const value = parseInt(event.target.value)
      setInputValues({ ...inputValues, [name]: value })
    } else {
      const { name, value } = event.target
      setInputValues({ ...inputValues, [name]: value })
    }

    if (event.target.name === "title") {
      setTextCount(event.target.value.length)
    }
  }

  // 인풋 값 확인
  function validate() {
    // 시작 날짜, 끝 날짜
    const startDate = new Date(inputValues.startDate)
    const endDate = new Date(inputValues.endDate)
    const today = new Date()

    if (startDate.getDate() < today.getDate()) {
      alert("여행 시작날짜는 오늘부터 선택할 수 있습니다.")
      return false
    }

    if (startDate.getFullYear() > 9999 || endDate.getFullYear() > 9999) {
      alert("날짜 선택 연도를 4자리로 입력해 주세요.")
      return false
    }

    if (endDate - startDate < 0) {
      alert("끝 날짜는 시작 날짜 이후에 설정해주세요.")
      return false
    }

    if (depth01 === "" || depth02 === "") {
      alert("지역을 선택해주세요.")
      return false
    }

    if (inputValues.title.length > 50) {
      alert("제목은 50자까지 입력해 주세요.")
      return false
    }

    return true
  }

  return (
    <Container>
      <h3 className="my-4 px-2 font-semibold text-2xl inline-block relative before:block before:absolute before:left-0 before:bottom-0 before:bg-rose-400 before:h-3 before:w-full before:opacity-30">
        채팅 생성
        <FontAwesomeIcon icon={faComments} className="ml-1" />
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="max-w-xl">
          <label htmlFor="chatTitle" className={forLabel}>
            채팅방 제목
          </label>
          <input
            type="text"
            id="chatTitle"
            name="title"
            className={forInput}
            onChange={onChange}
            required
          />

          {/* 글자수 확인 */}
          <span className="text-rose-400 text-sm ml-2">
            {textCount} / 50 자
          </span>
          <br />
          <label htmlFor="chatMax" className={forLabel}>
            최대 인원수
          </label>
          <input
            type="number"
            id="chatMax"
            name="maxParticipant"
            className={forInput}
            min="2"
            max="10"
            onChange={onChange}
            required
          />
          <br />
          <label htmlFor="startDate" className={forLabel}>
            여행 시작 날짜
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className={forInput}
            onChange={onChange}
            required
          />
          <br />
          <label htmlFor="endDate" className={forLabel}>
            여행 끝 날짜
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className={forInput}
            onChange={onChange}
            required
          />
          <br />
          <label htmlFor="chatRegion" className={forLabel}>
            지역 선택
          </label>
          <span
            className="cursor-pointer inline-flex"
            onClick={() => setSearchModalOpen(!searchModalOpen)}
          >
            <input
              type="text"
              id="chatRegion"
              name="areas"
              className={`pointer-events-none ${forInput}`}
              value={`${depth01} ${depth02}`}
              onChange={onChange}
              required
              ref={regionInputRef}
            />
          </span>
          {/* 지역 선택 */}
          <div className="relative left-40">
            <FormSearchModal
              searchModalOpen={searchModalOpen}
              setSearchModalOpen={setSearchModalOpen}
              depth01={depth01}
              depth02={depth02}
              setDepth01={setDepth01}
              setDepth02={setDepth02}
            />
          </div>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="bg-rose-500 px-3 py-1 rounded-lg text-rose-50"
        >
          만들기!
        </button>
      </form>
    </Container>
  )
}

export default CreateChatPage
