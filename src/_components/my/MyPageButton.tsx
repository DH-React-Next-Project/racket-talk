type MyPageButtonProps = {
  text: string;
  onClick?: () => void;
};

const MyPageButton = ({ text, onClick }: MyPageButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="mx-2 bg-white text-sm text-black w-[106px] h-[36px] rounded-lg hover:bg-main hover:text-white"
    >
      {text}
    </button>
  );
};

export default MyPageButton;