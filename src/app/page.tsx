import Image from "next/image";
import logo from "@/assets/root/logo.svg";
import LandingBtn from "@/_components/home/LandingBtn";

export default function Home() {
  return (
    <div className="flex flex-col p-5 min-h-screen justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        {/* 로고 이미지 */}
        <Image src={logo} alt="logo" width={154} height={196} />

        {/* 서비스 소개말 */}
        <div>
          <p className="text-center">
            내 주변 <span className="text-main font-semibold">테니스장</span>을
            지도에서 한눈에! <br /> 같이 칠 사람은 실시간{" "}
            <span className="text-main font-semibold">채팅</span>으로 찾고,{" "}
            <br /> 자주 가는 코트는{" "}
            <span className="text-main font-semibold">즐겨찾기</span>로
            관리하세요
          </p>
          <p className="font-semibold mt-2">
            위치 기반 테니스 커뮤니티 플랫폼, 라켓톡
          </p>
        </div>
      </div>

      {/* 로그인 및 회원가입 버튼 */}
      <LandingBtn />
    </div>
  );
}
