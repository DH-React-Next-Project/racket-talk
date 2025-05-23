import { useState } from "react";
import Image from "next/image";
import pointIcon from '@/assets/courts/puplePointIcon.svg';
import penIcon from '@/assets/courts/pen.svg';

type Props = {
  courtName: string;
  address: string;
  onClose: () => void;
  onConfirm: (memo: string) => void;
  onCancel: () => void;
};

export default function FavoriteModal({ courtName, address, onClose, onConfirm, onCancel }: Props) {
  const [memo, setMemo] = useState("");

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

        {/* 메모 영역 */}
        <div className="rounded-lg p-3 bg-gray-50 h-[140px]">
          <p className="text-sm font-semibold mb-1 flex items-center gap-1">
            <Image src={penIcon} alt="메모" width={12} height={12} />
            메모
          </p>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full h-[80px] text-sm bg-transparent outline-none resize-none"
            placeholder="메모를 작성해주세요."
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-between">
          <button
            onClick={() => onConfirm(memo)}
            className="bg-[#F6F6F6] text-black px-6 py-2 rounded-lg w-[100px] hover:bg-main hover:text-white"
          >
            저장
          </button>
          <button
            onClick={onCancel}
            className="bg-[#F6F6F6] text-black px-6 py-2 rounded-lg w-[100px] hover:bg-main hover:text-white"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}