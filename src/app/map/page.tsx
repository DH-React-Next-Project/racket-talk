"use client";

import { useEffect, useState } from "react";
import Modal from "@/_components/court/Modal";
import { Court } from "@/types/court";
import Image from "next/image";
import marker from "@/assets/courts/map-marker.svg";
import phoneIcon from "@/assets/courts/phone.svg";
import FavoriteToggle from "@/_components/court/ToggleFavorite";
import FavoriteModal from "@/_components/court/FavoriteModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/_components/layouts/Header";

declare global {
  interface Window {
    kakao: any;
  }
}

const MapPage = () => {
  const [courtList, setCourtList] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favoriteCourtIds, setFavoriteCourtIds] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMemo, setFavoriteMemo] = useState("");

  //테니스장정보 가져오기
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await fetch("/api/court");
        const data = await res.json();
        setCourtList(data);
      } catch (error) {
        console.error("❌ Failed to fetch courts:", error);
      }
    };

    fetchCourts();
  }, []);

  // 즐겨찾기 정보 가져오기
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("/api/my");
        const data = await res.json();
        const ids = data.favorites.map((f: any) => f.court_id);
        setFavoriteCourtIds(ids);
      } catch (error) {
        console.error(error, "Failed to fetch favorites");
      }
    };

    fetchFavorites();
  }, []);

  // 즐겨찾기 메모 불러오기
  useEffect(() => {
    if (!selectedCourt) return;

    const courtId = selectedCourt.court_id;

    fetch(`/api/my/${courtId}`)
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        if (data) {
          setIsFavorite(true);
          setFavoriteMemo(data.favoriteMemo);
        } else {
          setIsFavorite(false);
          setFavoriteMemo("");
        }
      })
      .catch((err) => {
        console.error("즐겨찾기 불러오기 실패:", err);
      });
  }, [selectedCourt]);

  useEffect(() => {
    const scriptId = "kakao-map-script";
    const existingScript = document.getElementById(scriptId);

    const initMap = () => {
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
          level: 7,
        };

        const map = new window.kakao.maps.Map(container, options);

        if (!Array.isArray(courtList)) {
          console.error("❌ courts is not an array:", courtList);
          return;
        }

        courtList.forEach((court) => {
          const position = new window.kakao.maps.LatLng(
            parseFloat(court.lat),
            parseFloat(court.lng)
          );

          const marker = new window.kakao.maps.Marker({
            map,
            position,
            image: new window.kakao.maps.MarkerImage(
              "/img/map-marker.png",
              new window.kakao.maps.Size(25, 36),
              { offset: new window.kakao.maps.Point(20, 36) }
            ),
          });

          window.kakao.maps.event.addListener(marker, "click", async () => {
            try {
              const res = await fetch(`/api/court/${court.court_id}`);
              if (!res.ok) throw new Error("Failed to fetch court data");
              const detail = await res.json();

              // 👉 기본 court 객체 + 상세정보 병합
              const merged = {
                ...court, // court_id · lat · lng 등 **정상 값 유지**
                ...(Array.isArray(detail) ? detail[0] : detail),
              };

              setSelectedCourt(merged); // court_id 가 항상 존재
              setIsModalOpen(true);
            } catch (err) {
              console.error("❌ Failed to fetch court details:", err);
            }
          });
        });
      });
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [courtList]);

  const handleFavoriteToggleClick = async (court: Court) => {
    setSelectedCourt(court);

    try {
      const res = await fetch(`/api/my/${court.court_id}`);

      // 404는 "즐겨찾기 없음"으로 간주
      if (res.status === 404) {
        setIsFavorite(false);
        setFavoriteMemo("");
      } else if (!res.ok) {
        throw new Error("서버 오류 또는 네트워크 실패");
      } else {
        const data = await res.json();

        if (data && data.favorite_memo !== undefined) {
          setIsFavorite(true);
          setFavoriteMemo(data.favorite_memo);
        } else {
          setIsFavorite(true);
          setFavoriteMemo(""); // memo 필드가 없을 수도 있으니 대비
        }
      }
    } catch (err) {
      console.error("❌ Failed to fetch favorite memo", err);
      setIsFavorite(false);
      setFavoriteMemo("");
    }

    setShowModal(true);
  };

  function renderFavoriteModal(courtId: number) {
    const isEditMode = isFavorite && favoriteMemo.trim() !== "";

    return (
      <FavoriteModal
        courtName={selectedCourt?.court_name ?? ""}
        address={selectedCourt?.address ?? ""}
        initialMemo={favoriteMemo}
        mode={isEditMode ? "edit" : "add"}
        onClose={() => setShowModal(false)}
        onUpdate={async (newMemo) => {
          await fetch(`/api/my/${courtId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ favorite_memo: newMemo }),
          });
          setFavoriteMemo(newMemo);
          setShowModal(false);
        }}
        onAdd={async (newMemo) => {
          await fetch(`/api/my/${courtId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ favorite_memo: newMemo }),
          });
          setFavoriteMemo(newMemo);
          setIsFavorite(true);
          setFavoriteCourtIds((prev) => [...prev, courtId]);
          setShowModal(false);
        }}
        onDelete={async () => {
          await fetch(`/api/my/${courtId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });
          setFavoriteMemo("");
          setIsFavorite(false);
          setFavoriteCourtIds((prev) =>
            prev.filter((id) => id !== courtId)
          );
          setShowModal(false);
        }}
      />
    );
  }

  return (
    <>
      <Header />
      <div id="map" className="pt-20" style={{ width: "100%", height: "100vh" }}></div>

            //테니스장 상세 팝업
      {isModalOpen && selectedCourt && (
        <Modal onClickToggleModal={() => setIsModalOpen(false)}>
          <div className="p-6 w-[305px] max-w-md shadow-lg space-y-4">
            <MapHeader
              court={selectedCourt}
              isFavorite={favoriteCourtIds.includes(selectedCourt.court_id)}
              onToggleFavorite={() => handleFavoriteToggleClick(selectedCourt)}
            />
            <Body court={selectedCourt} />
            <Footer courtId={selectedCourt.court_id} />
          </div>
        </Modal>
      )}
      {showModal && renderFavoriteModal(selectedCourt.court_id)}
    </>
  );
}

export default MapPage;

// Modal 내부 UI 컴포넌트 복제 (Header, Body, Footer)
type MapHeaderProps = {
  court: Court;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

function MapHeader({ court, isFavorite, onToggleFavorite }: MapHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <Image src={marker} alt="marker" width={20} height={20} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="text-[15px] font-bold">{court.court_name}</span>
          <div style={{ paddingLeft: "10px", paddingBottom: "7px" }}>
            <div onClick={onToggleFavorite}>
              <FavoriteToggle isFavorite={isFavorite} />
            </div>
          </div>
        </div>
        <span className="text-[8px]">{court.address ?? "주소 없음"}</span>
      </div>
    </div>

  );
}

function Body({ court }: { court: Court }) {
  const all: string = "all";
  return (
    <div className="flex gap-4 items-start">
      {court.court_image ? (
        <img
          src={court.court_image}
          alt={`${court.court_name} 이미지`}
          className="rounded-md object-cover w-[119px] h-[119px]"
        />
      ) : (
        <div className="w-[119px] h-[119px] bg-gray-200 rounded-md" />
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <Image src={phoneIcon} alt="phone" width={10} height={11} />
          <div className="flex flex-row gap-2">
            <b className="text-[10px]">전화번호</b>{" "}
            <span className="text-[8px] mt-0.25">
              {court.telno ?? "정보 없음"}
            </span>
          </div>
        </div>
        <Link href={
          {
            pathname: `/court-chat-list`,
            query: {
              courtId: court.court_id,
              courtDetailId: all,
            },
          }
        }>
          <button className="bg-main text-white rounded-md px-4 py-2 text-[12px] cursor-pointer">
            채팅방 리스트 보기
          </button>
        </Link>
        <Link href={`/create-chat?court_id=${court.court_id}`}>
          <button className="bg-main w-full text-white rounded-md px-4 py-2 text-[12px] cursor-pointer">
            채팅방 생성하기
          </button>
        </Link>
      </div>
    </div>
  );
}

function Footer({ courtId }: { courtId: number | undefined }) {
  const router = useRouter();

  // courtId 가 없으면 버튼 자체를 렌더링하지 않음
  if (!courtId) return null;

  return (
    <div className="mt-4 flex justify-end">
      <button
        className="text-gray-400 text-[9px] font-semibold"
        onClick={() => router.push(`/court-detail/${courtId}`)}
      >
        상세정보 &gt;
      </button>
    </div>
  );
}
