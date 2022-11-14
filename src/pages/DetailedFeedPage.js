import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import styled from "styled-components"
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

function DetailedFeedPage() {
  const { feedId } = useParams()
  const navigate = useNavigate()

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

  const [feedInfo, setFeedInfo] = useState([]) // 피드
  const [feedsImages, setFeedsImages] = useState([]) // 피드 이미지 리스트
  const [comment, setComment] = useState("") // 코멘트
  const [editComments, setEditComments] = useState("") // 코멘트 수정
  const [commentList, setCommentList] = useState([]) // 코멘트 리스트
  const [feedLike, setFeedLike] = useState(true) // 피드 좋아요
  const [commentLike, setCommentLike] = useState(false) // 코멘트 좋아요
  const [commentContents, setCommentContents] = useState([]) // 코멘트 내용
  const [followingList, setFollowingList] = useState([]) // 유저가 팔로잉하고 있는 아이디 리스트
  const [follow, setFollow] = useState(false) // 팔로우 여부
  const [userId, setUserId] = useState("") // 사용 중인 유저 ID

  const getCommentLike = (props) => {
    props.map((index) => {
      setCommentLike(...commentLike, index.likeFeedComment)
    })
  }

  const getCommentContents = (props) => {
    props.map((index) => {
      setCommentContents(...commentContents, index.content)
    })
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
        // console.log("피드 좋아요 에러")
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
        // console.log("피드 좋아요 취소 에러")
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
        setCommentLike(!commentLike)
      })
      .catch((err) => {
        // console.log("코멘트 좋아요 에러")
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
        setCommentLike(!commentLike)
      })
      .catch((err) => {
        // console.log("코멘트 좋아요 취소 에러")
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

  useEffect(() => {
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
        })
        .catch((err) => {
          console.log(err)
        })
      axios
        .get(`${DEFAULT_API}/api/v1/feeds/${feedId}/comments`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setCommentList(res.data.result.content)
          getCommentLike(commentList)
          getCommentContents(commentList)
        })
        .catch((err) => {
          console.log(err)
        })
      axios
        .get(`${DEFAULT_API}/api/v1/users/following`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          res.data.result.content.map((index) => {
            setFollowingList(...followingList, index.userId)
          })
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
  }, [])

  useEffect(() => {
    const token = getUserToken().then((token) => {
      axios
        .get(`${DEFAULT_API}/api/v1/feeds/${feedId}`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          // console.log(res.data.result)
          setFeedLike(res.data.result.likeFeed)
          setFeedInfo(res.data.result)
        })
        .catch((err) => console.log(err))
    })
  }, [feedLike])

  useEffect(() => {
    const token = getUserToken().then((token) => {
      axios
        .get(`${DEFAULT_API}/api/v1/feeds/${feedId}/comments`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setCommentList(res.data.result.content)
        })
        .catch((err) => console.log(err))
    })
  }, [commentLike, commentContents])

  // 코멘트 데이터 생성시
  const onChangeComment = (e) => {
    setComment(e.target.value)
  }

  // 코멘트 데이터 수정시
  const onChangeEditComment = (e) => {
    setEditComments(e.target.value)
  }

  // 코멘트 생성
  const postComment = async (e) => {
    e.preventDefault()
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
        // 경로 수정 여부 확인
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("Post Comment Success!")
        // console.log(res)
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
        // console.log(res)
      })
      .catch((err) => {
        // console.log("코멘트 수정 에러")
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
        })
        .catch((err) => {
          // console.log("코멘트 삭제 에러")
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

      <div className="rounded overflow-hidden border w-full">
        <div className="w-full flex justify-between p-3">
          <div className="flex">
            <div className="rounded-full h-16 w-16 bg-gray-500 flex items-center justify-center overflow-hidden">
              <img src={feedInfo.profileImagePath} alt="profilepicture" />
            </div>
            <span className="pt-1 mt-4 ml-4 font-bold text-xl text-center">
              {feedInfo.nickname}
            </span>
            <span>
              {follow ? (
                <button
                  className="pt-1 mt-5 ml-4 text-sl text-center"
                  onClick={() => {
                    cancelFollowing()
                  }}
                >
                  팔로잉
                </button>
              ) : (
                <button
                  className="pt-1 mt-5 ml-4 text-sl text-center"
                  onClick={() => {
                    following()
                  }}
                >
                  팔로우
                </button>
              )}
            </span>
          </div>
          <span className="px-2 rounded">
            <i className="fas fa-ellipsis-h pt-2 text-xs">
              {feedInfo.rcate1}, {feedInfo.rcate2}
            </i>
          </span>
        </div>
        <h3 className="text-3xl ml-2">{feedInfo.title}</h3>

        {/* feedsImages */}
        {/* //Slider 태그, 위에서 설정한 슬라이더가 나옴 */}
        {feedsImages.length > 0 ? (
          feedsImages.length !== 1 ? (
            <Wrap>
              <Slider {...settings}>
                {feedsImages.map((index) => (
                  <div key={index}>
                    <img
                      className="w-full bg-cover object-contain max-h-96 mt-2"
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
              className="w-full bg-cover object-contain max-h-96 mt-2"
              alt="피드 이미지"
              src={feedsImages[0]}
              key={feedsImages[0]}
            />
          )
        ) : (
          ""
        )}

        <div className="px-3 pb-2">
          <div className="pt-2">
            <i className="far fa-heart cursor-pointer"></i>

            <div className="flex flex-wrap">
              <span className="mt-1">
                <HeartButton
                  like={feedLike}
                  onClick={feedLike ? onChangeCancelFeedLike : onChangeFeedLike}
                />
              </span>
              {userId == feedInfo.userId ? (
                <span className="">
                  <button
                    className="bg-transparent hover:bg-rose-500 text-rose-500 font-semibold hover:text-white py-2 px-2 border border-rose-500 hover:border-transparent rounded"
                    onClick={editFeed}
                  >
                    피드 수정
                  </button>
                  <button
                    className="bg-transparent hover:bg-rose-500 text-rose-500 font-semibold hover:text-white py-2 px-2 border border-rose-500 hover:border-transparent rounded"
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
          <div className="pt-1">
            <span className="text-sm text-gray-400 font-medium">
              좋아요 {feedInfo.feedLikeCnt}개
            </span>
          </div>
          <div className="pt-1">
            <div className="mb-2 text-xl">{feedInfo.content}</div>
          </div>
          <div className="text-sm mb-2 text-gray-400 cursor-pointer font-medium">
            {feedInfo.feedCommentCnt} comments
          </div>
        </div>

        <div>
          {/* Comment List */}
          {commentList.map((index) => (
            <div className="comment-wrap flex" key={index.commentId}>
              <div className="rounded-full h-8 w-8 bg-gray-500 flex items-center justify-center overflow-hidden">
                <img src={index.profileImagePath} alt="profilepicture" />
              </div>
              <span className="pt-2 ml-4 font-bold text-sl text-center">
                {index.nickname}
              </span>
              <span className="comment text-sl pt-1 ml-2">{index.comment}</span>

              {/* 코멘트 수정 폼*/}
              <form
                className="hidden comment-edit"
                onSubmit={() => editComment(index.commentId)}
              >
                <div className="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                  <div className="py-2 px-4 bg-white rounded-t-lg dark:bg-gray-800">
                    <label htmlFor="comment" className="sr-only">
                      Your comment
                    </label>
                    <textarea
                      id="edit"
                      rows="1"
                      className="px-0 w-full text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                      placeholder="Write a comment..."
                      required
                      onChange={onChangeEditComment}
                    ></textarea>
                  </div>

                  <div className="flex justify-between items-center py-2 px-3 border-t dark:border-gray-600">
                    <button
                      type="submit"
                      className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-rose-300 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-rose-500"
                    >
                      수정 완료
                    </button>
                  </div>
                </div>
              </form>

              <span>
                <CommentHeartButton
                  like={index.likeFeedComment}
                  onClick={() => {
                    index.likeFeedComment
                      ? onChangeCancelCommentLike(index.commentId)
                      : onChangeCommentLike(index.commentId)
                  }}
                />
              </span>

              <span className="">
                <span className="text-sm text-gray-400 font-medium">
                  좋아요 {index.commentLikeCnt}개
                </span>
                {userId === index.userId ? (
                  <span>
                    <button
                      className="bg-transparent hover:bg-rose-500 text-rose-500 font-semibold hover:text-white py-2 px-2 border border-rose-500 hover:border-transparent rounded"
                      onClick={(event) => {
                        // console.log(event.target)
                        event.target
                          .closest(".comment-wrap")
                          .querySelector(".comment")
                          .classList.add("hidden")
                        event.target
                          .closest(".comment-wrap")
                          .querySelector(".comment-edit")
                          .classList.remove("hidden")
                      }}
                    >
                      코멘트 수정
                    </button>
                    <button
                      className="bg-transparent hover:bg-rose-500 text-rose-500 font-semibold hover:text-white py-2 px-2 border border-rose-500 hover:border-transparent rounded"
                      onClick={() => {
                        deleteComment(index.commentId)
                      }}
                    >
                      코멘트 삭제
                    </button>
                  </span>
                ) : (
                  ""
                )}
              </span>
            </div>
          ))}
        </div>
        {/* Comment https://flowbite.com/docs/forms/textarea/ */}
        <form onSubmit={postComment}>
          <div className="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 mt-2">
            <div className="py-2 px-4 bg-white rounded-t-lg dark:bg-gray-800">
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                id="comment"
                rows="4"
                className="px-0 w-full text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Write a comment..."
                required=""
                onChange={onChangeComment}
              ></textarea>
            </div>

            <div className="flex justify-between items-center py-2 px-3 border-t dark:border-gray-600">
              <button
                type="submit"
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-rose-300 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-rose-500"
              >
                Post comment
              </button>
            </div>
          </div>
        </form>
      </div>
    </Container>
  )
}

const Wrap = styled.div`
  margin: 5% auto;
  width: 100%;
  .slick-prev:before {
    opaicty: 1; // 기존에 숨어있던 화살표 버튼이 보이게
    color: black; // 버튼 색은 검은색으로
    left: 0;
  }
  .slick-next:before {
    opacity: 1;
    color: black;
  }
`

export default DetailedFeedPage
