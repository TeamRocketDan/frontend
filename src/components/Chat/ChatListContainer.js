import { Link } from "react-router-dom"

import { faCirclePlus, faLock, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function ChatListContainer({ roomList, isMyList }) {
  const listItemClass =
    "2xl:w-56 xl:w-56 lg:w-44 md:w-44 sm:w-44 w-full m-2 2xl:m-3 xl:m-3 lg:m-2.5 md:m-1 sm:m-2.5"
  const listLinkClass =
    "relative flex flex-col p-2.5 items-center justify-center rounded-lg shadow-xl hover:shadow-lg w-full h-64 text-center leading-relaxed"

  return (
    <ul className="flex flex-wrap">
      {/* 내 채팅 리스트 첫 번째는 채팅 생성 버튼 */}
      {isMyList && (
        <li className={listItemClass}>
          <Link
            to="/createchat"
            title="채팅방 생성"
            className={`${listLinkClass} bg-rose-50 text-center`}
          >
            <FontAwesomeIcon
              icon={faCirclePlus}
              className="text-2xl text-rose-500"
            />
            <div className="text-rose-500 mt-1">채팅방 생성</div>
          </Link>
        </li>
      )}

      {/* 채탕방 */}
      {roomList.length === 0 ? (
        <li className="text-rose-600 text-xl">( ˃̣̣̥᷄⌓˂̣̣̥᷅ ) 채팅방이 없다냥!</li>
      ) : (
        roomList.map((room) => (
          <li key={room.id} className={listItemClass}>
            <Link to={`/chatroom/${room.id}`} className={listLinkClass}>
              {/* 채팅방 제목 */}
              <h4 className="text-lg font-semibold mt-2 mb-1 truncate w-full">
                {room.title}
              </h4>

              {/* 시작 날짜 끝 날짜 */}
              <span className="text-xs">
                {room.startDate} ~ {room.endDate}
              </span>

              {/* 비밀방 여부 */}
              {room.isPrivate && (
                <span className="absolute top-3 right-3">
                  <FontAwesomeIcon icon={faLock} />
                  <span className="sr-only">비밀방</span>
                </span>
              )}

              {/* 지역 */}
              <div className="border-t-2 border-b-2 border-rose-200 my-2 px-1.5">
                {room.rcate1} {room.rcate2}
              </div>

              {/* 참가자 */}
              <span>
                {room.curParticipant} /{" "}
                <span className="font-semibold">{room.maxParticipant}</span>
                <FontAwesomeIcon icon={faUser} className="ml-1 text-sm" />
              </span>

              {/* 방장 이미지 */}
              <span
                className="order-first bg-rose-200 w-20 h-20 rounded-full overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${room.ownerProfileImage})`,
                }}
              ></span>
            </Link>
          </li>
        ))
      )}
    </ul>
  )
}

export default ChatListContainer
