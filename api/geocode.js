// api/geocode.js

import axios from "axios";

export default async (req, res) => {
    const address = req.query.address;
    if (!address) {
        return res.status(400).json({ error: "주소를 입력해주세요." });
    }

    const client_id = process.env.NAVER_CLIENT_ID;
    const client_secret = process.env.NAVER_CLIENT_SECRET;

    const apiUrl = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode`;

    try {
        const response = await axios.get(apiUrl, {
            params: {
                query: address,
            },
            headers: {
                "X-NCP-APIGW-API-KEY-ID": client_id,
                "X-NCP-APIGW-API-KEY": client_secret,
            },
        });

        if (response.data.addresses.length > 0) {
            const { x: longitude, y: latitude } = response.data.addresses[0];
            res.status(200).json({ latitude, longitude });
        } else {
            res.status(404).json({ error: "좌표를 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
};
