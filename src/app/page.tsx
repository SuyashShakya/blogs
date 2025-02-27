import { getServerSession } from "next-auth";

export default async function Home() {
  const data = await getServerSession();
  console.log("hello", data);
  return <div>hello</div>;
}
