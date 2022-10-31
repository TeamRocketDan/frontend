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
  const [currentParams, setCurrentParams] = useState({})
  const [myListMaxPage, setMyListMaxPage] = useState(1)
  const [regionListMaxPage, setRegionListMaxPage] = useState(1)
  const myListPage = parseInt(searchParams.get("mylistpage") ?? "1", 10)
  const regionListPage = parseInt(searchParams.get("regionlistpage") ?? "1", 10)

  function updateParams(updates) {
    setSearchParams({ ...currentParams, ...updates })
    setCurrentParams({ ...currentParams, ...updates })
  }

  // 헤더에서 선택한 지역 정보
  const [rcate1, setRcate1] = useRecoilState(selectedRegion01)
  const [rcate2, setRcate2] = useRecoilState(selectedRegion02)

  // 채팅 리스트 받아오기
  async function getChatRooms(page, rcate1, rcate2, sort) {
    const token = await getUserToken()

    try {
      const response = await axios.get(`/api/v1/chat/room-list`, {
        params: {
          page,
          rcate1,
          rcate2,
          sort,
        },
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
      console.log(response.data)
      return response.data.result
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // 채팅방 리스트 가져오기
    const myChatList = getChatRooms(currentParams.mylistpage, "", "", "date")
    const regionChatList = getChatRooms(
      currentParams.regionlistpage,
      rcate1,
      rcate2,
      "date",
    )

    // 임시 데이터
    setMyListMaxPage(5)
    setRegionListMaxPage(10)

    setMyRoomList([
      {
        roomId: "635a9c1df13f3d593f8346fc",
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
    setRecentRoomList([
      {
        roomId: "11",
        title: "채팅방 제목이 아주 길다면 말줄임 표시를 할 거임",
        isPrivate: false,
        startDate: "2022-10-29",
        endDate: "2022-11-11",
        rcate1: "충북",
        rcate2: "청주시 상당구",
        curParticipants: 2,
        maxParticipants: 3,
      },
      {
        roomId: "22",
        title: "채팅방 제목",
        isPrivate: false,
        startDate: "2022-10-29",
        endDate: "2022-11-11",
        rcate1: "세종특별자치시",
        rcate2: "세종시",
        curParticipants: 1,
        maxParticipants: 2,
      },
      {
        roomId: "33",
        title: "채팅방 제목",
        isPrivate: false,
        startDate: "2022-10-29",
        endDate: "2022-11-11",
        rcate1: "경기",
        rcate2: "고양시 일산동구",
        curParticipants: 1,
        maxParticipants: 2,
      },
    ])
  }, [currentParams.mylistpage, currentParams.regionlistpage, rcate1, rcate2])

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

    // 임시 대량 데이터
    newPositions.push(
      {
        lat: 37.27943075229118,
        lng: 127.01763998406159,
      },
      {
        lat: 37.55915668706214,
        lng: 126.92536526611102,
      },
      {
        lat: 35.13854258261161,
        lng: 129.1014781294671,
      },
      {
        lat: 37.55518388656961,
        lng: 126.92926237742505,
      },
      {
        lat: 35.20618517638034,
        lng: 129.07944301057026,
      },
      {
        lat: 37.561110808242056,
        lng: 126.9831268386891,
      },
      {
        lat: 37.86187129655063,
        lng: 127.7410250820423,
      },
      {
        lat: 37.47160156778542,
        lng: 126.62818064142286,
      },
      {
        lat: 35.10233410927457,
        lng: 129.02611815856181,
      },
      {
        lat: 35.10215562270429,
        lng: 129.02579793018205,
      },
      {
        lat: 35.475423012251106,
        lng: 128.76666923366042,
      },
      {
        lat: 35.93282824693927,
        lng: 126.95307628834287,
      },
      {
        lat: 36.33884892276137,
        lng: 127.393666019664,
      },
      {
        lat: 37.520412849636,
        lng: 126.9742764161581,
      },
      {
        lat: 35.155139675209675,
        lng: 129.06154773758374,
      },
      {
        lat: 35.816041994696576,
        lng: 127.11046706211324,
      },
      {
        lat: 38.20441110638504,
        lng: 128.59038671285234,
      },
      {
        lat: 37.586112739308916,
        lng: 127.02949148517999,
      },
      {
        lat: 37.50380641844987,
        lng: 127.02130716617751,
      },
      {
        lat: 37.55155704387368,
        lng: 126.92161115892036,
      },
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
