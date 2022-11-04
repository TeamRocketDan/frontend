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
import { CHAT_API } from "../apis"

function ChatListPage() {
  // class names
  const titleClass =
    "my-4 px-2 font-semibold text-2xl inline-block relative before:block before:absolute before:left-0 before:bottom-0 before:bg-rose-400 before:h-3 before:w-full before:opacity-30"

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

  function updateParams(updates) {
    setSearchParams({
      mylistpage: searchParams.get("mylistpage"),
      regionlistpage: searchParams.get("regionlistpage"),
      ...updates,
    })
  }

  // 헤더에서 선택한 지역 정보
  const [rcate1, setRcate1] = useRecoilState(selectedRegion01)
  const [rcate2, setRcate2] = useRecoilState(selectedRegion02)

  // 채팅 리스트 받아오기
  async function getChatRooms(page, size, rcate1, rcate2) {
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
  }

  useEffect(() => {
    // 채팅방 리스트 가져오기
    // const myChatList = getChatRooms(myListPage - 1, 10, "", "")
    async function getRegionList() {
      const regionChatList = await getChatRooms(
        regionListPage - 1,
        10,
        rcate1,
        rcate2,
      )
      const result = regionChatList.data.result
      console.log(result)
      setRecentRoomList(result.content)
      setRegionListMaxPage(result.totalPage)
    }
    if (rcate2 !== "") {
      getRegionList()
    }

    // 임시 데이터
    setMyListMaxPage(5)
    setRegionListMaxPage(10)

    setMyRoomList([
      {
        id: "635a9c1df13f3d593f8346fc",
        title: "채팅 테스트용 방",
        isPrivate: true,
        startDate: "2022-10-29",
        endDate: "2022-11-11",
        rcate1: "서울",
        rcate2: "종로구",
        curParticipants: 1,
        maxParticipants: 2,
        longitude: "126.58",
        latitude: "37.34",
      },
    ])

  }, [myListPage, regionListPage, rcate1, rcate2])

  // 지도 표시 리스트
  useEffect(() => {
    const newPositions = []
    myRoomList.forEach((room) =>
      newPositions.push({
        lat: room.latitude,
        lng: room.longitude,
      }),
    )
    recentRoomList.forEach((room) =>
      newPositions.push({
        lat: room.latitude,
        lng: room.longitude,
      }),
    )

    setPositionData(newPositions)
  }, [myRoomList, recentRoomList])

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
      <ChatListContainer roomList={recentRoomList} />
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
