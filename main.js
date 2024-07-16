var container = document.getElementById('map');
var map = new kakao.maps.Map(container, {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 3
});
var ps = new kakao.maps.services.Places(); 
var infowindow = new kakao.maps.InfoWindow({zIndex:1});
var markers = [];
var markers2 = [];
var startCoords, endCoords;

// Initialize Google Maps Directions Service
var directionsService = new google.maps.DirectionsService();
var directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: true
});

function handleSearch(event) {
    if (event.key === 'Enter') {
        searchPlaces('search-start', 'start');
    }
}

function searchHandle(event) {
    if (event.key === 'Enter') {
        searchPlaces('search-end', 'end');
    }
}

function searchPlaces(inputId, type) {
    var keyword = document.getElementById(inputId).value;

    if (!keyword.trim()) {
        alert('키워드를 입력해주세요!');
        return;
    }

    ps.keywordSearch(keyword, function(data, status) {
        if (status === kakao.maps.services.Status.OK) {
            removeMarkers(type);
            var place = data[0];
            var coords = new kakao.maps.LatLng(place.y, place.x);
            placeMarker(coords, type);
            map.setCenter(coords);

            if (type === 'start') {
                startCoords = new google.maps.LatLng(place.y, place.x);
                document.getElementById('start-coords').textContent = '출발지 좌표: ' + place.y + ', ' + place.x;
            } else if (type === 'end') {
                endCoords = new google.maps.LatLng(place.y, place.x);
                document.getElementById('end-coords').textContent = '도착지 좌표: ' + place.y + ', ' + place.x;
            }
        } else {
            alert('장소를 찾을 수 없습니다.');
        }
    });
}

function placeMarker(coords, type) {
    var marker = new kakao.maps.Marker({
        map: map,
        position: coords
    });
    markers.push(marker);
}

function removeMarkers(type) {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

function findRoute() {
    if (!startCoords || !endCoords) {
        alert('출발지와 도착지를 모두 선택해주세요.');
        return;
    }

    var request = {
        origin: startCoords,
        destination: endCoords,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            var distance = result.routes[0].legs[0].distance.text;
            document.getElementById('distance-value').textContent = '거리: ' + distance;
        } else {
            alert('경로를 찾을 수 없습니다.');
        }
    });
}

// Initialize Kakao Map
function initMap() {
    map.setCenter(new kakao.maps.LatLng(33.450701, 126.570667));
}

window.onload = initMap;
