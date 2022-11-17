import React, { useState, useEffect } from "react"

import styled from "styled-components"
import Pagination from "react-js-pagination"
import Modal from "react-modal"
import axios from "axios"
import { useRecoilState } from "recoil"

import { DEFAULT_API } from "../apis"
import { getUserToken } from "../utils/getUserToken"
import { currentUserName, currentUserProf } from "../recoil/userAuth"
import { useCheckLogin } from "../hooks/useCheckLogin"

function MyPage() {
  const [userInfo, setInfo] = useState([])
  const [userFollowing, setFollowing] = useState([])
  const [userFollower, setFollower] = useState([])
  const [followingCount, setFollowingCount] = useState(0)
  const [followerCount, setFollowerCount] = useState(0)
  const [multipartFiles, setMultipartFiles] = useState([])
  const [nickname, setNickname] = useState("")

  // 페이지네이션
  const [followerPage, setFollowerPage] = useState(1)
  const [followingPage, setFollowingPage] = useState(1)

  const handleFollowerPageChange = (page) => {
    setFollowerPage(page)
  }
  const handleFollowingPageChange = (page) => {
    setFollowingPage(page)
  }

  useEffect(() => {
    getFollowerList()
  }, [followerPage])

  useEffect(() => {
    getFollowingList()
  }, [followingPage])

  const getFollowerList = async () => {
    try {
      const token = await getUserToken()
      const res = await axios
        .get(
          `${DEFAULT_API}/api/v1/users/follower?page=${
            followerPage - 1
          }&size=10`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          },
        )
        .then((res) => {
          setFollower(res.data.result.content)
          setFollowerCount(res.data.result.totalElements)
        })
        .catch((err) => console.log(err))
    } catch (error) {
      console.log(error)
    }
  }

  const getFollowingList = async () => {
    try {
      const token = await getUserToken()
      const res = await axios
        .get(
          `${DEFAULT_API}/api/v1/users/following?page=${
            followingPage - 1
          }&size=10`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          },
        )
        .then((res) => {
          setFollowing(res.data.result.content)
          setFollowingCount(res.data.result.totalElements)
        })
        .catch((err) => console.log(err))
    } catch (error) {
      console.log(error)
    }
  }

  // 모달
  const [modal, setModal] = useState(false)

  const modalOff = () => {
    setModal(false)
  }

  // 유저 정보 수정하면 로컬스토리지에도 적용
  const [userName, setUserName] = useRecoilState(currentUserName)
  const [userProf, setUserProf] = useRecoilState(currentUserProf)

  // 로그인 안했으면 로그인 페이지로
  useCheckLogin()

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
        })
        .catch((err) => console.log(err))
    })

    getFollowingList()
    getFollowerList()
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
      <div className="md:w-1/2 xl:w-2/5 sm:mx-auto my-8 w-full px-8">
        <h3 className="text-2xl font-semibold text-left text-slate-900">
          마이페이지
        </h3>
        <h3 className="text-1xl text-slate-500 mt-12">
          *[개인정보 수정] 클릭 후, 프로필 사진과 닉네임을 수정하실 수 있습니다.
        </h3>
        <div className="bg-white shadow rounded-lg p-10">
          <div className="flex flex-col gap-1 text-center items-center">
            <img
              className="h-32 w-32 bg-white p-2 rounded-full shadow mb-4 object-contain"
              src={userInfo.profileImagePath}
              alt="profile_image"
            />
            <p className="font-semibold">{userInfo.username}</p>
            <div className="text-sm leading-normal text-gray-400 flex justify-center items-center">
              <button
                className="float-right m-2 text-sm text-blue-300"
                onClick={() => {
                  setModal(true)
                }}
              >
                개인정보 수정
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 my-3">
            <div className="font-semibold text-center mx-4">
              {userInfo.nickname ? (
                <p className="text-black">{userInfo.nickname}</p>
              ) : (
                <p className="text-white pointer-events-none select-none">""</p> // 드래그 클릭 막아서 공백 처리
              )}
              {/* <p className="text-black">{userInfo.nickname}</p> */}
              <span className="text-gray-400">Nickname</span>
            </div>
            <div className="font-semibold text-center mx-4">
              <p className="text-black">{userInfo.follower}</p>
              <span className="text-gray-400">Followers</span>
            </div>
            <div className="font-semibold text-center mx-4">
              <p className="text-black">{userInfo.following}</p>
              <span className="text-gray-400">Following</span>
            </div>

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
          </div>
        </div>

        {/* Following */}
        <div className="bg-white shadow mt-6  rounded-lg p-6">
          <h3 className="text-gray-600 text-lg font-semibold mb-4">
            Following
          </h3>
          <ul className="flex items-center justify-center space-x-2 flex-wrap">
            {userFollowing.map((follow) => (
              <li
                key={follow.userId}
                className="flex flex-col items-center space-y-2 shrink-0"
              >
                <img
                  className="w-16 h-16 rounded-full object-cover border border-rose-300"
                  src={follow.profileImagePath}
                  alt="profile_image"
                />
                <span className="text-xs text-gray-500">{follow.nickname}</span>
              </li>
            ))}
          </ul>
          <PaginationBox>
            <Pagination
              activePage={followingPage}
              totalItemsCount={followingCount}
              itemsCountPerPage={10}
              pageRangeDisplayed={5}
              prevPageText={"‹"}
              nextPageText={"›"}
              onChange={handleFollowingPageChange}
            />
          </PaginationBox>
        </div>
        {/* Follower */}
        <div className="bg-white shadow mt-6  rounded-lg p-6">
          <h3 className="text-gray-600 text-lg font-semibold mb-4">Follower</h3>
          <ul className="flex items-center justify-center space-x-2 flex-wrap">
            {userFollower.map((follow) => (
              <li
                key={follow.userId}
                className="flex flex-col items-center space-y-2 shrink-0"
              >
                <img
                  className="w-16 h-16 rounded-full object-cover border border-rose-300"
                  src={follow.profileImagePath}
                  alt="profile_image"
                />
                <span className="text-xs text-gray-500">{follow.nickname}</span>
              </li>
            ))}
          </ul>
          <PaginationBox>
            <Pagination
              activePage={followerPage}
              totalItemsCount={followerCount}
              itemsCountPerPage={10}
              pageRangeDisplayed={5}
              prevPageText={"‹"}
              nextPageText={"›"}
              onChange={handleFollowerPageChange}
            />
          </PaginationBox>
        </div>
      </div>
    </>
  )
}

const PaginationBox = styled.div`
  .pagination {
    display: flex;
    justify-content: center;
    margin: 28px 0;
  }
  ul {
    list-style: none;
    padding: 0;
    display: flex;
  }
  ul.pagination li {
    margin: 0 0.3rem;
    width: 30px;
    height: 30px;
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgba(244, 63, 94, 1);
  }
  ul.pagination li:nth-child(1),
  ul.pagination li:nth-child(2),
  ul.pagination li:nth-last-child(1),
  ul.pagination li:nth-last-child(2) {
    background-color: rgba(244, 63, 94, 0.3);
  }
  ul.pagination li:nth-child(1) a,
  ul.pagination li:nth-child(2) a,
  ul.pagination li:nth-last-child(1) a,
  ul.pagination li:nth-last-child(2) a {
    position: absolute;
    line-height: 1;
    top: -2px;
    font-size: 20px;
  }

  ul.pagination li:nth-child(1).disabled,
  ul.pagination li:nth-child(2).disabled,
  ul.pagination li:nth-last-child(1).disabled,
  ul.pagination li:nth-last-child(2).disabled {
    opacity: 0.4;
    pointer-events: none;
  }
  ul.pagination li a {
    width: 30px;
    height: 30px;
    text-decoration: none;
    color: rgb(244 63 94);
    font-size: 1rem;
    line-height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ul.pagination li.active a {
    color: white;
    background-color: rgba(244, 63, 94, 1);
  }
`

export default MyPage
