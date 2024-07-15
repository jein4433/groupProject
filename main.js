var mapContainer = document.getElementById('map'), 
    mapOption = { 
        center: new kakao.maps.LatLng(37.5665, 126.9780), // 지도 중심 좌표 (서울 시청)
        level: 3 // 지도 확대 레벨
    };
var map = new kakao.maps.Map(mapContainer, mapOption);

// 출발지와 도착지 설정
var start = new kakao.maps.LatLng(37.5665, 126.9780); // 서울 시청
var end = new kakao.maps.LatLng(37.5770, 126.9769); // 경복궁

// 출발지와 도착지 마커 생성
var markerStart = new kakao.maps.Marker({
    position: start
});
var markerEnd = new kakao.maps.Marker({
    position: end
});

markerStart.setMap(map);
markerEnd.setMap(map);

// 두 지점 간의 거리 계산
var distance = kakao.maps.services.Util.getDistance(start, end);

// 거리 결과를 표시
var resultDiv = document.getElementById('result');
resultDiv.innerHTML = '출발지와 도착지 간의 거리: ' + (distance / 1000).toFixed(2) + ' km';

// 지도에 경로 표시
var linePath = [start, end];
var polyline = new kakao.maps.polyline({
    path: linePath,
    strokeWeight: 5,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeStyle: 'solid'
});

polyline.setMap(map);
