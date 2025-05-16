const MyPageButton = (props: any) => {
  return (
    <button
      onClick={props.onClick}
      className="mx-2 bg-white text-sm text-black w-[106px] h-[36px] rounded-lg hover:bg-main hover:text-white"
    >
      {props.text}
    </button>
  );
};

export default MyPageButton;