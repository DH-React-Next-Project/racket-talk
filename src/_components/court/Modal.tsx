import React, {PropsWithChildren} from "react";

interface ModalDefaultType {
    onClickToggleModal: () => void;
}

function Modal({
                   onClickToggleModal,
                   children,
               }: PropsWithChildren<ModalDefaultType>) {
    return (
        <div className="w-[305px] h-[257px] flex items-center justify-center fixed rounded-md translate-y-[50px]">
            <dialog
                className="w-[305px] h-[257px] flex flex-col items-center border-none rounded-[10px] shadow-[0_0_30px_rgba(30,30,30,0.185)] bg-white z-[10000]">
                {children}
            </dialog>
            <div
                className="w-full h-full fixed inset-0 bg-black/50 z-[9999]"
                onClick={(e: React.MouseEvent) => {
                    e.preventDefault();

                    if (onClickToggleModal) {
                        onClickToggleModal();
                    }
                }}
            />
        </div>
    );
}

export default Modal;