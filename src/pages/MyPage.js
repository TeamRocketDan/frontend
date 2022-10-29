import React, { useState, useEffect } from "react"

import { faCirclePlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"
import Pagination from "react-js-pagination"
import axios from "axios"

import { DEFAULT_API } from "../apis"
import { data } from "autoprefixer"

function MyPage() {
  const [userInfo, setInfo] = useState([])
  const [userFollowing, setFollowing] = useState([])
  const [userFollower, setFollower] = useState([])
  const [followingCount, setFollowingCount] = useState(0)
  const [followerCount, setFollowerCount] = useState(0)

  const [page, setPage] = useState(1)
  const handlePageChange = (page) => {
    setPage(page)
  }

  useEffect(() => {
    axios
      .get(`${DEFAULT_API}/api/v1/users/mypage`, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setInfo(res.data.result)
      })
      .catch((err) => console.log(err))

    axios
      .get(`${DEFAULT_API}/api/v1/users/following`, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setFollowing(res.data.result.content)
      })
      .catch((err) => console.log(err))

    axios
      .get(`${DEFAULT_API}/api/v1/users/follower`, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setFollower(res.data.result.content)
      })
      .catch((err) => console.log(err))

    axios
      .get(`${DEFAULT_API}/api/v1/users/following`, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setFollowingCount(res.data.result.totalElements)
      })
      .catch((err) => console.log(err))

    axios
      .get(`${DEFAULT_API}/api/v1/users/follower`, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setFollowerCount(res.data.result.totalElements)
      })
      .catch((err) => console.log(err))
  }, [])

  // For Test
  const [data, setData] = useState([])
  const getClick = () => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((res) => setData(res.data))
  }
  const postClick = () => {
    axios
      .post("https://jsonplaceholder.typicode.com/posts", {
        userId: 11,
        id: 101,
        body: "test body",
        title: "test title",
      })
      .then((res) => console.log(res.data))
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
            <img src={userInfo.profile_image} width="200" alt="프로필 사진" />
          </div>
          <div className=" ml-auto mr-auto w-1/3 h-1/2">
            <h3 className="text-lg font-semibold text-left text-blue-500 mt-1 inline-block">
              나의 정보
            </h3>
            <button className="float-right m-2">개인정보 수정</button>
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
          <div className="w-1/4 ml-auto mr-auto">
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
          </div>
          <div className="w-1/4 ml-auto mr-auto">
            <h3 className="text-lg font-semibold text-left text-blue-800 mt-1 inline-block">
              FOLLOWER
            </h3>
            <FontAwesomeIcon
              icon={faCirclePlus}
              className="text-2xl text-rose-500 float-right m-2"
            />
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
            <FontAwesomeIcon
              icon={faCirclePlus}
              className="text-2xl text-rose-500 float-right m-2"
            />
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
