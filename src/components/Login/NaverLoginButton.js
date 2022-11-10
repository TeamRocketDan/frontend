import React from "react"

import naver_login_button from "../../assets/login/naver_login_button.png"

// 카카오 개발자 앱 키 선언
const REDIRECT_URI = "http://localhost:3000/oauth2/redirect" // redirect 주소
const auth = `http://Teamrocket-1780545001.ap-northeast-2.elb.amazonaws.com/oauth2/authorization/naver?redirect_uri=${REDIRECT_URI}`
// http://localhost:8080
const NaverLoginButton = () => {
  return (
    <a href={auth} rel="noopener noreferrer">
      <img src={naver_login_button} width="200" alt="naver" />
    </a>
  )
}

export default NaverLoginButton
