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
  const [regionListMaxPage, setRegionListMaxPage] = useState(1)
  const myListPage = parseInt(searchParams.get("mylistpage") ?? "1", 10)
  const regionListPage = parseInt(searchParams.get("regionlistpage") ?? "1", 10)

  function updateParams(updates) {
    setSearchParams({
      mylistpage: searchParams.get("mylistpage"),
      regionlistpage: searchParams.get("regionlistpage"),
      ...updates,
    })
  }

  // 헤더에서 선택한 지역 정보
  const [rcate1, setRcate1] = useRecoilState(selectedRegion01)
  const [rcate2, setRcate2] = useRecoilState(selectedRegion02)

  // 피드 리스트 받아오기
  async function getFeeds({ page, size }) {
    const token = await getUserToken()

    try {
      const response = await axios.get(`${DEFAULT_API}/api/v1/feeds/feedList`, {
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
      })

      return response
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // 피드 리스트 가져오기
    async function getRegionList() {
      const regionFeedList = await getFeeds({
        page: regionListPage - 1,
        size: 10,
        rcate1,
        rcate2,
      })
      const result = regionFeedList.data.result
      setRegionListMaxPage(result.totalPage)
    }
    if (rcate2 !== "") {
      getRegionList()
    }

    async function getMyList() {
      const myFeedList = await getFeeds({
        page: myListPage - 1,
        size: 10,
        rcate1,
        rcate2,
      })
      const result = myFeedList.data.result
      setMyFeedList(result.content)
    }

    getMyList()
  }, [myListPage, regionListPage, rcate2])

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
      <div className="flex flex-wrap -m-4">
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

      <ChatListPagination
        maxPage={myListMaxPage}
        currentPage={myListPage}
        onClickPageButton={(pageNumber) =>
          updateParams({ regionlistpage: pageNumber })
        }
      />
    </Container>
  )
}

export default MyFeedListPage
