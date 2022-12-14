import React, { useState, useEffect } from "react"

import styled from "styled-components"
import HeartImg from "../../assets/feed/heart.png"
import EmptyHeartImg from "../../assets/feed/empty-heart.png"

const CommentHeart = styled.img`
    // css
    width: 20px;
    margin-left: 0.2rem;
    margin-right: 0.2rem;
    }
`

const CommentHeartButton = ({ like, onClick }) => {
  return (
    <CommentHeart src={like ? HeartImg : EmptyHeartImg} onClick={onClick} />
  )
}

export default CommentHeartButton
