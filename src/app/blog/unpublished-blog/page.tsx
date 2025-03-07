import { BlogList } from "@/lib/feature/Blogs/BlogList";
import NavBar from "@/lib/feature/NavBar/NavBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Blogs ",
};

export default async function UnpublishedBlogsPage() {
  return (
    <div className="flex justify-center">
      <div className="w-[94vw] md:w-[90vw] lg:w-[80vw] max-w-[1920px] mx-auto">
        <NavBar title="Unpublished Blogs" />
        <BlogList />
      </div>
    </div>
  );
}
