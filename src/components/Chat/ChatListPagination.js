import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function ChatListPagination({ currentPage, maxPage, onClickPageButton }) {
  // 이전 다음 버튼 스타일 클래스
  const arrowButtonClass =
    "disabled:opacity-30 px-2 py-1 text-2xl text-rose-500"

  return (
    <div className="flex justify-center my-3 text-slate-400">
      {/* 이전 버튼 */}
      <button
        disabled={currentPage === 1 || maxPage === 0}
        onClick={() => {
          onClickPageButton(currentPage - 1)
        }}
        className={arrowButtonClass}
      >
        <FontAwesomeIcon icon={faCircleChevronLeft} />
        <span className="sr-only">이전</span>
      </button>

      {/* 페이지 버튼 최대 9개가 보임 */}
      {new Array(9).fill(null).map((_, index) => {
        if (
          currentPage - (4 - index) >= 1 &&
          currentPage - (4 - index) <= maxPage
        ) {
          return (
            <PageButton
              key={currentPage - (4 - index)}
              number={currentPage - (4 - index)}
              onClick={onClickPageButton}
              selected={currentPage === currentPage - (4 - index)}
            />
          )
        }
      })}

      {/* 다음 버튼 */}
      <button
        disabled={currentPage === maxPage || maxPage === 0}
        onClick={() => {
          onClickPageButton(currentPage + 1)
        }}
        className={arrowButtonClass}
      >
        <FontAwesomeIcon icon={faCircleChevronRight} />
        <span className="sr-only">다음</span>
      </button>
    </div>
  )
}

// 버튼 컴포넌트
function PageButton({ number, onClick, selected }) {
  return (
    <button
      className={`${selected && "text-rose-500"} px-2 py-1 hover:text-rose-500`}
      onClick={() => onClick(number)}
    >
      {number}
    </button>
  )
}

export default ChatListPagination
