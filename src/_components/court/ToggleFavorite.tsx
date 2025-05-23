import Image from "next/image";
import selected from "@/assets/courts/selected-favorite.svg"
import unselected from "@/assets/courts/unselected-favorite.svg"

const FavoriteToggle: React.FC<{ isFavorite: boolean }> = ({ isFavorite }) => {
  return (
    <div>
      <Image
        src={isFavorite ? selected : unselected}
        alt={isFavorite ? "Selected" : "Unselected"}
        width={20}
        height={20}
      />
    </div>
  );
};

export default FavoriteToggle;