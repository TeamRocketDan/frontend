import { Route, Routes } from "react-router-dom"

import Header from "./components/Header"

import FeedList from "./pages/FeedList"
import ChatList from "./pages/ChatList"

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<FeedList />} />
        <Route path="/chatlist" element={<ChatList />} />
      </Routes>
    </>
  )
}

export default App
