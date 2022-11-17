import { useEffect, useRef, useState } from "react"
import markerImageSrc from "../../assets/logo/logo_marker.png"

const { kakao } = window

function FeedListMap({ positionData }) {
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
  }, [positionData])

  return (
    <div className="w-full py-4">
      <div className="w-full h-72 max-w-screen-lg mx-auto" ref={mapRef}></div>
    </div>
  )
}

export default FeedListMap
