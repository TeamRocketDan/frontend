import { Route, Routes } from "react-router-dom"

import Header from "./components/Header/Header"

import FeedList from "./pages/FeedList"
import ChatList from "./pages/ChatList"
import Login from "./pages/Login"
import MyPage from "./pages/MyPage"

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<FeedList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/chatlist" element={<ChatList />} />
      </Routes>
    </>
  )
}

export default App
