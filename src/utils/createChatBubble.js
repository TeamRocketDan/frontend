export const createChatBubble = (payload, userName, roomId) => {
  // 입장 퇴장 메세지
  if (payload.senderName === `system${roomId}`) {
    const bubble = document.createElement("li")
    bubble.classList.add(
      "w-full",
      "text-slate-500",
      "text-center",
      "py-1",
      "my-2",
      "border-y",
      "border-dashed",
      "bg-slate-100",
    )
    bubble.textContent = payload.message

    return bubble
  }

  const bubble = document.createElement("li")
  bubble.classList.add(
    "first:mt-auto",
    "rounded-lg",
    "w-fit",
    "mb-4",
    "py-2",
    "px-3",
    "relative",
  )
  if (payload.senderName === userName) {
    bubble.classList.add("bg-rose-200", "self-end", "mr-12")
  } else {
    bubble.classList.add("border", "border-rose-300", "self-start", "ml-12")
  }
  bubble.style.maxWidth = "70%"
  bubble.textContent = payload.message
  const prof = document.createElement("span")
  prof.classList.add(
    "w-10",
    "h-10",
    "rounded-full",
    "absolute",
    "overflow-hidden",
    "bg-cover",
    "-mt-2",
  )

  prof.style.backgroundImage = `url(${
    payload.senderImgSrc
      ? payload.senderImgSrc
      : "https://via.placeholder.com/50"
  })`
  const timeStamp = document.createElement("span")
  timeStamp.classList.add(
    "text-slate-400",
    "text-sm",
    "absolute",
    "w-20",
    "px-2",
    "bottom-0",
  )
  timeStamp.textContent =
    typeof payload.createdAt === "string"
      ? `${payload.createdAt.split("T")[1].split(":")[0]}시 ${
          payload.createdAt.split("T")[1].split(":")[1]
        }분`
      : `${payload.createdAt[3]}시 ${payload.createdAt[4]}분`

  if (payload.senderName === userName) {
    prof.classList.add("-right-12")
    timeStamp.classList.add("-left-20", "text-right")
  } else {
    prof.classList.add("-left-12")
    timeStamp.classList.add("-right-20", "text-left")
  }
  bubble.appendChild(prof)
  bubble.appendChild(timeStamp)

  return bubble
}
