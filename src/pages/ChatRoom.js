import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import SockJS from "sockjs-client"
import * as StompJs from "@stomp/stompjs"
import { useRecoilState } from "recoil"

import { currentUserName } from "../recoil/userAuth"

import ChatContainer from "../components/Chat/ChatContainer"
import ChatSendForm from "../components/Chat/ChatSendForm"
import Container from "../components/Layout/Container"

let stompClient
let subscription

function ChatRoom() {
  // stomp & user
  const { roomId } = useParams()
  const [userName, setUserName] = useRecoilState(currentUserName)
  const [messageList, setMessageList] = useState([])
  const textInputRef = useRef()
  const messageListRef = useRef()

  // 채팅방 구독
  const subscribe = () => {
    if (stompClient != null) {
      subscription = stompClient.subscribe(
        `/exchange/chat.exchange/room.${roomId}`,
        (content) => {
          const payload = JSON.parse(content.body)
          console.log(payload)
          const bubble = document.createElement("li")
          if (payload.senderName === userName) {
            bubble.classList.add(
              "bg-rose-200",
              "self-end",
              "mb-4",
              "p-2",
              "w-fit",
              "rounded-lg",
              "mr-12",
            )
          } else {
            bubble.classList.add(
              "border",
              "border-rose-300",
              "self-start",
              "mb-4",
              "p-2",
              "w-fit",
              "rounded-lg",
              "ml-12",
            )
          }
          bubble.textContent = payload.message
          const prof = document.createElement("span")
          prof.classList.add(
            "w-10",
            "h-10",
            "rounded-full",
            "absolute",
            "overflow-hidden",
            "bg-cover",
            "-mt-2",
          )
          if (payload.senderName === userName) {
            prof.classList.add("right-0")
          } else {
            prof.classList.add("left-0")
          }
          prof.style.backgroundImage = `url(${
            payload.senderImgSrc
              ? payload.senderImgSrc
              : "https://via.placeholder.com/50"
          })`
          bubble.appendChild(prof)
          messageListRef.current.appendChild(bubble)
        },
      )
    }
  }

  useEffect(() => {
    // stompClient 생성
    stompClient = new StompJs.Client({
      brokerURL: "ws://52.78.188.101:61613/stomp/chat",
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
      onDisconnect: () => {
        disConnect()
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })
    stompClient.webSocketFactory = function () {
      return new SockJS("http://52.78.188.101:8080/stomp/chat")
    }

    stompClient.activate()

    // 컴포넌트 언마운트 될 때 웹소켓 연결을 끊기
    return () => {
      disConnect()
    }
  }, [])

  function disConnect() {
    stompClient.deactivate()
    subscription.unsubscribe()
    console.log("연결 끊어짐")
  }

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
        <ChatContainer
          messageList={messageList}
          userName={userName}
          messageListRef={messageListRef}
        />

        {/* 채팅 보내는 부분 */}
        <ChatSendForm handleSubmit={handleSubmit} textInputRef={textInputRef} />
      </Container>
    </>
  )
}

export default ChatRoom
