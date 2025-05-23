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

  return (
    <div>
      <Header />
      <CreateChatForm data={data} />
    </div>
  );
};

export default CreateChatPage;
