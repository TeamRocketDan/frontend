import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { CHAT_API } from "../../apis"
import { getUserToken } from "../../utils/getUserToken"

import {
  faChevronLeft,
  faPersonRunning,
  faEllipsisVertical,
  faCrown,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import win from "global"

function ChatRoomHeader({
  roomId,
  stompClient,
  userId,
  userName,
  disConnect,
  participants,
  roomTitle,
  setHeaderHeight,
}) {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const headerRef = useRef()

  // 퇴장 메세지 보내기
  async function sendLeaveMessage() {
    if (stompClient) {
      const token = await getUserToken()
      const message = {
        senderName: userName,
      }

      stompClient.publish({
        destination: `/pub/chat.leave.${roomId}.${userName}`,
        body: JSON.stringify(message),
        headers: {
          Authorization: token,
        },
      })

      return true
    }
  }

  // 채팅방 완전히 나가기
  async function handleLeaveRoom() {
    const isOwner = participants.filter(
      (participant) => participant.userId === userId && participant.owner,
    )

    const confirmed =
      isOwner.length > 0
        ? window.confirm("방장이 채팅방을 나가면 채팅방이 삭제됩니다!")
        : window.confirm("채팅방을 나가시겠습니까?")

    if (confirmed) {
      const token = await getUserToken()

      // 채팅방 나가는 메세지 요청 보내기
      if (sendLeaveMessage()) {
        try {
          // const responseEnd = await axios.patch(
          //   `${CHAT_API}/api/v1/chat/chat-end/${roomId}`,
          //   null,
          //   {
          //     headers: {
          //       Authorization: token,
          //       "Content-Type": "application/json",
          //     },
          //   },
          // )
          // console.log("[CHAT END] : ", responseEnd)

          // if (responseEnd.data.success) {
          const response = await axios.patch(
            `${CHAT_API}/api/v1/chat/room-leave/${roomId}`,
            null,
            {
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            },
          )
          console.log("[ROOM LEAVE] : ", response)
          // }

          navigate("/chatlist")
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  // 채팅 목록으로 가기
  function goToList() {
    disConnect()
    navigate("/chatlist")
  }

  const handleCloseModal = ({ target }) => {
    if (!target.closest(".chat-menu")) {
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener("click", handleCloseModal)
    return () => {
      window.removeEventListener("click", handleCloseModal)
    }
  }, [])

  // 헤더 높이 구하기
  useEffect(() => {
    setHeaderHeight(headerRef.current.offsetHeight)
  }, [roomTitle])

  return (
    <div
      className="flex justify-between text-2xl text-rose-300 relative border-b"
      ref={headerRef}
    >
      {/* 채팅방 제목 */}
      <div className="py-1">{roomTitle}</div>
      {/* 메뉴 버튼 */}
      <button
        type="button"
        className="chat-menu py-1 px-4"
        title="채팅방 메뉴"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </button>

      {/* 채팅방 메뉴 */}
      <div
        className={`${
          !isMenuOpen && "hidden"
        } chat-menu absolute bg-white border border-rose-500 p-2 top-10 right-0 z-10 w-60`}
      >
        {/* 채팅 목록으로 버튼 */}
        <button
          type="button"
          className="p-2 flex align-center"
          title="채팅 목록으로 가기"
          onClick={goToList}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
          <span className="text-lg ml-2">채팅 목록으로</span>
        </button>

        <hr className="my-2" />

        {/* 채팅방 참여자 */}
        <div className="text-base font-bold mx-2">채팅 참여자</div>
        <ul className="text-base mt-2 mx-2">
          {participants.length > 0 &&
            participants.map((participant) => (
              <li key={participant.userId} className="flex items-center">
                <span
                  className="w-10 h-10 mr-2 my-1 rounded-full oveflow-hidden bg-cover bg-center block bg-rose-100"
                  style={{
                    backgroundImage: `url(${participant.profileImage})`,
                  }}
                ></span>
                <span>{participant.nickname}</span>
                {participant.owner && (
                  <FontAwesomeIcon icon={faCrown} className="ml-2" />
                )}
              </li>
            ))}
        </ul>

        <hr className="my-2" />

        {/* 채팅방 나가기 버튼 */}
        <button
          type="button"
          onClick={handleLeaveRoom}
          className="text-rose-200 flex items-center py-1 px-2"
        >
          <FontAwesomeIcon icon={faPersonRunning} />
          <span className="text-lg ml-2 text-rose-200">채팅방 나가기</span>
        </button>
      </div>
    </div>
  )
}

export default ChatRoomHeader
