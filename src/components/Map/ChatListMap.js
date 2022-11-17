import { useEffect, useRef, useState } from "react"
import markerImageSrc from "../../assets/logo/logo_marker.png"

const { kakao } = window

function ChatListMap({ positionData }) {
  const mapRef = useRef()

  useEffect(() => {
    const map = new kakao.maps.Map(mapRef.current, {
      // 지도를 표시할 div
      center: new kakao.maps.LatLng(35.5583, 127.6358), // 지도의 중심좌표
      level: 14, // 지도의 확대 레벨
    })

    const imageSrc = markerImageSrc
    const imageSize = new kakao.maps.Size(36, 34)
    const imageOption = { offset: new kakao.maps.Point(18, 34) }

    const markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption,
    )

    // 마커 클러스터러를 생성합니다
    const clusterer = new kakao.maps.MarkerClusterer({
      map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
      averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
      minLevel: 10, // 클러스터 할 최소 지도 레벨
    })

    const markers = positionData.map((position) => {
      return new kakao.maps.Marker({
        position: new kakao.maps.LatLng(position.lat, position.lng),
        image: markerImage,
      })
    })

    clusterer.addMarkers(markers)

    // 지도 드래그
    map.setDraggable(false)

    // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
    const zoomControl = new kakao.maps.ZoomControl()
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)

    // 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
    kakao.maps.event.addListener(map, "zoom_changed", function () {
      // 지도의 현재 레벨을 얻어옵니다
      const level = map.getLevel()

      console.log(level)
      if (level > 13) {
        map.setDraggable(false)
        map.setCenter(new kakao.maps.LatLng(35.5583, 127.6358))
      } else {
        map.setDraggable(true)
      }
    })
  }, [positionData])

  return (
    <div className="py-4">
      <div
        className="w-full h-72 mx-auto relative"
        style={{ maxWidth: "940px" }}
        ref={mapRef}
      ></div>
    </div>
  )
}

export default ChatListMap
