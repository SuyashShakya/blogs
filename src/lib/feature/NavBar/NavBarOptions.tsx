"use client";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { customtoast } from "@/components/ui/toast";
import { Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavBarOptions = () => {
  const pathname = usePathname();

  const { data } = useSession();

  if (data?.user?.name) {
    return (
      <Popover>
        <PopoverTrigger>
          <div className="flex items-center gap-4">
            {data?.user?.name} <Menu size={20} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col w-52 gap-4">
          <Link href="/blog/add">
            <p className="text-sm cursor-pointer">Create new blog</p>
          </Link>
          <Link
            href={
              pathname.includes("unpublished-blog")
                ? "/"
                : "/blog/unpublished-blog"
            }
          >
            <p className="text-sm cursor-pointer">
              {pathname.includes("unpublished-blog")
                ? "Blogs"
                : "Unpublished blogs"}
            </p>
          </Link>
          <p
            className="text-sm cursor-pointer"
            onClick={() =>
              signOut()
                .then(() =>
                  customtoast({
                    message: "User logged out!!!",
                    type: "success",
                  })
                )
                .catch(() =>
                  customtoast({
                    message: "Something went wrong!!!",
                    type: "error",
                  })
                )
            }
          >
            Logout
          </p>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Link href="/signin">
      <Button>Sign in</Button>
    </Link>
  );
};
