import React, { useState, useEffect } from "react"

import styled from "styled-components"
import HeartImg from "../../assets/feed/heart.png"
import EmptyHeartImg from "../../assets/feed/empty-heart.png"

const Heart = styled.img`
    // css
    width: 30px;
    
    }
`

const HeartButton = ({ like, onClick }) => {
  return <Heart src={like ? HeartImg : EmptyHeartImg} onClick={onClick} />
}

export default HeartButton
