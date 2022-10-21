import ChatBubble from "./ChatBubble"

function ChatContainer({ message, user }) {
  return (
    <>
      {/* chat bubbles */}
      <ul className="flex flex-col pt-4 overflow-y-scroll relative">
        {message.map((chat, index) => (
          <ChatBubble
            key={index}
            sender={chat.sender === user ? "me" : "other"}
            profImage={"https://via.placeholder.com/50"}
          >
            {chat.content}
          </ChatBubble>
        ))}
      </ul>
    </>
  )
}

export default ChatContainer
