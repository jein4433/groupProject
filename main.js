let lat;//위도 받을 변수
let lng;//경도 받을 변수

async function execPostcode(){
new daum.Postcode({
    oncomplete: function(data) {
        var addr = data.address; // 최종 주소 변수
        // 주소 정보를 해당 필드에 넣는다.
        document.getElementById("get-location").value = addr;
        // 주소로 상세 정보를 검색
        geocoder.addressSearch(data.address, function(results, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === daum.maps.services.Status.OK) {
                var result = results[0]; //첫번째 결과의 값을 활용
                // 해당 주소에 대한 좌표를 받아서
                var coords = new daum.maps.LatLng(result.y, result.x);
                // 지도를 보여준다.
                mapContainer.style.display = "block";
                map.relayout();
                // 지도 중심을 변경한다.
                map.setCenter(coords);
                const center = map.getCenter();
                lat = center.getLat()//=======> 중심좌표의 위도를 받아온다.
                lng = center.getLng()//=======> 중심좌표의 경도를 받아온다.
                console.log(lat);
                console.log(lng);
                // 마커를 결과값으로 받은 위치로 옮긴다.
                marker.setPosition(coords)
            }
        });
    }
}).open();
}

function getDistanceFromLatLonInKm(lat1,lng1,lat2,lng2) {//lat1:위도1, lng1:경도1, lat2:위도2, lat2:경도2
    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lng2-lng1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d; 
  }

    //강남역
    const lat1 = 37.49813943152925
    const lng1 = 127.02827170358093
  
    //양재역
    const lat2 = 37.48390185679575
    const lng2 = 127.03450754512691
  
    console.log(getDistanceFromLatLonInKm(lat1,lng1,lat2,lng2));

  //출처: https://generalcoder.tistory.com/4 [HighGarden:티스토리]
