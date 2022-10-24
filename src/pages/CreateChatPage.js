import Container from "../components/Layout/Container"

function CreateChatPage() {
  // 스타일 클래스
  const forLabel = "w-40 font-bold mb-2 inline-block"
  const forInput = "bg-slate-100 mb-2 py-1 px-2"

  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <Container>
      <h3 className="my-4 px-2 font-bold text-3xl inline-block relative before:block before:absolute before:left-0 before:bottom-0 before:bg-rose-400 before:h-3 before:w-full before:opacity-30">
        채팅 생성
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="max-w-xl">
          <label htmlFor="chatTitle" className={forLabel}>
            채팅방 제목
          </label>
          <input type="text" id="chatTitle" className={forInput} />
          <br />
          <label htmlFor="chatMax" className={forLabel}>
            최대 인원수
          </label>
          <input
            type="number"
            id="chatMax"
            className={forInput}
            min="0"
            max="10"
          />
          <br />
          <label htmlFor="startDate" className={forLabel}>
            여행 시작 날짜
          </label>
          <input type="date" id="startDate" className={forInput} />
          <br />
          <label htmlFor="endDate" className={forLabel}>
            여행 끝 날짜
          </label>
          <input type="date" id="endDate" className={forInput} />
          <br />
          <label htmlFor="chatRegion" className={forLabel}>
            지역 선택
          </label>
          <input type="text" id="chatRegion" className={forInput} disabled />
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="bg-rose-500 px-3 py-1 rounded-lg text-rose-50"
        >
          만들기!
        </button>
      </form>
    </Container>
  )
}

export default CreateChatPage
