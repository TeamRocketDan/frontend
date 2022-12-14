import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"
import { useRecoilState } from "recoil"
import Container from "../components/Layout/Container"
import ChatListContainer from "../components/Chat/ChatListContainer"
import ChatListMap from "../components/Map/ChatListMap"
import ChatListPagination from "../components/Chat/ChatListPagination"

import { faCommentDots, faMap } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { getUserToken } from "../utils/getUserToken"
import { selectedRegion01, selectedRegion02 } from "../recoil/regionState"
import { isUserLoggedIn } from "../recoil/userAuth"
import { CHAT_API } from "../apis"

function ChatListPage() {
  // class names
  const titleClass =
    "my-4 px-2 font-semibold text-2xl inline-block relative before:block before:absolute before:left-0 before:bottom-0 before:bg-rose-400 before:h-3 before:w-full before:opacity-30"

  // 로그인 여부
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isUserLoggedIn)

  // 채팅방 리스트가 2가지여서 각각 리스트 가공해서 ChatListContainer로 보낼 예정
  const [myRoomList, setMyRoomList] = useState([])
  const [recentRoomList, setRecentRoomList] = useState([])
  const [positionData, setPositionData] = useState([])

  // 페이지네이션 관련
  const [searchParams, setSearchParams] = useSearchParams()
  const [myListMaxPage, setMyListMaxPage] = useState(1)
  const [regionListMaxPage, setRegionListMaxPage] = useState(1)
  const myListPage = parseInt(searchParams.get("mylistpage") ?? "1", 10)
  const regionListPage = parseInt(searchParams.get("regionlistpage") ?? "1", 10)
  const [pageSize, setPageSize] = useState(10)

  function updateParams(updates) {
    setSearchParams({
      mylistpage: parseInt(searchParams.get("mylistpage") ?? "1", 10),
      regionlistpage: parseInt(searchParams.get("regionlistpage") ?? "1", 10),
      ...updates,
    })
  }

  // 헤더에서 선택한 지역 정보
  const [rcate1, setRcate1] = useRecoilState(selectedRegion01)
  const [rcate2, setRcate2] = useRecoilState(selectedRegion02)

  // 지역 채팅 리스트 받아오기
  async function getChatRooms({ page, size, rcate1, rcate2 }) {
    if ((rcate1 === "" && rcate2 === "") || (rcate1 !== "" && rcate2 !== "")) {
      // 리스트 요청 보내기
      const token = await getUserToken()

      try {
        const response = await axios.get(`${CHAT_API}/api/v1/chat/room-list`, {
          params: {
            page,
            size,
            rcate1,
            rcate2,
          },
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        return response
      } catch (error) {
        console.log(error)
      }
    } else {
      return
    }
  }
  // 내 채팅 리스트 받아오기
  async function getMyChatRooms({ page, size }) {
    const token = await getUserToken()

    if (isLoggedIn) {
      try {
        const response = await axios.get(
          `${CHAT_API}/api/v1/chat/my-room-list`,
          {
            params: {
              page,
              size,
            },
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          },
        )
        return response
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    // 채팅방 리스트 가져오기
    async function getRegionList() {
      const regionChatList = await getChatRooms({
        page: regionListPage - 1,
        size: pageSize,
        rcate1,
        rcate2,
      })
      const result = regionChatList.data.result
      console.log("[GET REGION CHAT LIST] : ", result)
      setRecentRoomList(result.content)
      setRegionListMaxPage(result.totalPage)
    }
    getRegionList()

    async function getMyList() {
      const myChatList = await getMyChatRooms({
        page: myListPage - 1,
        size: pageSize - 1,
      })
      const result = myChatList.data.result
      console.log("[GET MY CHAT LIST] : ", result)
      setMyRoomList(result.content)
      setMyListMaxPage(result.totalPage)
    }
    if (isLoggedIn) {
      getMyList()
    }
  }, [myListPage, regionListPage, rcate2, pageSize])

  // 지도 표시 리스트
  useEffect(() => {
    const newPositions = []
    myRoomList.forEach((room) =>
      newPositions.push({
        lat: room.latitude,
        lng: room.longitude,
      }),
    )

    setPositionData(newPositions)
  }, [myRoomList])

  // 지역 선택이 바뀌면 현재 페이지 초기화
  useEffect(() => {
    updateParams({
      regionlistpage: 1,
    })
  }, [rcate2])

  // 채팅 페이지네이션 사이즈 변경
  function getWindowSize() {
    const width = window.innerWidth

    if (width <= 768) {
      setPageSize(6)
    } else if (width <= 1024) {
      setPageSize(8)
    } else if (width <= 1280) {
      setPageSize(10)
    } else if (width <= 1536) {
      setPageSize(10)
    } else {
      setPageSize(12)
    }
  }
  useEffect(() => {
    getWindowSize()
    window.addEventListener("resize", getWindowSize)
    return function () {
      window.removeEventListener("resize", getWindowSize)
    }
  }, [])
  useEffect(() => {
    updateParams({
      mylistpage: 1,
      regionlistpage: 1,
    })
  }, [pageSize])

  return (
    <Container>
      {/* 지도에 채팅 위치 표시 */}
      <ChatListMap positionData={positionData} />

      <h3 className={titleClass}>
        내 채팅 리스트 <FontAwesomeIcon icon={faCommentDots} />
      </h3>
      <ChatListContainer roomList={myRoomList} isMyList={true} />
      <ChatListPagination
        maxPage={myListMaxPage}
        currentPage={myListPage}
        onClickPageButton={(pageNumber) =>
          updateParams({ mylistpage: pageNumber })
        }
      />

      <h3 className={titleClass}>
        지역 채팅 리스트 <FontAwesomeIcon icon={faMap} />
      </h3>
      <ChatListContainer roomList={recentRoomList} isMyList={false} />
      <ChatListPagination
        maxPage={regionListMaxPage}
        currentPage={regionListPage}
        onClickPageButton={(pageNumber) =>
          updateParams({ regionlistpage: pageNumber })
        }
      />
    </Container>
  )
}

export default ChatListPage
