async function getDistance(startPoint, endPoint) {
    const apiUrl = 'https://dapi.kakao.com/v2/local/search/category.json';
    const apiKey = 'your_kakao_api_key_here';

    const params = {
        category_group_code: 'MT1',
        x: startPoint,
        y: endPoint
    };

    try {
        const response = await fetch(apiUrl + '?' + new URLSearchParams(params), {
            headers: {
                'Authorization': 'KakaoAK ' + apiKey
            }
        });

        if (!response.ok) {
            throw new Error('API 호출 실패');
        }

        const data = await response.json();
        const distance = data.documents[0].distance;

        return distance;
    } catch (error) {
        console.error('API 호출 에러:', error);
        throw error;
    }
}

const startAddress = '서울시 강남구 역삼동';
const endAddress = '서울시 송파구 가락동';

getDistance(startAddress, endAddress)
    .then(distance => {
        console.log(`출발지: ${startAddress}`);
        console.log(`도착지: ${endAddress}`);
        console.log(`거리: ${distance} 미터`);
    })
    .catch(error => {
        console.error('거리 계산 실패:', error);
    });
