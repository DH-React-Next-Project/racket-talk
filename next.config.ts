/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                //  http 로만 온다면 "http" 로 바꿔도 됨
                hostname: "yeyak.seoul.go.kr",
                port: "",           // 80·443 아닌 경우 "3000" 등 지정
                pathname: "/**",    // 모든 경로 허용
            },
        ],
    },
};

module.exports = nextConfig;
