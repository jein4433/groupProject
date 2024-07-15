function calculateDistance(start, end) {
    var apiUrl = 'https://dapi.kakao.com/v2/local/search/category.json';
    var apiKey = 'your_kakao_api_key_here';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${apiUrl}?category_group_code=MT1&x=${start}&y=${end}`, true);
    xhr.setRequestHeader('Authorization', 'KakaoAK ' + apiKey);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                var distance = response.documents[0].distance;
                console.log(`출발지: ${start}, 도착지: ${end}, 거리: ${distance} 미터`);
            } else {
                console.error('API 호출 실패:', xhr.status, xhr.statusText);
            }
        }
    };

    xhr.send();
}

var startAddress = '서울특별시 강남구 역삼동';
var endAddress = '서울특별시 송파구 가락동';

calculateDistance(startAddress, endAddress);
