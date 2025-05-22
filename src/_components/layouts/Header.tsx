"use client";

import Image from "next/image";
import logo from "@/assets/layouts/logo.svg";
import { useRouter } from "next/navigation";
import backIcon from "@/assets/chat/back-icon.svg";
import chatOut from "@/assets/chat/chat-out.svg";

interface HeaderProps {
    onBackButtonClick?: () => void;
    onOutButtonClick?: () => void;
    showButton?: boolean;
}

const Header = ({onBackButtonClick, onOutButtonClick, showButton}: HeaderProps) => {
    const router = useRouter();
    let imgClass: string;
    if (showButton) {
        imgClass = "w-8 h-8";
    } else {
        imgClass = "w-8 h-8 hidden";
    }
    return (
        <div className="items-center h-20 border-b-[2px] border-main flex justify-between">
            <button className="mx-4" onClick={onBackButtonClick}>
                <Image className={imgClass} src={backIcon} alt={"뒤로가기"} />
            </button>
            <Image
                src={logo}
                alt="로고"
                width={140}
                height={140}
                onClick={() => router.push("/map")}
            />
            <button className="mx-4" onClick={onOutButtonClick}>
                <Image className={imgClass} src={chatOut} alt={"채팅방 나가기"} />
            </button>
        </div>
    );
};
export default Header;