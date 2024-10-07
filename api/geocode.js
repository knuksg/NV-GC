// api/geocode.js

import axios from "axios";

export default async (req, res) => {
    // 주소 파라미터 가져오기
    const { address } = req.query;

    if (!address) {
        return res.status(400).json({ error: "주소를 입력해주세요." });
    }

    // NAVER API 인증 정보 (환경 변수에서 가져오기)
    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;

    const apiUrl = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode";

    try {
        // Geocoding API 호출
        const response = await axios.get(apiUrl, {
            params: {
                query: address,
            },
            headers: {
                "X-NCP-APIGW-API-KEY-ID": clientId,
                "X-NCP-APIGW-API-KEY": clientSecret,
                Accept: "application/json",
            },
        });

        const data = response.data;

        // 상태 코드 확인
        if (data.status === "OK") {
            const addresses = data.addresses;

            if (addresses.length > 0) {
                const result = addresses[0];
                const latitude = result.y;
                const longitude = result.x;
                res.status(200).json({ latitude, longitude });
            } else {
                res.status(404).json({ error: "검색 결과가 없습니다." });
            }
        } else {
            res.status(500).json({ error: "Geocoding API 요청에 실패했습니다.", message: data.errorMessage });
        }
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
};
