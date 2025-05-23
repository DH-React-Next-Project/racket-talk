"use client";

import Image from "next/image";
import profile from "@/assets/my/tennis-bold.svg";
import starFilled from "@/assets/my/star-filled.svg";
import starOutline from "@/assets/my/star-outline.svg";
import MyPageButton from "@/_components/my/MyPageButton";
import ConfirmModal from "@/_components/my/ConfirmModal";
import FavoriteModal from "@/_components/court/FavoriteModal";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Court = {
  court_id: number;
  court_name: string;
  address: string | null;
  court_image: string | null;
  isFavorite: boolean;
};

const MyPage = () => {
  const [favorites, setFavorites] = useState<Court[]>([]);
  const [activeModal, setActiveModal] = useState<"logout" | "withdraw" | null>(null);
  const router = useRouter();
  const [user, setUser] = useState<{ nickname: string; email: string } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);
  const [selectedMemo, setSelectedMemo] = useState<string>("");

  useEffect(() => {
    const fetchMyPageData = async () => {
      const res = await fetch("/api/my", {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("마이페이지 정보 불러오기 실패");
        return;
      }

      const data = await res.json();
      setUser(data.user);
      setFavorites(data.favorites);
    };

    fetchMyPageData();
  }, []);

  // 즐겨찾기 별 선택
  const toggleFavorite = async (courtId: number) => {
    const res = await fetch(`/api/my/${courtId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.ok) {
      setFavorites((prev) =>
        prev.filter((court) => court.court_id !== courtId)
      );
    } else {
      console.error("즐겨찾기 삭제 실패");
    }
  };

  const handleClickFavorite = async (courtId: number) => {
    try {
      const res = await fetch(`/api/my/${courtId}`, {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("즐겨찾기 불러오기 실패");
        return;
      }

      const data = await res.json();
      setSelectedCourtId(courtId);
      setSelectedMemo(data.favorite_memo || "");
      setShowModal(true);
    } catch (err) {
      console.error("즐겨찾기 조회 오류:", err);
    }
  };

  return (
    <>
      <div className="bg-main text-white text-center py-4 text-xl font-bold">
        Racket Talk
      </div>

      <div className="bg-[#F6F6F6] w-[336px] h-[136px] rounded-[10px] mx-auto mt-10 flex flex-col justify-between px-4 py-2">
        <div className="flex mt-2">
          <div className="flex items-center justify-center mr-4">
            <Image src={profile} alt="profile" width={50} height={50} />
          </div>
          <div className="mt-2">
            <div className="text-[var(--color-charcoal)] font-semibold">
              {user?.nickname ?? "유저"} 님
            </div>
            <div className="text-[var(--color-lightGray)]">
              {user?.email ?? "이메일 정보 없음"}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <MyPageButton text="로그아웃" onClick={() => setActiveModal("logout")} />
          <MyPageButton text="회원탈퇴" onClick={() => setActiveModal("withdraw")} />

          {activeModal && (
            <ConfirmModal
              message={
                activeModal === "logout"
                  ? "정말 로그아웃 하시겠습니까?"
                  : "정말 탈퇴하시겠습니까?"
              }
              onConfirm={() => {
                setActiveModal(null);
                router.push("/"); // 실제 로그아웃/탈퇴 로직 추가 가능
              }}
              onCancel={() => setActiveModal(null)}
            />
          )}
        </div>
      </div>

      <div className="flex items-baseline px-4 mt-10 mb-2">
        <span className="text-lg font-semibold mr-2">즐겨찾기한 테니스장</span>
        <span className="text-sm text-gray-500">총 {favorites.length}개</span>
      </div>

      <div className="max-h-[623px] overflow-y-scroll pb-[80px]">
        {favorites.map((court) => (
          <div
            key={court.court_id}
            className="flex justify-between items-center px-4 py-3 border-b cursor-pointer"
            onClick={() => handleClickFavorite(court.court_id)}
          >
            <div className="flex items-center">
              <Image
                src={court.court_image ?? "/assets/my/sample.svg"}
                alt="테니스장"
                width={60}
                height={60}
                className="w-[60px] h-[60px] rounded-md mr-4 object-cover"
              />
              <div>
                <div className="font-semibold text-[15px]">{court.court_name}</div>
                <div className="text-gray-500 text-sm">{court.address}</div>
              </div>
            </div>

            <Image
              src={court.isFavorite ? starFilled : starOutline}
              alt="즐겨찾기"
              width={24}
              height={24}
              onClick={(e) => {
                e.stopPropagation(); // 이벤트 전파 방지
                toggleFavorite(court.court_id);
              }}
              className="cursor-pointer"
            />
          </div>
        ))}
      </div>

      {showModal && selectedCourtId !== null && (
        <FavoriteModal
          courtName={
            favorites.find((court) => court.court_id === selectedCourtId)?.court_name ?? ""
          }
          address={
            favorites.find((court) => court.court_id === selectedCourtId)?.address ?? ""
          }
          initialMemo={selectedMemo}
          mode="edit"
          onClose={() => setShowModal(false)}
          onUpdate={async (newMemo) => {
            await fetch(`/api/my/${selectedCourtId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ favorite_memo: newMemo }),
              credentials: "include",
            });
            setFavorites((prev) =>
              prev.map((c) =>
                c.court_id === selectedCourtId
                  ? { ...c, isFavorite: true } // 메모 갱신할 수도 있음
                  : c
              )
            );
            setSelectedMemo(newMemo);
            setShowModal(false);
          }}
          onDelete={async () => {
            await fetch(`/api/my/${selectedCourtId}`, {
              method: "DELETE",
              credentials: "include",
            });
            setFavorites((prev) =>
              prev.filter((court) => court.court_id !== selectedCourtId)
            );
            setShowModal(false);
          }}
          onAdd={() => { }} // 사용하지 않으므로 빈 함수
        />
      )}
    </>
  );
};

export default MyPage;