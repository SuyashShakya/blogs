"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";

import { PasswordInput } from "@/components/ui/password-input";
import { createUser } from "@/utils/apiFunctions";
import { userSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { customtoast } from "@/components/ui/toast";
import { z } from "zod";

interface User {
  name: string;
  password: string;
  email: string;
  confirmPassword: string;
}
const Signup = () => {
  const router = useRouter();

  const { mutate: createUserMutation, isPending: createUserPending } =
    useMutation({
      mutationFn: createUser,
      onSuccess: (res) => {
        customtoast({ message: res?.data?.message, type: "success" });
        router.push("/signin");
      },
      onError: (error: { response: { data: { message: string } } }) => {
        customtoast({ message: error?.response?.data?.message, type: "error" });
      },
    });

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

  const signupHandler = async (data: User) => {
    createUserMutation({
      email: data.email,
      password: data.password,
      name: data.name,
    });
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <form
          className="mx-auto grid w-[350px] gap-6"
          onSubmit={handleSubmit(signupHandler)}
        >
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign up</h1>
            <p className="text-balance text-muted-foreground">
              Fill the form below to register your email
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your Name"
                {...register("name")}
              />
              {!!errors?.name?.message && (
                <p className="text-red-500 text-xs">{errors.name?.message}</p>
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

              <PasswordInput id="password" required {...register("password")} />

              {!!errors?.password?.message && (
                <p className="text-red-500 text-xs">
                  {errors.password?.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Confirm Password</Label>

              <PasswordInput
                id="confirmPassword"
                required
                {...register("confirmPassword")}
              />
              {!!errors?.confirmPassword?.message && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword?.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full hover:bg-black-500">
              {createUserPending && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign up
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/signin" className="underline">
                Sign in
              </Link>
            </div>
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
