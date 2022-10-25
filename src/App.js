import { Route, Routes } from "react-router-dom"

import Header from "./components/Header/Header"

import FeedList from "./pages/FeedList"
import Login from "./pages/Login"
import MyPage from "./pages/MyPage"
import ChatListPage from "./pages/ChatListPage"
import ChatRoom from "./pages/ChatRoom"

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<FeedList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/chatlist" element={<ChatListPage />} />
        <Route path="/chatroom/:roomId" element={<ChatRoom />} />
      </Routes>
    </>
  )
}

export default App
