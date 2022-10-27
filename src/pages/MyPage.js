import React from "react"

function MyPage() {
  return (
    <>
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-left text-pink-700">
          마이페이지
        </h3>
        <h3 className="text-1xl text-pink-700 mt-4">
          *[개인정보 수정] 클릭 후, 선택정보에서 선호지역을 등록하시면 해당 지역
          프로모션 정보를 손쉽게 받으실 수 있습니다.
        </h3>
        <div className="myPicture">
          <h3 className="text-lg font-semibold text-left text-pink-700 mt-1">
            나의 사진
          </h3>
          <img src="" width="200" alt="프로필 사진" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-left text-pink-700 mt-1">
            나의 정보
          </h3>
          <button>개인정보 수정</button>
          <form className="login-form grid place-items-center my-4">
            <div>회원번호</div>
            <div>회원명</div>
            <div>휴대폰번호</div>
            <div>이메일</div>
          </form>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-left text-pink-700 mt-1">
            나의 관심 지역
          </h3>
          <form className="login-form grid place-items-center my-4">
            <div>관동 지방</div>
            <div>알로라 지역</div>
            <div>시공의 뒤틀림</div>
          </form>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-left text-pink-700 mt-1">
            FOLLOWER
          </h3>
          <form className="login-form grid place-items-center my-4">
            <div>로이</div>
            <div>간부님</div>
            <div>로켓단대장</div>
          </form>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-left text-pink-700 mt-1">
            FOLLOWING
          </h3>
          <form className="login-form grid place-items-center my-4">
            <div>나옹이</div>
            <div>로사</div>
            <div>마자용</div>
          </form>
        </div>
      </div>
    </>
  )
}

export default MyPage
