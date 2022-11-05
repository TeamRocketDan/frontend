import React, { useState, useEffect } from "react"

import styled from "styled-components"
import Pagination from "react-js-pagination"
import Modal from "react-modal"
import axios from "axios"
import { useRecoilState } from "recoil"

import { DEFAULT_API } from "../apis"
import { getUserToken } from "../utils/getUserToken"
import { data } from "autoprefixer"
import { currentUserName, currentUserProf } from "../recoil/userAuth"

function MyPage() {
  const [userInfo, setInfo] = useState([])
  const [userFollowing, setFollowing] = useState([])
  const [userFollower, setFollower] = useState([])
  const [followingCount, setFollowingCount] = useState(0)
  const [followerCount, setFollowerCount] = useState(0)
  const [multipartFiles, setMultipartFiles] = useState([])
  const [nickname, setNickname] = useState("")

  // 페이지네이션
  const [page, setPage] = useState(1)
  const handlePageChange = (page) => {
    setPage(page)
  }

  // 모달
  const [modal, setModal] = useState(false)

  const modalOff = () => {
    setModal(false)
  }

  // 유저 정보 수정하면 로컬스토리지에도 적용
  const [userName, setUserName] = useRecoilState(currentUserName)
  const [userProf, setUserProf] = useRecoilState(currentUserProf)

  useEffect(() => {
    const token = getUserToken().then((token) => {
      axios
        .get(`${DEFAULT_API}/api/v1/users/mypage`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setInfo(res.data.result)
          // console.log(res.data.result)
        })
        .catch((err) => console.log(err))

      axios
        .get(`${DEFAULT_API}/api/v1/users/following`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setFollowing(res.data.result.content)
          setFollowingCount(res.data.result.totalElements)
        })
        .catch((err) => console.log(err))

      axios
        .get(`${DEFAULT_API}/api/v1/users/follower`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setFollower(res.data.result.content)
          setFollowerCount(res.data.result.totalElements)
        })
        .catch((err) => console.log(err))
    })
  }, [userName, userProf])

  // 개인정보 수정
  const edit = async () => {
    const token = await getUserToken()

    const formData = new FormData()
    multipartFiles.forEach((file) => {
      formData.append("multipartFiles", file)
    })

    if (multipartFiles.length !== 0) {
      axios
        .patch(`${DEFAULT_API}/api/v1/users/profileImage`, formData, {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log("Profile Image Changed successfully")
          setUserProf(res.data.result.profileImagePath)
          setMultipartFiles([])
        })
        .catch((err) => console.log(err))
    }

    if (nickname !== "") {
      axios
        .patch(`${DEFAULT_API}/api/v1/users/nickname`, nickname, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("Nickname Changed successfully")
          setUserName(res.data.result.nickname)
          setNickname("")
        })
        .catch((err) => console.log(err))
    }
  }

  // 이미지 경로 삽입
  const onChangeImage = (e) => {
    setMultipartFiles(Array.from(e.target.files || []))
  }

  // 닉네임 변경
  const onChangeNickname = (e) => {
    setNickname(e.target.value)
  }

  return (
    <>
      <div className="w-4/5 h-5/6 m-auto mt-8">
        <h3 className="text-2xl font-semibold text-left text-slate-900">
          마이페이지
        </h3>
        <h3 className="text-1xl text-slate-500 mt-12">
          *[개인정보 수정] 클릭 후, 선택정보에서 선호지역을 등록하시면 해당 지역
          프로모션 정보를 손쉽게 받으실 수 있습니다.
        </h3>
        <div className="flex flex-wrap content-center">
          <div className="myPicture border-inherit flex-none w-1/3 h-1/2 ml-auto mr-auto">
            <h3 className="text-lg font-semibold text-left text-blue-800 mt-1">
              나의 사진
            </h3>
            <img
              src={userInfo.profileImagePath}
              width="200"
              alt="프로필 사진"
            />
          </div>
          <div className=" ml-auto mr-auto w-1/3 h-1/2">
            <h3 className="text-lg font-semibold text-left text-blue-500 mt-1 inline-block">
              나의 정보
            </h3>
            <button
              className="float-right m-2 text-sm text-blue-300"
              onClick={() => {
                setModal(true)
              }}
            >
              개인정보 수정
            </button>
            <Modal
              isOpen={modal}
              ariaHideApp={false}
              onRequestClose={modalOff}
              style={{
                overlay: {
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(15, 15, 15, 0.79)",
                  zIndex: 30,
                },
                content: {
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "fit-content",
                  height: "fit-content",
                  border: "1px solid #ccc",
                  background: "#fff",
                  overflow: "auto",
                  WebkitOverflowScrolling: "touch",
                  borderRadius: "4px",
                  outline: "none",
                  padding: "20px",
                },
              }}
            >
              <h3 className="text-lg text-blue-300 font-semibold mb-2">
                개인정보 수정
              </h3>
              <form className="w-full max-w-sm mt-20">
                <div className="md:flex md:items-center mb-6 mt-10">
                  <div className="md:w-1/3">
                    <label
                      className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                      htmlFor="profile-upload"
                    >
                      프로필 사진
                    </label>
                  </div>
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
                <div className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                    <label
                      className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                      htmlFor="nickname"
                    >
                      닉네임
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <input
                      type="text"
                      onChange={onChangeNickname}
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      id="nickname"
                    />
                  </div>
                </div>

                <div className="md:flex md:items-center">
                  <div className="md:w-1/3"></div>
                  <div className="md:w-2/3">
                    <button
                      className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ml-8"
                      type="button"
                      onClick={() => {
                        setModal(false)
                        edit()
                      }}
                    >
                      수정 완료
                    </button>
                  </div>
                </div>
              </form>
            </Modal>

            <form className="login-form grid place-items-center my-4">
              <table className="text-center">
                <tbody>
                  <tr>
                    <td>회원번호</td>
                    <td>{userInfo.userId}</td>
                  </tr>
                  <tr>
                    <td>회원명</td>
                    <td>{userInfo.username}</td>
                  </tr>
                  <tr>
                    <td>닉네임</td>
                    <td>{userInfo.nickname}</td>
                  </tr>
                  <tr>
                    <td>이메일</td>
                    <td>{userInfo.email}</td>
                  </tr>
                </tbody>
              </table>
            </form>
          </div>
        </div>

        <div className="flex flex-wrap m-4">
          {/* <div className="w-1/4 ml-auto mr-auto">
            <h3 className="text-lg font-semibold text-left text-blue-800 mt-1">
              나의 관심 지역
            </h3>
            <form className="login-form grid place-items-center my-4">
              <PaginationBox>
                <Pagination
                  activePage={page}
                  totalItemsCount={followerCount}
                  itemsCountPerPage={10}
                  pageRangeDisplayed={5}
                  onChange={handlePageChange}
                />
              </PaginationBox>
            </form>
          </div> */}

          <div className="w-1/4 ml-auto mr-auto">
            <h3 className="text-lg font-semibold text-left text-blue-800 mt-1 inline-block">
              FOLLOWER
            </h3>
            {/* <FontAwesomeIcon
              icon={faCirclePlus}
              className="text-2xl text-rose-500 float-right m-2"
            /> */}
            <form className="login-form grid place-items-center my-4">
              <ul className="h-1/2">
                {userFollower.map((follow) => {
                  ;<li key={follow.userId}>{follow.nickname}</li>
                })}
              </ul>
              <PaginationBox>
                <Pagination
                  activePage={page}
                  totalItemsCount={followerCount}
                  itemsCountPerPage={10}
                  pageRangeDisplayed={5}
                  onChange={handlePageChange}
                />
              </PaginationBox>
            </form>
          </div>
          <div className="w-1/4 ml-auto mr-auto">
            <h3 className="text-lg font-semibold text-left text-blue-800 mt-1 inline-block">
              FOLLOWING
            </h3>
            {/* <FontAwesomeIcon
              icon={faCirclePlus}
              className="text-2xl text-rose-500 float-right m-2"
            /> */}
            <form className="login-form grid place-items-center my-4">
              <ul className="h-1/2">
                {userFollowing.map((follow) => {
                  ;<li key={follow.userId}>{follow.nickname}</li>
                })}
              </ul>
              <PaginationBox>
                <Pagination
                  activePage={page}
                  totalItemsCount={followerCount}
                  itemsCountPerPage={10}
                  pageRangeDisplayed={5}
                  onChange={handlePageChange}
                />
              </PaginationBox>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

const PaginationBox = styled.div`
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 15px;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  ul.pagination li {
    display: inline-block;
    width: 30px;
    height: 30px;
    border: 1px solid #e2e2e2;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
  }
  ul.pagination li:first-child {
    border-radius: 5px 0 0 5px;
  }
  ul.pagination li:last-child {
    border-radius: 0 5px 5px 0;
  }
  ul.pagination li a {
    text-decoration: none;
    color: #337ab7;
    font-size: 1rem;
  }
  ul.pagination li.active a {
    color: white;
  }
  ul.pagination li.active {
    background-color: #337ab7;
  }
  ul.pagination li a:hover,
  ul.pagination li a.active {
    color: blue;
  }
`

export default MyPage
