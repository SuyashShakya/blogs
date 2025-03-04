"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { customtoast } from "@/components/ui/toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async () => {
    setIsLoading(true);
    const loginData = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    if (loginData?.error) {
      setIsLoading(false);
      customtoast({ message: "Something went wrong", type: "error" });
    } else {
      setIsLoading(false);
      router?.replace("/");
      customtoast({ message: "User logged in successfully", type: "success" });
    }
  };

  const googleLoginHandler = async () => {
    await signIn("google", {
      callbackUrl: process.env.NEXT_PUBLIC_HOST,
    });
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign in</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <PasswordInput
                id="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full hover:bg-black-500"
              onClick={loginHandler}
            >
              {isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign in
            </Button>
            <p className="text-center">Or</p>
            <div className="flex justify-center">
              <div
                className="p-2 items-center rounded-lg flex justify-center gap-4 border border-gray-300 w-fit cursor-pointer"
                onClick={googleLoginHandler}
              >
                <Image src="/google.svg" alt="google" height={25} width={25} />
                <p className="text-sm">Sign in with google</p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
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
export default Signin;
