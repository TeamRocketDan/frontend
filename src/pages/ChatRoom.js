import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import SockJS from "sockjs-client"
import { Client } from "@stomp/stompjs"

import ChatContainer from "../components/Chat/ChatContainer"
import ChatSendForm from "../components/Chat/ChatSendForm"
import Container from "../components/Layout/Container"

let stompClient

function ChatRoom() {
  // stomp & user
  const { roomId } = useParams()
  const user = "nick01"
  const [message, setMessage] = useState([
    // 테스트 메세지
    { sender: "nick01", content: "안녕하세요" },
    { sender: "nick02", content: "안녕하세요" },
    { sender: "nick01", content: "저녁은 뭐 드실?" },
    {
      sender: "nick01",
      content: "????????????????????????????????????????????????????",
    },
  ])

  const subscribe = () => {
    if (stompClient != null) {
      stompClient.subscribe(`/topic/room.${roomId}`, (data) => {
        const newMessage = JSON.parse(data.body)
        setMessage((prevData) => [...prevData, { ...newMessage }])
      })
    }
  }

  useEffect(() => {
    stompClient = new Client({
      //websocket 주소만 입력 가능 * ws://, wss:// 로 시작
      // brokerURL: `ws://localhost:3080/sub/chat/room/${roomId}`,
      connectHeaders: {
        login: "user",
        passcode: "password",
      },
      debug: function (str) {
        console.log(str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    stompClient.webSocketFactory = () => {
      return new SockJS(`http://localhost:3080/sub/chat/room/${roomId}`)
    }

    stompClient.onConnect = (frame) => {
      subscribe()
    }

    stompClient.onStompError = function (frame) {
      console.log("Broker reported error: " + frame.headers["message"])
      console.log("Additional details: " + frame.body)
    }
  }, [])

  // 메세지 전송
  function handleSubmit(event) {
    event.preventDefault()
    const input = event.target.querySelector("input")
    if (input.value === "") return

    const message = {
      sender: user,
      content: input.value,
    }

    stompClient.publish({
      destination: "/topic/general",
      body: JSON.stringify(message),
      headers: { priority: "9" },
    })

    input.value = ""
    // 인풋에 포커스 나중에 추가
  }

  return (
    <>
      <Container>
        <h3 className="text-rose-400">roomId: {roomId}</h3>

        {/* 채팅 내용 나타나는 부분 */}
        <ChatContainer message={message} user={user} />

        {/* 채팅 보내는 부분 */}
        <ChatSendForm handleSubmit={handleSubmit} />
      </Container>
    </>
  )
}

export default ChatRoom
