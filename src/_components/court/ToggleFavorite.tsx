import { useState } from "react";
import Image from "next/image";
import selected from "@/assets/courts/selected-favorite.svg"
import unselected from "@/assets/courts/unselected-favorite.svg"

const FavoriteToggle: React.FC = () => {
    const [isToggle, setIsToggle] = useState(false); // 올바른 위치: Hook 컴포넌트 내부

    return (
        <div onClick={() => setIsToggle((prev) => !prev)}>
            {isToggle ? (
                <Image src={selected} alt="Selected" width={20} height={20} />
            ) : (
                <Image src={unselected} alt="Unselected" width={20} height={20} />
            )}
        </div>
    );
};

export default FavoriteToggle;