"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import { getPosts } from "@/utils/apiFunctions";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import isEmpty from "lodash/isEmpty";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import { useState } from "react";
// import { useState } from "react";

export const BlogList = () => {
  const [open, setOpen] = useState(false);
  // const [page, setPage] = useState(1);
  // const limit = 1;

  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  if (isLoading) {
    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />;
  }
  return (
    <>
      <div className="flex mb-16">
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-flow-row gap-8">
          {!isEmpty(data?.posts) ? (
            data?.posts?.map((item) => (
              <div
                className="border-box relative group duration-300 ease-in-out hover:shadow-lg flex flex-col p-4 gap-4 w-full min-w-[300px] min-h-[360px] rounded-lg transition transform hover:scale-105  hover:filter hover:grayscale"
                key={item?.sys?.id}
              >
                <Link href={`/blog/${item?.id}`}>
                  <Button className="absolute top-[30%] left-[50%] translate-x-[-50%] translate-y-[-50% opacity-0 group-hover:opacity-100 transition bg-white text-secondary hover:bg-white text-black">
                    Read More
                  </Button>
                </Link>
                <div className="flex flex-col gap-4">
                  <Image
                    className="object-cover w-full h-[200px] rounded-lg"
                    src={item?.image}
                    alt="offer"
                    width={0}
                    height={0}
                    priority
                    sizes="100vh"
                  />
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col gap-2">
                    <p className="text-mobile_xl md:text-xl text-left text-text_primary">
                      {item?.title}
                    </p>
                    <p className="text-text_secondary text-sm text-left">
                      Published on {formatDate(item?.updatedAt)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical
                        className="cursor-pointer"
                        onClick={(e) => {
                          alert("hello");
                        }}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xl font-semibold">No Blogs Found.</p>
          )}
        </div>
      </div>
    </>
  );
};
