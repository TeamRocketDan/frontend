import { useEffect, useState } from "react"
import ChatListContainer from "../components/Chat/ChatListContainer"

function ChatListPage() {
  // 채팅방 리스트가 2가지여서 각각 리스트 가공해서 ChatListContainer로 보낼 예정
  const [myRoomList, setMyRoomList] = useState([])
  const [recentRoomList, setRecentRoomList] = useState([])

  useEffect(() => {
    // 채팅방 리스트 가져오기
    setMyRoomList([{ roomId: "m01", title: "m-title-01" }])
    setRecentRoomList([
      { roomId: "r01", title: "r-title-01" },
      { roomId: "r02", title: "r-title-02" },
    ])
  }, [])

  return (
    <div className="container mx-auto">
      <h2 className="text-lg font-semibold my-2">내 채팅 리스트</h2>
      <ChatListContainer roomList={myRoomList} />
      <h2 className="text-lg font-semibold my-2">지역 채팅 리스트</h2>
      <ChatListContainer roomList={recentRoomList} />
    </div>
  )
}

export default ChatListPage
