// import { useEffect } from "react"
// import { useRecoilState } from "recoil"
// import axios from "axios"

// import { selectedRegion01, selectedRegion02 } from "../../recoil/regionState"
// import { userData } from "../../recoil/userData"

// function UserModal({
//   searchModalOpen,
//   setSearchModalOpen,
//   currentDistricts,
//   setCurrentDistricts,
// }) {
//   const [userList, setUserList] = useRecoilState(userData)

//   useEffect(() => {
//     // 지역 이름 데이터 받아서 저장
//     axios
//       .get(
//         "http://Teamrocket-1780545001.ap-northeast-2.elb.amazonaws.com/oauth2/redirect?{providerType}",
//       )
//       .then((response) => {
//         setUserList(response.data.result)
//       })
//       .catch(function (error) {
//         console.log(error)
//       })
//   }, [])

//   const [depth01, setDepth01] = useRecoilState(selectedRegion01)
//   const [depth02, setDepth02] = useRecoilState(selectedRegion02)

//   function clickDepth01(event) {
//     // 클릭한 지역명 저장
//     setDepth01(event.target.textContent)
//     // depth2 비우기
//     setDepth02("")

//     // depth2 불러오기
//     const user = userList.filter((userItem) => {
//       return userItem.userName === event.target.textContent
//     })[0]

//     axios
//       .get(
//         `http://Teamrocket-1780545001.ap-northeast-2.elb.amazonaws.com/api/v1/areas/${user.id}/district`,
//       )
//       .then((response) => {
//         setCurrentDistricts(response.data.result)
//       })
//       .catch(function (error) {
//         console.log(error)
//       })
//   }
//   function clickDepth02(event) {
//     // 클릭한 지역명 저장
//     setDepth02(event.target.textContent)
//     // 모달 닫기
//     setSearchModalOpen(false)
//   }

//   return (
//     <div
//       className={`border w-64 absolute bg-white ${
//         searchModalOpen ? "" : "hidden"
//       }`}
//     >
//       {/* depth 01 */}
//       <ul className="flex w-64 flex-wrap">
//         {userList.map((user) => (
//           <li key={user.id}>
//             <span
//               onClick={clickDepth01}
//               className={`py-1 px-2 w-32 cursor-pointer flex hover:text-rose-400 ${
//                 user.userName === depth01 ? "text-rose-400" : ""
//               }`}
//             >
//               {user.userName}
//             </span>
//           </li>
//         ))}
//       </ul>
//       {/* depth 02 */}
//       <ul
//         className={`searchDepth02 absolute left-64 w-80 top-0 flex flex-wrap bg-white border ${
//           currentDistricts.length === 0 ? "hidden" : ""
//         }`}
//       >
//         {currentDistricts.map((district) => (
//           <li
//             key={district.id}
//             className={`py-1 px-2 w-36 grow-0 cursor-pointer flex hover:text-rose-400 ${
//               district.districtName === depth02 ? "text-rose-400" : ""
//             }`}
//             onClick={clickDepth02}
//           >
//             {district.districtName}
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// export default UserModal
