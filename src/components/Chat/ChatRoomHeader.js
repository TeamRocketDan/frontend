import axios from "axios"
import { CHAT_API } from "../../apis"
import { getUserToken } from "../../utils/getUserToken"

import {
  faChevronLeft,
  faPersonRunning,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useNavigate } from "react-router-dom"

function ChatRoomHeader() {
  const navigate = useNavigate()

  async function handleLeaveRoom() {
    const token = await getUserToken()
    try {
      const response = await axios.patch(`${CHAT_API}/api/v1/chat/room-leave`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
      console.log(response)
      navigate("/chatlist")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex justify-between text-2xl text-rose-300">
      <Link to={"/chatlist"} className="p-2" title="채팅 목록으로 가기">
        <FontAwesomeIcon icon={faChevronLeft} />
        <span className="visuallyhidden">채팅 목록으로</span>
      </Link>

      <button type="button" onClick={handleLeaveRoom}>
        <span className="visuallyhidden">채팅방 나가기</span>
        <FontAwesomeIcon icon={faPersonRunning} />
      </button>
    </div>
  )
}

export default ChatRoomHeader
