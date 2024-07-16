var container = document.getElementById('map');
var options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 3
};

var map = new kakao.maps.Map(container, options);
var ps = new kakao.maps.services.Places(); 
var infowindow = new kakao.maps.InfoWindow({zIndex:1});
var markers = [];
var markers2 = [];
var startCoords, endCoords;

function handleSearch(event) {
    if (event.key === 'Enter') {
        searchPlaces();
    }
}

function searchHandle(event) {
    if (event.key === 'Enter') {
        searchDestination();
    }
}

function searchPlaces() {
    var keyword = document.getElementById('search-start').value;

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }

    ps.keywordSearch(keyword, placesSearchCB);
}

function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        removeMarker();
        var bounds = new kakao.maps.LatLngBounds();
        
        for (var i = 0; i < data.length; i++) {
            (function(place) {
                var marker = new kakao.maps.Marker({
                    map: map,
                    position: new kakao.maps.LatLng(place.y, place.x)
                });
                
                kakao.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '<br><button onclick="selectStartLocation(' + place.y + ', ' + place.x + ')">출발지 선택하기</button></div>');
                    infowindow.open(map, marker);
                });
                
                markers.push(marker);
                bounds.extend(new kakao.maps.LatLng(place.y, place.x));
            })(data[i]);
        }

        map.setBounds(bounds);
        displayPagination(pagination);
    } 
}

function selectStartLocation(lat, lng) {
    startCoords = {lat: lat, lng: lng};
    document.getElementById('start-coords').textContent = '출발지 좌표: ' + lat + ', ' + lng;
    alert('출발지 선택됨');
    infowindow.close();
}

function searchDestination() {
    var keyword2 = document.getElementById('search-end').value;

    if (!keyword2.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }

    ps.keywordSearch(keyword2, placesSearchCB2);
}

function placesSearchCB2(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        removeMarker2();
        var bounds2 = new kakao.maps.LatLngBounds();
        
        for (var i = 0; i < data.length; i++) {
            (function(place) {
                var marker2 = new kakao.maps.Marker({
                    map: map,
                    position: new kakao.maps.LatLng(place.y, place.x),
                    image: new kakao.maps.MarkerImage(
                        'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
                        new kakao.maps.Size(30, 35)
                    )
                });

                kakao.maps.event.addListener(marker2, 'click', function() {
                    infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '<br><button onclick="selectEndLocation(' + place.y + ', ' + place.x + ')">도착지 선택하기</button></div>');
                    infowindow.open(map, marker2);
                });

                markers2.push(marker2);
                bounds2.extend(new kakao.maps.LatLng(place.y, place.x));
            })(data[i]);
        }

        map.setBounds(bounds2);
        displayPagination2(pagination);
    } 
}

function selectEndLocation(lat, lng) {
    endCoords = {lat: lat, lng: lng};
    document.getElementById('end-coords').textContent = '도착지 좌표: ' + lat + ', ' + lng;
    alert('도착지 선택됨');
    infowindow.close();
}

function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }   
    markers = [];
}

function removeMarker2() {
    for (var i = 0; i < markers2.length; i++) {
        markers2[i].setMap(null);
    }   
    markers2 = [];
}

function displayPagination(pagination) {
    var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i;

    while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
    }

    for (i = 1; i <= pagination.last; i++) {
        var el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i === pagination.current) {
            el.className = 'on';
        } else {
            el.onclick = (function(i) {
                return function() {
                    pagination.gotoPage(i);
                }
            })(i);
        }

        fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
}

function displayPagination2(pagination) {
    var paginationEl = document.getElementById('pagination2'), 
        fragment = document.createDocumentFragment(),
        i;

    while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
    }

    for (i = 1; i <= pagination.last; i++) {
        var el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i === pagination.current) {
            el.className = 'on';
        } else {
            el.onclick = (function(i) {
                return function() {
                    pagination.gotoPage(i);
                }
            })(i);
        }

        fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
}

function toggleSearch() {
    var searchStart = document.getElementById('search-start');
    if (searchStart.style.display === 'none' || searchStart.style.display === '') {
        searchStart.style.display = 'inline-block';
        searchStart.focus();
    } else {
        searchStart.style.display = 'none';
    }
}

function onOffSearch() {
    var searchEnd = document.getElementById('search-end');
    if (searchEnd.style.display === 'none' || searchEnd.style.display === '') {
        searchEnd.style.display = 'inline-block';
        searchEnd.focus();
    } else {
        searchEnd.style.display = 'none';
    }
}

function findRoute() {
    if (!startCoords || !endCoords) {
        alert('출발지와 도착지를 선택해주세요.');
        return;
    }

    var start = `${startCoords.lng},${startCoords.lat}`;
    var end = `${endCoords.lng},${endCoords.lat}`;

    var url = `https://apis-navi.kakaomobility.com/v1/waypoints/directions?origin=${start}&destination=${end}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'KakaoAK 8fa6250a0ecb635c10de0eb564e22c52'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.routes && data.routes[0]) {
            var path = data.routes[0].sections[0].roads.map(road => new kakao.maps.LatLng(road.x, road.y));
            var polyline = new kakao.maps.Polyline({
                map: map,
                path: path,
                strokeWeight: 5,
                strokeColor: 'blue',
                strokeOpacity: 0.7,
                strokeStyle: 'solid'
            });
            map.setBounds(new kakao.maps.LatLngBounds(startCoords, endCoords));
        } else {
            alert('경로를 찾을 수 없습니다.');
        }
    })
    .catch(error => console.error('Error:', error));
}
