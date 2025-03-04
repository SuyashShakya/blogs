"use client";

import { formatDate } from "@/lib/utils";
import { getPost } from "@/utils/apiFunctions";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

export const BlogDetails = () => {
  const params = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["post"],
    queryFn: () => getPost(params?.id as string),
  });

  if (isLoading) {
    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />;
  }

  return (
    <>
      <div className="flex h-[50px] p-4 gap-4">
        <Link href="/">
          <ArrowLeft className="cursor-pointer" />
        </Link>
        <p className="text-xl font-medium">Blog Details</p>
      </div>
      <div className="flex flex-col gap-4 mt-8">
        <Image
          src={data?.post?.image}
          alt="blog image"
          height={500}
          width={500}
        />
        <div>
          <p className="text-2xl">{data?.post?.title}</p>
          <p>Author name: {data?.post?.author?.name}</p>
          <p className="text-text_secondary text-sm text-left">
            Published on {formatDate(data?.post?.updatedAt)}
          </p>
          <div className="flex gap-2 items-center">
            {data?.post?.tags?.map((item: { id: string; name: string }) => {
              return (
                <div
                  key={item?.id}
                  className="p-1 w-fit border-2 border-gray rounded-lg"
                >
                  {item?.name}
                </div>
              );
            })}
          </div>
        </div>
        <ReactMarkdown>{data?.post?.content}</ReactMarkdown>
      </div>
    </>
  );
};
