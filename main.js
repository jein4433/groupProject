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
                        new kakao.maps.Size(24, 35)
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
    if (startCoords && endCoords) {
        calculateMidpoint();
    }
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

function searchPubTransPathAJAX() {
	var xhr = new XMLHttpRequest();
	var url = "https://api.odsay.com/v1/api/searchPubTransPathT?SX=126.9027279&SY=37.5349277&EX=126.9145430&EY=37.5499421&apiKey={YOUR_API_KEY}";
	xhr.open("GET", url, true);
	xhr.send();
	xhr.onreadystatechange = function() {

		if (xhr.readyState == 4 && xhr.status == 200) {
			console.log( xhr.responseText ); // <- xhr.responseText 로 결과를 가져올 수 있음
		}
	}
}

{
"result":{
  "path":[{
       "pathType":1,
       "subPath":[{
         "trafficType":1,
         "distance":2000,
         "sectionTime":9,
         "lane":{
           "name":"수도권 2호선",
           "subwaycode":2,
           "subwayCityCode":1000
             },
           "stationCount":1,
           "passStopList":{
           "stations":[{
             "index":0,
             "stationName":"당산",
             "stationID":237,
             "x":126.902682,
             "y":37.534863
             },
             {
             "index":1,
             "stationName":"합정",
             "stationID":238,
             "x":126.914543,
             "y":37.549942
             }]
          },
      "way":"합정",
      "wayCode":2,
      "startX":126.90267725576584,
      "startY":37.534862332279936,
      "startID":237,
      "startName":"당산",
      "endExitNo":"",
      "endExitX":0.0,
      "endExitY":0.0,
      "endX":126.91454311097073,
      "endY":37.549938143345756,
      "endID":238,
      "endName":"합정"
    },
    …(중략)...
    ],
      "info":{
      "mapObj":"2:2:237:238",
      "payment":1250,
      "busTransitCount":0,
      "subwayTransitCount":1,
      "busStationCount":0,
      "subwayStationCount":1,
      "totalStationCount":1,
      "totalTime":9,
      "totalWalk":0,
      "trafficDistance":2000,
      "totalDistance":2000,
      "firstStartStation":"당산",
      "lastEndStation":"합정",
      "totalWalkTime":-1
    }
    }],
    "searchType":0,
    "startRadius":700,
    "endRadius":700,
    "subwayCount":1,
    "busCount":10,
    "subwayBusCount":0,
    "pointDistance":1967,
    "outTrafficCheck":0
  }
}

