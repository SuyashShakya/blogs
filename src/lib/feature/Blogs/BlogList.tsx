"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { customtoast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";
import { deletePost, getPosts } from "@/utils/apiFunctions";
import { sessions } from "@/utils/types";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import isEmpty from "lodash/isEmpty";
import { EllipsisVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import Link from "next/link";
// import { useState } from "react";

interface Blog {
  id: string;
  image: string;
  updatedAt: Date;
  title: string;
  tags: {
    id: string;
    name: string;
  }[];
  authorId: string;
  author: {
    name: string;
  };
}

export const BlogList = () => {
  const session = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  const queryClient = useQueryClient();

  if (isLoading) {
    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />;
  }

  const { mutate: deletePostMutation, isPending: deletePostPending } =
    useMutation({
      mutationFn: deletePost,
      onSuccess: (res) => {
        customtoast({ message: res?.data?.message, type: "success" });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
      onError: (error: { response: { data: { message: string } } }) => {
        customtoast({ message: error?.response?.data?.message, type: "error" });
      },
    });
  const onDelete = (id: string) => {
    deletePostMutation(id);
  };

  return (
    <>
      <div className="flex mb-16">
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-flow-row gap-8">
          {!isEmpty(data?.posts) ? (
            data?.posts?.map((item: Blog) => (
              <div
                className="border-box relative group duration-300 ease-in-out hover:shadow-lg flex flex-col p-4 gap-4 w-full min-w-[300px] min-h-[360px] rounded-lg transition transform hover:scale-105  hover:filter hover:grayscale"
                key={item?.id}
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
                    <div>
                      <p className="text-text_secondary text-sm text-left">
                        Author name: {item?.author?.name}
                      </p>
                      <p className="text-text_secondary text-sm text-left">
                        Published on {formatDate(item?.updatedAt)}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      {item?.tags?.map((item) => {
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
                  {(session?.data as unknown as sessions)?.user?.id ===
                    item?.authorId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="outline-none">
                        <EllipsisVertical className="cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Dialog>
                            <DialogTrigger onClick={(e) => e.stopPropagation()}>
                              Delete
                            </DialogTrigger>
                            <DialogContent>
                              <DialogTitle>Delete Blog</DialogTitle>
                              <DialogDescription className="text-xl">
                                Are you sure you want to delete this blog?
                              </DialogDescription>

                              <div className="flex justify-end">
                                <Button
                                  className="w-fit"
                                  onClick={() => onDelete(item?.id)}
                                >
                                  {deletePostPending && (
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                  )}
                                  Confirm
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuItem>
                        <Link href={`/blog/add?id=${item?.id}`}>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
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
