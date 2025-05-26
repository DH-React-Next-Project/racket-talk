"use client";

import Image from "next/image";
import logo from "@/assets/layouts/logo.svg";
import { useRouter } from "next/navigation";
import backIcon from "@/assets/chat/back-icon.svg";
import chatOut from "@/assets/chat/chat-out.svg";

interface HeaderProps {
    showBackButton?: boolean;
    onOutButtonClick?: () => void;
    showOutButton?: boolean;
}

const Header = ({showBackButton, onOutButtonClick, showOutButton}: HeaderProps) => {
    const router = useRouter();
    let backImgClass: string;
    let outImgClass: string;
    if (showBackButton) {
        backImgClass = "w-8 h-8";
    } else {
        backImgClass = "w-8 h-8 hidden";
    }
    if (showOutButton) {
        outImgClass = "w-8 h-8";
    } else {
        outImgClass = "w-8 h-8 hidden";
    }
    const onBackButtonClick = () => {
        window.history.back();
    };
    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white flex justify-center">
            <div className="w-full max-w-[600px] items-center h-20 border-b-[2px] border-main flex justify-between">
                <button className="mx-4" onClick={onBackButtonClick}>
                    <Image className={backImgClass} src={backIcon} alt={"뒤로가기"} />
                </button>
                <Image
                    src={logo}
                    alt="로고"
                    width={140}
                    height={140}
                    onClick={() => router.push("/map")}
                />
                <button className="mx-4" onClick={onOutButtonClick}>
                    <Image className={outImgClass} src={chatOut} alt={"채팅방 나가기"} />
                </button>
            </div>
        </div>
    );
};
export default Header;