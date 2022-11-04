import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import FormSearchModal from "../components/Search/FormSearchModal"
import { useRecoilState } from "recoil"
import { cityData } from "../recoil/areaData"

import { faMessage } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { DEFAULT_API } from "../apis"
import { getUserToken } from "../utils/getUserToken"

function CreateFeed() {
  const navigate = useNavigate()

  // 스타일 클래스
  const forLabel = "w-40 font-bold mb-2 inline-block"
  const forInput = "bg-slate-100 mb-2 py-1 px-2"

  const [inputValues, setInputValues] = useState({})
  const [searchModalOpen, setSearchModalOpen] = useState(false)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [longitude, setLongitude] = useState("")
  const [latitude, setLatitude] = useState("")
  const [multipartFiles, setMultipartFiles] = useState([])

  function onChange(event) {
    const { name, value } = event.target
    setInputValues({ ...inputValues, [name]: value })
  }

  // 제목 추가
  const onChangeTitle = (e) => {
    setTitle(e.target.value)
  }

  // 내용 추가
  const onChangeContent = (e) => {
    setContent(e.target.value)
  }

  // 이미지 경로 삽입
  const onChangeImage = (e) => {
    setMultipartFiles(Array.from(e.target.files || []))
  }

  // 지역 선택
  const [depth01, setDepth01] = useState("")
  const [depth02, setDepth02] = useState("")
  const [depth01Data, setDepth01Data] = useRecoilState(cityData)

  // 지역 인풋
  const regionInputRef = useRef()

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

  // 피드 Post
  const postFeed = async (event) => {
    event.preventDefault()
    if (depth01 === "" || depth02 === "") {
      alert("지역을 선택해주세요.")
      return false
    }

    const formData = new FormData()
    const variables = {
      title: title, // 제목
      content: content, // 내용
      rcate1: depth01, // 시도
      rcate2: depth02, // 구
      longitude: inputValues.longitude, // 경도
      latitude: inputValues.latitude, // 위도
    }

    formData.append(
      "feed",
      new Blob([JSON.stringify(variables)], { type: "application/json" }),
    )

    multipartFiles.forEach((file) => {
      // 사진 첨부(리스트형태)
      formData.append("files", file)
    })

    const token = await getUserToken()

    axios
      .post(`${DEFAULT_API}/api/v1/feeds`, formData, {
        // 경로 수정 여부 확인
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("Post Success!")
        console.log(res)
        const feedId = res.data.result.feedId
        navigate(`/detailedfeed/${feedId}`, { replace: true })
      })
      .catch((err) => console.log(err))
  }
  return (
    <>
      <h3 className="my-4 px-2 font-bold text-3xl inline-block relative before:block before:absolute before:left-0 before:bottom-0 before:bg-rose-400 before:h-3 before:w-full before:opacity-30">
        피드 생성
        <FontAwesomeIcon icon={faMessage} className="ml-1" />
      </h3>
      <form
        className="w-full max-w-sm ml-32 mt-20 bg-teal-400"
        onSubmit={postFeed}
      >
        <div className="w-4/5 h-3/6 bg-teal-600 mx-auto mt-12 py-56">
          <div className="md:w-2/3">
            <input
              type="file"
              accept="image/*"
              onChange={onChangeImage}
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="profile-upload"
            />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6 mt-10">
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
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className={forLabel} htmlFor="nickname">
              제목
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="nickname"
              onChange={onChangeTitle}
            />
          </div>
        </div>

        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className={forLabel} htmlFor="nickname">
              내용
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="nickname"
              onChange={onChangeContent}
            />
          </div>
        </div>

        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <button
              className="bg-rose-500 px-3 py-1 rounded-lg text-rose-50"
              type="submit"
            >
              피드 생성!
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

export default CreateFeed
