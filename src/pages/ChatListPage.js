import { useEffect, useState } from "react"
import Container from "../components/Layout/Container"
import ChatListContainer from "../components/Chat/ChatListContainer"

import { faCommentDots, faMap } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function ChatListPage() {
  // class names
  const titleClass =
    "my-4 px-2 font-semibold text-2xl inline-block relative before:block before:absolute before:left-0 before:bottom-0 before:bg-rose-400 before:h-3 before:w-full before:opacity-30"

  // 채팅방 리스트가 2가지여서 각각 리스트 가공해서 ChatListContainer로 보낼 예정
  const [myRoomList, setMyRoomList] = useState([])
  const [recentRoomList, setRecentRoomList] = useState([])

  useEffect(() => {
    // 채팅방 리스트 가져오기
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
      { roomId: "44", title: "r-title-01" },
      { roomId: "55", title: "r-title-01" },
      { roomId: "66", title: "r-title-01" },
      { roomId: "63565e52865f8171b69e80b0#20221024", title: "r-title-02" },
    ])
  }, [])

  return (
    <Container>
      <h3 className={titleClass}>
        내 채팅 리스트 <FontAwesomeIcon icon={faCommentDots} />
      </h3>
      <ChatListContainer roomList={myRoomList} isMyList={true} />

      <h3 className={titleClass}>
        지역 채팅 리스트 <FontAwesomeIcon icon={faMap} />
      </h3>
      <ChatListContainer roomList={recentRoomList} />
    </Container>
  )
}

export default ChatListPage
