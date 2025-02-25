"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { createUser } from "@/utils/apiFunctions";
import { userSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface User {
  username: string;
  password: string;
  email: string;
  confirmPassword: string;
}
const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(
      z
        .object({
          ...userSchema,
          confirmPassword: z.string().min(1, "Confirm password is required"),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        })
    ),
  });

  const loginHandler = async (data: I) => {
    setIsLoading(true);
    const loginData = await createUser({
      email: data.email,
      password: data.password,
      username: data.username,
    });
    if (loginData?.error) {
      toast(loginData?.error);
    } else {
      setIsLoading(false);
      router?.push("/");
      toast("User Created");
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <form
          className="mx-auto grid w-[350px] gap-6"
          onSubmit={handleSubmit(loginHandler)}
        >
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign up</h1>
            <p className="text-balance text-muted-foreground">
              Fill the form below to register your email
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your Username"
                {...register("username")}
              />
              {!!errors?.username?.message && (
                <p className="text-red-500 text-xs">
                  {errors.username?.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                required
                {...register("email")}
              />
              {!!errors?.email?.message && (
                <p className="text-red-500 text-xs">{errors.email?.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Password</Label>
              <div className="relative w-full max-w-sm">
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              </div>
              {!!errors?.password?.message && (
                <p className="text-red-500 text-xs">
                  {errors.password?.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                {...register("confirmPassword")}
              />
              {!!errors?.confirmPassword?.message && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword?.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full hover:bg-black">
              {isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Register
            </Button>
          </div>
        </form>
      </div>

      <Image
        src="/register.webp"
        alt="Image"
        width="1920"
        height="1080"
        className="h-[100vh] w-full object-cover "
      />
    </div>
  );
};
export default Signup;
