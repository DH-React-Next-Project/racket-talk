import { useState } from "react";
import Image from "next/image";
import pointIcon from '@/assets/courts/puplePointIcon.svg';
import penIcon from '@/assets/courts/pen.svg';

type Props = {
  courtName: string;
  address: string;
  initialMemo: string;
  onClose: () => void;
  onUpdate: (memo: string) => void;
  onDelete: () => void;
  onAdd: (memo: string) => void;
  mode: "add" | "edit";
};

export default function FavoriteModal({
  courtName,
  address,
  initialMemo,
  onClose,
  onUpdate,
  onDelete,
  onAdd,
  mode,
}: Props) {
  const [editMode, setEditMode] = useState(mode === "add"); // add 모드는 자동으로 편집 상태
  const [memo, setMemo] = useState(initialMemo);

  return (
    <div className="fixed inset-0 bg-black/10 z-50 flex justify-center items-center" role="presentation">
      <div className="bg-white p-6 min-h-[320px] rounded-xl w-[360px] shadow-lg space-y-4" role="dialog" aria-modal="true">
        {/* 코트 정보 */}
        <div>
          <p className="font-bold text-sm flex items-center gap-1">
            <Image src={pointIcon} alt="위치" width={10} height={10} />
            {courtName}
          </p>
          <p className="text-[10px] text-gray-600 mt-1 ml-[9px]">
            {address || "주소 정보 없음"}
          </p>
        </div>

        {/* 메모 */}
        <div className="rounded-lg p-3 bg-white h-[140px] border border-main">
          <p className="text-sm font-semibold mb-1 flex items-center gap-1">
            <Image src={penIcon} alt="메모" width={12} height={12} />
            메모
          </p>
          {editMode ? (
            <textarea
              className="text-sm text-gray-700 w-full h-[90px] resize-none p-1 rounded outline-none border-none"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          ) : (
            <p className="text-sm text-gray-700">{memo || "메모 없음"}</p>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex justify-between">
          {mode === "add" ? (
            <>
              <button
                className="bg-gray-300 text-black px-4 py-1 rounded-md text-sm w-[48%] hover:bg-main hover:text-white"
                onClick={() => onAdd(memo)}
              >
                추가
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-1 rounded-md text-sm w-[48%] hover:bg-main hover:text-white"
                onClick={onClose}
              >
                취소
              </button>
            </>
          ) : editMode ? (
            <>
              <button
                className="bg-gray-300 text-black px-4 py-1 rounded-md text-sm w-[48%] hover:bg-main hover:text-white"
                onClick={() => {
                  onUpdate(memo);
                  setEditMode(false);
                }}
              >
                저장
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-1 rounded-md text-sm w-[48%] hover:bg-main hover:text-white"
                onClick={() => {
                  setMemo(initialMemo);
                  setEditMode(false);
                }}
              >
                취소
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-gray-300 text-black px-4 py-1 rounded-md text-sm w-[48%] hover:bg-main hover:text-white"
                onClick={() => setEditMode(true)}
              >
                편집
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-1 rounded-md text-sm w-[48%] hover:bg-main hover:text-white"
                onClick={onDelete}
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}