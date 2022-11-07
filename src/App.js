import { Route, Routes } from "react-router-dom"

import Header from "./components/Header/Header"

import FeedList from "./pages/FeedList"
import Login from "./pages/Login"
import MyPage from "./pages/MyPage"
import ChatListPage from "./pages/ChatListPage"
import CreateChatPage from "./pages/CreateChatPage"
import ChatRoom from "./pages/ChatRoom"
import LoginRedirect from "./pages/LoginRedirect"
import CreateFeed from "./pages/CreateFeed"

import MyFeedListPage from "./pages/MyFeedListPage"
import DetailedFeed from "./pages/DetailedFeed"
import EditFeed from "./pages/EditFeed"

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<FeedList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/chatlist" element={<ChatListPage />} />
        <Route path="/createchat" element={<CreateChatPage />} />
        <Route path="/chatroom/:roomId" element={<ChatRoom />} />
        <Route path="/createfeed" element={<CreateFeed />} />
        <Route path="/myfeedlist" element={<MyFeedListPage />} />
        <Route path="/detailedfeed/:feedId" element={<DetailedFeed />} />
        <Route path="/editfeed/:feedId" element={<EditFeed />} />

        {/* login redirect */}
        <Route path="/oauth2/redirect" element={<LoginRedirect />}></Route>
      </Routes>
    </>
  )
}

export default App
