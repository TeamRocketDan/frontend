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
import MyFeedListPage from "./pages/MyFeedListPage"
import DetailedFeedPage from "./pages/DetailedFeedPage"

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
        <Route path="/myfeedlist" element={<MyFeedListPage />} />
        <Route path="/createfeed" element={<CreateFeedPage />} />
        <Route path="/detailedfeed/:feedId" element={<DetailedFeedPage />} />

        {/* login redirect */}
        <Route path="/oauth2/redirect" element={<LoginRedirect />}></Route>
      </Routes>
    </>
  )
}

export default App
