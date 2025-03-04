"use client";

import { getPost } from "@/utils/apiFunctions";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const BlogDetails = () => {
  const params = useParams();
  console.log("hello", params?.id);
  const { data, isLoading } = useQuery({
    queryKey: ["post"],
    queryFn: () => getPost(params?.id as string),
  });

  console.log("hello", data);

  if (isLoading) {
    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />;
  }

  return (
    <>
      <div className="w-full">
        <p className="text-2xl font-semibold "></p>
      </div>
      <div className="flex mb-16">
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-flow-row gap-8">
          gg
        </div>
      </div>
    </>
  );
};
