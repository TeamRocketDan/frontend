import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import SockJS from "sockjs-client"
import * as StompJs from "@stomp/stompjs"
import { useRecoilState } from "recoil"
import axios from "axios"

import {
  currentUserName,
  currentUserProf,
  currentUserId,
} from "../recoil/userAuth"

import ChatSendForm from "../components/Chat/ChatSendForm"
import Container from "../components/Layout/Container"
import ChatRoomHeader from "../components/Chat/ChatRoomHeader"

import { getUserToken } from "../utils/getUserToken"
import { createChatBubble } from "../utils/createChatBubble"
import { CHAT_API } from "../apis"
import { useCheckLogin } from "../hooks/useCheckLogin"

let stompClient
let subscription

function ChatRoom() {
  // stomp & user
  const { roomId } = useParams()
  const [userName, setUserName] = useRecoilState(currentUserName)
  const [userProf, setUserProf] = useRecoilState(currentUserProf)
  const [userId, setUserId] = useRecoilState(currentUserId)
  const textInputRef = useRef()
  const messageListRef = useRef()
  const [token, setToken] = useState("")
  const [participants, setParticipants] = useState([])
  const [roomTitle, setRoomTitle] = useState("")

  // 메세지 가져오기
  const [messagePage, setMessagePage] = useState(0)
  const scrollObserver = useRef()
  const [isMessageEnd, setIsMessageEnd] = useState(false)

  // room enter
  const [isEnterSuccess, setIsEnterSuccess] = useState(false)
  const navigate = useNavigate()

  // 채팅 헤더 높이
  const [headerHeight, setHeaderHeight] = useState(0)

  // 로그인 안했으면 로그인 페이지로
  useCheckLogin()

  // IO 생성
  function createIO() {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateMessagePage()
          console.log("IntersectionObserver Detected")
        }
      })
    }, {})
    io.observe(scrollObserver.current)
  }

  // 채팅방 구독
  function subscribe() {
    if (stompClient != null) {
      subscription = stompClient.subscribe(
        `/exchange/chat.exchange/room.${roomId}`,
        (content) => {
          const payload = JSON.parse(content.body)
          console.log(payload)

          if (payload.userId === 666) {
            getRoomInfo()
          }

          const bubble = createChatBubble({ payload, userId })
          messageListRef.current.appendChild(bubble)

          messageListRef.current.scrollTop = messageListRef.current.scrollHeight
        },
      )
    }
  }

  // room enter 방 입장
  async function roomEnter() {
    try {
      const token = await getUserToken()
      const response = await axios.patch(
        `${CHAT_API}/api/v1/chat/room-enter/${roomId}`,
        null,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        },
      )
      console.log("[ROOM ENTER] : ", response)
      if (response) {
        setIsEnterSuccess(true)
      }

      // 신규 유저일 경우 입장 메세지 stomp 연결 후에 보내야 한다
      console.log("신규 유저", response.data.result.newUser)
      if (response.data.result.newUser) {
        setTimeout(() => {
          sendEnterMessage()
        }, 500)
      }
    } catch (error) {
      console.log(error.response.data.errorMessage)
      if (
        error.response.data.errorMessage === "정원을 넘어 들어갈 수 없습니다."
      ) {
        window.alert("정원을 넘어 들어갈 수 없습니다.")
        navigate("/chatlist")
      }
    }
  }
  useEffect(() => {
    roomEnter()
  }, [])

  // 입장 메세지 보내기
  async function sendEnterMessage() {
    if (stompClient) {
      const token = await getUserToken()
      const message = {
        senderName: userName,
      }

      stompClient.publish({
        destination: `/pub/chat.enter.${roomId}.${userName}`,
        body: JSON.stringify(message),
        headers: {
          Authorization: token,
        },
      })
      console.log("입장 메세지 보냄")
    }
  }

  // stompClient 생성
  useEffect(() => {
    if (token !== "") {
      stompClient = new StompJs.Client({
        brokerURL: "ws://3.36.97.155:61613/stomp/chat",
        connectHeaders: {
          login: "user",
          passcode: "password",
          Authorization: token,
        },
        debug: function (str) {
          // console.log(str)
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
        return new SockJS("http://3.36.97.155:8080/stomp/chat")
      }

      stompClient.activate()
      textInputRef.current.focus()
    }

    // 컴포넌트 언마운트 될 때 웹소켓 연결을 끊기
    return () => {
      disConnect()
    }
  }, [token])

  // 채팅 연결 끊어질 때 chat-end 요청까지
  async function disConnect() {
    if (stompClient && subscription) {
      stompClient.deactivate()
      subscription.unsubscribe()
      console.log("채팅 연결 끊어짐")

      try {
        const responseEnd = await axios.patch(
          `${CHAT_API}/api/v1/chat/chat-end/${roomId}`,
          null,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          },
        )
        console.log("[CHAT END] : ", responseEnd)
      } catch (error) {
        console.log(error)
      }
    }
  }

  // 메세지 전송
  async function handleSubmit(event) {
    event.preventDefault()
    const input = event.target.querySelector("input")
    if (input.value === "") return

    const message = {
      message: input.value,
      userId,
      profileImage: userProf,
      senderName: userName,
    }

    const token = await getUserToken()

    stompClient.publish({
      destination: `/pub/chat.message.${roomId}`,
      body: JSON.stringify(message),
      headers: {
        Authorization: token,
      },
    })

    input.value = ""
    textInputRef.current.focus()
  }

  // 이전 메세지 가져오기
  async function getMessage() {
    const token = await getUserToken()

    const response = await axios.get(
      `${CHAT_API}/api/v1/chat/message/${roomId}?&page=${messagePage}&size=20`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      },
    )

    const prevList = response.data.result.content

    console.log("[GET MESSAGE] : ", response)

    prevList.forEach((payload) => {
      const bubble = createChatBubble({ payload, userId })
      scrollObserver.current.after(bubble)
    })

    // 처음 요청 후에 IO 생성
    if (messagePage === 0) {
      createIO()
    }

    // 채팅창 스크롤 이동 (메세지 로딩중 요소 안보일 정도만)
    // 첫 요청은 채팅방 들어갔을 때니까 가장 아래로
    if (messagePage <= 1) {
      messageListRef.current.scrollTo(0, messageListRef.current.scrollHeight)
    } else {
      messageListRef.current.scrollTo(0, 140)
    }

    // 마지막 날, 마지막 페이지일 때 => 메세지 끝(더 이상 불러오지 않음)
    if (response.data.result.lastDay && response.data.result.lastPage) {
      console.log("메세지 끝")
      setIsMessageEnd(true)
      scrollObserver.current.classList.add("hidden")
      // scrollObserver.current.remove()
    }
  }

  // 메세지가 끝이 아닐 때만 불러옴
  useEffect(() => {
    if (!isMessageEnd && isEnterSuccess) {
      getMessage()
    }
  }, [messagePage, isEnterSuccess])

  // get room info
  async function getRoomInfo() {
    const token = getUserToken()
    const response = await axios.get(
      `${CHAT_API}/api/v1/chat/room/info/${roomId}`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      },
    )

    console.log("[GET ROOM INFO] : ", response)

    setParticipants(response.data.result.participants)
    setRoomTitle(response.data.result.roomTitle)
  }

  // update messagePage
  function updateMessagePage() {
    setMessagePage((messagePage) => messagePage + 1)
  }

  // IntersectionObserver 생성, token, room info 불러오기
  useEffect(() => {
    if (isEnterSuccess) {
      async function getToken() {
        const newToken = await getUserToken()
        setToken(newToken)
      }

      getToken()

      getRoomInfo()
    }
  }, [isEnterSuccess])

  return (
    <>
      <Container>
        {/* 채팅방 나가기 버튼 */}
        <ChatRoomHeader
          roomId={roomId}
          stompClient={stompClient}
          userId={userId}
          userName={userName}
          disConnect={disConnect}
          participants={participants}
          roomTitle={roomTitle}
          setHeaderHeight={setHeaderHeight}
        />

        {/* 채팅 내용 나타나는 부분 */}
        <div
          className="w-full overflow-hidden relative"
          style={{
            height: `calc(100vh - 51px - ${headerHeight}px)`,
          }}
        >
          <ul
            className="scrollhide h-full flex flex-col py-4 overflow-y-scroll absolute top-0 left-0 bottom-0 right-0"
            ref={messageListRef}
          >
            <li
              ref={scrollObserver}
              className="h-20 flex mb-10 mt-auto text-rose-300 items-center justify-center"
            >
              ...메세지 로딩중...
            </li>
          </ul>
        </div>

        {/* 채팅 보내는 부분 */}
        <ChatSendForm handleSubmit={handleSubmit} textInputRef={textInputRef} />
      </Container>
    </>
  )
}

export default ChatRoom
