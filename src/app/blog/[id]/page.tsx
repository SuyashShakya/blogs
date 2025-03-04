// "use client";

import { BlogDetails } from "@/lib/feature/Blogs/BlogDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs | Blog Details",
  description: "Blogs",
};

export default function BlogDetailsPage() {
  return (
    <div className="flex justify-center">
      <div className="w-[94vw] md:w-[90vw] lg:w-[80vw] max-w-[1920px] mx-auto">
        <BlogDetails />
      </div>
    </div>
  );
}
