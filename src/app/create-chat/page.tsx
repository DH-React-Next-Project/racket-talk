import { headers } from "next/headers";
import Header from "@/_components/layouts/Header";
import CreateChatForm from "@/_components/createChat/CreateChatForm";

interface Props {
  searchParams: Promise<{
    court_id?: string;
  }>;
}

const CreateChatPage = async ({ searchParams }: Props) => {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const { court_id } = await searchParams;

  const res = await fetch(`${protocol}://${host}/api/court/${court_id}`);

  const data = await res.json();

  const courtDetail = await fetch(
    `${protocol}://${host}/api/court-detail/${court_id}`
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
