import { authOptions } from "@/lib/auth";
import { BlogAdd } from "@/lib/feature/Blogs/BlogsAdd";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Blogs | Add blogs",
  description: "Blogs",
};

export default async function BlogAddPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin");
  }
  return (
    <div className="flex justify-center">
      <div className="w-[94vw] md:w-[90vw] lg:w-[80vw] max-w-[1920px] mx-auto">
        <BlogAdd />
      </div>
    </div>
  );
}
