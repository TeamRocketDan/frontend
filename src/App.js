import { Route, Routes } from "react-router-dom"

import Header from "./components/Header"

import FeedList from "./pages/FeedList"
import ChatListPage from "./pages/ChatListPage"
import CreateChatPage from "./pages/CreateChatPage"
import ChatRoom from "./pages/ChatRoom"

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<FeedList />} />
        <Route path="/chatlist" element={<ChatListPage />} />
        <Route path="/createchat" element={<CreateChatPage />} />
        <Route path="/chatroom/:roomId" element={<ChatRoom />} />
      </Routes>
    </>
  )
}

export default App
