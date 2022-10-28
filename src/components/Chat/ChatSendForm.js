import { faPaperPlane } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function ChatSendForm({ handleSubmit, textInputRef }) {
  return (
    <div className="fixed bottom-0 container py-2 border-t bg-white">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between">
          <input
            ref={textInputRef}
            type="text"
            className="border border-rose-200 grow mr-2 outline-0 py-1 px-2 rounded-lg"
          />
          <button
            type="submit"
            className="bg-rose-500 px-4 rounded-lg text-rose-50"
          >
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="text-xl text-white"
            />
            <span className="visuallyhidden">보내기</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatSendForm
