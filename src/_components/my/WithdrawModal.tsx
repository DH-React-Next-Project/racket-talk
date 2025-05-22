"use client";

export default function WithdrawModal({ onConfirm, onCancel, }: {
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg p-6 w-[300px] text-center shadow-lg border z-10">
      <p className="text-lg font-semibold mb-6">정말 탈퇴 하시겠습니까?</p>
      <div className="flex justify-between">
        <button
          onClick={onConfirm}
          className="bg-[#F6F6F6] text-black px-6 py-2 rounded-lg w-[120px] hover:bg-main hover:text-white"
        >
          네
        </button>
        <button
          onClick={onCancel}
          className="bg-[#F6F6F6] text-black px-6 py-2 rounded-lg w-[120px] hover:bg-main hover:text-white"
        >
          아니요
        </button>
      </div>
    </div>
  );
}