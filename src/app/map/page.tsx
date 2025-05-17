

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
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 4,
      };

      new window.kakao.maps.Map(container, options);
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