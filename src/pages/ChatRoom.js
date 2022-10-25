import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import SockJS from "sockjs-client"
import * as StompJs from "@stomp/stompjs"

import ChatContainer from "../components/Chat/ChatContainer"
import ChatSendForm from "../components/Chat/ChatSendForm"
import Container from "../components/Layout/Container"

let stompClient

function ChatRoom() {
  // stomp & user
  const { roomId } = useParams()
  const userName = "nick01"
  const [messageList, setMessageList] = useState([])
  const textInputRef = useRef()

  // 채팅방 구독
  const subscribe = () => {
    if (stompClient != null) {
      stompClient.subscribe(
        `/exchange/chat.exchange/room.${roomId}`,
        (content) => {
          const payload = JSON.parse(content.body)
          setMessageList([...messageList, payload])
        },
      )
    }
  }

  useEffect(() => {
    // stompClient 생성
    stompClient = new StompJs.Client({
      brokerURL: "ws://localhost:15674/stomp/chat",
      connectHeaders: {
        login: "user",
        passcode: "password",
      },
      debug: function (str) {
        console.log(str)
      },
      onConnect: () => {
        // 연결 됐을 때 구독 시작
        subscribe()
      },
      onStompError: function (frame) {
        console.log("Broker reported error: " + frame.headers["message"])
        console.log("Additional details: " + frame.body)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })
    stompClient.webSocketFactory = function () {
      return new SockJS("http://localhost:8080/stomp/chat")
    }

    stompClient.activate()
  }, [])

  // 메세지 전송
  function handleSubmit(event) {
    event.preventDefault()
    const input = event.target.querySelector("input")
    if (input.value === "") return

    const message = {
      senderName: userName,
      message: input.value,
    }

    stompClient.publish({
      destination: `/pub/chat.message.${roomId}`,
      body: JSON.stringify(message),
      // headers: { priority: "9" },
    })

    input.value = ""
    textInputRef.current.focus()
  }

  return (
    <>
      <Container>
        <h3 className="text-rose-400">roomId: {roomId}</h3>

        {/* 채팅 내용 나타나는 부분 */}
        <ChatContainer messageList={messageList} userName={userName} />

        {/* 채팅 보내는 부분 */}
        <ChatSendForm handleSubmit={handleSubmit} textInputRef={textInputRef} />
      </Container>
    </>
  )
}

export default ChatRoom
