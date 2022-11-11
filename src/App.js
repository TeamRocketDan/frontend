import { Route, Routes } from "react-router-dom"

import Header from "./components/Header/Header"

import FeedListPage from "./pages/FeedListPage"
import LoginPage from "./pages/LoginPage"
import MyPage from "./pages/MyPage"
import ChatListPage from "./pages/ChatListPage"
import CreateChatPage from "./pages/CreateChatPage"
import ChatRoom from "./pages/ChatRoom"
import LoginRedirect from "./pages/LoginRedirect"
import CreateFeedPage from "./pages/CreateFeedPage"


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<FeedListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/chatlist" element={<ChatListPage />} />
        <Route path="/createchat" element={<CreateChatPage />} />
        <Route path="/chatroom/:roomId" element={<ChatRoom />} />

        {/* login redirect */}
        <Route path="/oauth2/redirect" element={<LoginRedirect />}></Route>
      </Routes>
    </>
  )
}

export default App
