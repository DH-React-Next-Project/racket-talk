"use client";

type ConfirmModalProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/10 z-50 flex justify-center items-center"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="bg-white rounded-lg p-6 w-[300px] text-center shadow-lg z-50"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      ><p className="text-lg font-semibold mb-6">{message}</p>
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
    </div>
  );
}