function ChatBubble({ profImage, sender, value }) {
  return (
    <li
      className={
        sender === "me"
          ? "bg-rose-200 self-end mb-4 p-2 w-fit rounded-lg mr-12"
          : "border border-rose-300 self-start mb-4 p-2 w-fit rounded-lg ml-12"
      }
    >
      {value}
      {/* 프로필 사진 */}
      <span
        className={`w-10 h-10 rounded-full absolute overflow-hidden bg-cover -mt-2 ${
          sender === "me" ? "right-0" : "left-0"
        }`}
        style={{ backgroundImage: `url(${profImage})` }}
      ></span>
    </li>
  )
}

export default ChatBubble
