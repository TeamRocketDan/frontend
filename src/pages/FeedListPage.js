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

function FeedListPage() {
  // class names
  const titleClass =
    "my-4 px-2 font-semibold text-2xl inline-block relative before:block before:absolute before:left-0 before:bottom-0 before:bg-rose-400 before:h-3 before:w-full before:opacity-30"

  const [positionData, setPositionData] = useState([])
  const [feedList, setFeedList] = useState([])

  // 페이지네이션 관련
  const [searchParams, setSearchParams] = useSearchParams()
  const [listMaxPage, setListMaxPage] = useState(1)
  const [regionListMaxPage, setRegionListMaxPage] = useState(1)
  const listPage = parseInt(searchParams.get("listPage") ?? "1", 10)
  const regionListPage = parseInt(searchParams.get("regionlistpage") ?? "1", 10)

  function updateParams(updates) {
    setSearchParams({
      listPage: searchParams.get("listPage"),
      regionlistpage: searchParams.get("regionlistpage"),
      ...updates,
    })
  }

  // 헤더에서 선택한 지역 정보
  const [rcate1, setRcate1] = useRecoilState(selectedRegion01)
  const [rcate2, setRcate2] = useRecoilState(selectedRegion02)

  // 피드 리스트 받아오기
  async function getFeeds({ page, size }) {
    console.log(`page: ${page}`)
    console.log(`size: ${size}`)
    console.log(`rcate1: ${rcate1}`)
    console.log(`rcate2: ${rcate2}`)

    try {
      const response = await axios.get(`${DEFAULT_API}/api/v1/feeds`, {
        params: {
          page,
          size,
          rcate1,
          rcate2,
        },
        headers: {
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
      console.log(result)
      setRegionListMaxPage(result.totalPage)
    }
    if (rcate2 !== "") {
      getRegionList()
    }

    async function getList() {
      const feedList = await getFeeds({
        page: listPage - 1,
        size: 10,
        rcate1,
        rcate2,
      })
      const result = feedList.data.result
      console.log(result)
      setFeedList(result.content)
    }

    getList()
  }, [listPage, regionListPage, rcate2])

  // 지도 표시 리스트
  useEffect(() => {
    const newPositions = []
    feedList.forEach((feed) =>
      newPositions.push({
        lat: feed.latitude,
        lng: feed.longitude,
      }),
    )

    setPositionData(newPositions)
  }, [feedList])

  return (
    <Container>
      {/* 지도에 채팅 위치 표시 */}
      <FeedListMap positionData={positionData} />

      <h3 className={titleClass}>
        피드 리스트 <FontAwesomeIcon icon={faMap} />
      </h3>

      {feedList.map((index) => (
        <div className="flex flex-wrap -m-4">
          <Card
            feedId={index.feedId}
            profile={index.profileImagePath}
            imageSrc={index.feedImages}
            location={index.rcate1}
            title={index.title}
            desc={index.content}
            liked={index.feedLikeCnt}
            reply={index.feedCommentCnt}
          />
        </div>
      ))}

      <ChatListPagination
        maxPage={listMaxPage}
        currentPage={listPage}
        onClickPageButton={(pageNumber) =>
          updateParams({ regionlistpage: pageNumber })
        }
      />
    </Container>
  )
}

export default FeedListPage
