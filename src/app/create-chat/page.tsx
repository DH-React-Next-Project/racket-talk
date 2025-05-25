import { headers } from "next/headers";
import Header from "@/_components/layouts/Header";
import CreateChatForm from "@/_components/createChat/CreateChatForm";

interface Props {
  searchParams: {
    court_id?: string;
  };
}

const CreateChatPage = async ({ searchParams }: Props) => {
  const host = headers().get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(
    `${protocol}://${host}/api/court/${searchParams.court_id}`
  );

  const data = await res.json();

  const courtDetail = await fetch(
    `${protocol}://${host}/api/court-detail/${searchParams.court_id}`
  );

  const courtDetailData = await courtDetail.json();

  return (
    <div className="overflow-y-auto pb-32">
      <Header />
      <CreateChatForm data={data} courtDetailData={courtDetailData} />
    </div>
  );
};

export default CreateChatPage;
