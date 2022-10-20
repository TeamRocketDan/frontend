import { Link } from "react-router-dom"

function ChatListContainer({ roomList }) {
  return (
    <ul>
      {roomList.map((room) => (
        <li key={room.roomId}>
          <Link to={`/chatroom/${room.roomId}`}>{room.title}</Link>
        </li>
      ))}
    </ul>
  )
}

export default ChatListContainer
