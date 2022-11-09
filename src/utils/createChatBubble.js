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
  if (payload.senderName === userName) {
    prof.classList.add("right-0.5")
  } else {
    prof.classList.add("left-0")
  }
  prof.style.backgroundImage = `url(${
    payload.senderImgSrc
      ? payload.senderImgSrc
      : "https://via.placeholder.com/50"
  })`
  bubble.appendChild(prof)

  return bubble
}
