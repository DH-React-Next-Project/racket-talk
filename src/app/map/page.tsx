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
  const [courts, setCourts] = useState([]);


  //테니스장정보 가져오기
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await fetch("/api/courts");
        const data = await res.json();
        setCourts(data);
      } catch (error) {
        console.error("❌ Failed to fetch courts:", error);
      }
    };

    fetchCourts();
  }, []);

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


      if (!Array.isArray(courts)) {
        console.error("❌ courts is not an array:", courts);
        return;
      }

      courts.forEach((court) => {
        const position = new window.kakao.maps.LatLng(court.lat, court.lng);

        const marker = new window.kakao.maps.Marker({
          map,
          position,
          //카카오맵 마커이미지는 public/ 만 접근가능하여 public/img 사용함
          image: new window.kakao.maps.MarkerImage(
            "/img/map-marker.png",
            new window.kakao.maps.Size(25, 36),
            { offset: new window.kakao.maps.Point(20, 36) }
          ),
        });

        const content = `
          <div style="padding:8px 16px; background:white; border-radius:6px; border:1px solid #888;">
            <strong>${court.court_name}</strong>
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
  }, [mapLoaded, courts]);

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