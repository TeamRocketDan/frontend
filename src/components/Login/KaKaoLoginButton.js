import React from "react"

import kakao_login_button from "../../assets/login/kakao_login_button.png"

// 카카오 개발자 앱 키 선언
const REDIRECT_URI = process.env.REACT_APP_LOGIN_REDIRECT + '/oauth2/redirect' // redirect 주소
const auth = `http://Teamrocket-1780545001.ap-northeast-2.elb.amazonaws.com/oauth2/authorization/kakao?redirect_uri=${REDIRECT_URI}`
// http://localhost:8080
const KakaoLoginButton = () => {
  return (
    // <a href={auth} rel="noopener noreferrer">
    //   <img
    //     src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
    //     width="200"
    //   />
    // </a>
    <a href={auth} rel="noopener noreferrer">
      <img src={kakao_login_button} width="200" alt="kakao" />
    </a>
  )
}

export default KakaoLoginButton
