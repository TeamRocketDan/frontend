import React, { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useRecoilState } from "recoil"
import axios from "axios"
import styled from "styled-components"
import Pagination from "react-js-pagination"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import Container from "../components/Layout/Container"
import { faMap } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import HeartButton from "../components/Feed/HeartButton"
import CommentHeartButton from "../components/Feed/CommentHeartButton"

import { DEFAULT_API } from "../apis"
import { getUserToken } from "../utils/getUserToken"
import { useCheckLogin } from "../hooks/useCheckLogin"
import { isUserLoggedIn } from "../recoil/userAuth"

function DetailedFeedPage() {
  // 로그인 안했으면 로그인 페이지로
  useCheckLogin()
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isUserLoggedIn)

  const { feedId } = useParams()
  const navigate = useNavigate()
  const commentTextareaRef = useRef()

  // class names
  const titleClass =
    "my-4 px-2 font-semibold text-2xl inline-block relative before:block before:absolute before:left-0 before:bottom-0 before:bg-rose-400 before:h-3 before:w-full before:opacity-30"

  // 슬라이드 setting
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  // 페이지네이션
  const [page, setPage] = useState(1)
  const handlePageChange = (page) => {
    setPage(page)
  }
  useEffect(() => {
    if (isLoggedIn) {
      getCommentList()
    }
  }, [page])

  const [feedInfo, setFeedInfo] = useState([]) // 피드
  const [feedsImages, setFeedsImages] = useState([]) // 피드 이미지 리스트
  const [comment, setComment] = useState("") // 코멘트
  const [commentCount, setCommentCount] = useState(0)
  const [editComments, setEditComments] = useState("") // 코멘트 수정
  const [commentList, setCommentList] = useState([]) // 코멘트 리스트
  const [feedLike, setFeedLike] = useState(true) // 피드 좋아요
  const [commentLike, setCommentLike] = useState(false) // 코멘트 좋아요
  const [commentContents, setCommentContents] = useState([]) // 코멘트 내용
  const [userId, setUserId] = useState("") // 사용 중인 유저 ID
  const [follow, setFollow] = useState(false) // 팔로잉 여부
  const [commentLengthCount, setCommentLengthCount] = useState(0) // 코멘트 생성 글자 수
  const [editCommentLengthCount, setEditCommentLengthCount] = useState(0) // 코멘트 수정 글자 수

  const getCommentLike = (props) => {
    const newCommentLike = []
    props.forEach((comment) => {
      newCommentLike.push(comment.likeFeedComment)
    })
    setCommentLike([...commentLike, ...newCommentLike])
  }

  const getCommentContents = (props) => {
    const newContents = []
    props.forEach((content) => {
      newContents.push(content.content)
    })
    setCommentContents([...commentContents, ...newContents])
  }

  // 피드 좋아요
  const onChangeFeedLike = async () => {
    const token = await getUserToken()

    axios
      .post(`${DEFAULT_API}/api/v1/feeds/${feedId}/like`, null, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("I Like this post")
        setFeedLike(true)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // 피드 좋아요 취소
  const onChangeCancelFeedLike = async () => {
    const token = await getUserToken()

    axios
      .delete(`${DEFAULT_API}/api/v1/feeds/${feedId}/like`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("Cancel Like")
        setFeedLike(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // 코멘트 좋아요
  const onChangeCommentLike = async (commentsId) => {
    const token = await getUserToken()

    axios
      .post(
        `${DEFAULT_API}/api/v1/feeds/${feedId}/comments/${commentsId}/like`,
        null,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        },
      )
      .then((res) => {
        console.log("I like this comment")
        getCommentList()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // 코멘트 좋아요 취소
  const onChangeCancelCommentLike = async (commentsId) => {
    const token = await getUserToken()

    axios
      .delete(
        `${DEFAULT_API}/api/v1/feeds/${feedId}/comments/${commentsId}/like`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        },
      )
      .then((res) => {
        console.log("Cancel Comment Like")
        getCommentList()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // 피드 수정
  const editFeed = () => {
    navigate(`/editfeed/${feedId}`)
  }

  // 피드 삭제
  const deleteFeed = async () => {
    const token = await getUserToken()

    axios
      .delete(`${DEFAULT_API}/api/v1/feeds/${feedId}`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        console.log("Delete feed success")
        alert("피드를 성공적으로 삭제하였습니다")
        navigate("/myFeedList")
      })
      .catch((err) => console.log(err))
  }

  // get comment list
  const getCommentList = async () => {
    try {
      const token = await getUserToken()
      const res = await axios.get(
        `${DEFAULT_API}/api/v1/feeds/${feedId}/comments?page=${
          page - 1
        }&size=10`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        },
      )
      console.log("[GET COMMENT LIST] : ", res)
      if (res.data.success) {
        setComment(res.data.result)
        setCommentCount(res.data.result.totalElements)
        setCommentList(res.data.result.content)
        getCommentLike(res.data.result.content)
        getCommentContents(res.data.result.content)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      const token = getUserToken().then((token) => {
        axios
          .get(`${DEFAULT_API}/api/v1/feeds/${feedId}`, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            setFeedLike(res.data.result.likeFeed)
            setFeedInfo(res.data.result)
            setFeedsImages(res.data.result.feedImages)
            setFollow(res.data.result.follow)
          })
          .catch((err) => {
            console.log(err)
          })
        axios
          .get(`${DEFAULT_API}/api/v1/users/mypage`, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            setUserId(res.data.result.userId)
          })
          .catch((err) => {
            console.log(err)
          })
      })

      getCommentList()
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      const token = getUserToken().then((token) => {
        axios
          .get(`${DEFAULT_API}/api/v1/feeds/${feedId}`, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            setFeedLike(res.data.result.likeFeed)
            setFeedInfo(res.data.result)
            setFollow(res.data.result.follow)
          })
          .catch((err) => console.log(err))
      })
    }
  }, [feedLike])

  // 코멘트 데이터 생성시
  const onChangeComment = (e) => {
    const text = e.target.value
    setComment(text)
    setCommentLengthCount(text.length)
  }

  // 코멘트 데이터 수정시
  const onChangeEditComment = (e) => {
    setEditComments(e.target.value)

    const text = e.target.value
    setEditCommentLengthCount(text.length)
  }

  // 코멘트 생성
  const postComment = async (e) => {
    e.preventDefault()

    if (comment.length > 1000) {
      alert("댓글은 최대 1000자까지 입력 가능합니다.")
      return false
    }

    const formData = new FormData()
    const variable = {
      comment: comment,
    }

    formData.append(
      "feedComment",
      new Blob([JSON.stringify(variable)], { type: "application/json" }),
    )

    const token = await getUserToken()
    axios
      .post(`${DEFAULT_API}/api/v1/feeds/${feedId}/comments`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("Post Comment Success!")
        getCommentList()
        commentTextareaRef.current.value = ""
        setComment("")
        setCommentLengthCount(0)
      })
      .catch((err) => console.log(err))
  }

  // 코멘트 수정
  const editComment = async (commentsId) => {
    const formData = new FormData()
    const variable = {
      comment: editComments,
    }

    formData.append(
      "feedComment",
      new Blob([JSON.stringify(variable)], { type: "application/json" }),
    )

    const token = await getUserToken()

    axios
      .patch(
        `${DEFAULT_API}/api/v1/feeds/${feedId}/comments/${commentsId}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then((res) => {
        console.log("Edit Comment Success")
        getCommentList()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // 코멘트 삭제
  const deleteComment = async (commentsId) => {
    const token = getUserToken().then((token) => {
      axios
        .delete(
          `${DEFAULT_API}/api/v1/feeds/${feedId}/comments/${commentsId}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          },
        )
        .then((res) => {
          console.log(`Delete ${res.data.result.feedCommentId} comment`)
          getCommentList()
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }

  // 유저 팔로잉
  const following = async () => {
    const token = await getUserToken()
    axios
      .post(`${DEFAULT_API}/api/v1/users/${feedInfo.userId}/following`, null, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("팔로잉 성공")
        setFollow(true)
      })
      .catch((err) => console.log(err))
  }

  // 유저 팔로잉 취소
  const cancelFollowing = async () => {
    const token = await getUserToken()
    axios
      .delete(`${DEFAULT_API}/api/v1/users/${feedInfo.userId}/following`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("팔로잉 취소")
        setFollow(false)
      })
      .catch((err) => console.log(err))
  }

  return (
    <Container>
      <h3 className={titleClass}>
        피드 <FontAwesomeIcon icon={faMap} />
      </h3>

      <div className="rounded overflow-hidden border w-full p-5 mb-5">
        <div className="w-full flex justify-between mb-3">
          <div className="flex items-center">
            <div className="rounded-full h-16 w-16 bg-gray-500 flex items-center justify-center overflow-hidden">
              <img src={feedInfo.profileImagePath} alt="profilepicture" />
            </div>
            <span className="ml-4 font-bold text-xl text-center">
              {feedInfo.nickname}
            </span>
            <span>
              {userId === parseInt(feedInfo.userId) ? (
                ""
              ) : follow ? (
                <button
                  className="ml-4 text-sl text-center"
                  onClick={() => {
                    cancelFollowing()
                  }}
                >
                  팔로잉
                </button>
              ) : (
                <button
                  className="ml-4 text-sl text-center"
                  onClick={() => {
                    following()
                  }}
                >
                  팔로우
                </button>
              )}
            </span>
          </div>
          <span className="px-2">
            <i className="fas fa-ellipsis-h pt-2 text-xs">
              {feedInfo.rcate1}, {feedInfo.rcate2}
            </i>
          </span>
        </div>
        <h3 className="text-3xl my-2 mx-1">{feedInfo.title}</h3>

        {/* feedsImages */}
        {/* //Slider 태그, 위에서 설정한 슬라이더가 나옴 */}
        {feedsImages.length > 0 ? (
          feedsImages.length !== 1 ? (
            <Wrap>
              <Slider {...settings}>
                {feedsImages.map((index) => (
                  <div key={index}>
                    <img
                      className="w-full object-contain max-h-96 mt-2"
                      alt="피드 이미지"
                      src={index}
                    />
                  </div>
                ))}
                {/* //Slider 안에 들어가는 내용(콘텐츠) */}
              </Slider>
            </Wrap>
          ) : (
            <img
              className="w-full object-contain max-h-96 mt-2"
              alt="피드 이미지"
              src={feedsImages[0]}
              key={feedsImages[0]}
            />
          )
        ) : (
          ""
        )}

        <div>
          <div className="pt-2">
            <i className="far fa-heart cursor-pointer"></i>

            <div className="flex items-center">
              <span className="mt-1">
                <HeartButton
                  like={feedLike}
                  onClick={feedLike ? onChangeCancelFeedLike : onChangeFeedLike}
                />
              </span>
              <span className="text-sm text-gray-400 font-medium ml-2">
                좋아요 {feedInfo.feedLikeCnt}개
              </span>

              {userId === parseInt(feedInfo.userId) ? (
                <span className="ml-auto shrink-0">
                  <button
                    className="bg-transparent hover:bg-rose-500 text-rose-500 font-semibold hover:text-white py-1 px-2 border border-rose-500 hover:border-transparent rounded mr-2"
                    onClick={editFeed}
                  >
                    피드 수정
                  </button>
                  <button
                    className="bg-transparent hover:bg-rose-500 text-rose-500 font-semibold hover:text-white py-1 px-2 border border-rose-500 hover:border-transparent rounded"
                    onClick={deleteFeed}
                  >
                    피드 삭제
                  </button>
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="my-5">
            <div className="mb-2 text-xl whitespace-pre-line">
              {feedInfo.content}
            </div>
          </div>
          <div className="text-sm mb-2 text-gray-400 cursor-pointer font-medium">
            {feedInfo.feedCommentCnt} comments
          </div>
        </div>

        <div className="w-full">
          {/* Comment List */}
          {commentList.map((index) => (
            <div className="comment-wrap bg-rose-50 p-2" key={index.commentId}>
              <div className="flex items-center w-full py-2">
                <div className="shrink-0 rounded-full h-8 w-8 mx-1 bg-gray-500 flex items-center justify-center overflow-hidden">
                  <img src={index.profileImagePath} alt="profilepicture" />
                </div>
                <span className="shrink-0 mx-2 font-bold text-sl text-center shrink-0">
                  {index.nickname}
                </span>

                <span className="shrink-0">
                  <CommentHeartButton
                    like={index.likeFeedComment}
                    onClick={() => {
                      index.likeFeedComment
                        ? onChangeCancelCommentLike(index.commentId)
                        : onChangeCommentLike(index.commentId)
                    }}
                  />
                </span>

                <span className="shrink-0 text-sm text-gray-400 font-medium mx-1">
                  좋아요 {index.commentLikeCnt}개
                </span>
                {userId === parseInt(index.userId) && (
                  <span className="comment-button-wrap ml-auto shrink-0">
                    <button
                      className="bg-white hover:bg-rose-500 text-rose-500 font-semibold hover:text-white py-1 px-2 mx-1 border border-rose-500 hover:border-transparent rounded"
                      onClick={(event) => {
                        event.target
                          .closest(".comment-wrap")
                          .querySelector(".comment")
                          .classList.add("hidden")
                        event.target
                          .closest(".comment-wrap")
                          .querySelector(".comment-edit")
                          .classList.remove("hidden")
                        event.target
                          .closest(".comment-wrap")
                          .querySelector(".comment-button-wrap")
                          .classList.add("hidden")
                        const currentComment = event.target
                          .closest(".comment-wrap")
                          .querySelector(".comment").innerText
                        event.target
                          .closest(".comment-wrap")
                          .querySelector(".comment-edit-textarea").innerText =
                          currentComment
                        setEditComments(currentComment)
                        setEditCommentLengthCount(currentComment.length)
                      }}
                    >
                      수정
                    </button>
                    <button
                      className="bg-white hover:bg-rose-500 text-rose-500 font-semibold hover:text-white py-1 px-2 mx-1 border border-rose-500 hover:border-transparent rounded"
                      onClick={() => {
                        deleteComment(index.commentId)
                      }}
                    >
                      삭제
                    </button>
                  </span>
                )}
              </div>

              {/* 코멘트 수정 폼*/}
              <form
                className="hidden comment-edit"
                onSubmit={(e) => {
                  e.preventDefault()

                  if (editComments.length > 1000) {
                    alert("댓글은 최대 1000자까지 입력 가능합니다.")
                    return false
                  } else {
                    editComment(index.commentId)

                    e.target
                      .closest(".comment-wrap")
                      .querySelector(".comment")
                      .classList.remove("hidden")
                    e.target
                      .closest(".comment-wrap")
                      .querySelector(".comment-edit")
                      .classList.add("hidden")
                    e.target
                      .closest(".comment-wrap")
                      .querySelector(".comment-button-wrap")
                      .classList.remove("hidden")
                  }
                }}
              >
                <div className="w-full rounded-lg flex p-1 items-center">
                  <div className="mr-2 flex grow items-center border border-rose-400 rounded-lg overflow-hidden">
                    <label htmlFor="comment" className="sr-only">
                      Your comment
                    </label>
                    <textarea
                      id="edit"
                      rows="2"
                      className="comment-edit-textarea px-2 py-1 w-full text-sm text-gray-900 border-0 focus:ring-0 outline-0"
                      placeholder="Write a comment..."
                      required
                      onChange={onChangeEditComment}
                    ></textarea>
                  </div>

                  <div className="flex justify-between items-center">
                    {/* 글자수 확인 */}
                    <div className="text-rose-400 text-sm text-right">
                      {editCommentLengthCount} / 1000 자
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center ml-1 py-1 px-2 text-sm font-medium text-center text-white bg-rose-300 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-rose-500"
                    >
                      완료
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center ml-1 py-1 px-2 text-sm font-medium text-center text-white bg-rose-300 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-rose-500"
                      onClick={(e) => {
                        e.target
                          .closest(".comment-wrap")
                          .querySelector(".comment")
                          .classList.remove("hidden")
                        e.target
                          .closest(".comment-wrap")
                          .querySelector(".comment-edit")
                          .classList.add("hidden")
                        e.target
                          .closest(".comment-wrap")
                          .querySelector(".comment-button-wrap")
                          .classList.remove("hidden")
                      }}
                    >
                      취소
                    </button>
                  </div>
                </div>
              </form>

              {/* 코멘트 내용 */}
              <div className="comment text-sl mx-2 pb-2">{index.comment}</div>
            </div>
          ))}

          {commentList.length > 0 && (
            <PaginationBox>
              <Pagination
                activePage={page}
                totalItemsCount={commentCount}
                itemsCountPerPage={10}
                pageRangeDisplayed={3}
                prevPageText={"‹"}
                nextPageText={"›"}
                onChange={handlePageChange}
              />
            </PaginationBox>
          )}
        </div>
        {/* Comment https://flowbite.com/docs/forms/textarea/ */}
        <form onSubmit={postComment}>
          <div className="w-full bg-rose-50 rounded-lg border border-rose-400 mt-2">
            <div className="py-2 px-4 bg-white rounded-t-lg">
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                id="comment"
                rows="4"
                className="px-0 w-full text-sm text-gray-900 bg-white border-0 focus:ring-0 placeholder-gray-400 outline-0"
                placeholder="Write a comment..."
                required
                onChange={onChangeComment}
                ref={commentTextareaRef}
              ></textarea>
            </div>

            <div className="flex justify-between items-center py-2 px-3 border-t border-rose-200">
              <button
                type="submit"
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-rose-300 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-rose-500"
              >
                Post comment
              </button>
              {/* 글자수 확인 */}
              <div className="text-rose-400 text-sm text-right">
                {commentLengthCount} / 1000 자
              </div>
            </div>
          </div>
        </form>
      </div>
    </Container>
  )
}

const Wrap = styled.div`
  margin: 50px auto;
  width: calc(100% - 78px);
  .slick-prev {
    left: -36px;
  }
  .slick-next {
    right: -36px;
  }
  .slick-prev,
  .slick-next {
    width: 32px;
    height: 32px;
  }
  .slick-prev:before {
    opaicty: 1; // 기존에 숨어있던 화살표 버튼이 보이게
    color: rgba(244, 63, 94, 1);
    font-size: 32px;
  }
  .slick-next:before {
    opacity: 1;
    color: rgba(244, 63, 94, 1);
    font-size: 32px;
  }
`

const PaginationBox = styled.div`
  .pagination {
    display: flex;
    justify-content: center;
    margin: 28px 0;
  }
  ul {
    list-style: none;
    padding: 0;
    display: flex;
  }
  ul.pagination li {
    margin: 0 0.3rem;
    width: 30px;
    height: 30px;
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgba(244, 63, 94, 1);
  }
  ul.pagination li:nth-child(1),
  ul.pagination li:nth-child(2),
  ul.pagination li:nth-last-child(1),
  ul.pagination li:nth-last-child(2) {
    background-color: rgba(244, 63, 94, 0.3);
  }
  ul.pagination li:nth-child(1) a,
  ul.pagination li:nth-child(2) a,
  ul.pagination li:nth-last-child(1) a,
  ul.pagination li:nth-last-child(2) a {
    position: absolute;
    line-height: 1;
    top: -2px;
    font-size: 20px;
  }

  ul.pagination li:nth-child(1).disabled,
  ul.pagination li:nth-child(2).disabled,
  ul.pagination li:nth-last-child(1).disabled,
  ul.pagination li:nth-last-child(2).disabled {
    opacity: 0.4;
    pointer-events: none;
  }
  ul.pagination li a {
    width: 30px;
    height: 30px;
    text-decoration: none;
    color: rgb(244 63 94);
    font-size: 1rem;
    line-height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ul.pagination li.active a {
    color: white;
    background-color: rgba(244, 63, 94, 1);
  }
`

export default DetailedFeedPage
