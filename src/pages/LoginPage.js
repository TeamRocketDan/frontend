import React from "react"

import KakaoLoginButton from "../components/Login/KaKaoLoginButton"
import NaverLoginButton from "../components/Login/NaverLoginButton"
import GoogleLoginButton from "../components/Login/GoogleLoginButton"

function LoginPage() {
  return (
    <>
      <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
        <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
          <h3 className="text-2xl font-semibold text-center text-pink-700">
            로그인
          </h3>
          <form className="login-form grid place-items-center my-4">
            <div className="kakao my-1">
              <KakaoLoginButton />
            </div>
            <div className="naver my-1">
              <NaverLoginButton />
            </div>
            <div className="google">
              <GoogleLoginButton />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default LoginPage
