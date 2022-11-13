export const createChatBubble = ({ payload, userId, participants }) => {
  // 입장 퇴장 시스템 메세지
  if (payload.userId === "666") {
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
      "first:mt-auto",
    )
    bubble.textContent = payload.message

    return bubble
  }

  // 기본 메세지 버블
  const bubble = document.createElement("li")
  bubble.classList.add(
    "first:mt-auto",
    "rounded-lg",
    "w-fit",
    "mt-6",
    "py-2",
    "px-3",
    "relative",
  )
  if (payload.userId === userId) {
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

  const currentSender = participants.filter(
    (participant) => participant.userId === payload.userId,
  )[0]

  prof.style.backgroundImage = `url(${
    currentSender.profileImage
      ? currentSender.profileImage
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

  const userNameArea = document.createElement("span")
  userNameArea.classList.add(
    "text-slate-500",
    "w-fit",
    "absolute",
    "w-full",
    "-top-5",
    "text-sm",
  )
  userNameArea.textContent = currentSender.nickname

  if (payload.userId === userId) {
    prof.classList.add("-right-12")
    timeStamp.classList.add("-left-20", "text-right")
    userNameArea.classList.add("right-0", "text-right")
  } else {
    prof.classList.add("-left-12")
    timeStamp.classList.add("-right-20", "text-left")
    userNameArea.classList.add("left-0", "text-left")
  }
  bubble.appendChild(prof)
  bubble.appendChild(timeStamp)
  bubble.appendChild(userNameArea)

  return bubble
}
