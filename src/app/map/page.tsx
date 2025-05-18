

"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function MapPage() {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapLoaded) return;

    if (!window.kakao || !window.kakao.maps) {
      console.error("❌ Kakao map SDK not available");
      return;
    }

    window.kakao.maps.load(() => {
      console.log("✅ Kakao map loaded");

      const container = document.getElementById("map");
      if (!container) {
        console.error("❌ map container not found");
        return;
      }

      const options = {
        center: new window.kakao.maps.LatLng(37.544318, 127.056145),
        level: 4,
      };

      const map = new window.kakao.maps.Map(container, options);


      const overlays: any[] = [];


      //임시데이터
      const courts = [
        {
          id: "1",
          name: "성수 테니스장",
          lat: 37.544318,
          lng: 127.056145,
        },
        {
          id: "2",
          name: "서울숲 테니스코트",
          lat: 37.544964,
          lng: 127.037084,
        },
        {
          id: "3",
          name: "건대 테니스장",
          lat: 37.540725,
          lng: 127.070251,
        },
        {
          id: "4",
          name: "압구정 테니스장",
          lat: 37.527023,
          lng: 127.028601,
        },
        {
          id: "5",
          name: "한양대 테니스코트",
          lat: 37.555872,
          lng: 127.043125,
        },
        {
          id: "6",
          name: "뚝섬유원지 테니스장",
          lat: 37.531583,
          lng: 127.065388,
        },
        {
          id: "7",
          name: "청담 테니스코트",
          lat: 37.525094,
          lng: 127.051186,
        },
        {
          id: "8",
          name: "중랑천 테니스장",
          lat: 37.586732,
          lng: 127.062793,
        },
      ];

      courts.forEach((court) => {
        const position = new window.kakao.maps.LatLng(court.lat, court.lng);

        const marker = new window.kakao.maps.Marker({
          map,
          position,
          image: new window.kakao.maps.MarkerImage(
            "/img/map-marker.png",
            new window.kakao.maps.Size(25, 36),
            { offset: new window.kakao.maps.Point(20, 36) }
          ),
        });

        const content = `
          <div style="padding:8px 16px; background:white; border-radius:6px; border:1px solid #888;">
            <strong>${court.name}</strong>
          </div>
        `;

        const overlay = new window.kakao.maps.CustomOverlay({
          content,
          position,
          yAnchor: 1,
        });

        overlays.push(overlay);

        window.kakao.maps.event.addListener(marker, "click", () => {
          overlays.forEach((o) => o.setMap(null));
          overlay.setMap(map);
        });
      });

      //배경클릭시 팝업닫힘
      window.kakao.maps.event.addListener(map, "click", () => {
        overlays.forEach((o) => o.setMap(null));
      });
    });
  }, [mapLoaded]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
        onLoad={() => {
          console.log("✅ Kakao SDK script loaded");
          setMapLoaded(true);
        }}
        onError={() => {
          console.error("❌ Failed to load Kakao Maps script");
        }}
      />
      <div id="map" style={{ width: "100%", height: "100vh" }}></div>
    </>
  );
}