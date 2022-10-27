import ChatBubble from "./ChatBubble"

function ChatContainer({ messageListRef }) {
  return (
    <>
      {/* chat bubbles */}
      <ul
        className="flex flex-col pt-4 overflow-y-scroll relative"
        ref={messageListRef}
      >
        {/* {messageList.map((chat, index) => (
          <ChatBubble
            key={index}
            sender={chat.senderName === userName ? "me" : "other"}
            profImage={"https://via.placeholder.com/50"}
          >
            {chat.message}
          </ChatBubble>
        ))} */}
      </ul>
    </>
  )
}

export default ChatContainer
