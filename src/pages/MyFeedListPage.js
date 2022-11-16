import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"
import { useRecoilState } from "recoil"
import Container from "../components/Layout/Container"
import FeedListMap from "../components/Map/FeedListMap"
import ChatListPagination from "../components/Chat/ChatListPagination"

import Card from "../components/FeedList/Card"

import { faMap } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { getUserToken } from "../utils/getUserToken"
import { selectedRegion01, selectedRegion02 } from "../recoil/regionState"

import { DEFAULT_API } from "../apis"

function MyFeedListPage() {
  // class names
  const titleClass =
    "my-4 px-2 font-semibold text-2xl inline-block relative before:block before:absolute before:left-0 before:bottom-0 before:bg-rose-400 before:h-3 before:w-full before:opacity-30"

  // 피드 리스트
  const [myFeedList, setMyFeedList] = useState([])
  const [positionData, setPositionData] = useState([])

  // 페이지네이션 관련
  const [searchParams, setSearchParams] = useSearchParams()
  const [myListMaxPage, setMyListMaxPage] = useState(1)
  const myListPage = parseInt(searchParams.get("mylistpage") ?? "1", 10)
  const [pageSize, setPageSize] = useState(10)

  function updateParams(updates) {
    setSearchParams({
      mylistpage: parseInt(searchParams.get("mylistpage") ?? "1", 10),
      ...updates,
    })
  }

  // 헤더에서 선택한 지역 정보
  const [rcate1, setRcate1] = useRecoilState(selectedRegion01)
  const [rcate2, setRcate2] = useRecoilState(selectedRegion02)

  // 지역 선택이 바뀌면 현재 페이지 초기화
  useEffect(() => {
    updateParams({
      mylistpage: 1,
    })
  }, [rcate2])

  // 피드 페이지네이션 사이즈 변경
  function getWindowSize() {
    const width = window.innerWidth

    if (width <= 768) {
      setPageSize(6)
    } else if (width <= 1024) {
      setPageSize(8)
    } else if (width <= 1280) {
      setPageSize(10)
    } else if (width <= 1536) {
      setPageSize(10)
    } else {
      setPageSize(12)
    }
  }
  useEffect(() => {
    getWindowSize()
    window.addEventListener("resize", getWindowSize)
    return function () {
      window.removeEventListener("resize", getWindowSize)
    }
  }, [])

  // 피드 리스트 받아오기
  async function getFeeds({ page, size, rcate1, rcate2 }) {
    if ((rcate1 === "" && rcate2 === "") || (rcate1 !== "" && rcate2 !== "")) {
      const token = await getUserToken()

      try {
        const response = await axios.get(
          `${DEFAULT_API}/api/v1/feeds/feedList`,
          {
            params: {
              page,
              size,
              rcate1,
              rcate2,
            },
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          },
        )

        return response
      } catch (error) {
        console.log(error)
      }
    } else {
      return
    }
  }

  useEffect(() => {
    // 피드 리스트 가져오기
    async function getMyList() {
      const myFeedList = await getFeeds({
        page: myListPage - 1,
        size: 12,
        rcate1,
        rcate2,
      })
      const result = myFeedList.data.result
      setMyFeedList(result.content)
      setMyListMaxPage(result.totalPage)
    }

    getMyList()
  }, [myListPage, rcate2])

  // 지도 표시 리스트
  useEffect(() => {
    const newPositions = []
    myFeedList.forEach((feed) =>
      newPositions.push({
        lat: feed.latitude,
        lng: feed.longitude,
      }),
    )

    setPositionData(newPositions)
  }, [myFeedList])

  return (
    <Container>
      {/* 지도에 피드 위치 표시 */}
      <FeedListMap positionData={positionData} />

      <h3 className={titleClass}>
        나의 여행 <FontAwesomeIcon icon={faMap} />
      </h3>
      {myFeedList.length === 0 ? (
        <div>
          <h3>( ˃̣̣̥᷄⌓˂̣̣̥᷅ ) 피드가 없다냥!</h3>
        </div>
      ) : (
        <div className="flex flex-wrap -m-4 w-full mx-auto">
          {myFeedList.map((index) => (
            <Card
              key={index.feedId}
              feedId={index.feedId}
              imageSrc={index.feedImages[0]}
              location={index.rcate1}
              title={index.title}
              desc={index.content}
              liked={index.feedLikeCnt}
              reply={index.feedCommentCnt}
            />
          ))}
        </div>
      )}

      <ChatListPagination
        maxPage={myListMaxPage}
        currentPage={myListPage}
        onClickPageButton={(pageNumber) =>
          updateParams({ mylistpage: pageNumber })
        }
      />
    </Container>
  )
}

export default MyFeedListPage
