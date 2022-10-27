function ChatSendForm({ handleSubmit, textInputRef }) {
  return (
    <div className="fixed bottom-0 container py-2 border-t">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between">
          <input
            ref={textInputRef}
            type="text"
            className="border border-rose-100 grow mr-2"
          />
          <button
            type="submit"
            className="bg-rose-500 px-2 rounded-lg text-rose-50"
          >
            send
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatSendForm
