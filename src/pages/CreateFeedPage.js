import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import Container from "../components/Layout/Container"
import FormSearchModal from "../components/Search/FormSearchModal"
import { useRecoilState } from "recoil"
import { cityData } from "../recoil/areaData"

import { faMessage } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { DEFAULT_API } from "../apis"
import { getUserToken } from "../utils/getUserToken"

function CreateFeedPage() {
  const navigate = useNavigate()

  // 스타일 클래스
  const titleClass =
    "my-4 px-2 font-semibold text-2xl inline-block relative before:block before:absolute before:left-0 before:bottom-0 before:bg-rose-400 before:h-3 before:w-full before:opacity-30"
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

    // 이미지 첨부 4장까지 되도록 코드 수정
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
        // console.log(res)
        const feedId = res.data.result.feedId
        navigate(`/detailedfeed/${feedId}`, { replace: true })
      })
      .catch((err) => console.log(err))
  }

  return (
    <Container>
      {/* <!-- Container --> */}
      <div className="container">
        <h3 className={titleClass}>
          피드 생성
          <FontAwesomeIcon icon={faMessage} className="ml-1" />
        </h3>
        <div className="flex justify-center px-6 my-12">
          {/* <!-- Row --> */}
          <div className="w-full xl:w-3/4 lg:w-11/12 flex">
            {/* <!-- Col --> */}
            <div>
              {/* image input https://flowbite.com/docs/forms/file-input/ */}
              <div className="flex justify-center items-center w-full mt-16">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col justify-center items-center pt-5 pb-6">
                    <svg
                      aria-hidden="true"
                      className="mb-3 w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/"
                    multiple
                    onChange={onChangeImage}
                  />
                </label>
              </div>
              {/* 기존 */}
              {/* <input
                type="file"
                accept="image/*"
                onChange={onChangeImage}
                className="w-3/6 h-3/6"
                // className="w-full h-auto bg-gray-400 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg"
                id="profile-upload"
              /> */}
            </div>
            {/* <!-- Col --> */}
            <div className="w-full lg:w-7/12 bg-white p-5 rounded-lg lg:rounded-l-none">
              <form
                className="px-8 pt-6 pb-8 mb-4 bg-white rounded"
                onSubmit={postFeed}
              >
                <div className="mb-4 md:flex md:justify-between">
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700"
                      htmlFor="feedTitle"
                    >
                      Feed Title
                    </label>
                    <input
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="feedTitle"
                      type="text"
                      placeholder="Title"
                      onChange={onChangeTitle}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="feedContent"
                  >
                    Content
                  </label>
                  <textarea
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="feedContent"
                    placeholder="Content"
                    onChange={onChangeContent}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="selectRegion"
                  >
                    지역 선택
                  </label>
                  <span
                    className="cursor-pointer inline-flex"
                    onClick={() => setSearchModalOpen(!searchModalOpen)}
                  >
                    <input
                      type="text"
                      id="selectRegion"
                      name="areas"
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
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

                <div className="mb-6 text-center">
                  <button
                    className="w-full px-4 py-2 font-bold text-white bg-rose-300 rounded-full hover:bg-rose-500 focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    피드 생성!
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default CreateFeedPage
