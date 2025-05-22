import React, { PropsWithChildren } from "react";

interface ModalProps {
    onClickToggleModal: () => void;
}

function Modal({
                   onClickToggleModal,
                   children,
               }: PropsWithChildren<ModalProps>) {
    /**
     * e.currentTarget → <div className="fixed …">  (오버레이 자신)
     * e.target        → 실제 클릭된 DOM 노드
     * 둘이 같으면 “오버레이 영역”을 클릭한 것 → 모달 닫기
     */
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.currentTarget === e.target) {
            onClickToggleModal();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
            onClick={handleBackdropClick}
            role="presentation"
        >
            <div
                /* ref 불필요 – 오버레이 vs 타깃 비교만으로 충분 */
                className="w-[305px] flex flex-col items-center rounded-[10px] shadow-lg bg-white"
                role="dialog"
                aria-modal="true"
            >
                {children}
            </div>
        </div>
    );
}

export default Modal;
