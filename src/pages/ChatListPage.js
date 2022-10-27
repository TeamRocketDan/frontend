import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ChatListContainer from "../components/Chat/ChatListContainer"

import { faCirclePlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function ChatListPage() {
  // 채팅방 리스트가 2가지여서 각각 리스트 가공해서 ChatListContainer로 보낼 예정
  const [myRoomList, setMyRoomList] = useState([])
  const [recentRoomList, setRecentRoomList] = useState([])

  useEffect(() => {
    // 채팅방 리스트 가져오기
    setMyRoomList([{ roomId: "m01", title: "m-title-01" }])
    setRecentRoomList([
      { roomId: "635a9c1df13f3d593f8346fc", title: "r-title-01" },
      { roomId: "63565e52865f8171b69e80b0#20221024", title: "r-title-02" },
    ])
  }, [])

  return (
    <div className="container mx-auto">
      <Link to="/createchat" title="채팅방 생성">
        <FontAwesomeIcon
          icon={faCirclePlus}
          className="text-2xl text-rose-500"
        />

        <span className="visuallyhidden">채팅방 생성</span>
      </Link>
      <h2 className="text-lg font-semibold my-2">내 채팅 리스트</h2>
      <ChatListContainer roomList={myRoomList} />
      <h2 className="text-lg font-semibold my-2">지역 채팅 리스트</h2>
      <ChatListContainer roomList={recentRoomList} />
    </div>
  )
}

export default ChatListPage
